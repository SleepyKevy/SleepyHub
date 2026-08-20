(()=>{
  const config=window.SleepyHubSiteConfig||{};
  if(!/^https?:$/.test(location.protocol))return;
  const configured=(config.siteUrl||'').replace(/\/$/,'');
  const base=configured||location.origin;
  const filename=(location.pathname.split('/').pop()||'home.html').toLowerCase();
  const canonicalPath=filename==='index.html'?'':filename;
  const canonical=base+'/'+canonicalPath;
  let link=document.querySelector('link[rel="canonical"]');
  if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}
  link.href=canonical;
  const setMeta=(selector,key,value)=>{
    let el=document.head.querySelector(selector);
    if(!el){
      el=document.createElement('meta');
      if(selector.includes('property=')){el.setAttribute('property',key)}else{el.setAttribute('name',key)}
      document.head.appendChild(el);
    }
    el.setAttribute('content',value);
  };
  setMeta('meta[property="og:url"]','og:url',canonical);
  const image=config.socialImage||'assets/images/themes/theme-blue.webp';
  const imageUrl=/^https?:\/\//i.test(image)?image:base+'/'+image.replace(/^\//,'');
  setMeta('meta[property="og:image"]','og:image',imageUrl);
  setMeta('meta[name="twitter:image"]','twitter:image',imageUrl);
})();
