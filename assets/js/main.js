const nav=document.querySelector('.nav');const menu=document.querySelector('.menu-btn');if(menu){menu.addEventListener('click',()=>nav.classList.toggle('open'));}


// SleepyHub enter screen
(()=>{
  const screen=document.getElementById('sleepyEnterScreen');
  const enter=document.getElementById('enterSleepyHub');
  if(!screen||!enter)return;
  const enterTarget=enter.dataset.target||'home.html';
  const raccoonWrap=screen.querySelector('.enter-raccoon-wrap');
  const shell=screen.querySelector('.enter-shell');
  const revealNodes=screen.querySelectorAll('.enter-reveal');

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
  show();

  // Browsers may restore the splash page from the back/forward cache in its
  // faded-out state. Restore it so mouse/browser Back behaves like a real page.
  window.addEventListener('pageshow',event=>{
    if(event.persisted)show();
  });

  enter.addEventListener('click',()=>hide(true));
  enter.addEventListener('mouseenter',()=>setButtonHover(true));
  enter.addEventListener('mouseleave',()=>setButtonHover(false));
  enter.addEventListener('focus',()=>setButtonHover(true));
  enter.addEventListener('blur',()=>setButtonHover(false));

})();
