/* PAYAPkuytok: หน้าใส่รหัสเข้าใช้งานครั้งแรก (เก็บเฉพาะค่าแฮช ไม่เก็บรหัสจริง) */
(function(){
  var QR=(document.currentScript&&document.currentScript.src||'ui/gate.js').replace(/gate\.js.*$/,'img/contact-qr.jpg');
  var KEY='payap.auth', HASH='ece9c2bac263eb80e1de8aa2e5f5dc8d6999d61d978ed4de61cb5d10dace5380', SALT='payapkuytok|';
  function sha256(str){
    var K=[],H=[],i,j,n=2,c=0,isP;
    function frac(x){return ((x-Math.floor(x))*4294967296)|0;}
    while(c<64){ isP=true; for(i=2;i*i<=n;i++) if(n%i===0){isP=false;break;}
      if(isP){ if(c<8) H[c]=frac(Math.pow(n,1/2)); K[c]=frac(Math.pow(n,1/3)); c++; } n++; }
    var b=unescape(encodeURIComponent(str)), l=b.length, w=[], W=[];
    for(i=0;i<l;i++) w[i>>2]|=b.charCodeAt(i)<<(24-(i%4)*8);
    w[l>>2]|=0x80<<(24-(l%4)*8); var N=((l+8>>6)+1)*16; for(i=0;i<N;i++) w[i]=w[i]|0; w[N-1]=l*8;
    function r(x,k){return (x>>>k)|(x<<(32-k));}
    for(j=0;j<N;j+=16){ var a=H[0],bb=H[1],cc=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for(i=0;i<64;i++){ if(i<16) W[i]=w[j+i]; else { var x=W[i-15],y=W[i-2]; W[i]=(W[i-16]+(r(x,7)^r(x,18)^(x>>>3))+W[i-7]+(r(y,17)^r(y,19)^(y>>>10)))|0; }
        var t1=(h+(r(e,6)^r(e,11)^r(e,25))+((e&f)^(~e&g))+K[i]+W[i])|0, t2=((r(a,2)^r(a,13)^r(a,22))+((a&bb)^(a&cc)^(bb&cc)))|0;
        h=g;g=f;f=e;e=(d+t1)|0;d=cc;cc=bb;bb=a;a=(t1+t2)|0; }
      H[0]=(H[0]+a)|0;H[1]=(H[1]+bb)|0;H[2]=(H[2]+cc)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0; }
    var o=''; for(i=0;i<8;i++) o+=('00000000'+(H[i]>>>0).toString(16)).slice(-8); return o;
  }
  if(typeof module!=='undefined'&&module.exports){ module.exports=sha256; return; }
  var ok=false; try{ ok=localStorage.getItem(KEY)===HASH; }catch(e){}
  if(ok) return;
  var de=document.documentElement; de.classList.add('gate-on');
  var st=document.createElement('style');
  st.textContent='html.gate-on body>*:not(#gate){display:none!important}html.gate-on,html.gate-on body{overflow:hidden;background:#F8FAFC}'
   +'#gate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:linear-gradient(160deg,#F0F9FF,#F8FAFC 55%,#fff);font-family:Prompt,Inter,system-ui,sans-serif;color:#0F172A}'
   +'#gate form{width:100%;max-width:380px;background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:30px 24px 24px;box-shadow:0 18px 50px -20px rgba(2,132,199,.35);text-align:center}'
   +'#gate .g-ic{width:56px;height:56px;margin:0 auto 14px;border-radius:16px;background:#F0F9FF;color:#0284C7;display:grid;place-items:center}'
   +'#gate h1{font-size:1.35rem;margin:0 0 4px;font-weight:700;letter-spacing:-.01em}#gate h1 i{font-style:normal;color:#0284C7}'
   +'#gate p{margin:0 0 20px;color:#475569;font-size:.92rem;line-height:1.5}'
   +'#gate label{display:block;text-align:left;font-size:.82rem;font-weight:600;color:#475569;margin:0 0 6px}'
   +'#gate .g-in{position:relative}#gate input{width:100%;box-sizing:border-box;height:50px;border:1px solid #E2E8F0;border-radius:12px;padding:0 48px 0 14px;font:inherit;font-size:16px;color:#0F172A;background:#F8FAFC;outline:none}'
   +'#gate input:focus{border-color:#38BDF8;background:#fff;box-shadow:0 0 0 4px rgba(56,189,248,.18)}#gate input.bad{border-color:#EF4444;background:#FEF2F2}'
   +'#gate .g-eye{position:absolute;right:4px;top:4px;width:42px;height:42px;border:0;background:none;color:#94A3B8;border-radius:10px;cursor:pointer;display:grid;place-items:center}'
   +'#gate .g-err{min-height:20px;margin:6px 0 8px;text-align:left;color:#EF4444;font-size:.82rem}'
   +'#gate .g-go{width:100%;height:50px;border:0;border-radius:12px;background:#0284C7;color:#fff;font:inherit;font-weight:600;font-size:1rem;cursor:pointer}#gate .g-go:active{transform:scale(.99)}'
   +'#gate small{display:block;margin-top:14px;color:#94A3B8;font-size:.78rem}'
   +'#gate{overflow:auto}#gate .g-qr{display:flex;align-items:center;gap:14px;margin-top:18px;padding-top:18px;border-top:1px solid #E2E8F0;text-align:left}#gate .g-qr img{width:132px;height:132px;border-radius:12px;border:1px solid #E2E8F0;flex:none}#gate .g-qr b{display:block;font-size:.9rem;margin-bottom:2px}#gate .g-qr span{color:#475569;font-size:.85rem;line-height:1.5}'
   +'@keyframes gshake{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}#gate form.shake{animation:gshake .35s}';
  (document.head||de).appendChild(st);
  function build(){
    if(document.getElementById('gate')) return;
    var g=document.createElement('div'); g.id='gate'; g.setAttribute('role','dialog'); g.setAttribute('aria-modal','true'); g.setAttribute('aria-label','เข้าสู่ระบบ');
    g.innerHTML='<form autocomplete="on" novalidate><div class="g-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>'
     +'<h1>PAYAP<i>kuytok</i></h1><p>ใส่รหัสเข้าใช้งานครั้งแรก ครั้งต่อไปเข้าได้เลยไม่ต้องใส่อีก</p>'
     +'<label for="gate-pw">รหัสเข้าใช้งาน</label><div class="g-in"><input id="gate-pw" type="password" name="password" autocomplete="current-password" autocapitalize="off" autocorrect="off" spellcheck="false" aria-describedby="gate-err">'
     +'<button type="button" class="g-eye" aria-label="แสดงหรือซ่อนรหัส"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg></button></div>'
     +'<div class="g-err" id="gate-err" role="alert"></div><button class="g-go" type="submit">เข้าสู่ระบบ</button><small>เครื่องนี้จะจำไว้ให้หลังเข้าครั้งแรก</small><div class="g-qr"><img src="'+QR+'" alt="คิวอาร์โค้ดติดต่อขอรหัส" width="132" height="132"><div><b>หมายเหตุ</b><span>ใครอยากได้รหัส ติดต่อได้โดยสแกนคิวอาร์โค้ดนี้</span></div></div></form>';
    document.body.appendChild(g);
    var f=g.querySelector('form'), inp=g.querySelector('input'), err=g.querySelector('.g-err');
    g.querySelector('.g-eye').onclick=function(){ inp.type=inp.type==='password'?'text':'password'; inp.focus(); };
    inp.oninput=function(){ inp.classList.remove('bad'); err.textContent=''; };
    f.onsubmit=function(ev){ ev.preventDefault(); var v=inp.value.trim();
      if(!v){ err.textContent='กรุณาใส่รหัส'; inp.focus(); return; }
      if(sha256(SALT+v)===HASH){ try{ localStorage.setItem(KEY,HASH); }catch(e){} g.remove(); st.remove(); de.classList.remove('gate-on'); window.dispatchEvent(new Event('resize')); }
      else { err.textContent='รหัสไม่ถูกต้อง ลองอีกครั้ง'; inp.classList.add('bad'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); inp.select(); }
    };
    setTimeout(function(){ try{ inp.focus(); }catch(e){} },50);
  }
  if(document.body) build(); else document.addEventListener('DOMContentLoaded',build);
})();
