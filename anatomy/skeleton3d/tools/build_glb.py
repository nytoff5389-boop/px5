import sys,os,json,collections,trimesh,numpy as np
R=sys.argv[1];OUT=sys.argv[2]
def load(fn):
  d={}
  for l in open(os.path.join(R,fn),encoding='utf-8',errors='ignore').read().splitlines()[1:]:
    p=l.split('\t')
    if len(p)>=3:d.setdefault(p[1].strip(),(p[0],[]))[1].append(p[2].strip())
  return d
V3=os.path.exists(os.path.join(R,'parts_list_e.txt')) and not os.path.exists(os.path.join(R,'isa_element_parts.txt'))
if V3:  # BodyParts3D 3.0 (obj_95 ละเอียดกว่า): 1 ไฟล์ OBJ ต่อ FMA ID
  OBJ={os.path.splitext(f)[0]:os.path.join(dp,f) for dp,_,fs in os.walk(R) for f in fs if f.endswith('.obj')}
  N3={}
  for l in open(os.path.join(R,'parts_list_e.txt'),encoding='utf-8',errors='ignore').read().splitlines()[1:]:
    p=l.split('\t')
    if len(p)>=2 and p[0].strip() in OBJ:N3.setdefault(p[1].strip(),p[0].strip())
  EL={'partof':{k:(v,[v]) for k,v in N3.items()},'isa':{}}
else:
  EL={'partof':load('partof_element_parts.txt'),'isa':load('isa_element_parts.txt')}
ORD=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth']
S={'L':'left','R':'right'}
T=[]  # (node, [candidate names])
def t(node,*names):T.append((node,list(names)))
t('frontal','frontal bone');t('occipital','occipital bone');t('sphenoid','sphenoid bone');t('ethmoid','ethmoid');t('vomer','vomer');t('mandible','mandible');t('hyoid','hyoid bone')
t('sacrum','sacrum');t('coccyx','coccyx');t('sternum','sternum','manubrium','body of sternum','xiphoid process')
for k,s in S.items():
  for b,n in [('parietal','parietal bone'),('temporal','temporal bone'),('nasal','nasal bone'),('maxilla','maxilla'),('zygomatic','zygomatic bone'),('lacrimal','lacrimal bone'),('palatine','palatine bone'),('concha','inferior nasal concha'),
    ('scapula','scapula'),('clavicle','clavicle'),('humerus','humerus'),('radius','radius'),('ulna','ulna'),('scaphoid','scaphoid'),('lunate','lunate'),('triquetrum','triquetral'),('pisiform','pisiform'),('trapezium','trapezium'),('trapezoid','trapezoid'),('capitate','capitate'),('hamate','hamate'),
    ('hip','hip bone'),('femur','femur'),('patella','patella'),('tibia','tibia'),('fibula','fibula'),('calcaneus','calcaneus'),('talus','talus'),('cuboid','cuboid bone')]:
    t(f'{b}_{k}',f'{s} {n}')
  t(f'navicular_{k}',f'navicular bone of {s} foot')
  for i,c in enumerate(['medial','intermediate','lateral']):t(f'cuneiform_{i+1}_{k}',f'{s} {c} cuneiform bone')
  for i in range(12):
    t(f'rib_{i+1}_{k}',f'{s} {ORD[i]} rib')
    if i<10:t(f'costal_cartilage_{i+1}_{k}',f'{s} {ORD[i]} costal cartilage')
  for i in range(5):
    t(f'metacarpal_{i+1}_{k}',f'{s} {ORD[i]} metacarpal bone');t(f'metatarsal_{i+1}_{k}',f'{s} {ORD[i]} metatarsal bone')
  for i,f in enumerate(['thumb','index finger','middle finger','ring finger','little finger']):
    for p in (['proximal','distal'] if i==0 else ['proximal','middle','distal']):t(f'phalanx_h_{i+1}{p[0]}_{k}',f'{p} phalanx of {s} {f}')
  for i,f in enumerate(['big toe','second toe','third toe','fourth toe','little toe']):
    for p in (['proximal','distal'] if i==0 else ['proximal','middle','distal']):t(f'phalanx_f_{i+1}{p[0]}_{k}',f'{p} phalanx of {s} {f}')
for v,n in [('C1','atlas'),('C2','axis')]+[(f'C{i}',f'{ORD[i-1]} cervical vertebra') for i in range(3,8)]+[(f'T{i}',f'{ORD[i-1]} thoracic vertebra') for i in range(1,13)]+[(f'L{i}',f'{ORD[i-1]} lumbar vertebra') for i in range(1,6)]:
  t('vert_'+v,n)
  if v!='C1':t('disc_'+v,'intervertebral disk of '+n if v!='C2' else 'intervertebral disk of axis')
cache={};
def obj(fj):
  if V3:
    p=OBJ.get(fj)
    if p and p not in cache:cache[p]=trimesh.load(p,force='mesh',process=False)
    return cache.get(p)
  for sub in ['partof/partof_BP3D_4.0_obj_99','isa/isa_BP3D_4.0_obj_99']:
    p=os.path.join(R,sub,fj+'.obj')
    if os.path.exists(p):
      if p not in cache:cache[p]=trimesh.load(p,force='mesh',process=False)
      return cache[p]
scene=trimesh.Scene();bmap={};missing=[]
for node,names in T:
  parts=[];fmas=[]
  for nm in names:
    for src in ('partof','isa'):
      if nm in EL[src]:
        fma,fjs=EL[src][nm];ms=[obj(f) for f in fjs];ms=[m for m in ms if m is not None]
        if ms:parts+=ms;fmas.append(fma);break
    if node=='sternum' and parts:break
  if not parts:missing.append((node,names[0]));continue
  m=trimesh.util.concatenate(parts);m.merge_vertices()
  v=m.vertices*0.001;m.vertices=np.c_[v[:,0],v[:,2],-v[:,1]]
  scene.add_geometry(m,node_name=node,geom_name=node);bmap[node]={'fma':fmas,'en':names[0]}
# orientation: face +Z, patient left +X, feet at y=0, centered
b=scene.bounds;g=scene.geometry
fz=g['mandible'].centroid[2] if 'mandible' in g else 1;oz=g['occipital'].centroid[2] if 'occipital' in g else 0
M=np.eye(4)
if fz<oz:M=trimesh.transformations.rotation_matrix(np.pi,[0,1,0])
for n in g:g[n].apply_transform(M)
if 'humerus_L' in g and g['humerus_L'].centroid[0]<0:
  for n in g:g[n].vertices[:,0]*=-1;g[n].invert()
b=np.array([m.bounds for m in g.values()]);lo=b[:,0].min(0);hi=b[:,1].max(0);c=(lo+hi)/2
for n in g:g[n].vertices-= [c[0],lo[1],c[2]]
scene.export(OUT)
json.dump(bmap,open(os.path.join(os.path.dirname(OUT),'bones_map.json'),'w'),ensure_ascii=False,indent=1)
print('nodes',len(bmap),'height',hi[1]-lo[1]);print('missing',missing)
