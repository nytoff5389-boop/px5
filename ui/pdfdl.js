/* PAYAPkuytok · ดาวน์โหลดหนังสือ PDF ใช้ร่วมกันทุกวิชา
   - ปุ่ม PDF ลอยมุมขวาล่างตลอดเวลาที่อยู่หน้าอ่านหนังสือ
   - แชร์ไฟล์ไป GoodNotes / บันทึกลงไฟล์ ผ่านเมนูแชร์ของเครื่อง
   - เปิดจาก IG, LINE, TikTok, Facebook: มีปุ่มเปิดใน Safari หรือ Chrome */
(function(){
  var cs=document.currentScript; if(!cs) return;
  var ROOT=new URL('../',cs.src).href, P=location.pathname, APP=/\/anatomy\//.test(P)?'anatomy':/\/calc\//.test(P)?'calc':/\/bio\//.test(P)?'bio':'home';
  var UA=navigator.userAgent||'', IOS=/iPad|iPhone|iPod/.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1), AND=/Android/i.test(UA);
  var INAPP=/Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|musical_ly|BytedanceWebview|Twitter|Messenger|MicroMessenger|KAKAOTALK/i.test(UA);
  var APPN=/Instagram/i.test(UA)?'IG':/Line\//.test(UA)?'LINE':/TikTok|musical_ly|Bytedance/i.test(UA)?'TikTok':/FBAN|FBAV|FB_IAB|Messenger/i.test(UA)?'Facebook':'แอพนี้';
  function svg(d){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'; }
  var IC={dl:svg('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>'),share:svg('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'),
    eye:svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),x:svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    link:svg('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),out:svg('<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>')};

  function list(){
    var L=[];
    try{ if(APP==='anatomy') L=BOOK.pdf.map(function(x){return {f:'anatomy/'+x.f,n:'Anatomy '+x.n,mb:x.mb,name:'Anatomy-BI112-'+x.f.split('/').pop()};}); }catch(e){}
    try{ if(APP==='calc') L=CHAPTERS.filter(function(c){return c.ready&&c.pdf;}).map(function(c){return {f:'calc/'+c.pdf.f,n:'calc บทที่ '+c.id+(c.name?' '+c.name:''),mb:c.pdf.mb,name:'calc-PHT111-ch'+c.id+'.pdf'};}); }catch(e){}
    if(APP==='bio') L=[{f:'bio/pdf/ch1.pdf',n:'Biochem บทที่ 1 คาร์โบไฮเดรต',mb:4.1,name:'Biochem-PHB104-ch1.pdf'},{f:'bio/pdf/ch2.pdf',n:'Biochem บทที่ 2 ลิพิดส์',mb:6.1,name:'Biochem-PHB104-ch2.pdf'}];
    if(APP==='home'){ L=[{f:'chem/pdf/ch1.pdf',n:'เคมีฟิสิกส์ บทที่ 1 ปริมาณสารสัมพันธ์',mb:3.3,name:'PHB102-Physical-Chemistry-ch1.pdf'},{f:'chem/pdf/ws1-6.pdf',n:'แบบฝึกหัดเคมีฟิสิกส์ บทที่ 1 ถึง 6',mb:0.5,name:'PHB102-Worksheet-ch1-6.pdf'}];
      if(/^#\/pages\/ws/.test(location.hash)) L.reverse(); }
    /* เอาเล่มที่กำลังอ่านขึ้นก่อน */
    var cur=-1; try{ if(APP==='calc'){ var c=pageCh(ST.bookPage||1); cur=L.findIndex(function(x){return /ch(\d+)\.pdf$/.exec(x.f)[1]==c;}); } }catch(e){}
    try{ if(APP==='bio'){ var m=/#\/book\/(\d)/.exec(location.hash); if(m) cur=+m[1]-1; } }catch(e){}
    if(cur>0){ var t=L.splice(cur,1)[0]; L.unshift(t); }
    return L.map(function(x){ x.u=new URL(x.f,ROOT).href; return x; });
  }
  /* หน้าอ่านหนังสือที่ควรมีปุ่มลอย */
  function onBook(){ if(APP==='home') return /^#\/pages\//.test(location.hash);
    return !!document.querySelector('#bk-pages,.dlb'); }

  var css=document.createElement('style');
  css.textContent=
  '.pxf{position:fixed;right:16px;bottom:calc(20px + env(safe-area-inset-bottom));z-index:60;display:inline-flex;align-items:center;gap:8px;height:52px;padding:0 20px 0 16px;border:0;border-radius:9999px;background:#0284C7;color:#fff;font:600 15px/1 Prompt,Inter,sans-serif;box-shadow:0 8px 24px rgba(2,132,199,.35),0 2px 6px rgba(15,23,42,.15);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .15s,opacity .2s}'+
  '.pxf svg{width:20px;height:20px}.pxf:active{transform:scale(.95)}.pxf[hidden]{display:none}'+
  '#px-dl{position:fixed;inset:0;z-index:500;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,23,42,.45)}'+
  '#px-dl .bx{width:min(560px,100%);max-height:90dvh;overflow:auto;background:#fff;color:#0F172A;border-radius:20px 20px 0 0;padding:16px 16px calc(18px + env(safe-area-inset-bottom));font:15px/1.5 Prompt,Inter,sans-serif;box-shadow:0 -10px 40px rgba(15,23,42,.2)}'+
  '@media (min-width:640px){#px-dl{align-items:center;padding:20px}#px-dl .bx{border-radius:20px;padding:22px}}'+
  '#px-dl header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}#px-dl h3{font-size:19px;font-weight:600;margin:0}'+
  '#px-dl .x{width:40px;height:40px;border:0;background:none;border-radius:50%;display:grid;place-items:center;color:inherit;cursor:pointer}#px-dl .x svg{width:20px;height:20px}'+
  '#px-dl .tip{color:#64748B;font-size:13.5px;margin:0 0 12px}'+
  '#px-dl .warn{background:#FFF7ED;border:1px solid #FED7AA;border-radius:14px;padding:12px;margin:0 0 12px;font-size:14px}#px-dl .warn b{display:block;margin-bottom:6px}'+
  '#px-dl .fl{display:grid;gap:10px}#px-dl .it{border:1px solid #E2E8F0;border-radius:16px;padding:12px}'+
  '#px-dl .it .t{display:flex;justify-content:space-between;gap:8px;align-items:baseline}#px-dl .it .t b{font-size:15.5px;font-weight:600}#px-dl .it .t small{color:#64748B;font:500 12.5px Inter,sans-serif;white-space:nowrap}'+
  '#px-dl .ac{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:8px;margin-top:10px}'+
  '#px-dl .b{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:46px;padding:0 10px;border-radius:12px;border:1px solid #E2E8F0;background:#fff;color:#0F172A;font:600 14px/1.2 Prompt,sans-serif;text-decoration:none;cursor:pointer;text-align:center}'+
  '#px-dl .b svg{width:18px;height:18px;flex:none}#px-dl .b.p{background:#0284C7;border-color:#0284C7;color:#fff}#px-dl .b:active{transform:scale(.97)}#px-dl .b[disabled]{opacity:.7}'+
  '#px-dl .warn .b{width:100%;margin-top:8px}#px-dl .bar{height:4px;border-radius:2px;background:#E2E8F0;margin-top:10px;overflow:hidden}#px-dl .bar i{display:block;height:100%;width:0;background:#0284C7;transition:width .15s}'+
  '#px-dl [hidden]{display:none!important}#px-dl .ac.two{grid-template-columns:1fr 1fr}#px-dl .ac.two .p{grid-column:auto}#px-dl .st{font-size:13px;color:#059669;margin-top:6px}#px-dl .st.er{color:#DC2626}'+
  '@media (max-width:420px){#px-dl .ac{grid-template-columns:1fr 1fr}#px-dl .ac .p{grid-column:1/-1}}'+
  '[data-theme=dark] #px-dl .bx{background:#0F172A;color:#E2E8F0}[data-theme=dark] #px-dl .it{border-color:#1E293B}[data-theme=dark] #px-dl .b{background:#111C31;border-color:#334155;color:#E2E8F0}'+
  '[data-theme=dark] #px-dl .b.p{background:#0284C7;color:#fff}[data-theme=dark] #px-dl .warn{background:#2A1A0A;border-color:#7C4A13}[data-theme=dark] #px-dl .bar{background:#1E293B}'+
  '@media print{.pxf{display:none}}';
  document.head.appendChild(css);

  var fab=document.createElement('button'); fab.type='button'; fab.className='pxf'; fab.hidden=true; fab.innerHTML=IC.dl+'<span>PDF</span>';
  fab.setAttribute('aria-label','ดาวน์โหลดหนังสือ PDF'); fab.addEventListener('click',function(e){ e.stopPropagation(); openDL(); });
  function lift(){ /* ยกปุ่มขึ้นเหนือแถบเมนูล่างถ้ามี */
    var off=0; try{ var el=document.elementFromPoint(innerWidth/2,innerHeight-4); while(el&&el!==document.body){ var s=getComputedStyle(el); if(s.position==='fixed'&&el!==fab){ off=innerHeight-el.getBoundingClientRect().top; break; } el=el.parentElement; } }catch(e){}
    fab.style.bottom=off>0&&off<160?'calc('+(off+14)+'px)':''; }
  function sync(){ if(!document.body) return; if(!fab.isConnected) document.body.appendChild(fab);
    var on=onBook()&&list().length>0&&!document.getElementById('px-dl'); if(fab.hidden===on){ fab.hidden=!on; if(on) lift(); } }

  var blobs={};
  function closeDL(){ var d=document.getElementById('px-dl'); if(d) d.remove(); document.documentElement.style.overflow=''; sync(); }
  function openDL(){
    closeDL(); var L=list(), d=document.createElement('div'); d.id='px-dl'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-label','ดาวน์โหลดหนังสือ PDF');
    var canShare=!!(navigator.share&&navigator.canShare);
    var here=location.href, ext=IOS?'x-safari-'+here:AND?'intent://'+here.replace(/^https?:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end':here;
    var warn=INAPP?'<div class="warn"><b>ตอนนี้เปิดเว็บอยู่ในแอพ '+APPN+'</b>แอพนี้มักบันทึกไฟล์ไม่ได้ กดปุ่มด้านล่างเพื่อเปิดหน้านี้ใน '+(IOS?'Safari':'Chrome')+' แล้วกดดาวน์โหลดอีกครั้ง '+(canShare?'หรือลองกด “แชร์ / GoodNotes” ด้านล่างก่อนก็ได้':'')+''+
      '<a class="b p" href="'+ext+'">'+IC.out+'เปิดใน '+(IOS?'Safari':AND?'Chrome':'เบราว์เซอร์')+'</a>'+(IOS?'<small style="display:block;color:#9A3412;margin-top:6px">ถ้ากดแล้วไม่เปิด ให้กดเมนู ⋯ มุมขวาบน แล้วเลือก “เปิดในเบราว์เซอร์” หรือ “Open in Safari”</small>':'')+'</div>':'';
    var rows=L.map(function(x,i){ return '<div class="it" data-i="'+i+'"><div class="t"><b>'+x.n+'</b><small>PDF · '+x.mb+' MB</small></div><div class="ac'+(canShare?'':' two')+'">'+
      (canShare?'<button class="b p" type="button" data-sh>'+IC.share+'<span>แชร์ / GoodNotes</span></button>':'')+
      '<a class="b'+(canShare?'':' p')+'" href="'+x.u+'" download="'+x.name+'" data-sv>'+IC.dl+'บันทึก'+(canShare?'':'ลงเครื่อง')+'</a>'+
      '<a class="b" href="'+x.u+'" target="_blank" rel="noopener">'+IC.eye+'เปิดอ่าน</a></div><div class="bar" hidden><i></i></div><div class="st" hidden></div></div>'; }).join('');
    d.innerHTML='<div class="bx"><header><h3>ดาวน์โหลดหนังสือ PDF</h3><button class="x" type="button" data-x aria-label="ปิด">'+IC.x+'</button></header>'+warn+
      '<p class="tip">'+(canShare?'กด “แชร์ / GoodNotes” แล้วเลือก GoodNotes, Notability หรือ “บันทึกไปยังไฟล์” ได้เลย':'กด “บันทึก” เพื่อเก็บไฟล์ลงเครื่อง หรือ “เปิดอ่าน” เพื่อดูในเบราว์เซอร์')+'</p>'+
      '<div class="fl">'+(rows||'<p class="tip">ยังไม่มีไฟล์ให้ดาวน์โหลด</p>')+'</div>'+
      '<button class="b" type="button" data-cp style="width:100%;margin-top:12px">'+IC.link+'คัดลอกลิงก์หน้านี้</button></div>';
    document.body.appendChild(d); document.documentElement.style.overflow='hidden'; fab.hidden=true;
    d.addEventListener('click',function(e){
      if(e.target===d||e.target.closest('[data-x]')){ closeDL(); return; }
      var it=e.target.closest('.it'), x=it&&L[+it.dataset.i];
      if(e.target.closest('[data-cp]')){ var u=location.href, b=e.target.closest('[data-cp]'), ok=function(){ b.lastChild.textContent='คัดลอกแล้ว ไปวางใน Safari หรือ Chrome ได้เลย'; };
        if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(ok,function(){ prompt('คัดลอกลิงก์นี้',u); }); else prompt('คัดลอกลิงก์นี้',u); return; }
      if(x&&e.target.closest('[data-sv]')) msg(it,'เริ่มดาวน์โหลดแล้ว ถ้าไม่มีอะไรเกิดขึ้น ให้กด “เปิดอ่าน” แล้วกดปุ่มแชร์ของเบราว์เซอร์');
      if(x&&e.target.closest('[data-sh]')) share(it,x,canShare);
    });
    var c=d.querySelector('.x'); if(c) c.focus();
  }
  function msg(it,t,er){ var s=it.querySelector('.st'); s.hidden=false; s.textContent=t; s.classList.toggle('er',!!er); }
  /* แชร์ต้องเรียกตอนผู้ใช้กดโดยตรง: ครั้งแรกโหลดไฟล์ก่อน (มีแถบความคืบหน้า) โหลดเสร็จกดอีกครั้งเพื่อเปิดเมนูแชร์ */
  function share(it,x,canShare){
    var btn=it.querySelector('[data-sh]'), lab=btn.querySelector('span');
    if(!canShare){ var a=document.createElement('a'); a.href=x.u; a.download=x.name; document.body.appendChild(a); a.click(); a.remove(); msg(it,'เริ่มดาวน์โหลดแล้ว'); return; }
    var f=blobs[x.u];
    if(f){ var data={files:[f],title:x.n};
      if(!navigator.canShare(data)){ msg(it,'เครื่องนี้แชร์ไฟล์ไม่ได้ ให้กด “บันทึก” หรือ “เปิดอ่าน” แทน',1); return; }
      navigator.share(data).then(function(){ msg(it,'ส่งไฟล์แล้ว'); }).catch(function(err){ if(err&&err.name!=='AbortError') msg(it,'แชร์ไม่สำเร็จ ลองกดอีกครั้ง หรือกด “บันทึก” แทน',1); });
      return; }
    if(btn.disabled) return; btn.disabled=true; lab.textContent='กำลังเตรียมไฟล์…'; var bar=it.querySelector('.bar'), bi=bar.querySelector('i'); bar.hidden=false;
    fetch(x.u).then(function(r){ if(!r.ok) throw new Error(r.status); var tot=+r.headers.get('content-length')||x.mb*1048576;
      if(!r.body||!r.body.getReader) return r.blob();
      var rd=r.body.getReader(), parts=[], got=0;
      return (function pump(){ return rd.read().then(function(s){ if(s.done) return new Blob(parts,{type:'application/pdf'}); parts.push(s.value); got+=s.value.length; bi.style.width=Math.min(100,Math.round(got/tot*100))+'%'; return pump(); }); })();
    }).then(function(b){ blobs[x.u]=new File([b],x.name,{type:'application/pdf'}); bi.style.width='100%'; btn.disabled=false; lab.textContent='พร้อมแล้ว กดเพื่อแชร์'; btn.classList.add('p');
      msg(it,'ไฟล์พร้อมแล้ว กดปุ่มอีกครั้งเพื่อเลือก GoodNotes หรือบันทึกไปยังไฟล์');
    }).catch(function(){ btn.disabled=false; bar.hidden=true; lab.textContent='แชร์ / GoodNotes'; msg(it,'โหลดไฟล์ไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองใหม่ หรือกด “เปิดอ่าน”',1); });
  }

  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-pxdl],[data-dl],a[download][href$=".pdf"]'); if(!b||b.closest('#px-dl')) return;
    e.preventDefault(); e.stopPropagation(); openDL();
  },true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&document.getElementById('px-dl')) closeDL(); });
  window.PX_openDL=openDL;
  function boot(){ sync(); new MutationObserver(sync).observe(document.body,{childList:true,subtree:true}); addEventListener('hashchange',sync); addEventListener('resize',function(){ if(!fab.hidden) lift(); }); }
  if(document.body) boot(); else addEventListener('DOMContentLoaded',boot);
})();
