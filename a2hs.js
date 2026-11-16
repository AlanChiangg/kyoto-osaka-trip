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
    '.a2hs-pill{position:fixed;left:14px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:40;display:flex;align-items:center;gap:6px;'+
      'border:0;border-radius:999px;background:#1F2A33;color:#fff;font:600 14px -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif;'+
      'padding:11px 16px;box-shadow:0 6px 18px rgba(0,0,0,.28);cursor:pointer;-webkit-tap-highlight-color:transparent}'+
    'body.locked .a2hs-pill{display:none}'+
    '.a2hs-bar{position:fixed;left:0;right:0;bottom:0;z-index:80;background:#1F2A33;color:#fff;padding:14px 16px calc(14px + env(safe-area-inset-bottom));'+
      'font:14.5px/1.55 -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif;box-shadow:0 -8px 24px rgba(0,0,0,.25)}'+
    '.a2hs-bar b{display:block;font-size:16px;margin-bottom:4px}'+
    '.a2hs-bar .a2hs-row{display:flex;gap:8px;margin-top:10px}'+
    '.a2hs-btn{appearance:none;flex:1;border:1.5px solid rgba(255,255,255,.35);background:transparent;color:inherit;border-radius:10px;min-height:44px;font-family:inherit;font-size:14.5px;font-weight:600;cursor:pointer}'+
    '.a2hs-btn.main{background:#fff;color:#1F2A33;border-color:#fff}'+
    '.a2hs-ov{position:fixed;inset:0;z-index:90;background:rgba(15,20,24,.6);display:flex;align-items:flex-end;justify-content:center}'+
    '.a2hs-card{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:#fff;color:#1F2A33;border-radius:18px 18px 0 0;'+
      'padding:20px 18px calc(16px + env(safe-area-inset-bottom));font:15px/1.6 -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif}'+
    '.a2hs-card h3{margin:0 0 4px;font-size:20px}'+
    '.a2hs-card .a2hs-sub{color:#6F7880;font-size:13px;margin-bottom:14px}'+
    '.a2hs-step{display:grid;grid-template-columns:30px 1fr;gap:10px;padding:11px 0;border-top:1px solid #ECE6DC}'+
    '.a2hs-step i{font-style:normal;width:28px;height:28px;border-radius:50%;background:#1F2A33;color:#fff;display:grid;place-items:center;font-weight:700;font-size:14px}'+
    '.a2hs-step b{font-weight:700}'+
    '.a2hs-step small{display:block;color:#6F7880;font-size:12.5px}'+
    '.a2hs-ic{display:inline-flex;vertical-align:-6px;width:26px;height:26px;border:1.5px solid #C8CDD2;border-radius:7px;align-items:center;justify-content:center;margin:0 2px;color:#0A7AFF}'+
    '.a2hs-ic svg{width:16px;height:16px}'+
    '.a2hs-card .a2hs-row{display:flex;gap:8px;margin-top:14px}'+
    '.a2hs-card .a2hs-btn{border-color:#DED7CB;color:#1F2A33}'+
    '.a2hs-card .a2hs-btn.main{background:#1F2A33;color:#fff;border-color:#1F2A33}'+
    '@media (min-width:640px){.a2hs-ov{align-items:center}.a2hs-card{border-radius:14px}}';
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

  function guide(){
    if(document.querySelector('.a2hs-ov')) return;
    var ov=el('<div class="a2hs-ov" role="dialog" aria-modal="true"><div class="a2hs-card">'+
      '<h3>加到主畫面，像 App 一樣用</h3><div class="a2hs-sub">iPhone 不允許網頁自己加入，跟著做三步就好</div>'+
      '<div class="a2hs-step"><i>1</i><div>點 Safari 下方的<b>「分享」</b><span class="a2hs-ic">'+SHARE+'</span><small>沒看到的話，先點下方的「⋯」</small></div></div>'+
      '<div class="a2hs-step"><i>2</i><div>選<b>「加入主畫面」</b><span class="a2hs-ic">'+PLUS+'</span><small>沒看到就往下滑，或點「檢視較多」</small></div></div>'+
      '<div class="a2hs-step"><i>3</i><div>名字可以改成<b>「'+esc(appName)+'」</b>，<b>「打開為網頁 App」</b>保持開啟，按右上角<b>「加入」</b></div></div>'+
      '<div class="a2hs-step"><i>4</i><div>之後都從主畫面的圖示打開<small>沒網路也能開；勾選和記錄都存在那個圖示裡，跟 Safari 分開</small></div></div>'+
      '<div class="a2hs-row"><button class="a2hs-btn" data-a2hs-never>不再顯示按鈕</button><button class="a2hs-btn main" data-a2hs-close>知道了</button></div>'+
      '</div></div>');
    ov.addEventListener('click',function(e){
      if(e.target===ov||e.target.closest('[data-a2hs-close]')){ ov.remove(); return }
      if(e.target.closest('[data-a2hs-never]')){ try{ localStorage.setItem(HIDE,'1') }catch(_){} ov.remove(); var p=document.querySelector('.a2hs-pill'); if(p) p.remove() }
    });
    document.body.appendChild(ov);
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
