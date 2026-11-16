/* ===================== มาสคอต: น้องจีนูน (รูปจากผู้ใช้) ===================== */
let MSC_N=0;
function beetleCar(o={}){
  const mood=o.mood||'happy', cls=o.cls||'', small=o.small||o.label==='';
  const src=small?'img/jinoon-160.webp':'img/jinoon.webp';
  return `<img class="msc msc-${mood} ${cls}" src="${src}" alt="${o.label===''?'':(o.label||'')}" ${o.label===''?'aria-hidden="true"':''} draggable="false" decoding="async">`;
}

/* ===================== เสียงกดปุ่มแบบคลิกสั้นๆ สไตล์ไอโฟน (สังเคราะห์สดด้วย Web Audio) ===================== */
const SFX=(()=>{
  let ctx=null, bus=null, nz=null;
  const ac=()=>{
    if(!ctx){ try{
      ctx=new (window.AudioContext||window.webkitAudioContext)();
      bus=ctx.createGain(); bus.gain.value=1; bus.connect(ctx.destination);
      const n=Math.floor(ctx.sampleRate*.04); nz=ctx.createBuffer(1,n,ctx.sampleRate); const d=nz.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
    }catch(e){ctx=null;} }
    if(ctx&&ctx.state==='suspended') ctx.resume(); return ctx; };
  /* คลิก: เสียงรบกวนสั้นมาก ผ่าน bandpass + ตัวสั่นความถี่สูงที่ดับเร็ว ได้เสียง "ติ๊ก" แห้งๆ แบบแป้นพิมพ์ไอโฟน */
  function click(o={}){
    const c=ac(); if(!c||!ST.sound) return;
    const {f=3200,q=1.1,vol=.55,dur=.022,tone=1750,tv=.12,delay=0}=o, t=c.currentTime+delay+.003;
    const s=c.createBufferSource(); s.buffer=nz;
    const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=f; bp.Q.value=q;
    const hp=c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=900;
    const g=c.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.0012); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    s.connect(bp).connect(hp).connect(g).connect(bus); s.start(t); s.stop(t+dur+.01);
    if(tone){ const o2=c.createOscillator(), g2=c.createGain(); o2.type='triangle'; o2.frequency.setValueAtTime(tone,t); o2.frequency.exponentialRampToValueAtTime(tone*.55,t+.012);
      g2.gain.setValueAtTime(0.0001,t); g2.gain.exponentialRampToValueAtTime(tv,t+.001); g2.gain.exponentialRampToValueAtTime(0.0001,t+.016);
      o2.connect(g2).connect(bus); o2.start(t); o2.stop(t+.03); }
  }
  function bell(f,vol=.07,delay=0,dur=.5){ const c=ac(); if(!c||!ST.sound) return; const t=c.currentTime+delay+.005;
    const o=c.createOscillator(), g=c.createGain(); o.type='sine'; o.frequency.value=f;
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g).connect(bus); o.start(t); o.stop(t+dur+.05); }
  return {
    unlock:ac,
    tap(){ click(); },
    soft(){ click({f:2600,vol:.4,tone:1400,tv:.08}); },
    toggle(){ click({f:2400,vol:.45,dur:.018,tone:1200}); click({f:3600,vol:.3,dur:.016,tone:0,delay:.045}); },
    ok(){ bell(1046,.06); bell(1568,.05,.09); },
    bad(){ bell(330,.07,0,.35); },
    done(){ [784,988,1175].forEach((f,i)=>bell(f,.055,i*.11)); },
    rest(){ bell(659,.05,0,.9); bell(523,.045,.35,1.1); },
    click
  };
})();

/* ===================== สถานะที่จำไว้ในเครื่อง ===================== */
const KEY='jinoon.v1';
let ST={};
try{ ST=JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ ST={}; }
ST=Object.assign({sound:true,theme:'light',bookPage:1,
  rest:{on:true,min:45},timer:{min:25,kind:'read'},startScreen:false},ST);
ST.startScreen=false;
try{const _t=localStorage.getItem('payap.theme');ST.theme=(_t==='dark')?'dark':'light';}catch(e){ST.theme='light';}
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(ST)); localStorage.setItem('payap.theme',ST.theme); }catch(e){} }
function applyTheme(){ const r=document.documentElement; if(r.dataset.theme!==ST.theme) r.dataset.theme=ST.theme;
  const m=document.querySelector('meta[name="theme-color"]'); if(m) m.content=ST.theme==='dark'?'#0B1220':'#F8FAFC'; }
applyTheme();
const LITE=(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2);
if(LITE) document.documentElement.classList.add('lite');

/* ===================== ไอคอนเส้น ===================== */
const sv=(p,f)=>`<svg viewBox="0 0 24 24" fill="${f||'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I={
  home:sv('<path d="M4 10.2 12 4l8 6.2V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>'),
  learn:sv('<path d="M3 8.5 12 4l9 4.5-9 4.5z"/><path d="M7 10.6v4.6c1.4 1.3 3.1 1.9 5 1.9s3.6-.6 5-1.9v-4.6M21 8.5v5"/>'),
  chart:sv('<path d="M4 20h16"/><path d="M7 16.5v-5M12 16.5V7M17 16.5v-8"/>'),
  clock:sv('<circle cx="12" cy="12" r="8.2"/><path d="M12 7.5V12l3 2"/>'),
  alert:sv('<path d="M5 5.5h14v10H10l-5 4z"/><path d="M12 8.5v3M12 13.6v.1"/>'),
  search:sv('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>'),
  reset:sv('<path d="M4.5 12a7.5 7.5 0 1 0 2.3-5.4"/><path d="M4.5 4.5V9H9"/>'),
  sOn:sv('<path d="M4.5 9.5h3L12 6v12l-4.5-3.5h-3z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.4 7.4 0 0 1 0 10.4"/>'),
  sOff:sv('<path d="M4.5 9.5h3L12 6v12l-4.5-3.5h-3z"/><path d="m16 10 4 4M20 10l-4 4"/>'),
  chev:sv('<path d="m9.5 6 6 6-6 6"/>'),
  down:sv('<path d="m6 9.5 6 6 6-6"/>'),
  back:sv('<path d="M14.5 6 8.5 12l6 6"/>'),
  x:sv('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  stop:sv('<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>'),
  pause:sv('<path d="M9 6.5v11M15 6.5v11"/>'),
  arrow:sv('<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>'),
  book:sv('<path d="M4 5.8c2.7-1.2 5.3-1.1 8 .7v12.7c-2.7-1.8-5.3-1.9-8-.7zM20 5.8c-2.7-1.2-5.3-1.1-8 .7v12.7c2.7-1.8 5.3-1.9 8-.7z"/>'),
  sun:sv('<circle cx="12" cy="12" r="3.8"/><path d="M12 3v2M12 19v2M5.6 5.6 7 7M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4"/>'),
  moon:sv('<path d="M19.5 14.2A7.8 7.8 0 0 1 9.8 4.5a7.8 7.8 0 1 0 9.7 9.7z"/>'),
  dice:sv('<rect x="4.5" y="4.5" width="15" height="15" rx="3.2"/><circle cx="9" cy="9" r=".9" fill="currentColor"/><circle cx="15" cy="15" r=".9" fill="currentColor"/><circle cx="15" cy="9" r=".9" fill="currentColor"/><circle cx="9" cy="15" r=".9" fill="currentColor"/><circle cx="12" cy="12" r=".9" fill="currentColor"/>'),
  plus:sv('<path d="M12 6.5v11M6.5 12h11"/>'),
  minus:sv('<path d="M6.5 12h11"/>'),
  cards:sv('<rect x="4" y="7" width="13" height="13" rx="2.2"/><path d="M8 4h9.8A2.2 2.2 0 0 1 20 6.2V16"/><path d="M7.5 12h6M7.5 15.5h4"/>'),
  expand:sv('<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>'),
  check:sv('<path d="m6 12.5 4 4 8-9"/>'),
  play:sv('<path d="M8 5.8v12.4a.6.6 0 0 0 .9.5l9.6-6.2a.6.6 0 0 0 0-1L8.9 5.3a.6.6 0 0 0-.9.5z"/>'),
  flame:sv('<path d="M12 20.5c-3.6 0-6-2.4-6-5.7 0-3.6 3.1-5.4 3.6-9.3 2.6 1.6 4 3.6 4.2 6 .9-.6 1.5-1.6 1.7-2.8 1.6 1.6 2.5 3.6 2.5 6 0 3.4-2.4 5.8-6 5.8z"/>'),
  target:sv('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.3"/><circle cx="12" cy="12" r=".9" fill="currentColor"/>'),
  layers:sv('<path d="m12 4 8.5 4.5L12 13 3.5 8.5z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.3 12 20.8l8.5-4.5"/>'),
  cog:sv('<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M4.6 7.8l1.9 1.1M17.5 15.1l1.9 1.1M4.6 16.2l1.9-1.1M17.5 8.9l1.9-1.1"/><circle cx="12" cy="12" r="6.6"/>'),
  sliders:sv('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
  eye:sv('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
  timer:sv('<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.2 1.6M9.5 3.5h5M12 3.5v3"/>'),
  bulb:sv('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'),
  dl:sv('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>'),
  user:sv('<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>'),
  spark:sv('<path d="M12 3.5l1.9 5.2 5.6.3-4.4 3.5 1.5 5.4L12 14.8l-4.6 3.1 1.5-5.4-4.4-3.5 5.6-.3z" fill="currentColor" stroke="none"/>'),
  lock:sv('<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
  quiz:sv('<rect x="5" y="3.5" width="14" height="17" rx="2.4"/><path d="M9 3.5v2h6v-2M8.5 10.5l1.5 1.5 3-3M8.5 16h7"/>'),
  calc:sv('<rect x="5" y="3" width="14" height="18" rx="2.4"/><rect x="8" y="6" width="8" height="3.5" rx=".8"/><path d="M8.5 13h.1M12 13h.1M15.5 13h.1M8.5 16.5h.1M12 16.5h.1M15.5 16.5h.1" stroke-width="2.4"/>'),
  paw:sv('<path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5z" fill="currentColor"/><path d="M18.5 15.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5z" fill="currentColor"/>'),
  heart:sv('<path d="M12 19.5s-7.5-4.4-7.5-9.7A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.4c0 5.3-7.5 9.7-7.5 9.7z"/>')
};
/* โลโก้: มาสคอตย่อในกรอบมน */
const MARK=`<span class="mark pk-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"><path d="M7.5 4.5v6M4.5 7.5h6M14 7.5h6M5 15l5 5M10 15l-5 5M14 16h6M14 19.5h6"/></svg></span>`;
const WORD=`<span class="word">calc</span>`;
const IMG={clip:'',poster:''};

/* ===================== ตัวช่วย ===================== */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sp=s=>String(s).replace(/([ก-ฮะ-ฺเ-๎])([A-Za-z0-9])/g,'$1 $2').replace(/([A-Za-z0-9⁺⁻²³₂₃₄])([ก-ฮเ-ไ])/g,'$1 $2');
const tx=s=>esc(sp(s));
const CHV=ch=>`--c:var(--c${ch});--cs:var(--c${ch}s)`;
const n2=n=>String(n).padStart(2,'0');
const THM=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const thDate=t=>{const d=new Date(t);return `${d.getDate()} ${THM[d.getMonth()]} ${d.getFullYear()+543}, ${n2(d.getHours())}:${n2(d.getMinutes())} น.`;};
const mmss=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+':'+n2(m):m)+':'+n2(x);};
const meter=(p,cls='')=>`<span class="meter ${cls}" role="img" aria-label="${p==null?'ยังไม่เริ่ม':p+'%'}"><i style="width:${p||0}%"></i></span>`;
function ring(p,size=112,stroke=10){const r=(size-stroke)/2, c=2*Math.PI*r, v=p==null?0:p;
  return `<svg class="ring" viewBox="0 0 ${size} ${size}" style="width:${size}px;height:${size}px" aria-hidden="true"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${stroke}"/>${!v?'':`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--brand)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c*v/100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/>`}</svg>`;}
function toast(t){$$('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.innerHTML=I.spark+'<span>'+esc(t)+'</span>';document.body.appendChild(d);setTimeout(()=>d.remove(),2000);}

/* กด: ยุบเล็กน้อย + เสียงคลิก */
document.addEventListener('pointerdown',e=>{
  SFX.unlock();
  const b=e.target.closest('.rp'); if(!b||b.disabled) return;
  b.classList.add('pressing');
  if(!b.dataset.silent) (b.dataset.soft?SFX.soft:SFX.tap)();
});
['pointerup','pointercancel','pointerleave'].forEach(ev=>document.addEventListener(ev,()=>$$('.pressing').forEach(b=>b.classList.remove('pressing')),true));

/* ===================== หนังสือ: สรุปการคำนวณเภสัช ===================== */
const CHAPTERS=[
  {id:1,ready:true,name:'พื้นฐานที่เกี่ยวข้องกับการคำนวณทางเภสัชกรรม',en:'Roman numerals และ Significant figures',p:1,n:16,
   pdf:{f:'pdf/ch1.pdf',mb:2.0},
   toc:[{n:'สารบัญ',p:2},{n:'เรียนเรื่องอะไรบ้างในบทนี้',p:3},{n:'1. ระบบเลขโรมัน Roman numeration system',p:3},{n:'1.1 หลักการเพิ่ม',p:4,s:1},{n:'1.2 หลักการลด',p:4,s:1},{n:'1.3 การเขียนจำนวนที่มีค่ามาก',p:5,s:1},{n:'1.4 ตัวอย่างเลขโรมันพร้อมเฉลย',p:6,s:1},
    {n:'2. เลขนัยสำคัญ Significant number',p:7},{n:'2.1 หลักการนับเลขนัยสำคัญ',p:8,s:1},{n:'2.2 หลักการบันทึกข้อมูล',p:9,s:1},
    {n:'3. กฎของเลขนัยสำคัญ',p:11},{n:'3.1 การบันทึกผล',p:11,s:1},{n:'3.2 การปัดตัวเลขตัวสุดท้าย',p:11,s:1},{n:'3.3 หลักการคำนวณเลขนัยสำคัญ',p:14,s:1}]},
  {id:2,ready:true,name:'มาตรชั่งและตวงทางเภสัชกรรม',en:'Metric, Apothecary, Avoirdupois และ Household',p:17,n:18,book:2,
   pdf:{f:'pdf/ch2.pdf',mb:3.5},
   toc:[{n:'ปก เล่ม 2 บทที่ 2',p:17},{n:'สารบัญ',p:18},{n:'บทนำ ทำไมเภสัชต้องรู้เรื่องชั่ง ตวง วัด',p:19},{n:'1. ระบบเมตริก (The metric system)',p:19},{n:'1.1 คำนำหน้าหน่วย (prefix)',p:19,s:1},{n:'1.2 หน่วยน้ำหนัก ปริมาตร ความยาว',p:21,s:1},{n:'1.3 แบบฝึกแปลงหน่วยระบบเมตริก',p:23,s:1},{n:'1.4 ระบบเมตริกกับงานเภสัชกรรม',p:23,s:1},
    {n:'2. ระบบสามัญ (The common system)',p:24},{n:'2.1 ระบบอะโปธิคารี',p:24,s:1},{n:'2.2 แบบฝึกหน่วยระบบอะโปธิคารี',p:27,s:1},{n:'2.3 ระบบอะวัวดูปัวส์',p:27,s:1},
    {n:'3. ระบบมาตรประจำบ้าน (The household system)',p:28},{n:'3.1 การตวงเป็นหยด และกระบอกตวง',p:29,s:1},{n:'3.2 ตัวอย่างโจทย์มาตรประจำบ้าน',p:30,s:1},
    {n:'4. การแปลงมาตราระบบต่าง ๆ',p:31},{n:'4.1 practical และ exact equivalent',p:31,s:1},{n:'4.2 สรุปตัวเลขทอง และแบบฝึก',p:34,s:1}]},
  {id:3},{id:4},{id:5},{id:6}
];
const chOf=id=>CHAPTERS.find(c=>c.id===id);
const BOOK={title:'สรุปการคำนวณเภสัช PHT111',n:34,ch:CHAPTERS.filter(c=>c.ready)};
const soon=id=>{toast(`บทที่ ${id} coming soon`);};
const pageSrc=p=>`book/p-${String(p).padStart(3,'0')}.webp`;
const pageCh=p=>{let c=BOOK.ch[0].id;for(const x of BOOK.ch) if(p>=x.p) c=x.id;return c;};
let bookIO=null, bookSaveT=0;
function bookHTML(){
  const n=BOOK.n, cur=Math.min(n,Math.max(1,ST.bookPage||1)), c1=chOf(pageCh(cur));
  return head()+`<div class="wrap"><div class="ptitle"><div><h1>อ่านหนังสือ</h1><p>${esc(BOOK.title)} · แตะหน้าเพื่อขยาย ซูมได้</p></div>
     <button class="btn ghost rp" data-dl="1">${I.dl}ดาวน์โหลด PDF</button></div>
   <details class="toc panel" ${UI.tocOpen?'open':''}><summary class="rp" data-soft="1">${I.layers}<b>สารบัญ</b>${I.down}</summary><div class="toc-l">${BOOK.ch.map(c=>`<b class="toc-h">บทที่ ${c.id}${c.book?' (เล่ม '+c.book+')':''} · ${esc(c.name)}</b>`+c.toc.map(t=>`<button class="toc-r rp ${t.s?'sub':''}" data-pg="${t.p}" data-soft="1"><span>${esc(t.n)}</span><b class="num">${t.p}</b></button>`).join('')).join('')}</div></details></div>
   <div class="bk-top"><div class="wrap bk-bar"><div class="bk-chs" aria-label="เลือกบท">${CHAPTERS.map(c=>c.ready?`<button class="bk-ch rp on" data-bkch="${c.p}" data-soft="1">${I.book}บทที่ ${c.id}</button>`:`<button class="bk-ch soon rp" data-soon="${c.id}" data-soft="1">บทที่ ${c.id}<i>soon</i></button>`).join('')}</div><span class="bk-cnt num" id="bk-cnt">หน้า <b>${cur}</b>/${n}</span></div></div>
   <div class="wrap"><div class="bk-pages" id="bk-pages">${Array.from({length:n},(_,i)=>`<figure class="bk-pg" id="pg-${i+1}" data-p="${i+1}"><button class="bk-img rp" data-zoom="${i+1}" data-silent="1" aria-label="ขยายหน้า ${i+1}"><img alt="หน้า ${i+1}" decoding="async" width="1100" height="1557"></button><figcaption class="num">หน้า ${i+1} · บทที่ ${pageCh(i+1)}</figcaption></figure>`).join('')}</div>
   <div class="soon-box">${beetleCar({mood:'wink',cls:'soon-msc'})}<div><b>บทถัดไป coming soon</b><p>บทที่ 3 เป็นต้นไปกำลังเตรียมอยู่ จะเพิ่มเข้ามาเร็วๆ นี้</p></div></div></div>`;
}
function bookBind(){
  if(bookIO) bookIO.disconnect();
  const pgs=$$('.bk-pg'); const load=f=>{const im=f.querySelector('img'); if(!im.getAttribute('src')) im.src=pageSrc(+f.dataset.p);};
  if('IntersectionObserver' in window){ bookIO=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) load(e.target); }),{rootMargin:'1200px 0px'}); pgs.forEach(f=>bookIO.observe(f)); }
  else pgs.forEach(load);
  $$('[data-bkch]').forEach(b=>b.onclick=()=>bookGo(+b.dataset.bkch,true));
  $$('[data-pg]').forEach(b=>b.onclick=()=>bookGo(+b.dataset.pg,true));
  const td=$('.toc'); if(td) td.ontoggle=()=>{UI.tocOpen=td.open;};
  $$('[data-zoom]').forEach(b=>b.onclick=()=>bookZoom(+b.dataset.zoom));
  const p=ST.bookPage||1, j=UI.bookJump||(p>1?p:0); UI.bookJump=0; if(j){ bookGo(j,false); requestAnimationFrame(()=>bookGo(j,false)); }
}
function bookGo(p,smooth){
  const el=$('#pg-'+p); if(!el) return; const top=$('.bk-top'); const off=(top?top.offsetHeight:0)+16;
  window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-off,behavior:smooth&&!LITE?'smooth':'auto'});
}
function bookScroll(){
  if(UI.tab!=='book') return;
  const top=$('.bk-top'), off=(top?top.offsetHeight:0)+innerHeight*.25;
  let cur=1; $$('.bk-pg').forEach(f=>{ if(f.getBoundingClientRect().top<off) cur=+f.dataset.p; });
  const c=$('#bk-cnt'); if(c) c.innerHTML=`หน้า <b>${cur}</b>/${BOOK.n}`;
    if(cur!==ST.bookPage){ ST.bookPage=cur; clearTimeout(bookSaveT); bookSaveT=setTimeout(save,400); }
}
addEventListener('scroll',bookScroll,{passive:true});
function openBookAt(ch,p){ const c=chOf(ch); if(!c||!c.ready) return soon(ch); UI.bookJump=p||c.p; go('book'); }
function bookZoom(p){
  const n=BOOK.n; let z=1; const L=$('#layer2');
  L.innerHTML=`<div class="bz" id="bz" role="dialog" aria-modal="true" aria-label="ดูหน้าหนังสือ">
    <div class="bz-bar"><button class="ib2 rp" id="bz-x" aria-label="ปิด">${I.x}</button><b id="bz-t" class="num"></b>
     <div class="bz-z"><button class="ib2 rp" id="bz-out" aria-label="ย่อ">${I.minus}</button><button class="ib2 rp" id="bz-in" aria-label="ขยาย">${I.plus}</button></div></div>
    <div class="bz-sc" id="bz-sc"><img id="bz-img" alt=""></div>
    <div class="bz-nav"><button class="btn rp" id="bz-prev">${I.back} ก่อนหน้า</button><button class="btn rp" id="bz-next">ถัดไป ${I.chev}</button></div></div>`;
  document.body.style.overflow='hidden';
  const img=$('#bz-img'), sc=$('#bz-sc');
  const show=()=>{ img.src=pageSrc(p); img.alt=`หน้า ${p}`; $('#bz-t').textContent=`หน้า ${p}/${n} · บทที่ ${pageCh(p)}`; $('#bz-prev').disabled=p<=1; $('#bz-next').disabled=p>=n; sc.scrollTo(0,0); };
  const zoom=v=>{ const cx=(sc.scrollLeft+sc.clientWidth/2)/sc.scrollWidth, cy=(sc.scrollTop+sc.clientHeight/2)/sc.scrollHeight;
    z=Math.max(1,Math.min(3.5,v)); img.style.width=(z*100)+'%';
    requestAnimationFrame(()=>{ sc.scrollLeft=cx*sc.scrollWidth-sc.clientWidth/2; sc.scrollTop=cy*sc.scrollHeight-sc.clientHeight/2; }); };
  const close=()=>{ L.innerHTML=''; if(!$('#layer').innerHTML) document.body.style.overflow=''; removeEventListener('keydown',kh,true); if(UI.tab==='book') bookGo(p,false); };
  $('#bz-x').onclick=close; $('#bz-in').onclick=()=>zoom(z+.75); $('#bz-out').onclick=()=>zoom(z-.75);
  $('#bz-prev').onclick=()=>{ if(p>1){p--;show();} }; $('#bz-next').onclick=()=>{ if(p<n){p++;show();} };
  img.ondblclick=()=>zoom(z>1?1:2.2);
  let sx=null; sc.addEventListener('touchstart',e=>{ sx=z===1&&e.touches.length===1?e.touches[0].clientX:null; },{passive:true});
  sc.addEventListener('touchend',e=>{ if(sx==null) return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>60){ if(dx<0&&p<n){p++;show();} else if(dx>0&&p>1){p--;show();} } sx=null; });
  const kh=e=>{ e.stopPropagation(); if(e.key==='Escape') close(); else if(e.key==='ArrowRight'&&p<n){p++;show();} else if(e.key==='ArrowLeft'&&p>1){p--;show();} };
  addEventListener('keydown',kh,true); show();
}


/* ===================== ดาวน์โหลด PDF: โหลดไฟล์มาก่อน แล้วบันทึกด้วยวิธีที่เครื่องนั้นรองรับ ===================== */
const DL={blob:null,busy:false};
const UA=navigator.userAgent||'';
const IS_IOS=/iPad|iPhone|iPod/.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const IN_APP=/Line\/|FBAN|FBAV|FB_IAB|Instagram|TikTok|musical_ly|BytedanceWebview|Twitter|Messenger|MicroMessenger|KAKAOTALK/i.test(UA);
const PDF_NAME='JinoonCalc-Chapter1-PharmCalc.pdf';
const pdfURL=()=>new URL(chOf(1).pdf.f,location.href).href;
function dlFetch(onp){
  if(DL.blob) return Promise.resolve(DL.blob);
  return fetch(pdfURL(),{cache:'force-cache'}).then(async r=>{
    if(!r.ok) throw new Error('HTTP '+r.status);
    const tot=+r.headers.get('content-length')||0;
    if(!r.body||!tot){ const b=await r.blob(); onp&&onp(100); return b; }
    const rd=r.body.getReader(), parts=[]; let got=0;
    for(;;){ const {done,value}=await rd.read(); if(done) break; parts.push(value); got+=value.length; onp&&onp(Math.min(99,Math.round(got/tot*100))); }
    onp&&onp(100); return new Blob(parts,{type:'application/pdf'});
  }).then(b=>{ DL.blob=b.type==='application/pdf'?b:new Blob([b],{type:'application/pdf'}); return DL.blob; });
}
function dlSave(){
  const b=DL.blob; if(!b) return;
  const file=(()=>{ try{ return new File([b],PDF_NAME,{type:'application/pdf'}); }catch(e){ return null; } })();
  /* iPhone/iPad: ใช้หน้าแชร์ของระบบ แล้วเลือก "บันทึกไปยังไฟล์" */
  if(IS_IOS&&file&&navigator.canShare&&navigator.canShare({files:[file]})){
    navigator.share({files:[file],title:'สรุปการคำนวณเภสัช บทที่ 1'}).then(()=>{toast('บันทึกเรียบร้อย');dlClose();}).catch(e=>{ if(e&&e.name==='AbortError') return; dlOpen(); });
    return;
  }
  try{
    const u=URL.createObjectURL(b), a=document.createElement('a'); a.href=u; a.download=PDF_NAME; a.rel='noopener'; a.style.display='none';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),60000);
    toast('เริ่มดาวน์โหลดแล้ว ดูได้ในโฟลเดอร์ดาวน์โหลด'); dlClose();
  }catch(e){ dlOpen(); }
}
function dlOpen(){ const w=window.open(pdfURL(),'_blank','noopener'); if(!w) location.href=pdfURL(); }
function dlCopy(){
  const u=pdfURL(), ok=()=>toast('คัดลอกลิงก์แล้ว นำไปวางใน Safari หรือ Chrome');
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(ok,()=>prompt('คัดลอกลิงก์นี้',u));
  else prompt('คัดลอกลิงก์นี้',u);
}
function dlClose(){ const L=$('#layer'); if(L) L.innerHTML=''; document.body.style.overflow=''; }
function openDL(){
  const c=chOf(1), L=$('#layer');
  L.innerHTML=`<div class="scrim center" id="dl"><div class="dlg dl" role="dialog" aria-modal="true" aria-labelledby="dlt">
    <button class="ib2 rp dl-x" id="dl-x" aria-label="ปิด">${I.x}</button>
    <div class="dl-ic">${I.dl}</div>
    <h3 id="dlt">ดาวน์โหลด PDF บทที่ 1</h3>
    <p class="dl-sub num">${esc(c.name)} · ${c.n} หน้า · ${c.pdf.mb} MB</p>
    ${IN_APP?`<div class="dl-warn">${I.alert}<span>ตอนนี้เปิดเว็บอยู่ในแอพอื่น (เช่น LINE, TikTok, IG) ซึ่งมักโหลดไฟล์ไม่ได้ ให้กดเมนู <b>…</b> แล้วเลือก <b>เปิดใน Safari / Chrome</b> หรือคัดลอกลิงก์ไปเปิดเอง</span></div>`:''}
    <div class="dl-bar" id="dl-bar"><i style="width:0%"></i></div>
    <p class="dl-st num" id="dl-st">กำลังเตรียมไฟล์ 0%</p>
    <div class="dl-btns">
     <button class="btn lg rp wide" id="dl-save" disabled>${I.dl}${IS_IOS?'บันทึกลงไฟล์':'บันทึกลงเครื่อง'}</button>
     <button class="btn ghost rp wide" id="dl-open">${I.book}เปิดดู PDF ในแท็บใหม่</button>
     ${IN_APP?`<button class="btn ghost rp wide" id="dl-copy">${I.layers}คัดลอกลิงก์ PDF</button>`:''}
    </div>
    ${IS_IOS?`<p class="dl-tip">บน iPhone จะขึ้นหน้าแชร์ ให้เลือก <b>บันทึกไปยังไฟล์</b> (Save to Files)</p>`:''}
   </div></div>`;
  document.body.style.overflow='hidden';
  $('#dl-x').onclick=dlClose; $('#dl').onclick=e=>{ if(e.target.id==='dl') dlClose(); };
  $('#dl-open').onclick=dlOpen; if($('#dl-copy')) $('#dl-copy').onclick=dlCopy;
  $('#dl-save').onclick=dlSave;
  const bar=$('#dl-bar i'), st=$('#dl-st'), sv=$('#dl-save');
  const prog=p=>{ if(!bar.isConnected) return; bar.style.width=p+'%'; st.textContent=p>=100?'ไฟล์พร้อมแล้ว':'กำลังเตรียมไฟล์ '+p+'%'; };
  if(DL.blob){ prog(100); sv.disabled=false; return; }
  if(DL.busy) return; DL.busy=true;
  dlFetch(prog).then(()=>{ DL.busy=false; if(!sv.isConnected) return; prog(100); sv.disabled=false; sv.focus(); SFX.ok(); })
   .catch(()=>{ DL.busy=false; if(!st.isConnected) return; st.textContent='โหลดไฟล์ไม่สำเร็จ ลองกด "เปิดดู PDF" แทน หรือเช็กอินเทอร์เน็ต'; st.classList.add('err'); sv.disabled=false; sv.onclick=()=>{ dlClose(); openDL(); }; sv.innerHTML=I.reset+'ลองใหม่'; });
}

/* ===================== เวลาใช้งาน: นับเฉพาะตอนเปิดหน้าเว็บอยู่ ===================== */
const AWAY_LIMIT=5*60*1000; // ออกจากเว็บเกิน 5 นาที = จบการใช้งานรอบนั้น
ST.act=Object.assign({used:0,last:0},ST.act||{});
ST.cd=Object.assign({total:0,left:0,running:false,kind:'read'},ST.cd||{});
const KIND={read:'อ่านหนังสือ',quiz:'ทำข้อสอบ'};
function sessionCheck(){
  const now=Date.now();
  if(ST.act.last&&now-ST.act.last>AWAY_LIMIT){
    const hadCd=ST.cd.total>0;
    ST.act.used=0; ST.cd={total:0,left:0,running:false,kind:ST.cd.kind};
    save();
    return hadCd?'ออกจากเว็บเกิน 5 นาที เริ่มนับเวลาใหม่และยกเลิกตัวนับถอยหลังแล้ว':'ออกจากเว็บเกิน 5 นาที เริ่มนับเวลาพักสายตาใหม่';
  }
  return '';
}
let tickN=0;
function tick(){
  if(document.visibilityState!=='visible') return;
  const now=Date.now();
  if(ST.act.last&&now-ST.act.last>AWAY_LIMIT){ const m=sessionCheck(); if(m) toast(m); }
  ST.act.last=now; ST.activeTotal=(ST.activeTotal||0)+1;
  if(ST.rest.on&&!$('#rest')&&!$('#start')){
    ST.act.used++;
    if(ST.act.used>=ST.rest.min*60){ ST.act.used=0; showRest(false); }
  }
  if(ST.cd.running&&!$('#start')){
    ST.cd.left--;
    if(ST.cd.left<=0){ ST.cd.left=0; ST.cd.running=false; save(); showTimeUp(); }
  }
  if(++tickN%10===0) save();
  timerPill(); const rl=$('#rest-left'); if(rl) rl.textContent=restLeftText();
  const td=$('#cd-big'); if(td) td.textContent=mmss(ST.cd.total?ST.cd.left:ST.timer.min*60);
}
setInterval(tick,1000);
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){ ST.act.last=Date.now(); save(); }
  else { const m=sessionCheck(); if(m) toast(m); ST.act.last=Date.now(); timerPill(); if(UI.tab==='set'){const tp=$('#timer-panel'); if(tp){tp.innerHTML=timerPanel(); setBind();}} }
});
addEventListener('pagehide',()=>{ ST.act.last=Date.now(); save(); });
function restLeftText(){ if(!ST.rest.on) return 'ปิดอยู่'; const l=ST.rest.min*60-ST.act.used; return `อีก ${Math.max(1,Math.ceil(l/60))} นาทีจะเตือนครั้งถัดไป`; }

/* ---------- ป้ายเวลาที่หัวจอ ---------- */
function timerPill(){
  const C=ST.cd, on=C.total>0;
  const html=on?`<button class="tpill rp ${C.running?'run':'pause'}" data-silent="1" aria-label="ตัวนับถอยหลัง${KIND[C.kind]} เหลือ ${mmss(C.left)}">${C.running?I.timer:I.pause}<span class="num">${mmss(C.left)}</span></button>`:'';
  ['#tp-top','#tp-side','#tp-pl'].forEach(s=>{ const el=$(s); if(!el) return; if(el.dataset.h!==String(on)+C.running){ el.innerHTML=html; el.dataset.h=String(on)+C.running;
      const b=el.querySelector('.tpill'); if(b) b.onclick=()=>{ go('set'); }; }
    else { const n=el.querySelector('.tpill .num'); if(n) n.textContent=mmss(C.left); } });
}
/* ---------- แผงตั้งเวลา ---------- */
const PRESET=[15,25,30,45,60,90];
function timerPanel(){
  const C=ST.cd, T=ST.timer, on=C.total>0, pct=on?Math.round((1-C.left/C.total)*100):0;
  return `<div class="cd-wrap">
    <div class="cd-kind" role="radiogroup" aria-label="ประเภท">${Object.entries(KIND).map(([k,n])=>`<button class="fchip rp ${(on?C.kind:T.kind)===k?'on':''}" data-kind="${k}" role="radio" aria-checked="${(on?C.kind:T.kind)===k}" ${on?'disabled':''} data-soft="1">${k==='read'?I.book:I.quiz}${n}</button>`).join('')}</div>
    <div class="cd-face"><div class="ring-w">${ring(pct,168,12)}<span class="ring-v"><b class="num" id="cd-big">${mmss(on?C.left:T.min*60)}</b><small>${on?(C.running?'กำลังนับ':'หยุดชั่วคราว'):'นาที:วินาที'}</small></span></div></div>
    ${on?'':`<div class="cd-pre">${PRESET.map(m=>`<button class="fchip rp ${T.min===m?'on':''}" data-pre="${m}" data-soft="1"><b class="num">${m}</b> นาที</button>`).join('')}</div>
     <div class="stepper c"><button class="iconbtn rp" data-cdm="-5" aria-label="ลด 5 นาที">${I.minus}</button><b class="num">${T.min}<small>นาที</small></b><button class="iconbtn rp" data-cdm="5" aria-label="เพิ่ม 5 นาที">${I.plus}</button></div>`}
    <div class="cta-row two">${on?`<button class="btn ghost lg rp" data-cd="reset">${I.reset}ยกเลิก</button><button class="btn lg rp" data-cd="toggle">${C.running?I.pause+'หยุดชั่วคราว':I.play+'นับต่อ'}</button>`
      :`<button class="btn lg rp wide" data-cd="start">${I.play}เริ่มนับถอยหลัง${KIND[T.kind]}</button>`}</div>
    <p class="cd-note">นับเฉพาะตอนเปิดหน้าเว็บอยู่ ถ้าออกจากเว็บเกิน 5 นาที ตัวนับจะถูกยกเลิก</p></div>`;
}
function cdToggle(){ ST.cd.running=!ST.cd.running; save(); timerPill(); toast(ST.cd.running?'นับเวลาต่อ':'หยุดเวลาชั่วคราว'); const tp=$('#timer-panel'); if(tp){tp.innerHTML=timerPanel(); setBind();} }
function setBind(){
  const rf=()=>{ const tp=$('#timer-panel'); if(tp){ tp.innerHTML=timerPanel(); setBind(); } timerPill(); };
  $$('[data-kind]').forEach(b=>b.onclick=()=>{ST.timer.kind=b.dataset.kind;save();rf();});
  $$('[data-pre]').forEach(b=>b.onclick=()=>{ST.timer.min=+b.dataset.pre;save();rf();});
  $$('[data-cdm]').forEach(b=>b.onclick=()=>{ST.timer.min=Math.max(5,Math.min(240,ST.timer.min+ +b.dataset.cdm));save();rf();});
  $$('[data-cd]').forEach(b=>b.onclick=()=>{ const a=b.dataset.cd;
    if(a==='start'){ ST.cd={total:ST.timer.min*60,left:ST.timer.min*60,running:true,kind:ST.timer.kind}; toast('เริ่มนับถอยหลัง '+ST.timer.min+' นาที'); }
    else if(a==='toggle'){ ST.cd.running=!ST.cd.running; }
    else { ST.cd={total:0,left:0,running:false,kind:ST.cd.kind}; }
    save(); rf(); });
  $$('[data-rest]').forEach(b=>b.onclick=()=>{ ST.rest.min=Math.max(5,Math.min(180,ST.rest.min+ +b.dataset.rest)); if(ST.act.used>=ST.rest.min*60) ST.act.used=ST.rest.min*60-60; save();
    $('#rest-min').textContent=ST.rest.min; $('#rest-left').textContent=restLeftText(); });
}

/* ---------- ข้อความเต็มจอ: พักสายตา ---------- */
function showRest(demo){
  if($('#rest')) return;
  const d=document.createElement('div'); d.id='rest'; d.className='rest'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-labelledby','rest-t');
  d.innerHTML=`<div class="rest-in">
    <div class="rest-cat">${beetleCar({mood:"sleep",label:"พักสายตา"})}</div>
    <p class="eyebrow num">${demo?'ตัวอย่าง':'ใช้งานมาแล้ว '+ST.rest.min+' นาที'}</p>
    <h2 id="rest-t">พักสายตาหน่อยนะ</h2>
    <p class="rest-tip">จอดพักเครื่องก่อน ละสายตาจากจอ มองไปไกลๆ ประมาณ 6 เมตร สัก 20 วินาที กะพริบตาช้าๆ แล้วค่อยกลับมาอ่านต่อ</p>
    <div class="rest-cd"><div class="ring-w">${ring(0,120,10)}<span class="ring-v"><b class="num" id="rest-s">20</b><small>วินาที</small></span></div></div>
    <button class="btn lg rp" id="rest-ok">${I.check}พักแล้ว ไปต่อ</button>
    <p class="rest-hint">ปัดขึ้น หรือกด Esc เพื่อปิด · จะเตือนอีกครั้งในอีก ${ST.rest.min} นาที</p></div>`;
  document.body.appendChild(d); SFX.rest();
  let s=20; const ringC=()=>{const c=d.querySelector('.ring');const r=(120-10)/2,C=2*Math.PI*r;c.innerHTML=`<circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--line)" stroke-width="10"/><circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--brand)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(C*(20-s)/20).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 60 60)"/>`;};
  const iv=setInterval(()=>{ if(!d.isConnected) return clearInterval(iv); if(document.visibilityState!=='visible') return; s--; $('#rest-s').textContent=Math.max(0,s); ringC(); if(s<=0){clearInterval(iv); $('#rest-s').textContent='0'; d.classList.add('done'); SFX.ok();} },1000);
  const close=()=>{ clearInterval(iv); d.classList.add('out'); removeEventListener('keydown',kh,true); ST.act.used=0; save(); setTimeout(()=>d.remove(),260); };
  const kh=e=>{ if(e.key==='Escape'||e.key==='Enter'){ e.preventDefault(); e.stopPropagation(); close(); } };
  addEventListener('keydown',kh,true);
  $('#rest-ok').onclick=close;
  let sy=null; d.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;},{passive:true});
  d.addEventListener('touchend',e=>{ if(sy!=null&&sy-e.changedTouches[0].clientY>90) close(); sy=null; },{passive:true});
  $('#rest-ok').focus();
}
/* ---------- หมดเวลานับถอยหลัง ---------- */
function showTimeUp(){
  if($('#rest')) $('#rest').remove();
  const k=ST.cd.kind, mins=Math.round(ST.cd.total/60);
  const d=document.createElement('div'); d.id='rest'; d.className='rest up'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-labelledby','up-t');
  d.innerHTML=`<div class="rest-in"><div class="rest-cat">${beetleCar({mood:"happy"})}</div><p class="eyebrow num">ครบ ${mins} นาที</p><h2 id="up-t">หมดเวลา${KIND[k]}แล้ว</h2>
    <p class="rest-tip">${k==='quiz'?'พักสักครู่ แล้วค่อยลุยต่อ':'เก่งมาก พักสายตาสักนิดแล้วค่อยอ่านต่อ'}</p>
    <div class="cta-row two"><button class="btn ghost lg rp" id="up-more">${I.plus}ต่ออีก 5 นาที</button><button class="btn lg rp" id="up-ok">${I.check}รับทราบ</button></div></div>`;
  document.body.appendChild(d); SFX.done();
  const close=()=>{ d.classList.add('out'); removeEventListener('keydown',kh,true); setTimeout(()=>d.remove(),260); ST.cd.total=ST.cd.running?ST.cd.total:0; save(); timerPill(); if(UI.tab==='set'){const tp=$('#timer-panel'); if(tp){tp.innerHTML=timerPanel(); setBind();}} };
  const kh=e=>{ if(e.key==='Escape'){ e.stopPropagation(); close(); } };
  addEventListener('keydown',kh,true);
  $('#up-ok').onclick=close;
  $('#up-more').onclick=()=>{ ST.cd={total:300,left:300,running:true,kind:k}; save(); close(); };
  $('#up-ok').focus();
}

/* ===================== คณิตศาสตร์สำหรับโจทย์: เลขโรมัน และเลขทศนิยมแบบแม่นยำ ===================== */
const OV='~'; /* เครื่องหมายขีดบน (ภายในระบบ) */
const RV=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
const RBASE={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
function romanSmall(n){let s='';for(const[v,r] of RV){while(n>=v){s+=r;n-=v;}}return s;}
function toRoman(n){
  if(n<4000) return romanSmall(n);
  const t=Math.floor(n/1000), r=n%1000;
  const top=romanSmall(t).split('').map(c=>c+OV).join('').replace(/I~/g,'M');
  return top+romanSmall(r);
}
/* แยกเป็นโทเค็น {s,v} โดยขีดบนคูณ 1000 */
function romanSyms(s){const out=[];for(let i=0;i<s.length;i++){const c=s[i];if(!RBASE[c]) return null;let v=RBASE[c],t=c;if(s[i+1]===OV){v*=1000;t+=OV;i++;}out.push({s:t,v});}return out;}
function romanVal(s){const a=romanSyms(s);if(!a||!a.length) return null;let sum=0;for(let i=0;i<a.length;i++){const nx=a[i+1];if(nx&&nx.v>a[i].v) sum-=a[i].v; else sum+=a[i].v;}return sum;}
/* กลุ่มสำหรับอธิบาย: คู่ลบ หรือตัวซ้ำกัน */
function romanGroups(s){const a=romanSyms(s),g=[];for(let i=0;i<a.length;i++){const nx=a[i+1];
  if(nx&&nx.v>a[i].v){g.push({s:a[i].s+nx.s,v:nx.v-a[i].v,sub:true});i++;continue;}
  const L=g[g.length-1]; if(L&&!L.sub&&L.unit===a[i].v){L.s+=a[i].s;L.v+=a[i].v;} else g.push({s:a[i].s,v:a[i].v,unit:a[i].v});}
  return g;}
const fmtInt=n=>Number(n).toLocaleString('en-US');

/* ---------- เลขทศนิยมแบบแม่นยำ (BigInt) ---------- */
const P10=k=>10n**BigInt(k);
function D(str){str=String(str).trim();let neg=false;if(str[0]==='-'){neg=true;str=str.slice(1);}const[i,f='']=str.split('.');let n=BigInt((i||'0')+f);return {n:neg?-n:n,sc:f.length,ex:true};}
function dAdd(a,b,sg=1){const sc=Math.max(a.sc,b.sc);return {n:a.n*P10(sc-a.sc)+BigInt(sg)*b.n*P10(sc-b.sc),sc,ex:a.ex&&b.ex};}
function dMul(a,b){return {n:a.n*b.n,sc:a.sc+b.sc,ex:a.ex&&b.ex};}
function dDiv(a,b){const P=40;const num=a.n*P10(b.sc+P),den=b.n*P10(a.sc);let q=num/den,r=num%den;let sc=P,ex=a.ex&&b.ex&&r===0n;
  if(r!==0n){q=q*10n+1n;sc=P+1;} /* sticky digit: บอกว่ามีเศษต่อท้าย */
  return {n:q,sc,ex};}
function dStr(x){let neg=x.n<0n,s=(neg?-x.n:x.n).toString();if(x.sc>0){s=s.padStart(x.sc+1,'0');s=s.slice(0,s.length-x.sc)+'.'+s.slice(s.length-x.sc);}return (neg?'-':'')+s;}
function dShow(x){let s=dStr(x);if(s.includes('.')){ if(!x.ex){const[i,f]=s.split('.');return i+'.'+f.slice(0,6).replace(/0+$/,'')+'…';} s=s.replace(/0+$/,'').replace(/\.$/,'');}return s;}
const dpOf=s=>{s=String(s);const i=s.indexOf('.');return i<0?0:s.length-i-1;};
/* นับเลขนัยสำคัญของตัวเลขที่เขียน */
function sigOf(str){
  let s=String(str).trim().replace(/^[-+]/,'');
  const m=s.match(/^([\d.]+)\s*(?:x|×)\s*10\^?(-?\d+)$/i); if(m) s=m[1];
  if(s.includes('.')){ const d=s.replace('.','').replace(/^0+/,''); return {n:d.length}; }
  const d=s.replace(/^0+/,''); const t=(d.match(/0+$/)||[''])[0].length;
  return t?{n:d.length-t,max:d.length,amb:true}:{n:d.length};
}
/* ปัดตามกฎในสไลด์: >5 ขึ้น, <5 ลง, =5 พอดี ดูเลขหน้า (คู่หรือ 0 ตัดทิ้ง, คี่ปัดขึ้น), =5 แล้วมีเลขไม่ใช่ 0 ตาม ปัดขึ้น */
function roundInfo(str,mode,k){
  let s=String(str).replace(/^\+/,''); const neg=s[0]==='-'; if(neg) s=s.slice(1);
  let [ip,fp='']=s.split('.'); ip=ip.replace(/^0+(?=\d)/,'');
  const Dg=(ip+fp).split('').map(Number), p=ip.length;
  let last; if(mode==='sig'){ const f=Dg.findIndex(d=>d!==0); last=f+k-1; } else last=p+k-1;
  let rule, cons=null, rest='', up=false;
  if(last>=Dg.length-1){ rule='pad'; while(Dg.length-1<last) Dg.push(0); }
  else { cons=Dg[last+1]; rest=Dg.slice(last+2).join('');
    const restNZ=/[1-9]/.test(rest);
    if(cons>5){rule='gt';up=true;} else if(cons<5){rule='lt';}
    else if(restNZ){rule='5more';up=true;}
    else { const prev=last>=0?Dg[last]:0; rule=rest.length?'5zero':'5'; up=prev%2===1; rule+=up?'odd':'even'; }
  }
  let kept=Dg.slice(0,Math.max(0,last+1)); const keptStr=fmtDigits(kept,p,last);
  let carry=false;
  if(up){ let i=kept.length-1; while(i>=0){ if(kept[i]===9){kept[i]=0;i--;} else {kept[i]++;break;} } if(i<0){kept.unshift(1);carry=true;} }
  let P=p+(carry?1:0), L=last+(carry?1:0);
  if(carry&&mode==='sig'){ L--; kept.pop(); } /* 9.99 -> 10.0 คงจำนวนตัวเท่าเดิม */
  /* ประกอบผลลัพธ์ */
  let res, sci=null;
  if(L>=P-1){ const intD=kept.slice(0,P).join('')||'0'; const fr=kept.slice(P,L+1).join(''); res=intD.replace(/^0+(?=\d)/,'')+(fr?'.'+fr:''); }
  else { const intD=kept.join('')+'0'.repeat(P-1-L); res=intD.replace(/^0+(?=\d)/,''); }
  if(mode==='sig'){ /* ถ้าเลข 0 ท้ายจำนวนเต็มไม่ได้เป็นนัยสำคัญทั้งหมด ให้เขียนแบบยกกำลังสิบ */
    const f=kept.findIndex(d=>d!==0); const sd=kept.slice(f,L+1); const e=P-1-f;
    if(L<P-1||(L===P-1&&sd[sd.length-1]===0&&sd.length>1)) sci=sd[0]+(sd.length>1?'.'+sd.slice(1).join(''):'')+'x10^'+e;
  }
  if(neg){ res='-'+res; if(sci) sci='-'+sci; }
  return {res,sci,rule,cons,rest,keptStr,last,up};
}
function fmtDigits(d,p,last){ if(last<0) return '0'; const a=d.slice(0,last+1); const ip=a.slice(0,p).join('')||'0', fp=a.slice(p).join(''); return ip.replace(/^0+(?=\d)/,'')+(fp?'.'+fp:''); }
const RULE_TH={pad:'ตัวเลขมีไม่ถึงจำนวนที่ต้องการ จึงเติม 0 ต่อท้ายให้ครบ',gt:'มากกว่า 5 จึงปัดขึ้น',lt:'น้อยกว่า 5 จึงปัดลง (ตัดทิ้ง)',
  '5more':'เท่ากับ 5 และมีเลขที่ไม่ใช่ 0 ตามหลัง จึงปัดขึ้นเสมอ','5even':'เท่ากับ 5 พอดี และเลขหน้า 5 เป็นเลขคู่หรือ 0 จึงตัด 5 ทิ้งเฉยๆ','5odd':'เท่ากับ 5 พอดี และเลขหน้า 5 เป็นเลขคี่ จึงปัดเลขหน้าขึ้น',
  '5zeroeven':'เท่ากับ 5 และตามด้วย 0 (นับเหมือนไม่มีเลขต่อท้าย) เลขหน้า 5 เป็นเลขคู่หรือ 0 จึงตัดทิ้ง','5zeroodd':'เท่ากับ 5 และตามด้วย 0 (นับเหมือนไม่มีเลขต่อท้าย) เลขหน้า 5 เป็นเลขคี่ จึงปัดขึ้น'};

/* ---------- ทำให้คำตอบเป็นรูปมาตรฐานก่อนเทียบ ---------- */
const SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
function normNum(u){
  let s=String(u==null?'':u).toLowerCase().replace(/\s+/g,'');
  s=s.replace(/(มิลลิลิตร|มล\.?|มิลลิกรัม|กรัม|ตัว|ml|mg|g)$/,'');
  s=s.replace(/[−–—]/g,'-').replace(/[×✕✖*·]/g,'x').replace(/÷/g,'/');
  s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,m=>'^'+m.split('').map(c=>SUP[c]).join(''));
  s=s.replace(/(\d),(?=\d{3}(\D|$))/g,'$1');
  s=s.replace(/^\+/,'').replace(/^\./,'0.');
  let m=s.match(/^(-?[\d.]+)e\+?(-?\d+)$/); if(m) return m[1]+'x10^'+m[2];
  m=s.match(/^(-?[\d.]+)x10\^?\(?\+?(-?\d+)\)?$/); if(m) return m[1]+'x10^'+m[2];
  return s;
}
function normRange(u){ let s=normNum(u).replace(/(ถึง|to|~|ประมาณ)/g,'-').replace(/-+/g,'-'); return s; }
function normRoman(u){
  let s=String(u==null?'':u).normalize('NFD').toUpperCase().replace(/\s+/g,'');
  s=s.replace(/[̄̅‾¯]/g,OV).replace(/_([IVXLCDM])/g,'$1'+OV).replace(/~+/g,OV);
  s=s.replace(new RegExp('I'+OV,'g'),'M');
  return s;
}
const romanHTML=s=>String(s).replace(/([IVXLCDM])~/g,'<span class="ov">$1</span>');
function sciHTML(s){ return String(s).replace(/x10\^(-?\d+)/g,(m,e)=>' × 10<sup>'+e.replace('-','−')+'</sup>'); }

/* ===================== คลังโจทย์บทที่ 1: ตัวสร้างโจทย์ + ชุดจากชีทและสไลด์ ===================== */
const QT={
  r2a:{n:'เลขโรมัน → อารบิก',pg:3},
  a2r:{n:'อารบิก → เลขโรมัน',pg:4},
  rcalc:{n:'คำนวณเลขโรมัน',pg:7},
  sfcount:{n:'นับเลขนัยสำคัญ',pg:8},
  record:{n:'บันทึกค่าจากการวัด',pg:10},
  round:{n:'ปัดเลขนัยสำคัญ',pg:11},
  sfcalc:{n:'คำนวณตามหลักเลขนัยสำคัญ',pg:14},
  concept:{n:'ทฤษฎีและหลักการ',pg:3}
};
const LVN={easy:'ง่าย',mid:'ปานกลาง',hard:'ยาก'};
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const uniqBy=(a,f)=>{const s=new Set();return a.filter(x=>{const k=f(x);if(s.has(k))return false;s.add(k);return true;});};
const thSup=e=>String(e).split('').map(c=>({'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}[c])).join('');
const showAns=s=>/x10\^/.test(s)?sciHTML(s):/[IVXLCDM]/.test(s)?romanHTML(s):esc(s);

/* field: {kind:'num'|'roman'|'rnum'|'range', acc:[normalized], show:'display', tol?} */
function F(kind,show,alts=[],extra={}){
  const nz=kind==='roman'?normRoman:kind==='range'?normRange:normNum;
  const acc=[show,...alts].map(x=>kind==='rnum'?(/[IVXLCDM]/.test(x)?normRoman(x):normNum(x)):nz(x));
  return Object.assign({kind,show,acc:[...new Set(acc)]},extra);
}
function mkQ(t,lv,stem,big,fields,exp,o={}){ return Object.assign({t,lv,stem,big,fields,exp,id:t+'|'+big+'|'+(o.sub||'')},o); }
/* ตัวเลือกช้อยส์: ใส่คำตอบถูก + ตัวลวงจากข้อผิดพลาดที่พบบ่อย */
function withMC(q,wrongs){
  const right=q.fields[0].show;
  const ws=uniqBy(wrongs.filter(w=>w!=null&&w!==''&&normNum(w)!==normNum(right)&&normRoman(w)!==normRoman(right)),x=>x).slice(0,3);
  if(ws.length<3&&q.fields[0].kind!=='roman'&&/^-?[\d,]*\.?\d+$/.test(right)){ const dp=dpOf(right.replace(/,/g,'')), u=Math.pow(10,-dp), v=+right.replace(/,/g,'');
    for(const k of shuf([1,-1,2,-2,3,10,-10])){ if(ws.length>=3) break; const c=(v+k*u).toFixed(dp); if(+c>=0&&c!==right&&!ws.includes(c)) ws.push(c); } }
  if(ws.length<3) return q;
  const opts=shuf([right,...ws]); q.mc={opts,ans:opts.indexOf(right)}; return q;
}

/* ---------- 1. โรมัน → อารบิก ---------- */
function bR2A(r,lv,o={}){
  const v=romanVal(r), g=romanGroups(r);
  const exp=[`แยกเป็นกลุ่มจากซ้ายไปขวา ถ้าตัวเล็กอยู่หน้าตัวใหญ่ให้จับคู่แล้วลบ (หลักการลด) ส่วนตัวที่ขีดบนให้คูณ 1000`,
    g.map(x=>`${romanHTML(x.s)} = ${fmtInt(x.v)}${x.sub?' (ลบ)':''}`).join(' · '),
    `รวม ${g.map(x=>fmtInt(x.v)).join(' + ')} = <b>${fmtInt(v)}</b>`];
  const add=romanSyms(r).reduce((s,x)=>s+x.v,0);
  const q=mkQ('r2a',lv||(v>=4000?'hard':/(IV|IX|XL|XC|CD|CM)/.test(r)?'mid':'easy'),'จงเขียนเลขโรมันต่อไปนี้ให้เป็นเลขอารบิก',r,[F('num',String(v),[fmtInt(v)])],exp,o);
  q.bigHTML=romanHTML(r);
  return withMC(q,[String(add),String(v+pick([1,-1,10,-10])),String(v+pick([100,-100,1000,5,-5])),String(v>20?v-2*pick([1,10]):v+2)].map(x=>fmtInt(+x)));
}
/* ---------- 2. อารบิก → โรมัน ---------- */
function bA2R(n,lv,o={}){
  const r=toRoman(n); const exp=[];
  if(n>=4000){ const t=Math.floor(n/1000), rem=n%1000;
    exp.push(`จำนวนเกิน 3,999 ให้แยกก้อนหลักพัน: ${fmtInt(n)} = ${fmtInt(t)} × 1,000${rem?` + ${fmtInt(rem)}`:''}`);
    exp.push(`${fmtInt(t)} เขียนเป็น ${romanSmall(t)} แล้วขีดบนทุกตัวเพื่อคูณ 1,000 → ${romanHTML(romanSmall(t).split('').map(c=>c+OV).join(''))}${/I/.test(romanSmall(t))?` และ ${romanHTML('I~')} มีค่า 1,000 จึงเขียนเป็น M แทน → ${romanHTML(r.slice(0,r.length-romanSmall(rem).length))}`:''}`);
    if(rem) exp.push(`ส่วนที่เหลือ ${fmtInt(rem)} = ${placeParts(rem)}`);
  } else exp.push(`แยกตามหลัก: ${fmtInt(n)} = ${placeParts(n)}`);
  exp.push(`ต่อกันจากมากไปน้อย ได้ <b>${romanHTML(r)}</b> (ตัวเดียวกันซ้ำได้ไม่เกิน 3 ตัว ตัวลบมีแค่ I X C)`);
  const q=mkQ('a2r',lv||(n>=4000?'hard':/(IV|IX|XL|XC|CD|CM)/.test(r)?'mid':'easy'),'จงเขียนเลขอารบิกต่อไปนี้ให้เป็นเลขโรมัน',fmtInt(n),[F('roman',r,n>=4000?[r.replace(/M(?=[IVXLCDM]~)/g,'I~')]:[])],exp,o);
  q.hint='พิมพ์ตัวพิมพ์เล็กหรือใหญ่ก็ได้ ตัวที่มีขีดบนให้กดปุ่ม ¯ หลังตัวอักษร หรือพิมพ์ _ นำหน้า เช่น _V';
  const addv=romanSmall(n%1000).replace(/CM/,'DCCCC').replace(/CD/,'CCCC').replace(/XC/,'LXXXX').replace(/XL/,'XXXX').replace(/IX/,'VIIII').replace(/IV/,'IIII');
  const pre=r.slice(0,r.length-romanSmall(n%1000).length);
  return withMC(q,[pre+addv,toRoman(n+1),toRoman(Math.max(1,n-1)),toRoman(n+10),r.split('').reverse().join('').replace(/~([IVXLCDM])/g,'$1~'),n%100===99?pre+romanSmall(n%1000-99)+'IC':null]);
}
function placeParts(n){ const parts=[]; for(const p of [1000,100,10,1]){ const d=Math.floor(n/p)%10; if(p===1000&&n>=1000){parts.push(`${fmtInt(Math.floor(n/1000)*1000)} (${romanHTML(romanSmall(Math.floor(n/1000)*1000))})`);continue;} if(d) parts.push(`${d*p} (${romanHTML(romanSmall(d*p))})`);} return parts.join(' + '); }

/* ---------- 3. คำนวณเลขโรมัน ---------- */
function bRCalc(expr,lv,o={}){
  const tk=expr.replace(/\s/g,'').split(/([+\-×÷x])/).filter(Boolean);
  let vals=[],ops=[];tk.forEach((t,i)=>i%2?ops.push(t.replace('x','×')):vals.push(t));
  const nums=vals.map(romanVal); let v=nums[0]; ops.forEach((op,i)=>{const b=nums[i+1]; v=op==='+'?v+b:op==='-'?v-b:op==='×'?v*b:v/b;});
  const disp=vals.map((r,i)=>romanHTML(r)+(ops[i]?` ${ops[i]==='-'?'−':ops[i]} `:'')).join('');
  const arab=nums.map((n,i)=>fmtInt(n)+(ops[i]?` ${ops[i]==='-'?'−':ops[i]} `:'')).join('');
  const exp=[`แปลงเลขโรมันเป็นเลขอารบิกก่อน: ${vals.map((r,i)=>`${romanHTML(r)} = ${fmtInt(nums[i])}`).join(' · ')}`,
    `คำนวณ ${arab} = <b>${fmtInt(v)}</b>`, `ถ้าตอบเป็นเลขโรมันจะได้ ${romanHTML(toRoman(v))}`];
  const q=mkQ('rcalc',lv||(ops.length>1||nums.some(n=>n>=4000)?'hard':ops.some(x=>x==='×'||x==='÷')?'mid':'easy'),'จงคำนวณหาคำตอบ (ตอบเป็นเลขอารบิกหรือเลขโรมันก็ได้)',expr,[F('rnum',String(v),[fmtInt(v),toRoman(v)])],exp,o);
  q.bigHTML=disp;
  const wrongAdd=nums.reduce((s,n,i)=>i?s+(ops[i-1]==='-'?n:ops[i-1]==='+'?-n:0):n,0);
  return withMC(q,[fmtInt(v+pick([1,-1])),fmtInt(v+pick([10,-10,100])),fmtInt(Math.abs(wrongAdd)||v+2),fmtInt(v+pick([5,-5,50]))]);
}
/* ---------- 4. นับเลขนัยสำคัญ ---------- */
function bSFCount(numStr,lv,o={}){
  const sg=sigOf(numStr), isSci=/x10/.test(numStr), mant=isSci?numStr.split('x')[0]:numStr;
  const exp=[];
  if(isSci) exp.push(`เขียนแบบเลขยกกำลังสิบ ให้นับเฉพาะตัวเลขด้านหน้า ×10 คือ ${esc(mant)}`);
  const s=mant;
  if(s.includes('.')){
    const lead=(s.match(/^0*\.?0*/)||[''])[0].replace('.','').length;
    if(/^0/.test(s)&&lead) exp.push(`เลข 0 ที่นำหน้าเลขตัวแรก (${lead} ตัว) ไม่นับ (ข้อ 4)`);
    if(/[1-9]0+[1-9]/.test(s.replace('.',''))) exp.push('เลข 0 ที่อยู่ระหว่างเลขนัยสำคัญ นับด้วย (ข้อ 2)');
    if(/\.\d*[1-9]0+$/.test(s)||/\.0+$/.test(s)&&/[1-9]/.test(s)) exp.push('เลข 0 ที่อยู่ท้ายและอยู่หลังจุดทศนิยม นับด้วย (ข้อ 3)');
  } else if(sg.amb){ exp.push(`เป็นจำนวนเต็มที่มี 0 ต่อท้าย ${sg.max-sg.n} ตัว ซึ่งอาจเป็นหรือไม่เป็นเลขนัยสำคัญก็ได้ (ข้อ 5) จึงตอบเป็นช่วง`); }
  else if(/[1-9]0+[1-9]/.test(s)) exp.push('เลข 0 ที่อยู่ระหว่างเลขนัยสำคัญ นับด้วย (ข้อ 2)');
  exp.push(`วิธีนับเร็ว: เริ่มจากเลขที่ไม่ใช่ 0 ตัวแรกทางซ้าย นับไปจนสุดทางขวา → <b>${sg.amb?`${sg.n} ถึง ${sg.max} ตัว`:sg.n+' ตัว'}</b>`);
  const show=sg.amb?`${sg.n}-${sg.max}`:String(sg.n);
  const q=mkQ('sfcount',lv||(isSci||sg.amb?'hard':/^0|0$|[1-9]0+[1-9]/.test(s)?'mid':'easy'),'จงระบุจำนวนเลขนัยสำคัญของจำนวนต่อไปนี้',numStr,[F(sg.amb?'range':'num',show,sg.amb?[`${sg.n}ถึง${sg.max}`]:[],{unit:'ตัว'})],exp,o);
  q.bigHTML=sciHTML(esc(numStr)); q.hint='ถ้าบอกจำนวนแน่นอนไม่ได้ ให้ตอบเป็นช่วง เช่น 2-4';
  const all=s.replace('.','').length;
  const w=sg.amb?[String(sg.n),String(sg.max),`${sg.n}-${sg.max+1}`,`${Math.max(1,sg.n-1)}-${sg.max}`]:[String(all),String(sg.n+1),String(Math.max(1,sg.n-1)),String(sg.n+2),`${sg.n}-${sg.n+2}`];
  return withMC(q,w);
}
/* ---------- 5. ปัดเลขนัยสำคัญ ---------- */
function bRound(numStr,k,lv,o={}){
  const R=roundInfo(numStr,'sig',k); const main=R.sci&&!/\./.test(R.res)?R.sci:R.res;
  const alts=[R.res,R.sci].filter(Boolean);
  const exp=[`ต้องการเลขนัยสำคัญ ${k} ตัว นับจากเลขที่ไม่ใช่ 0 ตัวแรกทางซ้าย เก็บไว้ ${esc(R.keptStr)}`];
  if(R.rule==='pad') exp.push(RULE_TH.pad);
  else exp.push(`ตัวเลขที่พิจารณา (ตัวแรกที่ถูกตัด) คือ <b>${R.cons}</b>${R.rest?` ตามด้วย ${R.rest}`:''} → ${RULE_TH[R.rule]}`);
  if(R.sci) exp.push(`จำนวนเต็มที่ต้องตัดหลักทิ้ง ให้เขียนแบบยกกำลังสิบเพื่อบอกจำนวนเลขนัยสำคัญให้ชัด: ${sciHTML(R.sci)}${R.res!==R.sci?` (หรือ ${esc(R.res)})`:''}`);
  exp.push(`คำตอบ <b>${showAns(main)}</b>`);
  const q=mkQ('round',lv||(R.rule.startsWith('5')?(R.rule==='5more'||R.rule.includes('zero')?'hard':'mid'):R.sci||/^0\.0/.test(numStr)?'hard':'easy'),`จงทำให้มีเลขนัยสำคัญ ${k} ตัว ตามกฎการปัดเลข`,numStr,[F('num',main,alts)],exp,Object.assign({sub:'k'+k},o));
  q.bigHTML=`${esc(numStr)} <small>→ ${k} ตัว</small>`; q.hint='ถ้าต้องเขียนแบบยกกำลังสิบ พิมพ์เช่น 2.4x10^3';
  const trunc=roundInfo(numStr,'sig',k); const tStr=trunc.keptStr;
  const halfUp=(()=>{ if(!R.rule.startsWith('5')||R.up) return null; return roundInfo(numStr.replace(/5(0*)$/,'6$1'),'sig',k).res; })();
  return withMC(q,[tStr!==R.res?tStr:null,halfUp,roundInfo(numStr,'sig',k+1).res,k>1?roundInfo(numStr,'sig',k-1).res:null,R.sci?R.res.slice(0,k+1):null,(R.res.includes('.')?R.res+'0':R.res+'.0')]);
}
/* ---------- 6. คำนวณตามหลักเลขนัยสำคัญ ---------- */
function bSFCalc(expr,lv,o={}){
  const clean=expr.replace(/[()\s]/g,'').replace(/−/g,'-').replace(/x/g,'×');
  const tk=clean.split(/([+\-×÷])/).filter(Boolean); const nums=[],ops=[]; tk.forEach((t,i)=>i%2?ops.push(t):nums.push(t));
  const isMul=ops.some(x=>x==='×'||x==='÷');
  let acc=D(nums[0]); ops.forEach((op,i)=>{const b=D(nums[i+1]); acc=op==='+'?dAdd(acc,b):op==='-'?dAdd(acc,b,-1):op==='×'?dMul(acc,b):dDiv(acc,b);});
  const raw=dStr(acc), rawShow=dShow(acc);
  let R,exp=[`คำนวณตามปกติก่อน: ${esc(expr.replace(/\*/g,'×').replace(/-/g,'−'))} = ${esc(rawShow)}`];
  if(isMul){ const sg=nums.map(n=>sigOf(n).n), m=Math.min(...sg);
    exp.push(`เป็นการคูณหาร ผลลัพธ์ต้องมีจำนวนเลขนัยสำคัญเท่ากับตัวที่มีน้อยที่สุด: ${nums.map((n,i)=>`${n} มี ${sg[i]} ตัว`).join(' · ')} → ใช้ <b>${m} ตัว</b>`);
    R=roundInfo(raw,'sig',m);
  } else { const dp=nums.map(dpOf), m=Math.min(...dp);
    exp.push(`เป็นการบวกลบ ผลลัพธ์ต้องมีตำแหน่งทศนิยมเท่ากับตัวที่มีน้อยที่สุด: ${nums.map((n,i)=>`${n} มี ${dp[i]} ตำแหน่ง`).join(' · ')} → ใช้ <b>${m} ตำแหน่ง</b>`);
    R=roundInfo(raw,'dp',m);
  }
  if(R.rule!=='pad') exp.push(`ตัวเลขที่พิจารณาคือ ${R.cons} → ${RULE_TH[R.rule]} (ปัดครั้งเดียวตอนท้าย)`); else exp.push(RULE_TH.pad);
  const main=R.sci&&!/\./.test(R.res)?R.sci:R.res, alts=[R.res,R.sci].filter(Boolean);
  if(R.sci) exp.push(`ตัด 0 ท้ายจำนวนเต็มแล้วบอกจำนวนเลขนัยสำคัญไม่ชัด จึงเขียนเป็น ${sciHTML(R.sci)} (หรือ ${esc(R.res)})`);
  exp.push(`คำตอบ <b>${showAns(main)}</b>`);
  const q=mkQ('sfcalc',lv||(nums.length>2||R.sci?'hard':isMul?'mid':'easy'),'จงคำนวณผลลัพธ์ตามหลักเลขนัยสำคัญ',expr,[F('num',main,alts)],exp,o);
  q.bigHTML=esc(expr.replace(/-/g,'−').replace(/\*/g,'×')); q.rule=R.rule; q.hint='ถ้าต้องเขียนแบบยกกำลังสิบ พิมพ์เช่น 1.1x10^2';
  const other=isMul?roundInfo(raw,'dp',Math.min(...nums.map(dpOf))).res:roundInfo(raw,'sig',Math.min(...nums.map(n=>sigOf(n).n))).res;
  const short=rawShow.replace('…','');
  return withMC(q,[short.length<12?short:short.slice(0,10),other,isMul?roundInfo(raw,'sig',Math.min(...nums.map(n=>sigOf(n).n))+1).res:roundInfo(raw,'dp',Math.min(...nums.map(dpOf))+1).res,roundInfo(raw,'sig',1).res]);
}
/* ---------- 7. บันทึกค่าจากการวัด ---------- */
function bCylinder(step,v,lv,o={}){
  const sdp=dpOf(step), rdp=sdp+1, res=Number((step/10).toFixed(rdp));
  const vS=v.toFixed(Math.max(0,step>=10?0:rdp)), readTick=Math.floor(v/step+1e-9)*step, est=+(v-readTick).toFixed(Math.max(0,rdp));
  const readS=readTick.toFixed(sdp), estS=step>=10?String(Math.round(est)):est.toFixed(rdp), rep=step>=10?String(Math.round(v)):v.toFixed(rdp);
  const sf=sigOf(rep).n, unitTol=step>=10?1:Math.pow(10,-rdp);
  const near=x=>[x-unitTol,x+unitTol].map(y=>step>=10?String(Math.round(y)):y.toFixed(rdp));
  const resS=step>=10?'1':String(res);
  const fields=[F('num',String(step),[],{lab:'กระบอกตวงมี scale ต่ำสุด',unit:'mL'}),F('num',resS,[],{lab:'ค่าที่สามารถอ่านได้ละเอียดถึง',unit:'mL'}),
    F('num',readS,[],{lab:'เลขจากการอ่านค่า (ขีด)',unit:'mL'}),F('num',estS,near(est).filter(x=>+x>=0),{lab:'เลขจากค่าประมาณ',unit:'mL'}),
    F('num',rep,near(v),{lab:'รายงานค่า',unit:'mL'}),F('num',String(sf),[],{lab:'จำนวนเลขนัยสำคัญ',unit:'ตัว'})];
  const exp=[`ขีดที่ละเอียดที่สุดห่างกัน ${step} mL จึงอ่านได้แน่นอนถึงหลักนั้น แล้วประมาณเพิ่มอีก 1 หลักที่ละเอียดกว่า (ถึง ${resS} mL)`,
    `ระดับของเหลว (ดูท้องโค้งของผิวน้ำ) อยู่เหนือขีด ${readS} จึงได้เลขจากการอ่านค่า ${readS} mL`,
    `ประมาณส่วนที่เกินขีดได้ ${estS} mL (เป็นตัวเลขที่ไม่แน่นอน ยอมให้คลาดได้ ±${step>=10?1:unitTol} ในหลักสุดท้าย)`,
    `รายงานค่า = ${readS} + ${estS} = <b>${rep} mL</b> มีเลขนัยสำคัญ ${sf} ตัว`];
  const q=mkQ('record',lv||(step<1?'hard':step===1?'mid':'easy'),'จงระบุผลของการวัดปริมาตรและจำนวนเลขนัยสำคัญจากภาพ','กระบอกตวง',fields,exp,Object.assign({sub:step+'@'+v},o));
  q.fig={k:'cyl',step,v}; return q;
}
function bRecord(kind,a,b,lv,o={}){
  if(kind==='bal'){ /* a=ความไว (g), b=มวลเป็น mg */
    const dp=dpOf(a)+1, g=(b/1000).toFixed(dp);
    const exp=[`เครื่องชั่งอ่านได้ละเอียดถึง ${a} g (${dpOf(a)} ตำแหน่ง) ต้องบันทึกถึงหลักนั้น แล้วเพิ่มตัวประมาณอีก 1 หลัก = ${dp} ตำแหน่ง`,
      `${b} mg = ${b/1000} g → เขียนให้มีทศนิยม ${dp} ตำแหน่ง = <b>${g} g</b>`, `ไม่บันทึกละเอียดเกินกว่าที่เครื่องชั่งทำได้ เช่น ${(b/1000).toFixed(dp+1)} g ถือว่าเกินจริง`];
    const q=mkQ('record',lv||(dp>=4?'mid':'easy'),`เครื่องชั่งมีความไว (sensitivity) ${a} กรัม ชั่งสารได้ ${b} มิลลิกรัม ต้องบันทึกผลเป็นกี่กรัม`,`${b} mg @ ${a} g`,[F('num',g,[],{unit:'g'})],exp,o);
    q.bigHTML=`${b} mg <small>· เครื่องชั่ง ${a} g</small>`;
    return withMC(q,[(b/1000).toFixed(dp+1),(b/1000).toFixed(Math.max(0,dp-1)),String(b/1000),(b/100).toFixed(dp-1)]);
  }
  /* kind==='vol': a=scale ต่ำสุด (mL), b=ปริมาตรที่ตวง (ตรงขีดพอดี) */
  const dp=dpOf(a)+1, s=a>=10?String(b):Number(b).toFixed(dp);
  const exp=[`กระบอกตวงอ่านค่าได้ต่ำสุด ${a} mL บันทึกถึงหลักนั้นแล้วเพิ่มค่าประมาณอีก 1 หลัก`,
    `ระดับตรงขีด ${b} พอดี ค่าประมาณจึงเป็น 0 แต่ต้องเขียนไว้ด้วย → <b>${s} mL</b>`];
  const q=mkQ('record',lv||'mid',`ตวงสาร ${b} mL ด้วยกระบอกตวงที่อ่านค่าได้ต่ำสุด ${a} mL (ระดับตรงขีดพอดี) ต้องบันทึกผลอย่างไร`,`${b} mL @ ${a}`,[F('num',s,[],{unit:'mL'})],exp,o);
  q.bigHTML=`${b} mL <small>· ขีดต่ำสุด ${a} mL</small>`;
  return withMC(q,[String(b),Number(b).toFixed(dp+1),Number(b).toFixed(Math.max(1,dp-1)),Number(b).toFixed(dp+2)]);
}
/* ---------- ทฤษฎีแบบมีรูป (กระบอกตวง) ช้อยส์อย่างเดียว ---------- */
const CFIG=[['rec',10,34],['rec',10,27],['rec',1,34.5],['rec',1,19],['rec',1,35],['rec',0.1,5.23],['step',10,36],['step',1,28.5],
  ['res',10,43],['res',1,19],['sf',10,18],['sf',1,22.3],['sf',1,35],['sf',0.1,3.47],['unc',10,34],['unc',1,41.7]];
function bCylTheory(i){ const [k,step,v]=CFIG[i]; const sdp=dpOf(step), rdp=sdp+1;
  const rep=step>=10?String(Math.round(v)):v.toFixed(rdp), readTick=Math.floor(v/step+1e-9)*step, readS=readTick.toFixed(sdp), sf=sigOf(rep).n;
  const resS=step>=10?'1':String(Number((step/10).toFixed(rdp)));
  const u=(ok,c)=>{ const o=[ok]; c.forEach(x=>{ if(o.length<4&&x!=null&&!o.includes(x)) o.push(x); }); return o; };
  const base=`ขีดที่ละเอียดที่สุดห่างกัน ${step} mL อ่านได้แน่นอนถึงขีด ${readS} mL แล้วกะประมาณเพิ่มอีก 1 หลัก (ละเอียดถึง ${resS} mL) ได้ <b>${rep} mL</b> มีเลขนัยสำคัญ ${sf} ตัว`;
  let st,opts,why,lv=step<1?'hard':step===1?'mid':'easy';
  if(k==='rec'){ st='จากรูป ควรบันทึกปริมาตรของเหลวอย่างไร';
    opts=u(rep+' mL',[v.toFixed(rdp+1)+' mL',(step>=10?v.toFixed(1):v.toFixed(Math.max(0,rdp-1)))+' mL',readS+' mL',(step>=10?String(Math.round(v/10)*10):v.toFixed(rdp+2))+' mL',(+rep+(step>=10?1:Math.pow(10,-rdp))).toFixed(step>=10?0:rdp)+' mL']);
    why=base+(Number(rep)===readTick?' (ท้องโค้งตรงขีดพอดี ค่าประมาณจึงเป็น 0 แต่ต้องเขียน 0 ไว้ด้วย)':''); }
  else if(k==='step'){ st='จากรูป ขีดที่ละเอียดที่สุดของกระบอกตวงนี้ห่างกันกี่ mL'; opts=u(step+' mL',['10 mL','1 mL','0.1 mL','5 mL','2 mL']); why=`นับระยะระหว่างขีดเล็กที่อยู่ติดกัน ได้ขีดละ ${step} mL`; }
  else if(k==='res'){ st='จากรูป กระบอกตวงนี้บันทึกค่าได้ละเอียดถึงกี่ mL'; opts=u(resS+' mL',[String(step)+' mL','0.01 mL','1 mL','0.1 mL','10 mL']); why=`อ่านได้แน่นอนถึงขีด (${step} mL) แล้วกะประมาณเพิ่มอีก 1 หลักที่ละเอียดกว่า 10 เท่า = ${resS} mL`; lv=lv==='easy'?'mid':lv; }
  else if(k==='sf'){ st='ปริมาตรที่อ่านได้จากรูปมีเลขนัยสำคัญกี่ตัว'; opts=u(sf+' ตัว',[(sf+1)+' ตัว',(sf-1)+' ตัว',(sf+2)+' ตัว']); why=base; }
  else { st='จากรูป เมื่อบันทึกค่าแล้ว ตัวเลขใดคือตัวเลขที่ไม่แน่นอน (ได้จากการกะประมาณ)'; const d=rep.replace('.','').split(''); const last=d[d.length-1];
    opts=u(`เลข ${last}`,[...d.slice(0,-1).reverse().map(x=>`เลข ${x}`),'ทุกตัว','ไม่มีตัวที่ไม่แน่นอน']); why=base+` ตัวสุดท้าย (${last}) ได้จากการกะประมาณจึงเป็นตัวที่ไม่แน่นอน แต่ยังนับเป็นเลขนัยสำคัญ`; lv='mid'; }
  const q=mkQ('concept',lv,st,'กระบอกตวง',[F('num',opts[0])],[why],{sub:'cf'+i,pg:10}); const sh=shuf(opts);
  q.mc={opts:sh,ans:sh.indexOf(opts[0])}; q.mcOnly=true; q.plain=true; q.fig={k:'cyl',step,v}; return q; }

/* ---------- 8. หลักการ (ช้อยส์อย่างเดียว) ---------- */
const CONCEPT=[
  ['ระบบเลขโรมันมีสัญลักษณ์พื้นฐานกี่ตัว (รวม ss)',['8 ตัว','7 ตัว','6 ตัว','10 ตัว'],'ss = ½ และ I V X L C D M รวมเป็น 8 ตัว ระบบเลขโรมันไม่มีสัญลักษณ์แทน 0','easy',3],
  ['ss ในใบสั่งยามีค่าเท่าไร',['½','1','5','50'],'ss มาจาก semis (ภาษาละติน แปลว่าครึ่ง) ใช้แทน ½','easy',3],
  ['ข้อใดคือตัวเลขโรมันที่ใช้เป็น "ตัวลบ" ได้',['I, X และ C','I, V และ X','V, L และ D','ทุกตัว'],'ตัวลบมีแค่ I X C และลบได้จากเลขที่ค่าถัดไป 2 ค่าเท่านั้น (I จาก V X, X จาก L C, C จาก D M)','easy',4],
  ['เขียน 99 เป็นเลขโรมันข้อใดถูก',['XCIX','IC','LXXXXIX','XCVIIII'],'I ลบได้แค่จาก V และ X ห้ามเขียน IC ต้องเป็น 90 + 9 = XC + IX = XCIX','mid',4],
  ['หลักการเพิ่มของเลขโรมัน ตัวเดียวกันเขียนซ้ำได้ไม่เกินกี่ตัว',['3 ตัว','2 ตัว','4 ตัว','ไม่จำกัด'],'เขียนซ้ำได้ไม่เกิน 3 ตัว เช่น 40 ไม่เขียน XXXX แต่เขียน XL','easy',4],
  ['ขีด "−" บนตัวอักษรโรมันหมายถึงอะไร',['คูณค่าด้วย 1,000','คูณค่าด้วย 100','ลบออก 1,000','ใช้แทนเลขลบ'],'ตัวที่มีขีดบนมีค่าเพิ่มขึ้น 1,000 เท่า เช่น V̄ = 5,000','easy',5],
  ['X̄ มีค่าเท่าไร',['10,000','1,000','100,000','10'],'X = 10 ขีดบนคูณ 1,000 จึงได้ 10,000','easy',5],
  ['เลขนัยสำคัญใช้เพื่ออะไร',['บอกความละเอียดของเครื่องมือวัดและความเที่ยงของข้อมูล','บอกหน่วยของการวัด','ทำให้ตัวเลขดูสวยงาม','บอกค่าที่แท้จริงทุกครั้ง'],'ใช้ระบุค่าประมาณ บ่งบอกความละเอียดของอุปกรณ์ที่ใช้วัด และแสดงความแม่นยำภายในความเที่ยงของเครื่องมือ','easy',7],
  ['ตัวเลขตัวสุดท้ายของค่าที่อ่านจากการวัดเรียกว่าอะไร',['ตัวเลขที่ไม่แน่นอน (uncertainty) ได้จากการกะประมาณ','ตัวเลขที่แน่นอน (certainty)','ตัวเลขที่ไม่ใช่เลขนัยสำคัญ','ตัวเลขที่ต้องตัดทิ้งเสมอ'],'ตัวเลขทุกตัวที่บันทึกเป็นเลขนัยสำคัญ แต่ตัวสุดท้ายเป็นค่าที่กะประมาณเองเพราะอยู่ระหว่างขีด','mid',7],
  ['เครื่องมือที่มีขีดละเอียดกว่าจะให้ผลอย่างไร',['ได้ตัวเลขที่มีเลขนัยสำคัญมากกว่า','ได้เลขนัยสำคัญน้อยกว่า','จำนวนเลขนัยสำคัญเท่าเดิม','อ่านค่าไม่ได้'],'เช่น กระบอกตวงขีดละ 1 อ่านได้ 78.5 (3 ตัว) แต่บีกเกอร์ขีดละ 10 อ่านได้ 78 (2 ตัว)','easy',8],
  ['เลข 0 ในตำแหน่งใด "ไม่" นับเป็นเลขนัยสำคัญ',['0 ที่นำหน้าเลขตัวแรก เช่น 0.0023','0 ที่อยู่ระหว่างเลข เช่น 202','0 ท้ายหลังจุดทศนิยม เช่น 12.50','0 ในเลขหน้า ×10 เช่น 2.50 ×10³'],'0 ที่นำหน้าเลขตัวแรกทั้งซ้ายและหลังจุดทศนิยมไม่มีนัยสำคัญ (ข้อ 4)','mid',8],
  ['ทำไม 2500 จึงบอกจำนวนเลขนัยสำคัญแน่นอนไม่ได้',['0 ท้ายจำนวนเต็มอาจเป็นหรือไม่เป็นเลขนัยสำคัญก็ได้','เพราะไม่มีจุดทศนิยมจึงไม่มีเลขนัยสำคัญ','เพราะ 0 ทุกตัวไม่นับ','เพราะเป็นเลขคู่'],'2500 มีได้ 2 ถึง 4 ตัว ถ้าต้องการให้ชัดให้เขียนเป็น 2.5×10³ (2 ตัว) 2.50×10³ (3 ตัว) หรือ 2.500×10³ (4 ตัว)','mid',8],
  ['เครื่องชั่งความไว 0.001 g ชั่งสาร 60 mg ต้องบันทึกอย่างไร',['0.0600 g','0.060 g','0.06000 g','0.06 g'],'บันทึกถึงหลักที่เครื่องชั่งบอกได้ (3 ตำแหน่ง) แล้วเพิ่มตัวประมาณอีก 1 หลัก = 0.0600 g ส่วน 0.06000 g ละเอียดเกินจริง','mid',10],
  ['การบวกและการลบ ผลลัพธ์ต้องมีอะไรเท่ากับตัวที่น้อยที่สุด',['จำนวนตำแหน่งหลังจุดทศนิยม','จำนวนเลขนัยสำคัญ','จำนวนหลักทั้งหมด','จำนวนเลข 0'],'บวกลบดูตำแหน่งทศนิยมน้อยที่สุด ส่วนคูณหารดูจำนวนเลขนัยสำคัญน้อยที่สุด','easy',14],
  ['การคูณและการหาร ผลลัพธ์ต้องมีอะไรเท่ากับตัวที่น้อยที่สุด',['จำนวนเลขนัยสำคัญ','จำนวนตำแหน่งทศนิยม','จำนวนหลักหน้าจุด','จำนวนเลขคี่'],'คูณหารให้ผลลัพธ์มีจำนวนเลขนัยสำคัญเท่ากับตัวที่มีเลขนัยสำคัญน้อยที่สุด','easy',14],
  ['ควรปัดตัวเลขตอนไหนเมื่อคำนวณหลายขั้น',['ปัดตอนท้ายครั้งเดียว','ปัดทุกขั้นตอน','ปัดก่อนเริ่มคำนวณ','ไม่ต้องปัดเลย'],'คำนวณตามปกติให้เสร็จก่อน แล้วค่อยปัดตอนท้ายครั้งเดียวเพื่อไม่ให้ความคลาดเคลื่อนสะสม','mid',16],
  ['2.85 ต้องการเลขนัยสำคัญ 2 ตัว ใช้กฎข้อใด',['5 พอดีไม่มีเลขตาม เลขหน้าเป็นคู่ จึงตัดทิ้งได้ 2.8','5 ขึ้นไปปัดขึ้นเสมอ ได้ 2.9','ตัดทิ้งทุกกรณี ได้ 2.8','เลขหน้าเป็นคู่ ปัดขึ้นได้ 2.9'],'ตัวเลขที่พิจารณาคือ 5 และไม่มีเลขต่อท้าย เลขหน้า 5 คือ 8 เป็นเลขคู่ จึงตัด 5 ทิ้งเฉยๆ ได้ 2.8','hard',11],
  ['ตัวเลขที่พิจารณาคือ 5 และมีเลขที่ไม่ใช่ 0 ตามหลัง ต้องทำอย่างไร',['ปัดขึ้นเสมอ','ดูเลขหน้าว่าคู่หรือคี่','ตัดทิ้งเสมอ','ปัดลงเสมอ'],'เพราะค่าที่ตัดทิ้งมากกว่าครึ่ง เช่น 0.2352 → 2 ตัว ได้ 0.24','mid',11],
  ['2,376.55 ต้องการเลขนัยสำคัญ 2 ตัว ควรตอบข้อใด',['2.4 × 10³','24','2.3 × 10³','2,376'],'ห้ามตอบ 24 เพราะค่าเปลี่ยน ต้องเขียน 2.4 × 10³ หรือ 2,400 ซึ่งแบบยกกำลังสิบบอกจำนวนเลขนัยสำคัญได้ชัดกว่า','hard',16],
  ['ตวงสาร 5 mL ด้วยกระบอกตวงที่อ่านได้ต่ำสุด 0.1 mL ต้องบันทึกอย่างไร',['5.00 mL','5.0 mL','5 mL','5.000 mL'],'เลข 0 ตัวแรกหลังจุดอ่านได้จากขีด และ 0 ตัวท้ายเป็นค่าประมาณ จึงบันทึก 5.00 mL','mid',11],
  ['ระบบเลขโรมันมีเลข 0 หรือไม่',['ไม่มี','มี เขียนด้วย O','มี เขียนด้วย N','มีเฉพาะในใบสั่งยา'],'ระบบเลขโรมันไม่มีสัญลักษณ์แทนเลข 0','easy',3],
  ['L มีค่าเท่าไร',['50','500','5','100'],'I 1 · V 5 · X 10 · L 50 · C 100 · D 500 · M 1,000','easy',3],
  ['D มีค่าเท่าไร',['500','50','1,000','5,000'],'D = 500 ส่วน M = 1,000','easy',3],
  ['C มีค่าเท่าไร',['100','1,000','50','500'],'C = 100 (มาจาก centum)','easy',3],
  ['ss ในใบสั่งยามาจากคำว่าอะไร',['semis ภาษาละติน แปลว่าครึ่ง','single แปลว่าหนึ่ง','semi-solid กึ่งแข็ง','sixteen สิบหก'],'ss มาจาก semis แปลว่าครึ่ง จึงมีค่า ½','easy',3],
  ['iss ในใบสั่งยามีค่าเท่าไร',['1½','½','2','11'],'i = 1 รวมกับ ss = ½ จึงได้ 1½','mid',3],
  ['เลขโรมันเขียนด้วยตัวพิมพ์แบบใดได้',['ตัวพิมพ์เล็กหรือใหญ่ก็ได้','ตัวพิมพ์ใหญ่เท่านั้น','ตัวพิมพ์เล็กเท่านั้น','ต้องมีขีดบนทุกตัว'],'เขียนได้ทั้งตัวพิมพ์เล็กและใหญ่ เช่น xii = XII = 12','easy',3],
  ['ตามหลักการเพิ่ม ต้องเรียงตัวเลขโรมันอย่างไร',['จากค่ามากไปค่าน้อย','จากค่าน้อยไปค่ามาก','เรียงแบบใดก็ได้','เรียงตามลำดับตัวอักษร'],'หลักการเพิ่ม: เรียงจากมากไปน้อย แล้วนำค่ามาบวกกัน เช่น CXII = 100+10+1+1','easy',4],
  ['เลขโรมันตัวใด "ห้าม" ใช้เป็นตัวลบ',['V','I','X','C'],'ตัวลบมีแค่ I X C ส่วน V L D ใช้เป็นตัวลบไม่ได้','easy',4],
  ['เขียน 40 เป็นเลขโรมันข้อใดถูก',['XL','XXXX','LX','VVVV'],'ซ้ำได้ไม่เกิน 3 ตัว จึงใช้หลักการลด 50 − 10 = XL (LX คือ 60)','easy',4],
  ['เขียน 49 เป็นเลขโรมันข้อใดถูก',['XLIX','IL','XLVIIII','LIX'],'I ลบได้แค่จาก V และ X ห้ามเขียน IL ต้องเป็น 40 + 9 = XL + IX','mid',4],
  ['เขียน 990 เป็นเลขโรมันข้อใดถูก',['CMXC','XM','DCCCCXC','CMLXL'],'X ลบได้แค่จาก L และ C ห้ามเขียน XM ต้องเป็น 900 + 90 = CM + XC','mid',4],
  ['เขียน 400 เป็นเลขโรมันข้อใดถูก',['CD','CCCC','DC','DCCCC'],'C ลบจาก D ได้ 500 − 100 = CD (DC คือ 600)','easy',4],
  ['ทำไม VX จึงใช้แทน 5 ไม่ได้',['เพราะ V ไม่ใช่ตัวลบ','เพราะ V ลบได้เฉพาะจาก L','เพราะเขียนซ้ำเกิน 3 ตัว','เพราะต้องมีขีดบน'],'ตัวลบมีแค่ I X C ดังนั้น 5 ต้องเขียน V ตัวเดียว','mid',4],
  ['XC = 90 ถูกต้องตามกฎข้อใด',['X ลบได้จาก L และ C ซึ่งเป็นค่าถัดไป 2 ค่า','X ลบได้จากทุกตัวที่มากกว่า','เป็นหลักการเพิ่ม 10 + 100','C เป็นตัวลบ'],'หลักการลด: ตัวลบ I X C ลบได้จากเลขที่ค่าถัดไป 2 ค่าเท่านั้น X จึงลบได้จาก L และ C','mid',4],
  ['ข้อใดมีค่ามากที่สุด',['MCM','MCC','MCD','MXC'],'MCM = 1,900 · MCC = 1,200 · MCD = 1,400 · MXC = 1,090','mid',4],
  ['ข้อใดเขียนผิดหลักเลขโรมัน',['IIII','XIV','XLIV','CDXC'],'ตัวเดียวกันซ้ำได้ไม่เกิน 3 ตัว 4 ต้องเขียน IV','easy',4],
  ['V̄ มีค่าเท่าไร',['5,000','500','50,000','5'],'ขีดบนคูณ 1,000 → 5 × 1,000 = 5,000','easy',5],
  ['I̅ (I ขีดบน) มีค่าเท่ากับตัวใด',['M','D','C','X'],'1 × 1,000 = 1,000 เท่ากับ M','easy',5],
  ['C̄ มีค่าเท่าไร',['100,000','10,000','1,000,000','1,000'],'100 × 1,000 = 100,000','easy',5],
  ['M̄ มีค่าเท่าไร',['1,000,000','100,000','10,000','1,000'],'1,000 × 1,000 = 1,000,000','mid',5],
  ['ขีดบนตัวเลขโรมันนิยมใช้เมื่อใด',['เมื่อจำนวนมากกว่า 3,999','เมื่อเป็นเลขคี่','เมื่อเป็นทศนิยม','เมื่อเป็นเลขติดลบ'],'MMM = 3,000 ซ้ำได้สูงสุด 3 ตัว จำนวนตั้งแต่ 4,000 ขึ้นไปจึงใช้ขีดบนแทนการคูณ 1,000','mid',5],
  ['การบวก ลบ คูณ หาร เลขโรมันต้องทำอย่างไร',['แปลงเป็นเลขอารบิกก่อน แล้วจึงคำนวณ','บวกตัวอักษรตรงๆ','ตัดตัวที่ซ้ำกันออก','คำนวณทีละตัวจากขวาไปซ้าย'],'แปลงเป็นอารบิกก่อน เช่น MC × VIII = 1,100 × 8 = 8,800','easy',7],
  ['เลขนัยสำคัญ (significant figures) หมายถึงข้อใด',['ตัวเลขทุกตัวที่ได้จากการวัด รวมตัวสุดท้ายที่กะประมาณ','เฉพาะตัวเลขที่แน่นอน','เฉพาะตัวเลขหลังจุดทศนิยม','เฉพาะตัวเลขที่ไม่ใช่ 0'],'ตัวเลขที่อ่านได้แน่นอนทั้งหมด รวมกับตัวสุดท้ายที่กะประมาณ 1 ตัว','easy',7],
  ['ค่าที่บันทึกจากการวัด มีตัวเลขที่ไม่แน่นอนกี่ตัว',['1 ตัว คือตัวสุดท้าย','2 ตัวสุดท้าย','ไม่มีเลย','ทุกตัว'],'บันทึกถึงขีดที่ละเอียดที่สุด แล้วกะประมาณเพิ่มอีก 1 หลัก ตัวนั้นเป็นตัวที่ไม่แน่นอน','mid',7],
  ['เลข 1 ถึง 9 นับเป็นเลขนัยสำคัญหรือไม่',['นับเสมอ','นับเฉพาะหลังจุดทศนิยม','นับเฉพาะหน้าจุดทศนิยม','ไม่นับ'],'กฎข้อ 1: ตัวเลขที่ไม่ใช่ 0 นับเป็นเลขนัยสำคัญทุกตัว','easy',8],
  ['เลข 0 ที่อยู่ระหว่างเลขอื่น เช่น 2002',['นับเป็นเลขนัยสำคัญ','ไม่นับ','นับเฉพาะตัวแรก','ขึ้นกับเครื่องมือ'],'0 ระหว่างเลขที่ไม่ใช่ 0 นับเสมอ 2002 จึงมี 4 ตัว','easy',8],
  ['เลข 0 ท้ายหลังจุดทศนิยม เช่น 12.50',['นับเป็นเลขนัยสำคัญ','ไม่นับ','บอกไม่ได้','นับเฉพาะเมื่อมีหน่วย'],'0 ท้ายหลังจุดทศนิยมแสดงความละเอียดของการวัด จึงนับ 12.50 มี 4 ตัว','easy',8],
  ['0.00450 มีเลขนัยสำคัญกี่ตัว',['3 ตัว','5 ตัว','6 ตัว','2 ตัว'],'0 นำหน้าไม่นับ เหลือ 4 5 0 โดย 0 ท้ายหลังจุดนับ = 3 ตัว','mid',8],
  ['100.0 มีเลขนัยสำคัญกี่ตัว',['4 ตัว','1 ตัว','3 ตัว','บอกไม่ได้'],'0 ท้ายหลังจุดนับ และ 0 ที่อยู่ระหว่าง 1 กับ 0 ตัวนั้นก็นับ = 4 ตัว','mid',8],
  ['ข้อใดมีเลขนัยสำคัญ 4 ตัวแน่นอน',['2.500 × 10³','2500','0.0025','25.0'],'2500 บอกไม่ได้แน่ (2-4 ตัว) · 0.0025 มี 2 ตัว · 25.0 มี 3 ตัว','mid',8],
  ['ต้องการบอกว่า 2500 มีเลขนัยสำคัญ 3 ตัว ควรเขียนอย่างไร',['2.50 × 10³','2.5 × 10³','2.500 × 10³','25 × 10²'],'เขียนแบบยกกำลังสิบ ส่วนหน้ามี 3 ตัว คือ 2.50','mid',8],
  ['ตัวเลขในรูป a × 10ⁿ นับเลขนัยสำคัญจากส่วนใด',['เฉพาะ a','เฉพาะ 10ⁿ','ทั้ง a และ n','เฉพาะ n'],'นับเฉพาะ a เช่น 2566 × 10⁻⁴ มี 4 ตัว','easy',8],
  ['บีกเกอร์ขีดละ 10 mL ระดับอยู่ระหว่าง 70 กับ 80 ค่อนไปทาง 80 ควรบันทึกแบบใด',['78 mL','78.5 mL','80 mL','70 mL'],'ขีดละเอียดสุดคือหลักสิบ จึงกะประมาณได้แค่หลักหน่วย ได้ 78 mL (2 ตัว)','mid',8],
  ['กระบอกตวงขีดละ 1 mL บันทึกค่าได้ละเอียดถึงหลักใด',['ทศนิยม 1 ตำแหน่ง','จำนวนเต็ม','ทศนิยม 2 ตำแหน่ง','หลักสิบ'],'อ่านได้ถึงหลักหน่วยจากขีด แล้วกะประมาณเพิ่ม 1 หลัก เช่น 34.5 mL','mid',10],
  ['อ่านปริมาตรของเหลวในกระบอกตวงต้องอ่านที่ตำแหน่งใด',['ท้องโค้ง (meniscus) ของผิวของเหลว','ขอบบนสุดของของเหลว','ขอบปากกระบอก','ก้นกระบอก'],'มองระดับสายตาตรงกับท้องโค้งของผิวของเหลว','easy',10],
  ['"ตัวเลขที่พิจารณา" ในการปัดเลข คือตัวใด',['ตัวแรกที่จะถูกตัดทิ้ง','ตัวสุดท้ายที่เก็บไว้','ตัวแรกทางซ้ายสุด','ตัวที่มีค่ามากที่สุด'],'ดูตัวแรกที่จะถูกตัดทิ้ง แล้วใช้กฎ มากกว่า 5 / น้อยกว่า 5 / 5 พอดี','easy',11],
  ['ถ้าตัวเลขที่พิจารณามากกว่า 5 ต้องทำอย่างไร',['ปัดขึ้น','ตัดทิ้ง','ดูเลขหน้าว่าคู่หรือคี่','ปัดลง'],'เช่น 2.46 → 2 ตัว ได้ 2.5','easy',11],
  ['ถ้าตัวเลขที่พิจารณาน้อยกว่า 5 ต้องทำอย่างไร',['ตัดทิ้ง (ปัดลง)','ปัดขึ้น','ดูเลขหน้าว่าคู่หรือคี่','เติม 0 แทน'],'เช่น 2.43 → 2 ตัว ได้ 2.4','easy',11],
  ['5 พอดีไม่มีเลขตาม และเลขหน้าเป็นเลขคี่ ต้องทำอย่างไร',['ปัดขึ้นให้เป็นเลขคู่','ตัดทิ้ง','ปัดลง','เก็บเลข 5 ไว้'],'เช่น 3.975 → 3 ตัว เลขหน้าคือ 7 (คี่) ปัดขึ้นได้ 3.98','mid',11],
  ['3.975 ต้องการเลขนัยสำคัญ 3 ตัว',['3.98','3.97','4.0','3.975'],'ตัวที่พิจารณาคือ 5 พอดี เลขหน้า 7 เป็นคี่ จึงปัดขึ้น','mid',11],
  ['0.8250 ต้องการเลขนัยสำคัญ 2 ตัว',['0.82','0.83','0.8','0.825'],'5 ตามด้วย 0 ถือว่าเป็น 5 พอดี เลขหน้า 2 เป็นคู่ จึงตัดทิ้ง','hard',11],
  ['0.2352 ต้องการเลขนัยสำคัญ 2 ตัว',['0.24','0.23','0.235','0.2'],'ตัวที่พิจารณาคือ 5 และมี 2 ตามหลัง (ไม่ใช่ 0) จึงปัดขึ้นเสมอ','mid',11],
  ['กรณี 5 พอดี ทำไมจึงให้ผลลงท้ายด้วยเลขคู่',['ให้โอกาสปัดขึ้นและปัดลงพอๆ กัน ลดความคลาดเคลื่อนสะสม','เพราะเลขคู่หารด้วย 2 ลงตัว','เพราะเครื่องชั่งอ่านได้แค่เลขคู่','เพื่อให้ได้เลขนัยสำคัญมากขึ้น'],'ถ้าปัดขึ้นทุกครั้ง ผลรวมจะเอียงขึ้นเรื่อยๆ การปัดให้เป็นเลขคู่ช่วยให้สมดุล','hard',11],
  ['การคำนวณแบบใดใช้กฎ "ตำแหน่งทศนิยมน้อยที่สุด"',['การบวกและการลบ','การคูณและการหาร','การยกกำลัง','ทุกการคำนวณ'],'บวกลบดูตำแหน่งทศนิยม คูณหารดูจำนวนเลขนัยสำคัญ','easy',14],
  ['12.1 + 0.035 + 3.24 ควรตอบอย่างไร',['15.4','15.375','15.38','15'],'ได้ 15.375 ตัวที่มีทศนิยมน้อยสุดคือ 12.1 (1 ตำแหน่ง) จึงปัดเป็น 15.4','mid',14],
  ['2.0 × 3.00 × 4.000 ผลลัพธ์ควรมีเลขนัยสำคัญกี่ตัว',['2 ตัว','3 ตัว','4 ตัว','9 ตัว'],'คูณหารดูตัวที่มีเลขนัยสำคัญน้อยที่สุด คือ 2.0 (2 ตัว) ตอบ 24','mid',14],
  ['4.0 × 2.555 ควรตอบอย่างไร',['1.0 × 10¹','10.22','10.2','1 × 10¹'],'ได้ 10.22 ต้องการ 2 ตัวตาม 4.0 ตอบ 10 ไม่ชัดว่ามีกี่ตัว จึงเขียน 1.0 × 10¹','hard',16],
  ['ทำไมไม่ควรปัดเลขทุกขั้นตอน',['ความคลาดเคลื่อนจากการปัดจะสะสม ทำให้ผลเพี้ยน','เพราะเสียเวลา','เพราะผิดกฎเลขโรมัน','เพราะได้เลขนัยสำคัญมากเกินไป'],'ให้คำนวณจนเสร็จ แล้วปัดตอนท้ายครั้งเดียว','mid',16]
];
const CROM=new Set([0,1,2,3,4,5,6,...Array.from({length:23},(_,k)=>20+k)]);
function bConcept(i){ const [st,opts,why,lv,pg]=CONCEPT[i]; const sh=shuf(opts);
  const q=mkQ('concept',lv,st,'',[F('num',opts[0])],[why],{sub:'c'+i,pg}); q.mc={opts:sh,ans:sh.indexOf(opts[0])}; q.mcOnly=true; q.plain=true; return q; }

/* ---------- ตัวสุ่มโจทย์ ---------- */
const decStr=(sig,dp,ip=null)=>{ for(;;){ const intLen=ip!=null?ip:Math.max(1,sig-dp); let s=''; for(let i=0;i<sig;i++) s+=i===0?ri(1,9):ri(0,9);
  if(dp>=sig){ return '0.'+'0'.repeat(dp-sig)+s; } const a=s.slice(0,sig-dp), b=s.slice(sig-dp); const r=a+(b?'.'+b:''); if(!/\.\d*0$/.test(r)||Math.random()<.3) return r; } };
const GEN={
  r2a(lv){ let n; if(lv==='easy'){ do{ n=pick([ri(1,39),ri(50,89),ri(100,399),ri(1000,3399)]); }while(/(IV|IX|XL|XC|CD|CM)/.test(romanSmall(n))); } else if(lv==='mid'){ do{ n=ri(40,3999); }while(!/(IV|IX|XL|XC|CD|CM)/.test(romanSmall(n))); } else n=ri(4000,49999); return bR2A(toRoman(n),lv); },
  a2r(lv){ let n=lv==='easy'?ri(1,388):lv==='mid'?ri(40,3999):ri(4000,49999); if(lv==='easy') while(/(IV|IX|XL|XC|CD|CM)/.test(romanSmall(n))) n=ri(1,388); if(lv==='mid') while(!/(IV|IX|XL|XC|CD|CM)/.test(romanSmall(n))) n=ri(40,3999); return bA2R(n,lv); },
  rcalc(lv){ let a,b,op;
    if(lv==='easy'){ a=ri(10,400); b=ri(5,300); op=pick(['+','-']); if(op==='-'&&b>a)[a,b]=[b,a]; if(a===b) a+=7; return bRCalc(toRoman(a)+op+toRoman(b),lv); }
    if(lv==='mid'){ op=pick(['×','÷','-']); if(op==='×'){a=ri(11,120);b=ri(2,12);} else if(op==='÷'){b=ri(2,12);a=b*ri(3,90);} else {a=ri(400,1999);b=ri(100,a-50);} return bRCalc(toRoman(a)+op+toRoman(b),lv); }
    const k=pick(['big','three']); if(k==='big'){ a=ri(5000,9999); b=ri(4000,a-200); return bRCalc(toRoman(a)+'-'+toRoman(b),lv); }
    a=ri(200,900); b=ri(20,a-50); const c=ri(100,900); return bRCalc(toRoman(a)+'-'+toRoman(b)+'+'+toRoman(c),lv); },
  sfcount(lv){ let s;
    if(lv==='easy') s=pick([decStr(ri(2,4),ri(1,3)),String(ri(11,9999)).replace(/0/g,()=>String(ri(1,9)))]);
    else if(lv==='mid') s=pick([`0.${'0'.repeat(ri(1,4))}${ri(1,9)}${ri(0,9)}${Math.random()<.5?ri(1,9):''}`,`${ri(1,9)}0${ri(1,9)}${Math.random()<.5?'.'+ri(1,9):''}`,`${ri(1,99)}.${ri(1,9)}${'0'.repeat(ri(1,2))}`,`0.${ri(1,9)}${ri(1,9)}00`,`${ri(1,9)}00${ri(1,9)}.0${ri(1,9)}`]);
    else s=pick([`${ri(1,9)}${ri(1,9)}${'0'.repeat(ri(1,4))}`,`${decStr(ri(2,4),ri(1,3),1)}x10^${pick([2,3,-3,-4,4])}`,`${ri(11,999)}x10^${pick([-4,-2,2,3])}`,`${ri(1,9)}.${ri(1,9)}0x10^${ri(2,5)}`]);
    return bSFCount(s,lv); },
  round(lv){ for(let t=0;t<40;t++){ let s,k;
      if(lv==='easy'){ k=ri(2,3); s=decStr(k+ri(1,2),ri(1,3)); }
      else if(lv==='mid'){ k=ri(2,3); const base=decStr(k,ri(1,k)); s=base+'5'; if(!base.includes('.')) s=base+'.5'; }
      else { const v=pick(['more','zero','lead','sci']); k=ri(2,3);
        if(v==='more'){ const b=decStr(k,ri(1,k)); s=(b.includes('.')?b:b+'.')+'5'+ri(1,9)+(Math.random()<.5?ri(0,9):''); }
        else if(v==='zero'){ const b=decStr(k,ri(1,k)); s=(b.includes('.')?b:b+'.')+'5'+'0'.repeat(ri(1,2)); }
        else if(v==='lead'){ s='0.'+'0'.repeat(ri(1,3))+String(ri(100,9999)); }
        else { k=2; s=String(ri(1100,99999))+(Math.random()<.5?'.'+ri(1,9)+ri(0,9):''); } }
      const R=roundInfo(s,'sig',k); if(R.rule==='pad') continue; if(lv==='easy'&&R.rule!=='gt'&&R.rule!=='lt') continue; if(lv==='mid'&&!/^5(odd|even)$/.test(R.rule)) continue;
      return bRound(s,k,lv); } return bRound('2.769',3,lv); },
  sfcalc(lv){ for(let t=0;t<60;t++){ let e;
      if(lv==='easy'){ const a=decStr(ri(3,5),ri(1,3)), b=decStr(ri(2,4),ri(0,2)); e=Math.random()<.6?`${a} + ${b}`:(+a>+b?`${a} - ${b}`:`${b} - ${a}`); }
      else if(lv==='mid'){ const a=decStr(ri(2,4),ri(1,3)), b=decStr(ri(2,5),ri(1,3)); e=Math.random()<.6?`${a} x ${b}`:`${a} ÷ ${b}`; }
      else { if(Math.random()<.5){ const a=decStr(ri(3,4),ri(1,2)),b=decStr(ri(3,4),ri(1,3)),c=decStr(ri(2,3),ri(1,2)); e=`(${a} x ${b}) ÷ ${c}`; }
        else { const a=String(ri(2,99)), b=decStr(ri(3,4),ri(1,2)), c=decStr(ri(4,6),ri(2,5)); e=`${a} + ${b} + ${c}`; } }
      const q=bSFCalc(e,lv); if(/^5/.test(q.rule)||/^-/.test(q.fields[0].show)) continue; return q; } return bSFCalc('2.45 x 3.2',lv); },
  record(lv){ const r=Math.random();
    if(r<.55){ const step=lv==='easy'?10:lv==='mid'?1:0.1; let v;
      if(step===10) v=ri(1,4)*10+ri(1,9); else if(step===1) v=ri(12,45)+ri(1,9)/10; else v=+(ri(2,7)+ri(1,9)/10+ri(1,9)/100).toFixed(2);
      return bCylinder(step,v,lv); }
    if(r<.8){ const a=lv==='easy'?0.01:pick([0.001,0.01,0.1]); const b=a===0.1?ri(2,9)*100:pick([ri(1,9)*10,ri(11,99)*10,ri(101,999)]); return bRecord('bal',a,b,lv); }
    const a=pick([0.1,1]); return bRecord('vol',a,a===1?ri(5,45):ri(2,9),lv); },
  concept(lv){ const ids=CONCEPT.map((c,i)=>i).filter(i=>lv==='mix'||CONCEPT[i][3]===lv); return bConcept(pick(ids.length?ids:CONCEPT.map((c,i)=>i))); }
};

/* ---------- ชุดแบบฝึกหัดในชีท (ข้อ 1 ถึง 4.4) ---------- */
function setSheet(){ const S=o=>({src:'ชีทแบบฝึกหัด',...o}); return [
  ...[18,450,1582,34444].map(n=>bA2R(n,null,S({no:'ข้อ 1'}))),
  ...['V~MMCMXLIII','X~X~MMMCMXII','CMLXXIV','LXIV'].map(r=>bR2A(r,null,S({no:'ข้อ 2'}))),
  ...['CCLI+CXXXII','DCCLXVIII-CDLII','CDXLIV-LXXVII+DC','V~MMMDCXLIX-V~DCCXXXVIII','XL×VI','LXXII÷IX'].map(e=>bRCalc(e,null,S({no:'ข้อ 3'}))),
  ...['4.76','0.0065','7200','0.203','4.730','785x10^-4','25x10^2'].map(s=>bSFCount(s,null,S({no:'ข้อ 4'}))),
  bCylinder(10,28,'mid',S({no:'แนวข้อ 5'})),
  ...[['2.769',3],['2.432',2],['725.08',3],['0.00234',3],['19.76',3],['54.674876',4],['0.8765',2]].map(([s,k])=>bRound(s,k,null,S({no:'ข้อ 4.3'}))),
  ...['2.823 + 586.3','(55.2 x 12.333) ÷ 6.1','80.25 - 75.1','6 + 3.17 + 4.356194','2.45 x 3.2','(26.5 ÷ 4.0) x 1.1','703 + 8 + 0.87','14.28 ÷ 0.714','28.326 + 8.97 + 3.0','562.9 - 328.26','72.4 x 0.084'].map(e=>bSFCalc(e,null,S({no:'ข้อ 4.4'})))
];}
/* ---------- ชุดตัวอย่างในสไลด์ ---------- */
function setSlide(){ const S=(pg)=>({src:'ตัวอย่างในสไลด์',pg}); return [
  ...['II','VII','LX','CXII','CXXXVI','MCCCLXVII'].map(r=>bR2A(r,null,S(4))),
  ...[95,420,7240,2530000].map(n=>bA2R(n,null,S(6))),
  ...['MMLV','V~II','LXV','MIX'].map(r=>bR2A(r,null,S(6))),
  ...['LXVII+CLXVI','XXXIII-XII','MC×VIII','CM÷IX'].map(e=>bRCalc(e,null,S(7))),
  ...['1.212','2002','200.01','12.50','0.1200','0.0001200','0.00004','66','5.66','560000','2566.6','6.6x10^2','2566x10^-4','231','0.0025','3679','0.000005','6500'].map(s=>bSFCount(s,null,S(8))),
  bRecord('vol',0.1,5,null,S(11)), bRecord('bal',0.001,60,null,S(10)), bRecord('bal',0.01,60,null,S(10)), bRecord('vol',1,19,null,S(11)), bCylinder(10,34,null,S(10)), bCylinder(1,34.5,null,S(10)),
  ...[['2.46',2],['2.43',2],['2.85',2],['3.975',3],['0.2352',2],['0.8250',2],['2.78',2],['2.51',2],['7.265',3],['6.305',3],['6.45',2],['6.7835',4],['3.335',3],['2.75',2],['8.5654',3],['5.253',2],['4.8754',3],['6.56650',4],['4.250',2]].map(([s,k])=>bRound(s,k,null,S(12))),
  ...['12.45 + 134.324 + 60.4786','51.43 + 2.0','123.01 + 1.2 - 50.00000','23.2 x 35.45','12.3 ÷ 22.4','432.10 x 5.5','3.45 x 160.6531','0.6214 ÷ 4.52','5.432 ÷ 0.7'].map(e=>bSFCalc(e,null,S(15)))
];}

/* ===================== ชุดข้อสอบเพิ่มเติม: แนวชีท 20 ชุด + แนวสไลด์ 20 ชุด (ตัวเลขคงที่ทุกครั้งที่เปิด) ===================== */
const NSETS=20;
function seeded(seed,fn){ let a=seed>>>0; const rng=()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
  const orig=Math.random; Math.random=rng; try{ return fn(); } finally{ Math.random=orig; } }
/* โครงเหมือนชีท: ข้อ 1 ถึง 4.4 รวม 40 ข้อ */
const SHEET_PLAN=[['a2r','easy','ข้อ 1'],['a2r','mid','ข้อ 1'],['a2r','mid','ข้อ 1'],['a2r','hard','ข้อ 1'],
  ['r2a','hard','ข้อ 2'],['r2a','hard','ข้อ 2'],['r2a','mid','ข้อ 2'],['r2a','mid','ข้อ 2'],
  ['rcalc','easy','ข้อ 3'],['rcalc','easy','ข้อ 3'],['rcalc','hard','ข้อ 3'],['rcalc','hard','ข้อ 3'],['rcalc','mid','ข้อ 3'],['rcalc','mid','ข้อ 3'],
  ['sfcount','easy','ข้อ 4'],['sfcount','mid','ข้อ 4'],['sfcount','hard','ข้อ 4'],['sfcount','mid','ข้อ 4'],['sfcount','mid','ข้อ 4'],['sfcount','hard','ข้อ 4'],['sfcount','hard','ข้อ 4'],
  ['cyl',null,'ข้อ 5'],
  ['round','easy','ข้อ 4.3'],['round','easy','ข้อ 4.3'],['round','easy','ข้อ 4.3'],['round','hard','ข้อ 4.3'],['round','mid','ข้อ 4.3'],['round','easy','ข้อ 4.3'],['round','hard','ข้อ 4.3'],
  ['sfcalc','easy','ข้อ 4.4'],['sfcalc','hard','ข้อ 4.4'],['sfcalc','easy','ข้อ 4.4'],['sfcalc','hard','ข้อ 4.4'],['sfcalc','mid','ข้อ 4.4'],['sfcalc','hard','ข้อ 4.4'],['sfcalc','hard','ข้อ 4.4'],['sfcalc','mid','ข้อ 4.4'],['sfcalc','hard','ข้อ 4.4'],['sfcalc','easy','ข้อ 4.4'],['sfcalc','mid','ข้อ 4.4']];
/* โครงแนวตัวอย่างในสไลด์: ไล่ตามลำดับหัวข้อในสไลด์ รวม 30 ข้อ */
const SLIDE_PLAN=[['r2a','easy'],['r2a','easy'],['r2a','mid'],['r2a','hard'],['a2r','mid'],['a2r','mid'],['a2r','hard'],['a2r','hard'],
  ['rcalc','easy'],['rcalc','mid'],['rcalc','mid'],['concept','mix'],
  ['sfcount','easy'],['sfcount','mid'],['sfcount','mid'],['sfcount','hard'],['sfcount','hard'],
  ['record','easy'],['record','mid'],['record','hard'],
  ['round','easy'],['round','easy'],['round','mid'],['round','mid'],['round','hard'],['round','hard'],
  ['sfcalc','easy'],['sfcalc','hard'],['sfcalc','mid'],['sfcalc','mid']];
function buildSet(kind,no){
  return seeded((kind==='sh'?7919:104729)*no+no*no,()=>{
    const plan=kind==='sh'?SHEET_PLAN:SLIDE_PLAN, seen=new Set(), out=[];
    for(const [t,lv,lab] of plan){ let q,g=0;
      do{ if(t==='cyl'){ const step=pick([10,10,1]), v=step===10?ri(1,4)*10+ri(1,9):ri(12,45)+ri(1,9)/10; q=bCylinder(step,v,null); } else q=GEN[t](lv); g++; }while(seen.has(q.id)&&g<20);
      seen.add(q.id); q.src=(kind==='sh'?'แนวชีท':'แนวสไลด์')+' ชุดที่ '+no; if(lab) q.no=lab; out.push(q); }
    return out; });
}

/* ===================== ข้อสอบบทที่ 1: หน้าเลือกโหมด + ผู้เล่น ===================== */
ST.qz=Object.assign({sets:{},ans:0,ok:0,best:0,tp:{},wrong:[],last:null,style:'mix',diff:'mix',n:10,tps:['r2a','a2r','rcalc','sfcount','record','round','sfcalc','concept']},ST.qz||{});
/* ===================== บทที่ 2 มาตรชั่งและตวงทางเภสัชกรรม (เล่ม 2) ===================== */
/* เลขหน้าเป็นเลขหน้าของหนังสือรวม (บทที่ 2 เริ่มหน้า 17) */
const C2P=p=>16+p;
Object.assign(QT,{
  met:{n:'ระบบเมตริก',pg:C2P(4),ch:2},
  apo:{n:'ระบบอะโปธิคารี',pg:C2P(9),ch:2},
  avo:{n:'ระบบอะวัวดูปัวส์',pg:C2P(11),ch:2},
  hh:{n:'มาตรประจำบ้าน',pg:C2P(12),ch:2},
  drop:{n:'หยดและกระบอกตวง',pg:C2P(13),ch:2},
  xs:{n:'แปลงข้ามระบบ (exact, practical)',pg:C2P(16),ch:2},
  word:{n:'โจทย์การจ่ายยา',pg:C2P(14),ch:2},
  con2:{n:'ทฤษฎีบทที่ 2',pg:C2P(3),ch:2}
});
const TP2=Object.keys(QT).filter(k=>QT[k].ch===2), TP1=Object.keys(QT).filter(k=>!QT[k].ch);
const qch=t=>{const c=(QT[t]&&QT[t].ch)||1;return c===3?2:c;};

/* ตัวเลข: ปัดตามจำนวนทศนิยม ตัด 0 ท้าย ใส่จุลภาค */
function fm(x,dp=4){ let s=(+(+x).toFixed(dp)).toString(); if(/e/.test(s)) s=(+x).toFixed(12).replace(/0+$/,'').replace(/\.$/,'');
  const neg=s[0]==='-'; if(neg) s=s.slice(1); const [i,f]=s.split('.'); return (neg?'-':'')+i.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(f?'.'+f:''); }
/* ช่องตอบตัวเลข: ตรวจด้วยค่าตัวเลข ยอมคลาดเคลื่อนได้ tol (หรือค่าอื่นใน alt เช่นค่า practical) */
function NF(val,o={}){ const dp=o.dp==null?4:o.dp, show=fm(val,dp);
  const unitTol=dp>0?0.5*Math.pow(10,-dp):0.5;
  const tol=o.tol!=null?o.tol:Math.max(unitTol,o.rel?Math.abs(val)*o.rel:0);
  const vals=[val,...(o.alt||[])];
  return F('num',show,(o.alt||[]).map(a=>fm(a,dp)),{val,vals,tol,unit:o.unit||'',lab:o.lab||''}); }
function numIn(u,unit){ if(unit) u=String(u==null?'':u).split(unit).join(''); let s=normNum(u).replace(/^[^\d.\-]+/,'').replace(/[^\d.]+$/,''); return /^-?\d*\.?\d+$/.test(s)?parseFloat(s):NaN; }
/* ช้อยส์ตัวเลข: ตัวลวงจากความผิดพลาดที่พบบ่อย */
function mc2(q,wrongVals,dp){ const right=q.fields[0].val, d=dp==null?4:dp, u=q.fields[0].unit;
  const ws=[]; for(const w of wrongVals){ if(w==null||!isFinite(w)||w<=0) continue; const s=fm(w,d); if(s==='0'||s===fm(right,d)||ws.includes(s)) continue; ws.push(s); if(ws.length>=3) break; }
  for(const k of [2,0.5,10,0.1,3,1.5]){ if(ws.length>=3) break; const s=fm(right*k,d); if(s!==fm(right,d)&&!ws.includes(s)) ws.push(s); }
  const R=fm(right,d), opts=shuf([R,...ws.slice(0,3)]).map(x=>u?x+' '+u:x); q.mc={opts,ans:opts.indexOf(u?R+' '+u:R)}; q.plain=true; return q; }
function Q2(t,lv,stem,big,fields,exp,o={}){ return mkQ(t,lv,stem,big,fields,exp,Object.assign({pg:QT[t].pg},o)); }

/* ---------- หน่วย ---------- */
const MU={ /* ระบบเมตริก: เลขชี้กำลังเทียบหน่วยพื้นฐาน */
  mass:[['kg','kilograms',3],['g','grams',0],['dg','decigrams',-1],['cg','centigrams',-2],['mg','milligrams',-3],['µg','micrograms',-6],['ng','nanograms',-9]],
  vol:[['L','liters',0],['dL','deciliters',-1],['mL','milliliters',-3],['µL','microliters',-6],['nL','nanoliters',-9]],
  len:[['km','kilometers',3],['m','meters',0],['cm','centimeters',-2],['mm','millimeters',-3],['µm','micrometers',-6],['nm','nanometers',-9]]
};
const APW=[['grains','gr.',1],['scruples','℈',20],['drams','ʒ',60],['ounces','℥',480],['pounds','lb',5760]];
const APV=[['minims','min',1],['fluid drams','fʒ',60],['fluid ounces','f℥',480],['pints','pt',7680],['quarts','qt',15360],['gallons','gal',61440]];
const nice=()=>pick([ri(1,9),ri(11,99),ri(1,9)+0.5,ri(1,9)*10,ri(1,19)*25,ri(1,99)/100,ri(101,999)/100,ri(1,9)*100+ri(1,9)*10]);

const GEN2={
  met(lv){ const kind=pick(['mass','mass','vol','vol','len']), U=MU[kind];
    if(lv==='hard'&&Math.random()<.55){ /* รวมหลายหน่วยเป็น mg แบบสไลด์ 17 */
      const a=pick([1.25,0.5,2.5,1.5,0.75,2,0.125]), b=ri(5,95), c=pick([20,50,80,250,400,750]);
      const tot=a*1000+b+c/1000;
      return withNum(Q2('met',lv,'ผสมสาร A, B และ C ตามนี้ น้ำหนักรวมเป็นกี่ milligrams',`${fm(a)} g + ${b} mg + ${c} µg`,[NF(tot,{dp:3,unit:'mg'})],
        [`เปลี่ยนทุกตัวเป็น mg ก่อน: ${fm(a)} g × 1,000 = ${fm(a*1000)} mg`,`${c} µg ÷ 1,000 = ${fm(c/1000,3)} mg`,`รวม ${fm(a*1000)} + ${b} + ${fm(c/1000,3)} = <b>${fm(tot,3)} mg</b>`],{sub:'sum'}),
        [a*1000+b+c, a*100+b+c/1000, a*1000+b+c/100, a+b/1000+c/1e6],3); }
    let i,j; for(let g=0;g<50;g++){ i=ri(0,U.length-1); j=ri(0,U.length-1); if(i===j) continue; const d=Math.abs(U[i][2]-U[j][2]);
      if(lv==='easy'&&d!==3) continue; if(lv==='mid'&&(d<1||d>6||d===3)) continue; if(lv==='hard'&&d<6) continue; break; }
    if(i===j) j=(i+1)%U.length;
    const [a,an,ae]=U[i],[b,bn,be]=U[j], e=ae-be; let v=nice(); if(Math.abs(e)>=6&&e<0) v=pick([ri(1,999)*10,ri(1,99)*100,ri(1,9)*1000]);
    const r=v*Math.pow(10,e), rr=+r.toPrecision(12); if(rr<1e-5||rr>1e10) return GEN2.met(lv);
    const f=Math.pow(10,Math.abs(e)), big=e>0;
    return withNum(Q2('met',lv,`จงเปลี่ยนหน่วย ${fm(v)} ${an} เท่ากับกี่ ${bn}`,`${fm(v)} ${a} = ? ${b}`,[NF(rr,{dp:9,unit:b})],
      [`${a} กับ ${b} ห่างกัน ${Math.abs(e)} ขั้นของสิบ (10<sup>${Math.abs(e)}</sup> = ${fm(f)})`,big?`หน่วยใหญ่ไปหน่วยเล็ก ให้คูณ (เลื่อนจุดไปทางขวา ${Math.abs(e)} ตำแหน่ง)`:`หน่วยเล็กไปหน่วยใหญ่ ให้หาร (เลื่อนจุดไปทางซ้าย ${Math.abs(e)} ตำแหน่ง)`,
       `${fm(v)} ${big?'×':'÷'} ${fm(f)} = <b>${fm(rr,9)} ${b}</b>`],{sub:a+b+v}),
      [rr*10,rr/10,rr*1000,rr/1000,v*Math.pow(10,-e)],9); },

  apo(lv){ const vol=Math.random()<.45, T=vol?APV:APW;
    if(lv==='hard'&&Math.random()<.5){ /* โจทย์จ่ายยาแบบสไลด์ 28 */
      if(!vol){ const n=pick([12,24,30,36,48,50]), g=pick([1,2,3,5]), tot=n*g, to=pick([[20,'scruples'],[60,'drams']]);
        return withNum(Q2('apo',lv,`เภสัชกรจ่ายยาเหน็บทวาร ${n} แท่ง แต่ละแท่งมีตัวยา ${g} gr. รวมตัวยาทั้งหมดกี่ ${to[1]}`,`${n} แท่ง × ${g} gr.`,[NF(tot/to[0],{dp:3,unit:to[1]})],
          [`ตัวยาทั้งหมด ${n} × ${g} = ${tot} grains`,`1 ${to[1].slice(0,-1)} = ${to[0]} grains`,`${tot} ÷ ${to[0]} = <b>${fm(tot/to[0],3)} ${to[1]}</b>`],{sub:'supp'+to[0]}),
          [tot/(to[0]===20?60:20),tot*to[0],tot/to[0]*2],3); }
      const n=pick([2,3,4,6,8]), u=pick([[60,'fluid drams','fluidrams'],[480,'fluid ounces','fluidounces']]);
      return withNum(Q2('apo',lv,`ห้องยามีสารละลายบรรจุขวดขนาด ${n} ${u[2]} เท่ากับกี่ minims`,`${n} ${u[1]} = ? minims`,[NF(n*u[0],{dp:0,unit:'minims'})],
        [`1 ${u[1].slice(0,-1)} = ${u[0]} minims`,`${n} × ${u[0]} = <b>${fm(n*u[0])} minims</b>`],{sub:'bottle'}),[n*(u[0]===60?480:60),n*16.23,n*u[0]/8],0); }
    let i,j; for(let g=0;g<40;g++){ i=ri(0,T.length-1); j=ri(0,T.length-1); if(i===j) continue; const d=Math.abs(i-j); if(lv==='easy'&&d!==1) continue; if(lv!=='easy'&&d<2) continue; break; }
    if(i===j) j=i?i-1:1;
    const [an,as,af]=T[i],[bn,bs,bf]=T[j]; let v;
    if(af>bf) v=lv==='easy'?ri(2,9):pick([ri(2,6),ri(1,4)+0.5]); else { const k=bf/af; v=lv==='easy'?k*ri(2,6):Math.round(k*pick([1,2,3,0.5,1.5,1.25,0.75,2.5])); if(v<1) v=k; }
    const r=v*af/bf, chain=T.slice(Math.min(i,j)+1,Math.max(i,j)+1).map(x=>`1 ${x[0].replace(/s$/,'')} (${x[1]}) = ${fm(x[2]/T[T.indexOf(x)-1][2])} ${T[T.indexOf(x)-1][0]}`);
    return withNum(Q2('apo',lv,`จงเปลี่ยนหน่วยในระบบอะโปธิคารี ${fm(v)} ${an} เท่ากับกี่ ${bn}`,`${fm(v)} ${an} (${as}) = ? ${bn} (${bs})`,[NF(r,{dp:3,unit:bn})],
      [`ทวนตาราง: ${chain.join(' และ ')}`,`เทียบเป็นหน่วยเล็กสุดก่อน: 1 ${an.replace(/s$/,'')} = ${fm(af)} ${T[0][0]} และ 1 ${bn.replace(/s$/,'')} = ${fm(bf)} ${T[0][0]}`,
       `${fm(v)} × ${fm(af)} ÷ ${fm(bf)} = <b>${fm(r,3)} ${bn}</b>`],{sub:an+bn+v}),
      [v*bf/af,r*10,r/10,vol?v*af/bf*(16.23/60):r*1.5,r*0.75],3); },

  avo(lv){
    if(lv==='easy'){ const k=pick(['lb2oz','oz2gr','lb2gr']), v=ri(2,6);
      const m={lb2oz:[16,'pounds (avoir)','ounces (avoir)','1 lb avoir = 16 oz'],oz2gr:[437.5,'ounces (avoir)','grains','1 oz avoir = 437.5 grains'],lb2gr:[7000,'pounds (avoir)','grains','1 lb avoir = 7,000 grains']}[k];
      return withNum(Q2('avo',lv,`ระบบอะวัวดูปัวส์ ${v} ${m[1]} เท่ากับกี่ ${m[2]}`,`${v} ${m[1]} = ? ${m[2]}`,[NF(v*m[0],{dp:1,unit:m[2]})],[m[3],`${v} × ${fm(m[0])} = <b>${fm(v*m[0],1)} ${m[2]}</b>`],{sub:k+v}),
        [v*({lb2oz:12,oz2gr:480,lb2gr:5760}[k]),v*m[0]/2,v*m[0]*1.5],1); }
    if(lv==='mid'){ const k=pick(['oz2g','lb2g','g2oz']);
      if(k==='g2oz'){ const g=pick([100,250,500,1000]); const r=g/28.35; return withNum(Q2('avo',lv,`ผงยา ${g} g คิดเป็นกี่ ounces (avoir) (1 oz avoir = 28.35 g)`,`${g} g = ? oz (avoir)`,[NF(r,{dp:2,rel:.003,unit:'oz'})],
        ['1 oz avoir = 28.35 g',`${g} ÷ 28.35 = <b>${fm(r,2)} oz</b>`],{sub:k+g}),[g/31.1,g*28.35/1000,g/30],2); }
      const v=k==='oz2g'?pick([1.5,2,3,4,0.5,2.5]):pick([2,3,1.5,5]), f=k==='oz2g'?28.35:453.6, r=v*f;
      return withNum(Q2('avo',lv,`ระบบอะวัวดูปัวส์ ${fm(v)} ${k==='oz2g'?'ounces':'pounds'} เท่ากับกี่ grams`,`${fm(v)} ${k==='oz2g'?'oz':'lb'} (avoir) = ? g`,[NF(r,{dp:2,unit:'g',rel:.002})],
        [`1 ${k==='oz2g'?'oz':'lb'} avoir = ${fm(f)} g (ระวังอย่าใช้ค่าอะโปธิคารี ${k==='oz2g'?'31.1':'373.2'} g)`,`${fm(v)} × ${fm(f)} = <b>${fm(r,2)} g</b>`],{sub:k+v}),
        [v*(k==='oz2g'?31.1:373.2),v*(k==='oz2g'?30:454)*1.1,r/1000],2); }
    const k=pick(['sachet','cmp','lbcmp']);
    if(k==='sachet'){ const per=pick([250,300,400,500,650]), mg=28350, n=Math.floor(mg/per);
      return withNum(Q2('avo',lv,`ผงยาหนัก 1 avoirdupois ounce ต้องการแบ่งบรรจุซองละ ${per} mg จะแบ่งได้เต็มกี่ซอง`,`1 oz (avoir) ÷ ${per} mg`,[NF(n,{dp:0,unit:'ซอง',tol:0})],
        ['1 oz avoir = 28.35 g = 28,350 mg',`28,350 ÷ ${per} = ${fm(mg/per,2)} ซอง`,`นับเฉพาะซองที่บรรจุเต็ม ได้ <b>${n} ซอง</b> (เหลือผงยา ${fm(mg-n*per)} mg)`],{sub:'s'+per}),
        [Math.floor(31100/per),Math.ceil(mg/per)===n?n+1:Math.ceil(mg/per),Math.floor(30000/per)],0); }
    if(k==='cmp'){ const v=pick([1,2,4]); const d=v*(480-437.5);
      return withNum(Q2('avo',lv,`ยา ${v} ounce แบบอะโปธิคารี หนักกว่า ${v} ounce แบบอะวัวดูปัวส์กี่ grains`,`${v} ℥ (apo) − ${v} oz (avoir)`,[NF(d,{dp:1,unit:'grains'})],
        ['1 ℥ (apo) = 480 grains','1 oz (avoir) = 437.5 grains',`ต่างกัน ${v} × (480 − 437.5) = <b>${fm(d,1)} grains</b>`],{sub:'c'+v}),[v*480,v*437.5,d*2],1); }
    const r=7000/480; return withNum(Q2('avo',lv,'1 pound แบบอะวัวดูปัวส์ เท่ากับกี่ ounces แบบอะโปธิคารี (℥)','1 lb (avoir) = ? ℥ (apo)',[NF(r,{dp:2,unit:'℥',tol:.01})],
      ['1 lb avoir = 7,000 grains','1 ℥ apo = 480 grains','7,000 ÷ 480 = <b>14.58 ℥</b>'],{sub:'lb'}),[16,12,7000/437.5*0.9],2); },

  hh(lv){ const H=[['ช้อนชา (tsp)',5],['ช้อนโต๊ะ (tbsp)',15],['ช้อนของหวาน (dssp)',8]];
    if(lv==='easy'){ const [n,f]=pick([H[0],H[1],H[0],H[1],H[2]]), v=pick([1,2,3,4,0.5,1.5,5]);
      return withNum(Q2('hh',lv,`${fm(v)} ${n} เท่ากับกี่ milliliters`,`${fm(v)} ${n.split(' ')[0]} = ? mL`,[NF(v*f,{dp:1,unit:'mL'})],[`1 ${n} = ${f} mL`,`${fm(v)} × ${f} = <b>${fm(v*f,1)} mL</b>`],{sub:n+v}),
        [v*(f===5?15:5),v*(f===15?30:8),v*f/2],1); }
    if(lv==='mid'){ const k=pick(['ml2tsp','ml2tbsp','tsp2tbsp','glass','cup','oz2tbsp']);
      if(k==='ml2tsp'||k==='ml2tbsp'){ const f=k==='ml2tsp'?5:15, n=f===5?'ช้อนชา':'ช้อนโต๊ะ', v=f*pick([1,2,3,0.5,1.5,4]);
        return withNum(Q2('hh',lv,`ยา ${fm(v)} mL เท่ากับกี่${n}`,`${fm(v)} mL = ? ${n}`,[NF(v/f,{dp:2,unit:n})],[`1 ${n} = ${f} mL`,`${fm(v)} ÷ ${f} = <b>${fm(v/f,2)} ${n}</b>`],{sub:k+v}),[v/(f===5?15:5),v*f,v/f*2],2); }
      if(k==='tsp2tbsp'){ const v=3*pick([1,2,3,4,5]); return withNum(Q2('hh',lv,`${v} ช้อนชา เท่ากับกี่ช้อนโต๊ะ`,`${v} tsp = ? tbsp`,[NF(v/3,{dp:2,unit:'ช้อนโต๊ะ'})],['1 ช้อนโต๊ะ = 15 mL = 3 ช้อนชา',`${v} ÷ 3 = <b>${fm(v/3)} ช้อนโต๊ะ</b>`],{sub:k+v}),[v*3,v/2,v/5],2); }
      if(k==='glass'){ const v=ri(2,5); return withNum(Q2('hh',lv,`${v} แก้ว (glass) เท่ากับกี่ fluid ounces`,`${v} glasses = ? fl oz`,[NF(v*8,{dp:0,unit:'fl oz'})],['1 แก้ว (glass) = 8 fluid ounces',`${v} × 8 = <b>${v*8} fl oz</b>`],{sub:k+v}),[v*6,v*16,v*30],0); }
      if(k==='cup'){ const v=ri(2,5); return withNum(Q2('hh',lv,`${v} coffee cups เท่ากับกี่ fluid ounces`,`${v} cups = ? fl oz`,[NF(v*6,{dp:0,unit:'fl oz'})],['1 coffee cup = 6 fluid ounces',`${v} × 6 = <b>${v*6} fl oz</b>`],{sub:k+v}),[v*8,v*4,v*12],0); }
      const v=pick([1,2,3,4,0.5]); return withNum(Q2('hh',lv,`ยา ${fm(v)} fluid ounce(s) ในมาตรประจำบ้านเท่ากับกี่ช้อนโต๊ะ`,`${fm(v)} fl oz = ? tbsp`,[NF(v*2,{dp:1,unit:'ช้อนโต๊ะ'})],['1 fluid ounce = 2 ช้อนโต๊ะ = 30 mL',`${fm(v)} × 2 = <b>${fm(v*2)} ช้อนโต๊ะ</b>`],{sub:k+v}),[v*6,v*3,v*8],1); }
    const k=pick(['total','days','spoons']);
    if(k==='total'){ const s=pick([1,2,0.5]), sp=pick([H[0],H[1]]), t=pick([2,3,4]), d=pick([5,7,10]); const tot=s*sp[1]*t*d;
      return withNum(Q2('hh',lv,`แพทย์สั่งยาน้ำครั้งละ ${fm(s)} ${sp[0]} วันละ ${t} ครั้ง นาน ${d} วัน ต้องจ่ายยาทั้งหมดกี่ mL`,`${fm(s)} ${sp[0].split(' ')[0]} × ${t} ครั้ง × ${d} วัน`,[NF(tot,{dp:1,unit:'mL'})],
        [`1 ${sp[0]} = ${sp[1]} mL ดังนั้นครั้งละ ${fm(s*sp[1])} mL`,`วันละ ${fm(s*sp[1])} × ${t} = ${fm(s*sp[1]*t)} mL`,`${d} วัน = <b>${fm(tot)} mL</b>`],{sub:k+s+sp[1]+t+d}),
        [s*(sp[1]===5?15:5)*t*d,s*sp[1]*d,s*sp[1]*t],1); }
    if(k==='days'){ const b=pick([60,100,120,150]), s=pick([1,2]), t=pick([2,3]), per=s*5*t, dd=Math.floor(b/per);
      return withNum(Q2('hh',lv,`ยาน้ำขวด ${b} mL ผู้ป่วยรับประทานครั้งละ ${s} ช้อนชา วันละ ${t} ครั้ง ยาจะพอใช้เต็มวันได้กี่วัน`,`${b} mL ÷ (${s} tsp × ${t})`,[NF(dd,{dp:0,unit:'วัน',tol:0})],
        [`ใช้วันละ ${s} × 5 × ${t} = ${per} mL`,`${b} ÷ ${per} = ${fm(b/per,2)} วัน`,`นับเฉพาะวันที่ยาพอครบ <b>${dd} วัน</b>`],{sub:k+b+s+t}),[Math.floor(b/(s*15*t)),Math.ceil(b/per)+(Math.ceil(b/per)===dd?1:0),Math.floor(b/(s*5))],0); }
    const v=pick([2,3,4]); return withNum(Q2('hh',lv,`แพทย์สั่งยาครั้งละ ${v} ช้อนโต๊ะ ผู้ป่วยมีแต่ช้อนชา ต้องตวงครั้งละกี่ช้อนชา`,`${v} tbsp = ? tsp`,[NF(v*3,{dp:0,unit:'ช้อนชา'})],
      [`1 ช้อนโต๊ะ = 15 mL และ 1 ช้อนชา = 5 mL`,`${v} ช้อนโต๊ะ = ${v*15} mL`,`${v*15} ÷ 5 = <b>${v*3} ช้อนชา</b>`],{sub:k+v}),[v*2,v*5,v*15],0); },

  drop(lv){
    if(lv==='easy'){ if(Math.random()<.5){ const c=pick([5,10,25,50,100,250,500,1000]); return withNum(Q2('drop',lv,`กระบอกตวงขนาด ${c} mL ตวงของเหลวได้น้อยที่สุดกี่ mL`,`20% ของ ${c} mL`,[NF(c*.2,{dp:1,unit:'mL'})],
        ['ปริมาตรน้อยที่สุดที่ตวงได้แม่นคือ 20% ของขนาดกระบอกตวง',`${c} × 0.20 = <b>${fm(c*.2)} mL</b>`],{sub:'cyl'+c}),[c*.1,c*.5,c*.25],1); }
      const v=pick([0.5,1,1.5,2,0.25,3]); return withNum(Q2('drop',lv,`หลอดหยดมาตรฐาน USP (20 หยดต่อ 1 mL) ยา ${fm(v)} mL เท่ากับกี่หยด`,`${fm(v)} mL = ? หยด`,[NF(v*20,{dp:1,unit:'หยด'})],
        ['หลอดหยดมาตรฐาน USP-NF: เส้นผ่านศูนย์กลาง 3 mm ได้ 20 หยดต่อ 1 mL ที่ 25 °C',`${fm(v)} × 20 = <b>${fm(v*20)} หยด</b>`],{sub:'usp'+v}),[v*10,v*15,v*60],1); }
    if(lv==='mid'){ const dr=pick([30,40,45,36,50]), ml=pick([1,2]), want=pick([0.25,0.3,0.5,0.6,0.75,0.1,1.5]); const r=dr*want/ml;
      return withNum(Q2('drop',lv,`สอบเทียบหลอดหยดพบว่า ${dr} หยด เท่ากับ ${ml} mL ต้องการยา ${fm(want)} mL ต้องหยดกี่หยด`,`${dr} หยด = ${ml} mL, ${fm(want)} mL = ?`,[NF(r,{dp:2,unit:'หยด',alt:[Math.round(r)]})],
        [`${ml} mL เท่ากับ ${dr} หยด`,`${fm(want)} mL เท่ากับ ${dr} × ${fm(want)} ÷ ${ml} = <b>${fm(r,2)} หยด</b>${Math.round(r)!==r?` หรือประมาณ ${Math.round(r)} หยด`:''}`],{sub:'cal'+dr+ml+want}),
        [ml*want/dr*100,dr*want,want*20],2); }
    const t=pick([0.1,0.2,0.05,0.25]), d=pick([10,15,20]); const ml=t*5, r=ml*d;
    return withNum(Q2('drop',lv,`แพทย์สั่งยาให้ทารกครั้งละ ${fm(t)} ช้อนชา โรงพยาบาลมีหลอดหยด (1 mL เท่ากับ ${d} หยด) ต้องให้ยาครั้งละกี่หยด`,`${fm(t)} tsp → หยด`,[NF(r,{dp:1,unit:'หยด',alt:[Math.round(r)]})],
      [`1 ช้อนชา = 5 mL ดังนั้น ${fm(t)} ช้อนชา = ${fm(ml,3)} mL`,`1 mL = ${d} หยด`,`${fm(ml,3)} × ${d} = <b>${fm(r,1)} หยด</b>`],{sub:'baby'+t+d}),[t*d,ml*20===r?ml*15:ml*20,t*15*d],1); },

  xs(lv){ const X=[
      ['gr2mg','grains','mg',64.8,65,'1 gr = 64.8 mg (practical 65 mg)'],
      ['mg2gr','mg','grains',1/64.8,1/65,'1 gr = 64.8 mg ดังนั้นหารด้วย 64.8'],
      ['g2gr','g','grains',15.432,15.4,'1 g = 15.432 grains'],
      ['floz2ml','fluid ounces (f℥)','mL',29.57,30,'1 f℥ = 29.57 mL (practical 30 mL)'],
      ['pt2ml','pints','mL',473,473,'1 pint = 473 mL'],
      ['ml2min','mL','minims',16.23,16.23,'1 mL = 16.23 minims'],
      ['min2ml','minims','mL',1/16.23,0.06,'16.23 minims = 1 mL (1 minim ≈ 0.06 mL)'],
      ['kg2lb','kg','lb',2.2,2.2,'1 kg = 2.20 lb'],
      ['ozapo2g','℥ (apo. oz)','g',31.1,30,'1 ℥ = 31.1 g'],
      ['lbapo2g','apo. lb','g',373.2,373.2,'1 apo lb = 373.2 g'],
      ['gal2ml','gallons','mL',3785,3785,'1 gallon = 3,785 mL']];
    if(lv==='hard'){ const k=pick(['grtot','mintot','wt']);
      if(k==='grtot'){ const n=pick([50,100,200]), mg=pick([250,300,325,500]); const g=n*mg/1000, r=g*15.432;
        return withNum(Q2('xs',lv,`เตรียมยา ${n} ซอง ซองละ ${mg} mg ต้องใช้ตัวยาทั้งหมดกี่ grains (1 g = 15.432 gr)`,`${n} × ${mg} mg → grains`,[NF(r,{dp:1,rel:.004,unit:'grains',alt:[n*mg/64.8]})],
          [`ตัวยาทั้งหมด ${n} × ${mg} = ${fm(n*mg)} mg = ${fm(g)} g`,`1 g = 15.432 grains`,`${fm(g)} × 15.432 = <b>${fm(r,1)} grains</b> (ใช้ ÷ 64.8 ก็ได้ใกล้เคียงกัน)`],{sub:k+n+mg}),[g*64.8,n*mg*15.432,r/12],1); }
      if(k==='mintot'){ const m=pick([5,10,15,20]), t=pick([2,3,4]), d=pick([5,7,10]); const tot=m*t*d, r=tot/16.23;
        return withNum(Q2('xs',lv,`ยาหยอดใช้ครั้งละ ${m} minims วันละ ${t} ครั้ง นาน ${d} วัน ต้องใช้ยาทั้งหมดกี่ mL (16.23 minims = 1 mL)`,`${m} minims × ${t} × ${d} → mL`,[NF(r,{dp:2,rel:.003,unit:'mL'})],
          [`ใช้ยาทั้งหมด ${m} × ${t} × ${d} = ${tot} minims`,'16.23 minims = 1 mL',`${tot} ÷ 16.23 = <b>${fm(r,2)} mL</b>`],{sub:k+m+t+d}),[tot*0.0616*16.23/16.23*1.07,tot*16.23,tot/60],2); }
      const kg=pick([5,12,18,22,30]); const lb=kg*2.2; return withNum(Q2('xs',lv,`เด็กหนัก ${fm(lb,1)} lb คิดเป็นกี่ kg (1 kg = 2.20 lb)`,`${fm(lb,1)} lb = ? kg`,[NF(kg,{dp:1,unit:'kg',tol:.06})],
        ['1 kg = 2.20 lb',`${fm(lb,1)} ÷ 2.2 = <b>${fm(kg,1)} kg</b>`],{sub:k+kg}),[lb*2.2,lb/2,kg*0.454*2],1); }
    const c=pick(X); const [k,a,b,ex,pr,rule]=c; const usePr=lv==='easy'&&pr!==ex; let v;
    if(k==='mg2gr') v=pick([130,195,260,325,650,300,500]); else if(k==='min2ml') v=pick([15,30,45,60,100]); else if(k==='gal2ml') v=pick([1,2,0.5]); else if(k==='pt2ml') v=pick([1,2,0.5,3]); else v=pick([1,2,3,4,5,10,0.5,1.5,2.5]);
    const f=usePr?pr:ex, r=v*f, dp=r<100?3:1;
    const note=usePr?'ใช้ค่า practical':'ใช้ค่า exact';
    return withNum(Q2('xs',lv,`${fm(v)} ${a} เท่ากับกี่ ${b} (${note})`,`${fm(v)} ${a} = ? ${b}`,[NF(r,{dp,rel:.004,unit:b,alt:pr!==ex?[v*(usePr?ex:pr)]:[]})],
      [rule+(usePr?' ข้อนี้ใช้ค่าประมาณ (practical)':''),`${fm(v)} ${k==='mg2gr'||(k==='min2ml'&&!usePr)?'÷ '+fm(1/f,2):'× '+fm(f,3)} = <b>${fm(r,dp)} ${b}</b>`],{sub:k+v+usePr}),
      [v/f,r*10,v*(k.startsWith('oz')?28.35:k==='floz2ml'?15:f*1.25)],dp); },

  word(lv){ const D=[['Suprax® (cefixime)',100,5],['ibuprofen',100,5],['paracetamol',120,5],['amoxicillin',125,5],['paracetamol',250,5],['Tylenol with codeine® (codeine)',12,5]];
    const [nm,mg,per]=pick(D);
    if(lv==='easy'){ const s=pick([1,2]), sp=pick([['ช้อนชา',5],['ช้อนโต๊ะ',15]]), ml=s*sp[1], r=mg*ml/per;
      return withNum(Q2('word',lv,`ยาน้ำ ${nm} ${mg} mg/${per} mL ผู้ป่วยรับประทานครั้งละ ${s} ${sp[0]} ได้รับตัวยาครั้งละกี่ mg`,`${mg} mg/${per} mL, ${s} ${sp[0]}`,[NF(r,{dp:1,unit:'mg'})],
        [`${s} ${sp[0]} = ${ml} mL`,`ยา ${per} mL มีตัวยา ${mg} mg`,`ยา ${ml} mL มีตัวยา ${mg} × ${ml} ÷ ${per} = <b>${fm(r,1)} mg</b>`],{sub:'e'+nm+mg+s+sp[1]}),[mg*s,mg*ml,r/2],1); }
    if(lv==='mid'){ const s=pick([1,2]), t=pick([2,3]), d=pick([5,7,10]), ml=s*5*t*d, g=mg*ml/per/1000;
      return withNum(Q2('word',lv,`ยาน้ำ ${nm} ${mg} mg/${per} mL ครั้งละ ${s} ช้อนชา วันละ ${t} ครั้ง นาน ${d} วัน ผู้ป่วยได้รับตัวยาทั้งหมดกี่กรัม`,`${s} tsp × ${t} × ${d} วัน`,[NF(g,{dp:3,unit:'g'})],
        [`${s} ช้อนชา = ${s*5} mL, วันละ ${s*5*t} mL, ${d} วัน = ${ml} mL`,`ตัวยา ${mg} × ${ml} ÷ ${per} = ${fm(g*1000)} mg`,`${fm(g*1000)} mg ÷ 1,000 = <b>${fm(g,3)} g</b>`],{sub:'m'+nm+mg+s+t+d}),[g*1000,g*3,mg*ml/1000],3); }
    const oz=pick([2,3,4]), ml=oz*30, totmg=mg*ml/per, gr=totmg/65;
    return withNum(Q2('word',lv,`ยาน้ำ ${nm} ${mg} mg/${per} mL เภสัชกรจ่ายยา ${oz} fluidounces ผู้ป่วยได้รับตัวยาทั้งหมดกี่ grains (ใช้ 1 f℥ = 30 mL และ 1 gr = 65 mg)`,`${oz} f℥ ของ ${mg} mg/${per} mL → grains`,[NF(gr,{dp:2,rel:.005,unit:'grains',alt:[totmg/64.8]})],
      [`${oz} f℥ × 30 = ${ml} mL`,`ตัวยา ${mg} × ${ml} ÷ ${per} = ${fm(totmg)} mg`,`${fm(totmg)} ÷ 65 = <b>${fm(gr,2)} grains</b> (ถ้าใช้ค่า exact 64.8 จะได้ ${fm(totmg/64.8,2)})`],{sub:'h'+nm+mg+oz}),[totmg/15.432,totmg*65/1000,gr*8],2); },

  con2(lv){ const ids=CON2.map((c,i)=>i).filter(i=>lv==='mix'||CON2[i][3]===lv); return bCon2(pick(ids.length?ids:CON2.map((c,i)=>i))); }
};
Object.assign(GEN,GEN2);
function withNum(q,wrongs,dp){ return mc2(q,wrongs,dp); }

/* ---------- ข้อช้อยทฤษฎีบทที่ 2: [โจทย์, [ถูก, ผิด, ผิด, ผิด], เหตุผล, ระดับ, หน้าในบท] ---------- */
const CON2=[
 ['ระบบมาตราที่ต้องรู้ในบทนี้มีกี่ระบบ',['4 ระบบ: เมตริก อะโปธิคารี อะวัวดูปัวส์ มาตรประจำบ้าน','2 ระบบ: เมตริก และอังกฤษ','3 ระบบ: เมตริก อะโปธิคารี มาตรประจำบ้าน','5 ระบบ: เมตริก อะโปธิคารี อะวัวดูปัวส์ ทรอย มาตรประจำบ้าน'],'บทนี้ใช้ 4 ระบบ คือ เมตริก อะโปธิคารี อะวัวดูปัวส์ และมาตรประจำบ้าน','easy',3],
 ['ระบบเมตริกเริ่มใช้ครั้งแรกที่ไหน เมื่อไร',['ฝรั่งเศส ค.ศ. 1809','อังกฤษ ค.ศ. 1809','อเมริกา ค.ศ. 1866','ฝรั่งเศส ค.ศ. 1866'],'เริ่มใช้ ค.ศ. 1809 ที่ฝรั่งเศส แล้วอเมริกานำมาใช้อย่างเป็นทางการ ค.ศ. 1866','mid',3],
 ['ข้อใดอธิบายระบบเมตริกได้ถูกต้อง',['เป็นระบบฐาน 10 แต่ละหน่วยห่างกัน 10 เท่า','แต่ละหน่วยห่างกัน 12 เท่า','มีเฉพาะหน่วยน้ำหนักและปริมาตร','เขียนตัวเลขด้วยเลขโรมัน'],'ระบบเมตริกเป็น decimal system ใช้คำนำหน้าจากภาษาละติน และมีทั้งความยาว ปริมาตร น้ำหนัก','easy',3],
 ['คำนำหน้า micro- (µ) มีค่าเท่าใด',['10⁻⁶','10⁻³','10⁻⁹','10⁶'],'deci 0.1, centi 0.01, milli 0.001, micro 10⁻⁶, nano 10⁻⁹','easy',4],
 ['คำนำหน้า nano- (n) มีค่าเท่าใด',['10⁻⁹','10⁻⁶','10⁻¹²','10⁹'],'nano = 10⁻⁹ ส่วน pico = 10⁻¹²','easy',4],
 ['ตัวย่อ M กับ m ต่างกันอย่างไร',['M คือ mega (10⁶) ส่วน m คือ milli (10⁻³)','M คือ milli ส่วน m คือ mega','ทั้งสองคือ milli','M คือ micro ส่วน m คือ milli'],'ระวังตัวย่อ M (mega) กับ m (milli) คนละตัวกัน','mid',4],
 ['เปลี่ยนจากหน่วยใหญ่ไปหน่วยเล็กในระบบเมตริก ต้องทำอย่างไร',['คูณ หรือเลื่อนจุดทศนิยมไปทางขวา','หาร หรือเลื่อนจุดไปทางซ้าย','บวกด้วย 1,000','ลบด้วย 1,000'],'ใหญ่ไปเล็กคูณ (จุดไปขวา) เล็กไปใหญ่หาร (จุดไปซ้าย)','easy',4],
 ['หน่วยพื้นฐานของปริมาตรในระบบเมตริกคือข้อใด',['ลิตร (L)','มิลลิลิตร (mL)','ลูกบาศก์เมตร (m³)','ออนซ์ (oz)'],'น้ำหนัก กรัม, ปริมาตร ลิตร, ความยาว เมตร, พื้นที่ ตารางเมตร','easy',5],
 ['1 mL เท่ากับข้อใด',['1 cm³ หรือ 1 cc','1 dm³','10 cc','0.1 cm³'],'1 mL = 1 cm³ = 1 cc จึงแปลง mL กับ cc ได้แบบ 1 ต่อ 1','easy',6],
 ['ใบสั่งยาเขียนว่า Aspirin 1.00 และ Cheracol q.s. 120.00 โดยไม่เขียนหน่วย ต้องอ่านหน่วยอย่างไร',['Aspirin เป็น g และ Cheracol เป็น mL','ทั้งสองเป็น g','ทั้งสองเป็น mL','Aspirin เป็น mg และ Cheracol เป็น L'],'ถ้าไม่เขียนหน่วย ของแข็งถือเป็น g และของเหลวถือเป็น mL','mid',8],
 ['q.s. ในใบสั่งยามีความหมายว่าอะไร',['ใส่ในปริมาณที่พอเพียง (quantum sufficiat)','ทุก 4 ชั่วโมง','ก่อนอาหาร','จงเอาไป'],'q.s. = quantum sufficiat แปลว่าใส่ในปริมาณที่พอเพียง ส่วน Rx แปลว่าจงเอาไป','mid',8],
 ['ระบบสามัญหรือระบบอังกฤษแบ่งเป็นระบบใดบ้าง',['อะโปธิคารี และอะวัวดูปัวส์','เมตริก และอะโปธิคารี','อะวัวดูปัวส์ และมาตรประจำบ้าน','ทรอย และเมตริก'],'ระบบสามัญแบ่งเป็น apothecary และ avoirdupois','easy',8],
 ['ระบบอะโปธิคารีมีหน่วยวัดอะไรบ้าง',['เฉพาะน้ำหนักและปริมาตร','เฉพาะน้ำหนัก','น้ำหนัก ปริมาตร และความยาว','เฉพาะปริมาตร'],'อะโปธิคารีมีเฉพาะหน่วยน้ำหนักและปริมาตร ส่วนอะวัวดูปัวส์มีเฉพาะน้ำหนัก','mid',8],
 ['ระบบอะโปธิคารีบางครั้งเรียกว่าอะไร',['Troy weight','International system','Household system','Decimal system'],'อะโปธิคารีเริ่มใช้ที่อังกฤษ บางครั้งเรียกว่า Troy weight','mid',8],
 ['ระบบอะโปธิคารีนิยมเขียนตัวเลขแบบใด',['เลขโรมันไว้หลังหน่วย เช่น gr. V','เลขอารบิกไว้หลังหน่วย','เลขโรมันไว้หน้าหน่วย','ทศนิยมไว้หลังหน่วย'],'นิยมเลขโรมันหลังหน่วย ถ้าใช้เลขอารบิกให้เขียนไว้หน้าหน่วย เช่น 5 grain','mid',10],
 ['ส่วนย่อยของ grains หรือ minims ในระบบอะโปธิคารีเขียนอย่างไร',['เศษส่วน','ทศนิยม','เปอร์เซ็นต์','เลขยกกำลัง'],'ส่วนย่อย (subdivision) ของ grains หรือ minims ใช้เศษส่วน','hard',10],
 ['ยาใดที่ยังพบขนาดยาเป็นหน่วยอะโปธิคารี',['aspirin และ phenobarbital','paracetamol และ ibuprofen','amoxicillin และ cefixime','insulin และ heparin'],'ยังเจอในยาบางตัว เช่น morphine, aspirin, phenobarbital, nitroglycerin','mid',8],
 ['ในระบบอะโปธิคารี 1 scruple (℈) เท่ากับกี่ grains',['20 grains','60 grains','3 grains','480 grains'],'20 grains = 1 scruple, 3 scruples = 1 dram','easy',9],
 ['ในระบบอะโปธิคารี 1 dram (ʒ) เท่ากับกี่ grains',['60 grains','20 grains','480 grains','8 grains'],'1 dram = 3 scruples = 60 grains','easy',9],
 ['ในระบบอะโปธิคารี 1 ounce (℥) เท่ากับเท่าใด',['8 drams = 480 grains','12 drams = 720 grains','16 drams = 437.5 grains','3 drams = 180 grains'],'8 drams = 1 ounce = 480 grains','easy',9],
 ['1 pound ของระบบอะโปธิคารีมีกี่ ounces',['12 ounces','16 ounces','8 ounces','20 ounces'],'pound อะโปธิคารีมีแค่ 12 ounces (5,760 grains) ส่วน pound อะวัวดูปัวส์มี 16 ounces','mid',9],
 ['ลำดับการจำหน่วยน้ำหนักอะโปธิคารี 20 แล้ว 3 แล้ว 8 แล้ว 12 หมายถึงข้อใด',['gr → ℈ → ʒ → ℥ → lb','gr → ʒ → ℈ → ℥ → lb','℈ → gr → ʒ → lb → ℥','gr → ℥ → ʒ → ℈ → lb'],'20 gr = 1 ℈, 3 ℈ = 1 ʒ, 8 ʒ = 1 ℥, 12 ℥ = 1 lb','mid',9],
 ['1 fluid dram (fʒ) เท่ากับกี่ minims',['60 minims','8 minims','16 minims','480 minims'],'60 minims = 1 fluid dram','easy',9],
 ['1 pint เท่ากับกี่ fluid ounces',['16 fluid ounces','8 fluid ounces','12 fluid ounces','32 fluid ounces'],'16 fluid ounces = 1 pint, 2 pints = 1 quart, 4 quarts = 1 gallon','easy',9],
 ['1 gallon (US) เท่ากับกี่ pints',['8 pints','4 pints','2 pints','16 pints'],'1 gallon = 4 quarts = 8 pints','mid',10],
 ['สัญลักษณ์ O และ C ในระบบอะโปธิคารีหมายถึงอะไร',['O คือ pint และ C คือ gallon','O คือ ounce และ C คือ cup','O คือ quart และ C คือ pint','O คือ gallon และ C คือ pint'],'pint เขียนเป็น pt หรือ O ส่วน gallon เขียนเป็น gal หรือ C','hard',10],
 ['ระบบอะวัวดูปัวส์มีลักษณะตรงกับข้อใด',['ระบบทางการค้า มีเฉพาะมาตราน้ำหนัก','ใช้ปรุงยาในห้องยา มีน้ำหนักและปริมาตร','ใช้วัดความยาว','ใช้ตวงยาที่บ้าน'],'อะวัวดูปัวส์เป็นระบบทางการค้า ใช้ซื้อขายปริมาณมาก มีเฉพาะมาตราน้ำหนัก','easy',11],
 ['หน่วยใดมีค่าเท่ากันทั้งในระบบอะโปธิคารีและอะวัวดูปัวส์',['grain','ounce','pound','dram'],'เท่ากันแค่ grain นอกนั้นไม่เท่ากันแม้ชื่อเรียกเหมือนกัน','mid',11],
 ['1 ounce (avoir) เท่ากับกี่ grains',['437.5 grains','480 grains','454 grains','7,000 grains'],'1 oz avoir = 437.5 gr แต่ 1 ℥ apo = 480 gr','easy',11],
 ['1 pound (avoir) เท่ากับเท่าใด',['16 oz = 7,000 grains','12 oz = 5,760 grains','16 oz = 5,760 grains','12 oz = 7,000 grains'],'1 lb avoir = 16 oz = 7,000 gr ส่วน 1 lb apo = 12 ℥ = 5,760 gr','mid',12],
 ['โจทย์เขียน oz (avoir) ควรใช้ค่าใด',['437.5 gr หรือ 28.35 g','480 gr หรือ 31.1 g','437.5 gr หรือ 31.1 g','480 gr หรือ 28.35 g'],'oz avoir ใช้ 437.5 gr หรือ 28.35 g ถ้าเป็น ℥ หรือ apo. oz ใช้ 480 gr หรือ 31.1 g','mid',12],
 ['ข้อใดถูกต้องเกี่ยวกับระบบมาตรประจำบ้าน',['ไม่ค่อยแม่นยำ ใช้วัดอย่างประมาณ นำไปปรุงยาไม่ได้','แม่นยำที่สุด ใช้ปรุงยาได้','ใช้ในอุตสาหกรรมยา','เป็นระบบฐาน 10'],'มาตรประจำบ้านไม่ค่อยแม่นยำ ใช้วัดอย่างประมาณเท่านั้น นำไปปรุงยาไม่ได้','easy',12],
 ['หน้าที่ของเภสัชกรเกี่ยวกับมาตรประจำบ้านคือข้อใด',['แปลงขนาดยาเป็นหน่วยมาตรประจำบ้านตอนจัดยาและเขียนฉลาก','แปลงขนาดยาเป็นอะโปธิคารี','ใช้มาตรประจำบ้านปรุงยา','ห้ามใช้มาตรประจำบ้านบนฉลาก'],'ใบสั่งยามักเป็นเมตริกหรืออะโปธิคารี เภสัชกรต้องแปลงเป็นช้อนชา ช้อนโต๊ะ ให้ผู้ป่วยใช้ที่บ้าน','easy',12],
 ['ในทางปฏิบัติ 1 ช้อนชา เท่ากับกี่ mL',['5 mL','4.93 mL','3.69 mL','15 mL'],'ช้อนชามาตรฐานสหรัฐ 4.93 ± 0.24 mL แต่ในทางปฏิบัติกำหนดให้ 5 mL','easy',12],
 ['1 ช้อนโต๊ะ เท่ากับเท่าใด',['15 mL หรือ 3 ช้อนชา','10 mL หรือ 2 ช้อนชา','30 mL หรือ 6 ช้อนชา','8 mL'],'1 ช้อนโต๊ะ = 15 mL = 3 ช้อนชา','easy',13],
 ['1 dessertspoonful (dssp) เท่ากับกี่ mL',['8 mL','5 mL','10 mL','15 mL'],'tsp 5, dssp 8, tbsp 15 mL','mid',12],
 ['ตัวย่อ gtt หมายถึงอะไร',['หยด (guttae, drop)','ช้อนชา','แก้ว','กรัม'],'gtt ย่อมาจาก guttae แปลว่าหยด','easy',12],
 ['1 แก้ว (glass) และ 1 coffee cup เท่ากับกี่ fluid ounces ตามลำดับ',['8 และ 6 fl oz','6 และ 8 fl oz','8 และ 8 fl oz','16 และ 6 fl oz'],'1 glass = 8 fl oz และ 1 coffee cup = 6 fl oz','mid',12],
 ['ถ้าเครื่องหมายช้อนชาปรากฏในการปรุงยา (ไม่ใช่วิธีใช้ของผู้ป่วย) จะเท่ากับกี่ mL ตามระบบอะโปธิคารี',['3.69 mL','5 mL','4.93 mL','8 mL'],'ในวิธีใช้ของผู้ป่วยเท่ากับ 5 mL แต่ในการปรุงยาเท่ากับ 3.69 mL (1 fluidram)','hard',12],
 ['ทำไมยาน้ำแต่ละชนิด 1 mL จึงมีจำนวนหยดไม่เท่ากัน',['ความหนืด ความหนาแน่น แรงตึงผิว อุณหภูมิ และมุมที่หยด','สีของยา','ขนาดขวดยา','วันหมดอายุ'],'จำนวนหยดขึ้นกับความหนืด ความหนาแน่น แรงตึงผิว อุณหภูมิ และมุมที่หยด','mid',13],
 ['หลอดหยดมาตรฐาน USP-NF ได้กี่หยดต่อ 1 mL',['20 หยด ที่ 25 °C (เส้นผ่านศูนย์กลาง 3 mm)','10 หยด ที่ 37 °C','16.23 หยด','60 หยด'],'USP-NF: เส้นผ่านศูนย์กลางกลาง 3 mm ได้ 20 หยดต่อ 1 mL ที่ 25 °C และ 1 หยดหนักประมาณ 45 ถึง 55 mg','mid',13],
 ['แพทย์สั่งยาเป็นจำนวนหยดในกรณีใด',['ยาอันตรายหรือยาน้ำเด็กเล็กที่ใช้ปริมาณน้อยมาก','ยาที่ใช้ปริมาณมาก','ยาเม็ด','ยาฉีดทุกชนิด'],'ยาอันตรายหรือยาน้ำเด็กเล็กใช้ปริมาณน้อยมาก แพทย์จึงสั่งเป็นจำนวนหยด','easy',13],
 ['ปริมาตรน้อยที่สุดที่ตวงด้วยกระบอกตวงได้คือเท่าใด',['20% ของขนาดกระบอกตวง','10% ของขนาดกระบอกตวง','50% ของขนาดกระบอกตวง','1 mL เสมอ'],'ตวงได้น้อยสุด 20% ของขนาดกระบอก เช่น กระบอก 10 mL ตวงได้น้อยสุด 2 mL','easy',13],
 ['ต้องการตวงยา 1 mL แต่มีกระบอกตวง 10 mL ควรทำอย่างไร',['ใช้หลอดหยดที่สอบเทียบกับกระบอกตวงแล้ว','ตวงด้วยกระบอก 10 mL ได้เลย','ใช้ช้อนชา','ใช้กระบอก 100 mL'],'ต่ำกว่า 20% (2 mL) ไม่เหมาะ ต้องใช้หลอดหยดที่สอบเทียบแล้ว','mid',13],
 ['practical equivalent ต่างจาก exact equivalent อย่างไร',['practical ใช้ค่าประมาณเตรียมยาปริมาณไม่มาก ส่วน exact ใช้ค่าแน่นอนในการปรุงยา','practical ใช้ปรุงยา ส่วน exact ใช้ที่บ้าน','ทั้งสองค่าเท่ากันเสมอ','exact ใช้เฉพาะระบบเมตริก'],'practical ใช้ค่าประมาณ ส่วน exact ใช้ค่าแน่นอนเพื่อความถูกต้องในการปรุงยา','easy',15],
 ['1 grain เท่ากับกี่ mg (exact และ practical)',['64.8 mg และ 65 mg','65 mg และ 60 mg','60 mg และ 65 mg','15.432 mg และ 15 mg'],'1 gr = 64.8 mg (exact) ประมาณ 65 mg (practical)','easy',16],
 ['1 g เท่ากับกี่ grains',['15.432 grains','64.8 grains','16.23 grains','437.5 grains'],'1 g = 15.432 gr','easy',16],
 ['1 fluid ounce (f℥) เท่ากับกี่ mL (exact และ practical)',['29.57 mL และ 30 mL','31.1 mL และ 30 mL','28.35 mL และ 30 mL','30 mL และ 29.57 mL'],'1 f℥ = 29.57 mL ประมาณ 30 mL','easy',16],
 ['1 ℥ (apo) และ 1 oz (avoir) เท่ากับกี่กรัม ตามลำดับ',['31.1 g และ 28.35 g','28.35 g และ 31.1 g','29.57 g และ 28.35 g','31.1 g และ 30 g'],'1 ℥ = 31.1 g ส่วน 1 oz avoir = 28.35 g (ทั้งคู่ practical ≈ 30 g)','mid',16],
 ['1 pound อะโปธิคารี และ 1 pound อะวัวดูปัวส์ เท่ากับกี่กรัม ตามลำดับ',['373.2 g และ 453.6 g','453.6 g และ 373.2 g','373.2 g และ 437.5 g','480 g และ 454 g'],'1 lb apo = 373.2 g และ 1 lb avoir = 453.6 g (≈ 454 g)','mid',17],
 ['1 mL เท่ากับกี่ minims',['16.23 minims','60 minims','15.432 minims','20 minims'],'16.23 minims = 1 mL (1 minim ≈ 0.06 mL)','easy',17],
 ['1 pint เท่ากับกี่ mL',['473 mL','480 mL','500 mL','946 mL'],'1 pint = 473.2 mL ประมาณ 473 mL (มาตรประจำบ้านถือ 500 mL)','easy',16],
 ['1 kg เท่ากับกี่ lb',['2.20 lb','0.454 lb','2.68 lb','1.6 lb'],'1 kg = 2.20 lb','easy',17],
 ['1 minim (เฉพาะน้ำ) หนักประมาณกี่ grains',['0.95 grains','1 grain','0.06 grains','16.23 grains'],'1 minim (ใช้กับน้ำเท่านั้น) = 0.95 gr','hard',17],
 ['1 apo pound เท่ากับกี่ pound (avoir)',['0.85 lb','1.2 lb','0.75 lb','1 lb'],'1 apo pound = 0.85 pound','hard',17],
 ['1 gallon (US) เท่ากับกี่ mL',['3,785 mL','3,000 mL','4,000 mL','946 mL'],'1 gallon = 3,785.3 mL หรือ 128 fluid ounces','mid',16],
 ['1 quart (qt) เท่ากับเท่าใด',['946 mL (ประจำบ้านถือ 1 ลิตร)','473 mL','500 mL','3,785 mL'],'1 quart = 946 mL ในมาตรประจำบ้านถือเป็น 1 liter','mid',13],
 ['สไลด์ตัวอย่างโจทย์ Tylenol with codeine ใช้ค่า 1 f℥ เท่าใด',['30 mL (practical)','29.57 mL (exact)','28.35 mL','31.1 mL'],'สไลด์ตัวอย่างใช้ practical 30 mL ถ้าโจทย์บอกให้ใช้ค่า exact ค่อยใช้ 29.57 mL','mid',18],
 ['ข้อใดคือตัวเลขทองที่จับคู่ถูก',['1 gr = 64.8 mg, 1 ℥ = 31.1 g, 1 mL = 16.23 minims','1 gr = 65 g, 1 ℥ = 28.35 g, 1 mL = 60 minims','1 gr = 15.432 mg, 1 ℥ = 31.1 g','1 f℥ = 473 mL, 1 pint = 29.57 mL'],'ตัวเลขทอง: 1 gr = 64.8 mg, 1 g = 15.432 gr, 1 ℥ = 31.1 g, 1 oz avoir = 28.35 g, 1 mL = 16.23 minims, 1 f℥ = 29.57 mL, 1 pint = 473 mL','hard',18],
];
function bCon2(i){ const [st,opts,why,lv,pg]=CON2[i]; const sh=shuf(opts);
  return {t:'con2',lv,stem:st,big:'',fields:[{kind:'text',show:opts[0],acc:[]}],exp:[why],id:'con2|'+i,mc:{opts:sh,ans:sh.indexOf(opts[0])},mcOnly:true,plain:true,pg:C2P(pg)}; }

/* ---------- แบบฝึกหัดในชีทบทที่ 2 (เฉลยสีแดง) ---------- */
function set2Sheet(){ const S=(no,o={})=>({src:'แบบฝึกหัดบทที่ 2',no:'ข้อ '+no,...o});
  const cv=(t,no,lv,v,a,b,r,dp,exp,wr,o={})=>withNum(Q2(t,lv,`จงเปลี่ยนหน่วย ${v} ${a} เท่ากับกี่ ${b}`,`${v} ${a} = ? ${b}`,[NF(r,{dp,unit:b,...o})],exp,{sub:'sh'+no,...S(no)}),wr,dp);
  const L=[
  cv('met','1.1','easy','2.5','grams','milligrams',2500,0,['1 g = 1,000 mg','2.5 × 1,000 = <b>2,500 mg</b>'],[250,25000,0.0025]),
  cv('met','1.2','easy','750','milligrams','grams',0.75,3,['1,000 mg = 1 g','750 ÷ 1,000 = <b>0.75 g</b>'],[7.5,0.075,750000]),
  cv('met','1.3','easy','0.025','grams','milligrams',25,2,['1 g = 1,000 mg','0.025 × 1,000 = <b>25 mg</b>'],[2.5,250,0.000025]),
  cv('met','1.4','easy','3500','micrograms','milligrams',3.5,3,['1,000 µg = 1 mg','3,500 ÷ 1,000 = <b>3.5 mg</b>'],[35,0.35,3500000]),
  cv('met','1.5','easy','0.75','kilograms','grams',750,0,['1 kg = 1,000 g','0.75 × 1,000 = <b>750 g</b>'],[75,7500,0.00075]),
  cv('met','1.6','easy','1250','milliliters','liters',1.25,3,['1,000 mL = 1 L','1,250 ÷ 1,000 = <b>1.25 L</b>'],[12.5,0.125,1250000]),
  cv('met','1.7','easy','0.05','liters','milliliters',50,1,['1 L = 1,000 mL','0.05 × 1,000 = <b>50 mL</b>'],[5,500,0.00005]),
  cv('met','1.8','easy','450','microliters','milliliters',0.45,3,['1,000 µL = 1 mL','450 ÷ 1,000 = <b>0.45 mL</b>'],[4.5,0.045,450000]),
  cv('met','1.9','mid','2.5','centimeters','micrometers',25000,0,['cm ไป µm ห่างกัน 10⁴ (1 cm = 10,000 µm)','2.5 × 10,000 = <b>25,000 µm</b>'],[2500,250000,0.00025]),
  cv('met','1.10','easy','0.035','milligrams','micrograms',35,2,['1 mg = 1,000 µg','0.035 × 1,000 = <b>35 µg</b>'],[3.5,350,0.000035]),
  cv('xs','2.1','mid','10','grains','milligrams',648,1,['1 gr = 64.8 mg (exact)','10 × 64.8 = <b>648 mg</b> (ถ้าใช้ค่าประมาณ 65 mg จะได้ 650 mg)'],[650*1.1,154.32,6480],{alt:[650]}),
  cv('xs','2.2','mid','5','grains','grams',0.324,3,['1 gr = 64.8 mg = 0.0648 g','5 × 0.0648 = <b>0.324 g</b> (ค่าประมาณ 0.325 g)'],[3.24,77.16,0.0324],{alt:[0.325]}),
  cv('apo','2.3','easy','2','scruples','grains',40,0,['1 scruple = 20 grains','2 × 20 = <b>40 grains</b>'],[60,6,120]),
  cv('apo','2.4','easy','3','drams','grains',180,0,['1 dram = 60 grains','3 × 60 = <b>180 grains</b>'],[60,9,1440]),
  cv('apo','2.5','easy','2','ounces','drams',16,0,['1 ounce = 8 drams','2 × 8 = <b>16 drams</b>'],[24,960,6]),
  cv('xs','2.6','mid','1.5','ounces','grams',46.65,2,['1 apo. oz (℥) = 31.1 g','1.5 × 31.1 = <b>46.65 g</b>'],[42.53,45,720],{tol:.01}),
  cv('xs','2.7','mid','30','grains','grams',1.944,3,['1 gr = 0.0648 g','30 × 0.0648 = <b>1.944 g</b> (ประมาณ 1.94 g)'],[1.5,0.5,19.44],{tol:.006,alt:[1.95]}),
  cv('apo','2.8','easy','120','grains','drams',2,1,['1 dram = 60 grains','120 ÷ 60 = <b>2 drams</b>'],[6,0.25,7200]),
  cv('apo','2.9','easy','3','fluid drams','minims',180,0,['1 fluid dram = 60 minims','3 × 60 = <b>180 minims</b>'],[24,48.69,1440]),
  cv('apo','2.10','easy','5','fluid ounces','fluid drams',40,0,['1 fluid ounce = 8 fluid drams','5 × 8 = <b>40 fluid drams</b>'],[80,300,60]),
  cv('apo','2.11','easy','2','pints','fluid ounces',32,0,['1 pint = 16 fluid ounces','2 × 16 = <b>32 fluid ounces</b>'],[16,24,946]),
  cv('apo','2.12','easy','4','fluid ounces','fluid drams',32,0,['1 fluid ounce = 8 fluid drams','4 × 8 = <b>32 fluid drams</b>'],[64,240,48]),
  cv('apo','2.13','mid','1','pints','minims',7680,0,['1 pint = 16 f℥, 1 f℥ = 8 fʒ, 1 fʒ = 60 minims','16 × 8 × 60 = <b>7,680 minims</b>'],[960,5760,7676.8]),
  cv('avo','3.1','easy','2','pound (avoir)','ounce',32,0,['1 lb avoir = 16 oz','2 × 16 = <b>32 oz</b>'],[24,14,875]),
  cv('avo','3.2','mid','3','pound (avoir)','grams',1360.8,1,['1 lb avoir = 453.6 g','3 × 453.6 = <b>1,360.8 g</b>'],[1119.6,1362*1.1,21000],{tol:.06,alt:[1362]}),
  cv('avo','3.6','mid','1.5','ounces (avoir)','g',42.53,2,['1 oz avoir = 28.35 g','1.5 × 28.35 = <b>42.53 g</b>'],[46.65,45,656.25],{tol:.01}),
  cv('hh','4.1','easy','2','teaspoons','milliliters',10,0,['1 ช้อนชา = 5 mL','2 × 5 = <b>10 mL</b>'],[30,16,8]),
  cv('hh','4.2','easy','3','teaspoons','milliliters',15,0,['1 ช้อนชา = 5 mL','3 × 5 = <b>15 mL</b>'],[45,24,5]),
  cv('hh','4.3','easy','2','tablespoons','milliliters',30,0,['1 ช้อนโต๊ะ = 15 mL','2 × 15 = <b>30 mL</b>'],[10,60,16]),
  cv('hh','4.4','easy','5','tablespoons','milliliters',75,0,['1 ช้อนโต๊ะ = 15 mL','5 × 15 = <b>75 mL</b>'],[25,150,40]),
  cv('hh','4.5','easy','2','glasses','fluid ounces',16,0,['1 แก้ว (glass) = 8 fluid ounces','2 × 8 = <b>16 fl oz</b>'],[12,60,32]),
  cv('hh','4.6','easy','3','quarts','liters',3,1,['มาตรประจำบ้าน 1 quart = 1 liter','3 × 1 = <b>3 L</b>'],[2.838,1.5,6]),
  cv('hh','4.7','easy','2','cups','fluid ounces',12,0,['1 coffee cup = 6 fl oz','2 × 6 = <b>12 fl oz</b>'],[16,8,24]),
  cv('hh','4.9','easy','6','teaspoons','tablespoons',2,1,['1 ช้อนโต๊ะ = 3 ช้อนชา','6 ÷ 3 = <b>2 ช้อนโต๊ะ</b>'],[18,3,1.5]),
  withNum(Q2('xs','mid','แพทย์สั่งยาในขนาด 5 grains ต้องการเตรียมยาเป็นหน่วย milligram จะต้องใช้ยากี่ milligrams','5 grains = ? mg',[NF(324,{dp:1,unit:'mg',alt:[325]})],
    ['1 grain เท่ากับ 64.8 milligrams','5 grains เท่ากับ 64.8 × 5 ÷ 1 = <b>324 mg</b> (ถ้าใช้ค่าประมาณ 1 gr = 65 mg จะได้ 325 mg)'],{sub:'sh5',...S('5')}),[77.16,32.4,300],1),
  withNum(Q2('met','easy','เภสัชกรต้องชั่งสาร 250 milligrams แต่เครื่องชั่งแสดงหน่วยเป็นกรัม ต้องชั่งสารกี่ grams','250 mg = ? g',[NF(0.25,{dp:3,unit:'g'})],
    ['1,000 mg เท่ากับ 1 g','250 mg เท่ากับ 1 × 250 ÷ 1,000 = <b>0.25 g</b>'],{sub:'sh6',...S('6')}),[2.5,0.025,250000],3),
  withNum(Q2('avo','hard','ผงยาหนัก 1 avoirdupois ounce ต้องการแบ่งบรรจุซองละ 500 milligrams จะสามารถแบ่งได้กี่ซอง','1 oz (avoir) ÷ 500 mg',[NF(56,{dp:0,unit:'ซอง',tol:0})],
    ['1 avoirdupois ounce = 28.35 g = 28,350 mg','จำนวนซอง 28,350 ÷ 500 = 56.7 ซอง','แบ่งได้เต็ม <b>56 ซอง</b> (เหลือผงยา 350 mg)'],{sub:'sh7',...S('7')}),[62,57,60],0),
  withNum(Q2('xs','hard','ต้องการเตรียมตำรับยาทั้งหมด 100 ซอง แต่ละซองมีตัวยา 250 milligrams ต้องใช้วัตถุดิบทั้งหมดกี่ grains','100 ซอง × 250 mg → grains',[NF(385.8,{dp:1,unit:'grains',tol:.06,alt:[385.802]})],
    ['ตัวยาทั้งหมด 250 × 100 = 25,000 mg = 25 g','1 gram เท่ากับ 15.432 grains','25 g เท่ากับ 15.432 × 25 = <b>385.8 grains</b> (25,000 ÷ 64.8 ก็ได้ 385.8)'],{sub:'sh8',...S('8')}),[1620,3858,384.6*1.1],1),
  withNum(Q2('xs','mid','เภสัชกรต้องการเตรียมยาน้ำ 2 fluid ounces เตรียมยาน้ำได้ทั้งหมดกี่ milliliters','2 f℥ = ? mL',[NF(59.14,{dp:2,unit:'mL',tol:.01,alt:[60]})],
    ['1 fluid ounce เท่ากับ 29.57 mL','2 fluid ounces เท่ากับ 29.57 × 2 = <b>59.14 mL</b> (ถ้าใช้ค่าประมาณ 30 mL จะได้ 60 mL)'],{sub:'sh9',...S('9')}),[56.7,62.2,32.46],2),
  Q2('word','hard','มียาน้ำเชื่อม 1 pint ต้องการแบ่งบรรจุขวด ขวดละ 60 มิลลิลิตร จะได้ขวดเต็มกี่ขวด และเหลือยากี่ mL','1 pint ÷ 60 mL',[NF(7,{dp:0,unit:'ขวด',tol:0,lab:'ขวดเต็ม'}),NF(53,{dp:1,unit:'mL',tol:.06,lab:'เหลือยา'})],
    ['1 pint เท่ากับ 473 mL','จำนวนขวด 473 ÷ 60 = 7.88 ขวด บรรจุเต็มได้ 7 ขวด ใช้ไป 7 × 60 = 420 mL','ได้ <b>7 ขวดเต็ม</b> และเหลือยา 473 − 420 = <b>53 mL</b>'],{sub:'sh10',...S('10')}),
  withNum(Q2('xs','hard','ยาหยอดใช้ 15 minims ต่อครั้ง วันละ 3 ครั้ง เป็นเวลา 5 วัน ต้องใช้ยาทั้งหมดกี่ milliliters','15 minims × 3 × 5 วัน → mL',[NF(13.86,{dp:2,unit:'mL',tol:.05})],
    ['ใช้ยาทั้งหมด 15 × 3 × 5 = 225 minims','16.23 minims เท่ากับ 1 mL','225 minims เท่ากับ 225 ÷ 16.23 = <b>13.86 mL</b>'],{sub:'sh11',...S('11')}),[3.75,3651.75,14.8],2),
  Q2('word','hard','มีสารละลาย 3 fluid ounces ต้องการแบ่งบรรจุหลอดละ 5 mL จะได้หลอดเต็มกี่หลอด และเหลือกี่ mL (ใช้ 1 f℥ = 29.57 mL)','3 f℥ ÷ 5 mL',[NF(17,{dp:0,unit:'หลอด',tol:0,lab:'หลอดเต็ม'}),NF(3.71,{dp:2,unit:'mL',tol:.01,lab:'เหลือ'})],
    ['1 fluid ounce เท่ากับ 29.57 mL ดังนั้น 3 fl oz = 88.71 mL','จำนวนหลอด 88.71 ÷ 5 = 17.7 หลอด บรรจุเต็มได้ 17 หลอด ใช้ไป 17 × 5 = 85 mL','ได้ <b>17 หลอดเต็ม</b> และเหลือ 88.71 − 85 = <b>3.71 mL</b> (ถ้าใช้ 30 mL จะได้ 18 หลอดพอดี)'],{sub:'sh12',...S('12')}),
  withNum(Q2('drop','hard','แพทย์สั่งยาให้เด็กทารกทาน 0.10 ช้อนชา โรงพยาบาลมีหลอดหยด (1 mL เท่ากับ 10 หยด) ต้องให้ยาครั้งละกี่หยด','0.10 tsp → หยด (1 mL = 10 หยด)',[NF(5,{dp:0,unit:'หยด',tol:0})],
    ['1 ช้อนชา เท่ากับ 5 mL ดังนั้น 0.10 ช้อนชา = 0.5 mL','1 mL เท่ากับ 10 หยด','0.5 mL เท่ากับ 10 × 0.5 = <b>5 หยด</b> เขียนฉลากว่าหยดยา 5 หยด'],{sub:'sh13',...S('13')}),[1,10,15],0)
  ]; return L; }

/* ---------- แบบฝึกในสไลด์ (จากหนังสือเล่ม 2) ---------- */
function set2Slide(){ const S=(pg,o={})=>({src:'แบบฝึกในสไลด์',no:'สไลด์ '+pg,...o});
  const one=(t,lv,stem,big,val,o,exp,wr,dp,sl,sub)=>withNum(Q2(t,lv,stem,big,[NF(val,o)],exp,{sub:'sl'+sub,...S(sl)}),wr,dp);
  return [
  one('met','easy','1 กรัม เท่ากับกี่ไมโครกรัม','1 g = ? µg',1000000,{dp:0,unit:'µg'},['1 g = 1,000 mg และ 1 mg = 1,000 µg','1 × 1,000 × 1,000 = <b>1,000,000 µg</b>'],[1000,1e9,0.000001],0,16,'a'),
  one('met','easy','1 กรัม เท่ากับกี่กิโลกรัม','1 g = ? kg',0.001,{dp:3,unit:'kg'},['1,000 g = 1 kg','1 ÷ 1,000 = <b>0.001 kg</b>'],[1000,0.01,0.0001],3,16,'b'),
  one('met','easy','1 ลิตร เท่ากับกี่ลูกบาศก์เซนติเมตร (cm³)','1 L = ? cm³',1000,{dp:0,unit:'cm³'},['1 L = 1,000 mL และ 1 mL = 1 cm³','<b>1,000 cm³</b> (เท่ากับ 1,000 cc)'],[100,1000000,10],0,16,'c'),
  one('met','mid','1 ลิตร เท่ากับกี่นาโนลิตร','1 L = ? nL',1e9,{dp:0,unit:'nL'},['nano = 10⁻⁹ ดังนั้น 1 L = 10⁹ nL','<b>1,000,000,000 nL</b>'],[1e6,1e12,1e3],0,16,'d'),
  one('met','mid','85 µm เท่ากับกี่มิลลิเมตร','85 µm = ? mm',0.085,{dp:4,unit:'mm'},['1,000 µm = 1 mm','85 ÷ 1,000 = <b>0.085 mm</b>'],[0.85,0.0085,85000],4,16,'e'),
  one('met','mid','85 µm เท่ากับกี่เซนติเมตร','85 µm = ? cm',0.0085,{dp:5,unit:'cm'},['1 cm = 10,000 µm','85 ÷ 10,000 = <b>0.0085 cm</b>'],[0.085,0.00085,850000],5,16,'f'),
  one('met','easy','2.525 L เท่ากับกี่มิลลิลิตร','2.525 L = ? mL',2525,{dp:0,unit:'mL'},['1 L = 1,000 mL','2.525 × 1,000 = <b>2,525 mL</b>'],[252.5,25250,2525000],0,16,'g'),
  one('met','mid','2.525 L เท่ากับกี่ไมโครลิตร','2.525 L = ? µL',2525000,{dp:0,unit:'µL'},['1 L = 1,000,000 µL','2.525 × 1,000,000 = <b>2,525,000 µL</b>'],[2525,252500,25250000],0,16,'h'),
  one('met','hard','เติมสาร A, B และ C ปริมาณ 1.25 g, 35 mg และ 80 µg สารผสมมีน้ำหนักรวมกี่ mg','1.25 g + 35 mg + 80 µg',1285.08,{dp:2,unit:'mg'},['เปลี่ยนทุกตัวเป็น mg: 1.25 g = 1,250 mg และ 80 µg = 0.08 mg','รวม 1,250 + 35 + 0.08 = <b>1,285.08 mg</b>'],[1365,1285.8,116.33],2,17,'i'),
  one('apo','easy','60 grains เท่ากับกี่ scruples','60 gr = ? ℈',3,{dp:1,unit:'scruples'},['1 scruple = 20 grains','60 ÷ 20 = <b>3 scruples</b>'],[1,1200,20],1,28,'j'),
  one('apo','easy','60 grains เท่ากับกี่ drams','60 gr = ? ʒ',1,{dp:1,unit:'drams'},['1 dram = 60 grains','60 ÷ 60 = <b>1 dram</b>'],[3,8,0.125],1,28,'k'),
  one('apo','easy','16 fluid drams เท่ากับกี่ minims','16 fʒ = ? minims',960,{dp:0,unit:'minims'},['1 fluid dram = 60 minims','16 × 60 = <b>960 minims</b>'],[128,7680,259.68],0,28,'l'),
  one('apo','easy','16 fluid drams เท่ากับกี่ fluid ounces','16 fʒ = ? f℥',2,{dp:1,unit:'fluid ounces'},['1 fluid ounce = 8 fluid drams','16 ÷ 8 = <b>2 f℥</b>'],[128,1,4],1,28,'m'),
  one('apo','mid','เภสัชกรจ่ายยาเหน็บทวาร 36 แท่ง ตัวยา 2 gr. ต่อแท่ง มีตัวยาทั้งหมดกี่ scruples','36 แท่ง × 2 gr. → ℈',3.6,{dp:2,unit:'scruples'},['ตัวยาทั้งหมด 36 × 2 = 72 grains','1 scruple = 20 grains','72 ÷ 20 = <b>3.6 scruples</b>'],[1.2,1440,7.2],2,28,'n'),
  one('apo','easy','topical keratolytic solution ขวดขนาด 4 fluidrams เท่ากับกี่ minims','4 fʒ = ? minims',240,{dp:0,unit:'minims'},['1 fluidram = 60 minims','4 × 60 = <b>240 minims</b>'],[32,1920,64.92],0,28,'o'),
  one('hh','easy','แพทย์สั่ง Antacil® ครั้งละ 2 ช้อนโต๊ะ ผู้ป่วยทานยากี่มิลลิลิตร','2 ช้อนโต๊ะ = ? mL',30,{dp:0,unit:'mL'},['1 ช้อนโต๊ะ = 15 mL','15 × 2 ÷ 1 = <b>30 mL</b>'],[10,60,15],0,'Antacil','p'),
  one('hh','mid','แพทย์สั่ง Antacil® ครั้งละ 2 ช้อนโต๊ะ เท่ากับกี่ช้อนชา','2 ช้อนโต๊ะ = ? ช้อนชา',6,{dp:0,unit:'ช้อนชา'},['2 ช้อนโต๊ะ = 30 mL','5 mL = 1 ช้อนชา ดังนั้น 30 ÷ 5 = <b>6 ช้อนชา</b>'],[4,3,10],0,'Antacil','q'),
  one('hh','mid','Suprax® suspension (cefixime 100 mg/5 mL) ครั้งละ 2 ช้อนชา วันละ 2 ครั้ง 10 วัน ใช้ยาทั้งหมดกี่ mL','2 tsp × 2 × 10 วัน',200,{dp:0,unit:'mL'},['2 ช้อนชา = 10 mL','วันละ 2 ครั้ง = 20 mL','10 วัน = <b>200 mL</b>'],[100,400,600],0,'Suprax','r'),
  one('word','mid','Suprax® suspension (cefixime 100 mg/5 mL) ใช้ทั้งหมด 200 mL ได้รับ cefixime ทั้งหมดกี่กรัม','100 mg/5 mL × 200 mL',4,{dp:2,unit:'g'},['ยา 5 mL มี cefixime 100 mg','200 mL มี 100 × 200 ÷ 5 = 4,000 mg','= <b>4 g</b>'],[4000,20,0.4],2,'Suprax','s'),
  one('drop','mid','ยาหยอดหู 0.3 mL หลอดหยดสอบเทียบแล้ว 45 หยด = 2 mL ต้องหยดยากี่หยด','45 หยด = 2 mL, 0.3 mL = ?',6.75,{dp:2,unit:'หยด',alt:[7]},['2 mL เท่ากับ 45 หยด','0.3 mL เท่ากับ 45 × 0.3 ÷ 2 = <b>6.75 หยด</b> หรือประมาณ 7 หยด'],[13.5,6,3],2,'หยดหู','t'),
  one('drop','mid','สอบเทียบหลอดหยดกับกระบอกตวง 10 mL ได้ 40 หยด = 2 mL ต้องการ 0.25 mL ต้องหยดกี่หยด','40 หยด = 2 mL, 0.25 mL = ?',5,{dp:1,unit:'หยด'},['2 mL = 40 หยด ดังนั้น 1 mL = 20 หยด','0.25 × 20 = <b>5 หยด</b>'],[10,2.5,8],1,'กระบอกตวง','u'),
  one('word','hard','Tylenol with codeine® elixir มี codeine 12 mg ใน 5 mL จ่ายยา 4 fluidounces ผู้ป่วยได้รับยาทั้งหมดกี่ grains (ใช้ 1 f℥ = 30 mL, 1 gr = 65 mg)','12 mg/5 mL × 4 f℥ → grains',4.43,{dp:2,unit:'grains',tol:.015},['1 f℥ = 30 mL ดังนั้น 4 f℥ = 120 mL','codeine 12 × 120 ÷ 5 = 288 mg','288 ÷ 65 = <b>4.43 grains</b> (ถ้าใช้ exact 64.8 ได้ 4.44)'],[288,18.7,1.48],2,49,'v')
  ]; }

/* ---------- หน้าข้อสอบบทที่ 2 ---------- */
const QLV2=[['mix','ผสม','ทุกระดับ'],['easy','ง่าย','แปลงหน่วยตรงๆ'],['mid','ปานกลาง','ข้ามหน่วย ค่า exact'],['hard','ยาก','โจทย์หลายขั้น']];
const GOLD=[['1 gr','64.8 mg','≈ 65 mg'],['1 g','15.432 gr',''],['1 ℥ (apo)','31.1 g','480 gr'],['1 oz (avoir)','28.35 g','437.5 gr'],['1 lb apo','373.2 g','12 ℥'],['1 lb avoir','453.6 g','16 oz'],['1 mL','16.23 minims',''],['1 f℥','29.57 mL','≈ 30 mL'],['1 pint','473 mL','16 f℥'],['1 kg','2.20 lb',''],['1 ช้อนชา','5 mL',''],['1 ช้อนโต๊ะ','15 mL','3 ช้อนชา']];
function chSw(cur){ return `<div class="qchsw" role="tablist" aria-label="เลือกบท">${[[1,'บทที่ 1','เลขโรมัน เลขนัยสำคัญ'],[2,'บทที่ 2','มาตรชั่งและตวง']].map(([id,t,d])=>`<button class="qchb rp ${cur===id?'on':''}" role="tab" aria-selected="${cur===id}" data-qch="${id}" data-soft="1"><b>${t}</b><small>${d}</small></button>`).join('')}</div>`; }
function quiz2HTML(){
  const Z=ST.qz; Z.tps2=Z.tps2||TP2.slice(); Z.diff2=Z.diff2||'mix';
  const tp=TP2.map(k=>Z.tp[k]).filter(Boolean), ans=tp.reduce((a,s)=>a+s.all,0), ok=tp.reduce((a,s)=>a+s.ok,0), acc=ans?Math.round(ok/ans*100):null;
  const seg=(arr,cur,attr)=>`<div class="lvseg ${arr.length===3?'q3':''}" role="radiogroup">${arr.map(([id,n,d])=>`<button class="ls rp ${cur===id?'on':''}" role="radio" aria-checked="${cur===id}" ${attr}="${id}" data-soft="1"><b>${n}</b><small>${d}</small></button>`).join('')}</div>`;
  const S=Z.sets||{}, best=id=>{const x=S[id];return x?Math.round(x.best/x.n*100):null;};
  const wr=Z.wrong.filter(w=>qch(w.t)===2);
  const card=(id,ic,t,n,d)=>{const p=best(id);return `<button class="thb rp" data-qset="${id}"><b class="num">${n}</b><span><b>${t}</b><small>${d}${p!=null?` · ดีสุด ${p}%`:''}</small></span>${I.play}</button>`;};
  return pageHead('ข้อสอบบทที่ 2','มาตรชั่งและตวงทางเภสัชกรรม · พิมพ์ตอบและช้อยส์ · ทุกข้อมีเฉลยพร้อมหลักการคิด')+chSw(2)+`
   <section class="qhero qh-solo">
    <div class="qhero-b"><div class="qstat"><div><b class="num">${ans}</b><small>ทำแล้ว (ข้อ)</small></div><div><b class="num">${acc==null?'–':acc+'%'}</b><small>แม่นยำ</small></div><div><b class="num">${Z.best}</b><small>ถูกติดกัน</small></div></div>
     <div class="qstyle"><span class="qstyle-l">รูปแบบการตอบ</span>${seg(QSTYLE,Z.style,'data-qstyle')}<small>พิมพ์ตอบ: ใส่แค่ตัวเลข มีจุลภาคหรือไม่ก็ได้ ระบบยอมรับค่าที่ปัดเศษใกล้เคียงและค่า practical ที่หนังสือยอมรับ</small></div></div></section>
   ${wpSection()}

   ${zone(1,'เตรียมตัว','จำตัวเลขทองให้แม่น แล้วค่อยลุยข้อสอบ',I.bulb,'z0')}
   <section class="zcard gold"><h3 class="zc-t">${I.spark}ตัวเลขทองของบทนี้</h3><p class="zc-d">exact ใช้ปรุงยา practical ใช้ประมาณ โจทย์บอกค่าไหนให้ใช้ค่านั้น</p>
    <div class="goldg">${GOLD.map(([a,b,c])=>`<div class="gd"><small>${a}</small><b class="num">${b}</b>${c?`<i class="num">${c}</i>`:''}</div>`).join('')}</div>
    <button class="btn ghost lg rp wide" data-bkpg="${C2P(1)}">${I.book}อ่านสรุปบทที่ 2 (18 หน้า)</button></section>

   ${zone(2,'ข้อสอบทฤษฎี','ช้อยส์ล้วน ตอบผิดมีเฉลยพร้อมเหตุผล',I.quiz,'z1')}
   <section class="thcard"><header><span class="th-ic">${I.quiz}</span><div><h2>ข้อช้อยทฤษฎีบทที่ 2</h2><p>ช้อยส์ล้วน <b class="num">${CON2.length}</b> ข้อ ครอบคลุมทั้ง 4 ระบบ</p><span class="sc-tag">ช้อยส์อย่างเดียว</span></div></header>
    <div class="thgrid">${card('c2:th',I.quiz,'ทำทั้งหมด',CON2.length,'สลับข้อทุกครั้ง')}</div></section>

   ${zone(3,'แบบฝึกหัดจากชีทและสไลด์','โจทย์ชุดเดียวกับไฟล์ที่ส่งมา ตรวจตามเฉลยสีแดง',I.book,'z1')}
   <section class="thcard"><header><span class="th-ic">${I.book}</span><div><h2>แบบฝึกหัดบทที่ 2</h2><p>แบบฝึกหัดมาตรวัด และแบบฝึกในสไลด์</p><span class="sc-tag">พิมพ์ตอบหรือช้อยส์</span></div></header>
    <div class="thgrid">${card('c2:sh',I.book,'แบบฝึกหัดในชีท',set2Sheet().length,'ข้อ 1.1 ถึงข้อ 13')}${card('c2:sl',I.spark,'แบบฝึกในสไลด์',set2Slide().length,'สไลด์ 16, 17, 28, 49 และตัวอย่าง')}</div></section>

   ${zone(4,'ฝึกซ้อม','ไม่จำกัดจำนวนข้อ อยากหยุดตอนไหนกด "หยุดและดูสรุป"',I.dice,'z2')}
   ${wr.length?`<button class="qmode warn rp" data-qset="wrong"><span class="qm-ic">${I.alert}</span><span><b>ทำข้อที่เคยผิดอีกครั้ง</b><small class="num">${wr.length} ข้อ ตอบถูกแล้วจะออกจากรายการ</small></span>${I.play}</button>`:''}
   <section class="zcard"><h3 class="zc-t">${I.dice}สุ่มโจทย์บทที่ 2</h3><p class="zc-d">ตัวเลขใหม่ทุกครั้ง เลือกระดับและเรื่องได้</p>
    <h4 class="mini">ระดับ</h4>${seg(QLV2,Z.diff2,'data-q2diff')}
    <h4 class="mini">เรื่อง <button class="link sm rp" data-q2all="1">${Z.tps2.length===TP2.length?'เอาออกทั้งหมด':'เลือกทั้งหมด'}</button></h4>
    <div class="fchips">${TP2.map(k=>`<button class="fchip rp ${Z.tps2.includes(k)?'on':''}" data-q2tp="${k}" data-soft="1" aria-pressed="${Z.tps2.includes(k)}">${Z.tps2.includes(k)?I.check:''}${QT[k].n}${k==='con2'?' <i class="mc-tag">ช้อยส์</i>':''}</button>`).join('')}</div>
    <button class="btn lg rp wide" data-qset="gen2" ${Z.tps2.length?'':'disabled'}>${I.dice}เริ่มสุ่มโจทย์</button></section>

   ${zone(5,'ข้อสอบตามหัวข้อ','เลือกหัวข้อแล้วเริ่มทำได้เลย',I.quiz,'z1')}
   <section class="zcard"><h3 class="zc-t">${I.book}บทที่ 2 · มาตรชั่งและตวงทางเภสัชกรรม</h3><p class="zc-d">แตะหัวข้อที่อยากทำ ทำได้ไม่จำกัดข้อ</p>
    <div class="list">${TP2.map(k=>{const a=tpAcc(k),s=Z.tp[k];return `<button class="trow rp" data-q2one="${k}"><span class="trow-b"><b>${QT[k].n}</b><small class="num">${s?`ทำแล้ว ${s.all} ข้อ`:'ยังไม่เคยทำ'}</small></span><span class="macc num ${a==null?'new':a>=80?'hi':a>=50?'mid':'lo'}">${a==null?'ใหม่':a+'%'}</span><span class="trow-go">${I.play}</span></button>`;}).join('')}</div></section>
   ${CHAPTERS.filter(c=>!c.ready).map(c=>`<button class="xrow soon rp" data-soon="${c.id}"><span class="sc-ic">${I.lock}</span><span><b>บทที่ ${c.id}</b><small>${esc(c.name||'')}</small></span><i class="mc-tag">soon</i></button>`).join('')}</div>`;
}
function quiz2Bind(){
  const Z=ST.qz, rr=()=>{const y=scrollY;render();scrollTo(0,y);};
  $$('[data-q2diff]').forEach(b=>b.onclick=()=>{Z.diff2=b.dataset.q2diff;save();rr();});
  $$('[data-q2tp]').forEach(b=>b.onclick=()=>{const k=b.dataset.q2tp;Z.tps2=Z.tps2.includes(k)?Z.tps2.filter(x=>x!==k):[...Z.tps2,k];save();rr();});
  $$('[data-q2all]').forEach(b=>b.onclick=()=>{Z.tps2=Z.tps2.length===TP2.length?[]:TP2.slice();save();rr();});
  $$('[data-q2one]').forEach(b=>b.onclick=()=>startQuiz('gen',{tps:[b.dataset.q2one],diff:Z.diff2||'mix'}));
  $$('[data-bkpg]').forEach(b=>b.onclick=()=>{UI.bookJump=+b.dataset.bkpg;go('book');});
}

/* ===================== คลังโจทย์ปัญหา 500 ข้อ (แบบสไลด์: Suprax, Antacil, Tylenol with codeine, หยดหู) ===================== */
Object.assign(QT,{
  wpA:{n:'ยาน้ำตามขนาดที่สั่ง (แบบ Suprax)',pg:C2P(15),ch:3},
  wpB:{n:'แปลงช้อนโต๊ะ ช้อนชา (แบบ Antacil)',pg:C2P(14),ch:3},
  wpC:{n:'ยาน้ำเป็น grains (แบบ Tylenol with codeine)',pg:C2P(18),ch:3},
  wpD:{n:'หลอดหยดที่สอบเทียบ (แบบยาหยอดหู)',pg:C2P(15),ch:3}
});
const WPK=['wpA','wpB','wpC','wpD'];
const WPN={wpA:'A',wpB:'B',wpC:'C',wpD:'D'};
const SPN={tsp:['ช้อนชา',5],tbsp:['ช้อนโต๊ะ',15]};
const eqL=(a,b,v)=>`<span class="eq"><span class="eq-a">${a}</span><span class="eqv">${v||'เท่ากับ'}</span><span class="eq-b">${b}</span></span>`;
let WPB=null;
function wpBank(){ if(WPB) return WPB; const out=[]; const mc2=q=>q; /* ข้อเขียนเติมคำตอบล้วน ไม่มีช้อยส์ */
  seeded(20261116,()=>{
    const add=(t,list,mk)=>{ const seen=new Set(); let g=0; while(list.length<125&&g++<20000){ const q=mk(); if(!q||seen.has(q.id)) continue; seen.add(q.id); list.push(q); } };
    /* ---- A: ยาน้ำแขวนตะกอนตามขนาดที่สั่ง ---- */
    const DA=[['Suprax® suspension','cefixime',100,5],['Amoxil® suspension','amoxicillin',125,5],['Amoxil® forte','amoxicillin',250,5],['Tylenol® syrup','paracetamol',120,5],['Tempra® forte','paracetamol',250,5],['Brufen® syrup','ibuprofen',100,5],['Zithromax® suspension','azithromycin',200,5],['Bactrim® suspension','sulfamethoxazole',200,5],['Augmentin® suspension','amoxicillin',228,5],['Klacid® suspension','clarithromycin',125,5],['Ceclor® suspension','cefaclor',125,5],['Motilium® suspension','domperidone',5,5],['Zyrtec® syrup','cetirizine',5,5],['Dimetapp® syrup','brompheniramine',2,5]];
    const A=[]; add('wpA',A,()=>{ const [br,dr,mg,per]=pick(DA), sk=Math.random()<.75?'tsp':'tbsp', [sn,sml]=SPN[sk], s=pick(sk==='tsp'?[0.5,1,1,1.5,2,2,3]:[0.5,1,1,2]), t=pick([2,2,3,3,4]), d=pick([3,5,5,7,7,10,10,14]);
      const dose=s*sml, day=dose*t, tot=day*d, mgT=mg*tot/per, ask=pick(['ml','drug','both','both']);
      const useG=mgT>=1000, dv=useG?mgT/1000:mgT, du=useG?'กรัม':'มิลลิกรัม', dU=useG?'g':'mg';
      const stem=`ยา ${br} มีความเข้มข้นยา ${dr} ${mg} มิลลิกรัม ต่อ ${per} มิลลิลิตร ถ้าผู้ป่วยทานยาครั้งละ ${fm(s)} ${sn} วันละ ${t} ครั้ง เป็นเวลา ${d} วัน `+
        (ask==='ml'?'อยากทราบว่าคนไข้ทานยาทั้งหมดกี่มิลลิลิตร':ask==='drug'?`อยากทราบว่าคนไข้ได้รับยา ${dr} ทั้งหมดกี่${du}`:`อยากทราบว่าคนไข้ทานยาทั้งหมดกี่มิลลิลิตร และได้รับยา ${dr} ทั้งหมดกี่${du}`);
      const exp=[`ผู้ป่วยได้รับยา ${fm(s)} ${sn} วันละ ${t} ครั้ง เป็นเวลา ${d} วัน`,eqL(`1 ${sn}`,`${sml} มิลลิลิตร`),eqL(`${fm(s)} ${sn}`,`${sml} มิลลิลิตร × ${fm(s)} ${sn} / 1 ${sn} = <b>${fm(dose)} มิลลิลิตร</b>`),
        `ทาน วันละ ${t} ครั้ง = ${fm(dose)} × ${t} = <b>${fm(day)} มิลลิลิตร</b>`,`ทาน ${d} วัน = ${fm(day)} × ${d} = <b>${fm(tot)} มิลลิลิตร</b>`];
      if(ask!=='ml') exp.push(eqL(`ยาน้ำ ${per} มิลลิลิตร`,`${dr} ${mg} มิลลิกรัม`,'มีตัวยา'),eqL(`ยาน้ำ ${fm(tot)} มิลลิลิตร`,`${mg} มิลลิกรัม × ${fm(tot)} มล. / ${per} มล. = <b>${fm(mgT)} มิลลิกรัม</b>`+(useG?` = <b>${fm(dv,3)} กรัม</b>`:''),'มีตัวยา'));
      const fl=ask==='ml'?[NF(tot,{dp:1,unit:'mL'})]:ask==='drug'?[NF(dv,{dp:3,unit:dU})]:[NF(tot,{dp:1,unit:'mL',lab:'ยาทั้งหมด'}),NF(dv,{dp:3,unit:dU,lab:`${dr} ทั้งหมด`})];
      const q=Q2('wpA',ask==='ml'?'easy':ask==='drug'?'mid':'hard',stem,`${mg} mg/${per} mL · ${fm(s)} ${sn} × ${t} ครั้ง × ${d} วัน`,fl,exp,{sub:[br,s,sk,t,d,ask].join('/')});
      if(fl.length===1) return ask==='ml'?mc2(q,[dose*d,day,tot*(sk==='tsp'?3:1/3),s*t*d],1):mc2(q,[useG?mgT:mgT/1000,mg*tot/(per*2),mg*s*t*d/(useG?1000:1),dv*t],3);
      return q; });
    /* ---- B: ช้อนโต๊ะ ช้อนชา มิลลิลิตร ---- */
    const DB=['Antacil®','Alum milk','Mylanta®','Gaviscon®','Kremil-S®','Air-X® syrup','Simethicone syrup','Milk of Magnesia','ยาธาตุน้ำแดง','Bisolvon® elixir','Benadryl® syrup','Dextromethorphan syrup','ORS'];
    const B=[]; add('wpB',B,()=>{ const nm=pick(DB), k=pick(['tb2','tb2','ts2','ml2','oz']);
      if(k==='tb2'){ const n=pick([0.5,1,1.5,2,2.5,3,4]); const ml=n*15, ts=ml/5; const ask=pick(['ml','tsp','both']);
        const stem=`แพทย์สั่งจ่ายยา ${nm} ครั้งละ ${fm(n)} ช้อนโต๊ะ ผู้ป่วยท่านนี้ทานยา`+(ask==='ml'?'กี่มิลลิลิตร':ask==='tsp'?'กี่ช้อนชา':'กี่มิลลิลิตร หรือกี่ช้อนชา');
        const exp=[eqL('1 ช้อนโต๊ะ','15 มิลลิลิตร'),eqL(`${fm(n)} ช้อนโต๊ะ`,`15 มิลลิลิตร × ${fm(n)} ช้อนโต๊ะ / 1 ช้อนโต๊ะ = <b>${fm(ml)} มิลลิลิตร</b>`),eqL('5 มิลลิลิตร','1 ช้อนชา'),eqL(`${fm(ml)} มิลลิลิตร`,`1 ช้อนชา × ${fm(ml)} มิลลิลิตร / 5 มิลลิลิตร = <b>${fm(ts)} ช้อนชา</b>`),`ดังนั้นผู้ป่วยทานยาครั้งละ ${fm(ml)} มิลลิลิตร หรือเท่ากับ ${fm(ts)} ช้อนชา`];
        const fl=ask==='ml'?[NF(ml,{dp:1,unit:'mL'})]:ask==='tsp'?[NF(ts,{dp:2,unit:'ช้อนชา'})]:[NF(ml,{dp:1,unit:'mL',lab:'มิลลิลิตร'}),NF(ts,{dp:2,unit:'ช้อนชา',lab:'ช้อนชา'})];
        const q=Q2('wpB',ask==='both'?'mid':'easy',stem,`${fm(n)} ช้อนโต๊ะ`,fl,exp,{sub:[nm,k,n,ask].join('/')});
        return fl.length>1?q:ask==='ml'?mc2(q,[n*5,n*30,ts],1):mc2(q,[n*2,n*5,ml],2); }
      if(k==='ts2'){ const n=pick([1,2,3,4,5,6,9]); const ml=n*5, tb=ml/15;
        const q=Q2('wpB','mid',`แพทย์สั่งจ่ายยา ${nm} ครั้งละ ${n} ช้อนชา ถ้าผู้ป่วยมีแต่ช้อนโต๊ะ ต้องตวงยาครั้งละกี่ช้อนโต๊ะ`,`${n} ช้อนชา → ช้อนโต๊ะ`,[NF(tb,{dp:2,unit:'ช้อนโต๊ะ'})],
          [eqL('1 ช้อนชา','5 มิลลิลิตร'),eqL(`${n} ช้อนชา`,`5 มิลลิลิตร × ${n} ช้อนชา / 1 ช้อนชา = <b>${ml} มิลลิลิตร</b>`),eqL('15 มิลลิลิตร','1 ช้อนโต๊ะ'),eqL(`${ml} มิลลิลิตร`,`1 ช้อนโต๊ะ × ${ml} มิลลิลิตร / 15 มิลลิลิตร = <b>${fm(tb,2)} ช้อนโต๊ะ</b>`)],{sub:[nm,k,n].join('/')});
        return mc2(q,[n*3,n/2,ml/10],2); }
      if(k==='ml2'){ const ml=pick([7.5,10,15,20,22.5,25,30,45,60]), to=pick(['tsp','tbsp']), [sn,f]=SPN[to], r=ml/f;
        const q=Q2('wpB','mid',`แพทย์สั่งจ่ายยา ${nm} ครั้งละ ${fm(ml)} มิลลิลิตร ต้องเขียนฉลากให้ผู้ป่วยตวงครั้งละกี่${sn}`,`${fm(ml)} mL → ${sn}`,[NF(r,{dp:2,unit:sn})],
          [eqL(`${f} มิลลิลิตร`,`1 ${sn}`),eqL(`${fm(ml)} มิลลิลิตร`,`1 ${sn} × ${fm(ml)} มิลลิลิตร / ${f} มิลลิลิตร = <b>${fm(r,2)} ${sn}</b>`)],{sub:[nm,k,ml,to].join('/')});
        return mc2(q,[ml/(f===5?15:5),ml*f,r*2],2); }
      const oz=pick([0.5,1,1.5,2,3]), to=pick(['tbsp','tsp']), [sn,f]=SPN[to], ml=oz*30, r=ml/f;
      const q=Q2('wpB','hard',`แพทย์สั่งจ่ายยา ${nm} ครั้งละ ${fm(oz)} fluid ounce(s) ผู้ป่วยต้องตวงยาครั้งละกี่${sn} (มาตรประจำบ้าน 1 fl oz = 30 มิลลิลิตร)`,`${fm(oz)} f℥ → ${sn}`,[NF(r,{dp:2,unit:sn})],
        [eqL('1 fluid ounce','30 มิลลิลิตร'),eqL(`${fm(oz)} fluid ounce`,`30 มิลลิลิตร × ${fm(oz)} / 1 = <b>${fm(ml)} มิลลิลิตร</b>`),eqL(`${f} มิลลิลิตร`,`1 ${sn}`),eqL(`${fm(ml)} มิลลิลิตร`,`1 ${sn} × ${fm(ml)} / ${f} = <b>${fm(r,2)} ${sn}</b>`)],{sub:[nm,'oz',oz,to].join('/')});
      return mc2(q,[oz*(f===5?2:6),oz*29.57/f*1.5,r/2],2); });
    /* ---- C: ยาน้ำ แล้วเปลี่ยนเป็น grains ---- */
    const DC=[['Tylenol with codeine® elixir','codeine',12,5],['Phenobarbital elixir','phenobarbital',20,5],['Codeine phosphate syrup','codeine',15,5],['Phenergan® with codeine','codeine',10,5],['Robitussin AC®','codeine',10,5],['Luminal® elixir','phenobarbital',15,5],['Morphine sulfate oral solution','morphine',10,5],['Chloral hydrate syrup','chloral hydrate',500,5]];
    const C=[]; add('wpC',C,()=>{ const [nm,dr,mg,per]=pick(DC), vk=pick(['oz','oz','oz','pt']), oz=vk==='oz'?pick([1,2,3,4,5,6,8]):pick([0.5,1]);
      const ml=vk==='oz'?oz*30:oz*473, mgT=mg*ml/per, gr=mgT/65, ask=pick(['gr','gr','gr','mg']);
      const vol=vk==='oz'?`${fm(oz)} fluidounces`:`${fm(oz)} pint`;
      const stem=`ยา ${nm} มีตัวยา ${dr} ${fm(mg)} มิลลิกรัม ในยาปริมาตรเท่ากับ ${per} มิลลิลิตร เภสัชกรจ่ายยาให้กับผู้ป่วย ปริมาณ ${vol} อยากทราบว่าผู้ป่วยได้รับยาทั้งหมดกี่`+(ask==='gr'?` grains (ใช้ ${vk==='oz'?'1 f℥ = 30 mL':'1 pint = 473 mL'} และ 1 gr = 65 mg)`:'มิลลิกรัม'+(vk==='oz'?' (ใช้ 1 f℥ = 30 mL)':' (ใช้ 1 pint = 473 mL)'));
      const exp=[vk==='oz'?eqL('1 fluid ounce (f℥)','30 มิลลิลิตร'):eqL('1 pint','473 มิลลิลิตร'),
        vk==='oz'?eqL(`${fm(oz)} fluid ounces`,`30 มิลลิลิตร × ${fm(oz)} f℥ / 1 f℥ = <b>${fm(ml)} มิลลิลิตร</b>`):eqL(`${fm(oz)} pint`,`473 × ${fm(oz)} = <b>${fm(ml,1)} มิลลิลิตร</b>`),
        eqL(`ยาปริมาตร ${per} มิลลิลิตร`,`${dr} ${fm(mg)} มิลลิกรัม`,'มีตัวยา'),eqL(`ยาปริมาตร ${fm(ml,1)} มิลลิลิตร`,`${fm(mg)} มิลลิกรัม × ${fm(ml,1)} มล. / ${per} มล. = <b>${fm(mgT,2)} มิลลิกรัม</b>`,'มีตัวยา')];
      if(ask==='gr') exp.push(`เปลี่ยนเป็น grains: ${fm(mgT,2)} ÷ 65 ≈ <b>${fm(gr,2)} grains</b> (ถ้าใช้ค่า exact 1 gr = 64.8 mg ได้ ${fm(mgT/64.8,2)} grains)`);
      const f=ask==='gr'?NF(gr,{dp:2,unit:'grains',rel:.004,alt:[mgT/64.8,mg*(vk==='oz'?oz*29.57:ml)/per/64.8,mg*(vk==='oz'?oz*29.57:ml)/per/65]}):NF(mgT,{dp:2,unit:'mg',alt:vk==='oz'?[mg*oz*29.57/per]:[]});
      const q=Q2('wpC',ask==='mg'?'mid':'hard',stem,`${fm(mg)} mg/${per} mL · ${vol}`,[f],exp,{sub:[nm,vk,oz,ask].join('/')});
      return ask==='gr'?mc2(q,[mgT/15.432,mgT*65/1000,gr*12,mg*oz/65],2):mc2(q,[mg*oz,mgT/5,mgT*2],2); });
    /* ---- D: หลอดหยดที่สอบเทียบ ---- */
    const DD=['ยาหยอดหู','ยาหยอดตา','ยาหยอดจมูก','ยาน้ำเด็กชนิดหยด','วิตามินชนิดหยด','ยาลดไข้ชนิดหยด'];
    const D=[]; add('wpD',D,()=>{ const nm=pick(DD), cal=pick([[45,2],[40,2],[30,2],[36,2],[50,2],[20,1],[25,1],[16,1],[60,3],[48,2],[55,2],[42,2]]), [dr,ml]=cal, v=pick([0.1,0.2,0.25,0.3,0.4,0.5,0.6,0.75,0.8,1,1.2,1.5]);
      const r=dr*v/ml, rr=Math.round(r), whole=Math.abs(r-rr)<1e-9;
      const q=Q2('wpD',whole?'easy':'mid',`แพทย์สั่งจ่าย${nm}ให้กับคนไข้ครั้งละ ${fm(v)} มิลลิลิตร เภสัชกรทำการสอบเทียบหลอดหยด พบว่า ${dr} หยด เท่ากับ ${ml} มิลลิลิตร อยากทราบว่าคนไข้ต้องหยดยาเท่ากับกี่หยด`,`${dr} หยด = ${ml} mL · ต้องการ ${fm(v)} mL`,
        [NF(r,{dp:2,unit:'หยด',alt:whole?[]:[rr]})],[eqL(`${ml} มิลลิลิตร`,`${dr} หยด`),eqL(`${fm(v)} มิลลิลิตร`,`${dr} หยด × ${fm(v)} มล. / ${ml} มล. = <b>${fm(r,2)} หยด</b>${whole?'':` หรือประมาณ <b>${rr} หยด</b>`}`)],{sub:[nm,dr,ml,v].join('/')});
      return mc2(q,[ml*v/dr*10,dr*v,v*20,r*2],2); });
    [A,B,C,D].forEach((L,j)=>L.forEach((q,i)=>{ q.wp=1; q.src='โจทย์ปัญหา'; q.no=`${'ABCD'[j]}${i+1}`; q.id='wp|'+q.t+'|'+i; }));
    out.push(...A,...B,...C,...D);
  });
  WPB=out; return out; }
WPK.forEach(k=>{ GEN[k]=lv=>{ const L=wpBank().filter(q=>q.t===k), M=lv==='new'?L.filter(q=>!(ST.qz.wpOk||{})[q.id]):L; return Object.assign({},pick(M.length?M:L)); }; });

/* ---------- หน้าคลังโจทย์ปัญหา ---------- */
function wpBanner(){ const Z=ST.qz, ok=Object.keys(Z.wpOk||{}).length;
  return `<button class="wpban rp" data-qch="3"><span class="wpb-k">${I.flame}ใหม่ · คลังโจทย์ปัญหา</span><b class="wpb-t">โจทย์ปัญหา <span class="num">500</span> ข้อ</b>
    <span class="wpb-d">ยาน้ำตามขนาดที่สั่ง · ช้อนโต๊ะ ช้อนชา · ยาน้ำเป็น grains · หลอดหยด ข้อเขียนเติมคำตอบ สุ่มคละ เฉลยเป็นวิธีทำเทียบบัญญัติไตรยางศ์</span>
    <span class="wpb-p"><span class="wpb-bar"><i style="width:${ok/5}%"></i></span><small class="num">ทำถูกแล้ว ${ok}/500</small></span><span class="wpb-go">เริ่มเลย ${I.chev}</span></button>`; }
function wpSection(){
  const Z=ST.qz, OK=Z.wpOk||{}, B=wpBank(), _seg=(arr,cur,attr)=>`<div class="lvseg ${arr.length===3?'q3':''}" role="radiogroup">${arr.map(([id,n,d])=>`<button class="ls rp ${cur===id?'on':''}" role="radio" aria-checked="${cur===id}" ${attr}="${id}" data-soft="1"><b>${n}</b><small>${d}</small></button>`).join('')}</div>`;
  const ok=Object.keys(OK).length;
  const IMGS={wpA:'Suprax',wpB:'Antacil',wpC:'Tylenol with codeine',wpD:'ยาหยอดหู'};
  const DESC={wpA:'ความเข้มข้น mg/5 mL ครั้งละกี่ช้อน วันละกี่ครั้ง กี่วัน หายาทั้งหมดเป็น mL และ g',wpB:'ช้อนโต๊ะ ↔ มิลลิลิตร ↔ ช้อนชา และ fl oz เป็นช้อน',wpC:'จ่ายยากี่ fluidounces หรือ pint แล้วหาตัวยาเป็น mg และ grains',wpD:'สอบเทียบหลอดหยด กี่หยดเท่ากับกี่ mL แล้วหาจำนวนหยด'};
  return `<div id="wpsec">
   <section class="wphero"><div><span class="wpb-k">${I.flame}คลังโจทย์ปัญหา</span><h2>โจทย์ปัญหา <span class="num">500</span> ข้อ</h2><p>ข้อเขียนเติมคำตอบ 4 แบบ แบบละ 125 ข้อ สุ่มไม่ซ้ำ เฉลยเป็นวิธีทำเทียบบัญญัติไตรยางศ์</p>
     <div class="wph-st"><div><b class="num">${ok}</b><small>ทำถูกแล้ว</small></div><div><b class="num">${500-ok}</b><small>ยังไม่ผ่าน</small></div><div><b class="num">${Math.round(ok/5)}%</b><small>ของคลัง</small></div></div>
     <button class="btn lg rp wide wph-go" data-qset="wp:mix">${I.dice}สุ่มโจทย์ทั้ง 500 ข้อ</button>
     <button class="btn ghost rp wide" data-qset="wp:new">${I.play}สุ่มเฉพาะข้อที่ยังไม่เคยทำถูก</button></div></section>
   <p class="wpsub">หรือเลือกฝึกเฉพาะแบบ</p>
   <div class="wpgrid">${WPK.map((k,i)=>{ const L=B.filter(q=>q.t===k), d=L.filter(q=>OK[q.id]).length;
     return `<button class="wpc rp wpc-${i+1}" data-qset="wp:${k}"><span class="wpc-n">${'ABCD'[i]}</span><span class="wpc-b"><small>แบบ ${IMGS[k]}</small><b>${QT[k].n.replace(/ \(.*\)/,'')}</b><span>${DESC[k]}</span>
       <span class="wpc-p"><span class="wpb-bar"><i style="width:${d/L.length*100}%"></i></span><small class="num">ถูกแล้ว ${d}/${L.length}</small></span></span>${I.play}</button>`; }).join('')}</div></div>`;
}

const QSTYLE=[['type','พิมพ์ตอบ','แบบข้อเขียน'],['mc','ช้อยส์','เลือก 4 ตัวเลือก'],['mix','ผสม','สลับกันไป']];
const QLV=[['mix','ผสม','ทุกระดับ'],['easy','ง่าย','ถามตรง'],['mid','ปานกลาง','หลักการลด กฎเลข 5'],['hard','ยาก','ขีดบน ยกกำลังสิบ หลายขั้น']];
const tpAcc=t=>{const s=ST.qz.tp[t];return s&&s.all?Math.round(s.ok/s.all*100):null;};
const fig=q=>q.fig&&q.fig.k==='cyl'?cylSVG(q.fig.step,q.fig.v):'';

/* ---------- ภาพกระบอกตวง ---------- */
function cylSVG(step,v){
  const span=step>=10?50:step===1?10:1, lo=step>=10?0:Math.floor(v/(step*5))*step*5-(step*5), hi=lo+span+(step>=10?0:step*5);
  const top=24,bot=286,x0=70,x1=170, Y=val=>bot-(val-lo)/(hi-lo)*(bot-top);
  let ticks=''; const n=Math.round((hi-lo)/step);
  for(let i=0;i<=n;i++){ const val=+(lo+i*step).toFixed(3), y=Y(val), major=step>=10||i%5===0;
    ticks+=`<line x1="${x1-(major?34:18)}" x2="${x1}" y1="${y}" y2="${y}" stroke="currentColor" stroke-width="${major?2.2:1.4}"/>`;
    if(major) ticks+=`<text x="${x1-40}" y="${y+5}" text-anchor="end" font-size="15" fill="currentColor" font-weight="600">${+val.toFixed(2)}</text>`; }
  const y=Y(v);
  return `<svg class="cyl" viewBox="0 0 240 310" role="img" aria-label="ภาพกระบอกตวง">
   <rect x="${x0}" y="${top-14}" width="${x1-x0}" height="${bot-top+30}" rx="6" fill="var(--surface)" stroke="currentColor" stroke-width="2.4"/>
   <path d="M${x0+2} ${y+0.5} Q${(x0+x1)/2} ${y+12} ${x1-2} ${y+0.5} L${x1-2} ${bot+14} L${x0+2} ${bot+14}Z" fill="#7CC7F2" opacity=".55"/>
   <path d="M${x0+2} ${y+0.5} Q${(x0+x1)/2} ${y+12} ${x1-2} ${y+0.5}" fill="none" stroke="#1E78B4" stroke-width="2"/>
   ${ticks}
   <path d="M8 ${y+6.5}H${x0-8}M${x0-18} ${y-1}L${x0-6} ${y+6.5}L${x0-18} ${y+14}" fill="none" stroke="#3A63B8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
   <text x="${x1+8}" y="${top+2}" font-size="14" font-weight="700" fill="currentColor">mL</text></svg>`;
}

/* ---------- หน้าเลือกโหมด ---------- */
function quizHTML(){
  if(UI.ch===3){ UI.ch=2; UI.wpJump=1; }
  if(UI.ch===2) return quiz2HTML();
  const Z=ST.qz, acc=Z.ans?Math.round(Z.ok/Z.ans*100):null;
  const seg=(arr,cur,attr)=>`<div class="lvseg ${arr.length===3?'q3':''}" role="radiogroup">${arr.map(([id,n,d])=>`<button class="ls rp ${cur===id?'on':''}" role="radio" aria-checked="${cur===id}" ${attr}="${id}" data-soft="1"><b>${n}</b><small>${d}</small></button>`).join('')}</div>`;
  return pageHead('ข้อสอบบทที่ 1','เลขโรมัน และเลขนัยสำคัญ · พิมพ์ตอบและช้อยส์ · ทุกข้อมีเฉลยพร้อมหลักการคิด')+chSw(1)+`
   <section class="qhero qh-solo">
    <div class="qhero-b"><div class="qstat"><div><b class="num">${Z.ans}</b><small>ทำแล้ว (ข้อ)</small></div><div><b class="num">${acc==null?'–':acc+'%'}</b><small>แม่นยำ</small></div><div><b class="num">${Z.best}</b><small>ถูกติดกัน</small></div></div>
     <div class="qstyle"><span class="qstyle-l">รูปแบบการตอบ</span>${seg(QSTYLE,Z.style,'data-qstyle')}<small>พิมพ์ตอบ: ตัวเล็กใหญ่ เว้นวรรคหรือไม่ก็ได้ ขอแค่ตัวอักษรครบและเรียงถูก</small></div></div></section>

   ${zone(1,'เตรียมตัว','อ่านสรุปกฎก่อน แล้วค่อยลุยข้อสอบ',I.bulb,'z0')}
   ${primeBanner()}

   ${zone(2,'ข้อสอบทฤษฎี','ช้อยส์ล้วน ทำได้ทันที ตอบผิดมีเฉลยพร้อมเหตุผล',I.quiz,'z1')}
   ${theoryCard()}

   ${zone(3,'ฝึกซ้อม','ไม่จำกัดจำนวนข้อ อยากหยุดตอนไหนกด "หยุดและดูสรุป"',I.dice,'z2')}
   ${Z.wrong.some(w=>qch(w.t)===1)?`<button class="qmode warn rp" data-qset="wrong"><span class="qm-ic">${I.alert}</span><span><b>ทำข้อที่เคยผิดอีกครั้ง</b><small class="num">${Z.wrong.filter(w=>qch(w.t)===1).length} ข้อ ตอบถูกแล้วจะออกจากรายการ</small></span>${I.play}</button>`:''}
   <section class="zcard"><h3 class="zc-t">${I.dice}สุ่มโจทย์</h3><p class="zc-d">ตัวเลขใหม่ทุกครั้ง เลือกระดับและเรื่องได้</p>
    <h4 class="mini">ระดับ</h4>${seg(QLV,Z.diff,'data-qdiff')}
    <h4 class="mini">เรื่อง <button class="link sm rp" data-qall="1">${Z.tps.length===TP1.length?'เอาออกทั้งหมด':'เลือกทั้งหมด'}</button></h4>
    <div class="fchips">${Object.entries(QT).filter(([k])=>qch(k)===1).map(([k,t])=>`<button class="fchip rp ${Z.tps.includes(k)?'on':''}" data-qtp="${k}" data-soft="1" aria-pressed="${Z.tps.includes(k)}">${Z.tps.includes(k)?I.check:''}${t.n}${k==='concept'?' <i class="mc-tag">ช้อยส์</i>':''}</button>`).join('')}</div>
    <button class="btn lg rp wide" data-qset="gen" ${Z.tps.length?'':'disabled'}>${I.dice}เริ่มสุ่มโจทย์</button></section>


   ${zone(4,'ข้อสอบตามหัวข้อ','เลือกหัวข้อแล้วเริ่มทำได้เลย',I.quiz,'z1')}
   <section class="zcard"><h3 class="zc-t">${I.book}บทที่ 1 · เลขโรมัน และเลขนัยสำคัญ</h3><p class="zc-d">แตะหัวข้อที่อยากทำ ทำได้ไม่จำกัดข้อ</p>
    <div class="list">${Object.entries(QT).filter(([k])=>qch(k)===1).map(([k,t])=>{const a=tpAcc(k),s=Z.tp[k];return `<button class="trow rp" data-qone="${k}"><span class="trow-b"><b>${t.n}</b><small class="num">${s?`ทำแล้ว ${s.all} ข้อ`:'ยังไม่เคยทำ'}</small></span><span class="macc num ${a==null?'new':a>=80?'hi':a>=50?'mid':'lo'}">${a==null?'ใหม่':a+'%'}</span><span class="trow-go">${I.play}</span></button>`;}).join('')}</div></section>
   ${CHAPTERS.filter(c=>!c.ready).map(c=>`<button class="xrow soon rp" data-soon="${c.id}"><span class="sc-ic">${I.lock}</span><span><b>บทที่ ${c.id}</b><small>${esc(c.name||'')}</small></span><i class="mc-tag">soon</i></button>`).join('')}</div>`;
}
function primeBanner(){ const n=pmRead(), N=PRIME_L.length;
  return `<button class="pban rp" data-tab="prime" aria-label="ปูพื้นฐานก่อนสอบ อ่านแล้ว ${n} จาก ${N} บท">
   <span class="pban-b"><span class="pban-k">${I.bulb}เริ่มตรงนี้ก่อนสอบ</span><b class="pban-t">ปูพื้นฐาน<br>ก่อนสอบ</b>
    <span class="pban-d">สรุปกฎบทที่ 1 ครบ ${N} บทเรียน ตัวอย่างชัด มีโจทย์ลองคิดทุกบท</span>
    <span class="pban-p"><span class="pban-bar"><i style="width:${Math.round(n/N*100)}%"></i></span><small class="num">อ่านแล้ว ${n}/${N}</small></span>
    <span class="pban-go">${n?n>=N?'ทบทวนอีกรอบ':'อ่านต่อ':'เริ่มอ่านเลย'}${I.chev}</span></span>
   <span class="pban-m">${beetleCar({mood:n>=N?'wink':'happy'})}</span>
   <span class="pban-sp s1">${I.spark}</span><span class="pban-sp s2">${I.spark}</span></button>`; }
function theoryCard(){ const S=ST.qz.sets||{}, all=CONCEPT.length+CFIG.length, r=CROM.size;
  const it=(id,t,n,d)=>{const x=S[id],p=x?Math.round(x.best/x.n*100):null; return `<button class="thb rp" data-qset="${id}"><b class="num">${n}</b><span><b>${t}</b><small>${d}${p!=null?` · ดีสุด ${p}%`:''}</small></span>${I.play}</button>`;};
  return `<section class="thcard"><header><span class="th-ic">${I.quiz}</span><div><h2>ข้อช้อยทฤษฎี</h2><p>ช้อยส์ล้วน <b class="num">${all}</b> ข้อ รวมโจทย์อ่านค่าจากรูป <b class="num">${CFIG.length}</b> ข้อ</p><span class="sc-tag">ช้อยส์อย่างเดียว</span></div></header>
   <div class="thgrid">${it('th:all','ทำทั้งหมด',all,'สลับข้อทุกครั้ง')}${it('th:r','เลขโรมัน',r,'สัญลักษณ์ หลักการเพิ่ม ลด ขีดบน')}${it('th:s','เลขนัยสำคัญ',all-r,'การนับ อ่านค่าจากรูป การปัด การคำนวณ')}</div></section>`; }
function zone(n,t,d,ic,c){ return `<div class="zone ${c}"><span class="zone-n num">${n}</span><div><small>ส่วนที่ ${n}</small><h2>${t}</h2><p>${d}</p></div></div>`; }
function setCard(k,t,d,tag){ const S=ST.qz.sets||{}; const done=Array.from({length:NSETS},(_,i)=>S[k+':'+(i+1)]).filter(Boolean);
  let nx=1; for(let i=1;i<=NSETS;i++){ if(!S[k+':'+i]){ nx=i; break; } }
  const avg=done.length?Math.round(done.reduce((a,r)=>a+r.best/r.n,0)/done.length*100):null;
  return `<section class="xcard"><header><span class="sc-ic ${k}">${k==='sh'?I.book:I.spark}</span><div><h3>${t}</h3><p>${d}</p><span class="sc-tag">${tag}</span></div></header>
   <div class="sc-st"><div><b class="num">${done.length}/${NSETS}</b><small>ชุดที่ทำแล้ว</small></div><div><b class="num">${avg==null?'–':avg+'%'}</b><small>คะแนนเฉลี่ย</small></div></div>
   <button class="btn lg rp wide" data-qset="${k}:${nx}">${I.play}เริ่มชุดที่ ${nx}</button>
   <details class="sc-more"><summary class="rp">เลือกชุดเอง / ดูคะแนนแต่ละชุด ${I.down}</summary>${setGrid(k)}</details></section>`; }
function bankRow(k,t,d){ const S=ST.qz.sets||{}; const done=Array.from({length:NSETS},(_,i)=>S[k+':'+(i+1)]).filter(Boolean);
  const avg=done.length?Math.round(done.reduce((a,r)=>a+r.best/r.n,0)/done.length*100):null;
  return `<details class="brow"><summary class="rp"><span><b>${t}</b><small>${d}</small><small class="num">ทำแล้ว ${done.length}/${NSETS} ชุด${avg!=null?' · เฉลี่ย '+avg+'%':''}</small></span>${I.down}</summary>${setGrid(k)}</details>`; }
function setGrid(k,t,d){ const S=ST.qz.sets||{};
  return `<div class="setgrid">${Array.from({length:NSETS},(_,i)=>{const id=k+':'+(i+1),r=S[id],p=r?Math.round(r.best/r.n*100):null;
    return `<button class="setc rp ${r?(p>=80?'hi':p>=50?'mid':'lo'):''}" data-qset="${id}" aria-label="ชุดที่ ${i+1}${r?` คะแนนดีสุด ${p}%`:''}"><b class="num">${i+1}</b><small class="num">${r?p+'%':'ใหม่'}</small></button>`;}).join('')}</div>`; }
function quizBind(){
  const Z=ST.qz, rr=()=>{const y=scrollY;render();scrollTo(0,y);};
  $$('[data-qstyle]').forEach(b=>b.onclick=()=>{Z.style=b.dataset.qstyle;save();rr();});
  $$('[data-qdiff]').forEach(b=>b.onclick=()=>{Z.diff=b.dataset.qdiff;save();rr();});
  $$('[data-qtp]').forEach(b=>b.onclick=()=>{const k=b.dataset.qtp;Z.tps=Z.tps.includes(k)?Z.tps.filter(x=>x!==k):[...Z.tps,k];save();rr();});
  $$('[data-qall]').forEach(b=>b.onclick=()=>{Z.tps=Z.tps.length===TP1.length?[]:TP1.slice();save();rr();});
  $$('[data-qch]').forEach(b=>b.onclick=()=>{UI.ch=+b.dataset.qch;render();window.scrollTo(0,0);});
  quiz2Bind();
  $$('[data-qn]').forEach(b=>b.onclick=()=>{Z.n=+b.dataset.qn;save();rr();});
  $$('[data-qset]').forEach(b=>b.onclick=()=>startQuiz(b.dataset.qset));
  $$('[data-qone]').forEach(b=>b.onclick=()=>startQuiz('gen',{tps:[b.dataset.qone]}));
}
function genList(tps,n,diff){ const out=[],seen=new Set(); let guard=0;
  while(out.length<n&&guard++<n*30){ const t=tps[out.length%tps.length]; const lv=diff==='mix'?pick(['easy','mid','hard']):diff; const q=GEN[t]((t==='concept'||t==='con2')&&diff==='mix'?'mix':lv); if(seen.has(q.id)) continue; seen.add(q.id); out.push(q); }
  return shuf(out); }
function startQuiz(kind,o={}){
  const Z=ST.qz; let list,title;
  if(kind==='sheet'){ list=setSheet(); title='แบบฝึกหัดในชีท'; }
  else if(kind==='slide'){ list=setSlide(); title='ตัวอย่างในสไลด์'; }
  else if(/^(sh|sl):\d+$/.test(kind)){ const [k,n]=kind.split(':'); list=buildSet(k,+n); title=(k==='sh'?'แนวชีท':'แนวสไลด์')+' ชุดที่ '+n; }
  else if(/^th:/.test(kind)){ const c=kind.slice(3); const ids=CONCEPT.map((_,i)=>i).filter(i=>c==='all'||(c==='r')===CROM.has(i)); list=shuf([...ids.map(bConcept),...(c==='r'?[]:CFIG.map((_,i)=>bCylTheory(i)))]); title='ข้อช้อยทฤษฎี'+(c==='r'?' · เลขโรมัน':c==='s'?' · เลขนัยสำคัญ':''); o.stop=true; }
  else if(kind==='c2:th'){ list=shuf(CON2.map((_,i)=>bCon2(i))); title='ข้อช้อยทฤษฎีบทที่ 2'; o.stop=true; }
  else if(kind==='c2:sh'){ list=set2Sheet(); title='แบบฝึกหัดบทที่ 2'; o.stop=true; }
  else if(kind==='c2:sl'){ list=set2Slide(); title='แบบฝึกในสไลด์บทที่ 2'; o.stop=true; }
  else if(kind==='wrong'){ const c=UI.ch||1; list=shuf(Z.wrong.filter(x=>qch(x.t)===c).map(x=>Object.assign({},x))); if(!list.length) return toast('ไม่มีข้อที่เคยผิด'); title='ข้อที่เคยผิด บทที่ '+c; }
  else { if(/^wp:/.test(kind)){ const k=kind.slice(3); o.tps=WPK.includes(k)?[k]:WPK; o.diff=k==='new'?'new':'mix'; o.title=k==='new'?'โจทย์ปัญหา · ข้อที่ยังไม่ผ่าน':WPK.includes(k)?QT[k].n:'โจทย์ปัญหา 500 ข้อ · สุ่มคละ'; kind='gen'; }
    if(kind==='gen2'){ o.tps=o.tps||Z.tps2; o.diff=o.diff||Z.diff2||'mix'; kind='gen'; }
    const tps=o.tps||Z.tps, df=o.diff||Z.diff; if(!tps.length) return toast('เลือกอย่างน้อย 1 เรื่อง'); list=genList(tps,5,df); o.endless={tps,diff:df}; title=tps.length===1?QT[tps[0]].n:'สุ่มโจทย์ '+(qch(tps[0])===2?'บทที่ 2 ':'')+(df==='mix'?'ทุกระดับ':LVN[df]); if(o.title) title=o.title; else if(tps.every(t=>QT[t].ch===3)) title=tps.length===1?QT[tps[0]].n:'โจทย์ปัญหา 500 ข้อ'; }
  /* กำหนดรูปแบบการตอบของแต่ละข้อ */
  list.forEach((q,i)=>qAs(q,i));
  QP={kind,title,list,i:0,ok:0,streak:0,res:[],done:false,endless:o.endless||null,tps:o.tps,stop:!!o.stop};
  openQuiz();
}
let QP=null;
function qAs(q,i){ const Z=ST.qz; q.as=q.mcOnly?'mc':!q.mc?'type':Z.style==='mix'?(i%2?'mc':'type'):Z.style; }

/* ---------- ผู้เล่น ---------- */
function openQuiz(){ document.body.style.overflow='hidden'; const L=$('#layer'); L.innerHTML=`<div class="player qp" id="qp" role="dialog" aria-modal="true" aria-label="ทำข้อสอบ"></div>`; qRender(); }
function qClose(){ QP=null; $('#layer').innerHTML=''; document.body.style.overflow=''; if(UI.tab==='quiz'){const y=scrollY;render();scrollTo(0,y);} }
function kp(kind){
  if(kind==='roman'||kind==='rnum') return `<div class="kp" role="group" aria-label="แป้นเลขโรมัน">${'IVXLCDM'.split('').map(c=>`<button class="kk rp" data-k="${c}" data-soft="1">${c}</button>`).join('')}<button class="kk ov-k rp" data-k="̅" data-soft="1" aria-label="ขีดบนตัวก่อนหน้า">¯</button><button class="kk rp" data-k="BS" data-soft="1" aria-label="ลบ">⌫</button></div>`;
  return `<div class="kp num" role="group" aria-label="ปุ่มช่วยพิมพ์">${kind==='range'?`<button class="kk rp" data-k="-" data-soft="1">ถึง (-)</button>`:`<button class="kk rp" data-k="x10^" data-soft="1">×10^</button><button class="kk rp" data-k="-" data-soft="1">−</button>`}<button class="kk rp" data-k="BS" data-soft="1" aria-label="ลบ">⌫</button></div>`;
}
function qRender(){
  const P=QP, q=P.list[P.i], el=$('#qp'); if(!el) return;
  const pct=P.endless?Math.min(100,Math.round(P.res.length?P.ok/P.res.length*100:0)):Math.round(P.i/P.list.length*100);
  const multi=q.fields.length>1;
  const ans=q.as==='mc'?`<div class="qopts" role="radiogroup" aria-label="ตัวเลือก">${q.mc.opts.map((o,i)=>`<button class="qopt rp" data-op="${i}" role="radio" aria-checked="false"><span class="qk num">${'กขคง'[i]}</span><span class="qo-t">${q.plain?esc(o):showAns(o)}</span></button>`).join('')}</div>`
    :`<div class="qfields ${multi?'multi':''}">${q.fields.map((f,i)=>`<label class="qf"><span class="qf-l">${f.lab?esc(f.lab):'คำตอบ'}</span><span class="qf-in"><input id="qi${i}" class="qin ${f.kind==='roman'||f.kind==='rnum'?'rom':''}" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="${f.kind==='roman'||f.kind==='rnum'?'text':'decimal'}" enterkeyhint="${i<q.fields.length-1?'next':'done'}" aria-label="${esc(f.lab||'คำตอบ')}">${f.unit?`<i>${f.unit}</i>`:''}</span></label>`).join('')}</div>
     ${kp(q.fields[0].kind)}${q.hint?`<p class="qhint">${I.bulb}${esc(q.hint)}</p>`:''}`;
  el.innerHTML=`<div class="pbar"><div class="pbar-in"><button class="ib2 rp" id="qx" aria-label="ออก">${I.x}</button>${P.endless?`<b class="num qn-end">ข้อที่ ${P.i+1}</b><span class="top-sp"></span>${P.res.length?`<button class="btn ghost sm rp" id="qstop">หยุดและดูสรุป</button>`:''}`:`<div class="pline"><i style="width:${pct}%"></i></div><b class="num">${P.i+1}/${P.list.length}</b>${P.stop&&P.res.length?`<button class="btn ghost sm rp" id="qstop">หยุด</button>`:''}`}<span class="pst num">${I.check}${P.ok}</span></div></div>
   <div class="pl-sc" id="qsc"><div class="stage"><article class="qcard">
    <div class="qmeta"><span class="qtopic">${QT[q.t].n}</span><span class="lv lv-${q.lv}">${LVN[q.lv]}</span>${q.src?`<span class="qsrc">${esc(q.src)}${q.no?' · '+esc(q.no):''}</span>`:''}<span class="qtype">${q.as==='mc'?'ช้อยส์':'พิมพ์ตอบ'}</span></div>
    <p class="stem">${esc(q.stem)}</p>${!q.fig&&(q.bigHTML||q.big)?`<div class="qbig">${q.bigHTML||esc(q.big)}</div>`:''}${fig(q)?`<div class="qfig">${fig(q)}</div>`:''}
    ${ans}
    <div id="qfb"></div></article></div></div>
   <div class="pact"><div class="pact-in"><button class="btn lg rp wide" id="qgo" ${q.as==='mc'?'disabled':''}>${I.check}ตรวจคำตอบ</button></div></div>`;
  $('#qx').onclick=()=>{ if(P.res.length&&!P.done) qFinish(); else qClose(); };
  if($('#qstop')) $('#qstop').onclick=qFinish;
  let sel=-1;
  $$('#qp [data-op]').forEach(b=>b.onclick=()=>{ if(P.checked) return; sel=+b.dataset.op; $$('#qp [data-op]').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-checked',x===b);}); $('#qgo').disabled=false; });
  const ins=$$('#qp .qin'); let focusI=0; ins.forEach((x,i)=>{ x.onfocus=()=>focusI=i; x.oninput=()=>{}; x.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); if(i<ins.length-1&&!x.value.trim()) return; if(i<ins.length-1) ins[i+1].focus(); else qCheck(); } }; });
  $$('#qp [data-k]').forEach(b=>{ b.onpointerdown=e=>e.preventDefault(); b.onclick=()=>{ const x=ins[focusI]; if(!x||x.disabled) return; const k=b.dataset.k, s=x.selectionStart??x.value.length, e2=x.selectionEnd??x.value.length;
    if(k==='BS'){ if(s===e2&&s>0){ const cut=x.value[s-1]==='̅'&&s>1?2:1; x.value=x.value.slice(0,s-cut)+x.value.slice(s); x.setSelectionRange(s-cut,s-cut);} else { x.value=x.value.slice(0,s)+x.value.slice(e2); x.setSelectionRange(s,s);} }
    else { x.value=x.value.slice(0,s)+k+x.value.slice(e2); const p=s+k.length; x.setSelectionRange(p,p); }
    x.focus({preventScroll:true}); }; });
  $('#qgo').onclick=()=>P.checked?qNext():qCheck(sel);
  P.checked=false;
  if(ins[0]&&!matchMedia('(pointer:coarse)').matches) ins[0].focus();
  QP._sel=()=>sel;
}
function chkField(f,u){ if(f.vals){ const v=numIn(u,f.unit); if(isFinite(v)&&f.vals.some(x=>Math.abs(v-x)<=f.tol+Math.abs(x)*1e-9)) return true; } const c=[normNum(u),normRoman(u),normRange(u)]; return f.acc.some(a=>c.includes(a)); }
function qCheck(){
  const P=QP, q=P.list[P.i]; if(P.checked) return;
  let ok, yours;
  if(q.as==='mc'){ const s=P._sel(); if(s<0) return; ok=s===q.mc.ans; yours=q.mc.opts[s];
    $$('#qp [data-op]').forEach((b,i)=>{ b.disabled=true; b.classList.add(i===q.mc.ans?'right':i===s?'wrong':'dim'); }); }
  else { const ins=$$('#qp .qin'); const vals=ins.map(x=>x.value); if(vals.every(v=>!v.trim())){ toast('พิมพ์คำตอบก่อนนะ'); ins[0].focus(); return; }
    const each=q.fields.map((f,i)=>chkField(f,vals[i])); ok=each.every(Boolean); yours=vals.join(' · ');
    ins.forEach((x,i)=>{ x.disabled=true; x.parentElement.classList.add(each[i]?'right':'wrong'); }); }
  P.checked=true;
  const Z=ST.qz, k=q.t; Z.tp[k]=Z.tp[k]||{ok:0,all:0}; Z.tp[k].all++; Z.ans++;
  if(ok){ Z.tp[k].ok++; Z.ok++; P.ok++; P.streak++; Z.best=Math.max(Z.best,P.streak); Z.wrong=Z.wrong.filter(w=>w.id!==q.id); SFX.ok(); }
  else { P.streak=0; if(!Z.wrong.some(w=>w.id===q.id)){ const c=Object.assign({},q); delete c.as; delete c._sel; Z.wrong.unshift(c); Z.wrong=Z.wrong.slice(0,80);} SFX.bad(); }
  if(ok&&q.wp){ Z.wpOk=Z.wpOk||{}; Z.wpOk[q.id]=1; }
  save(); P.res.push({q,ok,yours});
  const fb=$('#qfb');
  fb.innerHTML=`<section class="qexp ${ok?'ok':'no'}" aria-live="polite">
    <header class="qexp-h"><span class="qexp-ic">${ok?I.check:I.x}</span><b>${ok?pick(['ถูกต้อง เก่งมาก','ถูกเป๊ะ','เยี่ยมเลย']):'ยังไม่ถูก ดูเฉลยก่อนนะ'}</b></header>
    ${!ok?`<p class="qyour">คำตอบของคุณ: <span>${q.as==='mc'?(q.plain?esc(yours):showAns(yours)):esc(yours)||'–'}</span></p>`:''}
    <p class="qans">เฉลย: ${q.fields.length>1?q.fields.map(f=>`<span class="qa-f"><small>${esc(f.lab)}</small><b>${showAns(f.show)}${f.unit?' '+f.unit:''}</b></span>`).join(''):`<b>${q.plain?esc(q.fields[0].show):showAns(q.fields[0].show)}${q.fields[0].unit?' '+q.fields[0].unit:''}</b>`}</p>
    <div class="qwhy ${q.wp?'wpwhy':''}"><h4>${I.bulb}${q.wp?'วิธีทำ (เทียบบัญญัติไตรยางศ์)':'หลักการคิด'}</h4><ol>${q.exp.map(s=>`<li>${s}</li>`).join('')}</ol></div>
    <button class="link sm rp" data-qpg="${q.pg||QT[q.t].pg}">${I.book}อ่านเรื่องนี้ในหนังสือ หน้า ${q.pg||QT[q.t].pg}</button>
   </section>`;
  $('#qp [data-qpg]').onclick=e=>bookZoom(+e.currentTarget.dataset.qpg);
  const g=$('#qgo'); g.disabled=false; g.innerHTML=P.endless||P.i<P.list.length-1?`ข้อถัดไป ${I.arrow}`:`${I.check}ดูสรุปผล`; g.focus({preventScroll:true});
  const pst=$('#qp .pst'); if(pst) pst.innerHTML=I.check+P.ok;
  setTimeout(()=>fb.scrollIntoView({behavior:LITE?'auto':'smooth',block:'start'}),60);
}
function qNext(){ const P=QP;
  if(P.endless&&P.i>=P.list.length-2){ const add=genList(P.endless.tps,5,P.endless.diff).filter(q=>!P.list.some(x=>x.id===q.id)); add.forEach((q,j)=>qAs(q,P.list.length+j)); P.list.push(...add); }
  if(P.i<P.list.length-1){ P.i++; qRender(); const s=$('#qsc'); if(s) s.scrollTop=0; } else qFinish(); }
function qFinish(){
  const P=QP; P.done=true; const n=P.res.length, ok=P.res.filter(r=>r.ok).length, p=n?Math.round(ok/n*100):0;
  ST.qz.last={title:P.title,ok,n,t:Date.now()};
  if(/^(sh|sl|th|c2):/.test(P.kind)&&n===P.list.length){ ST.qz.sets=ST.qz.sets||{}; const r=ST.qz.sets[P.kind]; if(!r||ok>r.best) ST.qz.sets[P.kind]={best:ok,n}; }
  save();
  const by={}; P.res.forEach(r=>{const k=r.q.t; by[k]=by[k]||[0,0]; by[k][1]++; if(r.ok) by[k][0]++;});
  $('#qp').innerHTML=`<div class="pbar"><div class="pbar-in"><button class="ib2 rp" id="qx" aria-label="ปิด">${I.x}</button><b>สรุปผล · ${esc(P.title)}</b></div></div>
   <div class="pl-sc"><div class="stage"><section class="qsum">
    <div class="qsum-msc">${beetleCar({mood:p>=80?'happy':p>=50?'wink':'sad'})}</div>
    <div class="ring-w">${ring(p,140,12)}<span class="ring-v"><b class="num">${p}%</b><small>ถูก ${ok}/${n}</small></span></div>
    <h2>${p>=80?'เครื่องแรงมาก พร้อมสอบแล้ว':p>=50?'มาถูกทางแล้ว ทบทวนอีกนิด':'ค่อยๆ ซ้อมไปด้วยกันนะ'}</h2>
    <div class="qsum-tp">${Object.entries(by).map(([k,[o,a]])=>`<div class="lvbar"><span>${QT[k].n}</span><span class="num">${o}/${a}</span>${meter(Math.round(o/a*100))}</div>`).join('')}</div>
    <div class="cta-row two">${P.res.some(r=>!r.ok)?`<button class="btn ghost lg rp" id="qs-wrong">${I.alert}ทำข้อที่ผิดอีกครั้ง</button>`:''}<button class="btn lg rp" id="qs-again">${I.reset}ทำชุดนี้อีกรอบ</button></div>
    ${P.res.some(r=>!r.ok)?`<h3 class="mini">ข้อที่ผิดพร้อมเฉลย</h3><div class="qrv">${P.res.filter(r=>!r.ok).map(r=>`<details class="rv"><summary><span class="rv-q">${esc(r.q.stem)} <b>${r.q.bigHTML||esc(r.q.big)}</b></span>${I.down}</summary><div class="rv-b"><p>เฉลย: <b>${r.q.fields.map(f=>showAns(f.show)+(f.unit?' '+f.unit:'')).join(' · ')}</b></p><ol>${r.q.exp.map(s=>`<li>${s}</li>`).join('')}</ol></div></details>`).join('')}</div>`:''}
   </section></div></div>`;
  SFX.done();
  $('#qx').onclick=qClose;
  if($('#qs-wrong')) $('#qs-wrong').onclick=()=>{ const l=P.res.filter(r=>!r.ok).map(r=>Object.assign({},r.q)); QP={kind:'retry',title:'แก้ข้อที่ผิด',list:l,i:0,ok:0,streak:0,res:[],done:false}; openQuiz(); };
  $('#qs-again').onclick=()=>{ if(P.kind==='retry'||P.kind==='wrong'){ const l=P.list.map(q=>Object.assign({},q)); QP={...P,list:shuf(l),i:0,ok:0,streak:0,res:[],done:false}; openQuiz(); } else startQuiz(P.kind,P.endless?{tps:P.endless.tps,diff:P.endless.diff}:{}); };
}
addEventListener('keydown',e=>{ if(!QP||!$('#qp')) return; if(e.key==='Escape'){ e.preventDefault(); $('#qx')&&$('#qx').click(); }
  else if(e.key==='Enter'&&QP.checked&&!QP.done&&document.activeElement&&document.activeElement.id!=='qgo'){ e.preventDefault(); qNext(); }
  else if(!QP.checked&&/^[1-4]$/.test(e.key)&&QP.list[QP.i].as==='mc'){ const b=$$('#qp [data-op]')[+e.key-1]; if(b) b.click(); } });

/* ===================== ปูพื้นฐานก่อนสอบ ===================== */
const PRIME=[
 {id:'r1',qz:['XVII มีค่าเท่าไร',['17','15','22','12'],'X 10 + V 5 + I 1 + I 1 = 17 เรียงจากมากไปน้อยแล้วบวกกัน'],t:'เลขโรมันพื้นฐาน',tp:'r2a',pg:3,b:`<p>ระบบเลขโรมัน <b>ไม่มีเลข 0</b> มีสัญลักษณ์พื้นฐาน 8 ตัว เขียนตัวพิมพ์เล็กหรือใหญ่ก็ได้</p>
   <div class="pm-tb">${[['ss','½'],['I','1'],['V','5'],['X','10'],['L','50'],['C','100'],['D','500'],['M','1,000']].map(([a,b])=>`<span><b>${a}</b><small>${b}</small></span>`).join('')}</div>
   <p class="pm-tip">${I.bulb}ท่อง I V X L C D M ค่าจะสลับ ×5 กับ ×2 ไปเรื่อยๆ</p>
   <h4>หลักการเพิ่ม (3 ข้อ ใช้พร้อมกัน)</h4><ol><li>เรียงจากค่ามากไปน้อย</li><li>นำค่าแต่ละตัวมาบวกกัน</li><li>ตัวเดียวกันซ้ำได้ไม่เกิน 3 ตัว</li></ol>
   <p class="pm-ex">CXII = 100 + 10 + 1 + 1 = 112 · MCCCLXVII = 1,000 + 300 + 50 + 10 + 5 + 2 = 1,367</p>`},
 {id:'r2',qz:['ข้อใดเขียน 9 ถูกต้อง',['IX','VIIII','IIX','XI'],'I ลบจาก X ได้ 10 − 1 = 9 (XI คือ 11 และห้ามซ้ำเกิน 3 ตัว)'],t:'หลักการลด',tp:'a2r',pg:4,b:`<p>เขียน<b>ตัวน้อยไว้หน้าตัวมาก</b>แล้วลบกัน มีกติกา 2 ข้อ</p><ol><li>ตัวลบมีแค่ <b>I, X, C</b></li><li>ลบได้จากเลขที่ค่าถัดไป 2 ค่าเท่านั้น</li></ol>
   <div class="pm-tb w">${[['I','V, X','IV 4 · IX 9'],['X','L, C','XL 40 · XC 90'],['C','D, M','CD 400 · CM 900']].map(([a,b,c])=>`<span><b>${a}</b><small>ลบจาก ${b}</small><small>${c}</small></span>`).join('')}</div>
   <p class="pm-warn">${I.alert}ห้ามเขียน IC แทน 99 ต้องเป็น XC + IX = <b>XCIX</b></p>`},
 {id:'r3',qz:['X̄ มีค่าเท่าไร',['10,000','1,000','100,000','100'],'X = 10 ขีดบนคูณ 1,000 จึงได้ 10,000'],t:'จำนวนมาก (ขีดบน)',tp:'a2r',pg:5,b:`<p>ไม่นิยมซ้ำ 4 ตัว (XXXX เขียน XL) ส่วนจำนวนเกิน 3,999 ให้<b>ขีดบนตัวอักษร = คูณ 1,000</b></p>
   <div class="pm-tb">${['V','X','L','C','D','M'].map((a,i)=>`<span><b>${romanHTML(a+'~')}</b><small>${['5,000','10,000','50,000','100,000','500,000','1,000,000'][i]}</small></span>`).join('')}</div>
   <p class="pm-ex">แยกก้อนหลักพันกับส่วนที่เหลือ: 7,240 = 7×1,000 + 240 → ${romanHTML('V~')}MM + CCXL = <b>${romanHTML('V~MMCCXL')}</b> (${romanHTML('I~')} = M)<br>2,530,000 = 2,530 × 1,000 → MMDXXX ขีดบนทั้งหมด = <b>${romanHTML('M~M~D~X~X~X~')}</b></p>
   <p class="pm-tip">${I.bulb}วิธีพิมพ์ขีดบนในแอพ: กดปุ่ม <b>¯</b> หลังตัวอักษร หรือพิมพ์ _ นำหน้า เช่น _VMMCCXL</p>`},
 {id:'r4',qz:['XX × V เท่ากับเท่าไร',['100','25','105','200'],'แปลงก่อน 20 × 5 = 100 หรือ C'],t:'คำนวณเลขโรมัน',tp:'rcalc',pg:7,b:`<p>แปลงเป็นเลขอารบิกก่อน แล้วค่อยคำนวณ (ตอบเป็นอารบิกหรือโรมันก็ได้)</p>
   <p class="pm-ex">LXVII + CLXVI = 67 + 166 = <b>233</b> · MC × VIII = 1,100 × 8 = <b>8,800</b> · CM ÷ IX = 900 ÷ 9 = <b>100</b></p>`},
 {id:'s1',qz:['0.0230 มีเลขนัยสำคัญกี่ตัว',['3 ตัว','4 ตัว','5 ตัว','2 ตัว'],'0 นำหน้าไม่นับ เหลือ 2 3 0 โดย 0 ท้ายหลังจุดนับ = 3 ตัว'],t:'นับเลขนัยสำคัญ',tp:'sfcount',pg:8,b:`<ol class="pm-rules"><li><b>เลข 1 ถึง 9</b> นับเสมอ <small>1.212 → 4 ตัว</small></li><li><b>0 ระหว่างเลข</b> นับ <small>2002 → 4 · 200.01 → 5</small></li><li><b>0 ท้าย หลังจุดทศนิยม</b> นับ <small>12.50 → 4 · 0.1200 → 4</small></li><li><b>0 นำหน้าเลขตัวแรก</b> ไม่นับ <small>0.0023 → 2 · 0.00004 → 1</small></li><li><b>0 ท้ายจำนวนเต็ม</b> ไม่ชัด ตอบเป็นช่วง <small>2500 → 2-4 ตัว</small></li></ol>
   <p class="pm-tip">${I.bulb}นับเร็ว: เริ่มที่เลขไม่ใช่ 0 ตัวแรกทางซ้าย นับไปจนสุดทางขวา ถ้าเป็น a × 10ⁿ นับเฉพาะ a เช่น 2566 × 10⁻⁴ → 4 ตัว</p>`},
 {id:'s2',qz:['กระบอกตวงขีดละ 1 mL ระดับอยู่กึ่งกลางระหว่าง 21 กับ 22 ควรบันทึกว่า',['21.5 mL','21 mL','22 mL','21.50 mL'],'อ่านได้ถึงหลักหน่วย 21 แล้วกะประมาณเพิ่ม 1 หลัก = 21.5 mL'],t:'บันทึกค่าจากการวัด',tp:'record',pg:10,b:`<div class="pm-fig">${cylSVG(10,34)}<div><p>อ่านถึง<b>ขีดที่ละเอียดที่สุด</b> แล้ว<b>ประมาณเพิ่มอีก 1 หลัก</b> ตัวสุดท้ายคือตัวที่ไม่แน่นอน</p>
   <p class="pm-ex">ขีดละ 10 mL ระดับเลยขีด 30 ไปประมาณ 4 → รายงาน <b>34 mL</b> (2 ตัว)<br>ขีดละ 1 mL ระดับอยู่ระหว่าง 34 กับ 35 → <b>34.5 mL</b> (3 ตัว)</p></div></div>
   <p class="pm-ex">ตวง 5 mL ด้วยขีดต่ำสุด 0.1 mL → <b>5.00 mL</b> · เครื่องชั่ง 0.001 g ชั่ง 60 mg → <b>0.0600 g</b> (ไม่ใช่ 0.06000)</p>`},
 {id:'s3',qz:['4.65 ต้องการเลขนัยสำคัญ 2 ตัว',['4.6','4.7','4.65','5'],'ตัวที่พิจารณาคือ 5 พอดี เลขหน้าคือ 6 เป็นคู่ จึงตัดทิ้ง ได้ 4.6'],t:'การปัดเลขตัวสุดท้าย',tp:'round',pg:11,b:`<p>ดู<b>ตัวเลขที่พิจารณา</b> = ตัวแรกที่จะถูกตัดทิ้ง</p>
   <div class="pm-rt">${[['มากกว่า 5','ปัดขึ้น','2.46 → 2.5'],['น้อยกว่า 5','ปัดลง','2.43 → 2.4'],['5 พอดี เลขหน้าคู่หรือ 0','ตัดทิ้ง','2.85 → 2.8'],['5 พอดี เลขหน้าคี่','ปัดขึ้น','3.975 → 3.98'],['5 แล้วมีเลขไม่ใช่ 0 ตาม','ปัดขึ้นเสมอ','0.2352 → 0.24'],['5 แล้วตามด้วย 0','เหมือนไม่มีเลขตาม','0.8250 → 0.82']].map(([a,b,c])=>`<div><span>${a}</span><b>${b}</b><small class="num">${c}</small></div>`).join('')}</div>
   <p class="pm-tip">${I.bulb}กรณี 5 พอดี ให้ผลลงท้ายด้วยเลขคู่เสมอ</p>`},
 {id:'s4',qz:['1.25 + 3.1 ควรตอบอย่างไร',['4.4','4.35','4.3','4'],'ได้ 4.35 ต้องเหลือทศนิยม 1 ตำแหน่งตาม 3.1 ตัวที่พิจารณาคือ 5 พอดี เลขหน้า 3 เป็นคี่ ปัดขึ้นเป็น 4.4'],t:'คำนวณตามหลักเลขนัยสำคัญ',tp:'sfcalc',pg:14,b:`<div class="pm-two"><div><h4>บวก ลบ</h4><p>ผลลัพธ์มี<b>ตำแหน่งทศนิยม</b>เท่ากับตัวที่น้อยที่สุด</p><p class="pm-ex">51.43 + 2.0 = 53.43 → <b>53.4</b></p></div>
   <div><h4>คูณ หาร</h4><p>ผลลัพธ์มี<b>จำนวนเลขนัยสำคัญ</b>เท่ากับตัวที่น้อยที่สุด</p><p class="pm-ex">23.2 × 35.45 = 822.44 → <b>822</b></p></div></div>
   <p class="pm-warn">${I.alert}432.10 × 5.5 = 2,376.55 ต้องการ 2 ตัว ห้ามตอบ 24 ให้ตอบ <b>2.4 × 10³</b> (หรือ 2,400) · ปัดตอนท้ายครั้งเดียว</p>`},
 {id:'h1',t:'วิธีพิมพ์คำตอบในแอพ',tp:null,pg:null,b:`<ul class="pm-how"><li>ตัวพิมพ์เล็กหรือใหญ่ เว้นวรรคหรือพิมพ์ชิด ได้หมด ขอแค่ตัวอักษรครบและเรียงถูก</li><li>เลขโรมันขีดบน: ปุ่ม <b>¯</b> หลังตัวอักษร หรือ _ นำหน้า</li><li>ยกกำลังสิบ: <b>2.4x10^3</b> หรือ 2.4e3 หรือกดปุ่ม ×10^</li><li>ตอบเป็นช่วง: <b>2-4</b> หรือ 2 ถึง 4</li><li>ใส่หรือไม่ใส่หน่วยก็ได้ แต่เลข 0 ท้ายทศนิยมต้องครบ (5.00 ไม่เท่ากับ 5)</li></ul>`}
];
const PRIME_L=PRIME.filter(x=>x.tp);
const pmRead=()=>{ const R=ST.pm||{}; return PRIME_L.filter(x=>R[x.id]).length; };
const PM_GRP={r:['เลขโรมัน','rom'],s:['เลขนัยสำคัญ','sig'],h:['ใช้งานแอพ','how']};
function primeHTML(){ const R=ST.pm||{}, n=pmRead(), N=PRIME_L.length;
  return head()+`<div class="wrap"><button class="crumb rp" data-tab="quiz">${I.back} ข้อสอบ</button>
   <section class="pmhero"><div class="pmhero-b"><span class="pban-k">${I.bulb}บทที่ 1 · เลขโรมัน และเลขนัยสำคัญ</span><h1>ปูพื้นฐาน<br>ก่อนสอบ</h1>
     <p>อ่านทีละบท ลองตอบโจทย์ท้ายบท แล้วกดฝึกเรื่องนั้นได้ทันที</p>
     <div class="pmstat"><span><b class="num">${N}</b><small>บทเรียน</small></span><span><b class="num">${N}</b><small>ลองคิด</small></span><span><b class="num">~10</b><small>นาที</small></span></div>
     <div class="pban-p"><span class="pban-bar"><i style="width:${Math.round(n/N*100)}%"></i></span><small class="num">อ่านแล้ว ${n}/${N}</small></div></div>
    <div class="pmhero-m">${beetleCar({mood:n>=N?'wink':'happy'})}</div></section>
   <nav class="pm-nav" aria-label="สารบัญ">${PRIME.map((s,i)=>`<a href="#pm-${s.id}" class="pmj rp ${PM_GRP[s.id[0]][1]} ${R[s.id]?'done':''}" data-soft="1" data-pmj="${s.id}"><b class="num">${R[s.id]?I.check:i+1}</b>${s.t}</a>`).join('')}</nav>
   ${PRIME.map((s,i)=>{const g=PM_GRP[s.id[0]];return `<section class="pm ${g[1]} ${R[s.id]?'done':''}" id="pm-${s.id}">
    <header><span class="pm-no num">${i+1}</span><div><small>${s.tp?'บทเรียนที่ '+(i+1)+' · ':''}${g[0]}</small><h2>${s.t}</h2></div>${R[s.id]?`<span class="pm-ok">${I.check}อ่านแล้ว</span>`:''}</header>
    <div class="pm-b">${s.b}</div>
    ${s.qz?`<div class="pm-try" data-pmq="${s.id}"><div class="pm-try-h">${I.spark}<b>ลองคิดก่อน</b><small>แตะคำตอบที่คิดว่าถูก</small></div><p class="pm-try-q">${esc(s.qz[0])}</p>
      <div class="pm-opts">${shuf(s.qz[1].map((o,j)=>[o,j])).map(([o,j])=>`<button class="pm-op rp" data-pmo="${j}">${esc(o)}</button>`).join('')}</div><div class="pm-fb" aria-live="polite"></div></div>`:''}
    ${s.tp?`<footer><button class="btn rp" data-qone="${s.tp}">${I.play}ฝึกเรื่องนี้</button><button class="btn ghost rp" data-qpgz="${s.pg}">${I.book}หนังสือหน้า ${s.pg}</button><button class="btn ghost rp pm-mark" data-pmr="${s.id}" aria-pressed="${!!R[s.id]}">${I.check}${R[s.id]?'อ่านแล้ว':'อ่านจบแล้ว'}</button></footer>`:''}</section>`;}).join('')}
   <section class="pm-end"><div class="pm-end-m">${beetleCar({mood:'wink'})}</div><div><h2>พร้อมลุยแล้ว</h2><p>เริ่มจากข้อสอบทฤษฎี หรือเลือกทำตามหัวข้อก็ได้</p>
    <div class="cta-row two"><button class="btn lg rp" data-qset="th:all">${I.play}เริ่มข้อสอบทฤษฎี</button><button class="btn ghost lg rp" data-tab="quiz">${I.quiz}ไปหน้าข้อสอบ</button></div></div></section></div>`;
}
function primeBind(){
  const mark=(id,on)=>{ ST.pm=ST.pm||{}; if(on) ST.pm[id]=1; else delete ST.pm[id]; save(); };
  const rr=()=>{const y=scrollY;render();scrollTo(0,y);};
  $$('[data-qone]').forEach(b=>b.onclick=()=>startQuiz('gen',{tps:[b.dataset.qone]}));
  $$('[data-qset]').forEach(b=>b.onclick=()=>startQuiz(b.dataset.qset));
  $$('[data-qpgz]').forEach(b=>b.onclick=()=>bookZoom(+b.dataset.qpgz));
  $$('[data-pmr]').forEach(b=>b.onclick=()=>{ const id=b.dataset.pmr; mark(id,!(ST.pm||{})[id]); rr(); });
  $$('[data-pmq]').forEach(box=>{ const s=PRIME.find(x=>x.id===box.dataset.pmq);
    box.querySelectorAll('[data-pmo]').forEach(b=>b.onclick=()=>{ if(box.classList.contains('ans')) return; const ok=b.dataset.pmo==='0';
      box.classList.add('ans',ok?'ok':'bad'); box.querySelectorAll('[data-pmo]').forEach(x=>{ if(x.dataset.pmo==='0') x.classList.add('right'); }); if(!ok) b.classList.add('wrong');
      box.querySelector('.pm-fb').innerHTML=`<b>${ok?'ถูกต้อง เก่งมาก':'ยังไม่ถูก คำตอบคือ '+esc(s.qz[1][0])}</b><span>${esc(s.qz[2])}</span>`;
      ok?SFX.ok():SFX.bad();
      if(ok&&!(ST.pm||{})[s.id]){ mark(s.id,true); const sec=$('#pm-'+s.id); sec.classList.add('done'); const j=$(`[data-pmj="${s.id}"]`); if(j){ j.classList.add('done'); j.querySelector('b').innerHTML=I.check; } const m=sec.querySelector('[data-pmr]'); if(m){ m.setAttribute('aria-pressed','true'); m.innerHTML=I.check+'อ่านแล้ว'; } }
    }); });
  $$('[data-pmj]').forEach(a=>a.onclick=e=>{ e.preventDefault(); const t=$('#pm-'+a.dataset.pmj); if(t) scrollTo({top:t.getBoundingClientRect().top+scrollY-70,behavior:LITE?'auto':'smooth'}); });
}

/* ===================== โครงหน้า ===================== */
const UI={tab:'home',tocOpen:false};
const TABS=[['home','หน้าแรก',I.home],['book','อ่านหนังสือ',I.book],['quiz','ข้อสอบ',I.quiz],['set','ตั้งค่า',I.cog]];
function go(tab,opt){UI.tab=tab;if(opt) Object.assign(UI,opt);render();window.scrollTo(0,0); if(UI.wpJump){ UI.wpJump=0; const j=()=>{const e=document.getElementById('wpsec'); if(e) window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-70);}; j(); requestAnimationFrame(j); } }
function render(){
  const v=$('#view');
  v.innerHTML=({home:homeHTML,book:bookHTML,quiz:quizHTML,prime:primeHTML,set:setHTML}[UI.tab]||homeHTML)();
  renderNav(); bind();
  if(UI.tab==='book') bookBind();
  if(UI.tab==='set') setBind();
  if(UI.tab==='quiz') quizBind();
  if(UI.tab==='prime') primeBind();
  timerPill();
}
function renderNav(){
  const cur=UI.tab==='prime'?'quiz':UI.tab;
  $('#tabs').innerHTML='<div>'+TABS.map(([id,l,ic])=>`<button class="tab rp ${cur===id?'on':''}" data-tab="${id}" ${cur===id?'aria-current="page"':''}><span class="ico">${ic}</span>${l}</button>`).join('')+'</div>';
  const rd=readPct();
  $('#side').innerHTML=`<div class="side-in">
    <button class="brand rp" data-tab="home" aria-label="calc หน้าแรก">${MARK}<span>${WORD}<small>Pharmaceutical Calculation</small></span></button>
    <button class="btn side-cta rp" data-read="0">${I.book}อ่านหนังสือต่อ</button>
    <nav class="snav" aria-label="เมนูหลัก">${TABS.map(([id,l,ic])=>`<button class="si rp ${cur===id?'on':''}" data-tab="${id}" ${cur===id?'aria-current="page"':''}>${ic}<span>${l}</span></button>`).join('')}</nav>
    <div class="scard"><span class="scat">${beetleCar({mood:'wink'})}</span><div class="scard-h"><span>อ่านหนังสือไปแล้ว</span><b class="num">${rd}%</b></div>${meter(rd)}<small class="num">หน้า ${ST.bookPage||1} จาก ${BOOK.n}</small></div>
    <div class="sfoot"><button class="iconbtn rp" data-act="theme" aria-label="${ST.theme==='dark'?'เปลี่ยนเป็นโหมดสว่าง':'เปลี่ยนเป็นโหมดมืด'}">${ST.theme==='dark'?I.sun:I.moon}</button><button class="iconbtn rp" data-act="sound" data-silent="1" aria-label="${ST.sound?'ปิดเสียง':'เปิดเสียง'}">${ST.sound?I.sOn:I.sOff}</button><span id="tp-side"></span></div></div>`;
}
function head(){
  return `<header class="top"><div class="top-in">
    <button class="brand m rp" data-tab="home" aria-label="calc หน้าแรก">${MARK}${WORD}</button>
    <span class="top-sp"></span><span id="tp-top"></span>
    <button class="iconbtn rp" data-act="theme" aria-label="${ST.theme==='dark'?'เปลี่ยนเป็นโหมดสว่าง':'เปลี่ยนเป็นโหมดมืด'}">${ST.theme==='dark'?I.sun:I.moon}</button>
    <button class="iconbtn rp" data-act="sound" data-silent="1" aria-label="${ST.sound?'ปิดเสียง':'เปิดเสียง'}">${ST.sound?I.sOn:I.sOff}</button>
    <button class="iconbtn rp ${UI.tab==='set'?'on':''}" data-tab="set" aria-label="ตั้งค่า">${I.cog}</button></div></header>`;
}
function pageHead(h,sub,act=''){return head()+`<div class="wrap"><div class="ptitle"><div><h1>${h}</h1>${sub?`<p>${sub}</p>`:''}</div>${act}</div>`;}

const readPct=()=>Math.round(((ST.bookPage||1)-1)/(BOOK.n-1)*100);
/* ---------- หน้าแรก ---------- */
function homeHTML(){
  const p=ST.bookPage||1, rd=readPct();
  return head()+`<div class="wrap">
   <section class="hero">
    <div class="hero-main">
     <p class="eyebrow num">Pharmaceutical Calculation · PHT111</p>
     <h1>คำนวณเภสัช<br><span class="hl">แม่นทุกตัวเลข</span></h1>
     <p class="lede">อ่านสรุปบทที่ 1 เลขโรมันและเลขนัยสำคัญ และบทที่ 2 มาตรชั่งและตวง แล้วลองทำข้อสอบแบบพิมพ์ตอบและช้อยส์ ทุกข้อมีเฉลยพร้อมหลักการคิด</p>
     <div class="cta-row"><button class="btn lg rp" data-read="0">${I.book}${p>1?'อ่านต่อหน้า '+p:'เริ่มอ่านบทที่ 1'}</button>
      <button class="btn ghost lg rp" data-tab="quiz">${I.quiz}ทำข้อสอบ</button></div>
    </div>
    <div class="hero-side">
     <div class="hero-cat">${beetleCar({mood:'happy'})}</div>
     <div class="hero-stat"><div class="ring-w">${ring(rd,96,9)}<span class="ring-v"><b class="num">${rd}%</b><small>อ่านแล้ว</small></span></div>
      <dl class="kv"><div><dt>หน้าปัจจุบัน</dt><dd class="num">${p}</dd></div><div><dt>ทั้งบท</dt><dd class="num">${BOOK.n}</dd></div></dl></div>
     <p class="last">ความคืบหน้าเก็บไว้ในเครื่องนี้</p>
    </div>
   </section>
   <div class="sec"><div><h2>บทเรียน</h2><p>ตอนนี้เปิดให้อ่านบทที่ 1 และบทที่ 2 (เล่ม 2)</p></div><button class="link rp" data-tab="book">อ่านหนังสือ ${I.chev}</button></div>
   <div class="chgrid">${CHAPTERS.map(chCard).join('')}</div>
   <div class="sec"><div><h2>เครื่องมือ</h2></div></div>
   <div class="tools">
    <button class="tool rp" data-tab="prime"><span class="tool-ic">${I.bulb}</span><span><b>ปูพื้นฐานก่อนสอบ</b><small>สรุปกฎทุกเรื่องพร้อมตัวอย่าง</small></span>${I.chev}</button>
    <button class="tool rp wp-tool" data-qgo="3"><span class="tool-ic">${I.flame}</span><span><b>โจทย์ปัญหา 500 ข้อ</b><small>อยู่ในข้อสอบบทที่ 2 · ข้อเขียนเติมคำตอบ สุ่มคละ 4 แบบ เฉลยเทียบบัญญัติไตรยางศ์</small></span>${I.chev}</button>
    <button class="tool rp" data-qgo="2"><span class="tool-ic">${I.quiz}</span><span><b>ข้อสอบบทที่ 2 มาตรชั่งและตวง</b><small>ข้อสอบทฤษฎี แบบฝึกหัดในชีท สุ่มโจทย์ 7 หัวข้อ</small></span>${I.chev}</button>
    <button class="tool rp" data-qgo="1"><span class="tool-ic">${I.quiz}</span><span><b>ข้อสอบบทที่ 1</b><small>${ST.qz.ans?`ทำแล้ว ${ST.qz.ans} ข้อ · แม่นยำ ${Math.round(ST.qz.ok/ST.qz.ans*100)}%`:'พิมพ์ตอบ ช้อยส์ พร้อมเฉลย'}</small></span>${I.chev}</button>
    <button class="tool rp" data-read="1"><span class="tool-ic">${I.book}</span><span><b>อ่านหนังสือ</b><small>บทที่ 1 และ 2 · ${BOOK.n} หน้า ซูมได้</small></span>${I.chev}</button>
    <button class="tool rp" data-dl="1"><span class="tool-ic">${I.dl}</span><span><b>ดาวน์โหลด PDF</b><small>บันทึกเก็บไว้อ่านแบบออฟไลน์</small></span>${I.chev}</button>
    <button class="tool rp" data-act="timer"><span class="tool-ic">${I.timer}</span><span><b>ตั้งเวลาอ่านหนังสือ</b><small>นับถอยหลัง และเตือนพักสายตาทุก ${ST.rest.min} นาที</small></span>${I.chev}</button>
   </div></div>`;
}
function chCard(c){
  if(!c.ready) return `<button class="chc soon rp" data-soon="${c.id}"><span class="chc-top"><span class="chc-no num">บทที่ ${c.id}</span><span class="chc-ic">${I.lock}</span></span>
    <span class="chc-t">Coming soon</span><span class="chc-en">กำลังเตรียมเนื้อหา</span><span class="chc-ft"><span>เร็วๆ นี้</span></span></button>`;
  const cp=Math.min(c.p+c.n-1,Math.max(c.p,ST.bookPage||1)), rd=(ST.bookPage||1)<c.p?0:Math.round((cp-c.p)/(c.n-1)*100);
  return `<button class="chc rp" data-read="${c.id}"><span class="chc-top"><span class="chc-no num">บทที่ ${c.id}</span><span class="chc-ic">${I.calc}</span></span>
    <span class="chc-t">${esc(c.name)}</span><span class="chc-en">${esc(c.en)}</span>
    <span class="chc-ft"><span class="num">${c.n} หน้า</span><b class="num">${rd}%</b></span>${meter(rd)}</button>`;
}

/* ---------- ตั้งค่า ---------- */
function setHTML(){
  const R=ST.rest;
  return pageHead('ตั้งค่า','')+`
   <div class="sec"><div><h2>ตั้งเวลา</h2><p>นับถอยหลังเวลาอ่านหนังสือหรือทำข้อสอบ นับเฉพาะตอนเปิดหน้าเว็บอยู่</p></div></div>
   <div class="panel" id="timer-panel">${timerPanel()}</div>
   <div class="sec"><div><h2>พักสายตา</h2><p>ใช้งานครบตามเวลาแล้วจะมีข้อความเต็มจอเตือนให้พัก ปัดออกได้</p></div></div>
   <div class="panel">
    <div class="setrow"><span><b>เตือนพักสายตา</b><small>นับเฉพาะเวลาที่เปิดหน้าเว็บอยู่ ออกจากเว็บเกิน 5 นาทีจะเริ่มนับใหม่</small></span><button class="sw rp ${R.on?'on':''}" data-act="restOn" role="switch" aria-label="เตือนพักสายตา" aria-checked="${R.on}"></button></div>
    <div class="setrow ${R.on?'':'off'}"><span><b>เตือนทุก</b><small id="rest-left">${restLeftText()}</small></span>
     <div class="stepper"><button class="iconbtn rp" data-rest="-5" aria-label="ลด 5 นาที">${I.minus}</button><b class="num"><span id="rest-min">${R.min}</span><small>นาที</small></b><button class="iconbtn rp" data-rest="5" aria-label="เพิ่ม 5 นาที">${I.plus}</button></div></div>
    <div class="setrow"><span><b>ลองดูหน้าพักสายตา</b><small>เปิดข้อความเตือนตอนนี้เลย</small></span><button class="btn ghost sm rp" data-act="restNow">${I.eye}ดูตัวอย่าง</button></div>
   </div>
   <div class="sec"><div><h2>ทั่วไป</h2></div></div>
   <div class="panel">
    <div class="setrow"><span><b>โหมดมืด</b><small>ใช้ร่วมกันทั้งเว็บ PAYAPkuytok</small></span><button class="sw rp ${ST.theme==='dark'?'on':''}" data-act="theme" role="switch" aria-label="โหมดมืด" aria-checked="${ST.theme==='dark'}"></button></div>
    <div class="setrow"><span><b>เสียงกดปุ่ม</b><small>เสียงคลิกสั้นๆ แบบไอโฟนเมื่อกดปุ่ม</small></span><button class="sw rp ${ST.sound?'on':''}" data-act="sound" data-silent="1" role="switch" aria-label="เสียงกดปุ่ม" aria-checked="${ST.sound}"></button></div>
   </div></div>`;
}

function bind(){
  $$('[data-tab]').forEach(b=>b.onclick=()=>go(b.dataset.tab));
  $$('[data-read]').forEach(b=>b.onclick=()=>{ const id=+b.dataset.read; if(!id){ UI.bookJump=Math.max(1,ST.bookPage||1); return go('book'); } const c=chOf(id); if(!c||!c.ready) return soon(id); const bp=ST.bookPage||1; UI.bookJump=bp>=c.p&&bp<c.p+c.n?bp:c.p; go('book'); });
  $$('[data-qgo]').forEach(b=>b.onclick=()=>go('quiz',{ch:+b.dataset.qgo}));
  $$('[data-soon]').forEach(b=>b.onclick=()=>soon(+b.dataset.soon));
  $$('[data-dl]').forEach(b=>b.onclick=openDL);
  $$('[data-act]').forEach(b=>b.onclick=()=>ACT[b.dataset.act]&&ACT[b.dataset.act](b));
}
const ACT={
  theme(){ST.theme=ST.theme==='dark'?'light':'dark';save();applyTheme();const y=scrollY;render();scrollTo(0,y);},
  sound(){ST.sound=!ST.sound;save();if(ST.sound)SFX.toggle();const y=scrollY;render();scrollTo(0,y);toast(ST.sound?'เปิดเสียงแล้ว':'ปิดเสียงแล้ว');},
  timer(){go('set');},
  restOn(){ST.rest.on=!ST.rest.on;save();const y=scrollY;render();scrollTo(0,y);},
  restNow(){showRest(true);},
  startOn(){ST.startScreen=!ST.startScreen;save();const y=scrollY;render();scrollTo(0,y);},
  start(){showStart();}
};

/* ===================== หน้าเริ่มเกม (ไม่มีเสียงตอนกดเข้า) ===================== */
function showStart(){
  if($('#start')) return;
  const d=document.createElement('div'); d.id='start'; d.className='start'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-label','หน้าเริ่ม JinoonCalc');
  d.innerHTML=`<div class="st-bg" aria-hidden="true"><i class="st-rays"></i><i class="st-dots"></i><i class="st-road"></i></div>
   <div class="st-in">
    <div class="st-stage">
     <figure class="st-vid"><video id="st-v" src="${IMG.clip}" poster="${IMG.poster}" autoplay muted loop playsinline preload="auto"></video>
      <button class="st-mute rp" id="st-mute" data-silent="1" aria-label="เปิดเสียงคลิป">${I.sOff}</button></figure>
     <span class="st-bubble">มาคำนวณเภสัช<br>กันเถอะ</span>
     <div class="st-car">${beetleCar({mood:'happy'})}</div>
    </div>
    <div class="st-title"><p class="st-k num">Pharmaceutical Calculation · PHT111</p><h1>JINOON<span>CALC</span></h1><p class="st-sub">สรุปการคำนวณเภสัชกรรม · บทที่ 1 พร้อมอ่านแล้ว</p></div>
    <button class="st-go" id="st-go" data-silent="1">${I.play}<span>ENTER</span></button>
    <p class="st-hint">กดปุ่ม หรือกด Enter เพื่อเริ่ม</p>
   </div>`;
  document.body.appendChild(d); document.body.style.overflow='hidden';
  const v=$('#st-v'); const pr=v.play(); if(pr&&pr.catch) pr.catch(()=>{});
  $('#st-mute').onclick=()=>{ SFX.tap(); v.muted=!v.muted; if(!v.muted){ v.play().catch(()=>{}); } $('#st-mute').innerHTML=v.muted?I.sOff:I.sOn; $('#st-mute').setAttribute('aria-label',v.muted?'เปิดเสียงคลิป':'ปิดเสียงคลิป'); };
  const enter=()=>{
    if(d.classList.contains('out')) return;
    SFX.unlock(); v.muted=true;
    d.classList.add('out'); removeEventListener('keydown',kh,true);
    setTimeout(()=>{ v.pause(); d.remove(); if(!$('#layer').innerHTML) document.body.style.overflow=''; ST.act.last=Date.now(); },LITE?150:650);
  };
  const kh=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); enter(); } };
  addEventListener('keydown',kh,true);
  $('#st-go').onclick=enter; $('#st-go').focus({preventScroll:true});
}

/* ===================== เริ่มแอป ===================== */
(function boot(){
  const m=sessionCheck();
  render();
  
  if(m) setTimeout(()=>toast(m),ST.startScreen?900:100);
  ST.act.last=Date.now();
})();
