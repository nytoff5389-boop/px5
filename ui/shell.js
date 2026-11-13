/* PAYAPkuytok · ส่วนเสริมที่ใช้ร่วมกันในแอพรายวิชา: ปุ่มกลับหน้าหลัก ลิงก์ตรง และหน้าต่างดาวน์โหลดหนังสือ */
(function(){
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches, APP=document.documentElement.dataset.app;
  var BACK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  var NAME='<b>PAYAP<i>kuytok</i></b>';
  function put(){
    var t=document.querySelector('.top-in');
    if(t&&!t.querySelector('.pk-home')){var a=document.createElement('a');a.className='pk-home';a.href='../';a.setAttribute('aria-label','กลับหน้าหลัก PAYAPkuytok');a.innerHTML=BACK+NAME;t.insertBefore(a,t.firstChild);}
    var s=document.querySelector('.side-in');
    if(s&&!s.querySelector('.pk-side')){var b=document.createElement('a');b.className='pk-side';b.href='../';b.innerHTML=BACK+'<span>กลับหน้าหลัก</span>'+NAME;s.insertBefore(b,s.firstChild);}
  }
  put(); new MutationObserver(put).observe(document.body,{childList:true,subtree:true});

  /* ลิงก์ตรงจากหน้าหลัก เช่น ?tab=book&page=29 หรือ ?tab=learn&ch=3 */
  try{
    var q=new URLSearchParams(location.search), tab=q.get('tab'), ch=+q.get('ch'), pg=+q.get('page');
    if(tab&&typeof go==='function'){
      if(pg>0&&typeof ST==='object'){ ST.bookPage=pg; if(typeof save==='function') save(); }
      go(tab, ch>0?{ch:ch}:undefined);
      history.replaceState(null,'',location.pathname);
    }
  }catch(e){}

  /* ---------- ดาวน์โหลดหนังสือ PDF: ใช้ลิงก์จริงของเบราว์เซอร์ ไม่ผ่านสคริปต์ จึงกดได้ทุกเครื่อง ---------- */
  var UA=navigator.userAgent||'';
  var IN_APP_BROWSER=/Line\/|FBAN|FBAV|FB_IAB|Instagram|TikTok|musical_ly|BytedanceWebview|Twitter|Messenger|MicroMessenger|KAKAOTALK/i.test(UA);
  var IOS=/iPad|iPhone|iPod/.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  function pdfList(){
    try{ if(APP==='anatomy') return BOOK.pdf.map(function(x){return {f:x.f,n:x.n,mb:x.mb,name:'Anatomy-BI112-'+x.f.split('/').pop()};}); }catch(e){}
    try{ return CHAPTERS.filter(function(c){return c.ready&&c.pdf;}).map(function(c){return {f:c.pdf.f,n:'บทที่ '+c.id,mb:c.pdf.mb,name:'calc-PHT111-ch'+c.id+'.pdf'};}); }catch(e){}
    return [];
  }
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function closeDL(){var d=document.getElementById('px-dl'); if(d) d.remove(); document.body.style.overflow='';}
  function note(t){var n=document.querySelector('#px-dl .pd-note'); if(n){n.textContent=t; n.hidden=false;}}
  function openDL(){
    closeDL();
    var L=pdfList(), d=document.createElement('div'); d.id='px-dl'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-label','ดาวน์โหลดหนังสือ PDF');
    var DLI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/></svg>';
    var rows=L.map(function(x){var u=new URL(x.f,location.href).href;
      return '<div class="pd-row"><div class="pd-t"><b>'+esc(x.n)+'</b><small>PDF · '+x.mb+' MB</small></div>'+
        '<a class="pd-a" href="'+u+'" target="_blank" rel="noopener">เปิดอ่าน</a>'+
        '<a class="pd-a main" href="'+u+'" download="'+esc(x.name)+'" data-pd-save="1">'+DLI+'บันทึก</a>'+
        '<button class="pd-a icon" type="button" data-pd-copy="'+u+'" aria-label="คัดลอกลิงก์ '+esc(x.n)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></svg></button></div>';}).join('');
    var tip=IN_APP_BROWSER?'<p class="pd-warn">ตอนนี้เปิดเว็บอยู่ในแอพอื่น เช่น LINE, TikTok หรือ IG ซึ่งมักบันทึกไฟล์ไม่ได้ ให้กดเมนู … แล้วเลือกเปิดใน Safari หรือ Chrome หรือกดปุ่มคัดลอกลิงก์แล้วนำไปวางในเบราว์เซอร์</p>'
      :(IOS?'<p class="pd-tip">iPhone และ iPad: กดบันทึกแล้วเลือก “ดาวน์โหลด” ไฟล์จะอยู่ในแอพไฟล์ โฟลเดอร์ดาวน์โหลด ถ้าไฟล์เปิดขึ้นมาแทน ให้กดปุ่มแชร์แล้วเลือก “บันทึกไปยังไฟล์”</p>'
      :'<p class="pd-tip">กดบันทึกเพื่อเก็บไฟล์ลงเครื่อง หรือกดเปิดอ่านเพื่อดูในเบราว์เซอร์</p>');
    d.innerHTML='<div class="pd-box"><header><h3>ดาวน์โหลดหนังสือ PDF</h3><button class="pd-x" type="button" data-pd-close="1" aria-label="ปิด"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button></header>'+
      tip+'<div class="pd-list">'+(rows||'<p class="pd-tip">ยังไม่มีไฟล์ให้ดาวน์โหลด</p>')+'</div><p class="pd-note" role="status" hidden></p></div>';
    document.body.appendChild(d); document.body.style.overflow='hidden';
    d.addEventListener('click',function(e){
      if(e.target===d||e.target.closest('[data-pd-close]')){closeDL();return;}
      var c=e.target.closest('[data-pd-copy]');
      if(c){var u=c.getAttribute('data-pd-copy'),ok=function(){note('คัดลอกลิงก์แล้ว นำไปวางใน Safari หรือ Chrome ได้เลย');};
        if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(ok,function(){prompt('คัดลอกลิงก์นี้',u);}); else prompt('คัดลอกลิงก์นี้',u); return;}
      if(e.target.closest('[data-pd-save]')) note('เริ่มดาวน์โหลดแล้ว ถ้าไม่มีอะไรเกิดขึ้น ให้กดเปิดอ่านแทน');
    });
    var x=d.querySelector('.pd-x'); if(x) x.focus();
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-pxdl],[data-dl]'); if(!b) return;
    e.preventDefault(); e.stopPropagation(); openDL();
  },true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&document.getElementById('px-dl')) closeDL(); });

})();
