/**
 * Visits and CV downloads per day, read from Cloudflare's own request logs.
 *
 *   CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ZONE_ID=… node scripts/stats.mjs [days]
 *
 * Why Cloudflare and not the server: the CV PDF is cached at the edge, so
 * most downloads never reach nginx and its access log undercounts. Web
 * Analytics can't help either — it only counts HTML page views.
 *
 * The token needs Zone → Analytics → Read. The zone ID is on the domain's
 * Overview page in the dashboard; leave it out and the script looks it up,
 * which only works if the token can also read zones.
 *
 * How far back it can reach depends on the plan. The script asks Cloudflare
 * and clips the range, saying so, rather than failing on a long request.
 */

/* kept in step with src/data/site.ts and about.cv.href by hand */
const HOST = 'mohsenserajian.ir';
const CV_PATH = '/Mohsen-Serajian-Resume.pdf';

const API = 'https://api.cloudflare.com/client/v4';
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DAYS = Number(process.argv[2] ?? 7);

if (!TOKEN) {
  console.error('Set CLOUDFLARE_API_TOKEN (Zone → Analytics → Read) and re-run.');
  process.exit(1);
}
if (!Number.isInteger(DAYS) || DAYS < 1) {
  console.error(`Days must be a whole number above zero, got "${process.argv[2]}".`);
  process.exit(1);
}

async function request(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...init.headers },
  });
  const body = await res.json().catch(() => null);
  if (!body) throw new Error(`Cloudflare answered HTTP ${res.status} with no JSON body.`);
  return { res, body };
}

async function gql(query, variables) {
  const { res, body } = await request(`${API}/graphql`, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  });
  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join('\n'));
  if (!res.ok) throw new Error(`Cloudflare answered HTTP ${res.status}.`);
  return body.data;
}

async function zoneId() {
  if (process.env.CLOUDFLARE_ZONE_ID) return process.env.CLOUDFLARE_ZONE_ID;
  const { body } = await request(`${API}/zones?name=${HOST}`);
  const id = body.result?.[0]?.id;
  if (!id) {
    throw new Error(
      `Could not look up the zone for ${HOST} with this token. ` +
        'Copy the Zone ID from the dashboard and set CLOUDFLARE_ZONE_ID.',
    );
  }
  return id;
}

const SETTINGS = `
  query Settings($zoneTag: string) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        settings {
          httpRequestsAdaptiveGroups { enabled maxDuration maxPageSize notOlderThan }
        }
      }
    }
  }`;

/* one request per slice: all HTML-or-not traffic for visits, and the CV path
   split by status — a 200 is the whole file, a 206 is a PDF viewer fetching
   ranges of it, a 304 is a browser checking its own cached copy */
const slice = (limit) => `
  query Slice($zoneTag: string, $start: Time, $end: Time, $host: string, $cv: string) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        site: httpRequestsAdaptiveGroups(
          limit: ${limit}
          filter: { datetime_geq: $start, datetime_lt: $end, requestSource: "eyeball", clientRequestHTTPHost: $host }
        ) {
          sum { visits }
          avg { sampleInterval }
          dimensions { datetimeHour }
        }
        cv: httpRequestsAdaptiveGroups(
          limit: ${limit}
          filter: { datetime_geq: $start, datetime_lt: $end, requestSource: "eyeball", clientRequestHTTPHost: $host, clientRequestPath: $cv }
        ) {
          count
          avg { sampleInterval }
          dimensions { datetimeHour edgeResponseStatus }
        }
      }
    }
  }`;

async function main() {
  const zoneTag = await zoneId();

  const settings = (await gql(SETTINGS, { zoneTag })).viewer.zones[0]?.settings?.httpRequestsAdaptiveGroups;
  if (!settings?.enabled) {
    console.error(`Request analytics are not available for this zone on its current plan.`);
    process.exit(1);
  }

  const HOUR = 3600_000;
  const now = Date.now();
  const end = Math.floor(now / HOUR) * HOUR;
  /* a minute of slack: the reach is measured from when Cloudflare gets the query */
  const reach = now - settings.notOlderThan * 1000 + 60_000;
  const wanted = end - DAYS * 24 * HOUR;
  const start = Math.ceil(Math.max(wanted, reach) / HOUR) * HOUR;
  const step = Math.max(HOUR, Math.floor((settings.maxDuration * 1000) / HOUR) * HOUR);

  const days = new Map();
  const day = (hour) => {
    const key = hour.slice(0, 10);
    if (!days.has(key)) days.set(key, { visits: 0, full: 0, partial: 0 });
    return days.get(key);
  };
  let sampled = false;

  for (let from = start; from < end; from += step) {
    const to = Math.min(from + step, end);
    const data = await gql(slice(settings.maxPageSize), {
      zoneTag,
      start: new Date(from).toISOString(),
      end: new Date(to).toISOString(),
      host: HOST,
      cv: CV_PATH,
    });
    const zone = data.viewer.zones[0] ?? { site: [], cv: [] };

    for (const row of zone.site) {
      day(row.dimensions.datetimeHour).visits += row.sum.visits;
      if (row.avg.sampleInterval > 1) sampled = true;
    }
    for (const row of zone.cv) {
      const d = day(row.dimensions.datetimeHour);
      if (row.dimensions.edgeResponseStatus === 200) d.full += row.count;
      if (row.dimensions.edgeResponseStatus === 206) d.partial += row.count;
      if (row.avg.sampleInterval > 1) sampled = true;
    }
  }

  const covered = Math.round((end - start) / (24 * HOUR));
  console.log(`\n${HOST} — last ${covered} day${covered === 1 ? '' : 's'} (UTC)`);
  if (start > wanted) {
    console.log(`Cloudflare keeps about ${Math.floor(settings.notOlderThan / 86400)} days on this plan, so that is all there is.`);
  }

  const rows = [...days.entries()].sort(([a], [b]) => a.localeCompare(b));
  const total = rows.reduce(
    (t, [, d]) => ({ visits: t.visits + d.visits, full: t.full + d.full, partial: t.partial + d.partial }),
    { visits: 0, full: 0, partial: 0 },
  );

  const line = (label, d) =>
    `${label.padEnd(12)}${String(d.visits).padStart(8)}${String(d.full).padStart(14)}${String(d.partial).padStart(12)}`;

  console.log(`\n${'date'.padEnd(12)}${'visits'.padStart(8)}${'CV downloads'.padStart(14)}${'CV ranges'.padStart(12)}`);
  if (rows.length === 0) console.log('(no traffic in this range)');
  for (const [date, d] of rows) console.log(line(date, d));
  console.log(line('total', total));

  console.log(
    '\nCV downloads = the whole file served. CV ranges = chunks a PDF viewer asks for\n' +
      'while showing it in the browser — several per open, so not extra people.',
  );
  if (sampled) console.log('Some of these numbers are Cloudflare estimates from sampled traffic.');
}

/* a wrong token or zone is the usual failure: say what Cloudflare said, not a stack trace */
main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
