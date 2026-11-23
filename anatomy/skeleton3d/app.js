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
const PR_IDLE = Math.min(devicePixelRatio, 2), PR_MOVE = Math.min(devicePixelRatio, .85);
let prNow = PR_IDLE; R.setPixelRatio(prNow); R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace; R.localClippingEnabled = true;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
const cam = new THREE.PerspectiveCamera(30, 1, .005, 50);
scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a1a, .75));
const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(2, 3, 3); cam.add(key);
const fill = new THREE.DirectionalLight(0xffffff, .5); fill.position.set(-3, 0, 1); cam.add(fill);
const rim = new THREE.DirectionalLight(0x9fcbff, .7); rim.position.set(0, 2, -4); cam.add(rim); scene.add(cam);
const ctl = new OrbitControls(cam, cvs); ctl.enableDamping = true; ctl.dampingFactor = .08; ctl.rotateSpeed = .9;
ctl.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
let dirty = true, idleT = 0, moving = false;
const need = () => { dirty = true; };
function setPR(v) { if (v === prNow) return; prNow = v; const r = stageRect(); R.setPixelRatio(v); R.setSize(r.width, r.height, false); dirty = true; }
function motion() { // ลดความละเอียดระหว่างหมุน แล้วคืนค่าเมื่อหยุด
  moving = true; setPR(PR_MOVE); clearTimeout(idleT);
  idleT = setTimeout(() => { moving = false; setPR(PR_IDLE); occDirty = true; dirty = true; }, 220);
}
ctl.addEventListener('change', () => { need(); motion(); });

let LMJ = { landmarks: {}, regions: [] }, meshes = [], byName = {}, root = null;
const st = { scope: 'all', side: 'R', iso: null, entry: null, lesson: null, labels: true, color: 'parts', interior: false, focus: null, hist: [] };

/* ---------- load ---------- */
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
Promise.all([fetch('landmarks.json').then(r => r.json()).catch(() => LMJ), loader.loadAsync('skeleton.glb')]).then(([lm, g]) => {
  LMJ = lm; root = g.scene; scene.add(root); root.updateMatrixWorld(true);
  root.traverse(o => {
    if (!o.isMesh) return; const n = o.name; const p = parseNode(n);
    if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    o.material = new THREE.MeshLambertMaterial({ color: IVORY }); // Lambert เบากว่า Standard บน GPU มือถือ
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
    o.userData = { n, id: p.id, side: p.side }; meshes.push(o); byName[n] = o;
    // anchor = จุดบนผิวที่ใกล้ centroid
    const pa = o.geometry.attributes.position, c = V3(), t = V3(); const step = Math.max(1, pa.count / 3000 | 0); let k = 0;
    for (let i = 0; i < pa.count; i += step) { c.add(t.fromBufferAttribute(pa, i)); k++; } c.divideScalar(k);
    let best = 1e9, bi = 0; for (let i = 0; i < pa.count; i += step) { const d = t.fromBufferAttribute(pa, i).distanceToSquared(c); if (d < best) { best = d; bi = i; } }
    o.userData.anchor = o.localToWorld(t.fromBufferAttribute(pa, bi).clone()); o.userData.center = o.localToWorld(c.clone());
    const st2 = Math.max(1, pa.count / 400 | 0), sp = []; for (let i = 0; i < pa.count; i += st2) sp.push(o.localToWorld(t.fromBufferAttribute(pa, i).clone())); o.userData.samples = sp;
    const rg = o.geometry.attributes._region; if (rg) { const s = new Set(); for (let i = 0; i < rg.count; i += step) s.add(rg.getX(i)); o.userData.regions = [...s]; }
  });
  $('#loading').classList.add('done'); setTimeout(() => $('#loading').remove(), 400); buildNav(); route(location.hash, true);
}).catch(e => { $('#loading').textContent = 'โหลดโมเดลไม่สำเร็จ: ' + e.message; });

/* ---------- visibility / colours ---------- */
let visCache = [], visBox = new THREE.Box3();
function visibleList() { return visCache; }
function setVisible(pred) { meshes.forEach(m => m.visible = !!pred(m)); visCache = meshes.filter(m => m.visible); visBox = boxOf(visCache); }
function regionOf(name) { return LMJ.regions.findIndex(r => r[0].toLowerCase() === String(name).toLowerCase()); }
function applyColor() {
  const hiReg = st.focus ? regionOf(st.focus) : -1, entryReg = st.entry && D[st.entry]?.region ? regionOf(D[st.entry].region) : -1;
  const pal = LMJ.regions.map(r => new THREE.Color(r[1])), dim = new THREE.Color(0x6d6a63), c = new THREE.Color();
  for (const m of visCache) {
    const M = m.material, d = D[m.userData.id];
    const ck = st.color + '|' + hiReg + '|' + entryReg + '|' + (st.iso && st.iso.length === 1); if (m.userData.ck === ck) continue; m.userData.ck = ck;
    if (st.color === 'off' && hiReg < 0 && entryReg < 0) { if (M.vertexColors) { M.vertexColors = false; M.needsUpdate = true; } M.color.copy(IVORY); continue; }
    if (st.color === 'axap' && hiReg < 0 && entryReg < 0) { if (M.vertexColors) { M.vertexColors = false; M.needsUpdate = true; } M.color.copy(!d ? IVORY : d.g === 'ax' ? AXC : APC); continue; }
    const g = m.geometry, rg = g.attributes._region; if (!rg) { M.vertexColors = false; M.color.copy(IVORY); continue; }
    const solid = st.color === 'parts' && m.userData.id === 'temporal' && !(st.iso && st.iso.length === 1) ? new THREE.Color('#e04a3f') : null;
    let col = g.attributes.color; if (!col) { col = new THREE.BufferAttribute(new Float32Array(rg.count * 3), 3); g.setAttribute('color', col); }
    for (let i = 0; i < rg.count; i++) {
      const r = rg.getX(i) | 0;
      if (hiReg >= 0 || entryReg >= 0) c.copy((r === hiReg || r === entryReg) ? HI : (st.color === 'parts' && r ? pal[r] : IVORY)).lerp(dim, (r === hiReg || r === entryReg) ? 0 : .35);
      else c.copy(solid || (r ? pal[r] : IVORY));
      col.setXYZ(i, c.r, c.g, c.b);
    }
    col.needsUpdate = true; if (!M.vertexColors) { M.vertexColors = true; M.needsUpdate = true; } M.color.set(0xffffff);
  }
  dirty = true;
}

/* ---------- camera ---------- */
let rectC = null, freeC = null;
function stageRect() { return rectC || (rectC = stage.getBoundingClientRect()); }
function freeRect() {
  if (freeC) return freeC;
  const r = stageRect(); let b = r.height;
  if (innerWidth < 760) { const s = $('#panel').getBoundingClientRect(); b = Math.min(b, s.top - r.top - 8); }
  const tb = $('#viewbar').getBoundingClientRect(); b = Math.min(b, tb.top - r.top - 6);
  const t = $('#crumbs').getBoundingClientRect().bottom - r.top + 6;
  const dk = $('#dock').getBoundingClientRect(), rr = Math.min(r.width, dk.left - r.left - 6);
  return (freeC = { w: r.width, h: r.height, t, b: Math.max(t + 80, b), r: rr });
}
function invalidate() { rectC = freeC = null; dirty = true; labelsDirty = true; }
function viewOff() { freeC = null; const f = freeRect(); cam.setViewOffset(f.w, f.h, (f.w - f.r) / 2, f.h / 2 - (f.t + f.b) / 2, f.w, f.h); cam.updateProjectionMatrix(); }
function boxOf(list) { const b = new THREE.Box3(); list.forEach(m => b.expandByObject(m)); return b; }
let tw = null;
function frame(list, dir, instant) {
  if (!list.length) return; const b = boxOf(list), c = b.getCenter(V3()), sph = b.getBoundingSphere(new THREE.Sphere());
  const f = freeRect(), fov = cam.fov * Math.PI / 180, fw = .86, fh = (f.b - f.t) / f.h * (st.labels ? .8 : .9);
  const d = (dir || cam.position.clone().sub(ctl.target)).clone().normalize();
  const upv = Math.abs(d.y) > .99 ? V3(0, 0, -1) : V3(0, 1, 0), rt = V3().crossVectors(upv, d).normalize(), uu = V3().crossVectors(d, rt);
  let ex = 0, ey = 0, ez = 0; for (let i = 0; i < 8; i++) { const q = V3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).sub(c); ex = Math.max(ex, Math.abs(q.dot(rt))); ey = Math.max(ey, Math.abs(q.dot(uu))); ez = Math.max(ez, Math.abs(q.dot(d))); }
  const th = Math.tan(fov / 2), dist = Math.max(ey / (th * fh), ex / (th * cam.aspect * fw * f.r / f.w)) + ez;
  const p = c.clone().add(d.multiplyScalar(dist));
  ctl.minDistance = sph.radius * .3; ctl.maxDistance = dist * 4;
  if (instant) { ctl.target.copy(c); cam.position.copy(p); ctl.update(); } else tw = { t0: performance.now(), ft: ctl.target.clone(), fp: cam.position.clone(), t: c, p };
  dirty = true;
}
function resize() {
  invalidate(); const r = stageRect(); R.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; viewOff();
}
let roT = 0; new ResizeObserver(() => { resize(); clearTimeout(roT); roT = setTimeout(() => frame(visibleList()), 120); }).observe(stage);
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
  setInterior(st.interior); applyColor(); renderPanel(); renderCrumbs(); syncNav(); syncDock(); viewOff();
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
  return ray.intersectObjects(visibleList(), false).find(h => !st.interior || clip.distanceToPoint(h.point) >= 0)?.object;
}
function tap(x, y) {
  { const r = cvs.getBoundingClientRect(); ptr.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, cam); }
  if (labelItems.length) { const h = ray.intersectObjects(labelItems.map(i => i.spr), false)[0]; if (h) return labelClick(h.object.userData.item); }
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
  st.canInterior = can;
  meshes.forEach(m => { if (m.material.clippingPlanes) { m.material.clippingPlanes = null; m.material.side = THREE.FrontSide; m.material.needsUpdate = true; } }); dirty = true;
  if (!on || !can) { st.interior = false; return; }
  const m = byName[st.iso[0]]; m.material.clippingPlanes = [clip]; m.material.side = THREE.DoubleSide; m.material.needsUpdate = true;
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
function toggleInterior() {
  if (!st.canInterior) return toast('ภาพตัดภายใน', 'ใช้ได้กับกระดูกยาว: humerus, radius, ulna, femur, tibia, fibula — เลือกกระดูกก่อน');
  st.interior = !st.interior; setInterior(st.interior); labelsDirty = true; renderPanel(); syncDock();
  toast(st.interior ? 'เปิดภาพตัดภายใน' : 'ปิดภาพตัดภายใน', st.interior ? 'ดู periosteum, compact bone, medullary cavity, spongy bone (สมุดหน้า 6)' : 'กลับไปดูผิวนอก');
}

/* ---------- leader-line labels ---------- */
const svg = $('#lines'), lblBox = $('#labels'); let labelsDirty = true, labelItems = [];
function landmarkItems() {
  const items = [];
  if (st.iso && st.iso.length === 1) {
    const m = byName[st.iso[0]], n = m.userData.n, d = D[st.entry]?.node && n.startsWith(D[st.entry].node) ? D[st.entry] : D[m.userData.id];
    if (st.interior && m.userData.inAxis) return interiorItems(m);
    const lm = LMJ.landmarks[n] || {}; const keys = d?.lm || Object.keys(lm);
    keys.forEach(k => lm[k] && items.push({ t: k, p: V3(...lm[k]), part: k, node: n }));
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
    // ปักหมุดด้านที่หันออกจากกลุ่ม (ไม่ปักด้านในที่มองไม่เห็น)
    const C = visBox.getCenter(V3()), dir = best.userData.center.clone().sub(C); let p = best.userData.anchor.clone();
    if (dir.lengthSq() > 1e-8) { dir.normalize(); let bd2 = -1e9; for (const v of best.userData.samples) { const sc = v.clone().sub(C).dot(dir) - v.distanceTo(best.userData.center) * .35; if (sc > bd2) { bd2 = sc; p = v; } } p = p.clone(); }
    items.push({ t: g.t, p, node: best.userData.n, id: D[best.userData.id].id });
  }
  return items;
}
function interiorItems(m) {
  const A = m.userData.inAxis; if (!A) return [];
  const camDir = ctl.target.clone().sub(cam.position).normalize(), right = V3().crossVectors(camDir, V3(0, 1, 0)).normalize();
  const P = (v, k) => { const q = A.at(v); return q.c.add(right.clone().multiplyScalar(k * q.r)); };
  return [['Articular cartilage', .985, -.35], ['Epiphysis (spongy bone · red marrow)', .93, .15], ['Epiphyseal line', .86, -.3], ['Metaphysis', .8, .55],
    ['Diaphysis', .58, -.98], ['Medullary cavity (yellow marrow)', .45, 0], ['Compact bone', .35, .5], ['Periosteum', .25, -.95], ['Epiphysis (ปลายล่าง)', .06, .2]]
    .map(([t, v, k]) => ({ t, p: P(v, k), part: t, node: m.userData.n, dirv: right.clone().multiplyScalar(k >= 0 ? 1 : -1) }));
}
function project(p, r) { const v = p.clone().project(cam); return { x: (v.x + 1) / 2 * r.width, y: (1 - v.y) / 2 * r.height, z: v.z }; }
const occ = new THREE.Raycaster(); let occDirty = true;
const SVGNS = 'http://www.w3.org/2000/svg';
const pinGroup = new THREE.Group(); scene.add(pinGroup);
const NEEDLE = new THREE.CylinderGeometry(1, .35, 1, 8, 1).translate(0, .5, 0), HEADG = new THREE.SphereGeometry(1, 18, 14);
const needleMat = new THREE.MeshLambertMaterial({ color: 0xd8dce2 }), headMat = new THREE.MeshLambertMaterial({ color: 0xff4436, emissive: 0x330400 }), headFoc = new THREE.MeshLambertMaterial({ color: 0xff9f43, emissive: 0x3a1c00 });
const UPY = V3(0, 1, 0), m3 = new THREE.Matrix3();
function normalAt(mesh, p) { // normal ของจุดบนผิวที่ใกล้ p ที่สุด (world)
  const g = mesh.geometry, pa = g.attributes.position, na = g.attributes.normal; if (!na) return null;
  const lp = mesh.worldToLocal(p.clone()), t = V3(); let best = 1e30, bi = 0;
  for (let i = 0; i < pa.count; i++) { const d = t.fromBufferAttribute(pa, i).distanceToSquared(lp); if (d < best) { best = d; bi = i; } }
  return t.fromBufferAttribute(na, bi).applyMatrix3(m3.getNormalMatrix(mesh.matrixWorld)).normalize().clone();
}
function pinLen() { const s = visBox.getSize(V3()); return Math.min(Math.max(s.x, s.y, s.z) * .075, .045); }
function placePin(it, i) {
  const L = pinLen() * [1, 1.5, 2][i % 3], m = byName[it.node];
  let n = it.dirv ? it.dirv.clone() : m ? normalAt(m, it.p) : null;
  if (!n) n = it.p.clone().sub(visBox.getCenter(V3())).normalize();
  if (!it.dirv) n.add(V3(0, .25, 0)).normalize(); // เอียงขึ้นเล็กน้อยให้อ่านง่าย
  const q = new THREE.Quaternion().setFromUnitVectors(UPY, n), r = L * .035, hr = L * .11;
  it.needle.position.copy(it.p); it.needle.quaternion.copy(q); it.needle.scale.set(r, L, r);
  it.headP = it.p.clone().addScaledVector(n, L); it.head.position.copy(it.headP); it.head.scale.setScalar(hr); it.hr = hr;
}
function textSprite(t, foc) {
  const fs = 56, pad = 22, c = document.createElement('canvas'), x = c.getContext('2d'); x.font = `600 ${fs}px Inter, "IBM Plex Sans Thai", sans-serif`;
  const w = Math.ceil(x.measureText(t).width) + pad * 2, h = fs + pad * 1.3; c.width = w; c.height = h;
  x.font = `600 ${fs}px Inter, "IBM Plex Sans Thai", sans-serif`; x.fillStyle = foc ? '#ff9f43' : 'rgba(246,246,248,.96)';
  x.beginPath(); x.roundRect(0, 0, w, h, h * .28); x.fill(); x.fillStyle = foc ? '#1a1006' : '#111'; x.textBaseline = 'middle'; x.fillText(t, pad, h / 2 + 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; tex.generateMipmaps = true;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }));
  sp.center.set(-.12, .5); sp.userData.aspect = w / h; return sp;
}
function sizeSprite(it) { const h = pinLen() * .5; it.spr.scale.set(h * it.spr.userData.aspect, h, 1); it.spr.position.copy(it.headP); }
function buildLabelDom() {
  lblBox.textContent = ''; svg.textContent = ''; pinGroup.traverse(o => o.material?.map?.dispose()); pinGroup.clear();
  labelItems.forEach((it, i) => {
    it.needle = new THREE.Mesh(NEEDLE, needleMat); it.head = new THREE.Mesh(HEADG, headMat); it.needle.raycast = it.head.raycast = () => { };
    pinGroup.add(it.needle, it.head); placePin(it, i);
    it.spr = textSprite(it.t, false); it.spr.userData.item = it; pinGroup.add(it.spr); sizeSprite(it);
  });
}
function updateOcclusion() {
  const vis = visibleList(); occDirty = false;
  if (vis.length > 80) { labelItems.forEach(it => it.hidden = false); return; } // ทั้งตัว: ข้ามเพื่อความลื่น
  labelItems.forEach(it => { const tp = it.headP || it.p, dir = tp.clone().sub(cam.position), dl = dir.length(); occ.set(cam.position, dir.normalize()); occ.far = dl; const h = occ.intersectObjects(vis, false).find(h => !st.interior || clip.distanceToPoint(h.point) >= 0); it.hidden = !!h && h.distance < dl - Math.max(.004, dl * .012); });
}
function drawLabels() {
  if (!st.labels || !root) { if (labelItems.length) { pinGroup.clear(); labelItems = []; } return; }
  if (labelsDirty) { labelItems = landmarkItems(); labelsDirty = false; buildLabelDom(); }
  else if (st.interior) { const fresh = landmarkItems(); fresh.forEach((f, i) => { const it = labelItems[i]; if (it) { it.p = f.p; it.dirv = f.dirv; placePin(it, i); sizeSprite(it); } }); }
  if (occDirty && !moving) { updateOcclusion(); labelItems.forEach(it => { it.spr.material.opacity = it.hidden ? .3 : 1; it.spr.renderOrder = it.hidden ? 1 : 3; }); }
  labelItems.forEach(it => {
    const foc = !!(st.focus && st.focus === it.part);
    if (it._foc !== foc) { it._foc = foc; it.head.material = foc ? headFoc : headMat; it.head.scale.setScalar(it.hr * (foc ? 1.35 : 1));
      const old = it.spr; it.spr = textSprite(it.t, foc); it.spr.userData.item = it; pinGroup.remove(old); old.material.map.dispose(); pinGroup.add(it.spr); sizeSprite(it); it.spr.renderOrder = foc ? 2 : 1; }
  });
}
function labelClick(it) {
  if (it.part) { setFocus(st.focus === it.part ? null : it.part); return; }
  if (it.node) { if (['all', 'axial', 'appendicular'].includes(st.scope) && !st.iso) { const top = TOP[D[it.id].sec]; return openScope(top, { side: byName[it.node].userData.side || st.side }); } openEntry(it.id, st.iso ? it.node : null, { keepScope: 1 }); }
}
function setFocus(name) {
  st.focus = name; applyColor(); drawLabels(); dirty = true;
  $$('#panel [data-part]').forEach(e => e.classList.toggle('foc', e.dataset.part === name));
  const el = $(`#panel [data-part="${CSS.escape(name || '')}"]`); el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ---------- panel ---------- */
const BOOK_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/></svg>';
const pgBtns = (pg, name) => (pg || []).length ? `<div class="bookcard"><div class="bc-ic">${BOOK_IC}</div><div class="bc-tx"><b>เปิดสมุดสรุป</b><p>กดแล้วจะเปิดไปยังหน้าที่อธิบายเกี่ยวกับ <strong>${esc(name)}</strong> ในสมุด</p><div class="bc-pg">${pg.map(p => `<button class="pg press" data-pg="${p}">หน้า ${p}</button>`).join('')}</div></div></div>` : '';
const sec = (t, body) => body ? `<section><h4>${t}</h4>${body}</section>` : '';
const ul = a => a?.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
function legendHTML() {
  const sw = `<div class="cswitch">${COLOR_MODES.map(c => `<button class="press" data-cmode="${c[0]}">${c[0] === 'off' ? 'ปิดสี' : c[1]}</button>`).join('')}</div>`;
  if (st.color !== 'parts') return sec('สี', sw + (st.color === 'axap' ? '<div class="legend"><button><i style="background:#4aa3ff"></i>Axial · กระดูกแกน</button><button><i style="background:#ff6b6b"></i>Appendicular · ระยางค์</button></div>' : ''));
  const s = new Set(); visibleList().forEach(m => (m.userData.regions || []).forEach(r => r && s.add(r)));
  const multiT = visibleList().some(m => m.userData.id === 'temporal') && !(st.iso && st.iso.length === 1);
  if (multiT) visibleList().filter(m => m.userData.id === 'temporal').forEach(m => m.userData.regions.forEach(r => s.delete(r)));
  const extra = multiT ? `<button data-part="Temporal bones"><i style="background:#e04a3f"></i>Temporal</button>` : '';
  if (!s.size && !extra) return sec('สี', sw); return sec('สี', sw + `<div class="legend">${extra}${[...s].sort((a, b) => a - b).map(i => `<button data-part="${esc(LMJ.regions[i][0])}"><i style="background:${LMJ.regions[i][1]}"></i>${esc(LMJ.regions[i][0])}</button>`).join('')}</div>`);
}
function renderPanel() {
  let h = '';
  if (st.lesson) {
    const l = LESSONS.find(x => x.id === st.lesson);
    h = `<header><div class="kicker">บทเรียน</div><h2>${l.t}</h2></header>${pgBtns(l.pg, l.t)}<div class="prose">${l.html}</div>`;
    if (l.iso) h += `<div class="note">กำลังแสดง ${esc(D[l.iso].en)} (${SIDE_TH[st.side]}) ${st.interior ? '· ภาพตัดภายใน' : ''}</div>`;
  } else if (st.entry) {
    const d = D[st.entry], single = st.iso?.length === 1 ? st.iso[0] : null;
    const title = single && !/^(humerus|femur)/.test('') ? nodeTitle(single) : d.en;
    h = `<header><div class="kicker">${esc(SEC[d.sec]?.t || '')}</div><h2>${esc(title)}</h2><p class="th">${esc(d.th)}${single && title !== d.en ? ' · ' + esc(d.en) : ''}</p>
      <div class="facts"><span><b>${esc(d.n)}</b> ชิ้น</span><span class="${d.g}">${d.g === 'ax' ? 'Axial · กระดูกแกน' : 'Appendicular · ระยางค์'}</span></div></header>${pgBtns(d.pg, d.en)}`;
    if (!st.iso) h += `<div class="note">โมเดล BodyParts3D ไม่มีชิ้นนี้ — แสดงเฉพาะข้อมูล</div>`;
    if (d.long && st.iso?.length === 1) h += `<button class="wide press ${st.interior ? 'on' : ''}" id="pInterior">${st.interior ? 'กลับไปดูภายนอก' : 'ดูภายใน (ภาพตัดกระดูก)'}</button>`;
    if (st.iso && st.iso.length > 1) h += `<div class="note">แตะชิ้นใดชิ้นหนึ่งบนโมเดลเพื่อแยกออกมาดูเดี่ยว ๆ</div>`;
    h += sec('ตำแหน่ง', `<p>${esc(d.loc)}</p>${d.desc ? `<p>${esc(d.desc)}</p>` : ''}`);
    if (st.interior) h += sec('โครงสร้างภายใน (สมุดหน้า 6)', `<ol class="parts">${interiorItems(byName[st.iso[0]]).map(i => `<li><button data-part="${esc(i.t)}"><b>${esc(i.t)}</b></button></li>`).join('')}</ol>`);
    else if (d.parts.length) h += sec('ส่วนประกอบ', `<ol class="parts">${d.parts.map(([a, b]) => `<li><button data-part="${esc(a)}"><b>${esc(a)}</b>${b ? `<span>${esc(b)}</span>` : ''}</button></li>`).join('')}</ol>`);
    h += sec('เชื่อมกับ / ชนิดข้อต่อ', d.con.length ? `<ul class="con">${d.con.map(([t, j, n]) => `<li><a href="#" data-go="${t}">${esc(D[t]?.en || t)}</a>${j ? `<em>${esc(j)}</em>` : ''}${n ? ` ${esc(n)}` : ''}</li>`).join('')}</ul>` : '');
    h += sec('สิ่งที่ลอดผ่าน', ul(d.pass)) + sec('คลินิก', ul(d.clin)) + (d.tip.length ? sec('Tip', d.tip.map(t => `<p class="tip">${esc(t)}</p>`).join('')) : '');
    h += legendHTML();
  } else {
    const s = SEC[st.scope]; const ids = DATA.filter(d => inSec(st.scope, d.id) && !['all', 'axial', 'appendicular'].includes(st.scope));
    h = `<header><div class="kicker">${s.parent ? esc(SEC[s.parent].t) : 'หมวด'}</div><h2>${esc(s.t)}</h2><p class="th">${esc(s.s)}</p></header>${pgBtns(s.pg, s.t)}`;
    if (s.side) h += `<div class="seg side">${['R', 'L'].map(k => `<button data-side="${k}" class="${st.side === k ? 'on' : ''}">ข้าง${SIDE_TH[k]}</button>`).join('')}</div>`;
    h += sec('สรุปจากสมุด', ul(s.info));
    if (ids.length) h += sec('กระดูกในหมวดนี้', `<div class="chips">${ids.map(d => `<button data-go="${d.id}">${esc(d.en)}</button>`).join('')}</div>`);
    if (['all', 'axial', 'appendicular'].includes(st.scope)) h += sec('วิธีใช้', '<ul><li>แตะส่วนใดของโครงกระดูก → เปิดหมวดนั้น · แตะอีกครั้ง → แยกชิ้นออกมาดู</li><li>ลาก 1 นิ้วหมุน · บีบซูม · 2 นิ้วเลื่อน</li><li>แตะป้ายชื่อเพื่อไฮไลต์ส่วนนั้น</li></ul>');
    h += legendHTML();
  }
  h += `<footer>โมเดล: BodyParts3D, © The Database Center for Life Science, CC BY 4.0 · เนื้อหา: สมุดสรุป Anatomy เล่ม 2 บทที่ 3</footer>`;
  const pb = $('#pbody'); pb.innerHTML = h; pb.scrollTop = 0; pb.classList.remove('enter'); void pb.offsetWidth; pb.classList.add('enter');
  $('#pInterior')?.addEventListener('click', toggleInterior);
}
$('#pbody').addEventListener('click', e => {
  const t = e.target.closest('[data-go],[data-part],[data-pg],[data-side],[data-cmode]'); if (!t) return; e.preventDefault();
  if (t.dataset.cmode) return setColor(t.dataset.cmode);
  if (t.dataset.go) openEntry(t.dataset.go, null, {});
  else if (t.dataset.part) setFocus(st.focus === t.dataset.part ? null : t.dataset.part);
  else if (t.dataset.pg) openBook(+t.dataset.pg, bookTarget().name);
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
$('#menu').onclick = () => navToggle();
$('#scrim').onclick = () => document.body.classList.remove('navopen');

/* ---------- tool dock ---------- */
const COLOR_MODES = [['parts', 'แยกส่วน', 'ระบายสีแต่ละส่วนตามสมุด'], ['axap', 'แกน/ระยางค์', 'ฟ้า = กระดูกแกน (axial) · แดง = ระยางค์ (appendicular)'], ['off', 'ปิด', 'สีงาช้างทั้งหมด']];
let colorMode = 'parts'; // แบบสีที่เลือกไว้ (ใช้ตอนเปิดสี)
function setColor(c) { st.color = c; if (c !== 'off') colorMode = c; applyColor(); renderPanel(); syncDock(); const m = COLOR_MODES.find(x => x[0] === c); toast(c === 'off' ? 'ปิดสี' : 'เปิดสี: ' + m[1], m[2]); }
function bookTarget() {
  if (st.lesson) { const l = LESSONS.find(x => x.id === st.lesson); return { pg: l.pg[0], name: l.t }; }
  if (st.entry) return { pg: (D[st.entry].pg || [])[0], name: D[st.entry].en };
  return { pg: (SEC[st.scope].pg || [2])[0], name: SEC[st.scope].t };
}
function syncDock() {
  const set = (id, on, sub) => { const b = $(id); b.classList.toggle('on', !!on); b.querySelector('small').textContent = sub; };
  set('#tLabels', st.labels, st.labels ? 'เปิด' : 'ปิด');
  $$('[data-cmode]').forEach(b => b.classList.toggle('on', b.dataset.cmode === st.color));
  set('#tColor', st.color !== 'off', st.color === 'off' ? 'ปิด' : COLOR_MODES.find(c => c[0] === st.color)[1]);
  set('#tInterior', st.interior, st.canInterior ? (st.interior ? 'เปิด' : 'ปิด') : 'กระดูกยาว');
  $('#tInterior').classList.toggle('na', !st.canInterior);
  const bt = bookTarget(); set('#tBook', false, bt.pg ? 'หน้า ' + bt.pg : '—');
}
$('#tLabels').onclick = () => { st.labels = !st.labels; labelsDirty = true; frame(visibleList()); syncDock(); toast(st.labels ? 'เปิดหมุดชื่อ' : 'ปิดหมุดชื่อ', st.labels ? 'หมุดปักบนกระดูกบอกชื่อแต่ละส่วน · แตะชื่อเพื่อไฮไลต์' : 'ซ่อนหมุดทั้งหมด'); };
$('#tColor').onclick = () => setColor(st.color === 'off' ? colorMode : 'off');
$('#tInterior').onclick = toggleInterior;
$('#tBook').onclick = () => { const bt = bookTarget(); if (!bt.pg) return; openBook(bt.pg, bt.name); };
const dock = $('#dock'), LS = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { } };
function placeDock(y) { // y = ตำแหน่งบนสุดของแถบ (px จากบน stage)
  const r = stageRect(), h = dock.offsetHeight; y = Math.max(8, Math.min(r.height - h - 8, y)); dock.style.top = y + 'px'; dock.style.bottom = 'auto'; dock.style.transform = 'none'; return y;
}
{ const y = +LS('hn-docky'); const dh = LS('hn-dockhide'); if (dh === '1' || (dh === null && innerWidth < 760)) dock.classList.add('hid'); requestAnimationFrame(() => { if (y) placeDock(y); invalidate(); viewOff(); }); }
let dd = null;
$('#dkGrip').addEventListener('pointerdown', e => { dd = { y: e.clientY, t: dock.offsetTop }; dock.classList.add('drag'); e.currentTarget.setPointerCapture(e.pointerId); });
$('#dkGrip').addEventListener('pointermove', e => { if (dd) placeDock(dd.t + e.clientY - dd.y); });
$('#dkGrip').addEventListener('pointerup', e => { if (!dd) return; dock.classList.remove('drag'); const y = placeDock(dd.t + e.clientY - dd.y); LS('hn-docky', y | 0); dd = null; invalidate(); viewOff(); });
$('#dkHide').onclick = () => { const h = dock.classList.toggle('hid'); LS('hn-dockhide', h ? '1' : '0'); setTimeout(() => { placeDock(dock.offsetTop); invalidate(); viewOff(); frame(visibleList()); }, 10); toast(h ? 'ซ่อนแถบเครื่องมือ' : 'แสดงแถบเครื่องมือ', h ? 'กดปุ่ม "เครื่องมือ" เพื่อเปิดอีกครั้ง' : 'ลากที่แถบจับด้านบนเพื่อย้ายขึ้นลง'); };
$('#dkShow').onclick = () => $('#dkHide').click();
function navToggle() {
  if (innerWidth < 1100) { document.body.classList.toggle('navopen'); return; }
  const h = document.body.classList.toggle('navhide'); LS('hn-navhide', h ? '1' : '0'); toast(h ? 'ซ่อนแถบสารบัญ' : 'แสดงแถบสารบัญ', h ? 'กดปุ่ม ☰ มุมซ้ายบนเพื่อเปิดอีกครั้ง' : '');
}
if (LS('hn-navhide') === '1') document.body.classList.add('navhide');
// แถบมุมมอง: ซ่อน/แสดง
const vb = $('#viewbar');
function setVB(h, quiet) { vb.classList.toggle('hid', h); LS('hn-vbhide', h ? '1' : '0'); setTimeout(() => { invalidate(); viewOff(); frame(visibleList()); }, 20); if (!quiet) toast(h ? 'ซ่อนแถบมุมมอง' : 'แสดงแถบมุมมอง', h ? 'กด "มุมมอง" ด้านล่างเพื่อเปิดอีกครั้ง' : ''); }
if (LS('hn-vbhide') === '1') vb.classList.add('hid');
$('#vbHide').onclick = e => { e.stopPropagation(); setVB(true); };
$('#vbShow').onclick = e => { e.stopPropagation(); setVB(false); };
// โหมดเต็มจอ: ซ่อนสารบัญ + เครื่องมือ + มุมมอง ในครั้งเดียว
function syncFocusBtn() { const all = vb.classList.contains('hid') && dock.classList.contains('hid') && (document.body.classList.contains('navhide') || innerWidth < 1100); $('#focusBtn').classList.toggle('on', all); }
$('#focusBtn').onclick = () => {
  const on = !$('#focusBtn').classList.contains('on');
  document.body.classList.toggle('navhide', on && innerWidth >= 1100); document.body.classList.remove('navopen'); LS('hn-navhide', on ? '1' : '0');
  dock.classList.toggle('hid', on); LS('hn-dockhide', on ? '1' : '0'); setVB(on, true);
  setTimeout(() => { placeDock(dock.offsetTop); syncFocusBtn(); }, 30);
  toast(on ? 'โหมดเต็มจอ' : 'แสดงแถบทั้งหมด', on ? 'ซ่อนสารบัญ เครื่องมือ และมุมมอง · กดปุ่มเดิมเพื่อแสดงกลับ' : '');
};
setInterval(syncFocusBtn, 800);
let toastT = 0;
function toast(t, sub = '') { const e = $('#toast'); e.innerHTML = `<b>${esc(t)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}`; e.classList.remove('show'); void e.offsetWidth; e.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('show'), 2200); }
// ripple ตอนกดปุ่ม
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.press,.dk,.nb,.chips button,.parts button,.legend button,#viewbar button,#crumbs button,.lbl'); if (!b) return;
  const r = b.getBoundingClientRect(), d = document.createElement('i'); d.className = 'rip'; const sz = Math.max(r.width, r.height) * 1.6;
  d.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px`; b.appendChild(d); setTimeout(() => d.remove(), 520);
}, { passive: true });

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
function openBook(p, name) { bookPg = p; zoom = 1; const b = $('#book'); b.hidden = false; b.classList.remove('in'); void b.offsetWidth; b.classList.add('in'); $('#bfor').textContent = name ? 'อธิบาย ' + name : ''; showPage(); }
function showPage() { const img = $('#bimg'); img.src = `book/p-${String(bookPg).padStart(2, '0')}.jpg`; img.style.width = (zoom * 100) + '%'; $('#bnum').textContent = `หน้า ${bookPg} / ${NB}`; $('#bscroll').scrollTop = 0; }
$('#bprev').onclick = () => { if (bookPg > 1) { bookPg--; showPage(); } };
$('#bnext').onclick = () => { if (bookPg < NB) { bookPg++; showPage(); } };
$('#bzin').onclick = () => { zoom = Math.min(3, zoom + .5); showPage(); };
$('#bzout').onclick = () => { zoom = Math.max(1, zoom - .5); showPage(); };
$('#bclose').onclick = () => { const b = $('#book'); b.classList.remove('in'); b.classList.add('out'); setTimeout(() => { b.hidden = true; b.classList.remove('out'); }, 200); };
addEventListener('keydown', e => { if ($('#book').hidden) return; if (e.key === 'ArrowRight') $('#bnext').click(); if (e.key === 'ArrowLeft') $('#bprev').click(); if (e.key === 'Escape') $('#bclose').click(); });

/* ---------- bottom sheet (มือถือ) ---------- */
const panel = $('#panel'), LV = [.3, .55, .9]; let lv = 0, dr = null;
function setLv(i) { lv = i; panel.style.height = innerWidth < 760 ? LV[i] * 100 + 'dvh' : ''; setTimeout(() => { invalidate(); viewOff(); }, 260); }
$('#grab').addEventListener('pointerdown', e => { if (innerWidth >= 760) return; dr = { y: e.clientY, h: panel.getBoundingClientRect().height }; panel.classList.add('drag'); e.currentTarget.setPointerCapture(e.pointerId); });
$('#grab').addEventListener('pointermove', e => { if (dr) panel.style.height = Math.max(innerHeight * .15, Math.min(innerHeight * .92, dr.h + dr.y - e.clientY)) + 'px'; });
$('#grab').addEventListener('pointerup', e => { if (!dr) return; panel.classList.remove('drag'); const f = panel.getBoundingClientRect().height / innerHeight; if (Math.abs(e.clientY - dr.y) < 6) setLv((lv + 1) % 3); else { let b = 0; LV.forEach((v, i) => { if (Math.abs(v - f) < Math.abs(LV[b] - f)) b = i; }); setLv(b); } dr = null; });
addEventListener('resize', () => setLv(lv));

/* ---------- touch lock ---------- */
document.addEventListener('touchmove', e => { if (!e.target.closest('.scroll')) e.preventDefault(); }, { passive: false });
['gesturestart', 'gesturechange', 'gestureend', 'dblclick'].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));

/* ---------- loop: เรนเดอร์เฉพาะเมื่อมีการเปลี่ยนแปลง ---------- */
R.setAnimationLoop(() => {
  if (tw) { let k = Math.min(1, (performance.now() - tw.t0) / 550); k = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; ctl.target.lerpVectors(tw.ft, tw.t, k); cam.position.lerpVectors(tw.fp, tw.p, k); if (k >= 1) { tw = null; occDirty = true; } motion(); dirty = true; }
  ctl.update();
  if (!dirty) return; dirty = false;
  if (st.interior && st.iso) { const m = byName[st.iso[0]]; const c = m.userData.inAxis ? m.userData.inAxis.at(.5).c : visBox.getCenter(V3()); const n = ctl.target.clone().sub(cam.position).normalize(); clip.setFromNormalAndCoplanarPoint(n, c); }
  R.render(scene, cam); drawLabels();
});
window.__humnoi = { R, st, meshes, byName, cam, ctl, openEntry, openScope, setFocus, frame, visibleList, DIRS, labelItems: () => labelItems };
