(()=>{
  const blocks=[...document.querySelectorAll('[data-release-meta]')];
  if(!blocks.length)return;

  const formatBytes=bytes=>{
    const value=Number(bytes);
    if(!Number.isFinite(value)||value<=0)return '';
    const mb=value/1_000_000;
    return `${mb>=100?mb.toFixed(0):mb.toFixed(1)} MB`;
  };

  const formatDate=value=>{
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return '';
    return new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(date);
  };

  blocks.forEach(async block=>{
    const repo=block.dataset.repo;
    const tag=block.dataset.tag;
    const assetName=block.dataset.asset;
    const sizeEl=block.querySelector('[data-release-size]');
    const dateEl=block.querySelector('[data-release-date]');
    if(!repo||!tag||!assetName)return;

    const controller=typeof AbortController==='function'?new AbortController():null;
    const timeout=controller?setTimeout(()=>controller.abort(),5000):null;
    try{
      const response=await fetch(`https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`,{
        headers:{Accept:'application/vnd.github+json'},
        signal:controller?controller.signal:undefined
      });
      if(!response.ok)throw new Error(`GitHub release request failed: ${response.status}`);
      const release=await response.json();
      const asset=(release.assets||[]).find(item=>item&&item.name===assetName);
      const size=asset?formatBytes(asset.size):'';
      const released=formatDate(release.published_at||release.created_at);
      if(sizeEl)sizeEl.textContent=size?`FILE SIZE: ${size}`:'FILE SIZE: SEE GITHUB';
      if(dateEl&&released)dateEl.textContent=`RELEASED ${released.toUpperCase()}`;
    }catch(_error){
      if(sizeEl)sizeEl.textContent='FILE SIZE: SEE GITHUB';
      // Keep the verified release-date fallback already present in the HTML.
    }finally{
      if(timeout)clearTimeout(timeout);
    }
  });
})();
