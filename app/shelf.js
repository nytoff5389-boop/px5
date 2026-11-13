/* PAYAPkuytok · ชั้นหนังสือโค้ง 3 มิติ
   สันหนังสือเรียงโค้งลึกเข้าไปสองข้าง เล่มที่เลือกหมุน 90 องศาหันปกออกมา
   ใช้ requestAnimationFrame วงเดียว + Web Animations API ไม่ใช้การจางด้วย opacity */
(function(){
  'use strict';
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var EIO='cubic-bezier(.76,0,.18,1)';
  var esc=function(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var PAL=[['#0F172A','#F8FAFC'],['#1F3FB0','#FFFFFF'],['#E7E1D3','#0F172A'],['#0284C7','#FFFFFF'],['#334155','#F8FAFC'],['#BAE6FD','#0C4A6E'],['#F8FAFC','#0F172A'],['#0C4A6E','#E0F2FE']];

  window.mountShelf=function(el,items,opt){
    opt=opt||{};
    var N=items.length, s=Math.max(0,Math.min(N-1,opt.start||0)), T=s, act=-1, raf=0, last=0, drag=null, alive=true;
    var H=0,W=0,ws=0,sh=0,cw=0,step=0,extra=0,U=1,tab=[],DU=1,RW=0,vel=0,C=[];
    var groups=[]; items.forEach(function(it,i){ if(!i||items[i-1].code!==it.code) groups.push({i:i,code:it.code}); });

    el.innerHTML='<div class="big" aria-hidden="true"><span class="mk"><span></span></span><span class="mk"><span></span></span></div>'+
      '<div class="hd"><span>ชั้นหนังสือ · <b>'+N+' เล่ม</b></span><span class="ix num"></span></div>'+
      '<div class="hint">ลากหรือกดลูกศรเพื่อเลื่อน · กดปกเพื่อเปิด</div>'+
      '<div class="fl"></div><div class="st"></div>'+
      '<div class="cap"><button class="ar" type="button" data-d="-1" aria-label="เล่มก่อนหน้า">'+ic('arrow_left')+'</button>'+
      '<div class="tx"><span class="in"></span></div>'+
      '<button class="ar" type="button" data-d="1" aria-label="เล่มถัดไป">'+ic('arrow_right')+'</button></div>'+
      '<div class="rl" aria-hidden="true"><span class="dot"></span></div><div class="grain"></div>';
    var st=el.querySelector('.st'), capIn=el.querySelector('.cap .in'), ix=el.querySelector('.ix'), rl=el.querySelector('.rl'), dot=rl.querySelector('.dot');
    var bigs=el.querySelectorAll('.big .mk>span'), arL=el.querySelector('[data-d="-1"]'), arR=el.querySelector('[data-d="1"]');
    el.setAttribute('role','listbox'); el.setAttribute('aria-label','ชั้นหนังสือ เลือกบทเรียน');

    var bks=items.map(function(it,i){
      var p=PAL[i%PAL.length], b=document.createElement('div'); b.className='bk'; b.dataset.i=i;
      b.style.setProperty('--c',p[0]); b.style.setProperty('--ct',p[1]);
      var cover='<div class="ph" style="background-image:url('+it.img+');background-position:'+(it.pos||'50% 50%')+'"></div><div class="hg"></div>'+
        '<div class="bd"><small>'+esc(it.code)+' · '+esc(it.kind)+'</small><b>'+esc(it.t)+'</b><i>PAYAPkuytok</i></div>';
      b.innerHTML='<div class="f sp"><span class="cd">'+esc(it.code)+'</span><span class="tt">'+esc(it.short||it.t)+'</span><span class="no">'+esc(it.no)+'</span></div>'+
        '<div class="f cv">'+cover+'</div>';
      st.appendChild(b); return b;
    });
    var ticks=items.map(function(it,i){ var t=document.createElement('i'); if(groups.some(function(g){return g.i===i;})) t.className='mj'; rl.appendChild(t); return t; });
    var labs=groups.map(function(g){ var u=document.createElement('u'); u.textContent=g.code; rl.appendChild(u); return u; });

    function scl(u){ return 1/(1+Math.pow(Math.abs(u)/U,1.6)); }
    function X(u){ var a=Math.abs(u)/DU, i=Math.floor(a), f=a-i; if(i>=tab.length-1) return (u<0?-1:1)*tab[tab.length-1]; return (u<0?-1:1)*(tab[i]+(tab[i+1]-tab[i])*f); }
    function size(){
      H=el.clientHeight; W=el.clientWidth; if(!H) return;
      var narrow=W<560;
      sh=H*(narrow?.46:.5); ws=H*(narrow?.082:.09); cw=Math.min(sh*.7,W*.62); step=ws+H*.02; extra=(cw-ws)/2+H*.03; U=H*1.3;
      el.style.setProperty('--H',H+'px'); el.style.setProperty('--ws',ws+'px'); el.style.setProperty('--sh',sh+'px'); el.style.setProperty('--cw',cw+'px'); el.style.setProperty('--cy',(H*(narrow?.36:.39))+'px');
      DU=U/48; tab=[0]; for(var k=1;k<=48*8;k++){ tab.push(tab[k-1]+DU*(scl((k-1)*DU)+scl(k*DU))/2); }
      var rw=RW=rl.clientWidth; ticks.forEach(function(t,i){ t.style.left=(N>1?i/(N-1)*rw:rw/2)+'px'; });
      var px=-1e9; labs.forEach(function(u,k){ var x=Math.max(N>1?groups[k].i/(N-1)*rw:0,px+54); u.style.left=x+'px'; px=x; });
      draw();
    }
    function draw(){
      var rw=RW;
      for(var i=0;i<N;i++){
        var d=i-s, ad=Math.abs(d), o=Math.max(0,1-ad), sg=d>=0?1:-1;
        var u=d*step+sg*Math.min(1,ad)*extra, x=X(u), sc=scl(u);
        var tilt=Math.min(1,Math.abs(u)/U)*26*(1-o), ang=o*90, rad=ang*Math.PI/180;
        var b=bks[i], c=C[i]||(C[i]={}), sp=b.firstChild, cv=b.lastChild;
        if(Math.abs(x)>W/2+cw){ if(c.h!==1){ b.style.display='none'; c.h=1; } continue; }
        if(c.h!==0){ b.style.display=''; c.h=0; }
        /* แต่ละหน้าเป็นแผ่นเรียบแผ่นเดียว หมุนด้วยมุมที่ไม่เกิน 90 องศา จึงไม่พึ่ง backface หรือ preserve-3d (เสถียรบน Safari) */
        var sOn=ang<86?1:0, cOn=ang>4?1:0;
        if(c.s!==sOn){ sp.style.display=sOn?'':'none'; c.s=sOn; }
        if(c.c!==cOn){ cv.style.display=cOn?'':'none'; c.c=cOn; }
        if(sOn) sp.style.transform='translate3d('+(x-sg*(cw/2)*Math.sin(rad)*sc).toFixed(1)+'px,0,0) scale('+sc.toFixed(3)+') perspective(1400px) rotateY('+(sg*(tilt-ang)).toFixed(1)+'deg)';
        if(cOn) cv.style.transform='translate3d('+(x+sg*(ws/2)*Math.cos(rad)*sc).toFixed(1)+'px,0,0) scale('+sc.toFixed(3)+') perspective(1400px) rotateY('+(sg*(90-ang)).toFixed(1)+'deg)';
        var z=1000-Math.round(ad*4); if(c.z!==z){ b.style.zIndex=z; c.z=z; }
        var dm=Math.round(Math.min(.6,Math.abs(u)/U*.62)*16); if(c.d!==dm){ b.style.setProperty('--dim',(dm/16).toFixed(3)); c.d=dm; }
      }
      dot.style.transform='translateX('+(N>1?s/(N-1)*rw:rw/2).toFixed(2)+'px)';
      var a=Math.max(0,Math.min(N-1,Math.round(s))); if(a!==act) setActive(a);
    }
    function capHTML(it){ return '<h3>'+esc(it.t)+'</h3><p>'+esc(it.en||'')+'</p><hr><em>'+esc(it.code)+' — '+esc(it.kind)+'</em>'; }
    function setActive(a){
      var prev=act, it=items[a]; act=a;
      ix.textContent=String(a+1).padStart(2,'0')+' / '+String(N).padStart(2,'0');
      arL.disabled=a===0; arR.disabled=a===N-1;
      bks.forEach(function(b,i){ b.setAttribute('aria-selected',i===a?'true':'false'); });
      if(prev<0||RM||!capIn.animate){ capIn.innerHTML=capHTML(it); bigs[0].textContent=it.code.slice(0,2); bigs[1].textContent=it.code.slice(2); return; }
      var dir=a>prev?1:-1;
      capIn.getAnimations().forEach(function(x){x.cancel();});
      var out=capIn.animate([{transform:'translateY(0)'},{transform:'translateY('+(-dir*110)+'%)'}],{duration:260,easing:'cubic-bezier(.6,0,.8,.2)',fill:'forwards'});
      out.onfinish=function(){ if(!alive) return; capIn.innerHTML=capHTML(items[act]); out.cancel();
        capIn.animate([{transform:'translateY('+(dir*110)+'%)'},{transform:'translateY(0)'}],{duration:390,easing:'cubic-bezier(.2,.8,.2,1)'}); };
      if(items[prev].code!==it.code){ [0,1].forEach(function(k){ var e=bigs[k], tx=k?it.code.slice(2):it.code.slice(0,2);
        var o2=e.animate([{transform:'translateY(0)'},{transform:'translateY('+(k?100:-100)+'%)'}],{duration:320,easing:EIO,fill:'forwards'});
        o2.onfinish=function(){ e.textContent=tx; o2.cancel(); e.animate([{transform:'translateY('+(k?-100:100)+'%)'},{transform:'translateY(0)'}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'}); }; }); }
      if(opt.onChange) opt.onChange(a);
    }
    function tick(t){
      raf=0; if(!alive) return;
      var dt=Math.min(.05,(t-last)/1000||.016); last=t;
      var k=drag?30:6.4; s+=(T-s)*(1-Math.exp(-k*dt));
      if(Math.abs(T-s)<.0006&&!drag) s=T;
      draw();
      if(s!==T||drag) raf=requestAnimationFrame(tick);
    }
    function kick(){ if(RM){ s=T; draw(); return; } if(!raf){ last=performance.now(); raf=requestAnimationFrame(tick); } }
    function to(i){ T=Math.max(0,Math.min(N-1,i)); kick(); }

    function hit(x,y){ var best=-1,bd=1e9; for(var i=0;i<N;i++){ var b=bks[i]; if(b.style.display==='none') continue; var ad=Math.abs(i-s);
        for(var k=0;k<2;k++){ var f=b.children[k]; if(f.style.display==='none') continue; var r=f.getBoundingClientRect(); if(r.width>2&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom&&ad<bd){ bd=ad; best=i; } } } return best; }
    function down(e){ if(e.button) return; if(e.target.closest('.ar')) return;
      vel=0; drag={x:e.clientX,y:e.clientY,T:T,mv:0,id:e.pointerId,rl:!!e.target.closest('.rl'),bk:hit(e.clientX,e.clientY)};
      if(drag.rl){ var r=rl.getBoundingClientRect(); to(Math.round((e.clientX-r.left)/r.width*(N-1))); } }
    function move(e){ if(!drag||e.pointerId!==drag.id) return; var dx=e.clientX-drag.x, dy=e.clientY-drag.y;
      if(drag.rl){ var r=rl.getBoundingClientRect(); T=Math.max(0,Math.min(N-1,(e.clientX-r.left)/r.width*(N-1))); kick(); return; }
      if(!drag.mv){ if(Math.abs(dx)<6) return; if(Math.abs(dy)>Math.abs(dx)){ drag=null; return; } drag.mv=1; el.classList.add('drag'); try{el.setPointerCapture(e.pointerId);}catch(_){} }
      var nt=Math.max(-.35,Math.min(N-.65,drag.T-dx/(step+extra*.5))), now=performance.now(); if(drag.lt){ var v=(nt-T)/Math.max(1,now-drag.lt); vel=vel*.6+v*.4; } drag.lt=now; T=nt; kick(); }
    function up(e){ if(!drag) return; var d=drag; drag=null; el.classList.remove('drag');
      if(d.rl){ to(Math.round(T)); return; } if(d.mv){ var fl=(performance.now()-(d.lt||0)<80)?vel*220:0; vel=0; to(Math.round(T+Math.max(-3,Math.min(3,fl)))); return; }
      if(d.bk>=0){ var i=d.bk; if(i===Math.round(s)&&Math.abs(s-i)<.2) open(i); else to(i); } }
    function wheel(e){ if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)) return; e.preventDefault(); T=Math.max(0,Math.min(N-1,T+e.deltaX/(step*3))); kick(); clearTimeout(wheel.t); wheel.t=setTimeout(function(){to(Math.round(T));},140); }
    function key(e){ if(e.key==='ArrowLeft'){ to(Math.round(T)-1); e.preventDefault(); } else if(e.key==='ArrowRight'){ to(Math.round(T)+1); e.preventDefault(); }
      else if(e.key==='Enter'||e.key===' '){ open(Math.round(T)); e.preventDefault(); } else if(e.key==='Home'){to(0);e.preventDefault();} else if(e.key==='End'){to(N-1);e.preventDefault();} }
    function open(i){ if(opt.onOpen){ opt.onOpen(i,bks[i].lastChild.getBoundingClientRect()); } }

    el.addEventListener('pointerdown',down); el.addEventListener('pointermove',move); el.addEventListener('pointerup',up); el.addEventListener('pointercancel',up);
    el.addEventListener('wheel',wheel,{passive:false}); el.addEventListener('keydown',key);
    arL.addEventListener('click',function(){to(Math.round(T)-1);}); arR.addEventListener('click',function(){to(Math.round(T)+1);});
    var ro=new ResizeObserver(size); ro.observe(el); size();
    if(!RM&&opt.intro!==false){ s=Math.min(N-1,T+2.2); kick(); }
    return {to:to, index:function(){return Math.round(T);}, rect:function(){return bks[Math.round(s)].lastChild.getBoundingClientRect();},
      destroy:function(){ alive=false; cancelAnimationFrame(raf); ro.disconnect(); }};
  };

  /* แผ่นรายละเอียด: ขยายจากกรอบปกจนเต็มจอด้วย clip-path แล้วข้อความเลื่อนขึ้นจากหน้ากาก รูปซึมเข้ามาแบบหมึก */
  window.openSheet=function(html,rect,getRect){
    var sh=document.createElement('div'); sh.className='sheet'; sh.setAttribute('role','dialog'); sh.setAttribute('aria-modal','true'); sh.innerHTML=html;
    document.body.appendChild(sh);
    var vw=innerWidth, vh=innerHeight, closed=false;
    var ins=function(r){ return 'inset('+Math.max(0,r.top)+'px '+Math.max(0,vw-r.right)+'px '+Math.max(0,vh-r.bottom)+'px '+Math.max(0,r.left)+'px round 4px)'; };
    var lines=sh.querySelectorAll('.ln>*');
    if(!RM&&sh.animate){
      sh.animate([{clipPath:ins(rect)},{clipPath:'inset(0px 0px 0px 0px round 0px)'}],{duration:1050,easing:EIO});
      lines.forEach(function(l,i){ l.animate([{transform:'translateY(115%)'},{transform:'translateY(115%)',offset:.01},{transform:'translateY(0)'}],{duration:800,delay:420+i*70,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}); });
      var rule=sh.querySelector('.rule'); if(rule) rule.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:700,delay:700,easing:EIO,fill:'backwards'});
      var cs=sh.querySelectorAll('mask circle'), t0=performance.now()+480, D=1500;
      (function ink(t){ if(closed) return; var done=true;
        cs.forEach(function(c){ var p=Math.max(0,Math.min(1,(t-t0-(+c.dataset.d||0))/D)); if(p<1) done=false; var e=1-Math.pow(1-p,3); c.setAttribute('r',(e*(+c.dataset.r)).toFixed(1)); });
        if(!done) requestAnimationFrame(ink); else { var im=sh.querySelector('image'); if(im) im.removeAttribute('mask'); } })(performance.now());
    } else { var im=sh.querySelector('image'); if(im) im.removeAttribute('mask'); }
    function close(nav){ if(closed) return; closed=true; removeEventListener('keydown',onKey); removeEventListener('popstate',onPop);
      if(nav!==true&&history.state&&history.state.sheet) history.back();
      
      var r=getRect&&getRect();
      if(RM||!sh.animate||!r){ sh.remove(); return; }
      sh.scrollTop=0;
      sh.animate([{clipPath:'inset(0px 0px 0px 0px round 0px)'},{clipPath:ins(r)}],{duration:720,easing:EIO,fill:'forwards'}).onfinish=function(){sh.remove();}; }
    function onKey(e){ if(e.key==='Escape') close(); }
    function onPop(){ close(true); }
    addEventListener('keydown',onKey);
    try{ history.pushState({sheet:1},''); addEventListener('popstate',onPop); }catch(_){}
    sh.addEventListener('click',function(e){ if(e.target.closest('[data-close]')) close(); else if(e.target.closest('a[href]')){ closed=true; removeEventListener('keydown',onKey); removeEventListener('popstate',onPop);  setTimeout(function(){sh.remove();},60); } });
    var c=sh.querySelector('[data-close]'); if(c) c.focus({preventScroll:true});
    return {close:close};
  };
})();
