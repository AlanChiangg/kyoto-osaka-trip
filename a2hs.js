/* 加入主畫面小幫手（四個網站共用同一份，改這裡要同步到每個 repo）
   - 在 LINE 裡打開：自動加上 ?openExternalBrowser=1 改用 Safari；跳不過去就顯示教學和「複製網址」
   - iPhone Safari：左下角「加入主畫面」，按下去是圖解步驟（iPhone 不允許網頁自己加入主畫面）
   - Android Chrome：真正的一鍵安裝
   - 已經從主畫面打開：什麼都不顯示
   測試用：網址加 ?a2hs-test=line | ios | android 可模擬不同環境 */
(function(){
  var ua=navigator.userAgent||'';
  var url=new URL(location.href);
  var test=url.searchParams.get('a2hs-test');
  var isIOS=test==='ios'||test==='line'||(!test && (/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)));
  var inLine=test==='line'||(!test && /\bLine\//i.test(ua));
  var inApp=inLine||(!test && /FBAN|FBAV|Instagram|Messenger|MicroMessenger/i.test(ua));
  var standalone=navigator.standalone===true||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches);
  var P='openExternalBrowser';
  var HIDE='a2hs:hide:'+location.pathname;
  var appName=(document.querySelector('meta[name="apple-mobile-web-app-title"]')||{}).content||document.title;

  if(standalone) return;

  /* LINE：第一次進來先試著交給 Safari 開 */
  if(inLine && url.searchParams.get(P)!=='1'){
    url.searchParams.set(P,'1');
    location.replace(url.toString());
    return;
  }
  /* 已經在 Safari 了，把參數拿掉，加入主畫面時網址比較乾淨 */
  if(!inApp && url.searchParams.has(P)){
    url.searchParams.delete(P);
    history.replaceState(history.state,'',url.pathname+url.search+url.hash);
  }
  var cleanURL=(function(){ var u=new URL(location.href); u.searchParams.delete(P); u.searchParams.delete('a2hs-test'); return u.toString() })();

  var css=
    /* 只會在 Safari 裡出現，所以讓開 Safari 下方的工具列 */
    '.a2hs-pill{position:fixed;left:14px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:40;display:flex;align-items:center;gap:6px;'+
      'border:0;border-radius:999px;background:#1F2A33;color:#fff;font:600 14px -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif;'+
      'padding:11px 16px;box-shadow:0 6px 18px rgba(0,0,0,.28);cursor:pointer;-webkit-tap-highlight-color:transparent}'+
    'body.locked .a2hs-pill{display:none}'+
    '.a2hs-bar{position:fixed;left:0;right:0;bottom:0;z-index:80;background:#1F2A33;color:#fff;padding:14px 16px calc(14px + env(safe-area-inset-bottom));'+
      'font:14.5px/1.55 -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif;box-shadow:0 -8px 24px rgba(0,0,0,.25)}'+
    '.a2hs-bar b{display:block;font-size:16px;margin-bottom:4px}'+
    '.a2hs-bar .a2hs-row{display:flex;gap:8px;margin-top:10px}'+
    '.a2hs-btn{appearance:none;flex:1;border:1.5px solid rgba(255,255,255,.35);background:transparent;color:inherit;border-radius:10px;min-height:44px;font-family:inherit;font-size:14.5px;font-weight:600;cursor:pointer}'+
    '.a2hs-btn.main{background:#fff;color:#1F2A33;border-color:#fff}'+
    /* 教學卡片：置中、上下讓開 Safari 的網址列和工具列；一步一頁，按鈕在卡片裡 */
    '.a2hs-ov{position:fixed;left:0;right:0;top:0;bottom:0;z-index:90;background:rgba(15,20,24,.6);display:flex;align-items:center;justify-content:center;'+
      'padding:calc(env(safe-area-inset-top) + 64px) 12px calc(env(safe-area-inset-bottom) + 92px);box-sizing:border-box}'+
    '.a2hs-card{width:100%;max-width:460px;max-height:100%;display:flex;flex-direction:column;overflow:hidden;background:#fff;color:#1F2A33;'+
      'border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.35);font:15px/1.6 -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif;touch-action:pan-y}'+
    '.a2hs-hd{padding:18px 18px 6px;flex:none}'+
    '.a2hs-hd h3{margin:0;font-size:18px}'+
    '.a2hs-hd .a2hs-sub{color:#6F7880;font-size:12.5px;margin-top:2px}'+
    '.a2hs-dots{display:flex;gap:5px;margin-top:10px}'+
    '.a2hs-dots span{flex:1;height:4px;border-radius:2px;background:#E3DDD3}'+
    '.a2hs-dots span.on{background:#1F2A33}'+
    '.a2hs-bd{flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:8px 18px 12px}'+
    '.a2hs-n{font-size:12px;font-weight:700;letter-spacing:.08em;color:#6F7880}'+
    '.a2hs-tx{font-size:17.5px;line-height:1.55;margin-top:2px}'+
    '.a2hs-tx b{font-weight:700}'+
    '.a2hs-bd small{display:block;color:#6F7880;font-size:13px;margin-top:4px}'+
    '.a2hs-bd img{display:block;max-width:100%;max-height:30vh;max-height:30svh;width:auto;height:auto;margin:12px auto 0;border-radius:12px;border:1px solid #E3DDD3;background:#2a2a2a}'+
    '.a2hs-done{font-size:44px;text-align:center;margin:10px 0 0}'+
    '.a2hs-never{appearance:none;display:block;border:0;background:none;color:#6F7880;font:inherit;font-size:13px;text-decoration:underline;padding:10px 0 0;cursor:pointer}'+
    '.a2hs-ft{flex:none;display:flex;gap:8px;padding:12px 14px 14px;border-top:1px solid #ECE6DC;background:#fff}'+
    '.a2hs-ft .a2hs-btn{border-color:#DED7CB;color:#1F2A33;min-height:48px}'+
    '.a2hs-ft .a2hs-btn.main{flex:2;background:#1F2A33;color:#fff;border-color:#1F2A33}'+
    '.a2hs-ic{display:inline-flex;vertical-align:-6px;width:26px;height:26px;border:1.5px solid #C8CDD2;border-radius:7px;align-items:center;justify-content:center;margin:0 2px;color:#0A7AFF}'+
    '.a2hs-ic svg{width:16px;height:16px}'+
    'html.a2hs-lock,html.a2hs-lock body{overflow:hidden}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  var SHARE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5"/><path d="M8 10H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2"/></svg>';
  var PLUS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/></svg>';
  var esc=function(s){ return String(s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] }) };

  function el(html){ var d=document.createElement('div'); d.innerHTML=html; return d.firstChild }
  function copy(text,btn){
    var done=function(){ btn.textContent='已複製，貼到 Safari 開'; };
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done,fallback) } else fallback();
    function fallback(){
      var ta=document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy') }catch(e){} ta.remove(); done();
    }
  }

  /* 截圖是實機畫面（紅圈是要按的地方），四個網站共用；一步一頁，不用上下滑 */
  var STEPS=[
    {t:'點下方中間的<b>「分享」</b><span class="a2hs-ic">'+SHARE+'</span>',h:'看不到下方工具列時，往上滑一下畫面就會出現；新版 Safari 也可能要先點「⋯」',img:'a2hs-1.webp',alt:'Safari 下方工具列，中間的分享按鈕被紅圈圈起來'},
    {t:'點<b>「檢視較多」</b>',h:'在分享選單第二排的最右邊',img:'a2hs-2.webp',alt:'分享選單，第二排最右邊的「檢視較多」被紅圈圈起來'},
    {t:'點<b>「加入主畫面」</b><span class="a2hs-ic">'+PLUS+'</span>',h:'',img:'a2hs-3.webp',alt:'展開的清單，「加入主畫面」被紅圈圈起來'},
    {t:'名字打<b>「'+esc(appName)+'」</b>，<b>「打開為網頁 App」</b>保持開啟，按右上角<b>「加入」</b>',h:'',img:'a2hs-4.webp',alt:'加入主畫面畫面，紅圈處填名字，右上角是「加入」'},
    {t:'完成！之後都從主畫面的圖示打開',h:'沒網路也能開；勾選和記錄都存在那個圖示裡，跟 Safari 分開',done:true}
  ];
  function guide(){
    if(document.querySelector('.a2hs-ov')) return;
    STEPS.forEach(function(s){ if(s.img){ var im=new Image(); im.src=s.img } });
    var i=0;
    var ov=el('<div class="a2hs-ov" role="dialog" aria-modal="true" aria-label="加入主畫面教學"><div class="a2hs-card">'+
      '<div class="a2hs-hd"><h3>加到主畫面，像 App 一樣用</h3><div class="a2hs-sub">紅圈是要按的地方・畫面以胡志明行程為例</div>'+
      '<div class="a2hs-dots">'+STEPS.map(function(){ return '<span></span>' }).join('')+'</div></div>'+
      '<div class="a2hs-bd"></div><div class="a2hs-ft"></div></div></div>');
    var bd=ov.querySelector('.a2hs-bd'), ft=ov.querySelector('.a2hs-ft'), dots=ov.querySelectorAll('.a2hs-dots span');
    function show(n){
      i=Math.max(0,Math.min(STEPS.length-1,n));
      var s=STEPS[i], last=i===STEPS.length-1;
      bd.innerHTML='<div class="a2hs-n">第 '+(i+1)+' 步，共 '+STEPS.length+' 步</div><div class="a2hs-tx">'+s.t+'</div>'+(s.h?'<small>'+s.h+'</small>':'')+
        (s.img?'<img src="'+s.img+'" alt="'+esc(s.alt)+'">':'')+(s.done?'<div class="a2hs-done">🎉</div><button class="a2hs-never" data-a2hs-never>不再顯示「加入主畫面」按鈕</button>':'');
      bd.scrollTop=0;
      ft.innerHTML=(i>0?'<button class="a2hs-btn" data-a2hs-prev>‹ 上一步</button>':'<button class="a2hs-btn" data-a2hs-close>關閉</button>')+
        (last?'<button class="a2hs-btn main" data-a2hs-close>完成</button>':'<button class="a2hs-btn main" data-a2hs-next>下一步 ›</button>');
      for(var k=0;k<dots.length;k++) dots[k].className=k<=i?'on':'';
    }
    /* 跟著實際看得到的畫面（網址列展開／收起時高度會變） */
    var vv=window.visualViewport;
    function fit(){ if(!vv) return; ov.style.top=vv.offsetTop+'px'; ov.style.height=vv.height+'px'; ov.style.bottom='auto' }
    if(vv){ vv.addEventListener('resize',fit); vv.addEventListener('scroll',fit) }
    function close(){
      ov.remove(); document.documentElement.classList.remove('a2hs-lock'); document.removeEventListener('keydown',key);
      if(vv){ vv.removeEventListener('resize',fit); vv.removeEventListener('scroll',fit) }
    }
    function key(e){ if(e.key==='Escape') close(); if(e.key==='ArrowRight') show(i+1); if(e.key==='ArrowLeft') show(i-1) }
    ov.addEventListener('click',function(e){
      if(e.target===ov||e.target.closest('[data-a2hs-close]')){ close(); return }
      if(e.target.closest('[data-a2hs-next]')){ show(i+1); return }
      if(e.target.closest('[data-a2hs-prev]')){ show(i-1); return }
      if(e.target.closest('[data-a2hs-never]')){ try{ localStorage.setItem(HIDE,'1') }catch(_){} close(); var p=document.querySelector('.a2hs-pill'); if(p) p.remove() }
    });
    /* 左右滑也能換頁 */
    var x0=null,y0=0;
    ov.addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; y0=e.touches[0].clientY },{passive:true});
    ov.addEventListener('touchend',function(e){
      if(x0===null) return;
      var dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; x0=null;
      if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5) show(i+(dx<0?1:-1));
    },{passive:true});
    document.addEventListener('keydown',key);
    document.documentElement.classList.add('a2hs-lock');
    document.body.appendChild(ov);
    fit(); show(0);
  }
  window.A2HS={open:guide};
  document.addEventListener('click',function(e){ if(e.target.closest&&e.target.closest('[data-a2hs-open]')) guide() });

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn) }

  ready(function(){
    /* 在 LINE、Facebook 等 App 裡面：不能加入主畫面，教他換 Safari */
    if(inApp){
      var where=inLine?'LINE':'這個 App';
      var bar=el('<div class="a2hs-bar" role="status"><b>📱 請改用 Safari 打開</b>在'+where+'裡面沒辦法加入主畫面，也不能離線使用。'+
        (inLine?'點右下角<b style="display:inline;font-size:inherit">「⋮」</b>→<b style="display:inline;font-size:inherit">「在瀏覽器中開啟」</b>。':'點右上角選單，選「用瀏覽器開啟」。')+
        '<div class="a2hs-row"><button class="a2hs-btn" data-a2hs-copy>複製網址</button><button class="a2hs-btn main" data-a2hs-later>先這樣看</button></div></div>');
      bar.addEventListener('click',function(e){
        if(e.target.closest('[data-a2hs-copy]')) copy(cleanURL,e.target.closest('[data-a2hs-copy]'));
        if(e.target.closest('[data-a2hs-later]')) bar.remove();
      });
      document.body.appendChild(bar);
      return;
    }
    var hidden=false; try{ hidden=localStorage.getItem(HIDE)==='1' }catch(e){}
    /* iPhone Safari：顯示教學按鈕 */
    if(isIOS && !hidden){
      var pill=el('<button class="a2hs-pill" aria-label="加入主畫面教學">📲 加入主畫面</button>');
      pill.addEventListener('click',guide);
      document.body.appendChild(pill);
    }
  });

  /* Android Chrome：可以真的一鍵安裝 */
  var deferred=null;
  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault(); deferred=e;
    if(document.querySelector('.a2hs-pill')) return;
    ready(function(){
      var pill=el('<button class="a2hs-pill">📲 安裝到主畫面</button>');
      pill.addEventListener('click',function(){
        if(!deferred) return;
        deferred.prompt();
        deferred.userChoice.then(function(){ deferred=null; pill.remove() });
      });
      document.body.appendChild(pill);
    });
  });
  window.addEventListener('appinstalled',function(){ var p=document.querySelector('.a2hs-pill'); if(p) p.remove() });
})();
