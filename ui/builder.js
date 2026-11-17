/* PAYAPkuytok · หน้าต่างจัดชุดโจทย์ (ระดับ บท หัวข้อ) ใช้ร่วมกันใน Biochem และเคมีฟิสิกส์ แบบเดียวกับ Anatomy
   PKBuilder.open({eyebrow,title,chapters:[{id,n}],topics:[{id,ch,n}],ch:[ids],tp:[ids],lv,onSave(st),onStart({tps,lv,title,ch})}) */
(function(){
  var LVL=[{id:'mix',n:'ผสม',d:'สุ่มทุกระดับ'},{id:'easy',n:'ง่าย',d:'ความจำ ถามตรง'},{id:'mid',n:'ปานกลาง',d:'ความจำ และเชื่อมโยง'},{id:'hard',n:'ยาก',d:'วิเคราะห์'}];
  var X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>';
  var PLAY='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>';
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  var O=null, S=null;
  function close(){ var d=document.getElementById('pk-bd'); if(d) d.remove(); document.body.style.overflow=''; document.removeEventListener('keydown',key); }
  function key(e){ if(e.key==='Escape') close(); }
  function tops(){ return O.topics.filter(function(t){ return !S.ch.length||S.ch.indexOf(t.ch)>=0; }); }
  function chosen(){ var t=tops(); if(S.tp.length){ var f=t.filter(function(x){return S.tp.indexOf(x.id)>=0;}); if(f.length) t=f; } return t; }
  function lvName(id){ for(var i=0;i<LVL.length;i++) if(LVL[i].id===id) return LVL[i].n; return 'ผสม'; }
  function chip(on,attr,label){ return '<button type="button" class="bdc '+(on?'on':'')+'" '+attr+' aria-pressed="'+on+'">'+label+'</button>'; }
  function draw(){
    var box=document.querySelector('#pk-bd .bd-in'); if(!box) return;
    var body=box.querySelector('.bd-b'), keep=body?body.scrollTop:0, ts=tops(), ch=chosen();
    var one=S.ch.length===1?O.chapters.filter(function(c){return c.id===S.ch[0];})[0]:null;
    box.innerHTML='<header class="bd-h"><div><p class="eb">'+esc(one?'บทที่ '+one.id+' · '+(O.eyebrow||''):'ชุดโจทย์ของฉัน')+'</p><h2 id="bd-t">'+esc(one?one.n:'จัดชุดโจทย์')+'</h2><p class="sb">โจทย์สุ่มใหม่ทุกข้อ ทำต่อเนื่องไม่รู้จบ ไม่เลือกเลยจะนับทั้งหมด</p></div><button type="button" class="ibtn" data-bx aria-label="ปิด">'+X+'</button></header>'+
      '<div class="bd-b"><section><h3>ระดับ</h3><div class="bd-lv">'+LVL.map(function(l){return '<button type="button" class="'+(S.lv===l.id?'on':'')+'" data-blv="'+l.id+'" aria-pressed="'+(S.lv===l.id)+'"><b>'+l.n+'</b><small>'+l.d+'</small></button>';}).join('')+'</div></section>'+
      '<section><h3>บท</h3><div class="bd-cs">'+chip(!S.ch.length,'data-bch="all"','ทุกบท')+O.chapters.map(function(c){return chip(S.ch.indexOf(c.id)>=0,'data-bch="'+c.id+'"','<b class="num">'+c.id+'</b> '+esc(c.n));}).join('')+'</div></section>'+
      '<section><h3>หัวข้อ <small>'+(S.tp.length?S.tp.length+' จาก '+ts.length:'ทั้งหมด '+ts.length)+'</small></h3><div class="bd-cs">'+chip(!S.tp.length,'data-btp="all"','ทุกหัวข้อ')+ts.map(function(t){return chip(S.tp.indexOf(t.id)>=0,'data-btp="'+t.id+'"',(S.ch.length===1?'':'<b class="num">'+t.ch+'</b> ')+esc(t.n));}).join('')+'</div></section></div>'+
      '<footer class="bd-f"><span class="num">'+ch.length+' หัวข้อ · ระดับ'+lvName(S.lv)+'</span><button type="button" class="btn lg" data-bgo '+(ch.length?'':'disabled')+'>'+PLAY+'เริ่มทำ</button></footer>';
    box.querySelector('.bd-b').scrollTop=keep;
  }
  function tog(a,v){ var i=a.indexOf(v); if(i>=0) a.splice(i,1); else a.push(v); }
  function open(o){
    close(); O=o; S={ch:(o.ch||[]).slice(),tp:(o.tp||[]).slice(),lv:o.lv||'mix'};
    var d=document.createElement('div'); d.id='pk-bd'; d.innerHTML='<div class="bd-in" role="dialog" aria-modal="true" aria-labelledby="bd-t"></div>';
    document.body.appendChild(d); document.body.style.overflow='hidden'; document.addEventListener('keydown',key);
    d.addEventListener('click',function(e){
      if(e.target===d||e.target.closest('[data-bx]')){ close(); return; }
      var b=e.target.closest('button'); if(!b) return;
      if(b.dataset.blv){ S.lv=b.dataset.blv; }
      else if(b.dataset.bch){ var v=b.dataset.bch; if(v==='all') S.ch=[]; else tog(S.ch,isNaN(+v)?v:+v);
        var ok=tops().map(function(t){return t.id;}); S.tp=S.tp.filter(function(x){return ok.indexOf(x)>=0;}); }
      else if(b.dataset.btp){ var w=b.dataset.btp; if(w==='all') S.tp=[]; else tog(S.tp,w); }
      else if(b.hasAttribute('data-bgo')){ var c=chosen(); if(!c.length) return;
        var one=S.ch.length===1?O.chapters.filter(function(x){return x.id===S.ch[0];})[0]:null;
        var title=one&&!S.tp.length?'บทที่ '+one.id+' '+one.n:(c.length===1?c[0].n:'ชุดที่เลือก · '+c.length+' หัวข้อ');
        if(O.onSave) O.onSave(S); close(); O.onStart({tps:c.map(function(x){return x.id;}),lv:S.lv,title:title+' · ระดับ'+lvName(S.lv),ch:one?one.id:null}); return; }
      else return;
      if(O.onSave) O.onSave(S); draw();
    });
    draw(); var x=d.querySelector('[data-bx]'); if(x) x.focus();
  }
  window.PKBuilder={open:open,close:close,levels:LVL};
})();
