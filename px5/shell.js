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
