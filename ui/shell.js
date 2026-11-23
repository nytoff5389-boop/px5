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

  /* ดาวน์โหลด PDF ย้ายไปอยู่ใน ui/pdfdl.js (ใช้ร่วมกันทุกวิชา) */

})();
