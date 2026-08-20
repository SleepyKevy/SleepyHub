const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu-btn');
if(menu&&nav){
  const setMenuOpen=open=>{
    nav.classList.toggle('open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close menu':'Open menu');
  };
  setMenuOpen(false);
  menu.addEventListener('click',()=>setMenuOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('.navlinks a').forEach(link=>link.addEventListener('click',()=>setMenuOpen(false)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){setMenuOpen(false);menu.focus();}});
  window.addEventListener('resize',()=>{if(window.innerWidth>760&&nav.classList.contains('open'))setMenuOpen(false);});
}


// SleepyHub enter screen
(()=>{
  const screen=document.getElementById('sleepyEnterScreen');
  const enter=document.getElementById('enterSleepyHub');
  if(!screen||!enter)return;
  const enterTarget=enter.dataset.target||'home.html';
  const raccoonWrap=screen.querySelector('.enter-raccoon-wrap');
  const shell=screen.querySelector('.enter-shell');
  const revealNodes=screen.querySelectorAll('.enter-reveal');
  const splashLogo=screen.querySelector('[data-theme-logo]');
  const splashThemes = {
  blue: 'assets/images/themes/theme-blue.webp',
  red: 'assets/images/themes/theme-red.webp',
  purple: 'assets/images/themes/theme-purple.webp',
  green: 'assets/images/themes/theme-green.webp',
  pink: 'assets/images/themes/theme-pink.webp'
};

  const syncLogo=()=>{
    const theme=splashThemes[document.documentElement.dataset.theme]?document.documentElement.dataset.theme:'blue';
    document.documentElement.dataset.theme=theme;
    document.documentElement.dataset.splashTheme=theme;
    if(splashLogo&&splashLogo.getAttribute('src')!==splashThemes[theme])splashLogo.setAttribute('src',splashThemes[theme]);
  };

  const randomizeSplashTheme=()=>{
    const names=Object.keys(splashThemes);
    const current=document.documentElement.dataset.theme;
    const pool=names.filter(theme=>theme!==current);
    const theme=pool[Math.floor(Math.random()*pool.length)]||names[0];
    document.documentElement.dataset.theme=theme;
    document.documentElement.dataset.splashTheme=theme;
    if(splashLogo)splashLogo.setAttribute('src',splashThemes[theme]);
    try{sessionStorage.setItem('sleepyhub-last-splash-theme',theme)}catch(e){}
  };

  const prefersReducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let leaveTimer=null;
  let floatFrame=null;
  let floatStart=0;
  let pointerX=0.5;
  let pointerY=0.42;
  let pointerTargetX=0.5;
  let pointerTargetY=0.42;
  let parallaxFrame=null;


  const setButtonHover=(active)=>screen.classList.toggle('button-hover',!!active);

  const onKeyDown=(event)=>{
    if(screen.hidden)return;
    if(event.key==='Enter'){
      event.preventDefault();
      hide(true);
    }
  };


  const resetReveal=()=>{
    revealNodes.forEach(node=>{
      node.style.animation='none';
      void node.offsetHeight;
      node.style.animation='';
    });
  };

  const setPointer=(x,y)=>{
    pointerTargetX=Math.max(0,Math.min(1,x));
    pointerTargetY=Math.max(0,Math.min(1,y));
  };

  const stopParallax=()=>{
    if(parallaxFrame){cancelAnimationFrame(parallaxFrame);parallaxFrame=null;}
    pointerX=0.5; pointerY=0.42; pointerTargetX=0.5; pointerTargetY=0.42;
    if(shell)shell.style.transform='translate3d(0,0,0)';
  };

  const animateParallax=()=>{
    pointerX += (pointerTargetX-pointerX)*0.085;
    pointerY += (pointerTargetY-pointerY)*0.085;
    if(shell && !prefersReducedMotion){
      const offsetX=(pointerX-0.5)*10;
      const offsetY=(pointerY-0.42)*10;
      shell.style.transform=`translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
    }
    parallaxFrame=requestAnimationFrame(animateParallax);
  };

  const startParallax=()=>{
    if(prefersReducedMotion||parallaxFrame)return;
    parallaxFrame=requestAnimationFrame(animateParallax);
  };

  const onPointerMove=(event)=>{
    const rect=screen.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    setPointer((event.clientX-rect.left)/rect.width,(event.clientY-rect.top)/rect.height);
  };

  const onPointerLeave=()=>setPointer(0.5,0.42);

  const stopFloat=()=>{
    if(floatFrame){cancelAnimationFrame(floatFrame);floatFrame=null;}
    if(raccoonWrap)raccoonWrap.style.transform='translate3d(0,0,0) rotate(0deg)';
  };

  const animateFloat=(ts)=>{
    if(!raccoonWrap)return;
    if(!floatStart)floatStart=ts;
    const t=(ts-floatStart)/1000;
    const x=Math.sin(t*0.58)*1.6 + Math.sin(t*1.17)*0.45;
    const y=Math.sin(t*0.84)*5.8 + Math.cos(t*1.68)*1.1;
    const r=Math.sin(t*0.44)*0.7;
    raccoonWrap.style.transform=`translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg)`;
    floatFrame=requestAnimationFrame(animateFloat);
  };

  const startFloat=()=>{
    if(prefersReducedMotion||!raccoonWrap||floatFrame)return;
    floatStart=0;
    floatFrame=requestAnimationFrame(animateFloat);
  };

  const show=()=>{
    clearTimeout(leaveTimer);
    screen.hidden=false;
    screen.classList.remove('is-leaving');
    document.body.classList.add('intro-open');
    document.body.classList.remove('intro-leaving');
    resetReveal();
    document.addEventListener('keydown',onKeyDown);
    screen.addEventListener('pointermove',onPointerMove);
    screen.addEventListener('pointerleave',onPointerLeave);
    startFloat();
    startParallax();
    requestAnimationFrame(()=>enter.focus({preventScroll:true}));
  };

  const hide=(navigate=false)=>{
    if(screen.hidden||screen.classList.contains('is-leaving'))return;
    screen.classList.add('is-leaving');
    document.body.classList.remove('intro-open');
    document.body.classList.add('intro-leaving');
    document.removeEventListener('keydown',onKeyDown);
    screen.removeEventListener('pointermove',onPointerMove);
    screen.removeEventListener('pointerleave',onPointerLeave);
    setButtonHover(false);
    stopFloat();
    stopParallax();
    const delay=prefersReducedMotion?0:620;
    leaveTimer=setTimeout(()=>{
      if(navigate){
        window.location.href=enterTarget;
        return;
      }
      screen.hidden=true;
      screen.classList.remove('is-leaving');
      document.body.classList.remove('intro-leaving');
    },delay);
  };

  // This script runs the animated splash only on the dedicated index page.
  // The initial theme was selected in <head> so there is no blue flash before paint.
  syncSplashLogo();
  show();

  // Browsers may restore the splash page from the back/forward cache in its
  // faded-out state. Restore it so mouse/browser Back behaves like a real page.
  window.addEventListener('pageshow',event=>{
    if(event.persisted){
      randomizeSplashTheme();
      show();
    }
  });

  enter.addEventListener('click',()=>hide(true));
  enter.addEventListener('mouseenter',()=>setButtonHover(true));
  enter.addEventListener('mouseleave',()=>setButtonHover(false));
  enter.addEventListener('focus',()=>setButtonHover(true));
  enter.addEventListener('blur',()=>setButtonHover(false));

})();

(()=>{
  const themes = {
  blue: {
    name: 'Midnight Pulse',
    logo: 'assets/images/themes/theme-blue.webp'
  },
  red: {
    name: 'Crimson Rush',
    logo: 'assets/images/themes/theme-red.webp'
  },
  purple: {
    name: 'Violet Void',
    logo: 'assets/images/themes/theme-purple.webp'
  },
  green: {
    name: 'Toxic Glow',
    logo: 'assets/images/themes/theme-green.webp'
  },
  pink: {
    name: 'Bubblegum Byte',
    logo: 'assets/images/themes/theme-pink.webp'
  }
};
  const root=document.documentElement;
  const picker=document.getElementById('hubThemePicker');
  const button=document.getElementById('hubThemePickerButton');
  const menu=document.getElementById('hubThemePickerMenu');
  const currentName=document.getElementById('hubThemeName');
  const options=[...document.querySelectorAll('.theme-option')];
  const logos=[...document.querySelectorAll('[data-theme-logo]')];
  const themePages=new Set(['home.html','downloads.html','sleepysource.html','sleepychat.html','changelog.html','support.html','github.html','privacy.html','404.html']);
  const normalize=value=>themes[value]?value:'blue';
  const valid=value=>Object.prototype.hasOwnProperty.call(themes,value);
  const queryTheme=()=>{
    try{
      const value=new URLSearchParams(window.location.search).get('theme');
      return valid(value)?value:'';
    }catch(e){return ''}
  };
  const storedTheme=()=>{
    try{
      const value=localStorage.getItem('sleepyhub-theme')||'';
      return valid(value)?value:'';
    }catch(e){return ''}
  };
  const tabTheme=()=>{
    try{
      const match=/^sleepyhub-theme:(blue|red|purple|green|pink)$/.exec(window.name||'');
      return match?match[1]:'';
    }catch(e){return ''}
  };
  const readTheme=()=>normalize(queryTheme()||tabTheme()||storedTheme()||root.dataset.theme||'blue');
  const persist=value=>{
    try{localStorage.setItem('sleepyhub-theme',value)}catch(e){}
    try{window.name=`sleepyhub-theme:${value}`}catch(e){}
  };
  const themedHref=(href,theme)=>{
    if(!href||href.startsWith('#')||/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href))return href;
    const hashAt=href.indexOf('#');
    const beforeHash=hashAt>=0?href.slice(0,hashAt):href;
    const hash=hashAt>=0?href.slice(hashAt):'';
    const queryAt=beforeHash.indexOf('?');
    const path=queryAt>=0?beforeHash.slice(0,queryAt):beforeHash;
    const query=queryAt>=0?beforeHash.slice(queryAt+1):'';
    const page=(path.split('/').pop()||'').toLowerCase();
    if(!themePages.has(page))return href;
    const params=new URLSearchParams(query);
    params.set('theme',theme);
    return `${path}?${params.toString()}${hash}`;
  };
  const syncInternalLinks=theme=>{
    document.querySelectorAll('a[href]').forEach(link=>{
      const href=link.getAttribute('href');
      const next=themedHref(href,theme);
      if(next!==href)link.setAttribute('href',next);
    });
  };
  const apply=(value,shouldPersist=true,shouldSync=true)=>{
    const theme=normalize(value);
    root.dataset.theme=theme;
    if(currentName)currentName.textContent=themes[theme].name;
    logos.forEach(img=>{if(img.getAttribute('src')!==themes[theme].logo)img.setAttribute('src',themes[theme].logo)});
    options.forEach(opt=>opt.setAttribute('aria-selected',String(opt.dataset.themeValue===theme)));
    if(shouldPersist)persist(theme);
    if(shouldSync)syncInternalLinks(theme);
  };
  const isOpen=()=>!!(picker&&picker.classList.contains('open'));
  const setOpen=(open,focusCurrent=false)=>{
    if(!picker||!button||!menu)return;
    picker.classList.toggle('open',open);
    button.setAttribute('aria-expanded',String(open));
    menu.hidden=!open;
    if(open&&focusCurrent){
      const selected=options.find(opt=>opt.getAttribute('aria-selected')==='true')||options[0];
      if(selected)selected.focus();
    }
  };

  // The dedicated welcome/splash page intentionally uses its own random theme.
  // Never overwrite the user's saved site theme from the splash.
  const splashOnly=!!document.getElementById('sleepyEnterScreen');
  if(splashOnly){
    apply(root.dataset.splashTheme||root.dataset.theme||'blue',false,false);
    return;
  }

  // Query-string state is deliberate: it keeps themes working even when the
  // extracted ZIP is previewed directly with file:// URLs, where browser
  // localStorage behavior can vary from page to page.
  apply(readTheme());
  if(!picker||!button||!menu)return;
  setOpen(false);

  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    setOpen(!isOpen());
  });
  button.addEventListener('keydown',event=>{
    if(['ArrowDown','Enter',' '].includes(event.key)){
      event.preventDefault();
      setOpen(true,true);
    }else if(event.key==='Escape'){
      event.preventDefault();
      setOpen(false);
    }
  });
  options.forEach((opt,index)=>{
    opt.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      apply(opt.dataset.themeValue);
      setOpen(false);
      button.focus();
    });
    opt.addEventListener('keydown',event=>{
      if(event.key==='Escape'){
        event.preventDefault();
        setOpen(false);
        button.focus();
        return;
      }
      if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        apply(opt.dataset.themeValue);
        setOpen(false);
        button.focus();
        return;
      }
      let next=-1;
      if(event.key==='ArrowDown')next=Math.min(options.length-1,index+1);
      if(event.key==='ArrowUp')next=Math.max(0,index-1);
      if(event.key==='Home')next=0;
      if(event.key==='End')next=options.length-1;
      if(next>=0){event.preventDefault();options[next].focus()}
    });
  });
  document.addEventListener('click',event=>{
    if(!picker.contains(event.target))setOpen(false);
  });
  window.addEventListener('resize',()=>setOpen(false));
})();
