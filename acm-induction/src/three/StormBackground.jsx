import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

/* ============================================================
   STORM — full-page additive plasma orb background.
   Faithful port of the vanilla spec into a self-contained React
   component that mounts a fixed canvas behind all page content.
   Scroll dives the camera into the orb; the cursor sways parallax
   and carves a moving void into the cloud.
   ============================================================ */

function hexToVec3(hex) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
const Lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const CONFIG = {
  bgColor: '#1a0418',
  flameColor: '#ff2d6b',
  flameColor2: '#ffd36b',
  flameAmt: 0.13,
  atmoColor: '#ff7ab0',
  atmoCount: 300,
  atmoSize: 24,
  atmoSpeed: 1.0,
  coreColor: '#6a0a2a',
  midColor: '#ff2d6b',
  rimColor: '#ffd36b',
  opacity: 1.45,
  pointSize: 80,
  brightness: 1.15,
  spin: 0.03,
  blowUp: 0,
  repelRadius: 1.4,
  repelStrength: 4,
  scrollDive: 3,
  scrollGrow: 0.5,
  scrollSpin: 0.6,
  parallax: 0.7,
};

const LAYERS = { NONE: 0, TORUS_SCENE: 1, BLOOM_SCENE: 2, ENTIRE_SCENE: 3 };

const STORM_VERT = /* glsl */ `
uniform float uTime; uniform float uSize; uniform float uBlowUp;
uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
uniform vec3 uCore; uniform vec3 uMid; uniform vec3 uRim;
attribute float aScale; attribute float aNoise; attribute float aRadialPush; attribute float aMix;
varying vec3 vColor; varying float vBlowUp;
void main() {
  vec3 pos = position;

  float t = uTime * 1.4 + aNoise * 6.2831;
  float wobble = sin(t) * 0.1 * aRadialPush;
  pos *= 1.0 + wobble;

  float swirlAngle = uTime * 0.05 + aNoise * 6.2831;
  mat2 swirl = mat2(cos(swirlAngle), -sin(swirlAngle), sin(swirlAngle), cos(swirlAngle));
  pos.xz = swirl * pos.xz;

  vec3 outward = normalize(pos + vec3(0.0001));
  float blow = uBlowUp * uBlowUp;
  pos += outward * blow * (10.0 + aNoise * 18.0) * aRadialPush;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

  vec3 toParticle = modelPosition.xyz - uCursor;
  float dist = length(toParticle);
  float falloff = smoothstep(uRepelRadius, 0.0, dist);
  modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z);

  float t1 = smoothstep(0.25, 0.85, aMix);
  vec3 mix1 = mix(uCore, uMid, t1);
  float t2 = clamp((aMix - 0.7) * 3.0, 0.0, 1.0);
  vColor = mix(mix1, uRim, t2);
  vBlowUp = uBlowUp;
}
`;

const STORM_FRAG = /* glsl */ `
uniform float uOpacity; uniform float uBrightness;
varying vec3 vColor; varying float vBlowUp;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float strength = pow(1.0 - d * 2.0, 4.5);
  vec3 color = mix(vec3(0.0), vColor, strength);
  float blowFade = 1.0 - smoothstep(0.15, 1.0, vBlowUp);
  gl_FragColor = vec4(color * uBrightness, strength * uOpacity * blowFade);
}
`;

const ATMO_VERT = /* glsl */ `
attribute float size; attribute float seed; uniform float uTime; uniform vec2 uRes;
varying float vA;
vec3 warp(vec3 p, float t){ float c=0.9,a=1.9,b=0.02,s=0.05; p*=2.;
  p.x+=c*sin(s*t+a*p.y)+t*b; p.y+=c*cos(s*t+a*p.x); p.y+=c*sin(s*t+a*p.z)+t*b;
  p.z+=c*cos(s*t+a*p.y); p.z+=c*sin(s*t+a*p.x)+t*b; p.x+=c*cos(s*t+a*p.z);
  return cos(p+vec3(1,2,4)); }
void main(){
  vec3 v = position*4.0 + warp(position, uTime)*1.2;
  vec4 mv = modelViewMatrix * vec4(v, 1.0);
  float r = length(v); float farF = 1.0 - smoothstep(5.0, 6.5, r); float nearF = smoothstep(0.0, 0.5, -mv.z);
  vA = farF * nearF;
  gl_PointSize = size * uRes.y / 900.0 / -mv.z; gl_PointSize = max(gl_PointSize, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

const ATMO_FRAG = /* glsl */ `
uniform vec3 uColor; varying float vA;
void main(){ vec2 p = gl_PointCoord - 0.5; float l = length(p); if (l > 0.5) discard;
  float tex = smoothstep(0.5, 0.0, l); gl_FragColor = vec4(uColor * tex, tex * vA * 0.6); }
`;

const FINAL_FRAG = /* glsl */ `
uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
varying vec2 vUv;
vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
  pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
  pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
  pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
  return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
void main(){
  vec2 uv = 2.*vUv - 1.;
  vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
  vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
  flame *= smoothstep(0.25, 1., abs(uv.y));
  float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
  vec3 bg = uBg * (1.0 - 0.4 * length(uv));
  vec3 halo = texture2D(haloTexture, vUv).xyz;
  gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo, 1.);
}
`;

export default function StormBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Perf budget: a soft glow background does not need retina res or MSAA.
    const DPR = Math.min(window.devicePixelRatio || 1, 1.25);
    const lowPower = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    // Manual GammaCorrection pass below handles encoding — keep renderer linear.
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 0, 15);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 80);
    camera.position.set(0, 0, 7);
    camera.layers.enable(LAYERS.TORUS_SCENE);
    camera.layers.enable(LAYERS.BLOOM_SCENE);
    camera.layers.enable(LAYERS.ENTIRE_SCENE);
    scene.add(camera);

    // ---------- Storm cloud ----------
    const stormUniforms = {
      uTime: { value: 0 },
      uSize: { value: CONFIG.pointSize },
      uOpacity: { value: 0 },
      uBlowUp: { value: CONFIG.blowUp },
      uCursor: { value: new THREE.Vector3() },
      uRepelRadius: { value: CONFIG.repelRadius },
      uRepelStrength: { value: CONFIG.repelStrength },
      uActivity: { value: 0 },
      uCore: { value: hexToVec3(CONFIG.coreColor) },
      uMid: { value: hexToVec3(CONFIG.midColor) },
      uRim: { value: hexToVec3(CONFIG.rimColor) },
      uBrightness: { value: CONFIG.brightness },
    };

    // Adaptive particle budget — the cloud reads the same at lower counts.
    const count = reducedMotion ? 8000 : lowPower ? 9000 : 22000;
    const radius = 2.5;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const noises = new Float32Array(count);
    const radialPush = new Float32Array(count);
    const mixv = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let u, v, s;
      do { u = Math.random() * 2 - 1; v = Math.random() * 2 - 1; s = u * u + v * v; } while (s >= 1 || s === 0);
      const factor = 2 * Math.sqrt(1 - s);
      const dx = u * factor, dy = v * factor, dz = 1 - 2 * s;
      const rN = Math.pow(Math.random(), 0.4);
      const r = radius * (0.55 + rN * 0.45);
      positions[i3] = dx * r; positions[i3 + 1] = dy * r; positions[i3 + 2] = dz * r;
      mixv[i] = rN;
      scales[i] = 0.45 + Math.random() * 0.8;
      noises[i] = Math.random();
      radialPush[i] = 0.4 + rN * 1.1;
    }

    const stormGeo = new THREE.BufferGeometry();
    stormGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    stormGeo.setAttribute('aScale', new THREE.Float32BufferAttribute(scales, 1));
    stormGeo.setAttribute('aNoise', new THREE.Float32BufferAttribute(noises, 1));
    stormGeo.setAttribute('aRadialPush', new THREE.Float32BufferAttribute(radialPush, 1));
    stormGeo.setAttribute('aMix', new THREE.Float32BufferAttribute(mixv, 1));

    const stormMat = new THREE.ShaderMaterial({
      uniforms: stormUniforms,
      vertexShader: STORM_VERT,
      fragmentShader: STORM_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const stormPoints = new THREE.Points(stormGeo, stormMat);
    stormPoints.layers.enable(LAYERS.ENTIRE_SCENE);
    const group = new THREE.Group();
    group.add(stormPoints);
    scene.add(group);

    // ---------- Postprocessing ----------
    const renderScene = new RenderPass(scene, camera);

    const torusComposer = new EffectComposer(renderer);
    torusComposer.renderToScreen = false;
    torusComposer.addPass(renderScene);
    torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
    torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.22, 0.2, 0));
    torusComposer.addPass(new ShaderPass(CopyShader));

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.28, 0.55, 0));
    bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));

    const FinalPass = {
      uniforms: {
        iTime: { value: 0 },
        tDiffuse: { value: null },
        torusTexture: { value: null },
        bloomTexture: { value: null },
        haloTexture: { value: null },
        uBg: { value: hexToVec3(CONFIG.bgColor) },
        uFlameA: { value: hexToVec3(CONFIG.flameColor) },
        uFlameB: { value: hexToVec3(CONFIG.flameColor2) },
        uFlameAmt: { value: CONFIG.flameAmt },
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }',
      fragmentShader: FINAL_FRAG,
    };

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    const finalPass = new ShaderPass(FinalPass);
    finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
    finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;
    finalComposer.addPass(finalPass);

    // ---------- Atmosphere motes ----------
    const N = Math.round(CONFIG.atmoCount);
    const aPos = new Float32Array(N * 3), aSize = new Float32Array(N), aSeed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      aPos[i * 3] = 2 * Math.random() - 1; aPos[i * 3 + 1] = 2 * Math.random() - 1; aPos[i * 3 + 2] = 2 * Math.random() - 1;
      aSize[i] = CONFIG.atmoSize * (0.4 + Math.random()); aSeed[i] = Math.random();
    }
    const atmoGeo = new THREE.BufferGeometry();
    atmoGeo.setAttribute('position', new THREE.Float32BufferAttribute(aPos, 3));
    atmoGeo.setAttribute('size', new THREE.Float32BufferAttribute(aSize, 1));
    atmoGeo.setAttribute('seed', new THREE.Float32BufferAttribute(aSeed, 1));
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: hexToVec3(CONFIG.atmoColor) },
        uRes: { value: new THREE.Vector2(window.innerWidth * DPR, window.innerHeight * DPR) },
      },
      vertexShader: ATMO_VERT,
      fragmentShader: ATMO_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const atmoPoints = new THREE.Points(atmoGeo, atmoMat);
    atmoPoints.frustumCulled = false;
    atmoPoints.layers.enable(LAYERS.ENTIRE_SCENE);
    atmoPoints.onBeforeRender = () => {
      const t = performance.now() / 1000;
      atmoMat.uniforms.uTime.value = t * CONFIG.atmoSpeed * 8.0;
      atmoPoints.position.copy(camera.position);
      finalPass.uniforms.iTime.value = t;
    };
    scene.add(atmoPoints);

    // ---------- Pointer / cursor void ----------
    const POINTER = {
      ndc: new THREE.Vector2(0, 0),
      world: new THREE.Vector3(),
      activity: 0,
      active: false,
      lastMove: performance.now(),
    };
    const onMouseMove = (e) => {
      POINTER.ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      POINTER.ndc.y = -((e.clientY / window.innerHeight) * 2 - 1);
      POINTER.active = true;
      POINTER.lastMove = performance.now();
    };
    const onMouseOut = () => { POINTER.active = false; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseout', onMouseOut, { passive: true });

    const _ndc = new THREE.Vector3(), _dir = new THREE.Vector3(), _target = new THREE.Vector3();
    function updatePointer() {
      _target.set(0, 0, 0);
      if (POINTER.active) {
        _ndc.set(POINTER.ndc.x, POINTER.ndc.y, 0.5).unproject(camera);
        _dir.copy(_ndc).sub(camera.position).normalize();
        const denom = _dir.z;
        if (Math.abs(denom) > 1e-4) {
          const t = -camera.position.z / denom;
          if (t > 0 && Number.isFinite(t)) _target.copy(camera.position).addScaledVector(_dir, t);
        }
      }
      POINTER.world.lerp(_target, 0.12);
      const idle = (performance.now() - POINTER.lastMove) / 1000;
      const want = (POINTER.active && idle < 3) ? 1 : 0;
      POINTER.activity += (want - POINTER.activity) * 0.06;
    }

    // ---------- Scroll ----------
    let scrollTarget = 0, scrollSmooth = 0, scrollCurrent = 0;
    const mouseSmooth = { x: 0, y: 0 };
    function updateScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    // ---------- Storm per-frame ----------
    let t0 = performance.now() / 1000;
    const appearStart = performance.now();
    function stormStep(scroll, m) {
      const t = performance.now() / 1000;
      const dt = Math.min(0.05, t - t0); t0 = t;
      stormUniforms.uTime.value = t;
      camera.position.set(m.x * CONFIG.parallax, m.y * CONFIG.parallax, 7 - scroll * CONFIG.scrollDive);
      camera.lookAt(0, 0, 0);
      group.scale.setScalar(1 + scroll * CONFIG.scrollGrow);
      const elapsed = performance.now() - appearStart;
      const fade = Math.max(0, Math.min(1, (elapsed - 300) / 1400));
      stormUniforms.uOpacity.value = fade * CONFIG.opacity;
      stormUniforms.uBlowUp.value = CONFIG.blowUp;
      stormUniforms.uCursor.value.copy(POINTER.world);
      stormUniforms.uActivity.value = POINTER.activity;
      group.rotation.y += dt * (CONFIG.spin + scroll * CONFIG.scrollSpin);
      group.rotation.x += dt * CONFIG.spin * 0.33;
    }

    // ---------- Resize ----------
    function onResize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setPixelRatio(DPR);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      torusComposer.setPixelRatio(DPR); torusComposer.setSize(w, h);
      bloomComposer.setPixelRatio(DPR); bloomComposer.setSize(w, h);
      finalComposer.setPixelRatio(DPR); finalComposer.setSize(w, h);
      atmoMat.uniforms.uRes.value.set(w * DPR, h * DPR);
      updateScroll();
    }
    window.addEventListener('resize', onResize);

    // ---------- Render loop ----------
    let raf = 0;
    function render() {
      raf = requestAnimationFrame(render);
      if (document.hidden) return; // no GPU work while tab is backgrounded
      scrollSmooth = Lerp(scrollSmooth, scrollTarget, 0.10);
      scrollCurrent = Lerp(scrollCurrent, scrollSmooth, 0.06);
      mouseSmooth.x = Lerp(mouseSmooth.x, POINTER.ndc.x, 0.06);
      mouseSmooth.y = Lerp(mouseSmooth.y, POINTER.ndc.y, 0.06);
      updatePointer();
      stormStep(scrollCurrent, mouseSmooth);
      camera.layers.set(LAYERS.TORUS_SCENE); torusComposer.render();
      camera.layers.set(LAYERS.BLOOM_SCENE); bloomComposer.render();
      camera.layers.set(LAYERS.ENTIRE_SCENE); finalComposer.render();
    }
    render();

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', onResize);
      stormGeo.dispose();
      stormMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      torusComposer.dispose();
      bloomComposer.dispose();
      finalComposer.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="storm-bg" aria-hidden="true" />;
}
