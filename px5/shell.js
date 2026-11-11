/* PX5 · ปุ่มกลับหน้าเลือกแอพ ใส่ในแถบบนและแถบข้างของทุกแอพ */
(function(){
  var ICO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>';
  function put(){
    var t=document.querySelector('.top-in');
    if(t&&!t.querySelector('.px5-home')){var a=document.createElement('a');a.className='px5-home';a.href='../';a.setAttribute('aria-label','กลับหน้าเลือกแอพ PX5');a.innerHTML=ICO+'<img src="../px5/img/px5-logo.png" alt="PX5">';t.insertBefore(a,t.firstChild);}
    var s=document.querySelector('.side-in');
    if(s&&!s.querySelector('.px5-side')){var b=document.createElement('a');b.className='px5-side';b.href='../';b.innerHTML=ICO+'<img src="../px5/img/px5-logo.png" alt="PX5"><span>เลือกแอพ</span>';s.insertBefore(b,s.firstChild);}
  }
  put(); new MutationObserver(put).observe(document.body,{childList:true,subtree:true});
})();
