# สร้าง muscles.glb + m_landmarks.json จาก BodyParts3D 3.0 (obj_95) ให้ตรงตำแหน่งกับ skeleton_raw.glb
# ใช้: python3 build_muscles.py <raw3_dir(มี parts_list_e.txt + obj)> <skeleton_raw.glb> <out_dir>
import sys, os, json, numpy as np, trimesh
from scipy.spatial import cKDTree

R, SKEL, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
OBJ = {os.path.splitext(f)[0]: os.path.join(dp, f) for dp, _, fs in os.walk(R) for f in fs if f.endswith('.obj')}
N3 = {}
for l in open(os.path.join(R, 'parts_list_e.txt'), encoding='utf-8', errors='ignore').read().splitlines()[1:]:
    p = l.split('\t')
    if len(p) >= 2 and p[0].strip() in OBJ: N3.setdefault(p[1].strip(), p[0].strip())
def load(name):
    fid = N3.get(name)
    if not fid: return None
    m = trimesh.load(OBJ[fid], force='mesh', process=False); m.merge_vertices()
    v = m.vertices * 0.001; m.vertices = np.c_[v[:, 0], v[:, 2], -v[:, 1]]; return m

# ---------- จัดแนวให้ตรงกับโครงกระดูก (เทียบ frontal bone) ----------
sk = trimesh.load(SKEL); G = sk.geometry
A = load('frontal bone'); B = np.asarray(G['frontal'].vertices)
best = None
for flip in (1, -1):
    for rot in (0, 1):
        V = A.vertices.copy()
        if rot: V[:, 0] *= -1; V[:, 2] *= -1
        V[:, 0] *= flip
        d = np.abs((V.max(0) - V.min(0)) - (B.max(0) - B.min(0))).sum() + np.abs((V.mean(0) - V.min(0)) - (B.mean(0) - B.min(0))).sum()
        if best is None or d < best[0]: best = (d, flip, rot, B.min(0) - V.min(0))
_, FLIP, ROT, OFF = best
def align(m):
    V = m.vertices.copy()
    if ROT: V[:, 0] *= -1; V[:, 2] *= -1
    V[:, 0] *= FLIP; m.vertices = V + OFF
    if FLIP * (1 if not ROT else 1) == -1: m.invert()
    return m
print('align flip', FLIP, 'rot', ROT, 'err', round(best[0], 5))

# ---------- รายการกล้ามเนื้อ: id -> [(ชื่อส่วน/หัว, ชื่อใน BodyParts3D)] ; {s} = left/right ; ไม่มี {s} = ชิ้นกลางตัว ----------
P = lambda n: [('', n)]
MUS = {
 'frontalis': P('{s} frontalis'), 'orbicularis_oculi': [('Orbital part', 'orbital part of {s} orbicularis oculi'), ('Palpebral part', 'palpebral part of {s} orbicularis oculi')],
 'nasalis': P('{s} nasalis'), 'zygomaticus_major': P('{s} zygomaticus major'), 'zygomaticus_minor': P('{s} zygomaticus minor'),
 'orbicularis_oris': P('orbicularis oris'), 'mentalis': P('{s} mentalis'), 'buccinator': P('{s} buccinator'),
 'masseter': [('Superficial part', 'superficial part of {s} masseter'), ('Deep part', 'deep part of {s} masseter')], 'temporalis': P('{s} temporalis'),
 'medial_pterygoid': P('{s} medial pterygoid'), 'lateral_pterygoid': [('Upper head', 'upper head of {s} lateral pterygoid'), ('Lower head', 'lower head of {s} lateral pterygoid')],
 'sternocleidomastoid': P('{s} sternocleidomastoid'),
 'pectoralis_minor': P('{s} pectoralis minor'), 'serratus_anterior': P('{s} serratus anterior'),
 'trapezius': [('Upper part', 'descending part of {s} trapezius'), ('Middle part', 'transverse part of {s} trapezius'), ('Lower part', 'ascending part of {s} trapezius')],
 'levator_scapulae': P('{s} levator scapulae'), 'rhomboid_minor': P('{s} rhomboid minor'), 'rhomboid_major': P('{s} rhomboid major'),
 'pectoralis_major': [('Clavicular part', 'clavicular part of {s} pectoralis major'), ('Sternocostal part', 'sternocostal part of {s} pectoralis major'), ('Abdominal part', 'abdominal part of {s} pectoralis major')],
 'latissimus_dorsi': P('{s} latissimus dorsi'),
 'deltoid': [('Anterior part', 'clavicular part of {s} deltoid'), ('Lateral part', 'acromial part of {s} deltoid'), ('Posterior part', 'spinal part of {s} deltoid')],
 'supraspinatus': P('{s} supraspinatus'), 'infraspinatus': P('{s} infraspinatus muscle'), 'teres_major': P('{s} teres major'), 'teres_minor': P('{s} teres minor'),
 'biceps_brachii': [('Long head', 'long head of {s} biceps brachii'), ('Short head', 'short head of {s} biceps brachii')], 'brachialis': P('{s} brachialis'),
 'triceps_brachii': [('Long head', 'long head of {s} triceps brachii'), ('Medial head', 'medial head of {s} triceps brachii'), ('Lateral head', 'lateral head of {s} triceps brachii')],
 'pronator_teres': [('Humeral head', 'humeral head of {s} pronator teres'), ('Ulnar head', 'ulnar head of {s} pronator teres')], 'flexor_carpi_radialis': P('{s} flexor carpi radialis'),
 'flexor_carpi_ulnaris': [('Humeral head', 'humeral head of {s} flexor carpi ulnaris'), ('Ulnar head', 'ulnar head of {s} flexor carpi ulnaris')], 'palmaris_longus': P('{s} palmaris longus'),
 'flexor_digitorum_superficialis': [('Humeroulnar head', 'humeroulnar head of {s} flexor digitorum superficialis'), ('Radial head', 'radial head of {s} flexor digitorum superficialis')],
 'extensor_digitorum': P('{s} extensor digitorum'), 'supinator': P('{s} supinator'), 'extensor_pollicis_longus': P('{s} extensor pollicis longus'), 'extensor_pollicis_brevis': P('{s} extensor pollicis brevis'),
 'thenar': [('Abductor pollicis brevis', '{s} abductor pollicis brevis'), ('Flexor pollicis brevis', 'superficial head of {s} flexor pollicis brevis'), ('Flexor pollicis brevis', 'deep head of {s} flexor pollicis brevis'), ('Opponens pollicis', '{s} opponens pollicis')],
 'hypothenar': [('Abductor digiti minimi', 'abductor digiti minimi of {s} hand'), ('Flexor digiti minimi brevis', 'flexor digiti minimi brevis of {s} hand'), ('Opponens digiti minimi', 'opponens digiti minimi of {s} hand')],
 'dorsal_interossei': P('set of dorsal interossei of {s} hand'), 'palmar_interossei': P('set of palmar interossei of {s} hand'),
 'spinalis': [('Spinalis cervicis', '{s} spinalis cervicis'), ('Spinalis thoracis', '{s} spinalis thoracis')],
 'longissimus': [('Longissimus capitis', '{s} longissimus capitis'), ('Longissimus cervicis', '{s} longissimus cervicis'), ('Longissimus thoracis', '{s} longissimus thoracis')],
 'iliocostalis': [('Iliocostalis cervicis', '{s} iliocostalis cervicis'), ('Iliocostalis thoracis', '{s} iliocostalis thoracis'), ('Iliocostalis lumborum', '{s} iliocostalis lumborum')],
 'diaphragm': P('diaphragm'), 'external_intercostal': P('external intercostal muscle'), 'internal_intercostal': P('internal intercostal muscle'),
 'rectus_abdominis': P('{s} rectus abdominis'), 'external_oblique': P('{s} external oblique'), 'internal_oblique': P('{s} internal oblique'), 'transversus_abdominis': P('{s} transversus abdominis'),
 'psoas_major': P('{s} psoas major'), 'iliacus': P('{s} iliacus'),
 'gluteus_maximus': P('{s} gluteus maximus'), 'gluteus_medius': P('{s} gluteus medius'), 'gluteus_minimus': P('{s} gluteus minimus'), 'piriformis': P('{s} piriformis'), 'tensor_fasciae_latae': P('{s} tensor fasciae latae'),
 'rectus_femoris': P('{s} rectus femoris'), 'vastus_lateralis': P('{s} vastus lateralis'), 'vastus_medialis': P('{s} vastus medialis'), 'vastus_intermedius': P('{s} vastus intermedius'), 'sartorius': P('{s} sartorius'),
 'pectineus': P('{s} pectineus'), 'adductor_magnus': P('{s} adductor magnus'), 'adductor_longus': P('{s} adductor longus'), 'adductor_brevis': P('{s} adductor brevis'), 'gracilis': P('{s} gracilis'),
 'biceps_femoris': [('Long head', 'long head of {s} biceps femoris'), ('Short head', 'short head of {s} biceps femoris')], 'semitendinosus': P('{s} semitendinosus'), 'semimembranosus': P('{s} semimembranosus'),
 'tibialis_anterior': P('{s} tibialis anterior'), 'tibialis_posterior': P('{s} tibialis posterior'),
 'gastrocnemius': [('Medial head', 'medial head of {s} gastrocnemius'), ('Lateral head', 'lateral head of {s} gastrocnemius')], 'soleus': P('{s} soleus'),
 'fibularis_longus': P('{s} fibularis longus'), 'fibularis_brevis': P('{s} fibularis brevis'),
}
# จุดเกาะต้น/ปลาย (เฉพาะมัดที่สไลด์ระบุ) → ใช้หาตำแหน่งหมุด O / I บนกล้ามเนื้อ
T = lambda a, b: [f'vert_T{i}' for i in range(a, b + 1)]
OI = {
 'sternocleidomastoid': (['sternum', 'clavicle_{s}'], ['temporal_{s}']),
 'pectoralis_minor': (['rib_3_{s}', 'rib_4_{s}', 'rib_5_{s}'], ['scapula_{s}']),
 'serratus_anterior': ([f'rib_{i}_{{s}}' for i in range(1, 10)], ['scapula_{s}']),
 'trapezius': (['occipital', 'vert_C7'] + T(1, 12), ['clavicle_{s}', 'scapula_{s}']),
 'levator_scapulae': (['vert_C1', 'vert_C2', 'vert_C3', 'vert_C4'], ['scapula_{s}']),
 'rhomboid_minor': (['vert_C7', 'vert_T1'], ['scapula_{s}']), 'rhomboid_major': (T(2, 5), ['scapula_{s}']),
 'pectoralis_major': (['clavicle_{s}', 'sternum'] + [f'costal_cartilage_{i}_{{s}}' for i in range(2, 7)], ['humerus_{s}']),
 'latissimus_dorsi': (T(7, 12) + [f'vert_L{i}' for i in range(1, 6)] + ['hip_{s}'], ['humerus_{s}']),
 'deltoid': (['clavicle_{s}', 'scapula_{s}'], ['humerus_{s}']),
 'teres_major': (['scapula_{s}'], ['humerus_{s}']), 'teres_minor': (['scapula_{s}'], ['humerus_{s}']),
 'biceps_brachii': (['scapula_{s}'], ['radius_{s}']), 'triceps_brachii': (['scapula_{s}', 'humerus_{s}'], ['ulna_{s}']),
 'psoas_major': ([f'vert_L{i}' for i in range(1, 6)], ['femur_{s}']), 'iliacus': (['hip_{s}'], ['femur_{s}']),
 'rectus_femoris': (['hip_{s}'], ['patella_{s}', 'tibia_{s}']), 'vastus_lateralis': (['femur_{s}'], ['patella_{s}', 'tibia_{s}']),
 'vastus_medialis': (['femur_{s}'], ['patella_{s}', 'tibia_{s}']), 'vastus_intermedius': (['femur_{s}'], ['patella_{s}', 'tibia_{s}']),
 'sartorius': (['hip_{s}'], ['tibia_{s}']),
 'biceps_femoris': (['hip_{s}', 'femur_{s}'], ['fibula_{s}']), 'semitendinosus': (['hip_{s}'], ['tibia_{s}']), 'semimembranosus': (['hip_{s}'], ['tibia_{s}']),
}
scene = trimesh.Scene(); LM = {}; missing = []; nodes = {}
slug = lambda s: ''.join(c if c.isalnum() else '_' for c in s.lower()).strip('_')
for mid, heads in MUS.items():
    paired = any('{s}' in n for _, n in heads)
    for S, word in ([('L', 'left'), ('R', 'right')] if paired else [('', '')]):
        parts = []
        for hn, name in heads:
            m = load(name.replace('{s}', word))
            if m is None: missing.append(name.replace('{s}', word)); continue
            align(m); parts.append((hn, m))
        if not parts: continue
        key = f'm_{mid}' + (f'_{S}' if S else '')
        merged = {}
        for hn, m in parts:  # หัวที่ชื่อซ้ำ (เช่น FPB 2 หัว) รวมเป็นชิ้นเดียว
            merged.setdefault(hn, []).append(m)
        for hn, ms in merged.items():
            m = trimesh.util.concatenate(ms) if len(ms) > 1 else ms[0]
            nn = f'm_{mid}' + (f'__{slug(hn)}' if hn and len(merged) > 1 else '') + (f'_{S}' if S else '')
            scene.add_geometry(m, node_name=nn, geom_name=nn); nodes.setdefault(key, []).append((hn, nn, m))
# ลูกตา (ใช้ปักหมุดกล้ามเนื้อรอบลูกตา 6 มัด ซึ่งไม่มีในโมเดล)
eye = load('eyeball')
if eye is not None:
    align(eye)
    for comp in eye.split(only_watertight=False):
        S = 'L' if comp.centroid[0] > 0 else 'R'; nn = f'm_eye_muscles_{S}'
        if nn in scene.geometry: continue
        scene.add_geometry(comp, node_name=nn, geom_name=nn); nodes[nn] = [('', nn, comp)]
print('nodes', len(scene.geometry), 'tris', sum(len(g.faces) for g in scene.geometry.values()), 'missing', missing)

# ---------- หมุด: ชื่อมัด (กลางมัด ด้านที่หันออก), แต่ละหัว, จุดเกาะต้น O / ปลาย I ----------
BT = {n: cKDTree(np.asarray(g.vertices)) for n, g in G.items()}
def outward(c):
    d = c - np.array([0, c[1], -.02]); d[1] = 0
    if np.linalg.norm(d) < 1e-6: d = np.array([0, 0, 1.])
    return d / np.linalg.norm(d)
def belly(V, c, d):
    sc = (V - c) @ d - .35 * np.linalg.norm(V - c, axis=1); return V[np.argmax(sc)]
def attach(V, bones, other=()):
    bones = [b for b in bones if b in BT]; other = [b for b in other if b in BT and b not in bones]
    if not bones: return None
    d = np.min([BT[b].query(V)[0] for b in bones], axis=0)
    sc = d - (.6 * np.minimum(np.min([BT[b].query(V)[0] for b in other], axis=0), .02) if other else 0)  # ใกล้กระดูกเป้าหมาย และห่างกระดูกอีกปลาย
    k = sc <= np.quantile(sc, .03)
    P = V[k]; c = P.mean(0); return P[np.argmin(np.linalg.norm(P - c, axis=1))]
for key, hs in nodes.items():
    V = np.vstack([np.asarray(m.vertices) for _, _, m in hs]); c = V.mean(0); d = outward(c); lm = {}
    S = key[-1] if key[-2] == '_' and key[-1] in 'LR' else ''
    mid = key[2:-2] if S else key[2:]
    if mid == 'eye_muscles':  # ทิศเกาะบนลูกตา (ด้านหน้าลูกตา)
        r = (V.max(0) - V.min(0)).max() / 2; med = np.array([-1., 0, 0]) if S == 'L' else np.array([1., 0, 0])
        dirs = {'Superior rectus': [0, 1, .5], 'Inferior rectus': [0, -1, .5], 'Medial rectus': list(med * 1 + np.array([0, 0, .5])), 'Lateral rectus': list(-med + np.array([0, 0, .5])),
                'Superior oblique': list(np.array([0, .8, -.2]) + med * .5), 'Inferior oblique': list(np.array([0, -.8, -.1]) - med * .5)}
        for n_, dv in dirs.items():
            dv = np.array(dv, float); dv /= np.linalg.norm(dv); lm[n_] = V[np.argmax((V - c) @ dv)]
    else:
        lm['__belly'] = belly(V, c, d)
        named = [(hn, m) for hn, _, m in hs if hn]
        if len(named) > 1:
            for hn, m in named:
                Vh = np.asarray(m.vertices); ch = Vh.mean(0); lm[hn] = belly(Vh, ch, outward(ch))
        if mid in OI:
            o, i = OI[mid]; f = lambda L: [b.replace('{s}', S) for b in L]
            po, pi = attach(V, f(o), f(i)), attach(V, f(i), f(o))
            if po is not None: lm['Origin'] = po
            if pi is not None: lm['Insertion'] = pi
    LM[key] = {k: [round(float(x), 5) for x in v] for k, v in lm.items()}
scene.export(os.path.join(OUT, 'muscles_raw.glb'))
json.dump({'landmarks': LM}, open(os.path.join(OUT, 'm_landmarks.json'), 'w'))
print('landmark sets', len(LM))
