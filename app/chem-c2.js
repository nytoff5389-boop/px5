/* PHB102 บทที่ 2 สารประกอบเชิงซ้อน (Coordination compounds) : โจทย์จากสไลด์สอน */
(function(){ const {chg,ROM,f3,mq,nq,deck,L3,add}=PCX;
  /* โลหะที่ใช้สุ่ม: CN 6 (octahedral), CN 4 และ CN 2 */
  const M={Co:{s:'Co',n:'cobalt',a:'cobaltate'},Fe:{s:'Fe',n:'iron',a:'ferrate'},Cr:{s:'Cr',n:'chromium',a:'chromate'},Ni:{s:'Ni',n:'nickel',a:'nickelate'},
    Cu:{s:'Cu',n:'copper',a:'cuprate'},Zn:{s:'Zn',n:'zinc',a:'zincate'},Pt:{s:'Pt',n:'platinum',a:'platinate'},Ag:{s:'Ag',n:'silver',a:'argentate'},
    Al:{s:'Al',n:'aluminium',a:'aluminate'},Pb:{s:'Pb',n:'lead',a:'plumbate'}};
  const M6=[['Co',3],['Co',2],['Fe',2],['Fe',3],['Cr',3],['Ni',2],['Pt',4]], M4=[['Pt',2],['Zn',2],['Cu',2]];
  const LIG={NH3:{f:'NH3',n:'ammine',q:0,d:1,p:1},H2O:{f:'H2O',n:'aqua',q:0,d:1,p:1},Cl:{f:'Cl',n:'chloro',q:-1,d:1,p:0},Br:{f:'Br',n:'bromo',q:-1,d:1,p:0},
    CN:{f:'CN',n:'cyano',q:-1,d:1,p:1},OH:{f:'OH',n:'hydroxo',q:-1,d:1,p:1},NO2:{f:'NO2',n:'nitrito',q:-1,d:1,p:1},en:{f:'en',n:'ethylenediamine',q:0,d:2,p:1,cx:1}};
  const PRE=['','','di','tri','tetra','penta','hexa'], PRE2=['','','bis','tris','tetrakis'];
  const AN={Cl:{f:'Cl',n:'chloride',q:-1},Br:{f:'Br',n:'bromide',q:-1},NO3:{f:'NO3',n:'nitrate',q:-1,p:1},SO4:{f:'SO4',n:'sulfate',q:-2,p:1}};
  const CAT={K:{f:'K',n:'potassium'},Na:{f:'Na',n:'sodium'}};

  function mkCx(cn){
    for(let g=0;g<80;g++){
      const [ms,ox]=cn===2?['Ag',1]:pick(cn===4?M4:M6), m=M[ms];
      const pool=cn===2?['NH3','CN','Cl']:['NH3','H2O','Cl','Br','CN','OH','NO2','en'];
      const ks=shuf(pool).slice(0,Math.random()<.4?1:2); let ls;
      if(ks.length===1){ const L=LIG[ks[0]]; if(cn%L.d) continue; ls=[[ks[0],cn/L.d]]; }
      else { const A=LIG[ks[0]],B=LIG[ks[1]]; const n1=ri(1,Math.floor((cn-1)/A.d)); const rest=cn-n1*A.d; if(rest<=0||rest%B.d) continue; ls=[[ks[0],n1],[ks[1],rest/B.d]]; }
      if(ls.some(([k])=>k==='en')&&cn<4) continue;
      const q=ox+ls.reduce((s,[k,n])=>s+LIG[k].q*n,0); if(Math.abs(q)>4) continue;
      return {m,ox,ls,q,cn}; }
    return {m:M.Co,ox:3,ls:[['NH3',6]],q:3,cn:6};
  }
  const nLig=c=>c.ls.reduce((s,[,n])=>s+n,0);
  const inner=(c,ls)=>'['+c.m.s+(ls||c.ls).slice().sort((a,b)=>(LIG[a[0]].q?1:0)-(LIG[b[0]].q?1:0)).map(([k,n])=>{ const L=LIG[k]; return L.p?'('+L.f+')'+(n>1?n:''):L.f+(n>1?n:''); }).join('')+']';
  const ionF=(c,ls,q)=>inner(c,ls)+chg(q==null?c.q:q);
  /* เติมไอออนตรงข้ามให้ประจุรวมเป็นศูนย์ */
  function salt(c){ if(c.q>0){ const a=c.q===2?pick(['Cl','Br','NO3','SO4']):pick(['Cl','Br','NO3']); return {c,a:AN[a],na:a==='SO4'?1:c.q}; }
    if(c.q<0) return {c,k:CAT[pick(['K','Na'])],nk:-c.q}; return {c}; }
  const anS=(A,n)=>n>1?(A.p?'('+A.f+')'+n:A.f+n):A.f;
  function saltF(S,o){ o=o||{}; const c=S.c, inn=inner(c,o.ls);
    if(S.a){ const n=o.n!=null?o.n:S.na; return o.inside?'['+inn.slice(1,-1)+anS(S.a,n)+']':inn+(n>0?anS(S.a,n):''); }
    if(S.k){ const n=o.n!=null?o.n:S.nk; return (n>0?S.k.f+(n>1?n:''):'')+inn; } return inn; }
  function cxName(c,o){ o=o||{}; let ls=c.ls.slice().sort((a,b)=>LIG[a[0]].n.localeCompare(LIG[b[0]].n)); if(o.rev) ls=ls.reverse();
    const lig=ls.map(([k,n])=>{ const L=LIG[k]; if(L.cx) return (n>1?(o.di?PRE[n]:PRE2[n]):'')+'('+L.n+')'; const nm=o.mm&&k==='NH3'?'amine':L.n; return (o.bis&&n>1&&n<5?PRE2[n]:PRE[n])+nm; }).join('');
    const ate=o.ate!=null?o.ate:c.q<0, ox=o.ox!=null?o.ox:c.ox;
    return lig+(ate?c.m.a:c.m.n)+'('+ROM[ox]+')'; }
  function saltName(S,o){ o=o||{}; const nm=cxName(S.c,o);
    if(S.a) return nm+' '+(o.cnt&&S.na>1?PRE[S.na]:'')+S.a.n; if(S.k) return (o.cnt&&S.nk>1?PRE[S.nk]:'')+S.k.n+' '+nm; return nm; }
  const ligList=c=>c.ls.map(([k,n])=>LIG[k].n+' '+n+' ตัว').join(' และ ');
  const oxExp=c=>{ const parts=c.ls.map(([k,n])=>LIG[k].q?`${LIG[k].f} ประจุ ${LIG[k].q} × ${n}`:`${LIG[k].f} เป็นกลาง`).join(', ');
    return `ประจุไอออนเชิงซ้อน ${c.q>0?'+':''}${c.q} = ประจุโลหะ + ประจุลิแกนด์ (${parts}) ดังนั้น ${c.m.s} มีเลขออกซิเดชัน +${c.ox}`; };
  const cnExp=c=>`นับจำนวนตำแหน่งที่ลิแกนด์จับโลหะ: ${c.ls.map(([k,n])=>`${LIG[k].f} ${n} ตัว × ${LIG[k].d} ตำแหน่ง`).join(' + ')} = ${c.cn}`;
  const anyCx=()=>mkCx(pick([6,6,6,4,4,2]));

  /* ---------- 1. ลิแกนด์ เลขโคออร์ดิเนชัน และเลขออกซิเดชัน ---------- */
  const DEN=[['NH3','monodentate (unidentate)','N'],['H2O','monodentate (unidentate)','O'],['Cl⁻','monodentate (unidentate)','Cl'],['CN⁻','monodentate (unidentate)','C'],
    ['ethylenediamine (en)','bidentate','N 2 อะตอม'],['oxalate (C2O4²⁻)','bidentate','O 2 อะตอม'],['bipyridine','bidentate','N 2 อะตอม'],['diethylenetriamine (dien)','tridentate','N 3 อะตอม'],
    ['porphyrin ของ heme','tetradentate (quadridentate)','N 4 อะตอม'],['cyclam','tetradentate (quadridentate)','N 4 อะตอม'],['EDTA','hexadentate','N 2 และ O 4 อะตอม']];
  const DENS=['monodentate (unidentate)','bidentate','tridentate','tetradentate (quadridentate)','hexadentate'];
  const gDen=()=>{ const d=pick(DEN); return mq('cx_lig','easy',`${d[0]} เป็นลิแกนด์ชนิดใด เมื่อแบ่งตามจำนวน donor atom ที่จับโลหะ`,d[1],DENS.filter(x=>x!==d[1]),`${d[0]} จับโลหะด้วย donor atom ${d[2]} จึงเป็น ${d[1]}`); };
  const gDon=()=>{ const d=pick(DEN.filter(x=>x[1]!==DEN[0][1])); const n={bidentate:2,tridentate:3,'tetradentate (quadridentate)':4,hexadentate:6}[d[1]];
    return nq('cx_lig','easy',`${d[0]} จับไอออนโลหะได้กี่ตำแหน่ง`,n,'ตำแหน่ง',[1,n-1,n+1,n+2,8],`${d[0]} เป็น ${d[1]} ใช้ donor atom ${d[2]}`,v=>String(v)); };
  const gCN=()=>{ const c=anyCx(), S=salt(c), nl=nLig(c); return nq('cx_lig',c.ls.some(([k])=>k==='en')?'hard':'mid',`เลขโคออร์ดิเนชัน (coordination number) ของโลหะใน ${saltF(S)} เท่ากับเท่าใด`,c.cn,'',[nl,c.cn+2,c.cn-2,c.cn*2,c.ox,c.cn+1],[cnExp(c),'CN คือจำนวนอะตอมผู้ให้ (donor atom) ที่สร้างพันธะกับโลหะโดยตรง ไม่นับไอออนนอก [ ]'],v=>String(v)); };
  const gOx=()=>{ const c=anyCx(), S=salt(c); return mq('cx_lig',S.a||S.k?'hard':'mid',`เลขออกซิเดชันของ ${c.m.s} ใน ${saltF(S)} คือเท่าใด`,'+'+c.ox,['+1','+2','+3','+4','+5','+6','0'].filter(x=>x!=='+'+c.ox).slice(0,6),[S.a||S.k?`ไอออนนอก [ ] บอกว่าไอออนเชิงซ้อนมีประจุ ${c.q>0?'+':''}${c.q}`:'ไอออนเชิงซ้อนนี้อยู่ในรูปที่ไม่มีไอออนตรงข้าม',oxExp(c)]); };
  const gChg=()=>{ const c=anyCx(); const ch=q=>q===0?'0 (เป็นกลาง)':(q>0?'+':'')+q;
    return mq('cx_lig','mid',`ไอออนเชิงซ้อน ${inner(c)} ที่มี ${c.m.s} เลขออกซิเดชัน +${c.ox} จะมีประจุรวมเท่าใด`,ch(c.q),[c.q+1,c.q-1,c.q+2,c.q-2,c.ox,-c.q].filter(x=>x!==c.q).map(ch),[oxExp(c)]); };
  const gNL=()=>{ const c=mkCx(pick([6,4])); if(!c.ls.some(([k])=>k==='en')) return null; const nl=nLig(c);
    return nq('cx_lig','hard',`${inner(c)} มีลิแกนด์ทั้งหมดกี่ตัว และต่างจากเลขโคออร์ดิเนชันอย่างไร (ตอบจำนวนลิแกนด์)`,nl,'ตัว',[c.cn,nl+1,nl-1,c.cn+1],[cnExp(c),`มีลิแกนด์ ${nl} ตัว แต่ CN = ${c.cn} เพราะ en เป็น bidentate จับ 2 ตำแหน่ง`],v=>String(v)); };
  const D_LIG=deck('cx_lig',[
    ['easy','สารประกอบเชิงซ้อน (coordination compound) เกิดจากพันธะชนิดใดระหว่างโลหะกับลิแกนด์','พันธะโคออร์ดิเนตโคเวเลนต์ (coordinate covalent bond)',['พันธะไอออนิกล้วน','พันธะโลหะ','พันธะไฮโดรเจน','พันธะไพ'],'ลิแกนด์ให้อิเล็กตรอนคู่แก่โลหะเพียงฝ่ายเดียว เกิดเป็นพันธะโคออร์ดิเนตโคเวเลนต์ (dative bond)'],
    ['easy','ในสารประกอบเชิงซ้อน ไอออนโลหะทำหน้าที่เป็นอะไรตามทฤษฎี Lewis','Lewis acid (รับคู่อิเล็กตรอน)',['Lewis base (ให้คู่อิเล็กตรอน)','Brønsted acid (ให้โปรตอน)','Brønsted base (รับโปรตอน)'],'ไอออนโลหะ transition มี d-orbital ว่าง จึงรับคู่อิเล็กตรอนจากลิแกนด์ โลหะเป็น Lewis acid ลิแกนด์เป็น Lewis base'],
    ['easy','ลิแกนด์ทำหน้าที่เป็นอะไรตามทฤษฎี Lewis','Lewis base (ให้คู่อิเล็กตรอน)',['Lewis acid (รับคู่อิเล็กตรอน)','ตัวรีดิวซ์','ตัวเร่งปฏิกิริยา'],'ลิแกนด์มี lone pair ให้แก่โลหะ จึงเป็น Lewis base'],
    ['easy','ลิแกนด์ (ligand) หมายถึงข้อใด','โมเลกุลหรือไอออนที่มีคู่อิเล็กตรอนอิสระ ให้แก่โลหะเพื่อสร้างพันธะโคออร์ดิเนต',['ไอออนโลหะที่อยู่ตรงกลางของสารเชิงซ้อน','ไอออนที่อยู่นอกวงเล็บเหลี่ยม','อิเล็กตรอนที่อยู่ใน d-orbital ของโลหะ'],'ลิแกนด์คือโมเลกุลหรือไอออนที่มี lone pair แล้วให้อิเล็กตรอนแก่โลหะ'],
    ['easy','donor atom หมายถึงอะไร','อะตอมในลิแกนด์ที่ให้คู่อิเล็กตรอนแก่โลหะโดยตรง',['อะตอมของโลหะที่รับอิเล็กตรอน','ไอออนที่อยู่นอก coordination sphere','อะตอมที่รับโปรตอนจากโลหะ'],'donor atom คืออะตอมในลิแกนด์ที่ใช้ lone pair สร้างพันธะกับโลหะ เช่น N ใน NH3'],
    ['easy','coordination sphere ประกอบด้วยอะไร','โลหะกลางกับลิแกนด์ที่จับอยู่ ภายใน [ ] ไม่รวมไอออนอิสระ',['โลหะกลาง ลิแกนด์ และไอออนตรงข้ามทั้งหมด','เฉพาะไอออนที่อยู่นอก [ ]','เฉพาะลิแกนด์ ไม่รวมโลหะ'],'Coordinate sphere = metal + ligands ไม่รวมไอออนอิสระ (counter-ion)'],
    ['easy','Chelate complex หมายถึงข้อใด','สารเชิงซ้อนที่โลหะจับกับ polydentate ligand หลายตำแหน่งเหมือนคีม',['สารเชิงซ้อนที่มีลิแกนด์ monodentate เท่านั้น','สารเชิงซ้อนที่ไม่มีโลหะ','สารเชิงซ้อนที่มีโลหะ 2 อะตอมขึ้นไป'],'Chelate complexes = metal + polydentate ligands'],
    ['mid','Chelate effect คืออะไร','ลิแกนด์ยิ่งมีตำแหน่งจับเกาะมาก ยิ่งจับโลหะแน่นและเสถียรขึ้น',['ลิแกนด์ยิ่งเล็กยิ่งจับโลหะแน่น','ลิแกนด์ประจุบวกจับโลหะแน่นกว่าประจุลบ','โลหะยิ่งมีประจุน้อยยิ่งเสถียร'],'ยิ่งมีตำแหน่งจับเกาะมาก ยิ่งจับโลหะแน่นขึ้น เรียกว่า Chelate effect'],
    ['easy','คำว่า dentate ในชื่อ bidentate มาจากความหมายใด','ฟัน',['มือ','ขา','วงแหวน'],'dentate มาจากคำว่า "ฟัน" (dent-) หมายถึงจำนวนตำแหน่งที่ "กัด" โลหะ'],
    ['mid','EDTA รวมตัวกับไอออนโลหะในอัตราส่วนเท่าใด','1 : 1 เสมอ',['1 : 2','2 : 1','ขึ้นกับประจุของโลหะ'],'EDTA เป็น hexadentate รวมกับโลหะด้วยอัตราส่วน 1:1 เสมอ'],
    ['mid','EDTA ย่อมาจากอะไร','Ethylene Diamine Tetra Acetic acid',['Ethylene Dichloride Tetra Amine','Ethyl Diamine Tri Acetate','Ethylene Diamine Tetra Ammonia'],'EDTA : Ethylene Diamine Tetra Acetic acid'],
    ['mid','ลิแกนด์ hydrazinium (NH2NH3⁺) จัดเป็นลิแกนด์ประเภทใดตามประจุ','ลิแกนด์ประจุบวก (cationic ligand)',['ลิแกนด์ประจุลบ (anionic ligand)','ลิแกนด์ไม่มีประจุ (neutral ligand)','ไม่จัดเป็นลิแกนด์'],'NH2NH3⁺ มีประจุบวก จึงเป็น cationic ligand อ่านว่า hydrazinium'],
    ['mid','ข้อใดเป็นลิแกนด์ไม่มีประจุ (neutral ligand) ทั้งหมด','NH3, H2O, CO, NO',['Cl⁻, CN⁻, OH⁻','NH3, Cl⁻, H2O','O²⁻, NO2⁻, CO'],'ลิแกนด์ไม่มีประจุ เช่น NH3 (ammine) H2O (aqua) CO (carbonyl) NO (nitrosyl)'],
    ['mid','ข้อใดเป็นลิแกนด์ประจุลบ (anionic ligand) ทั้งหมด','Cl⁻, CN⁻, OH⁻, O²⁻',['NH3, H2O, CO','Cl⁻, NH3, H2O','NO, CO, NH3'],'ลิแกนด์ประจุลบ ชื่อลงท้าย -o เช่น chloro cyano hydroxo oxo'],
    ['mid','โลหะชนิดใดมักเป็นอะตอมกลางของสารเชิงซ้อน เพราะมี d-orbital ว่างรับอิเล็กตรอนคู่ได้','โลหะ transition',['โลหะหมู่ 1A','แก๊สมีตระกูล','อโลหะหมู่ 7A'],'โลหะ transition มี d-orbital ว่าง จึงรับอิเล็กตรอนคู่จากลิแกนด์มาใช้ร่วมได้'],
    ['hard','ข้อใดกล่าวถูกต้องเกี่ยวกับเลขโคออร์ดิเนชันของ [Cr(en)3]³⁺','CN = 6 เพราะ en 3 ตัวจับตัวละ 2 ตำแหน่ง',['CN = 3 เพราะมี en 3 ตัว','CN = 9 เพราะ en มี N 3 อะตอม','CN = 4 เพราะมีประจุ +3 บวก 1'],'en เป็น bidentate (N 2 ตัว) 3 × 2 = 6 จึงได้ CN = 6 ทรง octahedral'],
    ['hard','ข้อใดคือความแตกต่างระหว่างพันธะ Fe–CN และพันธะระหว่าง K⁺ กับ [Fe(CN)6]⁴⁻ ใน K4[Fe(CN)6]','Fe–CN เป็นพันธะโคออร์ดิเนต ส่วน K⁺ กับไอออนเชิงซ้อนเป็นพันธะไอออนิก',['ทั้งสองเป็นพันธะโคออร์ดิเนต','ทั้งสองเป็นพันธะไอออนิก','Fe–CN เป็นพันธะไอออนิก ส่วน K⁺ เป็นพันธะโคออร์ดิเนต'],'ภายใน [ ] เป็น coordinate bond ส่วนไอออนนอก [ ] ยึดด้วยแรงไฟฟ้าสถิต (ionic bond)']
  ]);
  add('cx_lig',{n:'ลิแกนด์ CN และเลขออกซิเดชัน',d:'ชนิดลิแกนด์ donor atom chelate เลขโคออร์ดิเนชัน และประจุ',pg:4,ch:2},
    L3([['easy',D_LIG('easy')],['easy',gDen],['easy',gDon],[['easy','mid'],D_LIG('mid')],['mid',gCN],['mid',gOx],['mid',gChg],['hard',gCN],['hard',gOx],['hard',gNL],['hard',D_LIG('hard')]]));

  /* ---------- 2. การอ่านชื่อ IUPAC ---------- */
  const LN=[['NH3','ammine'],['H2O','aqua'],['CO','carbonyl'],['NO','nitrosyl'],['Cl⁻','chloro'],['CN⁻','cyano'],['OH⁻','hydroxo'],['O²⁻','oxo'],['NO2⁻','nitrito'],['NH2NH3⁺','hydrazinium'],['ethylenediamine (en)','ethylenediamine (ใช้ bis-, tris- นำหน้า)']];
  const LNn=LN.map(x=>x[1]);
  const gLN=()=>{ const l=pick(LN); return mq('cx_name','easy',`ลิแกนด์ ${l[0]} เมื่ออยู่ในชื่อสารเชิงซ้อนอ่านว่าอย่างไร`,l[1],LNn.filter(x=>x!==l[1]).concat(l[0]==='NH3'?['amine','ammonia']:l[0]==='H2O'?['hydro','water']:l[0]==='Cl⁻'?['chloride','chlorine']:l[0]==='CN⁻'?['cyanide']:l[0]==='OH⁻'?['hydroxide']:['oxide']).slice(-6),`${l[0]} → ${l[1]}`); };
  const gLR=()=>{ const l=pick(LN.slice(0,10)); return mq('cx_name','easy',`ชื่อลิแกนด์ "${l[1]}" หมายถึงลิแกนด์ใด`,l[0],LN.slice(0,10).map(x=>x[0]).filter(x=>x!==l[0]),`${l[1]} คือ ${l[0]}`); };
  const ATE=[['Fe','ferrate'],['Cu','cuprate'],['Co','cobaltate'],['Al','aluminate'],['Pb','plumbate'],['Pt','platinate'],['Ni','nickelate'],['Zn','zincate'],['Cr','chromate']];
  const gAte=()=>{ const a=pick(ATE), m=Object.values(M).find(x=>x.s===a[0]);
    return mq('cx_name','easy',`ถ้า ${a[0]} เป็นโลหะกลางในไอออนเชิงซ้อนที่มีประจุลบ ชื่อโลหะในชื่อ IUPAC คือข้อใด`,a[1],[m.n,m.n+'ate',m.n+'ide',a[1].replace('ate','ite'),a[0].toLowerCase()+'ate'].filter(x=>x!==a[1]),`ถ้าคอมเพล็กซ์เป็นประจุลบ เปลี่ยนชื่อโลหะลงท้าย -ate และบางโลหะใช้ชื่อละติน เช่น Fe เป็น ferrate, Cu เป็น cuprate, Pb เป็น plumbate`); };
  function nameWrongs(S){ const c=S.c, w=[];
    [c.ox-1,c.ox+1].filter(x=>x>0).forEach(x=>w.push(saltName(S,{ox:x})));
    w.push(saltName(S,{ate:!(c.q<0)}));
    if(c.ls.length>1) w.push(saltName(S,{rev:1}));
    if(c.ls.some(([k])=>k==='NH3')) w.push(saltName(S,{mm:1}));
    if(c.ls.some(([k,n])=>k==='en'&&n>1)) w.push(saltName(S,{di:1}));
    if(c.ls.some(([k,n])=>!LIG[k].cx&&n>1)) w.push(saltName(S,{bis:1}));
    if((S.na||S.nk||0)>1) w.push(saltName(S,{cnt:1}));
    return w; }
  const gName=()=>{ const c=anyCx(), S=salt(c); const right=saltName(S);
    return mq('cx_name',c.ls.length>1||S.a||S.k?'mid':'easy',`ชื่อ IUPAC ของ ${saltF(S)} คือข้อใด`,right,nameWrongs(S),
      [`ลิแกนด์: ${ligList(c)} เรียงตามตัวอักษรโดยไม่นับคำบอกจำนวน`,oxExp(c),c.q<0?'ไอออนเชิงซ้อนเป็นประจุลบ ชื่อโลหะลงท้าย -ate':'ไอออนเชิงซ้อนเป็นบวกหรือกลาง ใช้ชื่อโลหะตามปกติ',S.a||S.k?'อ่านไอออนบวกก่อนไอออนลบ ไม่ต้องบอกจำนวนไอออนตรงข้าม':'ไม่มีไอออนตรงข้าม',`ชื่อเต็ม: ${right}`]); };
  const gForm=()=>{ const c=anyCx(), S=salt(c); if(!S.a&&!S.k) return null; const right=saltF(S), n=S.na||S.nk, w=[];
    w.push(saltF(S,{n:n+1})); if(n>1) w.push(saltF(S,{n:n-1})); w.push(saltF(S,{n:0}));
    if(S.a) w.push(saltF(S,{inside:1}));
    if(c.ls.length>1){ const sw=c.ls.map(x=>x.slice()); [sw[0][1],sw[1][1]]=[sw[1][1],sw[0][1]]; if(sw.every(([k,m])=>m>0)) w.push(saltF(S,{ls:sw})); }
    w.push(saltF(S,{n:n*2}));
    return mq('cx_name','hard',`${saltName(S)} มีสูตรเคมีตรงกับข้อใด`,right,w,[`ลิแกนด์: ${ligList(c)} โลหะ ${c.m.s} เลขออกซิเดชัน +${c.ox}`,`ประจุไอออนเชิงซ้อน = ${c.ox} ${c.ls.map(([k,n])=>LIG[k].q?`+ (${LIG[k].q} × ${n})`:'').join(' ')} = ${c.q>0?'+':''}${c.q}`,'ดุลประจุให้รวมเป็นศูนย์ด้วยไอออนตรงข้าม แล้วเขียนไอออนตรงข้ามไว้นอก [ ]']); };
  const gIon=()=>{ const c=anyCx(); if(c.q===0) return null; const right=cxName(c)+' ion';
    return mq('cx_name','mid',`ไอออน ${ionF(c)} อ่านชื่อตาม IUPAC ว่าอย่างไร`,right,[cxName(c,{ox:c.ox+1})+' ion',cxName(c,{ate:!(c.q<0)})+' ion',c.ox>1?cxName(c,{ox:c.ox-1})+' ion':null,c.ls.length>1?cxName(c,{rev:1})+' ion':null,cxName(c,{ox:Math.abs(c.q)})+' ion'].filter(x=>x&&x!==right),[`ลิแกนด์: ${ligList(c)}`,oxExp(c),c.q<0?'ไอออนลบ ชื่อโลหะลงท้าย -ate':'ไอออนบวก ใช้ชื่อโลหะตามปกติ']); };
  const D_NAME=deck('cx_name',[
    ['easy','ลำดับการอ่านชื่อสารประกอบเชิงซ้อนตาม IUPAC คือข้อใด','ลิแกนด์ → โลหะและเลขออกซิเดชัน → ไอออนตรงข้าม (counter-ion)',['โลหะ → ลิแกนด์ → ไอออนตรงข้าม','ไอออนตรงข้าม → โลหะ → ลิแกนด์','เลขออกซิเดชัน → ลิแกนด์ → โลหะ'],'อ่าน (ลิแกนด์ก่อน) → (โลหะ + oxidation state) → counter-ion'],
    ['easy','การเรียงชื่อลิแกนด์หลายชนิดในชื่อสารเชิงซ้อนใช้หลักใด','เรียงตามตัวอักษร (alphabetical order) ไม่นับคำบอกจำนวน',['เรียงตามประจุ จากลบไปบวก','เรียงตามจำนวนลิแกนด์ มากไปน้อย','เรียงตามขนาดโมเลกุล'],'เรียงตามลำดับตัวอักษร ไม่สนใจคำนำหน้า di-, tri-, tetra-'],
    ['easy','คำบอกจำนวน 4 ที่ใช้นำหน้าลิแกนด์ทั่วไป เช่น NH3 4 ตัว คือข้อใด','tetra',['tetrakis','quadra','penta'],'2 = di, 3 = tri, 4 = tetra, 5 = penta, 6 = hexa'],
    ['easy','คำบอกจำนวน 5 ที่ใช้นำหน้าลิแกนด์ คือข้อใด','penta',['pentakis','hexa','tetra'],'5 = penta'],
    ['mid','ถ้าชื่อลิแกนด์ซับซ้อนหรือมีคำบอกจำนวนอยู่แล้ว เช่น ethylenediamine 3 ตัว ต้องใช้คำนำหน้าใด','tris',['tri','tetra','ter'],'ลิแกนด์ซับซ้อนใช้ bis (2) tris (3) tetrakis (4) เช่น tris(ethylenediamine)'],
    ['mid','bis- ใช้แทนจำนวนลิแกนด์เท่าใด','2 ตัว',['3 ตัว','4 ตัว','1 ตัว'],'bis = 2, tris = 3, tetrakis = 4'],
    ['mid','tetrakis- ใช้แทนจำนวนลิแกนด์เท่าใด','4 ตัว',['2 ตัว','3 ตัว','6 ตัว'],'tetrakis = 4 ใช้กับลิแกนด์ชื่อซับซ้อน'],
    ['easy','เลขออกซิเดชันของโลหะในชื่อสารเชิงซ้อนเขียนอย่างไร','เลขโรมันในวงเล็บหลังชื่อโลหะ เช่น (III)',['เลขอารบิกยกกำลังหลังชื่อโลหะ','คำบอกจำนวนหน้าชื่อโลหะ','ไม่ต้องเขียน'],'ใส่เป็นตัวเลขโรมันในวงเล็บ เช่น (II), (III), (IV)'],
    ['mid','ชื่อลิแกนด์ NH3 สะกดว่า ammine มีลักษณะพิเศษอย่างไร','สะกดด้วย m สองตัว ต่างจาก amine',['สะกดด้วย n สองตัว','ลงท้ายด้วย -o เหมือนลิแกนด์ลบ','ต้องมีวงเล็บเสมอ'],'NH3 → ammine (สะกดมี m สองตัว)'],
    ['mid','ลิแกนด์ประจุลบมีหลักการเรียกชื่ออย่างไร','ลงท้ายด้วย -o เช่น chloro, cyano',['ลงท้ายด้วย -ide เช่น chloride','ลงท้ายด้วย -ate','ใช้ชื่อเดียวกับธาตุ'],'anionic ligands ลงท้าย -o'],
    ['mid','ไอออนตรงข้าม (counter-ion) เช่น Cl⁻ ที่อยู่นอก [ ] อ่านในชื่ออย่างไร','อ่านหลังสุดเป็น chloride',['อ่านก่อนลิแกนด์เป็น chloro','อ่านเป็น chloro ต่อท้ายลิแกนด์','ไม่ต้องอ่าน'],'ไอออนภายนอกอ่านหลังสุด เช่น chloride, sulfate, nitrate'],
    ['mid','[Co(NH3)5Cl]Cl2 อ่านชื่อว่าอะไร','pentaamminechlorocobalt(III) chloride',['pentaamminechlorocobalt(II) chloride','chloropentaamminecobalt(III) dichloride','pentaamminechlorocobaltate(III) chloride'],'ลิแกนด์ ammine 5 chloro 1 เรียงตามตัวอักษร Co เป็น +3 เพราะ x + 0 − 1 = +2'],
    ['mid','[Fe(CN)6]⁴⁻ อ่านชื่อว่าอะไร','hexacyanoferrate(II) ion',['hexacyanoiron(II) ion','hexacyanoferrate(III) ion','hexacyanideferrate(II) ion'],'cyano 6 ตัว ประจุลบจึงใช้ ferrate และ x − 6 = −4 ได้ Fe +2'],
    ['mid','[Cr(en)3]³⁺ อ่านชื่อว่าอะไร','tris(ethylenediamine)chromium(III) ion',['triethylenediaminechromium(III) ion','tris(ethylenediamine)chromate(III) ion','tris(ethylenediamine)chromium(VI) ion'],'en เป็น bidentate และมีคำนำหน้าในชื่อ ใช้ tris- en เป็นกลาง Cr จึงเป็น +3'],
    ['mid','K2[PtCl4] อ่านชื่อว่าอะไร','potassium tetrachloroplatinate(II)',['dipotassium tetrachloroplatinate(II)','potassium tetrachloroplatinum(II)','potassium tetrachloroplatinate(IV)'],'ไอออนเชิงซ้อนประจุ −2 ใช้ platinate และ x − 4 = −2 ได้ Pt +2'],
    ['mid','[Cu(NH3)4]SO4 อ่านชื่อว่าอะไร','tetraamminecopper(II) sulfate',['tetraaminecopper(II) sulfate','tetraamminecuprate(II) sulfate','tetraamminecopper(IV) sulfate'],'SO4²⁻ ประจุ −2 ไอออนเชิงซ้อนจึง +2 Cu เป็น +2 และไอออนบวกใช้ชื่อ copper'],
    ['hard','potassium hexacyanoferrate(III) มีสูตรเคมีอย่างไร','K3[Fe(CN)6]',['K4[Fe(CN)6]','K3[Fe(CN)3]','[K3Fe(CN)6]'],'Fe +3 กับ CN⁻ 6 ตัว ได้ประจุ −3 ต้องใช้ K⁺ 3 ตัว'],
    ['hard','sodium tetrachlorocuprate(II) มีสูตรเคมีอย่างไร','Na2[CuCl4]',['Na[CuCl4]','Na2[CuCl2]','[Na2CuCl4]'],'Cu +2 กับ Cl⁻ 4 ตัว ได้ −2 ต้องใช้ Na⁺ 2 ตัว'],
    ['hard','diamminesilver(I) nitrate มีสูตรเคมีอย่างไร','[Ag(NH3)2]NO3',['[Ag(NH3)2](NO3)2','Ag(NH3)2NO3 ไม่มีวงเล็บ','[Ag(NH3)]NO3'],'Ag +1 กับ NH3 กลาง 2 ตัว ได้ +1 จึงจับ NO3⁻ 1 ตัว']
  ]);
  add('cx_name',{n:'การอ่านชื่อสารเชิงซ้อน',d:'ชื่อลิแกนด์ -ate เลขโรมัน และเขียนสูตรจากชื่อ',pg:5,ch:2},
    L3([['easy',gLN],['easy',gLR],['easy',gAte],['easy',D_NAME('easy')],['mid',gName],['mid',gIon],['mid',D_NAME('mid')],['hard',gForm],['hard',gName],['hard',D_NAME('hard')]]));

  /* ---------- 3. โครงสร้างและไอโซเมอร์ ---------- */
  const GEO=[[2,'Linear'],[4,'Tetrahedral หรือ Square planar'],[5,'Trigonal bipyramidal หรือ Square pyramidal'],[6,'Octahedral'],[7,'Pentagonal bipyramidal'],[8,'Square antiprismatic หรือ Dodecahedral'],[9,'Tricapped trigonal prism']];
  const gGeoCN=()=>{ const g=pick(GEO); return mq('cx_geo','easy',`สารเชิงซ้อนที่มีเลขโคออร์ดิเนชัน ${g[0]} มีรูปร่างตรงกับข้อใด`,g[1],GEO.filter(x=>x!==g).map(x=>x[1]),`CN ${g[0]} → ${g[1]}`); };
  const gCNGeo=()=>{ const g=pick(GEO.filter(x=>x[0]!==4&&x[0]!==5&&x[0]!==8)); return nq('cx_geo','easy',`รูปร่าง ${g[1]} ของสารเชิงซ้อนสอดคล้องกับเลขโคออร์ดิเนชันเท่าใด`,g[0],'',GEO.map(x=>x[0]).filter(x=>x!==g[0]),`${g[1]} เป็นรูปร่างของ CN ${g[0]}`,v=>String(v)); };
  const SH=['Linear','Tetrahedral','Square planar','Octahedral','Trigonal bipyramidal'];
  const C4=[['[PtCl4]²⁻','Square planar','Pt²⁺ เป็น d8'],['[Pt(NH3)4]²⁺','Square planar','Pt²⁺ เป็น d8'],['[Pt(NH3)2Cl2]','Square planar','Pt²⁺ เป็น d8 (cisplatin)'],['[PdCl4]²⁻','Square planar','Pd²⁺ เป็น d8'],['[AuCl4]⁻','Square planar','Au³⁺ เป็น d8'],
    ['[ZnCl4]²⁻','Tetrahedral','Zn²⁺ เป็น d10'],['[Zn(NH3)4]²⁺','Tetrahedral','Zn²⁺ เป็น d10'],['[CuCl4]²⁻','Tetrahedral','ทรงสี่หน้าแบบบิดเบี้ยว'],['[Ag(NH3)2]⁺','Linear','CN 2'],['[Ag(CN)2]⁻','Linear','CN 2']];
  const gGeo=()=>{ if(Math.random()<.45){ const x=pick(C4); return mq('cx_geo',x[1]==='Square planar'?'hard':'mid',`สารเชิงซ้อน ${x[0]} มีโครงสร้างแบบใด`,x[1],SH.filter(s=>s!==x[1]),[`นับ CN: ${x[0].includes('2]')&&x[1]==='Linear'?'2':'4'}`,x[1]==='Square planar'?`CN 4 และ ${x[2]} จึงเป็น Square planar`:x[1]==='Tetrahedral'?`CN 4 และ ${x[2]} จึงเป็น Tetrahedral`:'CN 2 จึงเป็น Linear']); }
    const c=mkCx(6); return mq('cx_geo','mid',`สารเชิงซ้อน ${ionF(c)} มีโครงสร้างแบบใด`,'Octahedral',SH.filter(s=>s!=='Octahedral'),[cnExp(c),'CN 6 → Octahedral']); };
  const gIso=()=>{ const T=[
      ()=>{ const m=pick([['Co',3],['Cr',3]]), a=pick(['NH3','H2O']), b=pick(['Cl','Br']); return [`[${m[0]}(${a})4${b}2]⁺`,'แสดง cis–trans isomer ได้',`MA4B2 ทรง octahedral วาง ${b} 2 ตัวติดกัน (cis) หรือตรงข้ามกัน (trans) ได้`]; },
      ()=>{ const b=pick(['Cl','Br']); return [`[Pt(NH3)2${b}2]`,'แสดง cis–trans isomer ได้','square planar MA2B2 มีทั้ง cis และ trans เช่น cisplatin (cis ออกฤทธิ์ trans ไม่ออกฤทธิ์)']; },
      ()=>{ const m=pick([['Co','³⁺'],['Cr','³⁺'],['Fe','²⁺'],['Ni','²⁺']]); return [`[${m[0]}(en)3]${m[1]}`,'แสดง optical isomer (enantiomer) ได้','en 3 ตัวพันรอบโลหะได้ 2 แบบที่เป็นภาพสะท้อนซ้อนกันไม่ได้']; },
      ()=>{ const m=pick([['Co','(NH3)6]³⁺'],['Fe','(H2O)6]²⁺'],['Cr','(H2O)6]³⁺'],['Fe','(CN)6]⁴⁻'],['Ni','(NH3)6]²⁺']]); return [`[${m[0]}${m[1]}`,'ไม่มี geometric isomer','ลิแกนด์ทั้ง 6 ตำแหน่งเหมือนกัน วางแบบใดก็ได้โครงสร้างเดียว']; },
      ()=>{ const a=pick(['NH3','H2O']), b=pick(['Cl','Br']), m=pick(['Co','Cr']); return [`[${m}(${a})5${b}]²⁺`,'ไม่มี geometric isomer','MA5B ทรง octahedral มีตำแหน่งของ B แบบเดียว']; },
      ()=>{ const b=pick(['Cl','Br']); return [`[Zn(NH3)2${b}2]`,'ไม่มี geometric isomer','tetrahedral ทุกตำแหน่งอยู่ติดกันหมด จึงไม่มี cis–trans'] ; }];
    const [f,a,why]=pick(T)(); const O=['แสดง cis–trans isomer ได้','แสดง optical isomer (enantiomer) ได้','ไม่มี geometric isomer','แสดง linkage isomer ได้'];
    return mq('cx_geo','hard',`ข้อใดกล่าวถูกต้องเกี่ยวกับไอโซเมอร์ของ ${f}`,a,O.filter(x=>x!==a),why); };
  const ISO=['Ionization isomer','Solvate (hydrate) isomer','Linkage isomer','Geometric isomer (cis/trans)','Optical isomer'];
  const D_GEO=deck('cx_geo',[
    ['easy','สารเชิงซ้อนที่มี CN 4 แบบ square planar พบบ่อยในโลหะที่มีอิเล็กตรอนแบบใด','d8 เช่น Pt²⁺, Pd²⁺, Au³⁺',['d10 เช่น Zn²⁺','d0 เช่น Ti⁴⁺','d5 เช่น Fe³⁺'],'Square planar พบบ่อยในโลหะ d8 เช่น Pt²⁺, Pd²⁺, Au³⁺'],
    ['mid','[Co(NH3)5Br]SO4 กับ [Co(NH3)5SO4]Br เป็นไอโซเมอร์ชนิดใด','Ionization isomer',ISO.filter(x=>x!=='Ionization isomer'),'สลับไอออนที่อยู่ใน [ ] กับนอก [ ] เมื่อแตกตัวในน้ำจึงได้ไอออนต่างกัน (red-violet กับ red)'],
    ['mid','[Cr(H2O)6]Cl3 กับ [Cr(H2O)5Cl]Cl2·H2O เป็นไอโซเมอร์ชนิดใด','Solvate (hydrate) isomer',ISO.filter(x=>x!=='Solvate (hydrate) isomer'),'ต่างกันที่น้ำอยู่ใน coordination sphere หรือเป็นน้ำผลึกนอก [ ]'],
    ['mid','ลิแกนด์ NO2⁻ จับโลหะทาง N (nitro) หรือทาง O (nitrito) ทำให้เกิดไอโซเมอร์ชนิดใด','Linkage isomer',ISO.filter(x=>x!=='Linkage isomer'),'ambidentate ligand จับโลหะได้ 2 แบบ เช่น -NO2 (nitro) กับ -ONO (nitrito), -CN กับ -NC'],
    ['mid','ลิแกนด์ที่จับโลหะได้ 2 แบบผ่านอะตอมต่างกัน เช่น CN⁻ กับ NC⁻ เรียกว่าอะไร','ambidentate ligand',['bidentate ligand','chelating ligand','hexadentate ligand'],'ambidentate ligands ทำให้เกิด linkage isomer'],
    ['mid','[Co(en)3]³⁺ เป็นตัวอย่างของไอโซเมอร์ชนิดใด','Optical isomer',ISO.filter(x=>x!=='Optical isomer'),'เกิด enantiomers เพราะ en 3 ตัวพันรอบโลหะได้ 2 ทิศ'],
    ['easy','Cisplatin [Pt(NH3)2Cl2] มีโครงสร้างแบบใด','Square planar',['Tetrahedral','Octahedral','Linear'],'Pt²⁺ เป็น d8 CN 4 จึงเป็น square planar'],
    ['mid','Cisplatin กับ transplatin ต่างกันอย่างไรในทางยา','cis ออกฤทธิ์ต้านมะเร็ง ส่วน trans ไม่ออกฤทธิ์',['trans ออกฤทธิ์ ส่วน cis ไม่ออกฤทธิ์','ออกฤทธิ์เท่ากัน','ทั้งสองไม่ออกฤทธิ์'],'Cisplatin: cis = active, trans = inactive'],
    ['mid','Geometric isomer (cis/trans) พบในโครงสร้างใด','Square planar และ Octahedral',['Linear และ Tetrahedral','Tetrahedral เท่านั้น','Linear เท่านั้น'],'Geometric isomer: cis/trans ใน square planar, octahedral'],
    ['easy','ไอโซเมอร์ชนิดใดจัดเป็น stereoisomer','Geometric isomer และ Optical isomer',['Ionization isomer และ Linkage isomer','Solvate isomer และ Ionization isomer','Linkage isomer เท่านั้น'],'Stereoisomers: geometric (cis/trans) และ optical ส่วน ionization, solvate, linkage เป็น structural isomers'],
    ['easy','ไอโซเมอร์ชนิดใดจัดเป็น structural isomer','Ionization, Solvate (hydrate) และ Linkage isomer',['Geometric และ Optical isomer','Optical isomer เท่านั้น','cis และ trans'],'Structural isomers: ionization, solvate (hydrate), linkage'],
    ['mid','[CoCl2(NH3)4]⁺ ที่ Cl อยู่ติดกัน เรียกว่าอะไร','cis isomer',['trans isomer','optical isomer','linkage isomer'],'cis = Cl อยู่ติดกัน trans = Cl อยู่ตรงข้ามกัน'],
    ['mid','[Fe(H2O)6]²⁺ และ [Co(NH3)6]³⁺ มีโครงสร้างแบบใด','Octahedral ทั้งคู่',['Tetrahedral ทั้งคู่','Square planar ทั้งคู่','Octahedral และ Tetrahedral ตามลำดับ'],'ทั้งคู่มี CN 6 จึงเป็น Octahedral'],
    ['hard','[ZnCl4]²⁻ เป็น tetrahedral แต่ [PtCl4]²⁻ เป็น square planar เพราะเหตุใด','Zn²⁺ เป็น d10 ส่วน Pt²⁺ เป็น d8',['Zn²⁺ มีประจุมากกว่า Pt²⁺','Cl⁻ จับ Zn ด้วย 2 ตำแหน่ง','Pt มี CN 6'],'CN 4 เหมือนกัน แต่โลหะ d8 อย่าง Pt²⁺ มักเป็น square planar'],
    ['mid','โลหะที่มี CN ตั้งแต่ 7 ขึ้นไปมีลักษณะโครงสร้างอย่างไร','โครงสร้างซับซ้อน',['เป็น linear เสมอ','เป็น tetrahedral เสมอ','ไม่สามารถเกิดสารเชิงซ้อนได้'],'โลหะที่มี CN เกิน 7 จะมีโครงสร้างที่ซับซ้อน'],
    ['mid','CN 10 ขึ้นไปมีรูปร่างตัวอย่างใดตามสไลด์','Icosahedral',['Octahedral','Linear','Square planar'],'CN 10 เป็นต้นไป เช่น Icosahedral']
  ]);
  add('cx_geo',{n:'โครงสร้างและไอโซเมอร์',d:'รูปร่างตาม CN, square planar, cis–trans และ optical isomer',pg:6,ch:2},
    L3([['easy',gGeoCN],['easy',gCNGeo],['easy',D_GEO('easy')],['mid',gGeo],['mid',D_GEO('mid')],['mid',gGeoCN],['hard',gGeo],['hard',gIso],['hard',D_GEO('hard')]]));

  /* ---------- 4. ทฤษฎีเวอร์เนอร์ CFT และเสถียรภาพ ---------- */
  const gWer=()=>{ const c=anyCx(), S=salt(c); const pv=Math.random()<.5;
    return pv?nq('cx_thy','mid',`ตามทฤษฎีของ Werner ${saltF(S)} มี primary valence เท่าใด`,c.ox,'',[c.cn,nLig(c),Math.abs(c.q),c.ox+1,c.ox-1].filter(x=>x!==c.ox),['Primary valence = เลขออกซิเดชันของโลหะ',oxExp(c)],v=>String(v))
      :nq('cx_thy','mid',`ตามทฤษฎีของ Werner ${saltF(S)} มี secondary valence เท่าใด`,c.cn,'',[c.ox,nLig(c),Math.abs(c.q),c.cn-2,c.cn+2].filter(x=>x!==c.cn),['Secondary valence = เลขโคออร์ดิเนชัน คือจำนวนตำแหน่งที่ลิแกนด์จับโลหะโดยตรงภายใน [ ]',cnExp(c)],v=>String(v)); };
  const gIons=()=>{ const c=anyCx(), S=salt(c); if(!S.a&&!S.k) return null; const n=1+(S.na||S.nk);
    return nq('cx_thy','hard',`${saltF(S)} 1 mol ละลายน้ำแตกตัวให้ไอออนทั้งหมดกี่ mol`,n,'mol',[n-1,n+1,1+nLig(c),c.cn+1],[`ส่วนใน [ ] ไม่แตกตัว ได้ไอออนเชิงซ้อน 1 ไอออน`,`ไอออนนอก [ ] แตกตัวออกมา ${S.na||S.nk} ไอออน`,`รวม ${n} mol`],v=>String(v)); };
  const gFree=()=>{ const ct=pick([[6,0],[5,1],[4,2],[3,3]]), m=pick(['Co','Cr']), a=pick(['NH3','H2O']); const fm=`[${m}(${a})${ct[0]}${ct[1]?'Cl'+(ct[1]>1?ct[1]:''):''}]Cl${3-ct[1]>1?3-ct[1]:''}`;
    if(3-ct[1]<=0) return null; const n=3-ct[1];
    return nq('cx_thy','hard',`เติม AgNO3 มากเกินพอลงในสารละลาย ${fm} 1 mol จะได้ตะกอน AgCl กี่ mol`,n,'mol',[3,ct[1],n+1,6].filter(x=>x!==n),[`Cl⁻ ที่อยู่ใน [ ] เป็นลิแกนด์ ไม่แตกตัวออกมา`,`Cl⁻ นอก [ ] มี ${n} ตัว จึงตกตะกอนเป็น AgCl ${n} mol`,'นี่คือหลักฐานที่ Werner ใช้แยก primary valence กับ secondary valence'],v=>String(v)); };
  const gBeta=()=>{ const n=ri(2,4), K=Array.from({length:n},()=>+(rnd(1,9.9,1)*Math.pow(10,ri(1,5))).toPrecision(2)); const b=K.reduce((a,x)=>a*x,1);
    const m=pick(['Cu²⁺ กับ NH3','Ni²⁺ กับ NH3','Zn²⁺ กับ NH3','Cd²⁺ กับ CN⁻']), ks=K.map((x,i)=>`K${i+1} = ${fmt(x)}`).join(', ');
    return nq('cx_thy','hard',`การเกิดสารเชิงซ้อนของ ${m} มี ${ks} ค่าคงที่เสถียรภาพรวม β${n} เท่ากับเท่าใด`,b,'',[K.reduce((a,x)=>a+x,0),K[n-1],b/K[0],K[0]*K[n-1]],[`βn = K1 × K2 × … × Kn`,`β${n} = ${K.map(fmt).join(' × ')} = ${fmt(b)}`]); };
  const gK2=()=>{ const K1=+(rnd(1,9.9,1)*Math.pow(10,ri(2,4))).toPrecision(2), K2=+(rnd(1,9.9,1)*Math.pow(10,ri(1,4))).toPrecision(2), b2=K1*K2;
    return nq('cx_thy','hard',`สารเชิงซ้อน ML2 มี β2 = ${fmt(b2)} และ K1 = ${fmt(K1)} ค่า K2 เท่ากับเท่าใด`,b2/K1,'',[b2*K1,K1/b2,b2-K1,Math.sqrt(b2)],['β2 = K1 × K2',`K2 = β2 / K1 = ${fmt(b2)} / ${fmt(K1)} = ${fmt(b2/K1)}`]); };
  const D_THY=deck('cx_thy',[
    ['easy','ทฤษฎีแรกที่อธิบายโครงสร้างสารประกอบเชิงซ้อนได้อย่างเป็นระบบ เสนอโดยใคร','Alfred Werner',['Gilbert Lewis','Linus Pauling','Svante Arrhenius'],'Alfred Werner (1893–1898) ได้รับ Nobel Prize in Chemistry ปี 1913'],
    ['easy','Werner ได้รับรางวัลโนเบลสาขาเคมีในปีใด','ค.ศ. 1913',['ค.ศ. 1893','ค.ศ. 1898','ค.ศ. 1901'],'Nobel Prize in Chemistry ปี 1913'],
    ['easy','ตามทฤษฎี Werner primary valence หมายถึงอะไร','เลขออกซิเดชันของโลหะ',['เลขโคออร์ดิเนชัน','จำนวนลิแกนด์ที่เป็นกลาง','จำนวนอิเล็กตรอนใน d-orbital'],'Primary valence = oxidation number ถูกชดเชยด้วยไอออนภายนอก complex'],
    ['easy','ตามทฤษฎี Werner secondary valence หมายถึงอะไร','เลขโคออร์ดิเนชัน (coordination number)',['เลขออกซิเดชัน','ประจุของไอออนตรงข้าม','จำนวนไอออนนอก [ ]'],'Secondary valence = จำนวนลิแกนด์ที่จับโลหะโดยตรง อยู่ภายใน [ ]'],
    ['mid','secondary valence ของ Werner เกิดจากพันธะชนิดใด','พันธะโคออร์ดิเนต อยู่ภายใน [ ]',['พันธะไอออนิก อยู่นอก [ ]','พันธะไฮโดรเจน','พันธะโลหะ'],'Secondary valence เกิดพันธะโคออร์ดิเนต อยู่ภายใน [ ]'],
    ['mid','ตามทฤษฎี Werner รูปทรงเรขาคณิตของสารเชิงซ้อนขึ้นกับอะไร','secondary valence',['primary valence','ประจุของไอออนตรงข้าม','มวลโมเลกุลของลิแกนด์'],'รูปทรงขึ้นกับ secondary valence เช่น CN 6 → octahedral'],
    ['mid','secondary valence ที่พบบ่อยที่สุดคือค่าใด','2, 4 และ 6',['1, 3 และ 5','7, 8 และ 9','3 และ 5'],'มักเป็น 2, 4, 6'],
    ['easy','Crystal Field Theory (CFT) ใช้อธิบายเรื่องใด','การแยกระดับพลังงานของ d-orbital เมื่อลิแกนด์เข้าใกล้โลหะ',['การเรียกชื่อสารเชิงซ้อน','จำนวนไอออนในสารละลาย','อัตราการเกิดปฏิกิริยา'],'ลิแกนด์สร้างสนามไฟฟ้า ทำให้ d-orbitals แยกพลังงานต่างกัน'],
    ['mid','ใน octahedral field ออร์บิทัล t2g ประกอบด้วยข้อใด','dxy, dxz, dyz',['dx²–y², dz²','dxy, dz²','dx²–y², dxz, dyz'],'t2g = dxy, dxz, dyz พลังงานต่ำกว่า'],
    ['mid','ใน octahedral field ออร์บิทัล eg ประกอบด้วยข้อใดและมีพลังงานอย่างไร','dx²–y² และ dz² พลังงานสูงกว่า',['dxy, dxz, dyz พลังงานสูงกว่า','dx²–y² และ dz² พลังงานต่ำกว่า','dxy และ dz² พลังงานเท่ากับ t2g'],'eg = dx²–y², dz² ชี้เข้าหาลิแกนด์ จึงพลังงานสูงกว่า'],
    ['mid','ใน tetrahedral field d-orbital แยกเป็นกลุ่มใด','e และ t2',['t2g และ eg','σ และ π','s และ p'],'Octahedral → t2g & eg, Tetrahedral → e & t2'],
    ['mid','ความแรงของสนามลิแกนด์ (ligand field strength) ใช้อธิบายสมบัติใด','สี ความเสถียร และ high-spin / low-spin',['จุดเดือดของตัวทำละลาย','จำนวนไอออนนอก [ ]','มวลโมเลกุล'],'แรงลิแกนด์อธิบายสี ความเสถียร และ high-spin / low-spin'],
    ['easy','K1, K2, …, Kn ของการเกิดสารเชิงซ้อนเรียกว่าอะไร','ค่าคงที่เสถียรภาพแต่ละขั้น (stepwise stability constant)',['ค่าคงที่เสถียรภาพรวม (overall)','ค่าคงที่การแตกตัวของกรด','ค่าคงที่อัตรา'],'K1, K2, Kn คือ stepwise stability (formation) constant'],
    ['easy','β (beta) ของสารเชิงซ้อนเรียกว่าอะไร','ค่าคงที่เสถียรภาพรวม (overall stability constant)',['ค่าคงที่เสถียรภาพแต่ละขั้น','ค่าคงที่การละลาย','ค่าคงที่ของแก๊ส'],'β แสดงว่าสารเชิงซ้อนตัวใดเสถียรที่สุด'],
    ['mid','ความสัมพันธ์ระหว่าง β3 กับค่า K แต่ละขั้นคือข้อใด','β3 = K1 × K2 × K3',['β3 = K1 + K2 + K3','β3 = K3 / K1','β3 = (K1 × K2) / K3'],'βn = K1 K2 K3 … Kn'],
    ['mid','จากข้อมูล Cu²⁺ กับ NH3 (β1 = 1.3×10⁴ ถึง β4 = 4.3×10¹²) สารเชิงซ้อนใดเสถียรที่สุด','[Cu(NH3)4]²⁺',['[Cu(NH3)]²⁺','[Cu(NH3)2]²⁺','[Cu(NH3)3]²⁺'],'β4 มีค่ามากที่สุด [Cu(NH3)4]²⁺ จึงเสถียรที่สุด'],
    ['mid','[Co(NH3)6]Cl3 ต้องมี Cl⁻ 3 ตัวอยู่นอก [ ] เพราะเหตุใดตามทฤษฎี Werner','Co³⁺ มี primary valence = 3 ต้องใช้ Cl⁻ 3 ตัวหักล้างประจุ',['Co มี CN = 3','NH3 มีประจุ −1','Cl⁻ เป็นลิแกนด์ bidentate'],'Primary valence 3 ถูกชดเชยด้วย Cl⁻ 3 ตัวข้างนอก'],
    ['hard','ข้อใดกล่าวผิดเกี่ยวกับลิแกนด์ที่ทำหน้าที่ secondary valence','แทนที่ได้ง่ายและอยู่นอก coordination sphere',['ต้องอยู่ใกล้โลหะเสมอ','เขียนอยู่ใน [ ]','จำนวนของมันกำหนดรูปทรง'],'ลิแกนด์ secondary valence อยู่ใน coordination sphere เขียนใน [ ] และไม่แทนที่ได้ง่าย']
  ]);
  add('cx_thy',{n:'Werner, CFT และเสถียรภาพ',d:'primary และ secondary valence, t2g/eg, K และ β',pg:9,ch:2},
    L3([['easy',D_THY('easy')],['easy',gWer],['mid',gWer],['mid',D_THY('mid')],['mid',gIons],['hard',gFree],['hard',gIons],['hard',gBeta],['hard',gK2],['hard',D_THY('hard')]]));

  /* ---------- 5. ประโยชน์ทางเภสัชและการวิเคราะห์ด้วย EDTA ---------- */
  const USE=[['Cisplatin','Pt','ยาต้านมะเร็ง ทำลาย DNA ของเซลล์มะเร็งโดยจับกับเบส guanine'],['Carboplatin','Pt','ยาต้านมะเร็งกลุ่มเดียวกับ cisplatin'],['Oxaliplatin','Pt','ยาต้านมะเร็งกลุ่มแพลทินัม'],
    ['Vitamin B12 (cobalamin)','Co','Co³⁺ complex ที่จำเป็นต่อการสร้างเม็ดเลือดแดง'],['Hemoglobin','Fe','โปรตีนขนส่งออกซิเจน เป็น Fe²⁺ complex'],['Chlorophyll','Mg','สารเชิงซ้อนธรรมชาติในการสังเคราะห์แสง (Mg²⁺ complex)'],
    ['Silver sulfadiazine','Ag','ยาทาแผลไฟไหม้ที่เป็นสารเชิงซ้อนของเงิน'],['Bismuth subsalicylate','Bi','ยาที่เป็นสารเชิงซ้อนของบิสมัท'],['Insulin zinc','Zn','อินซูลินที่จับกับสังกะสี'],['Sodium nitroprusside','Fe','ยาที่เป็นสารเชิงซ้อนของเหล็กกับ CN⁻ และ NO']];
  const MS=['Pt','Co','Fe','Mg','Ag','Bi','Zn','Cu'];
  const gUseM=()=>{ const u=pick(USE); return mq('cx_use','easy',`${u[0]} เป็นสารเชิงซ้อนที่มีโลหะใดเป็นศูนย์กลาง`,u[1],MS.filter(x=>x!==u[1]),u[0]+': '+u[2]); };
  const gUseR=()=>{ const u=pick(USE.slice(0,6)); return mq('cx_use','mid',`ข้อใดคือบทบาทของ ${u[0]}`,u[2],USE.slice(0,6).filter(x=>x[2]!==u[2]).map(x=>x[2]),u[0]+': '+u[2]); };
  const DRG=['Cisplatin','Carboplatin','Oxaliplatin','Sodium nitroprusside','Deferoxamine','Silver sulfadiazine','Bismuth subsalicylate','Insulin zinc','Hemin','EDTA (เมื่อจับโลหะ)'];
  const NOT=['Paracetamol','Aspirin','Ibuprofen','Amoxicillin','Metformin','Caffeine','Glucose','Omeprazole'];
  const gNot=()=>{ const r=pick(NOT); return mq('cx_use','mid','ข้อใดไม่ใช่ยาที่เป็น coordination compound',r,shuf(DRG).slice(0,5),`${r} เป็นยาโมเลกุลอินทรีย์ทั่วไป ไม่มีโลหะเป็นศูนย์กลาง ส่วนยาที่เป็นสารเชิงซ้อน เช่น ${DRG.slice(0,6).join(', ')}`); };
  const gIs=()=>{ const r=pick(DRG); return mq('cx_use','easy','ข้อใดเป็นยาที่เป็น coordination compound',r,shuf(NOT).slice(0,5),`${r} อยู่ในรายการยาที่เป็นสารเชิงซ้อนที่พบบ่อย`); };
  const MET=[['Zn²⁺',65.4,'ยาที่มีสังกะสี'],['Mg²⁺',24.3,'ยาลดกรดที่มีแมกนีเซียม'],['Ca²⁺',40,'ยาเม็ดแคลเซียม'],['Al³⁺',27,'ยาลดกรดที่มีอะลูมิเนียม'],['Cu²⁺',63.5,'สารละลายคอปเปอร์']];
  const gEdta=()=>{ const m=pick(MET), C=pick([0.01,0.02,0.05,0.1]), V=rnd(8,30,2), n=C*V/1000, mode=ri(0,2);
    const st=`ตัวอย่าง${m[2]}ไทเทรตด้วย EDTA ${C} M ใช้ไป ${V} mL`;
    if(mode===0) return nq('cx_use','mid',`${st} ไอออน ${m[0]} ในตัวอย่างมีกี่ mol`,n,'mol',[n*2,n/2,C*V,n*4],['EDTA จับโลหะ 1:1 เสมอ',`mol EDTA = ${C} × ${V}/1000 = ${fmt(n)} mol`,`mol ${m[0]} = ${fmt(n)} mol`]);
    if(mode===1) return nq('cx_use','hard',`${st} ตัวอย่างมี ${m[0].replace(/[²³⁺]/g,'')} กี่ mg`,n*m[1]*1000,'mg',[n*m[1],n*m[1]*2000,n*m[1]*500,C*V*m[1]],['EDTA จับโลหะ 1:1',`mol = ${C} × ${V}/1000 = ${fmt(n)} mol`,`มวล = ${fmt(n)} × ${m[1]} × 1000 = ${fmt(n*m[1]*1000)} mg`]);
    const mm=+(n*m[1]*1000).toPrecision(3); return nq('cx_use','hard',`ตัวอย่างมี ${m[0].replace(/[²³⁺]/g,'')} ${mm} mg ต้องใช้ EDTA ${C} M ในการไทเทรตกี่ mL`,mm/m[1]/C,'mL',[mm/m[1]/C*2,mm/m[1]/C/2,mm/C,mm/m[1]*C],['EDTA จับโลหะ 1:1',`mol โลหะ = ${mm}/1000/${m[1]} = ${fmt(mm/1000/m[1])} mol`,`V = mol / C = ${fmt(mm/m[1]/C)} mL`]); };
  const D_USE=deck('cx_use',[
    ['easy','EDTA ใช้รักษาภาวะใด','ภาวะพิษจากโลหะหนัก เช่น Pb²⁺, Hg²⁺',['ภาวะขาดวิตามิน B12','ภาวะเลือดเป็นกรด','การติดเชื้อแบคทีเรีย'],'EDTA (chelating agent) ใช้รักษาภาวะพิษจากโลหะหนัก เช่น Pb²⁺, Hg²⁺'],
    ['easy','EDTA ใช้ในงานควบคุมคุณภาพยา (QC) อย่างไร','ไทเทรตหาปริมาณโลหะในยา เช่น ยาลดกรด',['วัดความเป็นกรดด่างของยา','ฆ่าเชื้อในยาฉีด','เพิ่มรสชาติของยา'],'ใช้ในปฏิกิริยาการควบคุมคุณภาพยาที่มีโลหะ โดยไทเทรตกับลิแกนด์มาตรฐาน'],
    ['mid','Deferoxamine ใช้ประโยชน์อย่างไร','จับเหล็กส่วนเกินออกจากร่างกาย (รักษาพิษโลหะหนัก)',['ต้านมะเร็งโดยจับ DNA','เป็นแหล่งของโคบอลต์','รักษาแผลไฟไหม้'],'Deferoxamine เป็น chelating agent สำหรับรักษาพิษโลหะหนัก'],
    ['mid','Cisplatin ออกฤทธิ์ต้านมะเร็งอย่างไร','สร้างพันธะโคออร์ดิเนชันกับเบส guanine ของ DNA',['ยับยั้งการสังเคราะห์ผนังเซลล์','จับออกซิเจนแทนฮีโมโกลบิน','เพิ่มการสร้างเม็ดเลือดแดง'],'ยาต้านมะเร็ง ทำลาย DNA ของเซลล์มะเร็งโดยสร้างโคออร์ดิเนชันกับเบส guanine'],
    ['mid','เอนไซม์ใดมีโลหะเป็น cofactor ตามตัวอย่างในสไลด์','carbonic anhydrase และ superoxide dismutase',['amylase และ lipase','pepsin และ trypsin','DNA polymerase เท่านั้น'],'enzyme complexes: cofactors ของเอนไซม์ เช่น carbonic anhydrase, superoxide dismutase'],
    ['easy','Heme ในฮีโมโกลบินใช้ลิแกนด์ใดจับ Fe²⁺','porphyrin (tetradentate)',['EDTA (hexadentate)','ethylenediamine (bidentate)','NH3 (monodentate)'],'porphyrin ของ heme เป็นลิแกนด์ tetradentate'],
    ['mid','ข้อใดเป็นโปรตีนเมทัลโล (metalloprotein) ตามสไลด์','Zn²⁺–enzyme และ Fe²⁺–heme',['Cisplatin และ Carboplatin','EDTA และ Deferoxamine','Silver sulfadiazine'],'ยาโลหะ (Cisplatin, Carboplatin) โปรตีนเมทัลโล (Zn²⁺–enzyme, Fe²⁺–heme)'],
    ['mid','ยาในข้อใดเป็นสารเชิงซ้อนของ Pt ทั้งหมด','Cisplatin, Carboplatin, Oxaliplatin',['Cisplatin, Deferoxamine, Hemin','Carboplatin, Insulin zinc, EDTA','Oxaliplatin, Silver sulfadiazine, Hemin'],'กลุ่ม platin เป็นยาต้านมะเร็งที่มี Pt'],
    ['hard','ทำไม metal-EDTA จึงเสถียรสูงกว่าสารเชิงซ้อนกับ NH3 ทั่วไป','EDTA เป็น hexadentate จับโลหะ 6 ตำแหน่ง เกิด chelate effect',['EDTA มีประจุบวกมาก','EDTA เป็น monodentate ขนาดเล็ก','NH3 ไม่มี lone pair'],'ยิ่งมีตำแหน่งจับเกาะมาก ยิ่งจับโลหะแน่นขึ้น (chelate effect)']
  ]);
  add('cx_use',{n:'ประโยชน์ทางยาและ EDTA',d:'ยาที่เป็นสารเชิงซ้อน สารชีวภาพ และไทเทรตด้วย EDTA',pg:12,ch:2},
    L3([['easy',gUseM],['easy',gIs],['easy',D_USE('easy')],['mid',gUseR],['mid',gNot],['mid',gEdta],['mid',D_USE('mid')],['hard',gEdta],['hard',D_USE('hard')]]));
})();
