(()=>{
  const root=document.documentElement;
  const themes=['blue','red','purple','green','pink'];
  const valid=value=>themes.includes(value);
  const filename=(location.pathname.split('/').pop()||'').toLowerCase();
  const isSplash=filename==='index.html'||filename==='';
  if(isSplash){
    let last='';
    try{last=sessionStorage.getItem('sleepyhub-last-splash-theme')||''}catch(e){}
    const pool=themes.filter(theme=>theme!==last);
    const theme=pool[Math.floor(Math.random()*pool.length)]||themes[0];
    root.dataset.theme=theme;
    root.dataset.splashTheme=theme;
    try{sessionStorage.setItem('sleepyhub-last-splash-theme',theme)}catch(e){}
    return;
  }
  try{
    const localPreview=location.protocol==='file:';
    const query=localPreview?new URLSearchParams(location.search).get('theme'):'';
    const stored=localStorage.getItem('sleepyhub-theme')||'';
    const match=localPreview?/^sleepyhub-theme:(blue|red|purple|green|pink)$/.exec(window.name||''):null;
    const theme=valid(query)?query:(match?match[1]:(valid(stored)?stored:''));
    if(theme){
      root.dataset.theme=theme;
      try{localStorage.setItem('sleepyhub-theme',theme)}catch(e){}
      if(localPreview){try{window.name='sleepyhub-theme:'+theme}catch(e){}}
    }
    if(!localPreview&&new URLSearchParams(location.search).has('theme')&&history.replaceState){
      const url=new URL(location.href);
      url.searchParams.delete('theme');
      history.replaceState(null,'',url.pathname+(url.search?url.search:'')+url.hash);
    }
  }catch(e){}
})();
