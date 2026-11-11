/* PX5 · ส่วนเสริมที่ใช้ร่วมกันในทุกแอพ: ปุ่มกลับหน้าเลือกแอพ หน้าโหลดเข้า และอนิเมชันกดปุ่ม */
(function(){
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches, APP=document.documentElement.dataset.app;
  var ICO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>';
  var LOGO='<img src="../px5/img/px5-logo.png" alt="PX5">';
  function put(){
    var t=document.querySelector('.top-in');
    if(t&&!t.querySelector('.px5-home')){var a=document.createElement('a');a.className='px5-home';a.href='../';a.setAttribute('aria-label','กลับหน้าเลือกแอพ PX5');a.innerHTML=ICO+LOGO;t.insertBefore(a,t.firstChild);}
    var s=document.querySelector('.side-in');
    if(s&&!s.querySelector('.px5-side')){var b=document.createElement('a');b.className='px5-side';b.href='../';b.innerHTML=ICO+LOGO+'<span>เลือกแอพ</span>';s.insertBefore(b,s.firstChild);}
  }
  put(); new MutationObserver(put).observe(document.body,{childList:true,subtree:true});

  /* กดปุ่ม: ยุบตอนกด (คลาส pressing ของแอพ) ปล่อยแล้ววาบขอบและเด้งกลับ */
  document.addEventListener('pointerup',function(e){
    var b=e.target.closest&&e.target.closest('.rp'); if(!b||b.disabled||RM) return;
    b.classList.remove('px-fire'); void b.offsetWidth; b.classList.add('px-fire');
    setTimeout(function(){b.classList.remove('px-fire');},420);
  },true);


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

  /* หน้าโหลดเข้า: ประกายไฟ/ละอองแสง แล้วจางออกเมื่อแอพพร้อม */
  var sp=document.getElementById('px-splash'); if(!sp) return;
  var fromHome=false; try{fromHome=Date.now()-(+sessionStorage.getItem('px5.launch')||0)<9000; sessionStorage.removeItem('px5.launch');}catch(e){}
  if(fromHome) sp.classList.add('quick');
  var cv=sp.querySelector('canvas'), run=!RM, col=APP==='calc'?[60,215,240]:[255,120,50], up=APP!=='calc';
  if(run&&cv){var c=cv.getContext('2d'),W,H,P=[],D=Math.min(devicePixelRatio||1,2);
    var size=function(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*D;cv.height=H*D;c.setTransform(D,0,0,D,0,0);}; size();
    (function frame(){ if(!run) return; c.clearRect(0,0,W,H); c.globalCompositeOperation='lighter';
      for(var n=0;n<2&&P.length<200;n++) P.push({x:Math.random()*W,y:up?H+8:-8,vx:(Math.random()-.5)*.6,vy:(up?-1:1)*(Math.random()*1.6+.5),r:Math.random()*1.9+.5,l:1,d:.004+Math.random()*.006,w:Math.random()*6.28});
      for(var i=P.length-1;i>=0;i--){var p=P[i];p.w+=.05;p.x+=p.vx+Math.sin(p.w)*.4;p.y+=p.vy;p.l-=p.d;if(p.l<=0){P.splice(i,1);continue;}
        var g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);g.addColorStop(0,'rgba(255,255,255,'+.9*p.l+')');g.addColorStop(.25,'rgba('+col+','+.65*p.l+')');g.addColorStop(1,'rgba('+col+',0)');
        c.fillStyle=g;c.beginPath();c.arc(p.x,p.y,p.r*5,0,6.283);c.fill();}
      requestAnimationFrame(frame);})();
  }
  var t0=performance.now(), min=RM?0:(fromHome?900:2100);
  function done(){var wait=Math.max(0,min-(performance.now()-t0));
    setTimeout(function(){sp.classList.add('out');setTimeout(function(){run=false;sp.remove();},650);},wait);}
  if(document.readyState==='complete') done(); else addEventListener('load',done);
})();
