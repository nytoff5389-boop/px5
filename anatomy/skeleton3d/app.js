import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { DATA, SECS, LESSONS } from './data.js?v=1795691728';
import { MDATA, MSECS, MLESSONS } from './data_m.js?v=1795691728';

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const D = Object.fromEntries([...DATA, ...MDATA].map(d => [d.id, d])), SEC = Object.fromEntries([...SECS, ...MSECS].map(s => [s.id, s]));
const isMus = id => typeof id === 'string' && id.startsWith('m_'), isMusSec = id => typeof id === 'string' && id.startsWith('m-'), isMusLesson = id => MLESSONS.some(l => l.id === id);
let MODE = 'bone', LESS = LESSONS; // โหมด: กระดูก / กล้ามเนื้อ
const rootSec = () => MODE === 'mus' ? 'm-all' : 'all', isWide = s => ['all', 'axial', 'appendicular', 'm-all'].includes(s);
// กระดูกที่มีกล้ามเนื้อเกาะ (ใช้แสดงในแผงข้อมูลกระดูก)
const BONE_MUS = {}; MDATA.forEach(m => m.con.forEach(([b]) => (BONE_MUS[b] = BONE_MUS[b] || []).includes(m.id) || BONE_MUS[b].push(m.id)));
const BACK_VIEW = new Set(['m-back', 'm-glute', 'm_trapezius', 'm_latissimus_dorsi', 'm_rhomboid_minor', 'm_rhomboid_major', 'm_levator_scapulae', 'm_supraspinatus', 'm_infraspinatus', 'm_teres_major', 'm_teres_minor', 'm_triceps_brachii', 'm_biceps_femoris', 'm_semitendinosus', 'm_semimembranosus', 'm_gastrocnemius', 'm_soleus', 'm_spinalis', 'm_longissimus', 'm_iliocostalis', 'm_gluteus_maximus', 'm_gluteus_medius', 'm_gluteus_minimus', 'm_piriformis', 'm_extensor_digitorum', 'm_supinator', 'm_extensor_pollicis_longus', 'm_extensor_pollicis_brevis', 'm_tibialis_posterior']);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const IVORY = new THREE.Color(0xe9e2d0), AXC = new THREE.Color(0x4aa3ff), APC = new THREE.Color(0xff6b6b), HI = new THREE.Color(0xff9f43);
const LONG = ['humerus', 'radius', 'ulna', 'femur', 'tibia', 'fibula'];
const SIDE_TH = { L: 'ซ้าย', R: 'ขวา' };

/* ---------- node naming ---------- */
function parseNode(n) {
  if (n.startsWith('m_')) { const sm = n.match(/_([LR])$/), b = sm ? n.slice(0, -2) : n, [id, head] = b.split('__'); return { id: D[id] ? id : null, side: sm ? sm[1] : '', head: head || '' }; }
  const m = n.match(/^(.*?)(?:_([LR]))?$/), b = m[1], side = m[2] || ''; let v, id = b;
  if ((v = b.match(/^vert_([CTL])(\d+)$/))) id = v[1] === 'C' ? (v[2] === '1' ? 'c1' : v[2] === '2' ? 'c2' : 'cervical') : v[1] === 'T' ? 'thoracic' : 'lumbar';
  else if (/^disc_/.test(b)) id = 'disc'; else if (/^(rib|costal_cartilage)_\d+$/.test(b)) id = 'rib';
  else if ((v = b.match(/^(metacarpal|metatarsal|cuneiform)_\d+$/))) id = v[1]; else if ((v = b.match(/^phalanx_([hf])_/))) id = 'phalanx_' + v[1];
  return { id: D[id] ? id : null, side };
}
const FING = ['นิ้วโป้ง', 'นิ้วชี้', 'นิ้วกลาง', 'นิ้วนาง', 'นิ้วก้อย'], TOE = ['นิ้วโป้งเท้า', 'นิ้วที่ 2', 'นิ้วที่ 3', 'นิ้วที่ 4', 'นิ้วก้อยเท้า'];
const headTitle = h => h ? h.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()) : '';
function nodeTitle(n) {
  let v; const { side, id: pid, head } = parseNode(n), s = side ? ` (${SIDE_TH[side]})` : '';
  if (isMus(pid)) return D[pid].en + (head ? ' · ' + headTitle(head) : '') + s;
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
    case 'all': return d.g !== 'mu'; case 'm-all': return d.g === 'mu'; case 'axial': return d.g === 'ax'; case 'appendicular': return d.g === 'ap';
    case 'skull': return ['skull', 'facial', 'cranial'].includes(d.sec);
    case 'thorax': return ['sternum', 'rib', 'thoracic'].includes(id);
    case 'upper': return d.sec === 'upper' || d.sec === 'hand';
    case 'lower': return d.sec === 'lower' || d.sec === 'foot';
    case 'pelvis': return d.sec === 'pelvis' || id === 'sacrum' || id === 'coccyx';
    default: return d.sec === sec;
  }
}
const TOP = { ...Object.fromEntries(MSECS.filter(s => s.id !== 'm-all').map(s => [s.id, s.id])), skull: 'skull', facial: 'skull', cranial: 'skull', spine: 'spine', thorax: 'thorax', shoulder: 'shoulder', upper: 'upper', hand: 'upper', pelvis: 'pelvis', lower: 'lower', foot: 'lower' };

/* ---------- three setup ---------- */
const stage = $('#stage'), cvs = $('#cvs');
const R = new THREE.WebGLRenderer({ canvas: cvs, antialias: true });
const PR_IDLE = Math.min(devicePixelRatio, 2); let PR_MOVE = Math.min(devicePixelRatio, 2); // ปรับตามความเร็วเครื่องจริง
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
let lastT = 0, slow = 0, fast = 0;
function adapt(now) { // ถ้าหมุนแล้วเฟรมช้ากว่า ~45fps ค่อย ๆ ลดความละเอียด ถ้าเร็วพอค่อย ๆ เพิ่มกลับ
  const dt = now - lastT; lastT = now; if (!moving || dt > 100) return;
  if (dt > 22) { slow++; fast = 0; } else if (dt < 15) { fast++; slow = 0; }
  if (slow > 6 && PR_MOVE > 1) { PR_MOVE = Math.max(1, +(PR_MOVE - .25).toFixed(2)); setPR(PR_MOVE); slow = 0; }
  if (fast > 40 && PR_MOVE < PR_IDLE) { PR_MOVE = Math.min(PR_IDLE, +(PR_MOVE + .25).toFixed(2)); setPR(PR_MOVE); fast = 0; }
}
function motion() { // ระหว่างหมุนใช้ความละเอียดที่เครื่องไหว แล้วคืนค่าเต็มเมื่อหยุด
  moving = true; setPR(PR_MOVE); clearTimeout(idleT);
  idleT = setTimeout(() => { moving = false; setPR(PR_IDLE); occDirty = true; dirty = true; }, 220);
}
ctl.addEventListener('change', () => { need(); motion(); });

let LMJ = { landmarks: {}, regions: [] }, meshes = [], byName = {}, root = null, boneMeshes = [], musMeshes = [], musRoot = null, musLoading = null;
let LSTYLE = 'pin'; try { LSTYLE = localStorage.getItem('hn-lstyle') || 'pin'; } catch (e) { }
const st = { peel: false, peeled: new Set(), boneCtx: true, lstyle: LSTYLE, scope: 'all', side: 'R', iso: null, entry: null, lesson: null, labels: true, color: 'parts', interior: false, focus: null, hist: [] };

/* ---------- load ---------- */
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
const PRE = window.HN_PRE, SPL = window.HN_SPLASH;
Promise.all([fetch('landmarks.json?v=1795691728').then(r => r.json()).catch(() => LMJ), PRE ? PRE.skel.then(b => loader.parseAsync(b, '')) : loader.loadAsync('skeleton.glb?v=1795691728')]).then(([lm, g]) => {
  LMJ = lm; root = g.scene; scene.add(root); root.updateMatrixWorld(true);
  root.traverse(o => prepMesh(o, meshes));
  boneMeshes = meshes.slice();
  buildNav(); route(location.hash, true);
  if (SPL) requestAnimationFrame(() => SPL.ready()); else { $('#loading')?.classList.add('done'); setTimeout(() => $('#loading')?.remove(), 400); }
}).catch(e => { if (SPL) SPL.error(e); else if ($('#loading')) $('#loading').textContent = 'โหลดโมเดลไม่สำเร็จ: ' + e.message; });
// สีกล้ามเนื้อ: แต่ละมัดคนละสี (แยกมัด) / สีกล้ามเนื้อจริง
const MUS_REAL = new THREE.Color(0xb5483f), MUS_PAL = ['#e5604f', '#f0a04b', '#e8c547', '#7cc47f', '#4fb3c9', '#5b8def', '#9b7bea', '#e56fb3', '#d9785b', '#6fd1a7', '#c7a5f2', '#f2b880'];
const musColor = id => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return new THREE.Color(MUS_PAL[h % MUS_PAL.length]); };
function loadMuscles() {
  if (musLoading) return musLoading;
  if (!(PRE && PRE.musDone())) toast('กำลังโหลดกล้ามเนื้อ…', 'ครั้งแรกใช้เวลาสักครู่');
  musLoading = Promise.all([fetch('m_landmarks.json?v=1795691728').then(r => r.json()), (PRE ? PRE.mus.then(b => b ? loader.parseAsync(b, '') : loader.loadAsync('muscles.glb?v=1795691728')) : loader.loadAsync('muscles.glb?v=1795691728'))]).then(([lm, g]) => {
    Object.assign(LMJ.landmarks, lm.landmarks); musRoot = g.scene; scene.add(musRoot); musRoot.updateMatrixWorld(true);
    musRoot.traverse(o => prepMesh(o, musMeshes)); musMeshes.forEach(m => { m.userData.mus = true; m.renderOrder = 1; });
  });
  return musLoading;
}
function prepMesh(o, list) {
    if (!o.isMesh) return; const n = o.name; const p = parseNode(n);
    if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    o.material = o.userData_mat = new THREE.MeshStandardMaterial({ color: IVORY, roughness: .5, metalness: 0 });
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
    o.userData = { n, id: p.id, side: p.side, head: p.head }; list.push(o); byName[n] = o;
    // anchor = จุดบนผิวที่ใกล้ centroid
    const pa = o.geometry.attributes.position, c = V3(), t = V3(); const step = Math.max(1, pa.count / 3000 | 0); let k = 0;
    for (let i = 0; i < pa.count; i += step) { c.add(t.fromBufferAttribute(pa, i)); k++; } c.divideScalar(k);
    let best = 1e9, bi = 0; for (let i = 0; i < pa.count; i += step) { const d = t.fromBufferAttribute(pa, i).distanceToSquared(c); if (d < best) { best = d; bi = i; } }
    o.userData.anchor = o.localToWorld(t.fromBufferAttribute(pa, bi).clone()); o.userData.center = o.localToWorld(c.clone());
    const st2 = Math.max(1, pa.count / 400 | 0), sp = []; for (let i = 0; i < pa.count; i += st2) sp.push(o.localToWorld(t.fromBufferAttribute(pa, i).clone())); o.userData.samples = sp;
    const rg = o.geometry.attributes._region; if (rg) { const s = new Set(); for (let i = 0; i < rg.count; i += step) s.add(rg.getX(i)); o.userData.regions = [...s]; }
}
// สลับโหมด กระดูก ↔ กล้ามเนื้อ
const boneCtxMat = new THREE.MeshStandardMaterial({ color: 0xd9d2c0, roughness: .6 });
async function setMode(m) {
  if (m === MODE) return;
  if (m === 'mus') { try { await loadMuscles(); } catch (e) { toast('โหลดกล้ามเนื้อไม่สำเร็จ', e.message); return; } }
  MODE = m; LESS = m === 'mus' ? MLESSONS : LESSONS; meshes = m === 'mus' ? musMeshes : boneMeshes;
  document.body.classList.toggle('mode-mus', m === 'mus'); $('#brandSub').textContent = m === 'mus' ? 'ระบบกล้ามเนื้อ · บทที่ 4' : 'ระบบกระดูกโครงร่าง · บทที่ 3'; $$('#modeSeg [data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  st.hist = []; st.peeled.clear(); st.peel = false; st.interior = false;
  boneMeshes.forEach(b => { b.userData.ck = null; if (m === 'mus') { b.material = boneCtxMat; b.visible = st.boneCtx; } else { b.material = b.userData_mat; b.visible = true; } });
  musMeshes.forEach(x => { x.visible = m === 'mus'; x.userData.ck = null; });
  buildNav();
}
$$('#modeSeg [data-mode]').forEach(b => b.onclick = async () => {
  if (b.dataset.mode === MODE) return; await setMode(b.dataset.mode); openScope(rootSec(), { nohist: 1 });
  toast(MODE === 'mus' ? 'โหมดกล้ามเนื้อ' : 'โหมดกระดูก', MODE === 'mus' ? 'หมุดเขียว = Origin · หมุดฟ้า = Insertion · แดง = ชื่อมัด' : 'โครงกระดูก 206 ชิ้น');
});

/* ---------- visibility / colours ---------- */
let visCache = [], visBox = new THREE.Box3();
function visibleList() { return visCache; }
// ชิ้นที่ไม่ได้เลือก: ไม่ซ่อน แต่แสดงจางใส (ghost) ให้เห็นตำแหน่งในร่างกาย
const ghostMat = new THREE.MeshStandardMaterial({ color: 0xcfd4dc, roughness: .6, transparent: true, opacity: .1, depthWrite: false });
const ghostMusMat = new THREE.MeshStandardMaterial({ color: 0xe08a7c, roughness: .7, transparent: true, opacity: .16, depthWrite: false });
let ghostList = [], ghostOn = true; try { ghostOn = localStorage.getItem('hn-ghost') !== '0'; } catch (e) { }
function setVisible(pred) {
  visCache = []; ghostList = [];
  meshes.forEach(m => { const on = !!pred(m); m.visible = true; m.userData.ghost = !on;
    if (m.userData.mus && st.peeled.has(m.userData.id + m.userData.side) && !(st.iso && st.iso.includes(m.userData.n))) { m.visible = false; m.userData.ghost = true; m.userData.peeled = true; return; }
    if (on) { if (m.material === ghostMat || m.material === ghostMusMat) m.material = m.userData_mat; visCache.push(m); } else { m.material = m.userData.mus ? ghostMusMat : ghostMat; m.visible = ghostOn; if (ghostOn) ghostList.push(m); m.renderOrder = -1; } });
  if (!visCache.length) { meshes.forEach(m => { m.material = m.userData_mat; m.userData.ghost = false; }); visCache = meshes.slice(); ghostList = []; }
  visBox = boxOf(visCache);
}
function regionOf(name) { return LMJ.regions.findIndex(r => r[0].toLowerCase() === String(name).toLowerCase()); }
function applyColor() {
  if (MODE === 'mus') return applyMusColor();
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

function applyMusColor() {
  const pal = { parts: null, axap: MUS_REAL, off: new THREE.Color(0xe9e2d0) }, single = !!st.entry;
  for (const m of visCache) {
    const M = m.material, id = m.userData.id; if (M.vertexColors) { M.vertexColors = false; M.needsUpdate = true; }
    let c = id === 'm_eye_muscles' ? new THREE.Color(0xf2efe9) : (pal[st.color] || musColor(id)).clone();
    if (st.color === 'parts' && m.userData.head) { let h = 0; for (const ch of m.userData.head) h += ch.charCodeAt(0); c.offsetHSL(0, 0, ((h % 5) - 2) * .045); }
    const foc = st.focus && m.userData.head && headTitle(m.userData.head).toLowerCase() === String(st.focus).toLowerCase();
    M.color.copy(foc ? HI : c); M.emissive = M.emissive || new THREE.Color(); M.emissive.set(foc ? 0x3a1c00 : 0x000000);
    M.roughness = .62;
  }
  boneMeshes.forEach(b => { b.visible = st.boneCtx; });
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
  const sr = stage.getBoundingClientRect(); if (!list.length || sr.width < 2 || sr.height < 2) return; // ยังไม่มีพื้นที่ (กัน NaN)
  if (Math.abs(rectC?.width - sr.width) > 1 || Math.abs(rectC?.height - sr.height) > 1 || !rectC) { rectC = freeC = null; cam.aspect = sr.width / sr.height; } const b = boxOf(list), c = b.getCenter(V3()), sph = b.getBoundingSphere(new THREE.Sphere());
  const f = freeRect(), fov = cam.fov * Math.PI / 180, fw = st.labels && st.lstyle === 'line' ? .5 : .86, fh = (f.b - f.t) / f.h * (st.labels && st.lstyle === 'pin' ? .8 : .9);
  let d = (dir || cam.position.clone().sub(ctl.target)).clone(); if (!(d.lengthSq() > 1e-10) || !isFinite(d.x + d.y + d.z)) d = V3(0, 0, 1); d.normalize();
  const upv = Math.abs(d.y) > .99 ? V3(0, 0, -1) : V3(0, 1, 0), rt = V3().crossVectors(upv, d).normalize(), uu = V3().crossVectors(d, rt);
  let ex = 0, ey = 0, ez = 0; for (let i = 0; i < 8; i++) { const q = V3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).sub(c); ex = Math.max(ex, Math.abs(q.dot(rt))); ey = Math.max(ey, Math.abs(q.dot(uu))); ez = Math.max(ez, Math.abs(q.dot(d))); }
  const th = Math.tan(fov / 2), dist = (Math.max(ey / (th * fh), ex / (th * cam.aspect * fw * f.r / f.w)) + ez) * (MODE === 'mus' ? 1.18 : 1);
  if (!isFinite(dist) || dist <= 0) return;
  const p = c.clone().add(d.multiplyScalar(dist));
  ctl.minDistance = sph.radius * .3; ctl.maxDistance = dist * 4;
  if (instant) { ctl.target.copy(c); cam.position.copy(p); ctl.update(); } else tw = { t0: performance.now(), ft: ctl.target.clone(), fp: cam.position.clone(), t: c, p };
  dirty = true;
}
function resize() {
  invalidate(); const r = stageRect(); if (r.width < 2 || r.height < 2) return; R.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; viewOff();
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
function back() { const s = st.hist.pop(); if (!s) return openScope(rootSec(), { nohist: 1 }); const o = JSON.parse(s); Object.assign(st, o); render(true); }
function openScope(id, o = {}) {
  if ((isMusSec(id) ? 'mus' : 'bone') !== MODE) { setMode(isMusSec(id) ? 'mus' : 'bone').then(() => openScope(id, { ...o, nohist: 1 })); return; }
  if (!o.nohist) push(); Object.assign(st, { scope: id, iso: null, entry: null, lesson: null, interior: false, focus: null }); if (o.side) st.side = o.side; render(); }
function openEntry(id, node, o = {}) {
  if ((isMus(id) ? 'mus' : 'bone') !== MODE) { setMode(isMus(id) ? 'mus' : 'bone').then(() => openEntry(id, null, { ...o, nohist: 1 })); return; }
  if (!o.nohist) push(); const d = D[id];
  if (isMus(id) && node && byName[node]) st.side = byName[node].userData.side || st.side;
  const L = node && !isMus(id) ? [byName[node]] : nodesOfEntry(id, st.side);
  if (isMus(id)) L.forEach(m => st.peeled.delete(m.userData.id + m.userData.side));
  Object.assign(st, { entry: id, iso: L.length ? L.map(m => m.userData.n) : null, lesson: null, focus: null, interior: !!o.interior });
  if (!o.keepScope) { const s = Object.keys(TOP).find(k => k === d.sec); st.scope = s || st.scope; }
  render();
}
function openLesson(id) {
  if ((isMusLesson(id) ? 'mus' : 'bone') !== MODE) { setMode(isMusLesson(id) ? 'mus' : 'bone').then(() => openLesson(id)); return; }
  push(); const l = LESS.find(x => x.id === id); Object.assign(st, { lesson: id, entry: null, focus: null, interior: false });
  if (l.iso) { const L = nodesOfEntry(l.iso, st.side); st.entry = l.iso; st.iso = L.map(m => m.userData.n); st.interior = !!l.interior; st.lessonKeep = 1; }
  else if (l.show) { st.iso = meshes.filter(m => l.show.some(s => m.userData.n.startsWith(s))).map(m => m.userData.n); st.entry = null; }
  else st.iso = null;
  render();
}
function render(fromBack) {
  const iso = st.iso && new Set(st.iso);
  setVisible(m => iso ? iso.has(m.userData.n) : inSec(st.scope, m.userData.id) && (!SEC[st.scope]?.side || !m.userData.side || m.userData.side === st.side));
  setInterior(st.interior); applyColor(); renderPanel(); renderCrumbs(); syncNav(); syncDock(); viewOff();
  const handView = st.scope === 'hand' || (st.entry && HAND.has(st.entry)) || BACK_VIEW.has(st.entry) || (!st.entry && BACK_VIEW.has(st.scope)) || (st.entry && /ด้านหลัง/.test(D[st.entry]?.sub || ''));
  frame(visibleList(), handView ? DIRS.back : DIRS.front, false); labelsDirty = true;
  const h = st.lesson ? '#lesson/' + st.lesson : st.entry ? '#bone/' + st.entry + (st.iso?.length === 1 ? '/' + st.iso[0] : '') : '#sec/' + st.scope + '/' + st.side;
  if (location.hash !== h) history.replaceState(null, '', h);
}
function route(h, first) {
  const [k, a, b] = (h || '').replace(/^#/, '').split('/');
  if (k === 'bone' && D[a]) { if (b && byName[b]) st.side = byName[b].userData.side || st.side; openEntry(a, b && byName[b] ? b : null, { nohist: 1 }); }
  else if (k === 'lesson' && [...LESSONS, ...MLESSONS].find(l => l.id === a)) openLesson(a);
  else if (k === 'sec' && SEC[a]) { if (b) st.side = b; openScope(a, { nohist: 1 }); }
  else openScope('all', { nohist: 1 });
  if (first && MODE === 'bone') frame(visibleList(), DIRS.front, true);
}

/* ---------- tap / pick ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null, nP = 0;
cvs.addEventListener('pointerdown', e => { nP++; down = nP === 1 ? { x: e.clientX, y: e.clientY, t: performance.now() } : null; tw = null; });
cvs.addEventListener('pointermove', e => { if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) >= 8) down = null; });
const up = e => { nP = Math.max(0, nP - 1); if (!down || e.type !== 'pointerup') return down = null; const ok = performance.now() - down.t < 300; down = null; if (ok) tap(e.clientX, e.clientY); };
cvs.addEventListener('pointerup', up); cvs.addEventListener('pointercancel', up);
function pick(x, y) {
  const h = ray.intersectObjects(visibleList(), false).find(h => !st.interior || clip.distanceToPoint(h.point) >= 0)?.object;
  if (h) return h;
  const g = ray.intersectObjects(ghostList, false)[0]?.object; // แตะชิ้นจาง ๆ = ไปดูชิ้นนั้น
  if (g) g.userData.tappedGhost = true; return g;
}
function tap(x, y) {
  { const r = cvs.getBoundingClientRect(); ptr.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, cam); }
  if (labelItems.length && st.lstyle === 'pin') { const h = ray.intersectObjects(labelItems.map(i => i.spr).filter(Boolean), false)[0]; if (h) { const it = h.object.userData.item; if (st.peel && it.id && isMus(it.id) && !st.entry) { st.peeled.add(it.id + (byName[it.node]?.userData.side || '')); syncDock(); toast('ลอกออก: ' + D[it.id].en, 'กด "คืนทุกมัด" ในแผงข้อมูลเพื่อแสดงกลับ'); return render(); } return labelClick(it); } }
  const m = pick(x, y); if (!m || !m.userData.id) return;
  if (st.peel && m.userData.mus) { if (m.userData.tappedGhost) { m.userData.tappedGhost = false; return; } st.peeled.add(m.userData.id + m.userData.side); syncDock(); toast('ลอกออก: ' + D[m.userData.id].en, 'กด "คืนทุกมัด" ในแผงข้อมูลเพื่อแสดงกลับ'); return render(); }
  if (m.userData.tappedGhost) { m.userData.tappedGhost = false; st.side = m.userData.side || st.side; return openEntry(m.userData.id, m.userData.n, {}); }
  const { id, n, side } = m.userData;
  if (st.peel && m.userData.mus) { st.peeled.add(id + side); toast('ลอกออก: ' + D[id].en, 'กด "คืนทุกมัด" ในแผงข้อมูลเพื่อแสดงกลับ'); return render(); }
  if (isMus(id) && st.entry === id) return;
  if (st.iso && st.iso.length === 1) return;
  if (st.iso) return openEntry(id, n, { keepScope: 1 });
  if (isWide(st.scope) && !st.entry) { const top = TOP[D[id].sec]; if (top) return openScope(top, { side: side || st.side }); }
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
const FOOT = new Set(['calcaneus', 'talus', 'navicular', 'cuboid', 'cuneiform', 'metatarsal', 'phalanx_f']);
const HAND = new Set(['scaphoid', 'lunate', 'triquetrum', 'pisiform', 'trapezium', 'trapezoid', 'capitate', 'hamate', 'metacarpal', 'phalanx_h']);
const DORSUM = V3(0, .15, -1).normalize(); // หลังมือ (ท่ากายวิภาค: ฝ่ามือหันไปด้านหน้า)
function prefDir(id) { // ทิศที่อยากให้หมุดชี้ออก (ฝั่งที่มองเห็นได้ง่าย)
  if (id === 'calcaneus') return V3(0, .6, -1).normalize(); // ส้นเท้า: ด้านหลัง-บน
  if (HAND.has(id)) return DORSUM.clone();
  return FOOT.has(id) ? V3(0, 1, .35).normalize() : V3(0, .2, 1).normalize();
}
function surfacePick(m, C, out, bias, k) { // จุดบนผิวที่หันไปทาง out+bias มากที่สุด ใกล้แกนกลางชิ้น
  const dir = V3(); if (out && out.lengthSq() > 1e-8) dir.add(out.clone().normalize()); dir.addScaledVector(bias, k).normalize();
  let p = m.userData.anchor, bd = -1e9;
  for (const v of m.userData.samples) { const sc = v.clone().sub(C).dot(dir) - v.distanceTo(m.userData.center) * .35; if (sc > bd) { bd = sc; p = v; } }
  return p.clone();
}
function muscleItems() {
  const items = [], near = p => { let b = null, bd = 1e9; visCache.forEach(m => { const d = m.userData.center.distanceToSquared(p); if (d < bd) { bd = d; b = m; } }); return b?.userData.n; };
  if (st.entry && isMus(st.entry)) {
    const key = st.entry + (visCache.some(m => m.userData.side) ? '_' + st.side : ''), lm = LMJ.landmarks[key] || {}, d = D[st.entry];
    for (const k in lm) {
      const p = V3(...lm[k]), kind = k === 'Origin' ? 'o' : k === 'Insertion' ? 'i' : k === '__belly' ? 'b' : 'h';
      items.push({ t: kind === 'b' ? d.en : kind === 'o' ? 'O · Origin' : kind === 'i' ? 'I · Insertion' : k, p, part: kind === 'b' ? null : k, kind, node: near(p) });
    }
    return items;
  }
  const seen = new Set();
  if (isWide(st.scope)) { // ทั้งตัว: ป้ายบอกหมวด (ไม่ใช่ทุกมัด)
    const groups = new Map();
    for (const m of visCache) { const d = D[m.userData.id]; if (!d) continue; const top = TOP[d.sec] || d.sec, k = top + (SEC[top]?.side ? m.userData.side : ''); if (!groups.has(k)) groups.set(k, { top, ms: [] }); groups.get(k).ms.push(m); }
    for (const [k, g] of groups) {
      const c = V3(); g.ms.forEach(m => c.add(m.userData.center)); c.divideScalar(g.ms.length);
      let best = null, bd = 1e9; g.ms.forEach(m => { const key = m.userData.id + (m.userData.side ? '_' + m.userData.side : ''), b = LMJ.landmarks[key]?.__belly; if (!b) return; const d = V3(...b).distanceToSquared(c); if (d < bd) { bd = d; best = { b, m }; } });
      if (best) items.push({ t: SEC[g.top].t.replace(/^กล้ามเนื้อ/, ''), p: V3(...best.b), node: best.m.userData.n, id: best.m.userData.id, kind: 'b' });
    }
    return items;
  }
  for (const m of visCache) {
    const key = m.userData.id + (m.userData.side ? '_' + m.userData.side : ''); if (seen.has(key)) continue; seen.add(key);
    const b = LMJ.landmarks[key]?.__belly; if (!b || !D[m.userData.id]) continue;
    items.push({ t: D[m.userData.id].en, p: V3(...b), node: m.userData.n, id: m.userData.id, kind: 'b' });
  }
  return items;
}
function landmarkItems() {
  if (MODE === 'mus') return muscleItems();
  const items = [];
  if (st.iso && st.iso.length === 1) {
    const m = byName[st.iso[0]], n = m.userData.n, d = D[st.entry]?.node && n.startsWith(D[st.entry].node) ? D[st.entry] : D[m.userData.id];
    if (st.interior && m.userData.inAxis) return interiorItems(m);
    const lm = LMJ.landmarks[n] || {}; const keys = d?.lm || Object.keys(lm);
    keys.forEach(k => lm[k] && items.push({ t: k, p: V3(...lm[k]), part: k, node: n }));
    if (!items.length) { const id = m.userData.id; items.push({ t: nodeTitle(n), p: surfacePick(m, m.userData.center, null, prefDir(id), 1), node: n }); }
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
    const C = visBox.getCenter(V3()), id0 = best.userData.id, foot = FOOT.has(id0) || HAND.has(id0);
    const p = surfacePick(best, C, foot ? null : best.userData.center.clone().sub(C), prefDir(id0), foot ? 1 : .6);
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
const oMat = new THREE.MeshLambertMaterial({ color: 0x34c759, emissive: 0x06300f }), iMat = new THREE.MeshLambertMaterial({ color: 0x3b82f6, emissive: 0x061a40 }), hMat = new THREE.MeshLambertMaterial({ color: 0xffd34d, emissive: 0x332600 });
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
  const m = byName[it.node];
  let n = it.dirv ? it.dirv.clone() : m ? normalAt(m, it.p) : null;
  if (!n) n = it.p.clone().sub(visBox.getCenter(V3())).normalize();
  if (!it.dirv) { if (m && FOOT.has(m.userData.id) && n.y < .2) n.y = .2; if (m && HAND.has(m.userData.id)) n.addScaledVector(DORSUM, 1.2); n.add(V3(0, .25, 0)).normalize(); } // เอียงขึ้นเล็กน้อยให้อ่านง่าย
  it.n0 = n.clone(); setPin(it, n, pinLen() * [1, 1.4, 1.8][i % 3]);
}
function setPin(it, d, L) {
  const L0 = pinLen(), r = L0 * .035, hr = L0 * .11;
  it.dir = d.clone(); it.L = L;
  it.needle.position.copy(it.p); it.needle.quaternion.setFromUnitVectors(UPY, d); it.needle.scale.set(r, L, r);
  it.headP = it.p.clone().addScaledVector(d, L); it.head.position.copy(it.headP); it.hr = hr; it.head.scale.setScalar(hr * (it._foc ? 1.35 : 1));
  if (it.spr) sizeSprite(it);
}
// จัดหมุดเมื่อกล้องหยุด: ลองหลายทิศ/ความยาว เลือกแบบที่ป้ายไม่ทับกันและอยู่ในจอ
let pinTw = null; const pinRay = new THREE.Raycaster();
function layoutPins() {
  if (st.lstyle !== 'pin' || st.interior || !labelItems.length || !labelItems[0].spr) return;
  cam.updateMatrixWorld(); const r = stageRect(), f = freeRect(), L0 = pinLen();
  const cR = V3().setFromMatrixColumn(cam.matrixWorld, 0), cU = V3().setFromMatrixColumn(cam.matrixWorld, 1), toCam = V3().setFromMatrixColumn(cam.matrixWorld, 2);
  const tanH = Math.tan(cam.fov * Math.PI / 360), placed = [], heads = [], plan = [];
  const ov = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
  const order = labelItems.slice().sort((a, b) => project(a.p, r).y - project(b.p, r).y);
  for (const it of order) {
    const n0 = it.n0, cands = [];
    for (const a of [0, .6, 1.2, -.5]) for (const b of [0, .7, -.7, 1.4, -1.4]) {
      const d = n0.clone().addScaledVector(cU, a).addScaledVector(cR, b).normalize();
      if (d.dot(n0) < .2) continue; cands.push(d);
    }
    const all = [];
    for (const k of [1, 1.4, 1.8, 2.4, 3]) for (const d of cands) {
      const L = L0 * k, h = it.p.clone().addScaledVector(d, L), s = project(h, r), dist = cam.position.distanceTo(h);
      const hpx = Math.min(L0 * .7, 2 * dist * tanH * 20 / r.height) / (2 * dist * tanH) * r.height, wpx = hpx * it.spr.userData.aspect;
      const rc = { x0: s.x + wpx * .12 - 2, x1: s.x + wpx * 1.12 + 2, y0: s.y - hpx / 2 - 2, y1: s.y + hpx / 2 + 2 };
      const hd = { x0: s.x - 6, x1: s.x + 6, y0: s.y - 6, y1: s.y + 6 };
      let cost = 0;
      for (const q of placed) cost += ov(rc, q) * 4;
      for (const q of heads) cost += ov(rc, q) * 2 + ov(hd, q);
      const off = Math.max(0, f.t - rc.y0) + Math.max(0, rc.y1 - f.b) + Math.max(0, 4 - rc.x0) + Math.max(0, rc.x1 - (f.r - 4));
      cost += off * hpx * 3 + (k - 1) * 60 + (1 - d.dot(n0)) * 120 + Math.max(0, -d.dot(toCam)) * 60;
      all.push({ cost, d, L, rc, hd, h });
    }
    // ห้ามเข็มทะลุกระดูกชิ้นอื่น: ตรวจตามลำดับต้นทุน เลือกอันแรกที่เข็มไม่ชนกระดูก
    all.sort((a, b) => a.cost - b.cost); let best = all[0], tries = 0;
    for (const c of all) { if (++tries > 40) break; pinRay.set(it.p.clone().addScaledVector(c.d, L0 * .04), c.d); pinRay.far = c.L * 1.05;
      if (!pinRay.intersectObjects(visCache, false).length) { best = c; break; } }
    placed.push(best.rc); heads.push(best.hd); plan.push({ it, d0: it.dir.clone(), L0: it.L, d1: best.d, L1: best.L }); it.headT = best.h;
  }
  pinTw = { t0: performance.now(), plan }; dirty = true;
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
function sizeSprite(it) { // ป้าย 3D: สูงประมาณ 20px บนจอเสมอ (ไม่ใหญ่ล้นเวลาซูม) แต่ไม่ใหญ่เกินขนาดหมุด
  const d = cam.position.distanceTo(it.headP), px = 20 / (stageRect().height || 800), h = Math.min(pinLen() * .7, 2 * d * Math.tan(cam.fov * Math.PI / 360) * px);
  it.spr.scale.set(h * it.spr.userData.aspect, h, 1); it.spr.position.copy(it.headP);
}
function buildLabelDom() {
  lblBox.textContent = ''; svg.textContent = ''; pinGroup.traverse(o => o.material?.map?.dispose()); pinGroup.clear();
  if (st.lstyle === 'line') { // แบบเส้นชี้: ป้ายเรียงซ้าย-ขวา มีเส้นลากไปที่จุดบนกระดูก
    labelItems.forEach((it, i) => {
      const e = document.createElement('button'); e.className = 'lbl ln'; e.textContent = it.t; e.onclick = () => labelClick(it); e.style.animationDelay = Math.min(i * 18, 300) + 'ms'; lblBox.appendChild(e); it.el = e;
      it.line = document.createElementNS(SVGNS, 'polyline'); it.line.setAttribute('fill', 'none'); it.dot = document.createElementNS(SVGNS, 'circle'); svg.append(it.line, it.dot);
    });
    labelItems.forEach(it => { it.w = it.el.offsetWidth; it.h = it.el.offsetHeight; }); svg.setAttribute('viewBox', `0 0 ${stageRect().width} ${stageRect().height}`);
    occDirty = true; return;
  }
  labelItems.forEach((it, i) => {
    it.baseMat = it.kind === 'o' ? oMat : it.kind === 'i' ? iMat : it.kind === 'h' ? hMat : headMat;
    it.needle = new THREE.Mesh(NEEDLE, needleMat); it.head = new THREE.Mesh(HEADG, it.baseMat); it.needle.raycast = it.head.raycast = () => { };
    pinGroup.add(it.needle, it.head); placePin(it, i);
    it.spr = textSprite(it.t, false); it.spr.userData.item = it; pinGroup.add(it.spr); sizeSprite(it);
  });
  occDirty = true;
}
function updateOcclusion() {
  const vis = visibleList(); occDirty = false;
  if (vis.length > 80) { labelItems.forEach(it => it.hidden = false); return; } // ทั้งตัว: ข้ามเพื่อความลื่น
  labelItems.forEach(it => { const tp = it.headT || it.headP || it.p, dir = tp.clone().sub(cam.position), dl = dir.length(); occ.set(cam.position, dir.normalize()); occ.far = dl; const h = occ.intersectObjects(vis, false).find(h => !st.interior || clip.distanceToPoint(h.point) >= 0); it.hidden = !!h && h.distance < dl - Math.max(.004, dl * .012); });
}
function drawLines() {
  const r = stageRect(), f = freeRect(), bb = visBox, pts = [];
  if (st.interior) { const fresh = landmarkItems(); fresh.forEach((f2, i) => labelItems[i] && (labelItems[i].p = f2.p)); }
  for (let i = 0; i < 8; i++) pts.push(project(V3(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z), r));
  const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x)), midX = (minX + maxX) / 2;
  if (occDirty && !moving) updateOcclusion();
  labelItems.forEach(it => { it.s = project(it.p, r); });
  const L = labelItems.filter(i => i.s.x < midX).sort((a, b) => a.s.y - b.s.y), Rr = labelItems.filter(i => i.s.x >= midX).sort((a, b) => a.s.y - b.s.y);
  const gap = 5, top = f.t + 4, bot = f.b - 4;
  const place = (col, left) => {
    let y = top; col.forEach(it => { it.ly = Math.max(y, it.s.y - it.h / 2); y = it.ly + it.h + gap; });
    const over = y - gap - bot; if (over > 0) col.forEach(it => it.ly -= over);
    for (let i = 0; i < col.length; i++) { const lim = i ? col[i - 1].ly + col[i - 1].h + gap : top; if (col[i].ly < lim) col[i].ly = lim; }
    col.forEach(it => { let x = left ? minX - 28 - it.w : maxX + 28; x = Math.max(8, Math.min(f.r - it.w - 8, x)); it.lx = x; });
  };
  place(L, true); place(Rr, false);
  labelItems.forEach(it => {
    const left = it.lx + it.w / 2 < it.s.x, ex = left ? it.lx + it.w : it.lx, ey = it.ly + it.h / 2, foc = !!(st.focus && st.focus === it.part);
    it.el.style.transform = `translate3d(${it.lx | 0}px,${it.ly | 0}px,0)`;
    if (it._hid !== !!it.hidden) { it.el.classList.toggle('dim', !!it.hidden); it._hid = !!it.hidden; }
    if (it._foc !== foc) { it.el.classList.toggle('foc', foc); it._foc = foc; }
    const colr = foc ? '#ff9f43' : '#e8e8e8';
    it.line.setAttribute('points', `${ex | 0},${ey | 0} ${(ex + (left ? 10 : -10)) | 0},${ey | 0} ${it.s.x | 0},${it.s.y | 0}`);
    it.line.setAttribute('stroke', colr); it.line.setAttribute('stroke-opacity', it.hidden ? .35 : .85); it.line.setAttribute('stroke-width', foc ? 1.8 : 1.1);
    it.dot.setAttribute('cx', it.s.x | 0); it.dot.setAttribute('cy', it.s.y | 0); it.dot.setAttribute('r', 3.4);
    it.dot.setAttribute('fill', it.hidden ? 'none' : colr); it.dot.setAttribute('stroke', it.hidden ? colr : '#000'); it.dot.setAttribute('stroke-opacity', it.hidden ? .6 : 1);
  });
}
function drawLabels() {
  if (!st.labels || !root) { if (labelItems.length) { pinGroup.clear(); lblBox.textContent = ''; svg.textContent = ''; labelItems = []; } return; }
  if (labelsDirty) { pinTw = null; labelItems = landmarkItems(); labelsDirty = false; buildLabelDom(); }
  if (!labelItems.length) return;
  if (st.lstyle === 'line') return drawLines();
  else if (st.interior) { const fresh = landmarkItems(); fresh.forEach((f, i) => { const it = labelItems[i]; if (it) { it.p = f.p; it.dirv = f.dirv; placePin(it, i); sizeSprite(it); } }); }
  if (occDirty && !moving) { layoutPins(); updateOcclusion(); labelItems.forEach(it => { it.spr.material.opacity = it.hidden ? .3 : 1; it.spr.renderOrder = it.hidden ? 1 : 3; }); }
  labelItems.forEach(it => {
    const foc = !!(st.focus && st.focus === it.part);
    if (it._foc !== foc) { it._foc = foc; it.head.material = foc ? headFoc : (it.baseMat || headMat); it.head.scale.setScalar(it.hr * (foc ? 1.35 : 1));
      const old = it.spr; it.spr = textSprite(it.t, foc); it.spr.userData.item = it; pinGroup.remove(old); old.material.map.dispose(); pinGroup.add(it.spr); sizeSprite(it); it.spr.renderOrder = foc ? 2 : 1; }
  });
}
function labelClick(it) {
  if (it.part) { setFocus(st.focus === it.part ? null : it.part); return; }
  if (it.node) { if (isWide(st.scope) && !st.iso) { const top = TOP[D[it.id].sec]; return openScope(top, { side: byName[it.node].userData.side || st.side }); } openEntry(it.id, st.iso ? it.node : null, { keepScope: 1 }); }
}
function setFocus(name) {
  st.focus = name; applyColor(); drawLabels(); dirty = true;
  $$('#panel [data-part]').forEach(e => e.classList.toggle('foc', e.dataset.part === name));
  const el = $(`#panel [data-part="${CSS.escape(name || '')}"]`); el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ---------- panel ---------- */
const BOOK_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/></svg>';
const BOOKS = { bone: { dir: 'book/p-', n: 32, pdf: 'notebook.pdf', t: 'สมุดสรุป Anatomy เล่ม 2' }, m1: { dir: 'mbook/e1-', n: 81, pdf: 'muscle_ep1.pdf', t: 'บทที่ 4 ระบบกล้ามเนื้อ · EP.1' }, m2: { dir: 'mbook/e2-', n: 73, pdf: 'muscle_ep2.pdf', t: 'บทที่ 4 ระบบกล้ามเนื้อ · EP.2' } };
const pgRef = p => { const v = String(p).match(/^(\d):(\d+)$/); return v ? { b: 'm' + v[1], p: +v[2], lab: `EP.${v[1]} · ${v[2]}` } : { b: 'bone', p: +p, lab: 'หน้า ' + p }; };
const pgBtns = (pg, name) => (pg || []).length ? `<div class="bookcard"><div class="bc-ic">${BOOK_IC}</div><div class="bc-tx"><b>${MODE === 'mus' ? 'เปิดสไลด์ประกอบ' : 'เปิดสมุดสรุป'}</b><p>กดแล้วจะเปิดไปยังหน้าที่อธิบายเกี่ยวกับ <strong>${esc(name)}</strong> ${MODE === 'mus' ? 'ในสไลด์ระบบกล้ามเนื้อ' : 'ในสมุด'}</p><div class="bc-pg">${pg.map(p => `<button class="pg press" data-pg="${p}">${pgRef(p).lab}</button>`).join('')}</div></div></div>` : '';
const sec = (t, body) => body ? `<section><h4>${t}</h4>${body}</section>` : '';
const ul = a => a?.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
function musLegendHTML() {
  const sw = `<div class="cswitch">${COLOR_MODES.map(c => `<button class="press" data-cmode="${c[0]}">${c[0] === 'off' ? 'ปิดสี' : modeLabel(c)}</button>`).join('')}</div>`;
  const pins = `<div class="pinleg"><span><i style="background:#ff4436"></i>ชื่อมัด</span><span><i style="background:#34c759"></i>Origin จุดเกาะต้น</span><span><i style="background:#3b82f6"></i>Insertion จุดเกาะปลาย</span><span><i style="background:#ffd34d"></i>หัว / ส่วนของมัด</span></div>`;
  let list = '';
  if (st.color === 'parts' && !st.entry) { const ids = [...new Set(visCache.map(m => m.userData.id))].filter(i => D[i]); list = `<div class="legend">${ids.map(i => `<button data-go="${i}"><i style="background:#${musColor(i).getHexString()}"></i>${esc(D[i].en)}</button>`).join('')}</div>`; }
  return sec('สีและหมุด', sw + pins + list);
}
function legendHTML() {
  if (MODE === 'mus') return musLegendHTML();
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
    const l = LESS.find(x => x.id === st.lesson);
    h = `<header><div class="kicker">บทเรียน</div><h2>${l.t}</h2></header>${pgBtns(l.pg, l.t)}<div class="prose">${l.html}</div>`;
    if (l.iso) h += `<div class="note">กำลังแสดง ${esc(D[l.iso].en)} (${SIDE_TH[st.side]}) ${st.interior ? '· ภาพตัดภายใน' : ''}</div>`;
  } else if (st.entry && isMus(st.entry)) {
    const d = D[st.entry], hasMesh = !!st.iso;
    h = `<header><div class="kicker">${esc(SEC[d.sec]?.t || '')}${d.sub ? ' · ' + esc(d.sub) : ''}</div><h2>${esc(d.en)}${hasMesh && visCache.some(m => m.userData.side) ? ` <small class="sd">(${SIDE_TH[st.side]})</small>` : ''}</h2><p class="th">${esc(d.th)}</p>
      <div class="facts"><span><b>${esc(d.n)}</b></span><span class="mu">Skeletal muscle · กล้ามเนื้อลาย</span></div></header>${pgBtns(d.pg, d.en)}`;
    if (!hasMesh) h += `<div class="note">โมเดล BodyParts3D ไม่มีกล้ามเนื้อนี้ — แสดงเฉพาะข้อมูล</div>`;
    h += sec('ตำแหน่ง', `<p>${esc(d.loc)}</p>`);
    if (d.act.length) h += sec('หน้าที่ (Action)', `<div class="acts">${d.act.map(a => `<span>${esc(a)}</span>`).join('')}</div>`);
    if (d.parts.length) h += sec('จุดเกาะและส่วนของมัด', `<ol class="parts mparts">${d.parts.map(([a, b]) => `<li><button data-part="${esc(a)}" class="${a === 'Origin' ? 'po' : a === 'Insertion' ? 'pi' : 'ph'}"><b>${esc(a)}</b>${b ? `<span>${esc(b)}</span>` : ''}</button></li>`).join('')}</ol>`);
    h += sec('เกาะกับกระดูก', d.con.length ? `<ul class="con">${d.con.map(([t, j, n]) => `<li><a href="#" data-go="${t}">${esc(D[t]?.en || t)}</a>${j ? `<em>${esc(j)}</em>` : ''}${n ? ` ${esc(n)}` : ''}</li>`).join('')}</ul><p class="hint">กดชื่อกระดูกเพื่อไปดูในโหมดกระดูก</p>` : '');
    h += sec('สิ่งที่ลอดผ่าน', ul(d.pass)) + sec('คลินิก', ul(d.clin)) + (d.tip.length ? sec('Tip', d.tip.map(t => `<p class="tip">${esc(t)}</p>`).join('')) : '');
    if (d.vid.length) h += sec('วิดีโอประกอบ (จากสไลด์)', d.vid.map(v => `<a class="vid" href="${esc(v)}" target="_blank" rel="noopener">▶ ${esc(v.replace('https://www.', ''))}</a>`).join(''));
    if (hasMesh) h += `<button class="wide press" id="pPeel">ซ่อนมัดนี้ เพื่อดูชั้นที่ลึกกว่า</button>`;
    h += legendHTML();
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
    const bm = BONE_MUS[st.entry]; if (bm) h += sec('กล้ามเนื้อที่เกาะกระดูกนี้', `<div class="chips mchips">${bm.map(i => `<button data-go="${i}">${esc(D[i].en)}</button>`).join('')}</div>`);
    h += legendHTML();
  } else {
    const s = SEC[st.scope]; const ids = (MODE === 'mus' ? MDATA : DATA).filter(d => inSec(st.scope, d.id) && !isWide(st.scope));
    h = `<header><div class="kicker">${s.parent ? esc(SEC[s.parent].t) : 'หมวด'}</div><h2>${esc(s.t)}</h2><p class="th">${esc(s.s)}</p></header>${pgBtns(s.pg, s.t)}`;
    if (s.side) h += `<div class="seg side">${['R', 'L'].map(k => `<button data-side="${k}" class="${st.side === k ? 'on' : ''}">ข้าง${SIDE_TH[k]}</button>`).join('')}</div>`;
    h += sec('สรุปจากสมุด', ul(s.info));
    if (st.peeled.size && MODE === 'mus') h += `<div class="note peelnote">ลอกชั้นออกแล้ว ${st.peeled.size} มัด <button class="press" id="pUnpeel">คืนทุกมัด</button></div>`;
    if (ids.length && MODE === 'mus') { const subs = [...new Set(ids.map(d => d.sub || ''))]; h += sec('กล้ามเนื้อในหมวดนี้', subs.map(sb => `${sb ? `<div class="subh">${esc(sb)}</div>` : ''}<div class="chips mchips">${ids.filter(d => (d.sub || '') === sb).map(d => `<button data-go="${d.id}"><i style="background:#${musColor(d.id).getHexString()}"></i>${esc(d.en)}</button>`).join('')}</div>`).join('')); }
    else if (ids.length) h += sec('กระดูกในหมวดนี้', `<div class="chips">${ids.map(d => `<button data-go="${d.id}">${esc(d.en)}</button>`).join('')}</div>`);
    if (s.vid) h += sec('วิดีโอประกอบ (จากสไลด์)', s.vid.map(v => `<a class="vid" href="${esc(v)}" target="_blank" rel="noopener">▶ ${esc(v.replace('https://www.', ''))}</a>`).join(''));
    if (st.scope === 'm-all') h += sec('วิธีใช้', '<ul><li>แตะกล้ามเนื้อ → เปิดหมวดนั้น · แตะอีกครั้ง → แยกมัดออกมาดู</li><li>หมุดเขียว = Origin · หมุดฟ้า = Insertion</li><li>เครื่องมือ "ลอกชั้น": แตะมัดที่ต้องการลอกออกเพื่อดูชั้นลึก</li><li>เครื่องมือ "กระดูก": แสดง/ซ่อนโครงกระดูกด้านใน</li></ul>');
    if (['all', 'axial', 'appendicular'].includes(st.scope)) h += sec('วิธีใช้', '<ul><li>แตะส่วนใดของโครงกระดูก → เปิดหมวดนั้น · แตะอีกครั้ง → แยกชิ้นออกมาดู</li><li>ลาก 1 นิ้วหมุน · บีบซูม · 2 นิ้วเลื่อน</li><li>แตะป้ายชื่อเพื่อไฮไลต์ส่วนนั้น</li></ul>');
    h += legendHTML();
  }
  h += `<footer>โมเดล: BodyParts3D, © The Database Center for Life Science, CC BY 4.0 · เนื้อหา: ${MODE === 'mus' ? 'สไลด์บทที่ 4 ระบบกล้ามเนื้อ (EP.1–2)' : 'สมุดสรุป Anatomy เล่ม 2 บทที่ 3'}</footer>`;
  const pb = $('#pbody'); pb.innerHTML = h; pb.scrollTop = 0; pb.classList.remove('enter'); void pb.offsetWidth; pb.classList.add('enter');
  $('#pInterior')?.addEventListener('click', toggleInterior);
  $('#pPeel')?.addEventListener('click', () => { const e = st.entry; visCache.forEach(m => st.peeled.add(m.userData.id + m.userData.side)); toast('ลอกออก: ' + D[e].en, 'แสดงชั้นที่อยู่ลึกกว่า'); openScope(TOP[D[e].sec] || rootSec()); });
  $('#pUnpeel')?.addEventListener('click', () => { st.peeled.clear(); render(); toast('คืนกล้ามเนื้อทุกมัดแล้ว'); });
}
$('#pbody').addEventListener('click', e => {
  const t = e.target.closest('[data-go],[data-part],[data-pg],[data-side],[data-cmode]'); if (!t) return; e.preventDefault();
  if (t.dataset.cmode) return setColor(t.dataset.cmode);
  if (t.dataset.go) openEntry(t.dataset.go, null, {});
  else if (t.dataset.part) setFocus(st.focus === t.dataset.part ? null : t.dataset.part);
  else if (t.dataset.pg) openBook(t.dataset.pg, bookTarget().name);
  else if (t.dataset.side) { st.side = t.dataset.side; openScope(st.scope, { nohist: 1 }); }
});
function renderCrumbs() {
  const c = [`<button data-c="${rootSec()}">${MODE === 'mus' ? 'กล้ามเนื้อทั้งตัว' : 'ทั้งตัว'}</button>`];
  const s = SEC[st.scope]; if (st.scope !== rootSec()) { if (s.parent) c.push(`<button data-c="${s.parent}">${esc(SEC[s.parent].t)}</button>`); c.push(`<button data-c="${st.scope}">${esc(s.t)}${s.side ? ' · ' + SIDE_TH[st.side] : ''}</button>`); }
  if (st.lesson) c.push(`<span>${esc(LESS.find(l => l.id === st.lesson).t)}</span>`);
  else if (st.entry) c.push(`<span>${esc(isMus(st.entry) ? D[st.entry].en : st.iso?.length === 1 ? nodeTitle(st.iso[0]) : D[st.entry].en)}</span>`);
  $('#crumbs').innerHTML = (st.hist.length ? `<button class="back" id="back" aria-label="ย้อนกลับ"><b>‹</b><small>ย้อนกลับ</small></button>` : '') + c.join('<i>›</i>');
}
$('#crumbs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.id === 'back') return back(); openScope(b.dataset.c); });

/* ---------- nav ---------- */
let navBound = false;
function buildNav() {
  const g = (t, items) => `<div class="ng"><div class="nt">${t}</div>${items}</div>`;
  const si = (id, sub) => { const s = SEC[id]; const kids = isWide(id) ? [] : (MODE === 'mus' ? MDATA : DATA).filter(d => id === 'thorax' ? ['sternum', 'rib'].includes(d.id) : d.sec === id);
    return `<div class="ni ${sub ? 'sub' : ''}" data-sec="${id}"><button class="nb" data-s="${id}"><span>${esc(s.t)}</span><small>${esc(s.s)}</small></button>${kids.length ? `<div class="kids">${kids.map(d => `<button data-e="${d.id}">${esc(d.en)}</button>`).join('')}</div>` : ''}</div>`; };
  const lb = l => `<div class="ni"><button class="nb" data-l="${l.id}"><span>${esc(l.t)}</span><small>${esc(pgRef(l.pg[0]).lab)}</small></button></div>`;
  if (MODE === 'mus') {
    $('#nav').innerHTML = g('ภาพรวม', si('m-all')) + g('บทเรียน', MLESSONS.map(lb).join('')) +
      g('ศีรษะและคอ', si('m-face') + si('m-mast') + si('m-eye') + si('m-neck')) +
      g('ช่วงไหล่และแขน', si('m-girdle') + si('m-shoulder') + si('m-arm') + si('m-fore') + si('m-hand')) +
      g('ลำตัว', si('m-back') + si('m-breath') + si('m-abd')) + g('สะโพกและขา', si('m-glute') + si('m-thigh') + si('m-leg'));
  } else
  $('#nav').innerHTML =
    g('ภาพรวม', si('all')) +
    g('บทเรียน 3.1–3.6', LESSONS.map(lb).join('')) +
    g('3.7 แกน / ระยางค์', si('axial') + si('appendicular')) +
    g('3.8 กะโหลกศีรษะ', si('skull') + si('cranial', 1) + si('facial', 1)) +
    g('3.9 กระดูกสันหลัง', si('spine')) + g('3.10 ทรวงอก', si('thorax')) +
    g('3.11 กระดูกระยางค์', si('shoulder') + si('upper') + si('hand', 1) + si('pelvis') + si('lower') + si('foot', 1));
  if (navBound) return; navBound = true;
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
const MUS_CM = { parts: ['แยกมัด', 'แต่ละมัดคนละสี แยกกันชัด'], axap: ['สีจริง', 'สีกล้ามเนื้อตามธรรมชาติ'], off: ['ปิด', 'สีงาช้างทั้งหมด'] };
const modeLabel = c => MODE === 'mus' ? MUS_CM[c[0]][0] : c[1];
let colorMode = 'parts'; // แบบสีที่เลือกไว้ (ใช้ตอนเปิดสี)
function setColor(c) { st.color = c; if (c !== 'off') colorMode = c; applyColor(); renderPanel(); syncDock(); const m = COLOR_MODES.find(x => x[0] === c); toast(c === 'off' ? 'ปิดสี' : 'เปิดสี: ' + modeLabel(m), MODE === 'mus' ? MUS_CM[c][1] : m[2]); }
function bookTarget() {
  if (st.lesson) { const l = LESS.find(x => x.id === st.lesson); return { pg: l.pg[0], name: l.t }; }
  if (st.entry) return { pg: (D[st.entry].pg || [])[0], name: D[st.entry].en };
  return { pg: (SEC[st.scope].pg || [2])[0], name: SEC[st.scope].t };
}
function syncDock() {
  const set = (id, on, sub) => { const b = $(id); b.classList.toggle('on', !!on); b.querySelector('small').textContent = sub; };
  set('#tLabels', st.labels, st.labels ? 'เปิด' : 'ปิด');
  set('#tGhost', ghostOn, ghostOn ? 'แสดงจาง ๆ' : 'ซ่อน');
  set('#tStyle', false, st.lstyle === 'pin' ? 'หมุด 3D' : 'เส้นชี้'); $('#tStyle').classList.toggle('na', !st.labels);
  $('#tStyle').querySelector('.ic-pin').style.display = st.lstyle === 'pin' ? '' : 'none'; $('#tStyle').querySelector('.ic-line').style.display = st.lstyle === 'line' ? '' : 'none';
  $$('[data-cmode]').forEach(b => b.classList.toggle('on', b.dataset.cmode === st.color));
  set('#tColor', st.color !== 'off', st.color === 'off' ? 'ปิด' : modeLabel(COLOR_MODES.find(c => c[0] === st.color)));
  set('#tBones', st.boneCtx, st.boneCtx ? 'แสดง' : 'ซ่อน'); set('#tPeel', st.peel, st.peel ? 'แตะเพื่อลอก' : (st.peeled.size ? `ลอกแล้ว ${st.peeled.size}` : 'ปิด'));
  $('#tGhost span').textContent = 'ส่วนอื่น';
  set('#tInterior', st.interior, st.canInterior ? (st.interior ? 'เปิด' : 'ปิด') : 'กระดูกยาว');
  $('#tInterior').classList.toggle('na', !st.canInterior);
  const bt = bookTarget(); set('#tBook', false, bt.pg ? pgRef(bt.pg).lab : '—');
}
$('#tLabels').onclick = () => { st.labels = !st.labels; labelsDirty = true; frame(visibleList()); syncDock(); toast(st.labels ? 'เปิดป้ายชื่อ' : 'ปิดป้ายชื่อ', st.labels ? (st.lstyle === 'pin' ? 'แบบหมุด 3D' : 'แบบเส้นชี้') + ' · แตะชื่อเพื่อไฮไลต์' : 'ซ่อนป้ายชื่อทั้งหมด'); };
$('#tStyle').onclick = () => {
  st.lstyle = st.lstyle === 'pin' ? 'line' : 'pin'; try { localStorage.setItem('hn-lstyle', st.lstyle); } catch (e) { }
  st.labels = true; labelsDirty = true; frame(visibleList()); syncDock();
  toast(st.lstyle === 'pin' ? 'แบบหมุด 3D' : 'แบบเส้นชี้', st.lstyle === 'pin' ? 'หมุดปักบนกระดูก ป้ายชื่อติดหัวหมุด หมุนตามโมเดล' : 'ป้ายเรียงด้านข้าง มีเส้นลากไปชี้จุดบนกระดูก');
};
$('#tColor').onclick = () => setColor(st.color === 'off' ? colorMode : 'off');
$('#tInterior').onclick = toggleInterior;
$('#tGhost').onclick = () => {
  ghostOn = !ghostOn; try { localStorage.setItem('hn-ghost', ghostOn ? '1' : '0'); } catch (e) { }
  meshes.forEach(m => { if (m.userData.ghost) m.visible = ghostOn; }); ghostList = ghostOn ? meshes.filter(m => m.userData.ghost) : [];
  dirty = true; syncDock(); toast(ghostOn ? 'แสดงกระดูกส่วนอื่นแบบจาง ๆ' : 'ซ่อนกระดูกส่วนอื่น', ghostOn ? 'เห็นตำแหน่งในร่างกาย · แตะชิ้นจางเพื่อไปดู' : 'แสดงเฉพาะชิ้นที่เลือก');
};
$('#tBook').onclick = () => { const bt = bookTarget(); if (!bt.pg) return; openBook(bt.pg, bt.name); };
$('#tBones').onclick = () => { st.boneCtx = !st.boneCtx; boneMeshes.forEach(b => b.visible = st.boneCtx); dirty = true; occDirty = true; syncDock(); toast(st.boneCtx ? 'แสดงโครงกระดูก' : 'ซ่อนโครงกระดูก', st.boneCtx ? 'เห็นจุดเกาะบนกระดูก' : 'ดูเฉพาะกล้ามเนื้อ'); };
$('#tPeel').onclick = () => { st.peel = !st.peel; syncDock(); toast(st.peel ? 'โหมดลอกชั้น: เปิด' : 'โหมดลอกชั้น: ปิด', st.peel ? 'แตะกล้ามเนื้อเพื่อลอกออก ดูชั้นที่อยู่ลึกกว่า' : (st.peeled.size ? 'กด "คืนทุกมัด" ในแผงข้อมูลเพื่อแสดงกลับ' : '')); };
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
  const hits = [...[...SECS, ...MSECS].filter(x => norm(x.t + ' ' + x.s).includes(s)).map(x => ({ k: 's', id: x.id, t: x.t, sub: x.s })),
    ...[...LESSONS, ...MLESSONS].filter(x => norm(x.t + x.html).includes(s)).map(x => ({ k: 'l', id: x.id, t: x.t, sub: 'บทเรียน' })),
    ...[...DATA, ...MDATA].filter(d => norm([d.en, d.th, d.id, d.loc, ...(d.act || []), ...(d.tip || []), d.sub || '', ...d.parts.map(p => p[0])].join(' ')).includes(s)).map(d => ({ k: 'e', id: d.id, t: d.en, sub: (isMus(d.id) ? 'กล้ามเนื้อ · ' : 'กระดูก · ') + d.th + (d.parts.find(p => norm(p[0]).includes(s)) ? ' · ' + d.parts.find(p => norm(p[0]).includes(s))[0] : ''), part: d.parts.find(p => norm(p[0]).includes(s))?.[0] }))].slice(0, 30);
  res.innerHTML = hits.map((h, i) => `<button data-i="${i}"><b>${esc(h.t)}</b><small>${esc(h.sub)}</small></button>`).join('') || '<p>ไม่พบ</p>'; res.hidden = false; res._h = hits;
};
res.addEventListener('pointerdown', e => {
  const b = e.target.closest('button'); if (!b) return; e.preventDefault(); const h = res._h[+b.dataset.i]; res.hidden = true; q.value = ''; q.blur();
  if (h.k === 's') openScope(h.id); else if (h.k === 'l') openLesson(h.id); else { openEntry(h.id, null, {}); if (h.part) setTimeout(() => setFocus(h.part), 100); }
});
q.onblur = () => setTimeout(() => res.hidden = true, 150);

/* ---------- แถบเมนูบน (ดรอปดาวน์ หมวดหมู่ / บทเรียน) ---------- */
const ddEl = $('#dd');
function ddClose() { ddEl.hidden = true; $$('#modeSeg .open').forEach(b => b.classList.remove('open')); }
function ddOpen(btn, kind) {
  if (!ddEl.hidden && btn.classList.contains('open')) { ddClose(); return; }
  ddClose(); let html = '';
  const it = (attr, id, t, s, sub, cur) => `<button ${attr}="${id}" class="${sub ? 'sub' : ''}${cur ? ' cur' : ''}"><span>${esc(t)}</span>${s ? `<small>${esc(s)}</small>` : ''}</button>`;
  if (kind === 'sec') {
    const list = MODE === 'mus' ? MSECS : SECS;
    html = `<div class="dh">${MODE === 'mus' ? 'หมวดกล้ามเนื้อ' : 'หมวดกระดูก'}</div>` + list.map(s => it('data-s', s.id, s.t, s.s, s.parent, st.scope === s.id && !st.entry && !st.lesson)).join('');
  } else if (kind === 'les') {
    html = `<div class="dh">บทเรียน${MODE === 'mus' ? 'ระบบกล้ามเนื้อ' : 'ระบบกระดูก'}</div>` + LESS.map(l => it('data-l', l.id, l.t, pgRef(l.pg[0]).lab, 0, st.lesson === l.id)).join('') +
      `<div class="dh">${MODE === 'mus' ? 'บทเรียนระบบกระดูก' : 'บทเรียนระบบกล้ามเนื้อ'}</div>` + (MODE === 'mus' ? LESSONS : MLESSONS).map(l => it('data-l', l.id, l.t, pgRef(l.pg[0]).lab)).join('');
  } else {
    const bt = bookTarget();
    html = `<div class="dh">เปิดหน้าที่เกี่ยวข้อง</div>` + (bt.pg ? it('data-b', bt.pg, bt.name || 'หน้านี้', pgRef(bt.pg).lab, 0, 1) : '') +
      `<div class="dh">เปิดตั้งแต่หน้าแรก</div>` + it('data-b', '1', 'สมุดสรุป Anatomy เล่ม 2 (กระดูก)', '32 หน้า') + it('data-b', '1:1', 'สไลด์ระบบกล้ามเนื้อ EP.1', '81 หน้า') + it('data-b', '2:1', 'สไลด์ระบบกล้ามเนื้อ EP.2', '73 หน้า');
  }
  ddEl.innerHTML = html; ddEl.hidden = false; btn.classList.add('open');
  const r = btn.getBoundingClientRect(); ddEl.style.top = r.bottom + 'px'; ddEl.style.left = Math.max(8, Math.min(innerWidth - ddEl.offsetWidth - 8, r.left)) + 'px';
  ddEl.querySelector('.cur')?.scrollIntoView({ block: 'nearest' });
}
$$('#modeSeg [data-dd]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); ddOpen(b, b.dataset.dd); }));
ddEl.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; ddClose();
  if (b.dataset.s) openScope(b.dataset.s); else if (b.dataset.l) openLesson(b.dataset.l); else if (b.dataset.b) openBook(b.dataset.b, b.querySelector('span').textContent);
});
addEventListener('pointerdown', e => { if (!ddEl.hidden && !e.target.closest('#dd,[data-dd]')) ddClose(); }, true);
addEventListener('resize', ddClose);
$$('.ht-l [data-go]').forEach(b => b.onclick = () => $(`#modeSeg [data-mode="${b.dataset.go}"]`).click());
$$('.ht-l [data-bk]').forEach(b => b.onclick = () => openBook(b.dataset.bk, ''));
$('#brand').onclick = () => openScope(rootSec());
$('#sform').addEventListener('submit', () => { const s = norm(q.value.trim()), H = res._h || [], i = Math.max(0, H.findIndex(h => h.k === 'e' && norm(h.t).startsWith(s))), f = !res.hidden && $$('#res button')[i]; if (f) f.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); else q.focus(); });

/* ---------- notebook viewer ---------- */
let NB = 32, bookPg = 1, zoom = 1, bookId = 'bone';
function openBook(ref, name) { const r = pgRef(ref); bookId = r.b; NB = BOOKS[bookId].n; bookPg = r.p; zoom = 1; $('#bpdf').href = BOOKS[bookId].pdf; $('#btitle').textContent = BOOKS[bookId].t; const b = $('#book'); b.hidden = false; b.classList.remove('in'); void b.offsetWidth; b.classList.add('in'); $('#bfor').textContent = name ? 'อธิบาย ' + name : ''; showPage(); }
function showPage() { const img = $('#bimg'); img.src = `${BOOKS[bookId].dir}${String(bookPg).padStart(2, '0')}.jpg`; img.style.width = (zoom * 100) + '%'; $('#bnum').textContent = `หน้า ${bookPg} / ${NB}`; $('#bscroll').scrollTop = 0; }
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
  drawLabels();
  if (pinTw) { let k = Math.min(1, (performance.now() - pinTw.t0) / 260); k = 1 - (1 - k) * (1 - k);
    for (const q of pinTw.plan) if (q.it.spr) setPin(q.it, q.d0.clone().lerp(q.d1, k).normalize(), q.L0 + (q.L1 - q.L0) * k);
    if (k >= 1) pinTw = null; dirty = true; }
  labelItems.forEach(it => it.spr && sizeSprite(it)); R.render(scene, cam); adapt(performance.now());
});
window.__humnoi = { setMode, get mode() { return MODE; }, musMeshes: () => musMeshes, R, st, meshes, byName, cam, ctl, openEntry, openScope, setFocus, frame, visibleList, DIRS, labelItems: () => labelItems };
