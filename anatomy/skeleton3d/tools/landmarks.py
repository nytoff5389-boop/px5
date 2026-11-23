# คำนวณ landmark (จุดชี้) และ region (สีแยกส่วน) จาก mesh จริงของ BodyParts3D
# ใช้: python3 landmarks.py skeleton_raw.glb out_dir
import sys, json, numpy as np, trimesh
from scipy.spatial import cKDTree

src, out = sys.argv[1], sys.argv[2]
sc = trimesh.load(src)
G = {k: g for k, g in sc.geometry.items()}

def side_of(n):
    return 'L' if n.endswith('_L') else 'R' if n.endswith('_R') else ''

class Frame:
    """normalized coords: m = medial(1)…lateral(0) [หรือ x ซ้าย→ขวา ถ้าไม่มีฝั่ง], v = ล่าง(0)…บน(1), a = หลัง(0)…หน้า(1)"""
    def __init__(s, V, side, pca=False, N=None):
        s.V = V; W = V; s.N = N; s.na = N[:, 2] if N is not None else None
        if pca:  # แกนยาวของกระดูก = PCA แรก (ชี้ขึ้น), หน้า = +z ตั้งฉากกับแกน, ข้าง = x
            c = V.mean(0); u, sv, vt = np.linalg.svd(V - c, full_matrices=False); ay = vt[0] * (1 if vt[0][1] > 0 else -1)
            az = np.array([0, 0, 1.]) - ay * ay[2]; az /= np.linalg.norm(az); ax = np.cross(ay, az)
            if ax[0] < 0: ax = -ax
            W = np.c_[(V - c) @ ax, (V - c) @ ay, (V - c) @ az]
            if N is not None: s.na = N @ az
        lo, hi = W.min(0), W.max(0); s.lo, s.hi = lo, hi; d = np.maximum(hi - lo, 1e-9)
        x = (W[:, 0] - lo[0]) / d[0]
        s.m = (1 - x) if side == 'L' else x if side == 'R' else x
        s.v = (W[:, 1] - lo[1]) / d[1]; s.a = (W[:, 2] - lo[2]) / d[2]
        s.L = float(np.linalg.norm(d))
    def pick(s, f=None, o=None):
        f = f or {}; o = o or {}
        k = np.ones(len(s.V), bool)
        for c, (a, b) in f.items():
            if c == 'face': k &= s.nface(a); continue
            k &= (getattr(s, c) >= a) & (getattr(s, c) <= b)
        if not k.any(): return None
        sc_ = sum(w * getattr(s, c) for c, w in o.items()) if o else np.zeros(len(s.V))
        i = np.where(k)[0][np.argmax(np.asarray(sc_)[k])]
        return s.V[i]
    def nface(s, sign):  # ผิวที่หันไปทางหน้า (+1) / หลัง (-1)
        return (s.na * sign) > .45
    def centroid(s, f):
        k = np.ones(len(s.V), bool)
        for c, (a, b) in f.items(): k &= (getattr(s, c) >= a) & (getattr(s, c) <= b)
        return s.V[k].mean(0) if k.any() else None

def sphere_fit(P):
    A = np.c_[2 * P, np.ones(len(P))]; b = (P ** 2).sum(1)
    c, *_ = np.linalg.lstsq(A, b, rcond=None); r = np.sqrt(c[3] + (c[:3] ** 2).sum())
    return c[:3], r

# ---------- landmark specs: name -> (filter, objective) ----------
S = {}
S['humerus'] = [
 ('Head', {'v': (.9, 1)}, {'m': 1, 'v': .4}),
 ('Anatomical neck', {'v': (.86, .92), 'a': (.3, .7)}, {'m': 1}),
 ('Surgical neck', {'v': (.78, .82)}, {'a': 1}),
 ('Greater tubercle', {'v': (.86, 1)}, {'m': -1, 'v': .3}),
 ('Lesser tubercle', {'v': (.84, .92), 'm': (.35, .7)}, {'a': 1}),
 ('Intertubercular groove', {'v': (.8, .88), 'm': (.25, .5), 'face': (1, 0)}, {'a': -1}),
 ('Deltoid tuberosity', {'v': (.5, .62)}, {'m': -1, 'a': .3}),
 ('Shaft', {'v': (.4, .45)}, {'a': 1}),
 ('Capitulum', {'v': (0, .07), 'm': (0, .45)}, {'a': 1, 'v': -.3}),
 ('Trochlea', {'v': (0, .06), 'm': (.5, .8)}, {'v': -1}),
 ('Olecranon fossa', {'v': (.05, .13), 'm': (.4, .65), 'face': (-1, 0)}, {'a': 1}),
 ('Coronoid fossa', {'v': (.06, .13), 'm': (.5, .68), 'face': (1, 0)}, {'a': -1}),
 ('Radial fossa', {'v': (.06, .13), 'm': (.25, .45), 'face': (1, 0)}, {'a': -1}),
 ('Medial epicondyle', {'v': (0, .12)}, {'m': 1}),
 ('Lateral epicondyle', {'v': (0, .12)}, {'m': -1}),
]
S['femur'] = [
 ('Head', {'v': (.9, 1)}, {'m': 1, 'v': .5}),
 ('Fovea capitis', {'v': (.9, 1)}, {'m': 1}),
 ('Neck', {'v': (.86, .94), 'm': (.45, .75)}, {'a': 1}),
 ('Greater trochanter', {'v': (.86, 1)}, {'m': -1, 'v': .6}),
 ('Lesser trochanter', {'v': (.76, .86)}, {'m': 1, 'a': -.4}),
 ('Intertrochanteric line', {'v': (.82, .88), 'm': (.25, .55)}, {'a': 1}),
 ('Intertrochanteric crest', {'v': (.82, .9), 'm': (.25, .55)}, {'a': -1}),
 ('Gluteal tuberosity', {'v': (.68, .76)}, {'a': -1, 'm': -.5}),
 ('Pectineal line', {'v': (.7, .78)}, {'a': -1, 'm': .5}),
 ('Shaft (body)', {'v': (.48, .52)}, {'a': 1}),
 ('Linea aspera', {'v': (.4, .55)}, {'a': -1}),
 ('Adductor tubercle', {'v': (.1, .17)}, {'m': 1}),
 ('Medial epicondyle', {'v': (.05, .1)}, {'m': 1}),
 ('Lateral epicondyle', {'v': (.05, .1)}, {'m': -1}),
 ('Medial condyle', {'v': (0, .1), 'm': (.6, 1)}, {'a': -1, 'v': -.6}),
 ('Lateral condyle', {'v': (0, .1), 'm': (0, .4)}, {'a': -1, 'v': -.6}),
 ('Intercondylar fossa', {'v': (0, .08), 'm': (.4, .6), 'face': (-1, 0)}, {'a': 1}),
 ('Patellar surface', {'v': (.02, .1), 'm': (.4, .6)}, {'a': 1}),
]
S['tibia'] = [
 ('Medial condyle', {'v': (.92, 1)}, {'m': 1}),
 ('Lateral condyle', {'v': (.92, 1)}, {'m': -1}),
 ('Intercondylar eminence', {'v': (.9, 1), 'm': (.38, .62)}, {'v': 1}),
 ('Tibial tuberosity', {'v': (.8, .9)}, {'a': 1}),
 ('Anterior crest', {'v': (.55, .65)}, {'a': 1}),
 ('Shaft', {'v': (.35, .4)}, {'m': 1}),
 ('Medial malleolus', {'v': (0, .06)}, {'m': 1, 'v': -.5}),
]
S['fibula'] = [
 ('Head', {'v': (.96, 1)}, {'v': 1}),
 ('Neck', {'v': (.9, .93)}, {'m': -1}),
 ('Lateral malleolus', {'v': (0, .06)}, {'m': -1, 'v': -.4}),
]
S['radius'] = [
 ('Head', {'v': (.96, 1)}, {'v': 1}),
 ('Neck', {'v': (.9, .93)}, {'a': 1}),
 ('Radial tuberosity', {'v': (.8, .88)}, {'m': 1}),
 ('Shaft', {'v': (.45, .55)}, {'a': 1}),
 ('Styloid process', {'v': (0, .05)}, {'m': -1, 'v': -.6}),
]
S['ulna'] = [
 ('Olecranon process', {'v': (.94, 1)}, {'v': 1, 'a': -.5}),
 ('Trochlear notch', {'v': (.86, .95), 'm': (.3, .7), 'face': (1, 0)}, {'a': -1}),
 ('Coronoid process', {'v': (.84, .91)}, {'a': 1}),
 ('Radial notch', {'v': (.86, .92)}, {'m': -1}),
 ('Head', {'v': (.03, .08)}, {'m': -1, 'a': .3}),
 ('Styloid process', {'v': (0, .03)}, {'v': -1, 'm': .3}),
]
S['scapula'] = [
 ('Spine of scapula', {'v': (.62, .78), 'm': (.3, .6)}, {'a': -1}),
 ('Acromion process', {'v': (.7, 1)}, {'m': -1, 'v': .6, 'a': -.3}),
 ('Supraspinous fossa', {'v': (.8, .9), 'm': (.5, .72), 'face': (-1, 0)}, {'a': 1}),
 ('Infraspinous fossa', {'v': (.35, .5), 'm': (.4, .65), 'face': (-1, 0)}, {'a': 1}),
 ('Glenoid fossa', {'v': (.6, .78)}, {'m': -1, 'a': .3}),
 ('Coracoid process', {'v': (.7, 1)}, {'a': 1, 'v': .3}),
 ('Subscapular fossa', {'v': (.4, .6), 'm': (.4, .65), 'face': (1, 0)}, {'a': -1}),
 ('Scapular notch', {'v': (.8, 1), 'm': (.4, .55)}, {'v': 1}),
 ('Axillary (lateral) border', {'v': (.3, .45)}, {'m': -1}),
 ('Medial border', {'v': (.4, .6)}, {'m': 1}),
 ('Inferior angle', {}, {'v': -1}),
]
S['clavicle'] = [('ปลายใน (–sternum)', {}, {'m': 1}), ('ปลายนอก (–acromion)', {}, {'m': -1})]
S['sternum'] = [
 ('Suprasternal notch', {'m': (.4, .6)}, {'v': 1}),
 ('Manubrium', {'v': (.82, .9)}, {'a': 1}),
 ('Sternomanubrial angle', {'v': (.74, .79)}, {'a': 1}),
 ('Body', {'v': (.4, .5)}, {'a': 1}),
 ('Xiphoid process', {}, {'v': -1}),
]
S['patella'] = [('Patella (สามเหลี่ยม)', {'v': (.4, .6)}, {'a': 1})]
S['hip'] = [
 ('Iliac crest', {'a': (.35, .7)}, {'v': 1}),
 ('ASIS', {'v': (.6, 1)}, {'a': 1}),
 ('AIIS', {'v': (.45, .6)}, {'a': 1}),
 ('PSIS', {'v': (.6, 1)}, {'a': -1}),
 ('PIIS', {'v': (.5, .62)}, {'a': -1}),
 ('Iliac fossa', {'v': (.65, .85), 'a': (.4, .75)}, {'m': 1}),
 ('Greater sciatic notch', {'v': (.38, .55), 'a': (0, .4), 'face': (-1, 0)}, {'a': 1}),
 ('Ischial spine', {'v': (.3, .42), 'a': (0, .3)}, {'m': 1}),
 ('Ischial tuberosity', {'a': (0, .45)}, {'v': -1}),
 ('Superior pubic ramus', {'v': (.22, .32), 'a': (.7, .9)}, {'v': 1}),
 ('Inferior pubic ramus', {'v': (.04, .14), 'a': (.6, .85)}, {'m': 1}),
 ('Pubic tubercle', {'v': (.15, .3)}, {'a': 1}),
 ('Pubic body / pubic symphysis', {'v': (.05, .3)}, {'m': 1}),
]
S['vert'] = [  # กระดูกสันหลังทั่วไป (ใช้กับ C3–L5)
 ('Vertebral body', {'m': (.35, .65)}, {'a': 1}),
 ('Spinous process', {'m': (.4, .6)}, {'a': -1, 'v': -.3}),
 ('Transverse process', {}, {'m': 1}),
 ('Superior articular process', {'a': (.15, .55)}, {'v': 1, 'm': .2}),
 ('Lamina', {'m': (.3, .42), 'a': (.15, .35)}, {'a': -1}),
 ('Pedicle', {'m': (.28, .38), 'a': (.45, .62)}, {'m': -1}),
]
S['vert_C1'] = [('Anterior arch', {}, {'a': 1}), ('Posterior arch', {}, {'a': -1}), ('Transverse process', {}, {'m': 1})]
S['vert_C2'] = [('Dens', {}, {'v': 1}), ('Body', {'m': (.35, .65)}, {'a': 1, 'v': -.4}), ('Bifid spinous process', {}, {'a': -1})]
S['temporal'] = [
 ('Squamous part', {'v': (.75, 1)}, {'m': -1}),
 ('Zygomatic process', {'v': (.3, .6)}, {'a': 1, 'm': -.3}),
 ('Mastoid process', {'a': (0, .4)}, {'v': -1, 'm': -.3}),
 ('Styloid process', {'a': (.35, .7)}, {'v': -1}),
 ('Tympanic part', {'v': (.25, .45), 'a': (.4, .6)}, {'m': -1}),
 ('Petrous part', {'v': (.25, .6)}, {'m': 1}),
]
S['occipital'] = [
 ('External occipital protuberance', {'m': (.45, .55)}, {'a': -1, 'v': -.2}),
 ('Lambdoid suture', {'m': (.4, .6)}, {'v': 1}),
]
S['frontal'] = [('Frontal sinus (หลังหัวคิ้ว)', {'m': (.3, .45), 'v': (.1, .3)}, {'a': 1})]
S['parietal'] = []
S['sphenoid'] = [('Sella turcica (pituitary gland)', {'m': (.45, .55), 'a': (.3, .6)}, {'v': 1})]
S['ethmoid'] = [('Crista galli', {'m': (.45, .55)}, {'v': 1}), ('Cribriform plate', {'m': (.3, .4), 'v': (.75, .95)}, {'v': 1})]
S['mandible'] = [('Mandible (รากฟัน = gomphosis)', {'m': (.4, .6)}, {'a': 1})]
S['maxilla'] = [('Palatine process', {'v': (0, .25)}, {'m': 1, 'a': .4})]
S['hyoid'] = [('Body', {'m': (.4, .6)}, {'a': 1}), ('Greater horn', {}, {'m': 1, 'a': -1}), ('Lesser horn', {'a': (.5, .85)}, {'v': 1})]
S['sacrum'] = [('Sacrum (5 ชิ้นเชื่อมกัน)', {'m': (.4, .6)}, {'a': -1})]

def base(n):
    if n.startswith('vert_'): return n if n in ('vert_C1', 'vert_C2') else 'vert'
    return n.rsplit('_', 1)[0] if side_of(n) else n

PCA = {'humerus', 'radius', 'ulna', 'femur', 'tibia', 'fibula', 'clavicle'}
LM = {}
for n, g in G.items():
    b = base(n); spec = S.get(b)
    if spec is None: continue
    F = Frame(np.asarray(g.vertices), side_of(n) if b != 'vert' else '', pca=b in PCA, N=np.asarray(g.vertex_normals))
    if b.startswith('vert'): F.m = np.abs(F.m - .5) * 2  # vertebra: m = ห่างจากแนวกลาง (0 กลาง…1 ข้าง)
    pts = {}
    for name, f, o in spec:
        p = F.pick(f, o)
        if p is not None: pts[name] = [round(float(x), 5) for x in p]
    LM[n] = pts

# scapular notch: ขอบบนถัดจากโคน coracoid เข้าด้านใน
for s_ in 'LR':
    n = f'scapula_{s_}'
    if n in G and 'Coracoid process' in LM.get(n, {}):
        F = Frame(np.asarray(G[n].vertices), s_); c = np.asarray(LM[n]['Coracoid process'])
        mc = F.m[np.argmin(np.linalg.norm(F.V - c, axis=1))]
        p = F.pick({'m': (mc + .06, mc + .16), 'v': (.7, 1)}, {'v': 1})
        if p is not None: LM[n]['Scapular notch'] = [float(x) for x in p]
# พิเศษ: จุดที่ต้องใช้กระดูกข้างเคียง
for s in 'LR':
    if f'femur_{s}' in G and f'hip_{s}' in G:
        F = Frame(np.asarray(G[f'femur_{s}'].vertices), s, pca=True)
        hv = F.V[(F.v > .9) & (F.m > .55)]; c, r = sphere_fit(hv)
        H = np.asarray(G[f'hip_{s}'].vertices); i = np.argmin(np.linalg.norm(H - c, axis=1))
        LM[f'hip_{s}']['Acetabulum'] = [round(float(x), 5) for x in (H[i] * .5 + c * .5)]
        Fh = Frame(H, s); k = (Fh.v < .3) & (Fh.v > .08) & (Fh.a > .5) & (Fh.a < .85) & (Fh.m > .3) & (Fh.m < .7)
        LM[f'hip_{s}']['Obturator foramen'] = [round(float(x), 5) for x in H[k].mean(0)] if k.any() else None
def near(a, b):  # จุดบน a ที่ใกล้ b ที่สุด
    A = np.asarray(G[a].vertices); d, i = cKDTree(np.asarray(G[b].vertices)).query(A); return A, d
for s in 'LR':
    if f'parietal_{s}' in G:
        A, d = near(f'parietal_{s}', 'frontal'); k = d < .004
        if k.any():
            P = A[k]; LM[f'parietal_{s}']['Coronal suture'] = list(map(float, P[np.argmax(P[:, 1])]))
        A, d = near(f'parietal_{s}', f'parietal_{"R" if s=="L" else "L"}'); k = d < .004
        if k.any():
            P = A[k]; LM[f'parietal_{s}']['Sagittal suture'] = list(map(float, P[np.argmax(P[:, 1])]))
            LM[f'parietal_{s}']['Lambda'] = list(map(float, P[np.argmin(P[:, 2])]))
        A, d = near(f'parietal_{s}', 'occipital'); k = d < .004
        if k.any():
            P = A[k]; LM[f'parietal_{s}']['Lambdoid suture'] = list(map(float, P[len(P)//2]))
    if f'temporal_{s}' in G and 'sphenoid' in G:
        A = np.asarray(G['sphenoid'].vertices)
        d = sum(cKDTree(np.asarray(G[o].vertices)).query(A)[0] for o in ['frontal', f'parietal_{s}', f'temporal_{s}'])
        A2 = A[(A[:, 0] > 0) if s == 'L' else (A[:, 0] < 0)]
        d2 = d[(A[:, 0] > 0) if s == 'L' else (A[:, 0] < 0)]
        LM[f'temporal_{s}']['Pterion (ทัดดอกไม้)'] = list(map(float, A2[np.argmin(d2)]))
if 'occipital' in G:
    O = np.asarray(G['occipital'].vertices); F = Frame(O, '')
    k = (F.v < .2) & (F.m > .4) & (F.m < .6)
    # foramen magnum = กลางรูด้านล่าง: เฉลี่ยขอบรู (จุดต่ำสุดหน้า/หลัง)
    ring = O[(F.v < .12)]; c = ring.mean(0); LM['occipital']['Foramen magnum'] = list(map(float, c))

# ---------- regions (สีแยกส่วนตามสมุด) ----------
REG = [('—', '#e8e0cc')]
def rid(name, col):
    for i, (n, c) in enumerate(REG):
        if n == name: return i
    REG.append((name, col)); return len(REG) - 1
SEED = {  # bone -> [(region name, landmark, radius frac of bone length, color)]
 'humerus': [('Head', 'Head', .07, '#f28b82'), ('Greater tubercle', 'Greater tubercle', .045, '#8ab4f8'), ('Lesser tubercle', 'Lesser tubercle', .03, '#fdd663'),
             ('Deltoid tuberosity', 'Deltoid tuberosity', .05, '#c58af9'), ('Capitulum', 'Capitulum', .035, '#78d9ec'), ('Trochlea', 'Trochlea', .04, '#ccff90'),
             ('Medial epicondyle', 'Medial epicondyle', .035, '#81c995'), ('Lateral epicondyle', 'Lateral epicondyle', .03, '#81c995')],
 'femur': [('Head', 'Head', .06, '#f28b82'), ('Greater trochanter', 'Greater trochanter', .06, '#81c995'), ('Lesser trochanter', 'Lesser trochanter', .035, '#8ab4f8'),
           ('Medial condyle', 'Medial condyle', .06, '#e39a8f'), ('Lateral condyle', 'Lateral condyle', .06, '#e39a8f'), ('Medial epicondyle', 'Medial epicondyle', .035, '#7fbf8a'),
           ('Lateral epicondyle', 'Lateral epicondyle', .035, '#7fbf8a')],
 'radius': [('Head', 'Head', .05, '#fdd663'), ('Radial tuberosity', 'Radial tuberosity', .05, '#f28b82'), ('Styloid process', 'Styloid process', .04, '#c58af9')],
 'ulna': [('Olecranon', 'Olecranon process', .06, '#81c995'), ('Coronoid process', 'Coronoid process', .04, '#f28b82'), ('Radial notch', 'Radial notch', .03, '#8ab4f8'),
          ('Head of ulna', 'Head', .04, '#c58af9')],
 'tibia': [('Medial condyle', 'Medial condyle', .07, '#81c995'), ('Lateral condyle', 'Lateral condyle', .07, '#a8dab5'), ('Tibial tuberosity', 'Tibial tuberosity', .04, '#f28b82'),
           ('Medial malleolus', 'Medial malleolus', .05, '#8ab4f8')],
 'fibula': [('Head', 'Head', .05, '#fdd663'), ('Lateral malleolus', 'Lateral malleolus', .06, '#8ab4f8')],
 'scapula': [('Acromion process', 'Acromion process', .12, '#8ab4f8'), ('Coracoid process', 'Coracoid process', .1, '#fdd663'), ('Glenoid fossa', 'Glenoid fossa', .08, '#f28b82'),
             ('Spine of scapula', 'Spine of scapula', .1, '#c58af9')],
 'temporal': [('Mastoid part', 'Mastoid process', .3, '#c58af9'), ('Zygomatic process', 'Zygomatic process', .25, '#8ab4f8'), ('Styloid process', 'Styloid process', .14, '#fdd663'),
              ('Tympanic part', 'Tympanic part', .14, '#81c995')],
}
REGIDX = {}
for n, g in G.items():
    b = base(n); V = np.asarray(g.vertices); R = np.zeros(len(V), np.float32)
    F = Frame(V, side_of(n), pca=b in PCA)
    if b in SEED and n in LM:
        best = np.full(len(V), np.inf)
        for rn, lm, rf, col in SEED[b]:
            if lm not in LM[n]: continue
            d = np.linalg.norm(V - np.asarray(LM[n][lm]), axis=1) / F.L
            k = (d < rf) & (d < best); R[k] = rid(rn, col); best[k] = d[k]
        if b == 'femur':  # neck = ระหว่าง head กับ trochanter
            k = (R == 0) & (F.v > .86) & (F.m > .45); R[k] = rid('Neck (femur)', '#fdd663')
        if b == 'scapula':  # สันและแอ่งด้านหลังเท่านั้น
            N = np.asarray(g.vertex_normals); sp = rid('Spine of scapula', '#c58af9'); R[(R == sp) & (N[:, 2] > .2)] = 0
        if b == 'temporal':
            R[(R == 0) & (F.v > .5) & (F.m < .75)] = rid('Squamous part', '#f6aea9')
            R[(R == 0)] = rid('Petrous part', '#e6c9a8')
    elif b == 'hip' and f'femur_{side_of(n)}' in G:
        c = np.asarray(LM[n]['Acetabulum']); y = V[:, 1]; z = V[:, 2]
        R[:] = np.where(y > c[1] + .01, rid('Ilium', '#f28b82'), np.where(z > c[2] + .005, rid('Pubis', '#fdd663'), rid('Ischium', '#81c995')))
    elif b == 'sternum':
        R[:] = np.where(F.v > .78, rid('Manubrium', '#81c995'), np.where(F.v < .1, rid('Xiphoid process', '#c58af9'), rid('Body (sternum)', '#f6aea9')))
    elif b == 'vert' or b in ('vert_C1', 'vert_C2'):
        lat = np.abs(F.m - .5) * 2
        body = F.a > .62 if b != 'vert_C1' else np.zeros(len(V), bool)
        R[:] = rid('Vertebral arch', '#8ab4f8'); R[body] = rid('Vertebral body', '#f28b82')
        R[(~body) & (F.a < .22) & (lat < .3)] = rid('Spinous process', '#fbbc6b')
        R[(~body) & (lat > .62)] = rid('Transverse process', '#4db6ac')
        if b == 'vert_C2': R[F.v > .7] = rid('Dens', '#fdd663')
    elif b == 'rib':
        k = int(n.split('_')[1]); R[:] = rid('True ribs (1–7)', '#f28b82') if k <= 7 else rid('False ribs (8–10)', '#c58af9') if k <= 10 else rid('Floating ribs (11–12)', '#8ab4f8')
    elif b == 'costal_cartilage':
        R[:] = rid('Costal cartilage', '#9fc5e8')
    else:
        COL = {'frontal': ('Frontal', '#3d9be9'), 'parietal': ('Parietal', '#4caf50'), 'occipital': ('Occipital', '#f08a24'), 'sphenoid': ('Sphenoid', '#f4d03f'),
               'ethmoid': ('Ethmoid', '#e58ad6'), 'zygomatic': ('Zygomatic', '#9c7b5b'), 'nasal': ('Nasal', '#80deea'), 'maxilla': ('Maxilla', '#f48fb1'),
               'mandible': ('Mandible', '#ffab91'), 'lacrimal': ('Lacrimal', '#4db6ac'), 'palatine': ('Palatine', '#ffcc80'), 'vomer': ('Vomer', '#b39ddb'),
               'concha': ('Inferior nasal concha', '#a5d6a7'),
               'scaphoid': ('Scaphoid', '#e040fb'), 'lunate': ('Lunate', '#4dd0e1'), 'triquetrum': ('Triquetrum', '#43a047'), 'pisiform': ('Pisiform', '#e53935'),
               'trapezium': ('Trapezium', '#ffb300'), 'trapezoid': ('Trapezoid', '#2e7d32'), 'capitate': ('Capitate', '#fdd835'), 'hamate': ('Hamate', '#1e88e5'),
               'metacarpal': ('Metacarpals', '#ffd180'), 'metatarsal': ('Metatarsals', '#4dd0e1'),
               'calcaneus': ('Calcaneus', '#fdd835'), 'talus': ('Talus', '#ce93d8'), 'cuboid': ('Cuboid', '#7986cb'), 'navicular': ('Navicular', '#c62828'), 'cuneiform': ('Cuneiforms', '#43a047'),
               'patella': ('Patella', '#43a047'), 'sacrum': ('Sacrum', '#fdd835'), 'disc': ('Intervertebral disc', '#80cbc4'), 'clavicle': ('Clavicle', '#ffcc80')}
        bb = b.split('_')[0] if b.startswith(('metacarpal', 'metatarsal', 'cuneiform')) else b
        if b.startswith('phalanx'):
            t = n.split('_')[2][1]; R[:] = rid({'p': 'Proximal phalanges', 'm': 'Middle phalanges', 'd': 'Distal phalanges'}[t], {'p': '#aed581', 'm': '#81d4fa', 'd': '#ffab91'}[t])
        elif bb in COL: R[:] = rid(*COL[bb])
    REGIDX[n] = R

for n, R in REGIDX.items():
    G[n].vertex_attributes['_region'] = R.astype(np.float32)
# trimesh exports custom vertex_attributes as _NAME
for g in G.values(): g.vertex_normals  # คำนวณ normal ไว้ใน GLB (ไม่ต้องคำนวณบน iPad)
sc.export(out + '/skeleton_lm_raw.glb', include_normals=True)
json.dump({'landmarks': LM, 'regions': REG}, open(out + '/landmarks.json', 'w'), ensure_ascii=False)
print('landmarked', len(LM), 'regions', len(REG))
