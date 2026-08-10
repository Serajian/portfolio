import { pointer } from './pointer';
import { scrollState } from './scroll';

/* ═══════════════ SHADERS ═══════════════ */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}`;

/**
 * Domain-warped fbm: three layers of value noise where each one distorts the
 * next. Gives an endless, never-repeating plasma. `u_hue` is fed by the
 * section the visitor is on, so the background changes colour as they scroll.
 */
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hue;
uniform float u_scroll;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }

float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),
             mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}

float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; }
  return v;
}

vec3 hsl2rgb(vec3 c){
  vec3 rgb=clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
  return c.z + c.y*(rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;
  vec2 p=uv*1.55;
  p.y += u_scroll*1.4;
  float t=u_time*0.05;

  vec2 q=vec2(fbm(p+t), fbm(p+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p+1.7*q+vec2(1.7,9.2)+0.15*t), fbm(p+1.7*q+vec2(8.3,2.8)+0.126*t));
  float f=fbm(p+1.9*r);

  float h0=u_hue/360.0;
  vec3 c1=hsl2rgb(vec3(fract(h0),0.85,0.55));
  vec3 c2=hsl2rgb(vec3(fract(h0+0.17),0.80,0.48));
  vec3 col=mix(c1,c2,clamp(length(r),0.0,1.0));
  col *= smoothstep(0.05,1.05,f)*0.5;

  vec2 g=fract(gl_FragCoord.xy/38.0);
  float grid=smoothstep(0.965,1.0,max(g.x,g.y))*0.045;
  col += vec3(grid)*mix(vec3(0.55,0.68,1.0),c1,0.5);

  vec2 m=(u_mouse-0.5*u_res)/u_res.y;
  float d=length(uv-m);
  col += c1*exp(-d*4.2)*0.22;
  float ripple=(1.0-smoothstep(0.0,0.03,abs(d-mod(u_time*0.32,1.4))))*0.10;
  col += c1*ripple*(1.0-clamp(d,0.0,1.0));

  col *= 1.0-smoothstep(0.20,1.30,length(uv*vec2(0.78,1.0)));
  col += vec3(0.019,0.026,0.048);
  gl_FragColor=vec4(col,1.0);
}`;

/* ═══════════════ STATE ═══════════════ */

let gl: WebGLRenderingContext | null = null;
let glCanvas: HTMLCanvasElement | null = null;
const uniforms: Record<string, WebGLUniformLocation | null> = {};

let rainCanvas: HTMLCanvasElement | null = null;
let rainCtx: CanvasRenderingContext2D | null = null;
let rainW = 0;
let rainH = 0;

interface Column {
  x: number;
  y: number;
  speed: number;
  len: number;
}
let columns: Column[] = [];

const GLYPHS = '01{}<>[]#$&*+=/\\;:abdefgorstuvxyz';
const DPR = () => Math.min(window.devicePixelRatio || 1, 1.5);

let startTime = 0;
let hue = 186;
let frameCount = 0;

/* ═══════════════ INIT ═══════════════ */

function compile(context: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = context.createShader(type);
  if (!shader) return null;
  context.shaderSource(shader, src);
  context.compileShader(shader);
  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    console.warn('[bg] shader failed:', context.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function initGL(): void {
  glCanvas = document.getElementById('gl') as HTMLCanvasElement | null;
  if (!glCanvas) return;

  gl =
    (glCanvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    }) as WebGLRenderingContext | null) ??
    (glCanvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

  if (!gl) {
    document.body.classList.add('no-gl');
    return;
  }

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    gl = null;
    document.body.classList.add('no-gl');
    return;
  }

  const program = gl.createProgram();
  if (!program) {
    gl = null;
    document.body.classList.add('no-gl');
    return;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[bg] link failed:', gl.getProgramInfoLog(program));
    gl = null;
    document.body.classList.add('no-gl');
    return;
  }
  gl.useProgram(program);

  // one oversized triangle covers the viewport
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  (['u_res', 'u_time', 'u_mouse', 'u_hue', 'u_scroll'] as const).forEach((name) => {
    uniforms[name] = gl!.getUniformLocation(program, name);
  });
}

function initRain(): void {
  rainCanvas = document.getElementById('rain') as HTMLCanvasElement | null;
  rainCtx = rainCanvas?.getContext('2d') ?? null;
}

export function resizeBackground(): void {
  const d = DPR();

  if (gl && glCanvas) {
    glCanvas.width = window.innerWidth * d;
    glCanvas.height = window.innerHeight * d;
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.uniform2f(uniforms.u_res!, glCanvas.width, glCanvas.height);
  }

  if (rainCanvas && rainCtx) {
    const rd = Math.min(window.devicePixelRatio || 1, 2);
    rainW = window.innerWidth;
    rainH = window.innerHeight;
    rainCanvas.width = rainW * rd;
    rainCanvas.height = rainH * rd;
    rainCtx.setTransform(rd, 0, 0, rd, 0, 0);

    columns = Array.from({ length: Math.floor(rainW / 64) }, (_, i) => ({
      x: i * 64 + 22,
      y: Math.random() * -rainH,
      speed: 0.6 + Math.random() * 1.7,
      len: 6 + Math.floor(Math.random() * 13),
    }));
  }
}

export function initBackground(): void {
  startTime = performance.now();
  initGL();
  initRain();
  resizeBackground();
}

/* ═══════════════ FRAME ═══════════════ */

export function updateBackground(): void {
  const now = (performance.now() - startTime) / 1000;

  // reading a transitioning custom property is a style read, so sample it
  // a few times a second instead of every frame
  if (frameCount++ % 6 === 0) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--hue');
    const parsed = Number.parseFloat(raw);
    if (!Number.isNaN(parsed)) hue = parsed;
  }

  if (gl) {
    const d = DPR();
    gl.uniform1f(uniforms.u_time!, now);
    gl.uniform2f(uniforms.u_mouse!, pointer.sx * d, (window.innerHeight - pointer.sy) * d);
    gl.uniform1f(uniforms.u_hue!, hue);
    gl.uniform1f(uniforms.u_scroll!, scrollState.progress);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  if (!rainCtx) return;
  rainCtx.clearRect(0, 0, rainW, rainH);
  rainCtx.font = '11px ui-monospace,Menlo,monospace';

  columns.forEach((col) => {
    for (let i = 0; i < col.len; i++) {
      const y = col.y - i * 15;
      if (y < -20 || y > rainH + 20) continue;
      const alpha = (1 - i / col.len) * 0.2;
      rainCtx!.fillStyle =
        i === 0 ? `hsla(${hue},92%,78%,.55)` : `hsla(${hue},62%,72%,${alpha})`;
      rainCtx!.fillText(GLYPHS[(Math.floor(y / 15) + i * 7) % GLYPHS.length]!, col.x, y);
    }
    col.y += col.speed * 1.6;
    if (col.y - col.len * 15 > rainH) {
      col.y = -20;
      col.speed = 0.6 + Math.random() * 1.7;
      col.len = 6 + Math.floor(Math.random() * 13);
    }
  });
}
