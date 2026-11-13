/* PAYAPkuytok · หน้าเว็บหลัก (แดชบอร์ด คลังสรุป ข้อสอบ บุ๊กมาร์ก ความก้าวหน้า) */
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tx=t=>chemTxt(esc(t));
const J=k=>{try{return JSON.parse(localStorage.getItem(k))||{};}catch(e){return {};}};
const pad=n=>String(n).padStart(2,'0');
const dkey=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>dkey(new Date());
const pct=(a,b)=>b?Math.round(a/b*100):0;
const clock=s=>pad(Math.floor(s/60))+':'+pad(Math.floor(s%60));
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- สถานะ ---------- */
const KEY='payap.v1';
let DB=Object.assign({act:[],days:{},chem:{},bm:{sec:[],q:[]},rd:{fs:17,lh:1.75,warm:false},last:null,mini:false,cfg:{}},J(KEY));
DB.chem=Object.assign({tp:{},wrong:[],read:{},sessions:[],ans:0,ok:0},DB.chem);
DB.bm=Object.assign({sec:[],q:[]},DB.bm); DB.rd=Object.assign({fs:17,lh:1.75,warm:false},DB.rd);
DB.cfg=Object.assign({topic:'all',lv:'mix',n:10,mode:'instant',timer:true},DB.cfg);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){}};
if(!DB.act.includes(today())){ DB.act.push(today()); DB.act=DB.act.slice(-400); save(); }
let FILTER='all';
function streak(){ let n=0; const d=new Date(); while(DB.act.includes(dkey(d))){ n++; d.setDate(d.getDate()-1); } return n; }

/* ---------- วิชา ---------- */
const SUBJ={
  anatomy:{id:'anatomy',code:'BI112',name:'Anatomy',th:'กายวิภาคศาสตร์',en:'Human Anatomy',img:'ui/img/b-an4.jpg',
    desc:'ทบทวนกายวิภาคศาสตร์ บทที่ 1 ถึง 7 ตั้งแต่บทนำ เนื้อเยื่อ กระดูก กล้ามเนื้อ ระบบประสาท จนถึงอวัยวะรับความรู้สึกพิเศษ พร้อมโจทย์สุ่มไม่จำกัดและเฉลยละเอียด',
    ch:7,chU:'บท',pages:117,qz:'โจทย์สุ่มไม่จำกัด',read:'anatomy/?tab=book',exam:'anatomy/?tab=learn',home:'anatomy/'},
  calc:{id:'calc',code:'PHT111',name:'calc',th:'การคำนวณทางเภสัชกรรม',en:'Pharmaceutical Calculations',img:'ui/img/b-calc1.jpg',
    desc:'สรุปและฝึกคำนวณทางเภสัชกรรม บทที่ 1 ระบบเลขโรมันและเลขนัยสำคัญ มีทั้งโจทย์ปรนัยและโจทย์เติมคำตอบ พร้อมวิธีคิดทีละขั้น',
    ch:1,chU:'บท',pages:16,qz:'ปรนัยและเติมคำตอบ',read:'calc/?tab=book',exam:'calc/?tab=quiz',home:'calc/'},
  chem:{id:'chem',code:'PHB102',name:'PhyChem',th:'ปริมาณสารสัมพันธ์',en:'Stoichiometry',img:'ui/img/b-chem1.jpg',
    desc:'เคมีเชิงฟิสิกส์ บทที่ 1 ปริมาณสารสัมพันธ์ ครบทั้งโมล ความเข้มข้น สูตรเคมี การดุลสมการ สารกำหนดปริมาณ และ %yield ข้อสอบเป็นปรนัยทั้งหมด',
    ch:1,chU:'บท',pages:28,qz:'ปรนัยล้วน สุ่มได้ไม่จำกัด',read:'#/pages/chem',exam:'#/exams',home:'#/library'}
};
const ORDER=['anatomy','calc','chem'];
const AN_CH=[['บทนำกายวิภาคศาสตร์','Introduction to Human Anatomy'],['เนื้อเยื่อและระบบปกคลุมร่างกาย','Tissues and Integumentary System'],['ระบบกระดูกโครงร่าง','The Skeletal System'],['ระบบกล้ามเนื้อ','The Muscular System'],['ระบบประสาท I','The Nervous System I'],['ระบบประสาท II','The Nervous System II'],['อวัยวะรับความรู้สึกพิเศษ','The Special Sense Organs']];
const AN_PG=[3,11,29,57,77,94,105];
const SEC_EN={intro:'Introduction',mol:'The Mole',conc:'Concentration of Solutions',formula:'Chemical Formula',equation:'Balancing Equations',reaction:'Limiting Reagent',yield:'Percent Yield'};
const CREDITS=window.PHOTO_CREDITS||[];

function stats(){
  const a=J('anatomeow.v1'), c=J('jinoon.v1'), z=c.qz||{}, ch=DB.chem;
  const rdA=Math.max(0,((a.bookPage||1)-1)/116), rdC=Math.max(0,((c.bookPage||1)-1)/15), rdX=Math.max(0,((ch.pgMax||1)-1)/27);
  const mk=(ans,ok,rd,goal)=>({ans:ans||0,ok:ok||0,acc:ans?Math.round(ok/ans*100):null,rd:Math.round(rd*100),done:Math.round((rd*.5+Math.min(1,(ans||0)/goal)*.5)*100),
    ready:Math.round((rd*.3+(ans?ok/ans:0)*Math.min(1,(ans||0)/goal)*.7)*100)});
  return {anatomy:mk(a.answered,a.correct,rdA,200),calc:mk(z.ans,z.ok,rdC,60),chem:mk(ch.ans,ch.ok,rdX,80)};
}
const readiness=st=>Math.round(ORDER.reduce((s,k)=>s+st[k].ready,0)/ORDER.length);
const show=id=>FILTER==='all'||FILTER===id;

/* ---------- ชิ้นส่วน ---------- */
function ring(p,size,cls,label){ const r=(size-10)/2, c=2*Math.PI*r;
  return `<div class="ring ${cls||''}" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle class="tr" cx="${size/2}" cy="${size/2}" r="${r}"/><circle class="fg" cx="${size/2}" cy="${size/2}" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c*(1-p/100)).toFixed(1)}"/></svg><b style="font-size:${Math.round(size*.24)}px">${label!=null?label:p+'<small>%</small>'}</b></div>`; }
const pills=()=>{ const cnt=k=>k==='all'?12:k==='anatomy'?8:2;
  return `<div class="grp" role="tablist" aria-label="เลือกกลุ่มหนังสือ"><span class="gl">${ic('layers')}เลือกกลุ่มหนังสือ</span><div class="gt">`+[['all','ทุกวิชา','รวมทั้งหมด']].concat(ORDER.map(k=>[k,SUBJ[k].name,SUBJ[k].code])).map(([k,n,c])=>`<button class="gb ${FILTER===k?'on':''}" data-act="filter" data-v="${k}" role="tab" aria-selected="${FILTER===k}"><b>${n}</b><small>${c} · ${cnt(k)} เล่ม</small></button>`).join('')+`</div></div>`; };
function toast(t){ $$('.toast').forEach(x=>x.remove()); const d=document.createElement('div'); d.className='toast'; d.setAttribute('role','status'); d.textContent=t; document.body.appendChild(d); setTimeout(()=>d.remove(),2200); }
function confirmDlg(title,msg,yes,cb){ const d=document.createElement('div'); d.className='dlg'; d.innerHTML=`<div class="card bx" role="alertdialog" aria-modal="true"><h2>${esc(title)}</h2><p>${esc(msg)}</p><div class="row"><button class="btn sec" data-n>ยกเลิก</button><button class="btn" data-y>${esc(yes)}</button></div></div>`;
  document.body.appendChild(d); d.addEventListener('click',e=>{ if(e.target===d||e.target.closest('[data-n]')) d.remove(); else if(e.target.closest('[data-y]')){ d.remove(); cb(); } }); $('[data-y]',d).focus(); }
const expHTML=(q,open)=>`<details class="exp" ${open?'open':''}><summary>${ic('lightbulb')}<span>เฉลยละเอียด (Explanation)</span>${ic('chevron_right')}</summary><ol>${[].concat(q.exp||[]).map(e=>`<li>${chemTxt(e)}</li>`).join('')}</ol>${CHEM_TOPICS[q.t]?`<p class="src">อ้างอิงหนังสือหน้า ${CHEM_TOPICS[q.t].pg} · <a href="#/pages/chem/${CHEM_TOPICS[q.t].pg}">เปิดอ่านหน้านี้</a></p>`:''}</details>`;

/* ---------- โครงหลัก ---------- */
const NAV=[['','house','หน้าหลัก','Overview'],['library','library','อ่านหนังสือ','Study Library'],['exams','clipboard_check','ทำข้อสอบ','Practice Exams'],['bookmarks','bookmark','บุ๊กมาร์ก','Saved Bookmarks'],['progress','chart_no_axes_column','ความก้าวหน้า','Progress & Analytics']];
function shell(){
  $('#app').innerHTML=`<aside class="side" aria-label="เมนูหลัก">
    <a class="brand" href="#/" aria-label="PAYAPkuytok หน้าหลัก"><span class="lg">${ic('book_open_check')}</span><b>PAYAP<i>kuytok</i></b></a>
    <nav class="nav">${NAV.map(n=>`<a href="#/${n[0]}" data-nav="${n[0]}" title="${n[2]}">${ic(n[1])}<span>${n[2]}<small>${n[3]}</small></span></a>`).join('')}</nav>
    <div class="sp"></div><p class="cred">สรุปและข้อสอบ 3 วิชา<br>BI112 · PHT111 · PHB102</p>
    <button class="col" data-act="mini" title="ย่อหรือขยายเมนู">${ic('panel_left')}<span>ย่อเมนู</span></button></aside>
  <div class="main"><header class="top">
    <button class="search" data-act="pal" aria-label="ค้นหา">${ic('search')}<span>ค้นหาบทเรียน หัวข้อ หรือชุดข้อสอบ</span><kbd>⌘K</kbd></button>
    <span class="grow"></span>
    <button class="ibtn" data-act="theme" aria-label="สลับโหมดสว่างและมืด" title="สลับโหมดสว่างและมืด">${ic('moon')}</button>
    <a class="avatar" href="#/progress" aria-label="ความก้าวหน้าของฉัน">${ic('user')}</a></header>
    <main id="view" class="page"></main></div>
  <nav class="tabbar" aria-label="เมนูหลัก">${NAV.map(n=>`<a href="#/${n[0]}" data-nav="${n[0]}">${ic(n[1])}<span>${n[2]}</span></a>`).join('')}</nav>`;
  $('#app').classList.toggle('mini',!!DB.mini);
  addEventListener('scroll',()=>{ const t=$('.top'); if(t) t.classList.toggle('sc',scrollY>8); },{passive:true});
}
function setTheme(t){ document.documentElement.dataset.theme=t; try{localStorage.setItem('payap.theme',t);}catch(e){} const b=$('[data-act="theme"]'); if(b) b.innerHTML=ic(t==='dark'?'sun':'moon'); const m=$('meta[name="theme-color"]'); if(m) m.content=t==='dark'?'#0B1220':'#F8FAFC'; }

/* ---------- เส้นทาง ---------- */
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0].split('/').map(decodeURIComponent);
let shelfApi=null, cleanup=[], shelfAt=-1;
function render(){
  cleanup.forEach(f=>f()); cleanup=[]; if(shelfApi){ shelfAt=render.reset?-1:shelfApi.index(); shelfApi.destroy(); shelfApi=null; } render.reset=false;
  const [r,a,b]=route(); const V={'':vHome,library:vLibrary,exams:vExams,bookmarks:vBookmarks,progress:vProgress,read:vRead,pages:vPages,quiz:vQuiz,result:vResult};
  const fn=V[r]||vHome, focus=['read','pages','quiz','result'].includes(r);
  document.body.classList.toggle('focus',focus);
  $$('[data-nav]').forEach(x=>x.classList.toggle('on',x.dataset.nav===(V[r]?r:'')));
  const v=$('#view'); v.style.animation='none'; void v.offsetWidth; v.style.animation='';
  const after=fn(v,a,b); if(typeof after==='function') after();
  if(!render.keep) scrollTo(0,0); render.keep=false;
  document.title=(v.dataset.title?v.dataset.title+' · ':'')+'PAYAPkuytok';
}
const rerender=()=>{ render.keep=true; render(); };

/* ---------- หน้าหลัก ---------- */
const B='ui/img/b-';
function books(){
  const L=[];
  AN_CH.forEach((c,i)=>L.push({s:'anatomy',code:'BI112',no:pad(i+1),t:c[0],en:c[1],kind:'บทที่ '+(i+1),img:B+'an'+(i+1)+'.jpg',read:'anatomy/?tab=book&page='+AN_PG[i],exam:'anatomy/?tab=learn&ch='+(i+1)}));
  L.push({s:'anatomy',code:'BI112',no:'Q',t:'ข้อสอบกายวิภาคศาสตร์',short:'ข้อสอบ Anatomy',en:'Anatomy question bank',kind:'ข้อสอบ',img:B+'anq.jpg',read:'anatomy/?tab=book',exam:'anatomy/?tab=learn',q:1});
  L.push({s:'calc',code:'PHT111',no:'01',t:'เลขโรมันและเลขนัยสำคัญ',short:'เลขโรมัน เลขนัยสำคัญ',en:'Roman numerals & Significant figures',kind:'บทที่ 1',img:B+'calc1.jpg',read:'calc/?tab=book',exam:'calc/?tab=quiz'});
  L.push({s:'calc',code:'PHT111',no:'Q',t:'ข้อสอบคำนวณเภสัช',short:'ข้อสอบ calc',en:'Pharm calc question bank',kind:'ข้อสอบ',img:B+'calcq.jpg',read:'calc/?tab=book',exam:'calc/?tab=quiz',q:1});
  L.push({s:'chem',code:'PHB102',no:'01',t:'ปริมาณสารสัมพันธ์ บทที่ 1',short:'ปริมาณสารสัมพันธ์',en:'Stoichiometry · Chapter 1',kind:'บทที่ 1',img:B+'chem1.jpg',read:'#/pages/chem',exam:'#/exams'});
  L.push({s:'chem',code:'PHB102',no:'Q',t:'ข้อสอบปริมาณสารสัมพันธ์',short:'ข้อสอบ PhyChem',en:'Stoichiometry question bank',kind:'ข้อสอบ',img:B+'chemq.jpg',read:'#/pages/chem',exam:'#/exams',q:1});
  return L.filter(x=>show(x.s));
}
function contCard(st){
  const l=DB.last; let s,t,sub,href,p,btn='อ่านต่อ';
  if(l&&l.k==='read'&&CHEM_SECTIONS.find(x=>x.id===l.sec)){ const c=CHEM_SECTIONS.find(x=>x.id===l.sec); s=SUBJ.chem; t=c.t; sub='ปริมาณสารสัมพันธ์ · หัวข้อ '+(CHEM_SECTIONS.indexOf(c)+1)+' จาก '+CHEM_SECTIONS.length; href='#/read/chem/'+c.id; p=st.chem.rd; }
  else if(l&&l.k==='pages'){ s=SUBJ.chem; t='ปริมาณสารสัมพันธ์ บทที่ 1'; sub='PHB102 · อ่านถึงหน้า '+(DB.chem.pg||1)+' จาก 28'; href='#/pages/chem'; p=st.chem.rd; }
  else if(l&&l.k==='app'&&SUBJ[l.id]){ s=SUBJ[l.id]; t=s.th; sub=s.code+' · '+s.name; href=l.href||s.read; p=st[l.id].done; btn=l.mode==='exam'?'ทำข้อสอบต่อ':'อ่านต่อ'; }
  else { s=SUBJ.chem; t='ปริมาณสารสัมพันธ์ บทที่ 1'; sub='วิชาใหม่ · PHB102 · หนังสือ 28 หน้า'; href='#/pages/chem'; p=st.chem.rd; btn='เริ่มอ่าน'; }
  return `<div class="card cont"><div class="th" style="background-image:url(${s.img})"></div><div><span class="tag">${s.code}</span><h3>${esc(t)}</h3><p class="sub" style="font-size:13.5px">${esc(sub)}</p><div class="bar"><i style="width:${p}%"></i></div><p class="pc">คืบหน้า <b class="num">${p}%</b></p></div>
    <a class="btn lg" href="${href}" ${/^#/.test(href)?'':`data-app="${s.id}"`}>${ic('book_open')}${btn}</a></div>`;
}
function subjCard(k,st){ const s=SUBJ[k], x=st[k];
  return `<article class="card subj hov"><div class="cv" style="background-image:url(${s.img})"><span class="tag">${s.code}</span></div><div class="bd">
    <h2>${esc(s.th)}</h2><p>${esc(s.name)} · ${esc(s.en)}</p>
    <div class="mt"><span>${ic('layers')}${s.ch} ${s.chU}</span><span>${ic('file_text')}${s.pages} หน้า</span><span>${ic('clipboard_check')}${esc(s.qz)}</span></div>
    <div class="pr"><div class="bar"><i style="width:${x.done}%"></i></div><b>${x.done}%</b></div>
    <div class="ac"><a class="btn sec sm" href="${s.read}" data-app="${k}" data-mode="read">${ic('book_open')}อ่านหนังสือ</a><a class="btn sm" href="${s.exam}" data-app="${k}" data-mode="exam">${ic('clipboard_check')}ทำข้อสอบ</a></div></div></article>`; }
function vHome(v){
  v.dataset.title='';
  const st=stats(), sk=streak(), rd=readiness(st), h=new Date().getHours(), hi=h<12?'สวัสดีตอนเช้า':h<17?'สวัสดีตอนบ่าย':'สวัสดีตอนเย็น';
  const L=books();
  v.innerHTML=`<section class="hello"><div class="card hi"><span class="eyebrow">PAYAPkuytok</span><h1>${hi}</h1><p>พร้อมอ่านต่อหรือยัง อ่านสรุปให้เข้าใจ แล้วลองทำข้อสอบได้ทันที ทุกวิชาอยู่ในที่เดียว</p></div>
    <div class="card stat"><span class="fl">${ic('flame')}</span><div><div class="k">อ่านต่อเนื่อง</div><div class="v">${sk}<small>วัน</small></div></div></div>
    <div class="card stat">${ring(rd,58)}<div><div class="k">ความพร้อมสอบ</div><div class="v" style="font-size:15px;font-family:var(--f);font-weight:500">${rd>=80?'พร้อมมาก':rd>=50?'กำลังไปได้ดี':rd>0?'เริ่มต้นแล้ว':'ยังไม่เริ่ม'}</div></div></div></section>
  ${pills()}
  <section class="shelf" id="shelf" tabindex="0"></section>
  <div class="sec-h"><div><h2>เรียนต่อจากเดิม</h2><p>Continue Studying</p></div></div>${contCard(st)}
  <div class="sec-h"><div><h2>วิชาทั้งหมด</h2><p>${ORDER.filter(show).length} วิชา · เลือกอ่านสรุปหรือทำข้อสอบได้เลย</p></div><a href="#/library">ดูคลังหนังสือ${ic('chevron_right')}</a></div>
  <div class="grid3">${ORDER.filter(show).map(k=>subjCard(k,st)).join('')}</div>
  ${CREDITS.length?`<details class="credits"><summary>ที่มาของภาพปก (ภาพถ่ายจริงจาก Wikimedia Commons)</summary><p>${CREDITS.map(c=>`<a href="${c.url}" target="_blank" rel="noopener">${esc(c.title)}</a> โดย ${esc(c.by)} (${esc(c.lic)})`).join(' · ')}</p></details>`:''}`;
  return ()=>{ const el=$('#shelf'); if(!el||!L.length) return;
    shelfApi=mountShelf(el,L,{start:shelfAt<0?(FILTER==='all'?Math.max(0,L.findIndex(x=>x.s==='chem')):0):Math.min(shelfAt,L.length-1),intro:!vHome.seen,onOpen:(i,rect)=>openSheet(sheetHTML(L[i],L,st),rect,()=>shelfApi&&shelfApi.rect())}); vHome.seen=true; };
}
function sheetHTML(it,L,st){
  const s=SUBJ[it.s], x=st[it.s], sib=L.filter(b=>b.s===it.s), cr=CREDITS.find(c=>c.img===it.img);
  const circ=[[200,250,330,0],[90,120,260,120],[320,400,280,220],[330,90,240,330],[70,420,250,420]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="0" data-r="${c[2]}" data-d="${c[3]}" fill="#fff"/>`).join('');
  const ext=h=>/^#/.test(h)?'':`data-app="${it.s}"`;
  return `<div class="in"><div class="tb"><span class="ln"><span>${s.code} — ${esc(it.kind)}</span></span><button class="cl" data-close>${ic('x')}ปิด</button></div>
  <div><span class="ln"><span class="tag">${esc(s.th)}</span></span>
    <h1><span class="ln"><span>${esc(it.t)}</span></span></h1><span class="ln"><span class="en">${esc(it.en||s.en)}</span></span>
    <div class="rule"></div><span class="ln"><p class="ds">${esc(s.desc)}</p></span>
    <span class="ln"><div class="facts"><div><small>เนื้อหา</small><b class="num">${s.ch}<span>${s.chU}</span></b></div><div><small>สมุดสรุป</small><b class="num">${s.pages}<span>หน้า</span></b></div><div><small>ความแม่นยำ</small><b class="num">${x.acc==null?'–':x.acc}<span>${x.acc==null?'ยังไม่ได้ทำ':'%'}</span></b></div></div></span>
    <span class="ln"><div class="go"><a class="btn lg ${it.q?'sec':''}" href="${it.read}" ${ext(it.read)} data-mode="read" style="order:${it.q?2:1}">${ic('book_open')}อ่านหนังสือ</a><a class="btn lg ${it.q?'':'sec'}" href="${it.exam}" ${ext(it.exam)} data-mode="exam" style="order:${it.q?1:2}">${ic('clipboard_check')}ทำข้อสอบ</a></div></span>
    <ul class="toc">${sib.map(b=>`<li><a href="${b.q?b.exam:b.read}" ${ext(b.q?b.exam:b.read)}><span class="n num">${esc(b.no)}</span><span>${esc(b.t)}</span>${ic('arrow_right')}</a></li>`).join('')}</ul></div>
  <div class="ps"><svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="inkf" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".011 .017" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="110" xChannelSelector="R" yChannelSelector="G"/></filter><mask id="inkm" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="500"><g filter="url(#inkf)">${circ}</g></mask></defs>
    <image href="${it.img}" x="0" y="0" width="400" height="500" preserveAspectRatio="xMidYMid slice" mask="url(#inkm)"/></svg>${cr?`<span class="cr">ภาพ: ${esc(cr.by)} · ${esc(cr.lic)}</span>`:''}</div></div>`;
}

/* ---------- คลังสรุป ---------- */
function vLibrary(v){
  v.dataset.title='อ่านหนังสือ'; const st=stats(); let h=`${pills()}<div class="ph"><h1>คลังหนังสือ</h1><p>Study Library · เปิดอ่านหนังสือสรุปฉบับ PDF ของแต่ละวิชา เลือกข้ามไปบทหรือหัวข้อที่ต้องการได้</p></div>`;
  const gh=(k,extra)=>{ const s=SUBJ[k]; return `<div class="gh"><div class="th" style="background-image:url(${s.img})"></div><div class="grow"><div class="row" style="gap:8px"><h2>${esc(s.th)}</h2><span class="tag">${s.code}</span></div><p>${esc(s.name)} · ${s.ch} ${s.chU} · ${s.pages} หน้า · อ่านแล้ว ${st[k].rd}%</p></div>${extra||''}</div>`; };
  if(show('anatomy')) h+=`<section class="group">${gh('anatomy',`<a class="btn sec sm" href="anatomy/?tab=book" data-app="anatomy" data-mode="read">${ic('book_open')}เปิดหนังสือ</a>`)}<div class="lst">${AN_CH.map((c,i)=>`<a class="item" href="anatomy/?tab=book&page=${AN_PG[i]}" data-app="anatomy" data-mode="read"><span class="n">${i+1}</span><div class="grow"><h3>${c[0]}</h3><p>${c[1]} · เริ่มหน้า ${AN_PG[i]}</p></div>${ic('chevron_right','ch')}</a>`).join('')}</div></section>`;
  if(show('calc')) h+=`<section class="group">${gh('calc')}<div class="lst"><a class="item" href="calc/?tab=book" data-app="calc" data-mode="read"><span class="n">1</span><div class="grow"><h3>พื้นฐานที่เกี่ยวข้องกับการคำนวณทางเภสัชกรรม</h3><p>Roman numerals และ Significant figures · 16 หน้า</p></div>${ic('chevron_right','ch')}</a></div></section>`;
  if(show('chem')) h+=`<section class="group">${gh('chem',`<a class="btn sec sm" href="#/pages/chem">${ic('book_open')}เปิดหนังสือ</a>`)}<div class="lst">
    <a class="item" href="#/pages/chem"><span class="n">${ic('book_open')}</span><div class="grow"><h3>หนังสือ บทที่ 1 ปริมาณสารสัมพันธ์</h3><p>สมุดสรุปฉบับเต็ม 28 หน้า${DB.chem.pg>1?' · อ่านถึงหน้า '+DB.chem.pg:''}</p></div>${ic('chevron_right','ch')}</a>
    ${CHEM_SECTIONS.map((c,i)=>`<a class="item" href="#/pages/chem/${c.pg}"><span class="n ${(DB.chem.pgMax||0)>=c.pg?'dn':''}">${i+1}</span><div class="grow"><h3>${esc(c.t)}</h3><p>เปิดหนังสือที่หน้า ${c.pg}</p></div>${ic('chevron_right','ch')}</a>`).join('')}
    <a class="item" href="#/read/chem/intro"><span class="n">${ic('list')}</span><div class="grow"><h3>สรุปย่อแบบข้อความ</h3><p>เวอร์ชันพิมพ์ใหม่ อ่านบนมือถือง่าย ปรับขนาดตัวอักษรได้</p></div>${ic('chevron_right','ch')}</a></div></section>`;
  v.innerHTML=h;
}

/* ---------- อ่านสรุป (โหมดโฟกัส) ---------- */
function rbar(sec,mode){ const R=DB.rd, bm=sec&&DB.bm.sec.includes(sec.id);
  return `<div class="fbar"><a class="ibtn" href="#/library" aria-label="กลับคลังหนังสือ">${ic('arrow_left')}</a>
    <div class="tt"><b>${esc(sec?sec.t:'ปริมาณสารสัมพันธ์ บทที่ 1')}</b><small id="pgno">PHB102 · ${sec?'สรุปย่อ':'หนังสือ 28 หน้า'}</small></div>
    <div class="seg"><button class="${mode==='pages'?'on':''}" data-act="rmode" data-v="pages">หนังสือ</button><button class="${mode==='read'?'on':''}" data-act="rmode" data-v="read">สรุปย่อ</button></div>
    ${mode==='read'?`<span class="dv hm"></span><button class="ibtn" data-act="fs" data-v="-1" aria-label="ลดขนาดตัวอักษร" title="ลดขนาดตัวอักษร">${ic('a_arrow_down')}</button><button class="ibtn" data-act="fs" data-v="1" aria-label="เพิ่มขนาดตัวอักษร" title="เพิ่มขนาดตัวอักษร">${ic('a_arrow_up')}</button>
    <button class="ibtn hm ${R.lh>1.8?'on':''}" data-act="lh" aria-label="ระยะบรรทัด" title="ระยะบรรทัด">${ic('align_justify')}</button>
    <button class="ibtn hm ${R.warm?'on':''}" data-act="warm" aria-label="พื้นกระดาษขาวหรือกระดาษอุ่น" title="สลับพื้นขาว / กระดาษอุ่น">${ic(R.warm?'sun':'file_text')}</button>
    <button class="ibtn ${bm?'on':''}" data-act="bmsec" data-v="${sec.id}" aria-label="บุ๊กมาร์กหัวข้อนี้" title="บุ๊กมาร์ก">${ic(bm?'bookmark_check':'bookmark')}</button>`
    :`<button class="ibtn" data-act="pzoom" aria-label="ขยายหรือย่อหน้าหนังสือ" title="ขยายหรือย่อหน้าหนังสือ">${ic('zoom_in')}</button><a class="ibtn" href="chem/pdf/ch1.pdf" download="PHB102-Stoichiometry-ch1.pdf" aria-label="ดาวน์โหลด PDF" title="ดาวน์โหลด PDF">${ic('download')}</a>`}</div>`; }
function vRead(v,subj,id){
  const i=Math.max(0,CHEM_SECTIONS.findIndex(x=>x.id===id)), c=CHEM_SECTIONS[i], R=DB.rd, prev=CHEM_SECTIONS[i-1], next=CHEM_SECTIONS[i+1];
  v.dataset.title=c.t; DB.chem.sec=c.id; save();
  v.innerHTML=`<div class="rd ${R.warm?'warm':''}" style="--fs:${R.fs}px;--lh:${R.lh}">${rbar(c,'read')}
   <div class="wrap"><article><span class="eyebrow">PHB102 <span class="muted">หัวข้อ ${i+1} จาก ${CHEM_SECTIONS.length}</span></span><h1>${esc(c.t)}</h1>
     <div class="mt"><span>${ic('clock')}อ่านประมาณ ${c.min} นาที</span><a href="#/pages/chem/${c.pg}" style="color:var(--pri-d);display:inline-flex;gap:5px;align-items:center">${ic('file_text')}เปิดหนังสือหน้า ${c.pg}</a>${DB.chem.read[c.id]?`<span style="color:var(--ok-d)">${ic('circle_check')}อ่านจบแล้ว</span>`:''}</div>
     <div class="body">${chemTxt(c.html)}</div>
     <div class="ft">${prev?`<a class="btn sec" href="#/read/chem/${prev.id}">${ic('arrow_left')}หัวข้อก่อนหน้า</a>`:''}
       <button class="btn ${DB.chem.read[c.id]?'soft':'sec'}" data-act="done" data-v="${c.id}">${ic(DB.chem.read[c.id]?'circle_check':'check')}${DB.chem.read[c.id]?'อ่านจบแล้ว':'ทำเครื่องหมายว่าอ่านจบ'}</button><span class="sp"></span>
       <button class="btn" data-act="start" data-v="sec:${c.id}">ทำข้อสอบของหัวข้อนี้${ic('arrow_right')}</button>
       ${next?`<a class="btn sec" href="#/read/chem/${next.id}">หัวข้อถัดไป${ic('arrow_right')}</a>`:''}</div></article>
     <aside class="toc" aria-label="สารบัญ"><h4>ในหัวข้อนี้</h4><div class="here"></div><div class="chs"><h4>ทุกหัวข้อ</h4>${CHEM_SECTIONS.map(x=>`<a href="#/read/chem/${x.id}" class="${x.id===c.id?'on':''}">${DB.chem.read[x.id]?ic('circle_check'):''}<span>${esc(x.t)}</span></a>`).join('')}</div></aside></div></div>`;
  return ()=>{ const hs=$$('.rd .body h3'), box=$('.rd .here'); if(!box) return;
    box.innerHTML=hs.map((h,k)=>`<a href="javascript:void 0" data-h="${k}">${esc(h.textContent)}</a>`).join('')||'<a class="on">'+esc(c.t)+'</a>';
    box.onclick=e=>{ const a=e.target.closest('[data-h]'); if(a) hs[+a.dataset.h].scrollIntoView({behavior:RM?'auto':'smooth',block:'start'}); };
    const spy=()=>{ let cur=0; hs.forEach((h,k)=>{ if(h.getBoundingClientRect().top<140) cur=k; }); $$('[data-h]',box).forEach((a,k)=>a.classList.toggle('on',k===cur)); };
    addEventListener('scroll',spy,{passive:true}); spy(); cleanup.push(()=>removeEventListener('scroll',spy)); };
}
function vPages(v,subj,pg){
  v.dataset.title='หนังสือ ปริมาณสารสัมพันธ์'; DB.last={k:'pages'}; save();
  const start=Math.max(1,Math.min(28,+pg||DB.chem.pg||1));
  v.innerHTML=`<div class="rd ${DB.rd.wide?'wide':''}">${rbar(null,'pages')}
    <div class="pjump" aria-label="ข้ามไปหัวข้อ">${CHEM_SECTIONS.map(c=>`<button class="chip" data-act="pgo" data-v="${c.pg}">${esc(c.t.replace(/\s*\(.*\)/,''))}</button>`).join('')}<button class="chip" data-act="pgo" data-v="27">เฉลยโจทย์ฝึก</button></div>
    <div class="pgs">${Array.from({length:28},(_,i)=>`<figure id="pg${i+1}" data-p="${i+1}"><img src="chem/book/p-${String(i+1).padStart(3,'0')}.webp" alt="หนังสือปริมาณสารสัมพันธ์ หน้า ${i+1}" loading="${Math.abs(i+1-start)<2?'eager':'lazy'}" decoding="async" width="1600" height="2264"><figcaption>${i+1} / 28</figcaption></figure>`).join('')}</div></div>`;
  return ()=>{ const figs=$$('.pgs figure'), lab=$('#pgno'); let tk=0;
    const jump=n=>{ const f=figs[n-1]; if(f) scrollTo(0,f.getBoundingClientRect().top+scrollY-84); };
    if(start>1){ jump(start); setTimeout(()=>jump(start),60); }
    const spy=()=>{ tk=0; let cur=1; const mid=innerHeight*.4; for(let i=0;i<figs.length;i++){ if(figs[i].getBoundingClientRect().top<mid) cur=i+1; else break; }
      if(cur!==DB.chem.pg){ DB.chem.pg=cur; DB.chem.pgMax=Math.max(DB.chem.pgMax||1,cur); save(); } if(lab) lab.textContent='PHB102 · หน้า '+cur+' จาก 28'; };
    const on=()=>{ if(!tk) tk=setTimeout(spy,160); };
    addEventListener('scroll',on,{passive:true}); setTimeout(spy,300); cleanup.push(()=>{ removeEventListener('scroll',on); clearTimeout(tk); });
    vPages.jump=jump; };
}

/* ---------- ทำข้อสอบ ---------- */
function vExams(v){
  v.dataset.title='ทำข้อสอบ'; const C=DB.cfg, st=stats(), T=CHEM_TOPICS, nw=DB.chem.wrong.length;
  let h=`${pills()}<div class="ph"><h1>ทำข้อสอบ</h1><p>Practice Exams · เลือกชุดข้อสอบ ตั้งค่าได้ว่าจะเฉลยทันทีหรือเฉลยตอนจบ</p></div>`;
  if(show('chem')) h+=`<section class="group" style="margin-top:8px"><div class="gh"><div class="th" style="background-image:url(${SUBJ.chem.img})"></div><div class="grow"><div class="row" style="gap:8px"><h2>ปริมาณสารสัมพันธ์</h2><span class="tag">PHB102</span></div><p>ปรนัยทั้งหมด ไม่มีข้อเขียน · สุ่มตัวเลขใหม่ทุกครั้ง${st.chem.acc!=null?' · แม่นยำ '+st.chem.acc+'%':''}</p></div></div>
   <div class="cfg"><div class="card"><h2>สร้างชุดข้อสอบเอง</h2>
     <div class="fld"><span class="lb">หัวข้อ</span><div class="tpc"><button class="tp ${C.topic==='all'?'on':''}" data-act="cfg" data-k="topic" data-v="all"><b>คละทุกหัวข้อ</b><small>สุ่มจากทั้งบท</small></button>${Object.keys(T).map(k=>`<button class="tp ${C.topic===k?'on':''}" data-act="cfg" data-k="topic" data-v="${k}"><b>${esc(T[k].n)}</b><small>${esc(T[k].d)}</small></button>`).join('')}</div></div>
     <div class="fld"><span class="lb">ระดับความยาก</span><div class="chips">${[['mix','คละระดับ'],['easy','ง่าย'],['mid','ปานกลาง'],['hard','ยาก']].map(x=>`<button class="chip ${C.lv===x[0]?'on':''}" data-act="cfg" data-k="lv" data-v="${x[0]}">${x[1]}</button>`).join('')}</div></div>
     <div class="fld"><span class="lb">จำนวนข้อ</span><div class="chips">${[5,10,20,30].map(n=>`<button class="chip num ${C.n===n?'on':''}" data-act="cfg" data-k="n" data-v="${n}">${n} ข้อ</button>`).join('')}</div></div>
     <div class="fld"><div class="sw"><div><b style="font-weight:500">เฉลยทันทีหลังตอบ</b><p>ปิดไว้ถ้าอยากเห็นเฉลยตอนส่งข้อสอบทีเดียว</p></div><button class="tg" role="switch" aria-checked="${C.mode==='instant'}" data-act="cfg" data-k="mode" data-v="toggle" aria-label="เฉลยทันทีหลังตอบ"></button></div>
       <div class="sw"><div><b style="font-weight:500">แสดงนาฬิกาจับเวลา</b><p>กดซ่อนหรือแสดงระหว่างทำได้</p></div><button class="tg" role="switch" aria-checked="${!!C.timer}" data-act="cfg" data-k="timer" data-v="toggle" aria-label="แสดงนาฬิกาจับเวลา"></button></div></div>
     <button class="btn lg" style="width:100%;margin-top:14px" data-act="start" data-v="custom">${ic('play')}เริ่มทำข้อสอบ</button></div>
    <div class="quick"><button class="item" data-act="start" data-v="sheet"><span class="n">${ic('file_text')}</span><div class="grow"><h3>ชีทท้ายบท 39 ข้อ</h3><p>โจทย์ 29 ข้อในชีท และดุลสมการ 10 ข้อ ตัวเลขตรงตามชีท</p></div>${ic('chevron_right','ch')}</button>
     <button class="item" data-act="start" data-v="mock"><span class="n">${ic('timer')}</span><div class="grow"><h3>สอบจำลอง 30 ข้อ</h3><p>คละทุกหัวข้อ จับเวลา เฉลยตอนส่ง</p></div>${ic('chevron_right','ch')}</button>
     <button class="item" data-act="start" data-v="concept"><span class="n">${ic('lightbulb')}</span><div class="grow"><h3>ทฤษฎีล้วน 20 ข้อ</h3><p>นิยาม คำย่อ และข้อควรจำ ไม่ต้องคำนวณ</p></div>${ic('chevron_right','ch')}</button>
     <button class="item" data-act="start" data-v="wrong" ${nw?'':'disabled style="opacity:.55"'}><span class="n">${ic('rotate_ccw')}</span><div class="grow"><h3>ทบทวนข้อที่เคยผิด</h3><p>${nw?'มี '+nw+' ข้อรอทบทวน':'ยังไม่มีข้อที่ผิด'}</p></div>${ic('chevron_right','ch')}</button></div></div></section>`;
  const extc=k=>{ const s=SUBJ[k]; return `<a class="item" href="${s.exam}" data-app="${k}" data-mode="exam"><span class="n" style="background:var(--bg) center/cover;background-image:url(${s.img})"></span><div class="grow"><h3>${esc(s.th)} <span class="tag" style="margin-left:6px">${s.code}</span></h3><p>${esc(s.qz)}${st[k].ans?' · ทำไปแล้ว '+st[k].ans+' ข้อ แม่นยำ '+st[k].acc+'%':' · ยังไม่ได้เริ่ม'}</p></div>${ic('chevron_right','ch')}</a>`; };
  if(show('anatomy')||show('calc')) h+=`<div class="sec-h"><div><h2>ข้อสอบวิชาอื่น</h2><p>เปิดคลังข้อสอบของแต่ละวิชา</p></div></div><div class="lst">${['anatomy','calc'].filter(show).map(extc).join('')}</div>`;
  v.innerHTML=h;
}
let QZ=null, tmr=0;
try{ QZ=JSON.parse(sessionStorage.getItem('payap.qz')); }catch(e){}
const keepQZ=()=>{ try{ QZ?sessionStorage.setItem('payap.qz',JSON.stringify(QZ)):sessionStorage.removeItem('payap.qz'); }catch(e){} };
function startQuiz(kind){
  const C=DB.cfg; let qs=[], title='', mode=C.mode, timer=!!C.timer;
  if(kind==='custom'){ qs=genSet(C.topic,C.lv,C.n); title=(C.topic==='all'?'คละทุกหัวข้อ':CHEM_TOPICS[C.topic].n)+' · '+({mix:'คละระดับ',easy:'ง่าย',mid:'ปานกลาง',hard:'ยาก'})[C.lv]; }
  else if(kind==='sheet'){ qs=sheetSet(); title='ชีทท้ายบท 39 ข้อ'; }
  else if(kind==='mock'){ qs=genSet('all','mix',30); title='สอบจำลอง 30 ข้อ'; mode='end'; timer=true; }
  else if(kind==='concept'){ qs=conceptSet(20); title='ทฤษฎีล้วน 20 ข้อ'; }
  else if(kind==='wrong'){ qs=shuf(DB.chem.wrong).slice(0,20).map(q=>{ const right=q.opts[q.ans], o=shuf(q.opts); return Object.assign({},q,{opts:o,ans:o.indexOf(right)}); }); title='ทบทวนข้อที่เคยผิด'; }
  else if(/^sec:/.test(kind)){ const c=CHEM_SECTIONS.find(x=>x.id===kind.slice(4))||CHEM_SECTIONS[0], tps=Object.keys(CHEM_TOPICS).filter(k=>CHEM_TOPICS[k].sec===c.id);
    tps.forEach(t=>{ qs=qs.concat(genSet(t,'mix',Math.ceil(10/tps.length))); }); qs=shuf(qs).slice(0,10); title='หัวข้อ '+c.t; }
  qs=qs.filter(Boolean); if(!qs.length){ toast('ยังไม่มีข้อสอบในชุดนี้'); return; }
  QZ={title,mode,timer,qs:qs.map(q=>({t:q.t,lv:q.lv,stem:q.stem,opts:q.opts,ans:q.ans,exp:q.exp,tag:q.tag||'',pick:null,flag:false,rec:false})),i:0,el:0,kind}; keepQZ();
  if(route()[0]==='quiz') render(); else location.hash='#/quiz';
}
function record(q){ if(q.rec||q.pick==null) return; q.rec=true; const ch=DB.chem, ok=q.pick===q.ans; ch.ans++; if(ok) ch.ok++;
  const tp=ch.tp[q.t]||(ch.tp[q.t]=[0,0]); tp[0]++; if(ok) tp[1]++;
  DB.days[today()]=(DB.days[today()]||0)+1;
  const same=x=>x.stem===q.stem;
  if(ok) ch.wrong=ch.wrong.filter(x=>!same(x)); else if(!ch.wrong.some(same)){ ch.wrong.unshift({t:q.t,lv:q.lv,stem:q.stem,opts:q.opts,ans:q.ans,exp:q.exp,tag:q.tag}); ch.wrong=ch.wrong.slice(0,60); }
  save(); }
function finishQuiz(){ if(!QZ) return; clearInterval(tmr);
  QZ.qs.forEach(record); const n=QZ.qs.length, ok=QZ.qs.filter(q=>q.pick===q.ans).length;
  DB.chem.sessions.unshift({d:Date.now(),title:QZ.title,el:Math.round(QZ.el),n,ok,qs:QZ.qs.map(q=>({t:q.t,lv:q.lv,stem:q.stem,opts:q.opts,ans:q.ans,exp:q.exp,tag:q.tag,pick:q.pick,flag:q.flag}))});
  DB.chem.sessions=DB.chem.sessions.slice(0,12); save(); QZ=null; keepQZ(); location.replace('#/result/0'); }
function vQuiz(v){
  if(!QZ){ location.replace('#/exams'); return; }
  v.dataset.title='ทำข้อสอบ'; const n=QZ.qs.length, q=QZ.qs[QZ.i], inst=QZ.mode==='instant', locked=inst&&q.pick!=null, done=QZ.qs.filter(x=>x.pick!=null).length, lastQ=QZ.i===n-1;
  const cls=k=>locked?(k===q.ans?'ok':k===q.pick?'no':''):(k===q.pick?'sel':'');
  v.innerHTML=`<div class="qz"><div class="hd"><div class="r"><button class="ibtn" data-act="exit" aria-label="ออกจากข้อสอบ" title="ออกจากข้อสอบ">${ic('x')}</button>
     <div class="ct">ข้อ <b class="num">${QZ.i+1}</b> จาก <span class="num">${n}</span> · ${esc(QZ.title)}</div>
     <button class="tm ${QZ.timer?'':'off'}" data-act="timer" aria-label="ซ่อนหรือแสดงเวลา" title="ซ่อนหรือแสดงเวลา">${ic('timer')}<span id="tm">${clock(QZ.el)}</span></button></div>
     <div class="bar"><i style="width:${pct(done,n)}%"></i></div></div>
   <div class="bd"><div class="card q"><div class="tg2"><span class="tag">${esc(CHEM_TOPICS[q.t]?CHEM_TOPICS[q.t].n:'PHB102')}</span><span class="tag g">${LVN[q.lv]||'คละ'}</span>${q.tag?`<span class="tag g">${esc(q.tag)}</span>`:''}${q.flag?`<span class="tag wn">${ic('flag')}ติดธงไว้</span>`:''}</div>
     <p class="stem">${tx(q.stem)}</p>
     <div class="opts" role="radiogroup" aria-label="ตัวเลือก">${q.opts.map((o,k)=>`<button class="opt ${cls(k)}" role="radio" aria-checked="${k===q.pick}" data-act="pick" data-v="${k}" ${locked?'disabled':''}><span class="k">${'ABCDE'[k]}</span><span>${tx(o)}</span>${ic(k===q.ans?'circle_check':'circle_x')}</button>`).join('')}</div>
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
  const R=DB.chem.sessions[+idx||0]; if(!R){ location.replace('#/exams'); return; }
  v.dataset.title='ผลสอบ'; const p=pct(R.ok,R.n), by={};
  R.qs.forEach(q=>{ const b=by[q.t]||(by[q.t]=[0,0]); b[0]++; if(q.pick===q.ans) b[1]++; });
  const nBad=R.qs.filter(q=>q.pick!==q.ans).length, nFl=R.qs.filter(q=>q.flag).length;
  const list=R.qs.map((q,i)=>[q,i]).filter(([q])=>RF==='all'||(RF==='bad'&&q.pick!==q.ans)||(RF==='flag'&&q.flag));
  v.innerHTML=`<div class="res"><div class="row" style="margin:6px 0 16px"><a class="btn sec sm" href="#/exams">${ic('arrow_left')}กลับหน้าข้อสอบ</a><span class="grow"></span><a class="btn sec sm" href="#/progress">${ic('chart_no_axes_column')}ความก้าวหน้า</a></div>
   <div class="card score">${ring(p,148,p>=70?'ok':p<50?'no':'')}<div><span class="tag">PHB102 · ผลสอบ</span><h1 style="margin-top:8px">${p>=80?'ยอดเยี่ยม ทำได้ดีมาก':p>=60?'ผ่านเกณฑ์ ทบทวนอีกนิด':'ยังต้องทบทวนเพิ่ม'}</h1><p class="sub">${esc(R.title)} · ${new Date(R.d).toLocaleDateString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
     <div class="kp"><div><small>คะแนน</small><b>${R.ok} / ${R.n}</b></div><div><small>เวลาที่ใช้</small><b>${clock(R.el)}</b></div><div><small>เฉลี่ยต่อข้อ</small><b>${Math.round(R.el/R.n)} วิ</b></div></div></div></div>
   <div class="card" style="margin-top:16px"><h2 style="margin-bottom:14px">ความแม่นยำรายหัวข้อ</h2><div class="brk">${Object.keys(by).map(t=>{ const b=by[t], a=pct(b[1],b[0]); return `<div class="ln"><span>${esc(CHEM_TOPICS[t]?CHEM_TOPICS[t].n:t)}</span><div class="bar ${a>=70?'ok':''}"><i style="width:${a}%"></i></div><b>${b[1]}/${b[0]}</b></div>`; }).join('')}</div>
     <div class="row" style="margin-top:20px;flex-wrap:wrap"><button class="btn" data-act="start" data-v="${nBad?'wrong':'custom'}">${ic('rotate_ccw')}${nBad?'ทำข้อที่ผิดอีกครั้ง':'ทำชุดใหม่'}</button><a class="btn sec" href="#/exams">เลือกชุดอื่น</a></div></div>
   <div class="sec-h"><div><h2>ทบทวนรายข้อ</h2><p>ดูคำตอบของตัวเองเทียบกับคำตอบที่ถูก พร้อมเฉลยละเอียด</p></div></div>
   <div class="pills" style="display:flex">${[['all','ทั้งหมด',R.n],['bad','ข้อที่ผิด',nBad],['flag','ติดธง',nFl]].map(x=>`<button class="pill ${RF===x[0]?'on':''}" data-act="rf" data-v="${x[0]}">${x[1]} <span class="num">${x[2]}</span></button>`).join('')}</div>
   ${list.length?list.map(([q,i])=>rvCard(q,i+1)).join(''):`<div class="card empty" style="margin-top:12px">${ic('circle_check')}<h3>ไม่มีข้อในกลุ่มนี้</h3></div>`}</div>`;
}
function rvCard(q,no,saved){ const ok=q.pick===q.ans, bm=DB.bm.q.some(x=>x.stem===q.stem);
  return `<div class="card rv"><div class="hdr">${no?`<span class="tag g num">ข้อ ${no}</span>`:''}<span class="tag">${esc(CHEM_TOPICS[q.t]?CHEM_TOPICS[q.t].n:'PHB102')}</span>${saved?'':`<span class="tag ${ok?'ok':'no'}">${ic(ok?'check':'x')}${ok?'ถูก':q.pick==null?'ไม่ได้ตอบ':'ผิด'}</span>`}${q.flag?`<span class="tag wn">${ic('flag')}ติดธง</span>`:''}
    <button class="ibtn mk ${bm?'on':''}" data-act="bmq" data-stem="${esc(q.stem)}" aria-label="บันทึกข้อนี้" title="บันทึกข้อนี้">${ic(bm?'bookmark_check':'bookmark')}</button></div>
    <p class="stem">${tx(q.stem)}</p><div class="ans">${saved?'':`<div class="u ${ok?'ok':'no'}"><small>คำตอบของคุณ</small>${q.pick==null?'ไม่ได้ตอบ':tx(q.opts[q.pick])}</div>`}<div class="c"><small>คำตอบที่ถูก</small>${tx(q.opts[q.ans])}</div></div>${expHTML(q,false)}</div>`; }

/* ---------- บุ๊กมาร์ก ---------- */
function vBookmarks(v){
  v.dataset.title='บุ๊กมาร์ก'; const secs=show('chem')?CHEM_SECTIONS.filter(c=>DB.bm.sec.includes(c.id)):[], qs=show('chem')?DB.bm.q:[];
  v.innerHTML=`${pills()}<div class="ph"><h1>บุ๊กมาร์ก</h1><p>Saved Bookmarks · หัวข้อและข้อสอบที่บันทึกไว้อ่านซ้ำ</p></div>`+
   (!secs.length&&!qs.length?`<div class="card empty">${ic('bookmark')}<h3>ยังไม่มีรายการที่บันทึกไว้</h3><p>กดปุ่มบุ๊กมาร์กในหน้าอ่านสรุป หรือในหน้าทบทวนรายข้อหลังทำข้อสอบ รายการจะมาอยู่ที่นี่</p><a class="btn" href="#/library">ไปที่คลังหนังสือ</a></div>`:
   (secs.length?`<div class="sec-h" style="margin-top:8px"><div><h2>หัวข้อที่บันทึก</h2></div></div><div class="lst">${secs.map(c=>`<a class="item" href="#/read/chem/${c.id}"><span class="n">${ic('bookmark_check')}</span><div class="grow"><h3>${esc(c.t)}</h3><p>PHB102 · อ่านประมาณ ${c.min} นาที</p></div>${ic('chevron_right','ch')}</a>`).join('')}</div>`:'')+
   (qs.length?`<div class="sec-h"><div><h2>ข้อสอบที่บันทึก</h2><p>${qs.length} ข้อ</p></div></div>${qs.map(q=>rvCard(q,0,true)).join('')}`:''));
}

/* ---------- ความก้าวหน้า ---------- */
function vProgress(v){
  v.dataset.title='ความก้าวหน้า'; const st=stats(), tot=ORDER.reduce((s,k)=>s+st[k].ans,0), okc=ORDER.reduce((s,k)=>s+st[k].ok,0), rd=readiness(st);
  const wk=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); wk.push([['อา','จ','อ','พ','พฤ','ศ','ส'][d.getDay()],DB.days[dkey(d)]||0]); } const mx=Math.max(1,...wk.map(x=>x[1]));
  v.innerHTML=`${pills()}<div class="ph"><h1>ความก้าวหน้า</h1><p>Progress & Analytics · ข้อมูลเก็บในเครื่องนี้เท่านั้น</p></div>
  <div class="kpis"><div class="card kpi"><small>${ic('flame')}อ่านต่อเนื่อง</small><b>${streak()}<span>วัน</span></b></div><div class="card kpi"><small>${ic('target')}ความพร้อมสอบ</small><b>${rd}<span>%</span></b></div>
   <div class="card kpi"><small>${ic('clipboard_check')}ทำข้อสอบแล้ว</small><b>${tot.toLocaleString()}<span>ข้อ</span></b></div><div class="card kpi"><small>${ic('circle_check')}ความแม่นยำรวม</small><b>${tot?pct(okc,tot):'–'}<span>${tot?'%':''}</span></b></div></div>
  <div class="sec-h"><div><h2>รายวิชา</h2><p>ความพร้อมคิดจากการอ่านสรุปและความแม่นยำในการทำข้อสอบ</p></div></div>
  <div class="grid3">${ORDER.filter(show).map(k=>{ const s=SUBJ[k], x=st[k]; return `<div class="card"><div class="row">${ring(x.ready,64)}<div class="grow"><span class="tag">${s.code}</span><h3 style="margin-top:4px">${esc(s.th)}</h3></div></div>
     <div class="brk" style="margin-top:16px"><div class="ln"><span>อ่านสรุป</span><div class="bar"><i style="width:${x.rd}%"></i></div><b>${x.rd}%</b></div><div class="ln"><span>ความแม่นยำ</span><div class="bar ok"><i style="width:${x.acc||0}%"></i></div><b>${x.acc==null?'–':x.acc+'%'}</b></div></div>
     <p class="sub" style="font-size:12.5px;margin-top:12px">ทำข้อสอบแล้ว ${x.ans.toLocaleString()} ข้อ ถูก ${x.ok.toLocaleString()} ข้อ</p></div>`; }).join('')}</div>
  ${show('chem')?`<div class="grid2" style="margin-top:20px"><div class="card"><h2>ข้อที่ทำใน 7 วันล่าสุด</h2><p class="sub" style="font-size:12.5px">นับเฉพาะปริมาณสารสัมพันธ์</p><div class="week">${wk.map(x=>`<div><b>${x[1]||''}</b><i class="${x[1]?'':'z'}" style="height:${Math.round(x[1]/mx*78)}%"></i>${x[0]}</div>`).join('')}</div></div>
   <div class="card"><h2 style="margin-bottom:14px">ปริมาณสารสัมพันธ์ รายหัวข้อ</h2><div class="brk">${Object.keys(CHEM_TOPICS).map(t=>{ const b=DB.chem.tp[t]||[0,0], a=pct(b[1],b[0]); return `<div class="ln"><span>${esc(CHEM_TOPICS[t].n)}</span><div class="bar ${a>=70?'ok':''}"><i style="width:${a}%"></i></div><b>${b[0]?a+'%':'–'}</b></div>`; }).join('')}</div></div></div>
  <div class="sec-h"><div><h2>ประวัติการสอบ</h2><p>ปริมาณสารสัมพันธ์ · เก็บ 12 ครั้งล่าสุด</p></div></div>
  <div class="card" style="padding:8px 20px">${DB.chem.sessions.length?`<div class="hist">${DB.chem.sessions.map((R,i)=>`<a href="#/result/${i}"><span>${esc(R.title)}</span><small>${new Date(R.d).toLocaleDateString('th-TH',{day:'numeric',month:'short'})}</small><small class="num">${clock(R.el)}</small><span class="tag ${pct(R.ok,R.n)>=70?'ok':pct(R.ok,R.n)<50?'no':''}">${R.ok}/${R.n}</span></a>`).join('')}</div>`:`<div class="empty">${ic('clipboard_check')}<h3>ยังไม่มีประวัติการสอบ</h3><p>ทำข้อสอบสักชุด แล้วผลจะมาแสดงที่นี่</p><a class="btn" href="#/exams">ไปทำข้อสอบ</a></div>`}</div>`:''}`;
}

/* ---------- ค้นหา ⌘K ---------- */
function palette(){
  if($('.pal')) return; const idx=[];
  NAV.forEach(n=>idx.push({t:n[2],s:n[3],h:'#/'+n[0],i:n[1]}));
  CHEM_SECTIONS.forEach(c=>{ idx.push({t:c.t,s:'PHB102 · หนังสือหน้า '+c.pg,h:'#/pages/chem/'+c.pg,i:'book_open',g:'PHB102',x:c.html.replace(/<[^>]+>/g,' ')}); });
  Object.keys(CHEM_TOPICS).forEach(k=>idx.push({t:'ข้อสอบ '+CHEM_TOPICS[k].n,s:CHEM_TOPICS[k].d,act:'topic:'+k,i:'clipboard_check',g:'PHB102'}));
  idx.push({t:'ชีทท้ายบท 39 ข้อ',s:'PHB102 · ข้อสอบ',act:'sheet',i:'file_text',g:'PHB102'},{t:'สมุดสรุปปริมาณสารสัมพันธ์ 28 หน้า',s:'PHB102 · หน้าหนังสือ',h:'#/pages/chem',i:'file_text',g:'PHB102'});
  AN_CH.forEach((c,i)=>idx.push({t:'บทที่ '+(i+1)+' '+c[0],s:c[1],h:'anatomy/?tab=learn&ch='+(i+1),i:'graduation_cap',g:'BI112',app:'anatomy'}));
  idx.push({t:'หนังสือสรุปกายวิภาคศาสตร์',s:'BI112 · 117 หน้า',h:'anatomy/?tab=book',i:'book_open',g:'BI112',app:'anatomy'},{t:'เลขโรมันและเลขนัยสำคัญ',s:'PHT111 · อ่านสรุป',h:'calc/?tab=book',i:'book_open',g:'PHT111',app:'calc'},{t:'ข้อสอบคำนวณเภสัช',s:'PHT111 · Roman numerals, Significant figures',h:'calc/?tab=quiz',i:'clipboard_check',g:'PHT111',app:'calc'});
  const d=document.createElement('div'); d.className='pal'; d.innerHTML=`<div class="bx" role="dialog" aria-modal="true" aria-label="ค้นหา"><div class="in">${ic('search')}<input type="search" placeholder="ค้นหาบทเรียน หัวข้อ หรือชุดข้อสอบ" aria-label="คำค้น" autocomplete="off"><kbd>Esc</kbd></div><div class="rs"></div></div>`;
  document.body.appendChild(d); const inp=$('input',d), rs=$('.rs',d); let cur=0, res=[];
  const draw=()=>{ const q=inp.value.trim().toLowerCase(); res=(q?idx.filter(x=>(x.t+' '+x.s+' '+(x.g||'')).toLowerCase().includes(q)).concat(idx.filter(x=>x.x&&x.x.toLowerCase().includes(q)&&!(x.t+' '+x.s).toLowerCase().includes(q))):idx).slice(0,14); cur=Math.min(cur,Math.max(0,res.length-1));
    rs.innerHTML=res.length?res.map((x,i)=>`<a href="${x.h||'#/exams'}" data-i="${i}" class="${i===cur?'on':''}">${ic(x.i)}<div><b>${esc(x.t)}</b><small>${esc(x.s)}</small></div>${x.g?`<span class="tag">${x.g}</span>`:''}</a>`).join(''):`<div class="no">ไม่พบสิ่งที่ค้นหา ลองใช้คำอื่น เช่น โมล, กระดูก, เลขโรมัน</div>`; };
  const pickR=x=>{ d.remove(); if(x.act){ if(/^topic:/.test(x.act)){ DB.cfg.topic=x.act.slice(6); save(); startQuiz('custom'); } else startQuiz(x.act); } else { if(x.app) lastApp(x.app,x.h,/quiz|learn/.test(x.h)?'exam':'read'); location.href=x.h; } };
  inp.addEventListener('input',()=>{cur=0;draw();});
  d.addEventListener('keydown',e=>{ if(e.key==='Escape') d.remove(); else if(e.key==='ArrowDown'){cur=Math.min(res.length-1,cur+1);draw();e.preventDefault();} else if(e.key==='ArrowUp'){cur=Math.max(0,cur-1);draw();e.preventDefault();} else if(e.key==='Enter'&&res[cur]){ e.preventDefault(); pickR(res[cur]); } });
  d.addEventListener('click',e=>{ if(e.target===d){ d.remove(); return; } const a=e.target.closest('[data-i]'); if(a){ e.preventDefault(); pickR(res[+a.dataset.i]); } });
  draw(); inp.focus();
}
function lastApp(id,href,mode){ DB.last={k:'app',id,href,mode}; save(); }

/* ---------- เหตุการณ์ ---------- */
document.addEventListener('click',e=>{
  const ap=e.target.closest('a[data-app]'); if(ap){ lastApp(ap.dataset.app,ap.getAttribute('href'),ap.dataset.mode||'read'); }
  const stA=e.target.closest('a[data-start]'); if(stA){ e.preventDefault(); setTimeout(()=>startQuiz(stA.dataset.start),80); return; }
  const b=e.target.closest('[data-act]'); if(!b) return; const a=b.dataset.act, val=b.dataset.v, q=QZ&&QZ.qs[QZ.i];
  if(a==='filter'){ FILTER=val; shelfAt=-1; render.reset=true; rerender(); }
  else if(a==='mini'){ DB.mini=!DB.mini; save(); $('#app').classList.toggle('mini',DB.mini); }
  else if(a==='theme') setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  else if(a==='pal') palette();
  else if(a==='cfg'){ const k=b.dataset.k; DB.cfg[k]=val==='toggle'?(k==='mode'?(DB.cfg.mode==='instant'?'end':'instant'):!DB.cfg.timer):(k==='n'?+val:val); save(); rerender(); }
  else if(a==='start') startQuiz(val);
  else if(a==='rmode') location.hash=val==='pages'?'#/pages/chem':'#/read/chem/'+(DB.chem.sec||'intro');
  else if(a==='pgo'){ if(vPages.jump) vPages.jump(+val); }
  else if(a==='pzoom'){ DB.rd.wide=!DB.rd.wide; save(); $('.rd').classList.toggle('wide',DB.rd.wide); b.classList.toggle('on',DB.rd.wide); }
  else if(a==='fs'){ DB.rd.fs=Math.max(14,Math.min(24,DB.rd.fs+(+val))); save(); $('.rd').style.setProperty('--fs',DB.rd.fs+'px'); }
  else if(a==='lh'){ DB.rd.lh=DB.rd.lh>1.8?1.75:2.05; save(); $('.rd').style.setProperty('--lh',DB.rd.lh); b.classList.toggle('on',DB.rd.lh>1.8); }
  else if(a==='warm'){ DB.rd.warm=!DB.rd.warm; save(); $('.rd').classList.toggle('warm',DB.rd.warm); b.classList.toggle('on',DB.rd.warm); b.innerHTML=ic(DB.rd.warm?'sun':'file_text'); toast(DB.rd.warm?'พื้นกระดาษอุ่น':'พื้นขาว'); }
  else if(a==='bmsec'){ const i=DB.bm.sec.indexOf(val); if(i<0) DB.bm.sec.push(val); else DB.bm.sec.splice(i,1); save(); b.classList.toggle('on',i<0); b.innerHTML=ic(i<0?'bookmark_check':'bookmark'); toast(i<0?'บันทึกหัวข้อนี้แล้ว':'นำออกจากบุ๊กมาร์กแล้ว'); }
  else if(a==='bmq'){ const stem=b.dataset.stem, i=DB.bm.q.findIndex(x=>x.stem===stem);
    if(i>=0){ DB.bm.q.splice(i,1); toast('นำออกจากบุ๊กมาร์กแล้ว'); } else { const src=[].concat(...DB.chem.sessions.map(s=>s.qs)).find(x=>x.stem===stem); if(src){ DB.bm.q.unshift({t:src.t,lv:src.lv,stem:src.stem,opts:src.opts,ans:src.ans,exp:src.exp}); DB.bm.q=DB.bm.q.slice(0,80); toast('บันทึกข้อนี้แล้ว'); } }
    save(); rerender(); }
  else if(a==='done'){ if(DB.chem.read[val]) delete DB.chem.read[val]; else { DB.chem.read[val]=Date.now(); toast('บันทึกว่าอ่านจบแล้ว'); } save(); rerender(); }
  else if(a==='rf'){ RF=val; rerender(); }
  else if(!QZ) return;
  else if(a==='pick'){ if(QZ.mode==='instant'){ if(q.pick!=null) return; q.pick=+val; record(q); } else q.pick=q.pick===+val?null:+val; keepQZ(); rerender(); }
  else if(a==='flag'){ q.flag=!q.flag; keepQZ(); rerender(); }
  else if(a==='next'){ QZ.i=Math.min(QZ.qs.length-1,QZ.i+1); keepQZ(); render(); }
  else if(a==='prev'){ QZ.i=Math.max(0,QZ.i-1); keepQZ(); render(); }
  else if(a==='jump'){ QZ.i=+val; keepQZ(); render(); }
  else if(a==='timer'){ QZ.timer=!QZ.timer; keepQZ(); b.classList.toggle('off',!QZ.timer); }
  else if(a==='submit'){ const left=QZ.qs.filter(x=>x.pick==null).length; if(left) confirmDlg('ส่งข้อสอบเลยไหม','ยังมี '+left+' ข้อที่ยังไม่ได้ตอบ ข้อที่ไม่ได้ตอบจะนับเป็นผิด','ส่งข้อสอบ',finishQuiz); else finishQuiz(); }
  else if(a==='exit'){ confirmDlg('ออกจากข้อสอบ','ความคืบหน้าของชุดนี้จะไม่ถูกบันทึกเป็นผลสอบ','ออก',()=>{ QZ=null; keepQZ(); location.hash='#/exams'; }); }
});
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); palette(); return; }
  if(e.target.closest('input,textarea,.pal,.dlg,.sheet')) return;
  if(e.key==='/'&&!e.metaKey&&!e.ctrlKey){ e.preventDefault(); palette(); return; }
  if(route()[0]==='quiz'&&QZ){ const q=QZ.qs[QZ.i], k=e.key.toLowerCase(), n='12345'.indexOf(k)>=0?'12345'.indexOf(k):'abcde'.indexOf(k);
    const click=s=>{ const x=$(s); if(x&&!x.disabled) x.click(); };
    if(n>=0&&n<q.opts.length&&k.length===1) click(`[data-act="pick"][data-v="${n}"]`);
    else if(e.key==='ArrowRight'||e.key==='Enter'){ e.preventDefault(); click('[data-act="next"],[data-act="submit"]'); } else if(e.key==='ArrowLeft') click('[data-act="prev"]'); else if(k==='f') click('[data-act="flag"]'); }
  else if(route()[0]===''&&shelfApi&&document.activeElement===document.body){ if(e.key==='ArrowLeft') shelfApi.to(shelfApi.index()-1); else if(e.key==='ArrowRight') shelfApi.to(shelfApi.index()+1); }
});

shell(); setTheme(document.documentElement.dataset.theme==='dark'?'dark':'light');
addEventListener('hashchange',render); render();
})();
