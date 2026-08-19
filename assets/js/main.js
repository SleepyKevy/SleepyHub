const nav=document.querySelector('.nav');const menu=document.querySelector('.menu-btn');if(menu){menu.addEventListener('click',()=>nav.classList.toggle('open'));}


// SleepyHub enter screen
(()=>{
  const screen=document.getElementById('sleepyEnterScreen');
  const enter=document.getElementById('enterSleepyHub');
  const replay=document.getElementById('replayIntro');
  const raccoonWrap=screen.querySelector('.enter-raccoon-wrap');
  if(!screen||!enter)return;

  const key='sleepyhub-entered-v2';
  const forceIntro=new URLSearchParams(location.search).get('intro')==='1';
  const localPreview=location.protocol==='file:';
  const prefersReducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasEntered=false;
  let leaveTimer=null;
  let floatFrame=null;
  let floatStart=0;

  try{hasEntered=localStorage.getItem(key)==='1';}catch(_){hasEntered=false;}

  const setButtonHover=(active)=>screen.classList.toggle('button-hover',!!active);

  const onKeyDown=(event)=>{
    if(screen.hidden)return;
    if(event.key==='Enter'){
      event.preventDefault();
      hide(true);
    }
  };

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
    document.addEventListener('keydown',onKeyDown);
    startFloat();
    requestAnimationFrame(()=>enter.focus({preventScroll:true}));
  };

  const hide=(remember=true)=>{
    if(screen.hidden||screen.classList.contains('is-leaving'))return;
    if(remember){try{localStorage.setItem(key,'1');}catch(_){}}
    screen.classList.add('is-leaving');
    document.body.classList.remove('intro-open');
    document.body.classList.add('intro-leaving');
    document.removeEventListener('keydown',onKeyDown);
    setButtonHover(false);
    stopFloat();
    const delay=prefersReducedMotion?0:620;
    leaveTimer=setTimeout(()=>{
      screen.hidden=true;
      screen.classList.remove('is-leaving');
      document.body.classList.remove('intro-leaving');
    },delay);
  };

  if(localPreview||forceIntro||!hasEntered){show();}
  else{
    screen.hidden=true;
    document.body.classList.remove('intro-open','intro-leaving');
    stopFloat();
  }

  enter.addEventListener('click',()=>hide(true));
  enter.addEventListener('mouseenter',()=>setButtonHover(true));
  enter.addEventListener('mouseleave',()=>setButtonHover(false));
  enter.addEventListener('focus',()=>setButtonHover(true));
  enter.addEventListener('blur',()=>setButtonHover(false));

  if(replay){
    replay.addEventListener('click',event=>{
      event.preventDefault();
      try{localStorage.removeItem(key);}catch(_){}
      show();
    });
  }
})();
