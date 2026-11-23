/* PAYAPkuytok · ปุ่มกระดิ่ง: รายการอัปเดตล่าสุด + สมัครรับแจ้งเตือนบนมือถือ/ไอแพดผ่านแอพ ntfy */
(function(){
  var cs=document.currentScript; if(!cs) return;
  var BASE=new URL('../',cs.src).href, SITE='https://nytoff5389-boop.github.io/px5/';
  var TOPIC='payapkuytok-f8ad123d', KEY='px.bell.seen', LIST=[];
  var APPSTORE='https://apps.apple.com/app/ntfy/id1625396347', PLAY='https://play.google.com/store/apps/details?id=io.heckel.ntfy';
  var SUBJ={anatomy:'Anatomy',calc:'calc',chem:'เคมีฟิสิกส์',bio:'Biochem',all:'ทั้งเว็บ'};
  var BELL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.27 21a2 2 0 0 0 3.46 0"/><path d="M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33"/></svg>';
  var X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  function seen(){ try{ return +localStorage.getItem(KEY)||0; }catch(e){ return 0; } }
  function setSeen(v){ try{ localStorage.setItem(KEY,String(v)); }catch(e){} }
  function esc(t){ return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function unread(){ var s=seen(); if(!s){ /* เข้าเว็บครั้งแรก: นับเฉพาะของ 7 วันล่าสุด */ var lim=Date.now()-7*864e5; return LIST.filter(function(u){return Date.parse(u.d)>=lim;}).length; }
    return LIST.filter(function(u){return u.id>s;}).length; }
  function thDate(d){ try{ return new Date(d+'T12:00:00').toLocaleDateString('th-TH',{day:'numeric',month:'short'}); }catch(e){ return d; } }

  var css=document.createElement('style');
  css.textContent='.px-bell{position:relative;width:40px;height:40px;border-radius:50%;display:inline-grid;place-items:center;border:0;background:none;color:inherit;cursor:pointer;flex:none;-webkit-tap-highlight-color:transparent}'+
  '.px-bell svg{width:22px;height:22px}.px-bell:hover{background:rgba(127,127,127,.12)}'+
  '.px-bell i{position:absolute;top:2px;right:0;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#E5484D;color:#fff;font:600 11px/18px Inter,Prompt,sans-serif;font-style:normal;text-align:center;box-shadow:0 0 0 2px var(--surface,#fff)}'+
  '#px-up{position:fixed;inset:0;z-index:120;background:rgba(15,23,42,.35);display:flex;justify-content:flex-end;align-items:flex-start;padding:64px 16px 16px}'+
  '#px-up .bx{width:min(400px,100%);max-height:calc(100dvh - 80px);overflow:auto;background:#fff;color:#0F172A;border:1px solid #E2E8F0;border-radius:16px;box-shadow:0 20px 50px rgba(15,23,42,.2);font-family:Prompt,Inter,sans-serif}'+
  '#px-up header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;border-bottom:1px solid #E2E8F0;position:sticky;top:0;background:inherit}'+
  '#px-up h3{font-size:17px;font-weight:600;margin:0}#px-up .x{width:34px;height:34px;border:0;background:none;border-radius:50%;color:inherit;display:grid;place-items:center;cursor:pointer}#px-up .x svg{width:18px;height:18px}'+
  '#px-up ul{list-style:none;margin:0;padding:4px 0}#px-up li a{display:block;padding:12px 16px;color:inherit;text-decoration:none}#px-up li+li a{border-top:1px solid #F1F5F9}#px-up li a:hover{background:#F8FAFC}'+
  '#px-up .m{display:flex;gap:8px;align-items:center;font-size:12px;color:#64748B}#px-up .m b{font-weight:500;color:#0369A1;background:#F0F9FF;padding:1px 7px;border-radius:9999px}'+
  '#px-up .new .m:after{content:"ใหม่";margin-left:auto;font-weight:600;color:#E5484D}'+
  '#px-up li strong{display:block;font-size:15px;font-weight:600;margin-top:3px}#px-up li p{font-size:13px;color:#475569;margin:2px 0 0;line-height:1.5}'+
  '#px-up .ps{margin:6px 12px 12px;padding:14px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;font-size:13.5px;line-height:1.55}'+
  '#px-up .ps summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between}#px-up .ps summary::-webkit-details-marker{display:none}#px-up .ps summary:after{content:"เปิด";font-size:12.5px;color:#fff;background:#0284C7;padding:4px 10px;border-radius:9999px}#px-up .ps[open] summary:after{content:"ซ่อน";background:none;color:#64748B}#px-up .ps[open] summary{margin-bottom:6px}#px-up .ps b{font-size:14.5px}#px-up .ps ol{margin:6px 0 0;padding-left:20px}#px-up .ps li{margin:3px 0}'+
  '#px-up .pxtp{display:flex;gap:6px;margin-top:8px}#px-up .pxtp code{flex:1;min-width:0;padding:8px 10px;border-radius:8px;background:#fff;border:1px solid #E2E8F0;font:500 13px/1.3 Inter,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
  '#px-up .bt{display:inline-flex;align-items:center;justify-content:center;padding:8px 12px;border-radius:9999px;border:1px solid #E2E8F0;background:#fff;color:#0F172A;font:500 13px Prompt,sans-serif;text-decoration:none;cursor:pointer;white-space:nowrap}'+
  '#px-up .bt.p{background:#0284C7;border-color:#0284C7;color:#fff}#px-up .row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}#px-up .ok{color:#059669;font-size:12.5px;margin-top:6px}'+
  '[data-theme=dark] #px-up .bx{background:#0F172A;color:#E2E8F0;border-color:#1E293B}[data-theme=dark] #px-up header,[data-theme=dark] #px-up li+li a{border-color:#1E293B}'+
  '[data-theme=dark] #px-up li a:hover{background:#111C31}[data-theme=dark] #px-up li p{color:#94A3B8}[data-theme=dark] #px-up .m b{background:#0C2A40;color:#7DD3FC}'+
  '[data-theme=dark] #px-up .ps{background:#111C31;border-color:#1E293B}[data-theme=dark] #px-up .pxtp code,[data-theme=dark] #px-up .bt{background:#0F172A;border-color:#334155;color:#E2E8F0}[data-theme=dark] #px-up .bt.p{background:#0284C7;color:#fff}'+
  '@media (max-width:640px){#px-up{padding:58px 10px 10px}}';
  document.head.appendChild(css);

  function badge(){ var n=unread(); document.querySelectorAll('.px-bell').forEach(function(b){
    var i=b.querySelector('i'), t=n>9?'9+':String(n); if(n){ if(!i){ i=document.createElement('i'); b.appendChild(i);} if(i.textContent!==t) i.textContent=t; } else if(i) i.remove();
    var l=n?'การแจ้งเตือน มีอัปเดตใหม่ '+n+' รายการ':'การแจ้งเตือน อัปเดตล่าสุด'; if(b.getAttribute('aria-label')!==l) b.setAttribute('aria-label',l); }); }
  function put(){ var add=0; document.querySelectorAll('[data-act="theme"]').forEach(function(t){
    var p=t.parentNode; if(!p||p.querySelector('.px-bell')||t.closest('#px-up')||t.classList.contains('sw')||t.closest('.setrow')||t.closest('.sfoot')) return;
    var b=document.createElement('button'); b.type='button'; b.className='px-bell'; b.innerHTML=BELL; b.title='อัปเดตล่าสุด';
    b.addEventListener('click',function(e){ e.stopPropagation(); open(); }); p.insertBefore(b,t); add=1; });
    if(add) badge(); }

  function close(){ var d=document.getElementById('px-up'); if(d) d.remove(); }
  function open(){
    close(); var s=seen(), first=!s, lim=Date.now()-7*864e5;
    var rows=LIST.slice(0,20).map(function(u){ var nw=first?Date.parse(u.d)>=lim:u.id>s;
      return '<li class="'+(nw?'new':'')+'"><a href="'+esc(new URL(u.h||'',BASE).href)+'"><span class="m"><b>'+esc(SUBJ[u.s]||u.s||'')+'</b>'+thDate(u.d)+'</span><strong>'+esc(u.t)+'</strong>'+(u.m?'<p>'+esc(u.m)+'</p>':'')+'</a></li>'; }).join('');
    var ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1), and=/Android/i.test(navigator.userAgent);
    var store=ios?'<a class="bt p" href="'+APPSTORE+'" target="_blank" rel="noopener">โหลดแอพ ntfy (App Store)</a>':and?'<a class="bt p" href="'+PLAY+'" target="_blank" rel="noopener">โหลดแอพ ntfy (Google Play)</a>':
      '<a class="bt" href="'+APPSTORE+'" target="_blank" rel="noopener">App Store</a><a class="bt" href="'+PLAY+'" target="_blank" rel="noopener">Google Play</a><a class="bt p" href="https://ntfy.sh/'+TOPIC+'" target="_blank" rel="noopener">รับบนคอมนี้</a>';
    var d=document.createElement('div'); d.id='px-up'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-label','อัปเดตล่าสุด');
    d.innerHTML='<div class="bx"><header><h3>อัปเดตล่าสุด</h3><button class="x" type="button" data-x aria-label="ปิด">'+X+'</button></header>'+
      '<details class="ps"><summary><b>เปิดแจ้งเตือนเข้ามือถือ/ไอแพด</b></summary>เมื่อเว็บมีอัปเดตใหม่ จะเด้งแจ้งเตือนผ่านแอพฟรีชื่อ ntfy ไม่ต้องสมัครสมาชิก'+
      '<ol><li>โหลดแอพ ntfy</li><li>เปิดแอพ กดปุ่ม + แล้ววางชื่อหัวข้อด้านล่าง กด Subscribe</li><li>กดอนุญาตการแจ้งเตือน</li></ol>'+
      '<div class="pxtp"><code>'+TOPIC+'</code><button class="bt" type="button" data-cp>คัดลอก</button></div><div class="row">'+store+'</div><div class="ok" hidden></div></details>'+
      '<ul>'+(rows||'<li><a>ยังไม่มีรายการอัปเดต</a></li>')+'</ul></div>';
    document.body.appendChild(d);
    d.addEventListener('click',function(e){
      if(e.target===d||e.target.closest('[data-x]')){ close(); return; }
      if(e.target.closest('[data-cp]')){ var ok=d.querySelector('.ok'), done=function(){ ok.hidden=false; ok.textContent='คัดลอกแล้ว ไปวางในแอพ ntfy ได้เลย'; };
        if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(TOPIC).then(done,function(){ prompt('คัดลอกชื่อนี้',TOPIC); }); else prompt('คัดลอกชื่อนี้',TOPIC); }
      if(e.target.closest('li a')) close();
    });
    addEventListener('keydown',function k(e){ if(e.key==='Escape'){ close(); removeEventListener('keydown',k); } });
    if(LIST.length) setSeen(LIST[0].id); badge();
  }

  function load(){ fetch(BASE+'updates.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():[];}).then(function(j){
      LIST=(Array.isArray(j)?j:(j.items||[])).slice().sort(function(a,b){return b.id-a.id;}); badge(); }).catch(function(){}); }
  function boot(){ put(); new MutationObserver(put).observe(document.body,{childList:true,subtree:true}); load(); }
  if(document.body) boot(); else addEventListener('DOMContentLoaded',boot);
  document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='visible') load(); });
})();
