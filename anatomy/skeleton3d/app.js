import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { DATA, SECS, LESSONS } from './data.js';

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const D = Object.fromEntries(DATA.map(d => [d.id, d])), SEC = Object.fromEntries(SECS.map(s => [s.id, s]));
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const IVORY = new THREE.Color(0xe9e2d0), AXC = new THREE.Color(0x4aa3ff), APC = new THREE.Color(0xff6b6b), HI = new THREE.Color(0xff9f43);
const LONG = ['humerus', 'radius', 'ulna', 'femur', 'tibia', 'fibula'];
const SIDE_TH = { L: 'ซ้าย', R: 'ขวา' };

/* ---------- node naming ---------- */
function parseNode(n) {
  const m = n.match(/^(.*?)(?:_([LR]))?$/), b = m[1], side = m[2] || ''; let v, id = b;
  if ((v = b.match(/^vert_([CTL])(\d+)$/))) id = v[1] === 'C' ? (v[2] === '1' ? 'c1' : v[2] === '2' ? 'c2' : 'cervical') : v[1] === 'T' ? 'thoracic' : 'lumbar';
  else if (/^disc_/.test(b)) id = 'disc'; else if (/^(rib|costal_cartilage)_\d+$/.test(b)) id = 'rib';
  else if ((v = b.match(/^(metacarpal|metatarsal|cuneiform)_\d+$/))) id = v[1]; else if ((v = b.match(/^phalanx_([hf])_/))) id = 'phalanx_' + v[1];
  return { id: D[id] ? id : null, side };
}
const FING = ['นิ้วโป้ง', 'นิ้วชี้', 'นิ้วกลาง', 'นิ้วนาง', 'นิ้วก้อย'], TOE = ['นิ้วโป้งเท้า', 'นิ้วที่ 2', 'นิ้วที่ 3', 'นิ้วที่ 4', 'นิ้วก้อยเท้า'];
function nodeTitle(n) {
  let v; const { side } = parseNode(n), s = side ? ` (${SIDE_TH[side]})` : '';
  if ((v = n.match(/^vert_([CTL]\d+)/))) return v[1];
  if ((v = n.match(/^disc_([CTL]\d+)/))) return 'Disc ใต้ ' + v[1];
  if ((v = n.match(/^rib_(\d+)/))) return 'Rib ' + v[1] + s;
  if ((v = n.match(/^costal_cartilage_(\d+)/))) return 'Costal cartilage ' + v[1] + s;
  if ((v = n.match(/^(metacarpal|metatarsal)_(\d)/))) return (v[1] === 'metacarpal' ? 'Metacarpal ' : 'Metatarsal ') + v[2] + s;
  if ((v = n.match(/^cuneiform_(\d)/))) return ['Medial', 'Intermediate', 'Lateral'][v[1] - 1] + ' cuneiform' + s;
  if ((v = n.match(/^phalanx_([hf])_(\d)([pmd])/))) return { p: 'Proximal', m: 'Middle', d: 'Distal' }[v[3]] + ' phalanx · ' + (v[1] === 'h' ? FING : TOE)[v[2] - 1] + s;
  const id = parseNode(n).id; return (D[id]?.en || n) + s;
}
function inSec(sec, id, node) {
  const d = D[id]; if (!d) return false;
  switch (sec) {
    case 'all': return true; case 'axial': return d.g === 'ax'; case 'appendicular': return d.g === 'ap';
    case 'skull': return ['skull', 'facial', 'cranial'].includes(d.sec);
    case 'thorax': return ['sternum', 'rib', 'thoracic'].includes(id);
    case 'upper': return d.sec === 'upper' || d.sec === 'hand';
    case 'lower': return d.sec === 'lower' || d.sec === 'foot';
    case 'pelvis': return d.sec === 'pelvis' || id === 'sacrum' || id === 'coccyx';
    default: return d.sec === sec;
  }
}
const TOP = { skull: 'skull', facial: 'skull', cranial: 'skull', spine: 'spine', thorax: 'thorax', shoulder: 'shoulder', upper: 'upper', hand: 'upper', pelvis: 'pelvis', lower: 'lower', foot: 'lower' };

/* ---------- three setup ---------- */
const stage = $('#stage'), cvs = $('#cvs');
const R = new THREE.WebGLRenderer({ canvas: cvs, antialias: true });
R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace; R.localClippingEnabled = true;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
const cam = new THREE.PerspectiveCamera(30, 1, .005, 50);
scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a1a, .75));
const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(2, 3, 3); cam.add(key);
const fill = new THREE.DirectionalLight(0xffffff, .5); fill.position.set(-3, 0, 1); cam.add(fill);
const rim = new THREE.DirectionalLight(0x9fcbff, .7); rim.position.set(0, 2, -4); cam.add(rim); scene.add(cam);
const ctl = new OrbitControls(cam, cvs); ctl.enableDamping = true; ctl.dampingFactor = .08; ctl.rotateSpeed = .9;
ctl.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

let LMJ = { landmarks: {}, regions: [] }, meshes = [], byName = {}, root = null;
const st = { scope: 'all', side: 'R', iso: null, entry: null, lesson: null, labels: true, color: 'parts', interior: false, focus: null, hist: [] };

/* ---------- load ---------- */
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
Promise.all([fetch('landmarks.json').then(r => r.json()).catch(() => LMJ), loader.loadAsync('skeleton.glb')]).then(([lm, g]) => {
  LMJ = lm; root = g.scene; scene.add(root); root.updateMatrixWorld(true);
  root.traverse(o => {
    if (!o.isMesh) return; const n = o.name; const p = parseNode(n);
    if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    o.material = new THREE.MeshStandardMaterial({ color: IVORY, roughness: .55, metalness: 0, side: THREE.DoubleSide });
    o.userData = { n, id: p.id, side: p.side }; meshes.push(o); byName[n] = o;
    // anchor = จุดบนผิวที่ใกล้ centroid
    const pa = o.geometry.attributes.position, c = V3(), t = V3(); const step = Math.max(1, pa.count / 3000 | 0); let k = 0;
    for (let i = 0; i < pa.count; i += step) { c.add(t.fromBufferAttribute(pa, i)); k++; } c.divideScalar(k);
    let best = 1e9, bi = 0; for (let i = 0; i < pa.count; i += step) { const d = t.fromBufferAttribute(pa, i).distanceToSquared(c); if (d < best) { best = d; bi = i; } }
    o.userData.anchor = o.localToWorld(t.fromBufferAttribute(pa, bi).clone()); o.userData.center = o.localToWorld(c.clone());
    const rg = o.geometry.attributes._region; if (rg) { const s = new Set(); for (let i = 0; i < rg.count; i += step) s.add(rg.getX(i)); o.userData.regions = [...s]; }
  });
  $('#loading').remove(); buildNav(); applyColor(); route(location.hash, true);
}).catch(e => { $('#loading').textContent = 'โหลดโมเดลไม่สำเร็จ: ' + e.message; });

/* ---------- visibility / colours ---------- */
function visibleList() { return meshes.filter(m => m.visible); }
function setVisible(pred) { meshes.forEach(m => m.visible = !!pred(m)); }
function regionOf(name) { return LMJ.regions.findIndex(r => r[0].toLowerCase() === String(name).toLowerCase()); }
function applyColor() {
  const hiReg = st.focus ? regionOf(st.focus) : -1, entryReg = st.entry && D[st.entry]?.region ? regionOf(D[st.entry].region) : -1;
  for (const m of meshes) {
    const M = m.material, d = D[m.userData.id];
    if (st.color === 'off' && hiReg < 0 && entryReg < 0) { M.vertexColors = false; M.color.copy(IVORY); M.needsUpdate = true; continue; }
    if (st.color === 'axap' && hiReg < 0 && entryReg < 0) { M.vertexColors = false; M.color.copy(!d ? IVORY : d.g === 'ax' ? AXC : APC); M.needsUpdate = true; continue; }
    const g = m.geometry, rg = g.attributes._region; if (!rg) { M.vertexColors = false; M.color.copy(IVORY); continue; }
    const solid = st.color === 'parts' && m.userData.id === 'temporal' && !(st.iso && st.iso.length === 1) ? new THREE.Color('#e04a3f') : null;
    let col = g.attributes.color; if (!col) { col = new THREE.BufferAttribute(new Float32Array(rg.count * 3), 3); g.setAttribute('color', col); }
    const pal = LMJ.regions.map(r => new THREE.Color(r[1])), dim = new THREE.Color(0x6d6a63), c = new THREE.Color();
    for (let i = 0; i < rg.count; i++) {
      const r = rg.getX(i) | 0;
      if (hiReg >= 0 || entryReg >= 0) c.copy((r === hiReg || r === entryReg) ? HI : (st.color === 'parts' && r ? pal[r] : IVORY)).lerp(dim, (r === hiReg || r === entryReg) ? 0 : .35);
      else c.copy(solid || (r ? pal[r] : IVORY));
      col.setXYZ(i, c.r, c.g, c.b);
    }
    col.needsUpdate = true; M.vertexColors = true; M.color.set(0xffffff); M.needsUpdate = true;
  }
}

/* ---------- camera ---------- */
function freeRect() {
  const r = stage.getBoundingClientRect(); let b = r.height;
  if (innerWidth < 760) { const s = $('#panel').getBoundingClientRect(); b = Math.min(b, s.top - r.top - 8); }
  const tb = $('#viewbar').getBoundingClientRect(); b = Math.min(b, tb.top - r.top - 6);
  const t = $('#crumbs').getBoundingClientRect().bottom - r.top + 6;
  return { w: r.width, h: r.height, t, b: Math.max(t + 80, b) };
}
function viewOff() { const f = freeRect(); cam.setViewOffset(f.w, f.h, 0, f.h / 2 - (f.t + f.b) / 2, f.w, f.h); cam.updateProjectionMatrix(); }
function boxOf(list) { const b = new THREE.Box3(); list.forEach(m => b.expandByObject(m)); return b; }
let tw = null;
function frame(list, dir, instant) {
  if (!list.length) return; const b = boxOf(list), c = b.getCenter(V3()), sph = b.getBoundingSphere(new THREE.Sphere());
  const f = freeRect(), fov = cam.fov * Math.PI / 180, fw = st.labels ? .5 : .9, fh = (f.b - f.t) / f.h * .9;
  const d = (dir || cam.position.clone().sub(ctl.target)).clone().normalize();
  const upv = Math.abs(d.y) > .99 ? V3(0, 0, -1) : V3(0, 1, 0), rt = V3().crossVectors(upv, d).normalize(), uu = V3().crossVectors(d, rt);
  let ex = 0, ey = 0, ez = 0; for (let i = 0; i < 8; i++) { const q = V3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).sub(c); ex = Math.max(ex, Math.abs(q.dot(rt))); ey = Math.max(ey, Math.abs(q.dot(uu))); ez = Math.max(ez, Math.abs(q.dot(d))); }
  const th = Math.tan(fov / 2), dist = Math.max(ey / (th * fh), ex / (th * cam.aspect * fw)) + ez;
  const p = c.clone().add(d.multiplyScalar(dist));
  ctl.minDistance = sph.radius * .3; ctl.maxDistance = dist * 4;
  if (instant) { ctl.target.copy(c); cam.position.copy(p); ctl.update(); } else tw = { t0: performance.now(), ft: ctl.target.clone(), fp: cam.position.clone(), t: c, p };
}
function resize() {
  const r = stage.getBoundingClientRect(); R.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; viewOff();
}
new ResizeObserver(() => { resize(); }).observe(stage);
addEventListener('orientationchange', () => setTimeout(() => { resize(); frame(visibleList(), null, true); }, 300));
const DIRS = { front: V3(0, 0, 1), back: V3(0, 0, -1), right: V3(-1, 0, 0), left: V3(1, 0, 0), top: V3(0, 1, .0001), bottom: V3(0, -1, .0001) };
$$('#viewbar [data-v]').forEach(b => b.onclick = () => frame(visibleList(), b.dataset.v === 'reset' ? DIRS.front : DIRS[b.dataset.v]));

/* ---------- navigation ---------- */
function nodesOfEntry(id, side) {
  const d = D[id], want = d.node || id;
  let L = meshes.filter(m => (d.node ? m.userData.n.replace(/_[LR]$/, '') === want : m.userData.id === id));
  if (L.some(m => m.userData.side)) { const s = L.filter(m => m.userData.side === side); if (s.length) L = s; }
  return L;
}
function push() { st.hist.push(JSON.stringify({ scope: st.scope, side: st.side, iso: st.iso, entry: st.entry, lesson: st.lesson, interior: st.interior })); if (st.hist.length > 40) st.hist.shift(); }
function back() { const s = st.hist.pop(); if (!s) return openScope('all', { nohist: 1 }); const o = JSON.parse(s); Object.assign(st, o); render(true); }
function openScope(id, o = {}) { if (!o.nohist) push(); Object.assign(st, { scope: id, iso: null, entry: null, lesson: null, interior: false, focus: null }); if (o.side) st.side = o.side; render(); }
function openEntry(id, node, o = {}) {
  if (!o.nohist) push(); const d = D[id];
  const L = node ? [byName[node]] : nodesOfEntry(id, st.side);
  Object.assign(st, { entry: id, iso: L.length ? L.map(m => m.userData.n) : null, lesson: null, focus: null, interior: !!o.interior });
  if (!o.keepScope) { const s = Object.keys(TOP).find(k => k === d.sec); st.scope = s || st.scope; }
  render();
}
function openLesson(id) {
  push(); const l = LESSONS.find(x => x.id === id); Object.assign(st, { lesson: id, entry: null, focus: null, interior: false });
  if (l.iso) { const L = nodesOfEntry(l.iso, st.side); st.entry = l.iso; st.iso = L.map(m => m.userData.n); st.interior = !!l.interior; st.lessonKeep = 1; }
  else if (l.show) { st.iso = meshes.filter(m => l.show.some(s => m.userData.n.startsWith(s))).map(m => m.userData.n); st.entry = null; }
  else st.iso = null;
  render();
}
function render(fromBack) {
  const iso = st.iso && new Set(st.iso);
  setVisible(m => iso ? iso.has(m.userData.n) : inSec(st.scope, m.userData.id) && (!SEC[st.scope]?.side || !m.userData.side || m.userData.side === st.side));
  setInterior(st.interior); applyColor(); renderPanel(); renderCrumbs(); syncNav(); viewOff();
  frame(visibleList(), DIRS.front, false); labelsDirty = true;
  const h = st.lesson ? '#lesson/' + st.lesson : st.entry ? '#bone/' + st.entry + (st.iso?.length === 1 ? '/' + st.iso[0] : '') : '#sec/' + st.scope + '/' + st.side;
  if (location.hash !== h) history.replaceState(null, '', h);
}
function route(h, first) {
  const [k, a, b] = (h || '').replace(/^#/, '').split('/');
  if (k === 'bone' && D[a]) { if (b && byName[b]) st.side = byName[b].userData.side || st.side; openEntry(a, b && byName[b] ? b : null, { nohist: 1 }); }
  else if (k === 'lesson' && LESSONS.find(l => l.id === a)) openLesson(a);
  else if (k === 'sec' && SEC[a]) { if (b) st.side = b; openScope(a, { nohist: 1 }); }
  else openScope('all', { nohist: 1 });
  if (first) frame(visibleList(), DIRS.front, true);
}

/* ---------- tap / pick ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null, nP = 0;
cvs.addEventListener('pointerdown', e => { nP++; down = nP === 1 ? { x: e.clientX, y: e.clientY, t: performance.now() } : null; tw = null; });
cvs.addEventListener('pointermove', e => { if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) >= 8) down = null; });
const up = e => { nP = Math.max(0, nP - 1); if (!down || e.type !== 'pointerup') return down = null; const ok = performance.now() - down.t < 300; down = null; if (ok) tap(e.clientX, e.clientY); };
cvs.addEventListener('pointerup', up); cvs.addEventListener('pointercancel', up);
function pick(x, y) {
  const r = cvs.getBoundingClientRect(); ptr.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, cam);
  return ray.intersectObjects(visibleList(), false).find(h => !st.interior || clip.distanceToPoint(h.point) >= 0)?.object;
}
function tap(x, y) {
  const m = pick(x, y); if (!m || !m.userData.id) return;
  const { id, n, side } = m.userData;
  if (st.iso && st.iso.length === 1) return;
  if (st.iso) return openEntry(id, n, { keepScope: 1 });
  if (['all', 'axial', 'appendicular'].includes(st.scope)) { const top = TOP[D[id].sec]; if (top) return openScope(top, { side: side || st.side }); }
  openEntry(id, n, { keepScope: 1 });
}

/* ---------- interior (ภาพตัดกระดูกยาว) ---------- */
const clip = new THREE.Plane(V3(0, 0, -1), 0); let inner = [];
function setInterior(on) {
  inner.forEach(o => { scene.remove(o); o.geometry.dispose(); }); inner = [];
  const can = st.iso && st.iso.length === 1 && LONG.includes(byName[st.iso[0]]?.userData.id);
  $('#tInterior').disabled = !can; $('#tInterior').classList.toggle('on', on && can);
  meshes.forEach(m => { if (m.material.clippingPlanes) { m.material.clippingPlanes = null; m.material.needsUpdate = true; } });
  if (!on || !can) { st.interior = false; return; }
  const m = byName[st.iso[0]]; m.material.clippingPlanes = [clip]; m.material.needsUpdate = true;
  // ทำงานใน world space (โหนดใน GLB มี scale จาก quantization)
  const src = m.geometry.attributes.position, idx = m.geometry.index, P = new Float32Array(src.count * 3), t = V3();
  let lo = 1e9, hi = -1e9;
  for (let i = 0; i < src.count; i++) { t.fromBufferAttribute(src, i).applyMatrix4(m.matrixWorld); P.set([t.x, t.y, t.z], i * 3); lo = Math.min(lo, t.y); hi = Math.max(hi, t.y); }
  const H = hi - lo, bins = 48, sx = new Float64Array(bins), sz = new Float64Array(bins), cnt = new Float64Array(bins), rr = new Float64Array(bins);
  const bi = y => Math.min(bins - 1, Math.max(0, ((y - lo) / H * bins) | 0));
  for (let i = 0; i < src.count; i++) { const k = bi(P[i * 3 + 1]); sx[k] += P[i * 3]; sz[k] += P[i * 3 + 2]; cnt[k]++; }
  for (let k = 0; k < bins; k++) if (cnt[k]) { sx[k] /= cnt[k]; sz[k] /= cnt[k]; }
  for (let i = 0; i < src.count; i++) { const k = bi(P[i * 3 + 1]); rr[k] = Math.max(rr[k], Math.hypot(P[i * 3] - sx[k], P[i * 3 + 2] - sz[k])); }
  const Q = new Float32Array(P.length), col = new Float32Array(P.length), cc = new THREE.Color();
  const red = new THREE.Color(0xb3343c), yel = new THREE.Color(0xf0c04a), line = new THREE.Color(0x3b2418);
  for (let i = 0; i < src.count; i++) {
    const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2], v = (y - lo) / H, k = bi(y), epi = v < .14 || v > .86, s = epi ? .9 : .6;
    Q.set([sx[k] + (x - sx[k]) * s, y, sz[k] + (z - sz[k]) * s], i * 3);
    const n = Math.sin(x * 2600) * Math.sin(y * 2300) * Math.sin(z * 2500);
    if (Math.abs(v - .14) < .007 || Math.abs(v - .86) < .007) cc.copy(line); else if (epi) cc.copy(red).offsetHSL(0, 0, n * .14); else cc.copy(yel);
    col.set([cc.r, cc.g, cc.b], i * 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(Q, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); if (idx) g.setIndex(idx.clone()); g.computeVertexNormals();
  const im = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .85, side: THREE.DoubleSide, clippingPlanes: [clip] }));
  im.raycast = () => { }; scene.add(im); inner.push(im);
  const at = v => { const k = bi(lo + v * H); return { c: V3(sx[k], lo + v * H, sz[k]), r: rr[k] }; };
  m.userData.inAxis = { at, lo, hi };
}
$('#tInterior').onclick = () => { st.interior = !st.interior; setInterior(st.interior); labelsDirty = true; renderPanel(); };

/* ---------- leader-line labels ---------- */
const svg = $('#lines'), lblBox = $('#labels'); let labelsDirty = true, labelItems = [], frameN = 0;
function landmarkItems() {
  const items = [];
  if (st.iso && st.iso.length === 1) {
    const m = byName[st.iso[0]], n = m.userData.n, d = D[st.entry]?.node && n.startsWith(D[st.entry].node) ? D[st.entry] : D[m.userData.id];
    if (st.interior && m.userData.inAxis) return interiorItems(m);
    const lm = LMJ.landmarks[n] || {}; const keys = d?.lm || Object.keys(lm);
    keys.forEach(k => lm[k] && items.push({ t: k, p: V3(...lm[k]), part: k }));
    if (!items.length) items.push({ t: nodeTitle(n), p: m.userData.anchor.clone() });
    return items;
  }
  const vis = visibleList(); if (!vis.length) return items;
  const wide = !st.iso && ['all', 'axial', 'appendicular'].includes(st.scope);
  const groups = new Map();
  for (const m of vis) {
    const d = D[m.userData.id]; if (!d) continue; let key, t;
    if (wide) { const top = TOP[d.sec]; key = top + (['upper', 'lower', 'shoulder'].includes(top) ? m.userData.side : ''); t = SEC[top].t.replace(/^[\d.)]+\s*/, ''); }
    else if (m.userData.regions?.length === 1 && m.userData.regions[0] > 0 && !['rib'].includes(d.id) || /^(rib|costal)/.test(m.userData.n)) { const r = LMJ.regions[m.userData.regions[0]]; key = r[0]; t = r[0]; }
    else { key = d.id; t = d.en; }
    if (!groups.has(key)) groups.set(key, { t, ms: [] }); groups.get(key).ms.push(m);
  }
  for (const [k, g] of groups) {
    const c = V3(); g.ms.forEach(m => c.add(m.userData.center)); c.divideScalar(g.ms.length);
    let best = g.ms[0], bd = 1e9; g.ms.forEach(m => { const dd = m.userData.anchor.distanceToSquared(c); if (dd < bd) { bd = dd; best = m; } });
    items.push({ t: g.t, p: best.userData.anchor.clone(), node: best.userData.n, id: D[best.userData.id].id });
  }
  return items;
}
function interiorItems(m) {
  const A = m.userData.inAxis; if (!A) return [];
  const camDir = ctl.target.clone().sub(cam.position).normalize(), right = V3().crossVectors(camDir, V3(0, 1, 0)).normalize();
  const P = (v, k) => { const q = A.at(v); return q.c.add(right.clone().multiplyScalar(k * q.r)); };
  return [['Articular cartilage', .985, -.35], ['Epiphysis (spongy bone · red marrow)', .93, .15], ['Epiphyseal line', .86, -.3], ['Metaphysis', .8, .55],
    ['Diaphysis', .58, -.98], ['Medullary cavity (yellow marrow)', .45, 0], ['Compact bone', .35, .5], ['Periosteum', .25, -.95], ['Epiphysis (ปลายล่าง)', .06, .2]]
    .map(([t, v, k]) => ({ t, p: P(v, k), part: t }));
}
function project(p, r) { const v = p.clone().project(cam); return { x: (v.x + 1) / 2 * r.width, y: (1 - v.y) / 2 * r.height, z: v.z }; }
const occ = new THREE.Raycaster();
function drawLabels() {
  const r = stage.getBoundingClientRect();
  if (!st.labels || !root) { svg.innerHTML = ''; lblBox.innerHTML = ''; labelItems = []; return; }
  if (labelsDirty || st.interior) { labelItems = landmarkItems(); labelsDirty = false; lblBox.innerHTML = ''; labelItems.forEach(it => { const e = document.createElement('button'); e.className = 'lbl'; e.textContent = it.t; e.onclick = () => labelClick(it); lblBox.appendChild(e); it.el = e; }); }
  if (!labelItems.length) { svg.innerHTML = ''; return; }
  const vis = visibleList(), f = freeRect();
  const bb = boxOf(vis), pts = []; for (let i = 0; i < 8; i++) pts.push(project(V3(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z), r));
  const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x)), midX = (minX + maxX) / 2;
  const doOcc = frameN % 4 === 0;
  labelItems.forEach(it => {
    const s = project(it.p, r); it.s = s; it.w = it.el.offsetWidth; it.h = it.el.offsetHeight;
    if (doOcc) { const dir = it.p.clone().sub(cam.position), dl = dir.length(); occ.set(cam.position, dir.normalize()); occ.far = dl; const h = occ.intersectObjects(vis, false).find(h => !st.interior || clip.distanceToPoint(h.point) >= 0); it.hidden = h && h.distance < dl - Math.max(.004, dl * .012); }
  });
  const L = labelItems.filter(i => i.s.x < midX).sort((a, b) => a.s.y - b.s.y), Rr = labelItems.filter(i => i.s.x >= midX).sort((a, b) => a.s.y - b.s.y);
  const gap = 4, top = f.t + 4, bot = f.b - 4;
  const place = (col, left) => {
    let y = top; col.forEach(it => { it.ly = Math.max(y, it.s.y - it.h / 2); y = it.ly + it.h + gap; });
    let over = y - gap - bot; for (let i = col.length - 1; i >= 0 && over > 0; i--) { const it = col[i]; const lim = i ? col[i - 1].ly + col[i - 1].h + gap : top; const mv = Math.min(over, it.ly - lim); it.ly -= over; over = Math.max(0, over - mv); if (i < col.length - 1) {} }
    for (let i = col.length - 1; i > 0; i--) if (col[i].ly < col[i - 1].ly + col[i - 1].h + gap) col[i - 1].ly = col[i].ly - col[i - 1].h - gap;
    col.forEach(it => { let x = left ? minX - 28 - it.w : maxX + 28; x = Math.max(8, Math.min(r.width - it.w - 8, x)); it.lx = x; });
  };
  place(L, true); place(Rr, false);
  let html = '';
  labelItems.forEach(it => {
    const left = it.lx + it.w / 2 < it.s.x, ex = left ? it.lx + it.w : it.lx, ey = it.ly + it.h / 2, foc = st.focus && st.focus === it.part;
    it.el.style.transform = `translate(${it.lx}px,${it.ly}px)`; it.el.classList.toggle('dim', !!it.hidden); it.el.classList.toggle('foc', !!foc);
    const op = it.hidden ? .35 : 1, colr = foc ? '#ff9f43' : '#e8e8e8';
    html += `<polyline points="${ex},${ey} ${ex + (left ? 10 : -10)},${ey} ${it.s.x},${it.s.y}" fill="none" stroke="${colr}" stroke-opacity="${op * .85}" stroke-width="${foc ? 1.6 : 1}"/>`;
    html += it.hidden ? `<circle cx="${it.s.x}" cy="${it.s.y}" r="3" fill="none" stroke="${colr}" stroke-opacity=".6"/>` : `<circle cx="${it.s.x}" cy="${it.s.y}" r="3.2" fill="${colr}" stroke="#000" stroke-width="1"/>`;
  });
  svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`); svg.innerHTML = html;
}
function labelClick(it) {
  if (it.part) { setFocus(st.focus === it.part ? null : it.part); return; }
  if (it.node) { if (['all', 'axial', 'appendicular'].includes(st.scope) && !st.iso) { const top = TOP[D[it.id].sec]; return openScope(top, { side: byName[it.node].userData.side || st.side }); } openEntry(it.id, st.iso ? it.node : null, { keepScope: 1 }); }
}
function setFocus(name) {
  st.focus = name; applyColor();
  $$('#panel [data-part]').forEach(e => e.classList.toggle('foc', e.dataset.part === name));
  const el = $(`#panel [data-part="${CSS.escape(name || '')}"]`); el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ---------- panel ---------- */
const pgBtns = pg => (pg || []).length ? `<div class="pages"><span>สมุด</span>${pg.map(p => `<button class="pg" data-pg="${p}">หน้า ${p}</button>`).join('')}</div>` : '';
const sec = (t, body) => body ? `<section><h4>${t}</h4>${body}</section>` : '';
const ul = a => a?.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
function legendHTML() {
  if (st.color !== 'parts') return '';
  const s = new Set(); visibleList().forEach(m => (m.userData.regions || []).forEach(r => r && s.add(r)));
  const multiT = visibleList().some(m => m.userData.id === 'temporal') && !(st.iso && st.iso.length === 1);
  if (multiT) visibleList().filter(m => m.userData.id === 'temporal').forEach(m => m.userData.regions.forEach(r => s.delete(r)));
  const extra = multiT ? `<button data-part="Temporal bones"><i style="background:#e04a3f"></i>Temporal</button>` : '';
  if (!s.size && !extra) return ''; return sec('สีแยกส่วน', `<div class="legend">${extra}${[...s].sort((a, b) => a - b).map(i => `<button data-part="${esc(LMJ.regions[i][0])}"><i style="background:${LMJ.regions[i][1]}"></i>${esc(LMJ.regions[i][0])}</button>`).join('')}</div>`);
}
function renderPanel() {
  let h = '';
  if (st.lesson) {
    const l = LESSONS.find(x => x.id === st.lesson);
    h = `<header><div class="kicker">บทเรียน</div><h2>${l.t}</h2></header>${pgBtns(l.pg)}<div class="prose">${l.html}</div>`;
    if (l.iso) h += `<div class="note">กำลังแสดง ${esc(D[l.iso].en)} (${SIDE_TH[st.side]}) ${st.interior ? '· ภาพตัดภายใน' : ''}</div>`;
  } else if (st.entry) {
    const d = D[st.entry], single = st.iso?.length === 1 ? st.iso[0] : null;
    const title = single && !/^(humerus|femur)/.test('') ? nodeTitle(single) : d.en;
    h = `<header><div class="kicker">${esc(SEC[d.sec]?.t || '')}</div><h2>${esc(title)}</h2><p class="th">${esc(d.th)}${single && title !== d.en ? ' · ' + esc(d.en) : ''}</p>
      <div class="facts"><span><b>${esc(d.n)}</b> ชิ้น</span><span class="${d.g}">${d.g === 'ax' ? 'Axial · กระดูกแกน' : 'Appendicular · ระยางค์'}</span></div></header>${pgBtns(d.pg)}`;
    if (!st.iso) h += `<div class="note">โมเดล BodyParts3D ไม่มีชิ้นนี้ — แสดงเฉพาะข้อมูล</div>`;
    if (d.long && st.iso?.length === 1) h += `<button class="wide ${st.interior ? 'on' : ''}" id="pInterior">${st.interior ? 'ดูภายนอก' : 'ดูภายใน (ภาพตัด)'}</button>`;
    if (st.iso && st.iso.length > 1) h += `<div class="note">แตะชิ้นใดชิ้นหนึ่งบนโมเดลเพื่อแยกออกมาดูเดี่ยว ๆ</div>`;
    h += sec('ตำแหน่ง', `<p>${esc(d.loc)}</p>${d.desc ? `<p>${esc(d.desc)}</p>` : ''}`);
    if (st.interior) h += sec('โครงสร้างภายใน (สมุดหน้า 6)', `<ol class="parts">${interiorItems(byName[st.iso[0]]).map(i => `<li><button data-part="${esc(i.t)}"><b>${esc(i.t)}</b></button></li>`).join('')}</ol>`);
    else if (d.parts.length) h += sec('ส่วนประกอบ', `<ol class="parts">${d.parts.map(([a, b]) => `<li><button data-part="${esc(a)}"><b>${esc(a)}</b>${b ? `<span>${esc(b)}</span>` : ''}</button></li>`).join('')}</ol>`);
    h += sec('เชื่อมกับ / ชนิดข้อต่อ', d.con.length ? `<ul class="con">${d.con.map(([t, j, n]) => `<li><a href="#" data-go="${t}">${esc(D[t]?.en || t)}</a>${j ? `<em>${esc(j)}</em>` : ''}${n ? ` ${esc(n)}` : ''}</li>`).join('')}</ul>` : '');
    h += sec('สิ่งที่ลอดผ่าน', ul(d.pass)) + sec('คลินิก', ul(d.clin)) + (d.tip.length ? sec('Tip', d.tip.map(t => `<p class="tip">${esc(t)}</p>`).join('')) : '');
    h += legendHTML();
  } else {
    const s = SEC[st.scope]; const ids = DATA.filter(d => inSec(st.scope, d.id) && !['all', 'axial', 'appendicular'].includes(st.scope));
    h = `<header><div class="kicker">${s.parent ? esc(SEC[s.parent].t) : 'หมวด'}</div><h2>${esc(s.t)}</h2><p class="th">${esc(s.s)}</p></header>${pgBtns(s.pg)}`;
    if (s.side) h += `<div class="seg side">${['R', 'L'].map(k => `<button data-side="${k}" class="${st.side === k ? 'on' : ''}">ข้าง${SIDE_TH[k]}</button>`).join('')}</div>`;
    h += sec('สรุปจากสมุด', ul(s.info));
    if (ids.length) h += sec('กระดูกในหมวดนี้', `<div class="chips">${ids.map(d => `<button data-go="${d.id}">${esc(d.en)}</button>`).join('')}</div>`);
    if (['all', 'axial', 'appendicular'].includes(st.scope)) h += sec('วิธีใช้', '<ul><li>แตะส่วนใดของโครงกระดูก → เปิดหมวดนั้น · แตะอีกครั้ง → แยกชิ้นออกมาดู</li><li>ลาก 1 นิ้วหมุน · บีบซูม · 2 นิ้วเลื่อน</li><li>แตะป้ายชื่อเพื่อไฮไลต์ส่วนนั้น</li></ul>');
    h += legendHTML();
  }
  h += `<footer>โมเดล: BodyParts3D, © The Database Center for Life Science, CC BY 4.0 · เนื้อหา: สมุดสรุป Anatomy เล่ม 2 บทที่ 3</footer>`;
  $('#pbody').innerHTML = h; $('#pbody').scrollTop = 0;
  $('#pInterior')?.addEventListener('click', () => $('#tInterior').click());
}
$('#pbody').addEventListener('click', e => {
  const t = e.target.closest('[data-go],[data-part],[data-pg],[data-side]'); if (!t) return; e.preventDefault();
  if (t.dataset.go) openEntry(t.dataset.go, null, {});
  else if (t.dataset.part) setFocus(st.focus === t.dataset.part ? null : t.dataset.part);
  else if (t.dataset.pg) openBook(+t.dataset.pg);
  else if (t.dataset.side) { st.side = t.dataset.side; openScope(st.scope, { nohist: 1 }); }
});
function renderCrumbs() {
  const c = [`<button data-c="all">ทั้งตัว</button>`];
  const s = SEC[st.scope]; if (st.scope !== 'all') { if (s.parent) c.push(`<button data-c="${s.parent}">${esc(SEC[s.parent].t)}</button>`); c.push(`<button data-c="${st.scope}">${esc(s.t)}${s.side ? ' · ' + SIDE_TH[st.side] : ''}</button>`); }
  if (st.lesson) c.push(`<span>${esc(LESSONS.find(l => l.id === st.lesson).t)}</span>`);
  else if (st.entry) c.push(`<span>${esc(st.iso?.length === 1 ? nodeTitle(st.iso[0]) : D[st.entry].en)}</span>`);
  $('#crumbs').innerHTML = (st.hist.length ? `<button class="back" id="back" aria-label="ย้อนกลับ">‹</button>` : '') + c.join('<i>›</i>');
}
$('#crumbs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.id === 'back') return back(); openScope(b.dataset.c); });

/* ---------- nav ---------- */
function buildNav() {
  const g = (t, items) => `<div class="ng"><div class="nt">${t}</div>${items}</div>`;
  const si = (id, sub) => { const s = SEC[id]; const kids = ['all', 'axial', 'appendicular'].includes(id) ? [] : DATA.filter(d => id === 'thorax' ? ['sternum', 'rib'].includes(d.id) : d.sec === id);
    return `<div class="ni ${sub ? 'sub' : ''}" data-sec="${id}"><button class="nb" data-s="${id}"><span>${esc(s.t)}</span><small>${esc(s.s)}</small></button>${kids.length ? `<div class="kids">${kids.map(d => `<button data-e="${d.id}">${esc(d.en)}</button>`).join('')}</div>` : ''}</div>`; };
  $('#nav').innerHTML =
    g('ภาพรวม', si('all')) +
    g('บทเรียน 3.1–3.6', LESSONS.map(l => `<div class="ni"><button class="nb" data-l="${l.id}"><span>${esc(l.t)}</span><small>หน้า ${l.pg[0]}</small></button></div>`).join('')) +
    g('3.7 แกน / ระยางค์', si('axial') + si('appendicular')) +
    g('3.8 กะโหลกศีรษะ', si('skull') + si('cranial', 1) + si('facial', 1)) +
    g('3.9 กระดูกสันหลัง', si('spine')) + g('3.10 ทรวงอก', si('thorax')) +
    g('3.11 กระดูกระยางค์', si('shoulder') + si('upper') + si('hand', 1) + si('pelvis') + si('lower') + si('foot', 1));
  $('#nav').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.s) openScope(b.dataset.s); else if (b.dataset.l) openLesson(b.dataset.l); else if (b.dataset.e) openEntry(b.dataset.e, null, {});
    if (innerWidth < 1100) document.body.classList.remove('navopen');
  });
}
function syncNav() {
  $$('#nav .ni').forEach(n => n.classList.toggle('open', n.dataset.sec === st.scope || (SEC[st.scope]?.parent === n.dataset.sec)));
  $$('#nav .nb').forEach(b => b.classList.toggle('on', !st.lesson && !st.entry && b.dataset.s === st.scope || st.lesson && b.dataset.l === st.lesson));
  $$('#nav [data-e]').forEach(b => b.classList.toggle('on', b.dataset.e === st.entry));
}
$('#menu').onclick = () => document.body.classList.toggle('navopen');
$('#scrim').onclick = () => document.body.classList.remove('navopen');

/* ---------- toolbar toggles ---------- */
$('#tLabels').onclick = e => { st.labels = !st.labels; e.currentTarget.classList.toggle('on', st.labels); labelsDirty = true; frame(visibleList()); };
$$('#tColor button').forEach(b => b.onclick = () => { st.color = b.dataset.c; $$('#tColor button').forEach(x => x.classList.toggle('on', x === b)); applyColor(); renderPanel(); });

/* ---------- search ---------- */
const q = $('#q'), res = $('#res');
const norm = s => String(s).toLowerCase();
q.oninput = () => {
  const s = norm(q.value.trim()); if (!s) { res.hidden = true; return; }
  const hits = [...SECS.filter(x => norm(x.t + ' ' + x.s).includes(s)).map(x => ({ k: 's', id: x.id, t: x.t, sub: x.s })),
    ...LESSONS.filter(x => norm(x.t + x.html).includes(s)).map(x => ({ k: 'l', id: x.id, t: x.t, sub: 'บทเรียน' })),
    ...DATA.filter(d => norm([d.en, d.th, d.id, d.loc, ...d.parts.map(p => p[0])].join(' ')).includes(s)).map(d => ({ k: 'e', id: d.id, t: d.en, sub: d.th + (d.parts.find(p => norm(p[0]).includes(s)) ? ' · ' + d.parts.find(p => norm(p[0]).includes(s))[0] : ''), part: d.parts.find(p => norm(p[0]).includes(s))?.[0] }))].slice(0, 30);
  res.innerHTML = hits.map((h, i) => `<button data-i="${i}"><b>${esc(h.t)}</b><small>${esc(h.sub)}</small></button>`).join('') || '<p>ไม่พบ</p>'; res.hidden = false; res._h = hits;
};
res.addEventListener('pointerdown', e => {
  const b = e.target.closest('button'); if (!b) return; e.preventDefault(); const h = res._h[+b.dataset.i]; res.hidden = true; q.value = ''; q.blur();
  if (h.k === 's') openScope(h.id); else if (h.k === 'l') openLesson(h.id); else { openEntry(h.id, null, {}); if (h.part) setTimeout(() => setFocus(h.part), 100); }
});
q.onblur = () => setTimeout(() => res.hidden = true, 150);

/* ---------- notebook viewer ---------- */
const NB = 32; let bookPg = 1, zoom = 1;
function openBook(p) { bookPg = p; zoom = 1; $('#book').hidden = false; showPage(); }
function showPage() { const img = $('#bimg'); img.src = `book/p-${String(bookPg).padStart(2, '0')}.jpg`; img.style.width = (zoom * 100) + '%'; $('#bnum').textContent = `หน้า ${bookPg} / ${NB}`; $('#bscroll').scrollTop = 0; }
$('#bprev').onclick = () => { if (bookPg > 1) { bookPg--; showPage(); } };
$('#bnext').onclick = () => { if (bookPg < NB) { bookPg++; showPage(); } };
$('#bzin').onclick = () => { zoom = Math.min(3, zoom + .5); showPage(); };
$('#bzout').onclick = () => { zoom = Math.max(1, zoom - .5); showPage(); };
$('#bclose').onclick = () => $('#book').hidden = true;
$('#tBook').onclick = () => openBook(((st.lesson && LESSONS.find(l => l.id === st.lesson).pg) || (st.entry && D[st.entry].pg) || SEC[st.scope].pg || [2])[0] || 2);
addEventListener('keydown', e => { if ($('#book').hidden) return; if (e.key === 'ArrowRight') $('#bnext').click(); if (e.key === 'ArrowLeft') $('#bprev').click(); if (e.key === 'Escape') $('#bclose').click(); });

/* ---------- bottom sheet (มือถือ) ---------- */
const panel = $('#panel'), LV = [.3, .55, .9]; let lv = 0, dr = null;
function setLv(i) { lv = i; panel.style.height = innerWidth < 760 ? LV[i] * 100 + 'dvh' : ''; setTimeout(() => { viewOff(); labelsDirty = true; }, 260); }
$('#grab').addEventListener('pointerdown', e => { if (innerWidth >= 760) return; dr = { y: e.clientY, h: panel.getBoundingClientRect().height }; panel.classList.add('drag'); e.currentTarget.setPointerCapture(e.pointerId); });
$('#grab').addEventListener('pointermove', e => { if (dr) panel.style.height = Math.max(innerHeight * .15, Math.min(innerHeight * .92, dr.h + dr.y - e.clientY)) + 'px'; });
$('#grab').addEventListener('pointerup', e => { if (!dr) return; panel.classList.remove('drag'); const f = panel.getBoundingClientRect().height / innerHeight; if (Math.abs(e.clientY - dr.y) < 6) setLv((lv + 1) % 3); else { let b = 0; LV.forEach((v, i) => { if (Math.abs(v - f) < Math.abs(LV[b] - f)) b = i; }); setLv(b); } dr = null; });
addEventListener('resize', () => setLv(lv));

/* ---------- touch lock ---------- */
document.addEventListener('touchmove', e => { if (!e.target.closest('.scroll')) e.preventDefault(); }, { passive: false });
['gesturestart', 'gesturechange', 'gestureend', 'dblclick'].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));

/* ---------- loop ---------- */
R.setAnimationLoop(() => {
  if (tw) { let k = Math.min(1, (performance.now() - tw.t0) / 600); k = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; ctl.target.lerpVectors(tw.ft, tw.t, k); cam.position.lerpVectors(tw.fp, tw.p, k); if (k >= 1) tw = null; }
  ctl.update();
  if (st.interior && st.iso) { const m = byName[st.iso[0]]; const c = m.userData.inAxis ? m.userData.inAxis.at(.5).c : boxOf([m]).getCenter(V3()); const n = ctl.target.clone().sub(cam.position).normalize(); clip.setFromNormalAndCoplanarPoint(n, c); }
  R.render(scene, cam); frameN++; drawLabels();
});
window.__humnoi = { st, meshes, byName, cam, ctl, openEntry, openScope, setFocus, frame, visibleList, DIRS, labelItems: () => labelItems };
