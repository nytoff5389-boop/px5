/* PHB102 บทที่ 2–6 : ตัวช่วยร่วม ใช้กับ chem-c2.js ถึง chem-c6.js
   หัวข้อของแต่ละบทลงทะเบียนเข้า CHEM_TOPICS และ GEN ของบทที่ 1 โดยมี ch บอกเลขบท และ pg เป็นหน้าในสมุดของบทนั้น */
(function(){
  Object.keys(CHEM_TOPICS).forEach(k=>{ if(!CHEM_TOPICS[k].ch) CHEM_TOPICS[k].ch=1; });
  /* ประจุแบบตัวยก เช่น 2 เป็น ²⁺ และ -4 เป็น ⁴⁻ */
  const chg=n=>n===0?'':(Math.abs(n)===1?'':sup(String(Math.abs(n))))+(n>0?'⁺':'⁻');
  const ROM=['0','I','II','III','IV','V','VI','VII','VIII'];
  /* ตัวเลขแสดงผล: 3 นัยสำคัญ รองรับค่าติดลบ */
  const f3=x=>{ if(!isFinite(x)) return '–'; if(x<0) return '−'+fmt(-x); return fmt(x); };
  const sgn=x=>(x>0?'+':'')+f3(x);
  function mq(t,lv,stem,right,wrongs,exp,o){ return mcq(t,lv,stem,right,shuf(wrongs),[].concat(exp),o); }
  /* ตัวเลือกเชิงตัวเลข ใช้ค่าผิดที่พบบ่อยก่อน แล้วเติมด้วยตัวคูณ รองรับค่าลบ */
  function nq(t,lv,stem,val,unit,errs,exp,F){ F=F||f3; const f=v=>F(v)+(unit?' '+unit:''); const right=f(val);
    const pool=errs.filter(v=>v!=null&&isFinite(v)).map(f);
    for(const k of shuf([10,0.1,2,0.5,1.5,3,0.25,4])) pool.push(f(val*k));
    if(val===0) pool.push(f(1),f(-1),f(2));
    return mcq(t,lv,stem,right,pool,[].concat(exp)); }
  /* คลังโจทย์ความจำ: [ระดับ, คำถาม, คำตอบ, [ตัวลวง], คำอธิบาย] */
  function deck(t,items){ const by={easy:[],mid:[],hard:[]}; items.forEach(it=>(by[it[0]]||by.mid).push(it));
    const mk=it=>mq(t,it[0],it[1],it[2],it[3],it[4]);
    const f=lv=>()=>{ const p=by[lv]&&by[lv].length?by[lv]:items; return mk(pick(p)); };
    f.items=items; f.all=()=>items.map(mk); return f; }
  /* สร้าง GEN จากรายการ [ระดับ, ฟังก์ชัน] */
  function L3(list){ const g={easy:[],mid:[],hard:[]}; list.forEach(([l,fn])=>{ (Array.isArray(l)?l:[l]).forEach(x=>g[x].push(fn)); });
    ['easy','mid','hard'].forEach(l=>{ if(!g[l].length) g[l]=g.mid.length?g.mid:g.easy.length?g.easy:g.hard; }); return g; }
  function add(k,meta,gen){ CHEM_TOPICS[k]=meta; GEN[k]=gen; }
  const r=(a,b,dp)=>rnd(a,b,dp);
  const PCH={1:{n:'ปริมาณสารสัมพันธ์',en:'Stoichiometry',pages:28,dir:'chem/book',pdf:'chem/pdf/ch1.pdf',mb:3.5},
    2:{n:'สารประกอบเชิงซ้อน',en:'Coordination compounds',pages:17,dir:'chem/book2',pdf:'chem/pdf/ch2.pdf',mb:2.5,desc:'สารประกอบเชิงซ้อน (Coordination compounds): ลิแกนด์ เลขโคออร์ดิเนชัน การอ่านชื่อ IUPAC โครงสร้างและไอโซเมอร์ ทฤษฎี Werner และ CFT ค่าคงที่เสถียรภาพ และยาที่เป็นสารเชิงซ้อน',toc:[['บทนำ',3],['พื้นฐาน',4],['การอ่านชื่อ',5],['โครงสร้าง',6],['Isomer และ Werner',9],['CFT',10],['เสถียรภาพ',11],['ประโยชน์',12],['แบบฝึกหัด',14],['เฉลย',17]]},
    3:{n:'จลนศาสตร์เคมี',en:'Chemical kinetics',pages:18,dir:'chem/book3',pdf:'chem/pdf/ch3.pdf',mb:2.9,desc:'จลนศาสตร์เคมี (Chemical kinetics): ทฤษฎีการชนและ Ea อัตราการเกิดปฏิกิริยา กฎอัตราและอันดับ integrated rate law ครึ่งชีวิต ปัจจัยที่มีผล สมการ Arrhenius และเอนไซม์',toc:[['บทนำและทฤษฎี',3],['Rate of reaction',5],['Rate law',8],['Integrated rate law',12],['ปัจจัย',14],['Enzyme',17],['เฉลย',18]]},
    4:{n:'สมดุลเคมี',en:'Chemical equilibrium',pages:15,dir:'chem/book4',pdf:'chem/pdf/ch4.pdf',mb:2.2,desc:'สมดุลเคมี (Chemical equilibrium): ค่าคงที่สมดุล Kc และ Kp สมดุลวิวิธพันธุ์ ผลหารปฏิกิริยา Q ตาราง ICE และหลักของเลอชาเตอลิเอ',toc:[['บทนำ',3],['กราฟเข้าสู่สมดุล',4],['K, Kc และ Kp',6],['Heterogeneous',7],['Q กับ K',8],['ตาราง ICE',9],['Le Chatelier',11],['ความดัน อุณหภูมิ',13],['เฉลย',15]]},
    5:{n:'สมดุลวัฏภาค',en:'Phase equilibrium',pages:11,dir:'chem/book5',pdf:'chem/pdf/ch5.pdf',mb:2.1,desc:'สมดุลวัฏภาค (Phase equilibrium): component วัฏภาค degree of freedom กฎวัฏภาคของ Gibbs แผนภาพวัฏภาคของน้ำและกำมะถัน ระบบ 2 และ 3 component',toc:[['Component',3],['Degree of freedom',4],['Phase rule และน้ำ',6],['กำมะถัน',8],['ระบบ 2 component',9],['ระบบ 3 component',10],['เฉลย',11]]},
    6:{n:'ไฟฟ้าเคมี',en:'Electrochemistry',pages:15,dir:'chem/book6',pdf:'chem/pdf/ch6.pdf',mb:2.4,desc:'ไฟฟ้าเคมี (Electrochemistry): ปฏิกิริยารีดอกซ์และการดุล เซลล์กัลวานิก E°cell ΔG° K สมการ Nernst เซลล์ปฐมภูมิและทุติยภูมิ เซลล์อิเล็กโทรไลต์ และการป้องกันการผุกร่อน',toc:[['Redox',3],['การดุลสมการ',4],['เซลล์กัลวานิก',7],['E° มาตรฐาน',8],['ΔG° และ K',9],['ประเภทเซลล์',10],['อิเล็กโทรไลต์',11],['การผุกร่อน',13],['เทคโนโลยี',14],['เฉลย',15]]}};
  window.PCX={chg,ROM,f3,sgn,mq,nq,deck,L3,add,r,PCH};
  window.PCH=PCH;
})();
