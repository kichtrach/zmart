(function(){
  const labels={'company-management':'Company Management','branch-management':'Branch Management','warehouse-management':'Warehouse Management','warehouse-overview':'Warehouse Overview','product-management':'Product Management','supplier-management':'Supplier Management','purchase-management':'Purchase Management','inventory-management':'Inventory Management','sales-billing':'Sales & Billing','customer-management':'Customer Management','employee-management':'Employee Management','accounting-finance':'Accounting & Finance','reports-analytics':'Reports & Analytics','system-settings':'System Settings'};
  const clean=s=>(s||'').replace(/^ZMart\s*[|–-]\s*/i,'').replace(/\s+/g,' ').trim();
  const titleCase=s=>s.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  function inferred(){
    const seg=location.pathname.split('/').filter(Boolean), folder=seg.length>1?seg[seg.length-2]:'';
    const module=labels[folder]||titleCase(folder);
    let page=clean(document.title).replace(/\s*\|\s*ZMart.*$/i,'');
    if(!page||/^zmart$/i.test(page)) page=titleCase((seg[seg.length-1]||'').replace(/\.html?$/i,''));
    if(page===module) return ['Home',module];
    return ['Home',module,page].filter(Boolean);
  }
  function existingParts(el){
    if(!el)return [];
    const vals=[];
    [...el.querySelectorAll('a,span,b,strong')].forEach(n=>{const t=clean(n.textContent);if(t&&!vals.includes(t))vals.push(t)});
    return vals.length?vals:clean(el.textContent).split(/\s*(?:›|>|\/|»|→)\s*/).filter(Boolean);
  }
  function normalize(parts){
    const inf=inferred(); let p=(parts||[]).map(clean).filter(Boolean);
    if(!p.length)p=inf.slice();
    if(!p.some(x=>/^home$/i.test(x)))p.unshift('Home');
    if(inf[1]&&!p.some(x=>x.toLowerCase()===inf[1].toLowerCase()))p.splice(1,0,inf[1]);
    if(inf[2]&&!p.some(x=>x.toLowerCase()===inf[2].toLowerCase()))p.push(inf[2]);
    return p.filter((x,i,a)=>a.findIndex(y=>y.toLowerCase()===x.toLowerCase())===i);
  }
  function render(nav,p){
    nav.className='zmart-breadcrumb';nav.setAttribute('aria-label','Breadcrumb');nav.innerHTML='';
    p.forEach((x,i)=>{const n=document.createElement(i===p.length-1?'span':'a');n.textContent=x;if(n.tagName==='A')n.href=i===0?'../index.html':'#';nav.appendChild(n);if(i<p.length-1){const s=document.createElement('i');s.className='fa-solid fa-chevron-right breadcrumb-separator';s.setAttribute('aria-hidden','true');nav.appendChild(s)}});
  }
  function init(){
    const main=document.querySelector('.app-shell > main, main');if(!main)return;
    const selectors='[class*="breadcrumb"],[class*="crumb"]';
    const all=[...main.querySelectorAll(selectors)].filter(e=>!e.closest('table')&&!e.matches('script,style')&&!e.classList.contains('zmart-breadcrumb-row'));
    const source=all[0]||null; const p=normalize(existingParts(source));
    /* Remove every legacy breadcrumb so duplicates cannot survive. */
    all.forEach(e=>e.remove());
    main.querySelectorAll('.zmart-breadcrumb-row').forEach(e=>e.remove());
    const row=document.createElement('div');row.className='zmart-breadcrumb-row';
    const nav=document.createElement('nav');render(nav,p);row.appendChild(nav);
    main.insertBefore(row,main.firstChild);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
