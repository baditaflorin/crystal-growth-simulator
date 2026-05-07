const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-Cku7iOp2.js","assets/rolldown-runtime-S-ySWqyJ.js"])))=>i.map(i=>d[i]);
import{r as e}from"./rolldown-runtime-S-ySWqyJ.js";import{_ as t,a as n,b as r,c as i,d as a,f as o,g as s,h as c,i as l,l as u,m as d,n as f,o as p,p as m,r as h,s as g,t as _,u as v,v as y,y as b}from"./vendor-CMPvFfWO.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var x=e(r(),1),S=e(b(),1),C=class{context;gain;oscillator;filter;noiseSource;noiseGain;async start(){if(this.context){await this.context.resume();return}let e=new(window.AudioContext??window.webkitAudioContext),t=e.createGain();t.gain.value=1e-4,t.connect(e.destination);let n=e.createOscillator();n.type=`sine`,n.frequency.value=110;let r=e.createBiquadFilter();r.type=`bandpass`,r.frequency.value=440,r.Q.value=7;let i=e.createGain();i.gain.value=1e-4,n.connect(r),r.connect(t),this.createNoise(e).connect(i),i.connect(t),n.start(),t.gain.linearRampToValueAtTime(.045,e.currentTime+.2),this.context=e,this.gain=t,this.oscillator=n,this.filter=r,this.noiseGain=i}update(e){if(!this.context||!this.oscillator||!this.filter||!this.noiseGain)return;let t=this.context.currentTime,n=Math.min(1,e.growthRate*12),r=Math.min(1,e.coverage*3),i=.5+Math.sin(e.frame*.08)*.5;this.oscillator.frequency.setTargetAtTime(96+n*320+r*140,t,.05),this.filter.frequency.setTargetAtTime(260+n*2200,t,.08),this.filter.Q.setTargetAtTime(4+i*10,t,.12),this.noiseGain.gain.setTargetAtTime(.004+n*.045,t,.04)}async stop(){!this.context||!this.gain||(this.gain.gain.cancelScheduledValues(this.context.currentTime),this.gain.gain.linearRampToValueAtTime(1e-4,this.context.currentTime+.12),await new Promise(e=>window.setTimeout(e,140)),await this.context.suspend())}async dispose(){this.oscillator?.stop(),this.noiseSource?.stop(),await this.context?.close(),this.context=void 0}createNoise(e){let t=e.sampleRate*2,n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<t;e+=1)r[e]=Math.random()*2-1;let i=e.createBufferSource();return i.buffer=n,i.loop=!0,i.start(),this.noiseSource=i,i}},w=`modulepreload`,T=function(e){return`/crystal-growth-simulator/`+e},E={},D=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=T(t,n),t in E)return;E[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:w,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};async function O(e){let t=await D(()=>import(`./three-Cku7iOp2.js`).then(e=>e.t),__vite__mapDeps([0,1])),n=new t.WebGLRenderer({canvas:e,antialias:!0,alpha:!1,preserveDrawingBuffer:!0,powerPreference:`high-performance`});n.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.setClearColor(528671,1);let r=new t.Scene,i=new t.OrthographicCamera(-1,1,1,-1,.1,10);i.position.z=1;let a=new t.DataTexture(new Uint8Array([0,0,0,255]),1,1,t.RGBAFormat);a.colorSpace=t.SRGBColorSpace,a.minFilter=t.LinearFilter,a.magFilter=t.LinearFilter,a.wrapS=t.ClampToEdgeWrapping,a.wrapT=t.ClampToEdgeWrapping;let o=new t.ShaderMaterial({uniforms:{field:{value:a},vignette:{value:.42}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D field;
      uniform float vignette;
      varying vec2 vUv;
      void main() {
        vec3 color = texture2D(field, vUv).rgb;
        float radius = distance(vUv, vec2(0.5));
        float edge = smoothstep(0.82, 0.18, radius);
        float scan = 0.018 * sin(vUv.y * 900.0);
        gl_FragColor = vec4(color * mix(1.0 - vignette, 1.08, edge) + scan, 1.0);
      }
    `}),s=new t.PlaneGeometry(2,2),c=new t.Mesh(s,o);r.add(c);function l(){let t=e.getBoundingClientRect(),a=Math.max(1,Math.floor(t.width)),o=Math.max(1,Math.floor(t.height));n.setSize(a,o,!1),n.render(r,i)}return l(),{update(e){a.image={data:e.pixels,width:e.width,height:e.height},a.needsUpdate=!0,n.render(r,i)},resize:l,dispose(){s.dispose(),o.dispose(),a.dispose(),n.dispose()}}}var k={ice:{low:{r:6,g:15,b:29},mid:{r:64,g:213,b:224},high:{r:240,g:249,b:255},glow:{r:255,g:207,b:90}},ember:{low:{r:17,g:15,b:23},mid:{r:242,g:106,b:85},high:{r:255,g:222,b:138},glow:{r:79,g:216,b:196}},reef:{low:{r:8,g:18,b:24},mid:{r:106,g:213,b:119},high:{r:252,g:126,b:151},glow:{r:139,g:214,b:255}}};function A(e){return Math.min(1,Math.max(0,e))}function j(e,t,n){return e+(t-e)*n}function M(e,t,n){return{r:j(e.r,t.r,n),g:j(e.g,t.g,n),b:j(e.b,t.b,n)}}function N(e,t,n,r){let i=k[r],a=e<.52?M(i.low,i.mid,e/.52):M(i.mid,i.high,(e-.52)/.48),o=A((1-t)*e*1.7+Math.sin(n*.07)*.04),s=M(a,i.glow,o);return{r:Math.round(s.r),g:Math.round(s.g),b:Math.round(s.b),a:255}}function P(e){let{gridSize:t,seedRadius:n}=e,r=new Float32Array(t*t*4),i=(t-1)/2;for(let e=0;e<t;e+=1)for(let a=0;a<t;a+=1){let o=(e*t+a)*4,s=a-i,c=e-i,l=Math.sqrt(s*s+c*c),u=l<=n?1:Math.max(0,1-(l-n)/2);r[o]=u,r[o+1]=Math.max(.15,1-u*.45),r[o+2]=+(u>.2),r[o+3]=0}return r}function F(e,t){return e<0?t-1:e>=t?0:e}function I(e,t,n){return(F(t,n)*n+F(e,n))*4}function L(e,t,n){let r=e*12.9898+t*78.233+n*.173;return Math.sin(r)*43758.5453%1}function R(e){return Math.min(1,Math.max(0,e))}var ee=class{mode=`cpu`;field=new Float32Array;next=new Float32Array;pixels=new Uint8Array;frame=0;size=0;reset(e){this.size=e.gridSize,this.field=P(e),this.next=new Float32Array(this.field.length),this.pixels=new Uint8Array(this.size*this.size*4),this.frame=0}step(e){(this.size!==e.gridSize||this.field.length===0)&&this.reset(e);let t=this.size,n=0,r=0;for(let i=0;i<t;i+=1)for(let a=0;a<t;a+=1){let o=I(a,i,t),s=I(a-1,i,t),c=I(a+1,i,t),l=I(a,i-1,t),u=I(a,i+1,t),d=this.field[o],f=this.field[o+1],p=this.field[o+2],m=this.field[s]+this.field[c]+this.field[l]+this.field[u]-d*4,h=this.field[s+1]+this.field[c+1]+this.field[l+1]+this.field[u+1]-f*4,g=(this.field[c]-this.field[s])*.5,_=(this.field[u]-this.field[l])*.5,v=Math.atan2(_,g),y=1+e.anisotropy*Math.cos(e.symmetry*v),b=d*(1-d),x=d-.5+e.undercooling+(f-.52)*.72,S=(L(a,i,this.frame)-.5)*e.noise*(1-d),C=R(d+e.dt*e.mobility*(y*m+b*x+S)),w=Math.max(0,C-d),T=R(f+e.dt*(e.diffusion*h-w*.42));this.next[o]=C,this.next[o+1]=T,this.next[o+2]=p>0||C<.18?p+C*.03:this.frame,this.next[o+3]=0;let E=N(C,T,this.next[o+2],e.palette),D=(i*t+a)*4;this.pixels[D]=E.r,this.pixels[D+1]=E.g,this.pixels[D+2]=E.b,this.pixels[D+3]=E.a,C>.2&&(n+=1),r+=w}let i=this.field;return this.field=this.next,this.next=i,this.frame+=1,{width:t,height:t,pixels:this.pixels.slice(),metrics:{activeCells:n,growthRate:r,coverage:n/(t*t),frame:this.frame}}}dispose(){this.field=new Float32Array,this.next=new Float32Array,this.pixels=new Uint8Array}},z={ice:0,ember:1,reef:2},B=8,V=16,H=`
struct Params {
  width: f32,
  height: f32,
  dt: f32,
  anisotropy: f32,
  undercooling: f32,
  mobility: f32,
  diffusion: f32,
  noise: f32,
  symmetry: f32,
  time: f32,
  palette: f32,
  pad: f32,
}

@group(0) @binding(0) var<storage, read> stateIn: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> stateOut: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> colors: array<u32>;
@group(0) @binding(3) var<storage, read_write> stats: array<atomic<u32>>;
@group(0) @binding(4) var<uniform> params: Params;

fn wrapCoord(value: i32, size: i32) -> i32 {
  if (value < 0) {
    return size - 1;
  }
  if (value >= size) {
    return 0;
  }
  return value;
}

fn idx(x: i32, y: i32) -> u32 {
  let width = i32(params.width);
  let height = i32(params.height);
  return u32(wrapCoord(y, height) * width + wrapCoord(x, width));
}

fn hashNoise(x: f32, y: f32, t: f32) -> f32 {
  let n = sin(dot(vec3<f32>(x, y, t), vec3<f32>(12.9898, 78.233, 0.173))) * 43758.5453;
  return fract(n);
}

fn mix3(a: vec3<f32>, b: vec3<f32>, t: f32) -> vec3<f32> {
  return a + (b - a) * clamp(t, 0.0, 1.0);
}

fn paletteColor(phase: f32, nutrient: f32, age: f32) -> vec3<f32> {
  var low = vec3<f32>(0.024, 0.059, 0.114);
  var mid = vec3<f32>(0.25, 0.835, 0.878);
  var high = vec3<f32>(0.941, 0.976, 1.0);
  var glow = vec3<f32>(1.0, 0.812, 0.353);

  if (i32(params.palette) == 1) {
    low = vec3<f32>(0.067, 0.059, 0.09);
    mid = vec3<f32>(0.949, 0.416, 0.333);
    high = vec3<f32>(1.0, 0.871, 0.541);
    glow = vec3<f32>(0.31, 0.847, 0.769);
  }

  if (i32(params.palette) == 2) {
    low = vec3<f32>(0.031, 0.071, 0.094);
    mid = vec3<f32>(0.416, 0.835, 0.467);
    high = vec3<f32>(0.988, 0.494, 0.592);
    glow = vec3<f32>(0.545, 0.839, 1.0);
  }

  let base = select(
    mix3(low, mid, phase / 0.52),
    mix3(mid, high, (phase - 0.52) / 0.48),
    phase >= 0.52
  );
  let tip = clamp((1.0 - nutrient) * phase * 1.7 + sin(age * 0.07) * 0.04, 0.0, 1.0);
  return mix3(base, glow, tip);
}

fn packRgba(color: vec3<f32>) -> u32 {
  let r = u32(clamp(color.r, 0.0, 1.0) * 255.0);
  let g = u32(clamp(color.g, 0.0, 1.0) * 255.0);
  let b = u32(clamp(color.b, 0.0, 1.0) * 255.0);
  return r | (g << 8u) | (b << 16u) | (255u << 24u);
}

@compute @workgroup_size(${B}, ${B}, 1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let width = u32(params.width);
  let height = u32(params.height);
  if (id.x >= width || id.y >= height) {
    return;
  }

  let x = i32(id.x);
  let y = i32(id.y);
  let index = idx(x, y);
  let cell = stateIn[index];
  let left = stateIn[idx(x - 1, y)];
  let right = stateIn[idx(x + 1, y)];
  let up = stateIn[idx(x, y - 1)];
  let down = stateIn[idx(x, y + 1)];

  let phase = cell.x;
  let nutrient = cell.y;
  let age = cell.z;
  let lapPhase = left.x + right.x + up.x + down.x - phase * 4.0;
  let lapNutrient = left.y + right.y + up.y + down.y - nutrient * 4.0;
  let grad = vec2<f32>((right.x - left.x) * 0.5, (down.x - up.x) * 0.5);
  let angle = atan2(grad.y, grad.x);
  let anis = 1.0 + params.anisotropy * cos(params.symmetry * angle);
  let front = phase * (1.0 - phase);
  let drive = phase - 0.5 + params.undercooling + (nutrient - 0.52) * 0.72;
  let stochastic = (hashNoise(f32(x), f32(y), params.time) - 0.5) * params.noise * (1.0 - phase);
  let delta = params.dt * params.mobility * (anis * lapPhase + front * drive + stochastic);
  let nextPhase = clamp(phase + delta, 0.0, 1.0);
  let growth = max(0.0, nextPhase - phase);
  let nextNutrient = clamp(
    nutrient + params.dt * (params.diffusion * lapNutrient - growth * 0.42),
    0.0,
    1.0
  );
  let nextAge = select(age + nextPhase * 0.03, params.time, age <= 0.0 && nextPhase > 0.18);

  stateOut[index] = vec4<f32>(nextPhase, nextNutrient, nextAge, 0.0);
  colors[index] = packRgba(paletteColor(nextPhase, nextNutrient, nextAge));

  if (nextPhase > 0.2) {
    atomicAdd(&stats[0], 1u);
  }
  atomicAdd(&stats[1], u32(growth * 1000000.0));
}
`,te=class e{mode=`webgpu`;device;pipeline;paramsBuffer;statsBuffer;statsReadBuffer;colorBuffer;colorReadBuffer;stateBuffers=[];bindGroups=[];size=0;frame=0;ping=0;static isSupported(){return`gpu`in navigator&&!!navigator.gpu}static async create(){if(!e.isSupported())throw Error(`WebGPU is not available in this browser.`);let t=await navigator.gpu.requestAdapter({powerPreference:`high-performance`});if(!t)throw Error(`No WebGPU adapter was found.`);let n=await t.requestDevice(),r=new e;return r.device=n,r.pipeline=n.createComputePipeline({layout:`auto`,compute:{module:n.createShaderModule({code:H}),entryPoint:`main`}}),r}reset(e){if(!this.device||!this.pipeline)throw Error(`WebGPU engine is not initialized.`);this.disposeBuffers(),this.size=e.gridSize,this.frame=0,this.ping=0;let t=this.size*this.size*V,n=this.size*this.size*4,r=P(e);this.stateBuffers=[0,1].map(()=>this.device.createBuffer({size:t,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})),this.device.queue.writeBuffer(this.stateBuffers[0],0,r),this.device.queue.writeBuffer(this.stateBuffers[1],0,r),this.colorBuffer=this.device.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.colorReadBuffer=this.device.createBuffer({size:n,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.statsBuffer=this.device.createBuffer({size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.statsReadBuffer=this.device.createBuffer({size:16,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.paramsBuffer=this.device.createBuffer({size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroups=[0,1].map(e=>this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.stateBuffers[e]}},{binding:1,resource:{buffer:this.stateBuffers[1-e]}},{binding:2,resource:{buffer:this.colorBuffer}},{binding:3,resource:{buffer:this.statsBuffer}},{binding:4,resource:{buffer:this.paramsBuffer}}]}))}async step(e){(!this.device||!this.pipeline||!this.paramsBuffer||!this.colorBuffer||!this.colorReadBuffer||!this.statsBuffer||!this.statsReadBuffer)&&this.reset(e),this.size!==e.gridSize&&this.reset(e);let t=this.device,n=this.size*this.size*4,r=new Float32Array([this.size,this.size,e.dt,e.anisotropy,e.undercooling,e.mobility,e.diffusion,e.noise,e.symmetry,this.frame,z[e.palette],0]);t.queue.writeBuffer(this.paramsBuffer,0,r),t.queue.writeBuffer(this.statsBuffer,0,new Uint32Array([0,0,0,0]));let i=t.createCommandEncoder(),a=i.beginComputePass();a.setPipeline(this.pipeline),a.setBindGroup(0,this.bindGroups[this.ping]),a.dispatchWorkgroups(Math.ceil(this.size/B),Math.ceil(this.size/B)),a.end(),i.copyBufferToBuffer(this.colorBuffer,0,this.colorReadBuffer,0,n),i.copyBufferToBuffer(this.statsBuffer,0,this.statsReadBuffer,0,16),t.queue.submit([i.finish()]),await Promise.all([this.colorReadBuffer.mapAsync(GPUMapMode.READ),this.statsReadBuffer.mapAsync(GPUMapMode.READ)]);let o=new Uint8Array(this.colorReadBuffer.getMappedRange().slice(0)),s=new Uint32Array(this.statsReadBuffer.getMappedRange().slice(0));return this.colorReadBuffer.unmap(),this.statsReadBuffer.unmap(),this.frame+=1,this.ping=1-this.ping,{width:this.size,height:this.size,pixels:o,metrics:{activeCells:s[0],growthRate:s[1]/1e6,coverage:s[0]/(this.size*this.size),frame:this.frame}}}dispose(){this.disposeBuffers(),this.device?.destroy(),this.device=void 0}disposeBuffers(){for(let e of this.stateBuffers)e.destroy();this.paramsBuffer?.destroy(),this.statsBuffer?.destroy(),this.statsReadBuffer?.destroy(),this.colorBuffer?.destroy(),this.colorReadBuffer?.destroy(),this.stateBuffers=[],this.bindGroups=[],this.paramsBuffer=void 0,this.statsBuffer=void 0,this.statsReadBuffer=void 0,this.colorBuffer=void 0,this.colorReadBuffer=void 0}},U=[{id:`snowflake`,name:`Snowflake`,shortName:`Snow`,settings:{gridSize:384,dt:.42,anisotropy:.18,undercooling:.29,mobility:.74,diffusion:.24,noise:.018,symmetry:6,palette:`ice`,seedRadius:5}},{id:`dendrite`,name:`Dendritic crystal`,shortName:`Dendrite`,settings:{gridSize:384,dt:.38,anisotropy:.26,undercooling:.33,mobility:.82,diffusion:.18,noise:.012,symmetry:4,palette:`ember`,seedRadius:4}},{id:`coral`,name:`Coral mineral`,shortName:`Coral`,settings:{gridSize:384,dt:.36,anisotropy:.07,undercooling:.25,mobility:.68,diffusion:.11,noise:.09,symmetry:7,palette:`reef`,seedRadius:9}}],W=U[0];function G(e){return U.find(t=>t.id===e)??W}var K={version:`0.1.0`,commit:`5b3f4ee`,builtAt:`2026-05-07T22:58:16.007Z`,repoUrl:`https://github.com/baditaflorin/crystal-growth-simulator`,paypalUrl:`https://www.paypal.com/paypalme/florinbadita`},q=`crystal-growth-simulator:settings:v1`,ne=f([`ice`,`ember`,`reef`]),re=n({presetId:f([`snowflake`,`dendrite`,`coral`]),settings:n({gridSize:p([h(256),h(384),h(512)]),dt:l().min(.1).max(.8),anisotropy:l().min(0).max(.4),undercooling:l().min(.05).max(.5),mobility:l().min(.2).max(1.2),diffusion:l().min(.02).max(.5),noise:l().min(0).max(.16),symmetry:l().int().min(3).max(8),palette:ne,seedRadius:l().min(2).max(16)})});function ie(){if(typeof window>`u`)return{presetId:W.id,settings:W.settings};let e=window.localStorage.getItem(q);if(!e)return{presetId:W.id,settings:W.settings};let t;try{t=JSON.parse(e)}catch{return window.localStorage.removeItem(q),{presetId:W.id,settings:W.settings}}let n=re.safeParse(t);return n.success?n.data:(window.localStorage.removeItem(q),{presetId:W.id,settings:W.settings})}function J(e){window.localStorage.setItem(q,JSON.stringify(e))}function ae(e){return{presetId:e,settings:G(e).settings}}var Y=ie(),oe=g((e,t)=>({presetId:Y.presetId,settings:Y.settings,setPreset(t){let n=ae(t);J(n),e(n)},updateSettings(n){let r={presetId:t().presetId,settings:{...t().settings,...n}};J(r),e(r)}})),X=_(),Z={fps:0,activeCells:0,growthRate:0,coverage:0,frame:0};function se(e){return`${(e*100).toFixed(1)}%`}function ce(e){return new Intl.NumberFormat(`en-US`,{maximumFractionDigits:0}).format(e)}function le(){let{presetId:e,settings:n,setPreset:r,updateSettings:l}=oe(),f=(0,x.useRef)(null),p=(0,x.useRef)(null),h=(0,x.useRef)(null),g=(0,x.useRef)(null),_=(0,x.useRef)(n),b=(0,x.useRef)(null),S=(0,x.useRef)(!1),w=(0,x.useRef)(performance.now()),[T,E]=(0,x.useState)(!1),[D,k]=(0,x.useState)(!1),[A,j]=(0,x.useState)(!0),[M,N]=(0,x.useState)(`Ready`),[P,F]=(0,x.useState)(`pending`),[I,L]=(0,x.useState)(Z);(0,x.useEffect)(()=>{_.current=n},[n]),(0,x.useEffect)(()=>{function e(){p.current?.resize()}return window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[]),(0,x.useEffect)(()=>()=>{S.current=!1,b.current&&cancelAnimationFrame(b.current),p.current?.dispose(),h.current?.dispose(),g.current?.dispose()},[]);let R=(0,x.useCallback)(async()=>{if(!(!S.current||!h.current||!p.current))try{let e=await h.current.step(_.current),t=performance.now(),n=Math.max(1,t-w.current);w.current=t;let r={...e.metrics,fps:1e3/n};p.current.update(e),g.current?.update(r),L(r),b.current=requestAnimationFrame(R)}catch(e){S.current=!1,E(!1),N(e instanceof Error?e.message:`Simulation stopped`)}},[]),z=(0,x.useCallback)(async()=>{if(!f.current)throw Error(`Canvas is not mounted.`);if(p.current||=await O(f.current),!h.current)try{let e=await te.create();e.reset(_.current),h.current=e,F(`webgpu`)}catch(e){let t=new ee;t.reset(_.current),h.current=t,F(`cpu`),N((e instanceof Error,`CPU fallback active`))}g.current||=new C},[]),B=(0,x.useCallback)(async()=>{if(!(S.current||D)){k(!0),N(`Starting`);try{await z(),A&&await g.current?.start(),S.current=!0,E(!0),N(`Growing`),w.current=performance.now(),b.current=requestAnimationFrame(R)}catch(e){N(e instanceof Error?e.message:`Could not start`)}finally{k(!1)}}},[z,D,R,A]),V=(0,x.useCallback)(async()=>{S.current=!1,E(!1),N(`Paused`),b.current&&cancelAnimationFrame(b.current),await g.current?.stop()},[]),H=(0,x.useCallback)(()=>{h.current?.reset(_.current),L(Z),N(T?`Growing`:`Ready`)},[T]),W=(0,x.useCallback)(async()=>{let e=!A;j(e),!(!g.current||!T)&&(e?await g.current.start():await g.current.stop())},[T,A]),G=U.find(t=>t.id===e)??U[0];return(0,X.jsxs)(`main`,{className:`app-shell`,children:[(0,X.jsxs)(`header`,{className:`topbar`,children:[(0,X.jsxs)(`div`,{className:`brand`,children:[(0,X.jsx)(`span`,{className:`brand-mark`,"aria-hidden":`true`,children:(0,X.jsx)(a,{size:22})}),(0,X.jsxs)(`div`,{children:[(0,X.jsx)(`h1`,{children:`Crystal Growth Simulator`}),(0,X.jsx)(`span`,{children:G.name})]})]}),(0,X.jsxs)(`nav`,{className:`top-actions`,"aria-label":`Project links`,children:[(0,X.jsxs)(`a`,{href:K.repoUrl,target:`_blank`,rel:`noreferrer`,title:`Star on GitHub`,children:[(0,X.jsx)(t,{size:18}),(0,X.jsx)(`span`,{children:`Star`})]}),(0,X.jsxs)(`a`,{href:K.paypalUrl,target:`_blank`,rel:`noreferrer`,title:`Support with PayPal`,children:[(0,X.jsx)(s,{size:18}),(0,X.jsx)(`span`,{children:`Support`})]})]})]}),(0,X.jsxs)(`section`,{className:`workspace`,"aria-label":`Crystal growth workspace`,children:[(0,X.jsxs)(`div`,{className:`viewport`,children:[(0,X.jsx)(`canvas`,{ref:f,"aria-label":`Live crystal growth field`}),(0,X.jsxs)(`div`,{className:`viewport-hud`,"aria-live":`polite`,children:[(0,X.jsx)(`span`,{children:P===`pending`?`idle`:P}),(0,X.jsx)(`span`,{children:M})]})]}),(0,X.jsxs)(`aside`,{className:`control-panel`,"aria-label":`Simulation controls`,children:[(0,X.jsxs)(`div`,{className:`transport`,children:[(0,X.jsxs)(`button`,{className:`primary-button`,type:`button`,onClick:T?V:B,disabled:D,title:T?`Pause simulation`:`Start simulation`,children:[T?(0,X.jsx)(c,{size:18}):(0,X.jsx)(d,{size:18}),(0,X.jsx)(`span`,{children:T?`Pause`:D?`Starting`:`Start`})]}),(0,X.jsx)(`button`,{type:`button`,onClick:H,title:`Reset growth field`,children:(0,X.jsx)(m,{size:18})}),(0,X.jsx)(`button`,{type:`button`,onClick:W,title:`Toggle sonification`,children:A?(0,X.jsx)(u,{size:18}):(0,X.jsx)(i,{size:18})})]}),(0,X.jsx)(`div`,{className:`preset-tabs`,role:`tablist`,"aria-label":`Crystal presets`,children:U.map(t=>(0,X.jsx)(`button`,{type:`button`,role:`tab`,"aria-selected":t.id===e,className:t.id===e?`active`:``,onClick:()=>{r(t.id),window.setTimeout(H,0)},children:t.shortName},t.id))}),(0,X.jsxs)(`section`,{className:`metric-grid`,"aria-label":`Runtime metrics`,children:[(0,X.jsx)(Q,{icon:(0,X.jsx)(y,{size:16}),label:`FPS`,value:I.fps.toFixed(0)}),(0,X.jsx)(Q,{icon:(0,X.jsx)(v,{size:16}),label:`Growth`,value:I.growthRate.toFixed(3)}),(0,X.jsx)(Q,{label:`Cells`,value:ce(I.activeCells)}),(0,X.jsx)(Q,{label:`Coverage`,value:se(I.coverage)})]}),(0,X.jsxs)(`section`,{className:`sliders`,"aria-label":`Phase-field parameters`,children:[(0,X.jsxs)(`h2`,{children:[(0,X.jsx)(o,{size:16}),`Parameters`]}),(0,X.jsx)(ue,{label:`Resolution`,value:n.gridSize,onChange:e=>l({gridSize:Number(e)}),options:[{value:256,label:`256`},{value:384,label:`384`},{value:512,label:`512`}]}),(0,X.jsx)($,{label:`Anisotropy`,min:0,max:.4,step:.01,value:n.anisotropy,onChange:e=>l({anisotropy:e})}),(0,X.jsx)($,{label:`Undercooling`,min:.05,max:.5,step:.01,value:n.undercooling,onChange:e=>l({undercooling:e})}),(0,X.jsx)($,{label:`Diffusion`,min:.02,max:.5,step:.01,value:n.diffusion,onChange:e=>l({diffusion:e})}),(0,X.jsx)($,{label:`Mobility`,min:.2,max:1.2,step:.02,value:n.mobility,onChange:e=>l({mobility:e})}),(0,X.jsx)($,{label:`Noise`,min:0,max:.16,step:.005,value:n.noise,onChange:e=>l({noise:e})}),(0,X.jsx)($,{label:`Symmetry`,min:3,max:8,step:1,value:n.symmetry,onChange:e=>l({symmetry:Math.round(e)})})]})]})]}),(0,X.jsxs)(`footer`,{className:`footer`,children:[(0,X.jsxs)(`span`,{children:[`v`,K.version]}),(0,X.jsxs)(`span`,{children:[`commit `,K.commit]}),(0,X.jsx)(`span`,{children:new Date(K.builtAt).toLocaleDateString()}),(0,X.jsx)(`a`,{href:K.repoUrl,target:`_blank`,rel:`noreferrer`,children:`https://github.com/baditaflorin/crystal-growth-simulator`}),(0,X.jsx)(`a`,{href:K.paypalUrl,target:`_blank`,rel:`noreferrer`,children:`PayPal`})]})]})}function Q({icon:e,label:t,value:n}){return(0,X.jsxs)(`div`,{className:`metric`,children:[(0,X.jsxs)(`span`,{children:[e,t]}),(0,X.jsx)(`strong`,{children:n})]})}function $({label:e,min:t,max:n,step:r,value:i,onChange:a}){return(0,X.jsxs)(`label`,{className:`range-control`,children:[(0,X.jsxs)(`span`,{children:[e,(0,X.jsx)(`output`,{children:i.toFixed(r>=1?0:2)})]}),(0,X.jsx)(`input`,{type:`range`,min:t,max:n,step:r,value:i,onChange:e=>a(Number(e.currentTarget.value))})]})}function ue({label:e,value:t,options:n,onChange:r}){return(0,X.jsxs)(`label`,{className:`select-control`,children:[(0,X.jsx)(`span`,{children:e}),(0,X.jsx)(`select`,{value:t,onChange:e=>r(e.currentTarget.value),children:n.map(e=>(0,X.jsx)(`option`,{value:e.value,children:e.label},e.value))})]})}S.createRoot(document.getElementById(`root`)).render((0,X.jsx)(x.StrictMode,{children:(0,X.jsx)(le,{})}));
//# sourceMappingURL=index-D-cWMBqp.js.map