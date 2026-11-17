/* Biochem PHB104 · สมุดบทที่ 1 บทที่ 2 และคลังข้อสอบ */
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ตัวห้อยเฉพาะสูตรเคมี เช่น CH3(CH2)7COOH, C18H34O2, H2O */
const fx=t=>esc(t).replace(/C(\d+)H(\d+)O(\d*)/g,(m,a,b,c)=>'C<sub>'+a+'</sub>H<sub>'+b+'</sub>O'+(c?'<sub>'+c+'</sub>':'')).replace(/CH([23])(?![\d<])/g,'CH<sub>$1</sub>').replace(/\)(\d+)(?=[A-Z(])/g,')<sub>$1</sub>').replace(/H2O/g,'H<sub>2</sub>O');
const pad=n=>String(n).padStart(2,'0'), pct=(a,b)=>b?Math.round(a/b*100):0, clock=s=>pad(Math.floor(s/60))+':'+pad(Math.floor(s%60));
const dkey=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const KEY='payap.bio.v1';
let DB={}; try{ DB=JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){}
DB=Object.assign({ans:0,ok:0,tp:{},wrong:[],sessions:[]},DB);
DB.pg=Object.assign({1:1,2:1},DB.pg); DB.pgMax=Object.assign({1:1,2:1},DB.pgMax);
DB.cfg=Object.assign({lv:'mix',n:20,mode:'instant',timer:true},DB.cfg);
const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(DB)); }catch(e){} };
function touchMain(mode,href){ try{ const m=JSON.parse(localStorage.getItem('payap.v1'))||{}; m.last={k:'app',id:'bio',mode,href}; const t=dkey(new Date()); m.act=m.act||[]; if(!m.act.includes(t)) m.act.push(t); localStorage.setItem('payap.v1',JSON.stringify(m)); }catch(e){} }
const BOOKS={
  1:{n:21,dir:'book1',pdf:'pdf/ch1.pdf',mb:4.1,t:'คาร์โบไฮเดรต',en:'Chemistry and Biological Roles of Carbohydrates',img:'../ui/img/b-bio1.jpg',
     sec:[['บทนำ',3],['Monosaccharides',4],['Oligosaccharides',12],['Polysaccharides',15],['Complex carbohydrate',19]]},
  2:{n:28,dir:'book2',pdf:'pdf/ch2.pdf',mb:6.1,t:'ลิพิดส์',en:'Chemistry and Biological Roles of Lipids',img:'../ui/img/b-bio2.jpg',
     sec:[['บทนำ',3],['กรดไขมัน',4],['ไตรกลีเซอไรด์',11],['ขี้ผึ้ง',14],['ลิพิดมีขั้ว',15],['สฟิงโกลิพิดส์',17],['อีโคซานอยด์',19],['สเตียรอยด์',21],['เทอร์พีนส์และวิตามิน',22],['เยื่อหุ้มเซลล์และ Lipoproteins',25]]}
};
const TP=BIO_TOPICS, tpsOf=ch=>Object.keys(TP).filter(k=>TP[k].ch===ch);
const route=()=>location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
let cleanup=[];
function toast(t){ $$('.toast').forEach(x=>x.remove()); const d=document.createElement('div'); d.className='toast'; d.setAttribute('role','status'); d.textContent=t; document.body.appendChild(d); setTimeout(()=>d.remove(),2200); }
function ring(p,size,cls){ const r=(size-10)/2, c=2*Math.PI*r; return `<div class="ring ${cls||''}" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle class="tr" cx="${size/2}" cy="${size/2}" r="${r}"/><circle class="fg" cx="${size/2}" cy="${size/2}" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c*(1-p/100)).toFixed(1)}"/></svg><b style="font-size:${Math.round(size*.24)}px">${p}<small>%</small></b></div>`; }
const top=(cur,sub)=>`<header class="bx-top"><div class="r"><a class="bk" href="../" aria-label="กลับหน้าหลัก PAYAPkuytok">${ic('chevron_left')}<span>PAYAPkuytok</span></a>
   <div class="tt"><b>Biochemistry</b><small>${esc(sub||'PHB104 · คาร์โบไฮเดรต และลิพิดส์')}</small></div>
   <button class="ibtn" data-act="theme" aria-label="สลับโหมดสว่างหรือมืด" title="สลับโหมดสว่างหรือมืด">${ic(document.documentElement.dataset.theme==='dark'?'sun':'moon')}</button></div>
  <nav class="bx-nav" aria-label="เมนูวิชา">${[['','หน้าแรก','house'],['book/1','สมุดบทที่ 1','book_open'],['book/2','สมุดบทที่ 2','book_open'],['exam','ข้อสอบ','clipboard_check']].map(x=>`<a href="#/${x[0]}" class="${cur===x[0]?'on':''}" ${cur===x[0]?'aria-current="page"':''}>${ic(x[2])}${x[1]}</a>`).join('')}</nav></header>`;

/* ---------- หน้าแรก ---------- */
function vHome(v){
  document.title='Biochem PHB104 · PAYAPkuytok';
  const acc=DB.ans?pct(DB.ok,DB.ans)+'%':'–', rd=k=>pct((DB.pgMax[k]||1)-1,BOOKS[k].n-1);
  const bk=k=>{ const b=BOOKS[k]; return `<article class="bx-bk"><div class="cv" style="background-image:url(${b.img})"><span class="tag">บทที่ ${k}</span></div><div class="bd"><h3>${esc(b.t)}</h3><p>${esc(b.en)} · สมุด ${b.n} หน้า</p>
     <div class="bx-pr"><div class="bar"><i style="width:${rd(k)}%"></i></div><span class="num">อ่านแล้ว ${rd(k)}%</span></div>
     <div class="ac"><a class="btn" href="#/book/${k}">${ic('book_open')}${(DB.pg[k]||1)>1?'อ่านต่อหน้า '+DB.pg[k]:'อ่านสมุด'}</a><button class="btn sec" data-act="start" data-v="ch:${k}">${ic('clipboard_check')}ข้อสอบ</button><button class="btn dlw" type="button" data-pxdl="1">${ic('download')}ดาวน์โหลด PDF · ${b.mb} MB</button></div></div></article>`; };
  v.innerHTML=top('')+`<main class="bx-pg"><section class="bx-hero"><div><span class="tag">PHB104</span><h1 style="margin-top:8px">Biochemistry</h1><p>สมุดสรุปบทที่ 1 คาร์โบไฮเดรต และบทที่ 2 ลิพิดส์ พร้อมคลังข้อสอบจากเนื้อหาในสไลด์เรียน เน้นความจำ มีวิเคราะห์เล็กน้อย และโจทย์โครงสร้างกรดไขมัน</p></div>
     <div class="bx-kp"><div><small>ทำแล้ว</small><b class="num">${DB.ans}</b></div><div><small>แม่นยำ</small><b class="num">${acc}</b></div></div></section>
    <section class="bx-books">${bk(1)}${bk(2)}
     <article class="bx-bk"><div class="cv" style="background-image:url(../ui/img/b-bioq.jpg)"><span class="tag">ข้อสอบ</span></div><div class="bd"><h3>คลังข้อสอบ Biochem</h3><p>บทที่ 1 ${BIO_COUNT(1)} ข้อ บทที่ 2 ${BIO_COUNT(2)} ข้อ และโจทย์โครงสร้างกรดไขมันสุ่มได้ไม่จำกัด</p>
      <div class="ac"><a class="btn" href="#/exam">${ic('clipboard_check')}เลือกชุดข้อสอบ</a><button class="btn sec" data-act="start" data-v="mock">${ic('timer')}สอบจำลอง</button></div></div></article></section>
    <p class="bx-note">เนื้อหาข้อสอบอ้างอิงจากสไลด์ PHB104 เคมีและหน้าที่ทางชีวภาพของคาร์โบไฮเดรต และลิพิดส์</p></main>`;
}

/* ---------- อ่านสมุด ---------- */
function vBook(v,k,pg){
  k=+k===2?2:1; const b=BOOKS[k], n=b.n, start=Math.max(1,Math.min(n,+pg||DB.pg[k]||1));
  document.title='สมุดบทที่ '+k+' '+b.t+' · Biochem'; touchMain('read','bio/#/book/'+k);
  v.innerHTML=`<div class="rd bx-rd ${DB.wide?'wide':''}"><div class="fbar"><a class="ibtn" href="#/" aria-label="กลับหน้าแรกของวิชา" title="กลับ">${ic('arrow_left')}</a>
     <div class="tt"><b>บทที่ ${k} ${esc(b.t)}</b><small id="pgno">PHB104 · หน้า ${start} จาก ${n}</small></div>
     <div class="seg" role="tablist" aria-label="เลือกเล่ม"><button class="${k===1?'on':''}" data-act="go" data-v="#/book/1">บทที่ 1</button><button class="${k===2?'on':''}" data-act="go" data-v="#/book/2">บทที่ 2</button></div>
     <span class="dv"></span><button class="ibtn" data-act="wide" aria-label="ขยายหรือย่อหน้าสมุด" title="ขยายหรือย่อหน้าสมุด">${ic('zoom_in')}</button>
     <button class="dlb" type="button" data-pxdl="1" aria-label="ดาวน์โหลด PDF" title="ดาวน์โหลด PDF">${ic('download')}<span>PDF</span></button>
     <button class="ibtn" data-act="start" data-v="ch:${k}" aria-label="ทำข้อสอบบทนี้" title="ทำข้อสอบบทนี้">${ic('clipboard_check')}</button></div>
    <div class="pjump" aria-label="ข้ามไปหัวข้อ">${b.sec.map(s=>`<button class="chip" data-act="pgo" data-v="${s[1]}">${esc(s[0])}</button>`).join('')}</div>
    <div class="pgs">${Array.from({length:n},(_,i)=>`<figure id="pg${i+1}"><img src="${b.dir}/p-${String(i+1).padStart(3,'0')}.webp" alt="สมุด Biochem บทที่ ${k} หน้า ${i+1}" loading="${Math.abs(i+1-start)<2?'eager':'lazy'}" decoding="async" width="1600" height="2264"><figcaption>${i+1} / ${n}</figcaption></figure>`).join('')}</div>
    <div class="dl"><button class="btn lg" data-act="start" data-v="ch:${k}">${ic('clipboard_check')}อ่านจบแล้ว ทำข้อสอบบทที่ ${k}</button><button class="btn lg dlw" type="button" data-pxdl="1">${ic('download')}ดาวน์โหลด PDF</button></div></div>`;
  const figs=$$('.pgs figure'), lab=$('#pgno'); let tk=0;
  const jump=p=>{ const f=figs[p-1]; if(f) scrollTo(0,f.getBoundingClientRect().top+scrollY-84); };
  if(start>1){ jump(start); requestAnimationFrame(()=>jump(start)); setTimeout(()=>jump(start),120); } else scrollTo(0,0);
  const spy=()=>{ tk=0; let cur=1; const mid=innerHeight*.4; for(let i=0;i<figs.length;i++){ if(figs[i].getBoundingClientRect().top<mid) cur=i+1; else break; }
    if(cur!==DB.pg[k]){ DB.pg[k]=cur; DB.pgMax[k]=Math.max(DB.pgMax[k]||1,cur); save(); } if(lab) lab.textContent='PHB104 · หน้า '+cur+' จาก '+n; };
  const on=()=>{ if(!tk) tk=setTimeout(spy,160); };
  addEventListener('scroll',on,{passive:true}); const t0=setTimeout(spy,400);
  cleanup.push(()=>{ removeEventListener('scroll',on); clearTimeout(tk); clearTimeout(t0); }); vBook.jump=jump;
}

/* ---------- เลือกชุดข้อสอบ ---------- */
function vExam(v){
  document.title='ข้อสอบ Biochem PHB104'; const C=DB.cfg, nw=DB.wrong.length, demo=FA.find(f=>f.c===18&&f.d.length===2);
  const acc=t=>{ const b=DB.tp[t]; return b&&b[0]?' · ทำแล้ว '+b[0]+' ข้อ ถูก '+pct(b[1],b[0])+'%':''; };
  const cnt=t=>BANK.filter(c=>c.t===t).length;
  const chSec=ch=>`<section class="group"><div class="gh"><div class="th" style="background-image:url(${BOOKS[ch].img})"></div><div class="grow"><div class="row" style="gap:8px"><h2>บทที่ ${ch} ${esc(BOOKS[ch].t)}</h2><span class="tag">PHB104</span></div><p>${BIO_COUNT(ch)} ข้อจากสไลด์เรียน${ch===2?' และโจทย์โครงสร้างกรดไขมันที่สุ่มใหม่ทุกครั้ง':''}</p></div></div>
    <div class="lst"><button class="item" data-act="start" data-v="ch:${ch}"><span class="n">${ic('shuffle')}</span><div class="grow"><h3>สุ่มจากทั้งบท ${C.n} ข้อ</h3><p>คละทุกหัวข้อของบทที่ ${ch} ตามระดับที่เลือกไว้ด้านบน</p></div>${ic('chevron_right','ch')}</button>
     <button class="item" data-act="start" data-v="all:${ch}"><span class="n">${ic('layers')}</span><div class="grow"><h3>ทำครบทั้งบท ${BIO_COUNT(ch)+(ch===2?15:0)} ข้อ</h3><p>ทุกข้อในคลังของบทนี้ สลับลำดับใหม่ทุกครั้ง</p></div>${ic('chevron_right','ch')}</button>
     ${tpsOf(ch).map((t,i)=>`<button class="item" data-act="start" data-v="tp:${t}"><span class="n num">${i+1}</span><div class="grow"><h3>${esc(TP[t].n)}</h3><p>${TP[t].gen?'สุ่มโครงสร้างใหม่ทุกครั้ง ชุดละ '+C.n+' ข้อ':cnt(t)+' ข้อ'}${acc(t)}</p></div>${ic('chevron_right','ch')}</button>`).join('')}</div></section>`;
  v.innerHTML=top('exam')+`<main class="bx-pg"><div class="ph"><h1>ข้อสอบ Biochem</h1><p>ปรนัย 4 ตัวเลือก ไม่มีคำใบ้ในโจทย์ เฉลยและคำอธิบายจะแสดงหลังตอบ</p></div>
    <div class="card"><h2>ตั้งค่าชุดข้อสอบ</h2><div class="bx-set">
      <div class="fld"><span class="lb">ระดับความยาก</span><div class="chips">${[['mix','คละระดับ'],['easy','ง่าย'],['mid','ปานกลาง'],['hard','ยาก']].map(x=>`<button class="chip ${C.lv===x[0]?'on':''}" data-act="cfg" data-k="lv" data-v="${x[0]}" aria-pressed="${C.lv===x[0]}">${x[1]}</button>`).join('')}</div></div>
      <div class="fld"><span class="lb">จำนวนข้อต่อชุด</span><div class="chips">${[10,20,30,50].map(n=>`<button class="chip num ${C.n===n?'on':''}" data-act="cfg" data-k="n" data-v="${n}" aria-pressed="${C.n===n}">${n} ข้อ</button>`).join('')}</div></div></div>
     <div class="sw" style="margin-top:8px"><div><b style="font-weight:500">เฉลยทันทีหลังตอบ</b><p>ปิดไว้ถ้าอยากเห็นเฉลยตอนส่งข้อสอบทีเดียว</p></div><button class="tg" role="switch" aria-checked="${C.mode==='instant'}" data-act="cfg" data-k="mode" data-v="toggle" aria-label="เฉลยทันทีหลังตอบ"></button></div>
     <div class="sw"><div><b style="font-weight:500">แสดงนาฬิกาจับเวลา</b><p>กดซ่อนหรือแสดงระหว่างทำได้</p></div><button class="tg" role="switch" aria-checked="${!!C.timer}" data-act="cfg" data-k="timer" data-v="toggle" aria-label="แสดงนาฬิกาจับเวลา"></button></div></div>
    <section class="bx-fa"><h2>${ic('flask_conical')}โจทย์โครงสร้างกรดไขมัน</h2><p>ระบบสร้างรูปโครงสร้างใหม่ทุกครั้ง ให้นับคาร์บอน นับพันธะคู่ แล้วเรียกชื่อย่อแบบ Delta (Δ) Omega (ω) และระบบ n</p>
     <div class="demo">${faSVG(demo)}</div>
     <div class="row">${[['mix','คละทุกแบบ'],['easy','นับคาร์บอนและพันธะคู่'],['mid','เรียกชื่อ Δ ω n'],['hard','เลือกโครงสร้างและแปลงระบบ']].map((x,i)=>`<button class="btn ${i?'sec':''}" data-act="start" data-v="fa:${x[0]}">${i?'':ic('play')}${x[1]}</button>`).join('')}</div></section>
    <div class="quick" style="margin-top:18px"><button class="item" data-act="start" data-v="mock"><span class="n">${ic('timer')}</span><div class="grow"><h3>สอบจำลองรวม 2 บท 40 ข้อ</h3><p>คละทั้งคาร์โบไฮเดรตและลิพิดส์ จับเวลา เฉลยตอนส่ง</p></div>${ic('chevron_right','ch')}</button>
     <button class="item" data-act="start" data-v="wrong" ${nw?'':'disabled style="opacity:.55"'}><span class="n">${ic('rotate_ccw')}</span><div class="grow"><h3>ทบทวนข้อที่เคยผิด</h3><p>${nw?'มี '+nw+' ข้อรอทบทวน ตอบถูกแล้วจะออกจากรายการ':'ยังไม่มีข้อที่ผิด'}</p></div>${ic('chevron_right','ch')}</button></div>
    ${chSec(1)}${chSec(2)}
    ${DB.sessions.length?`<div class="sec-h"><div><h2>ผลสอบล่าสุด</h2></div></div><div class="card" style="padding:8px 20px"><div class="hist">${DB.sessions.map((R,i)=>`<a href="#/result/${i}"><span>${esc(R.title)}</span><small>${new Date(R.d).toLocaleDateString('th-TH',{day:'numeric',month:'short'})}</small><b class="num">${R.ok}/${R.n}</b></a>`).join('')}</div></div>`:''}</main>`;
}

/* ---------- ทำข้อสอบ ---------- */
let QZ=null, tmr=0;
try{ QZ=JSON.parse(sessionStorage.getItem('payap.bio.qz')); }catch(e){}
const keepQZ=()=>{ try{ QZ?sessionStorage.setItem('payap.bio.qz',JSON.stringify(QZ)):sessionStorage.removeItem('payap.bio.qz'); }catch(e){} };
const LVT={mix:'คละระดับ',easy:'ง่าย',mid:'ปานกลาง',hard:'ยาก'};
function startQuiz(kind){
  const C=DB.cfg; let qs=[], title='', mode=C.mode, timer=!!C.timer; const m=kind.split(':');
  if(m[0]==='ch'){ qs=bioSet(tpsOf(+m[1]),C.lv,C.n); title='บทที่ '+m[1]+' '+BOOKS[m[1]].t+' · '+LVT[C.lv]; }
  else if(m[0]==='all'){ const ch=+m[1]; qs=shuf(BANK.filter(c=>TP[c.t].ch===ch).map(bankQ).concat(ch===2?bioSet(['l_name'],'mix',15):[])); title='บทที่ '+ch+' ครบทั้งบท'; }
  else if(m[0]==='tp'){ const t=m[1]; qs=TP[t].gen?bioSet([t],C.lv,C.n):shuf(BANK.filter(c=>c.t===t).map(bankQ)); title=TP[t].n; }
  else if(m[0]==='fa'){ qs=bioSet(['l_name'],m[1],C.n); title='โครงสร้างกรดไขมัน · '+({mix:'คละทุกแบบ',easy:'นับคาร์บอนและพันธะคู่',mid:'เรียกชื่อ Δ ω n',hard:'เลือกโครงสร้างและแปลงระบบ'})[m[1]]; }
  else if(kind==='mock'){ qs=shuf(bioSet(tpsOf(1),'mix',18).concat(bioSet(tpsOf(2),'mix',22))); title='สอบจำลองรวม 2 บท 40 ข้อ'; mode='end'; timer=true; }
  else if(kind==='wrong'){ qs=shuf(DB.wrong).slice(0,30).map(q=>{ const idx=shuf(q.opts.map((_,i)=>i)); return Object.assign({},q,{opts:idx.map(i=>q.opts[i]),optFig:q.optFig?idx.map(i=>q.optFig[i]):null,ans:idx.indexOf(q.ans)}); }); title='ทบทวนข้อที่เคยผิด'; }
  qs=qs.filter(Boolean); if(!qs.length){ toast('ยังไม่มีข้อสอบในชุดนี้'); return; }
  QZ={title,mode,timer,kind,i:0,el:0,qs:qs.map(q=>({t:q.t,lv:q.lv,stem:q.stem,opts:q.opts,ans:q.ans,exp:q.exp,fig:q.fig||'',optFig:q.optFig||null,pick:null,flag:false,rec:false}))}; keepQZ();
  touchMain('exam','bio/#/exam');
  if(route()[0]==='quiz') render(); else location.hash='#/quiz';
}
const slim=q=>({t:q.t,lv:q.lv,stem:q.stem,opts:q.opts,ans:q.ans,exp:q.exp,fig:q.fig||'',optFig:q.optFig||null});
const qkey=q=>q.stem+'|'+q.opts[q.ans]+'|'+(q.fig||'').length;
function record(q){ if(q.rec||q.pick==null) return; q.rec=true; const ok=q.pick===q.ans; DB.ans++; if(ok) DB.ok++;
  const tp=DB.tp[q.t]||(DB.tp[q.t]=[0,0]); tp[0]++; if(ok) tp[1]++;
  const k=qkey(q), same=x=>qkey(x)===k;
  if(ok) DB.wrong=DB.wrong.filter(x=>!same(x)); else if(!DB.wrong.some(same)){ DB.wrong.unshift(slim(q)); DB.wrong=DB.wrong.slice(0,60); }
  try{ const mm=JSON.parse(localStorage.getItem('payap.v1'))||{}; const t=dkey(new Date()); mm.days=mm.days||{}; mm.days[t]=(mm.days[t]||0)+1; localStorage.setItem('payap.v1',JSON.stringify(mm)); }catch(e){}
  save(); }
function finishQuiz(){ if(!QZ) return; clearInterval(tmr); QZ.qs.forEach(record); const n=QZ.qs.length, ok=QZ.qs.filter(q=>q.pick===q.ans).length;
  DB.sessions.unshift({d:Date.now(),title:QZ.title,el:Math.round(QZ.el),n,ok,qs:QZ.qs.map(q=>Object.assign(slim(q),{pick:q.pick,flag:q.flag}))});
  DB.sessions=DB.sessions.slice(0,8); save(); QZ=null; keepQZ(); location.replace('#/result/0'); }
const optHTML=(q,k)=>q.optFig?`<span class="of">${q.optFig[k]}</span>`:`<span>${fx(q.opts[k])}</span>`;
const expHTML=(q,open)=>`<details class="exp" ${open?'open':''}><summary>${ic('lightbulb')}<span>เฉลยและคำอธิบาย</span>${ic('chevron_right')}</summary><ol>${[].concat(q.exp||[]).map(e=>`<li>${fx(e)}</li>`).join('')}</ol></details>`;
function vQuiz(v){
  if(!QZ){ location.replace('#/exam'); return; }
  document.title='ทำข้อสอบ · Biochem'; const n=QZ.qs.length, q=QZ.qs[QZ.i], inst=QZ.mode==='instant', locked=inst&&q.pick!=null, done=QZ.qs.filter(x=>x.pick!=null).length, lastQ=QZ.i===n-1;
  const cls=k=>locked?(k===q.ans?'ok':k===q.pick?'no':''):(k===q.pick?'sel':'');
  v.innerHTML=`<div class="qz"><div class="hd"><div class="r"><button class="ibtn" data-act="exit" aria-label="ออกจากข้อสอบ" title="ออกจากข้อสอบ">${ic('x')}</button>
     <div class="ct">ข้อ <b class="num">${QZ.i+1}</b> จาก <span class="num">${n}</span> · ${esc(QZ.title)}</div>
     <button class="tm ${QZ.timer?'':'off'}" data-act="timer" aria-label="ซ่อนหรือแสดงเวลา" title="ซ่อนหรือแสดงเวลา">${ic('timer')}<span id="tm">${clock(QZ.el)}</span></button></div>
     <div class="bar"><i style="width:${pct(done,n)}%"></i></div></div>
   <div class="bd"><div class="card q"><div class="tg2"><span class="tag">บทที่ ${TP[q.t]?TP[q.t].ch:''}</span><span class="tag g">${esc(TP[q.t]?TP[q.t].n:'PHB104')}</span><span class="tag g">${BIO_LV[q.lv]||'คละ'}</span>${q.flag?`<span class="tag wn">${ic('flag')}ติดธงไว้</span>`:''}</div>
     <p class="stem">${fx(q.stem)}</p>${q.fig?`<div class="fig">${q.fig}</div>`:''}
     <div class="opts" role="radiogroup" aria-label="ตัวเลือก">${q.opts.map((o,k)=>`<button class="opt ${q.optFig?'figo':''} ${cls(k)}" role="radio" aria-checked="${k===q.pick}" ${q.optFig?`aria-label="ตัวเลือก ${'ABCD'[k]}"`:''} data-act="pick" data-v="${k}" ${locked?'disabled':''}><span class="k">${'ABCDE'[k]}</span>${optHTML(q,k)}${ic(k===q.ans?'circle_check':'circle_x')}</button>`).join('')}</div>
     ${locked?expHTML(q,true):''}</div>
     <div class="dots" aria-label="ข้ามไปข้อ">${QZ.qs.map((x,k)=>`<button class="${k===QZ.i?'cur ':''}${inst&&x.pick!=null?(x.pick===x.ans?'ok':'no'):x.pick!=null?'dn':''}${x.flag?' fg':''}" data-act="jump" data-v="${k}" aria-label="ข้อ ${k+1}">${k+1}</button>`).join('')}</div></div>
   <div class="ft"><div class="r"><button class="btn sec flag ${q.flag?'on':''}" data-act="flag" aria-pressed="${q.flag}">${ic('flag')}<span class="lb">ติดธงทบทวน</span></button><span class="sp"></span>
     <button class="btn sec" data-act="prev" ${QZ.i?'':'disabled'}>${ic('chevron_left')}<span class="lb">ก่อนหน้า</span></button>
     <button class="btn" data-act="${lastQ?'submit':'next'}">${lastQ?'ส่งข้อสอบ':'ถัดไป'}${ic(lastQ?'check':'chevron_right')}</button></div></div></div>`;
  clearInterval(tmr); let t0=performance.now();
  tmr=setInterval(()=>{ if(!QZ||document.hidden){ t0=performance.now(); return; } const t=performance.now(); QZ.el+=(t-t0)/1000; t0=t; const e=$('#tm'); if(e) e.textContent=clock(QZ.el); if(Math.round(QZ.el)%5===0) keepQZ(); },1000);
  cleanup.push(()=>clearInterval(tmr));
}

/* ---------- ผลสอบ ---------- */
let RF='all';
function vResult(v,idx){
  const R=DB.sessions[+idx||0]; if(!R){ location.replace('#/exam'); return; }
  document.title='ผลสอบ · Biochem'; const p=pct(R.ok,R.n), by={};
  R.qs.forEach(q=>{ const b=by[q.t]||(by[q.t]=[0,0]); b[0]++; if(q.pick===q.ans) b[1]++; });
  const nBad=R.qs.filter(q=>q.pick!==q.ans).length, nFl=R.qs.filter(q=>q.flag).length;
  const list=R.qs.map((q,i)=>[q,i]).filter(([q])=>RF==='all'||(RF==='bad'&&q.pick!==q.ans)||(RF==='flag'&&q.flag));
  const av=(q,k)=>q.optFig?`<span class="of">${q.optFig[k]}</span><span class="num" style="font-size:12.5px;color:var(--ink-2)">${fx(q.opts[k])}</span>`:fx(q.opts[k]);
  v.innerHTML=top('exam','PHB104 · ผลสอบ')+`<div class="res"><div class="row" style="margin:6px 0 16px"><a class="btn sec sm" href="#/exam">${ic('arrow_left')}กลับหน้าข้อสอบ</a></div>
   <div class="card score">${ring(p,148,p>=70?'ok':p<50?'no':'')}<div><span class="tag">PHB104 · ผลสอบ</span><h1 style="margin-top:8px">${p>=80?'ยอดเยี่ยม ทำได้ดีมาก':p>=60?'ผ่านเกณฑ์ ทบทวนอีกนิด':'ยังต้องทบทวนเพิ่ม'}</h1><p class="sub">${esc(R.title)} · ${new Date(R.d).toLocaleDateString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
     <div class="kp"><div><small>คะแนน</small><b>${R.ok} / ${R.n}</b></div><div><small>เวลาที่ใช้</small><b>${clock(R.el)}</b></div><div><small>เฉลี่ยต่อข้อ</small><b>${Math.round(R.el/R.n)} วิ</b></div></div></div></div>
   <div class="card" style="margin-top:16px"><h2 style="margin-bottom:14px">ความแม่นยำรายหัวข้อ</h2><div class="brk">${Object.keys(by).map(t=>{ const b=by[t], a=pct(b[1],b[0]); return `<div class="ln"><span>${esc(TP[t]?TP[t].n:t)}</span><div class="bar ${a>=70?'ok':''}"><i style="width:${a}%"></i></div><b>${b[1]}/${b[0]}</b></div>`; }).join('')}</div>
     <div class="row" style="margin-top:20px;flex-wrap:wrap"><button class="btn" data-act="start" data-v="${nBad?'wrong':'mock'}">${ic('rotate_ccw')}${nBad?'ทำข้อที่ผิดอีกครั้ง':'ทำชุดใหม่'}</button><a class="btn sec" href="#/exam">เลือกชุดอื่น</a></div></div>
   <div class="sec-h"><div><h2>ทบทวนรายข้อ</h2><p>ดูคำตอบของตัวเองเทียบกับคำตอบที่ถูก พร้อมคำอธิบาย</p></div></div>
   <div class="pills" style="display:flex">${[['all','ทั้งหมด',R.n],['bad','ข้อที่ผิด',nBad],['flag','ติดธง',nFl]].map(x=>`<button class="pill ${RF===x[0]?'on':''}" data-act="rf" data-v="${x[0]}" aria-pressed="${RF===x[0]}">${x[1]} <span class="num">${x[2]}</span></button>`).join('')}</div>
   ${list.length?list.map(([q,i])=>{ const ok=q.pick===q.ans; return `<div class="card rv"><div class="hdr"><span class="tag g num">ข้อ ${i+1}</span><span class="tag">${esc(TP[q.t]?TP[q.t].n:'PHB104')}</span><span class="tag ${ok?'ok':'no'}">${ic(ok?'check':'x')}${ok?'ถูก':q.pick==null?'ไม่ได้ตอบ':'ผิด'}</span>${q.flag?`<span class="tag wn">${ic('flag')}ติดธง</span>`:''}</div>
     <p class="stem">${fx(q.stem)}</p>${q.fig?`<div class="fig">${q.fig}</div>`:''}<div class="ans"><div class="u ${ok?'ok':'no'}"><small>คำตอบของคุณ</small>${q.pick==null?'ไม่ได้ตอบ':av(q,q.pick)}</div><div class="c"><small>คำตอบที่ถูก</small>${av(q,q.ans)}</div></div>${expHTML(q,false)}</div>`; }).join(''):`<div class="card empty" style="margin-top:12px">${ic('circle_check')}<h3>ไม่มีข้อในกลุ่มนี้</h3></div>`}</div>`;
}

/* ---------- ตัวจัดการ ---------- */
function render(){
  cleanup.forEach(f=>f()); cleanup=[]; const r=route(), v=$('#app'); let keep=false;
  if(r[0]==='book') vBook(v,r[1],r[2]); else if(r[0]==='exam'){ vExam(v); } else if(r[0]==='quiz'){ vQuiz(v); keep=render.last==='quiz'; } else if(r[0]==='result') vResult(v,r[1]); else vHome(v);
  if(r[0]!=='book'&&!keep&&!render.stay) scrollTo(0,0); render.last=r[0]||''; render.stay=false;
}
function confirmExit(){ const d=document.createElement('div'); d.className='dlg'; d.innerHTML=`<div class="card bx" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t"><h2 id="dlg-t">ออกจากข้อสอบ</h2><p>คำตอบที่ทำไว้ในชุดนี้จะไม่ถูกบันทึกเป็นผลสอบ</p><div class="row"><button class="btn sec" data-n>ทำต่อ</button><button class="btn" data-y>ออกจากข้อสอบ</button></div></div>`;
  document.body.appendChild(d); d.querySelector('[data-n]').focus();
  d.onclick=e=>{ if(e.target.closest('[data-y]')){ d.remove(); QZ.qs.forEach(record); QZ=null; keepQZ(); location.hash='#/exam'; } else if(e.target.closest('[data-n]')||e.target===d) d.remove(); }; }
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b) return; const a=b.dataset.act, val=b.dataset.v;
  if(a==='start') startQuiz(val);
  else if(a==='go') location.hash=val;
  else if(a==='theme'){ const d=document.documentElement, t=d.dataset.theme==='dark'?'light':'dark'; d.dataset.theme=t; try{ localStorage.setItem('payap.theme',t); }catch(e){} render.stay=true; render(); }
  else if(a==='wide'){ DB.wide=!DB.wide; save(); const r=$('.bx-rd'); if(r) r.classList.toggle('wide',DB.wide); }
  else if(a==='pgo'){ if(vBook.jump) vBook.jump(+val); }
  else if(a==='cfg'){ const k=b.dataset.k; if(val==='toggle'){ if(k==='mode') DB.cfg.mode=DB.cfg.mode==='instant'?'end':'instant'; else DB.cfg[k]=!DB.cfg[k]; } else DB.cfg[k]=k==='n'?+val:val; save(); render.stay=true; render(); }
  else if(a==='rf'){ RF=val; render.stay=true; render(); }
  else if(!QZ) return;
  else if(a==='pick'){ const q=QZ.qs[QZ.i]; if(QZ.mode==='instant'&&q.pick!=null) return; q.pick=+val; if(QZ.mode==='instant') record(q); keepQZ(); render(); if(QZ.mode==='instant'){ const x=$('.exp'); if(x&&x.getBoundingClientRect().bottom>innerHeight-90) x.scrollIntoView({block:'center',behavior:'smooth'}); } }
  else if(a==='next'){ QZ.i=Math.min(QZ.qs.length-1,QZ.i+1); keepQZ(); render.last=''; render(); }
  else if(a==='prev'){ QZ.i=Math.max(0,QZ.i-1); keepQZ(); render.last=''; render(); }
  else if(a==='jump'){ QZ.i=+val; keepQZ(); render.last=''; render(); }
  else if(a==='flag'){ const q=QZ.qs[QZ.i]; q.flag=!q.flag; keepQZ(); render(); }
  else if(a==='timer'){ QZ.timer=!QZ.timer; keepQZ(); b.classList.toggle('off',!QZ.timer); }
  else if(a==='submit'){ const left=QZ.qs.filter(x=>x.pick==null).length; if(left&&!submitAsk.ok){ submitAsk(left); return; } submitAsk.ok=false; finishQuiz(); }
  else if(a==='exit') confirmExit();
});
function submitAsk(left){ const d=document.createElement('div'); d.className='dlg'; d.innerHTML=`<div class="card bx" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t"><h2 id="dlg-t">ยังไม่ได้ตอบ ${left} ข้อ</h2><p>ส่งข้อสอบตอนนี้ ข้อที่ยังไม่ได้ตอบจะนับเป็นผิด</p><div class="row"><button class="btn sec" data-n>กลับไปทำต่อ</button><button class="btn" data-y>ส่งข้อสอบ</button></div></div>`;
  document.body.appendChild(d); d.querySelector('[data-n]').focus();
  d.onclick=e=>{ if(e.target.closest('[data-y]')){ d.remove(); finishQuiz(); } else if(e.target.closest('[data-n]')||e.target===d) d.remove(); }; }
document.addEventListener('keydown',e=>{ if(route()[0]!=='quiz'||!QZ||e.metaKey||e.ctrlKey||e.altKey||document.querySelector('.dlg')) return;
  const k=e.key.toLowerCase(), i='abcd'.indexOf(k)>=0?'abcd'.indexOf(k):'1234'.indexOf(k); const q=QZ.qs[QZ.i];
  if(i>=0&&i<q.opts.length&&k.length===1){ const o=$$('.opt')[i]; if(o&&!o.disabled) o.click(); }
  else if(e.key==='ArrowRight'){ const n=$('[data-act="next"]'); if(n) n.click(); } else if(e.key==='ArrowLeft'){ const p=$('[data-act="prev"]'); if(p&&!p.disabled) p.click(); } });
addEventListener('hashchange',render);
/* ลิงก์ตรงจากหน้าหลัก เช่น bio/?go=exam หรือ bio/?go=book2 */
try{ const g=new URLSearchParams(location.search).get('go'); if(g){ const m={book1:'#/book/1',book2:'#/book/2',exam:'#/exam',fa:'#/exam'}; history.replaceState(null,'',location.pathname+(m[g]||'#/')); } }catch(e){}
render();
})();
