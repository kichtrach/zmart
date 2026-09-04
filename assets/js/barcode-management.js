(() => {
  const data = [
    ['8901234567890','Aashirvaad Atta 5kg','ATT5005','Grocery','EAN-13','Active','25 May 2025','Super Admin'],
    ['8901234567891','Tata Tea Premium 1kg','TEA1001','Beverages','EAN-13','Active','25 May 2025','Super Admin'],
    ['8901234567892','Surf Excel Matic 2kg','DET2002','Household','EAN-13','Active','24 May 2025','Store Manager'],
    ['8901234567893','Colgate Strong Teeth 200g','COL200','Personal Care','EAN-13','Inactive','24 May 2025','Store Manager'],
    ['8901234567894','Parle-G Biscuit 400g','BIS400','Snacks','EAN-13','Active','23 May 2025','Super Admin'],
    ['8901234567895','Nestle Milkmaid 1kg','MILK1000','Grocery','EAN-13','Active','23 May 2025','Super Admin'],
    ['8901234567896','Dettol Liquid 550ml','HYG550','Personal Care','EAN-13','Active','22 May 2025','Store Manager'],
    ['8901234567897','Lays Classic Salted 52g','LAY052','Snacks','EAN-13','Duplicate','22 May 2025','Super Admin'],
    ['8901234567898','Fortune Sunlite Oil 1L','OIL1001','Grocery','EAN-13','Active','21 May 2025','Super Admin'],
    ['8901234567899','Vim Dishwash Bar 250g','VIM250','Household','EAN-13','Active','21 May 2025','Store Manager']
  ];
  const tbody = document.getElementById('barcodeTableBody'), menu = document.getElementById('actionMenu');
  const search = document.getElementById('barcodeSearch'), cat = document.getElementById('categoryFilter'), type = document.getElementById('typeFilter'), status = document.getElementById('statusFilter'), by = document.getElementById('createdByFilter');
  let visible = [...data], selected = null;

  const topTitle = document.querySelector('.topbar-title'); if (topTitle) topTitle.textContent = 'Barcode Management';
  function badge(v){ return `<span class="status-badge ${v.toLowerCase()}">${v}</span>`; }
  function render(){
    tbody.innerHTML = visible.map((r,i)=>`<tr><td>${i+1}</td><td><span class="barcode-cell"><span class="mini-barcode"><i class="fa-solid fa-barcode"></i></span>${r[0]}</span></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${badge(r[5])}</td><td>${r[6]}</td><td>${r[7]}</td><td><button class="action-dots" data-row="${data.indexOf(r)}"><i class="fa-solid fa-ellipsis"></i></button></td></tr>`).join('') || `<tr><td colspan="10" style="text-align:center;height:90px;color:#66758b">No barcodes found.</td></tr>`;
    document.getElementById('entriesText').textContent = visible.length === data.length ? 'Showing 1 to 10 of 2,458 entries' : `Showing ${visible.length ? 1 : 0} to ${visible.length} of ${visible.length} entries`;
  }
  function filter(){
    const q=search.value.trim().toLowerCase(); visible=data.filter(r=>(!q||r[0].includes(q)||r[1].toLowerCase().includes(q)||r[2].toLowerCase().includes(q))&&(cat.value==='All Categories'||r[3]===cat.value)&&(type.value==='All Types'||r[4]===type.value)&&(status.value==='All Statuses'||r[5]===status.value)&&(by.value==='All Users'||r[7]===by.value)); render();
  }
  document.getElementById('searchBtnLocal').onclick=filter; search.addEventListener('keydown',e=>{if(e.key==='Enter')filter()}); [cat,type,status,by].forEach(el=>el.addEventListener('change',filter));
  document.getElementById('resetBtn').onclick=()=>{search.value='';cat.selectedIndex=type.selectedIndex=status.selectedIndex=by.selectedIndex=0;document.getElementById('dateRange').value='';visible=[...data];render();toast('Filters reset successfully.');};
  tbody.addEventListener('click',e=>{const btn=e.target.closest('.action-dots');if(!btn)return;selected=data[+btn.dataset.row];const rect=btn.getBoundingClientRect();menu.hidden=false;menu.style.left=Math.min(rect.right-165,innerWidth-175)+'px';menu.style.top=Math.min(rect.bottom+5,innerHeight-190)+'px';e.stopPropagation();});
  document.addEventListener('click',e=>{if(!e.target.closest('#actionMenu')&&!e.target.closest('.action-dots'))menu.hidden=true});
  menu.addEventListener('click',e=>{const btn=e.target.closest('[data-action]');if(!btn||!selected)return;menu.hidden=true;const a=btn.dataset.action;if(a==='view')showDetails(selected);else if(a==='edit')toast(`Edit Barcode selected for ${selected[0]}.`);else if(a==='print')toast(`Print label prepared for ${selected[1]}.`);else if(a==='status'){selected[5]=selected[5]==='Active'?'Inactive':'Active';render();toast(`Barcode status changed to ${selected[5]}.`)}else if(a==='delete')toast(`Delete action selected for ${selected[0]}.`);});
  function showDetails(r){document.getElementById('dialogTitle').textContent='Barcode Details';document.getElementById('dialogContent').innerHTML=`<div class="dialog-grid"><span>Barcode</span><b>:</b><strong>${r[0]}</strong><span>Product Name</span><b>:</b><strong>${r[1]}</strong><span>SKU / Code</span><b>:</b><strong>${r[2]}</strong><span>Category</span><b>:</b><strong>${r[3]}</strong><span>Barcode Type</span><b>:</b><strong>${r[4]}</strong><span>Status</span><b>:</b><strong>${r[5]}</strong></div>`;document.getElementById('genericModal').hidden=false;}
  document.querySelectorAll('[data-close-modal]').forEach(b=>b.onclick=()=>document.getElementById('genericModal').hidden=true);
  document.getElementById('addBarcodeBtn').onclick=()=>location.href='add-new-barcode.html';
  document.getElementById('importBtn').onclick=()=>toast('Import Barcode action is connected.'); document.getElementById('exportBtn').onclick=()=>toast('Barcode export prepared.'); document.getElementById('columnsBtn').onclick=()=>toast('Column Settings action is connected.');
  // Functional date-range picker (shared green theme, body-level popup to avoid clipping)
  (()=>{
    const input=document.getElementById('dateRange');
    const trigger=document.getElementById('datePickerBtn');
    if(!input||!trigger)return;
    let pop=null, shown=new Date(2025,4,1), start=null, end=null;
    const pad=n=>String(n).padStart(2,'0');
    const fmt=d=>`${pad(d.getDate())} ${d.toLocaleString('en-US',{month:'short'})} ${d.getFullYear()}`;
    const same=(a,b)=>a&&b&&a.toDateString()===b.toDateString();
    const between=d=>start&&end&&d>start&&d<end;
    function position(){if(!pop)return;const r=input.closest('.date-input').getBoundingClientRect();const w=328;let left=Math.max(10,Math.min(r.left,innerWidth-w-10));let top=r.bottom+6;const h=388;if(top+h>innerHeight)top=Math.max(10,r.top-h-6);pop.style.left=left+'px';pop.style.top=top+'px'}
    function close(){if(pop){pop.remove();pop=null}}
    function draw(){
      close();
      pop=document.createElement('div');pop.className='barcode-range-popover';
      const y=shown.getFullYear(),m=shown.getMonth(),first=new Date(y,m,1),gridStart=new Date(y,m,1-first.getDay());
      let html=`<div class="barcode-range-head"><button class="barcode-range-nav" data-nav="prev"><i class="fa-solid fa-chevron-left"></i></button><strong>${shown.toLocaleString('en-US',{month:'long'})} ${y}</strong><button class="barcode-range-nav" data-nav="next"><i class="fa-solid fa-chevron-right"></i></button></div><div class="barcode-range-week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div><div class="barcode-range-grid">`;
      for(let i=0;i<42;i++){
        const d=new Date(gridStart);d.setDate(gridStart.getDate()+i);
        let cls='barcode-range-day'+(d.getMonth()!==m?' muted':'')+(between(d)?' in-range':'')+(same(d,start)?' start':'')+(same(d,end)?' end':'');
        html+=`<button type="button" class="${cls}" data-date="${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}">${d.getDate()}</button>`;
      }
      html+=`</div><div class="barcode-range-summary">${start?`From: <b>${fmt(start)}</b>`:'Select start date'}${end?` &nbsp; To: <b>${fmt(end)}</b>`:''}</div><div class="barcode-range-actions"><button type="button" data-clear>Clear</button><button type="button" data-cancel>Cancel</button><button type="button" class="apply" data-apply ${start&&end?'':'disabled'}>Apply</button></div>`;
      pop.innerHTML=html;document.body.appendChild(pop);position();
      pop.addEventListener('click',e=>{
        e.stopPropagation();const b=e.target.closest('button');if(!b)return;
        if(b.dataset.nav){shown=new Date(y,m+(b.dataset.nav==='prev'?-1:1),1);draw();return}
        if(b.hasAttribute('data-clear')){start=end=null;input.value='';close();filter();return}
        if(b.hasAttribute('data-cancel')){close();return}
        if(b.hasAttribute('data-apply')){if(start&&end){input.value=`${fmt(start)} - ${fmt(end)}`;close();filter()}return}
        if(b.dataset.date){const [yy,mm,dd]=b.dataset.date.split('-').map(Number);const d=new Date(yy,mm-1,dd);if(!start||end){start=d;end=null}else if(d<start){end=start;start=d}else{end=d}shown=new Date(d.getFullYear(),d.getMonth(),1);draw()}
      });
    }
    function toggle(e){e?.preventDefault();e?.stopPropagation();pop?close():draw()}
    trigger.addEventListener('click',toggle);input.addEventListener('click',toggle);
    document.addEventListener('click',e=>{if(pop&&!e.target.closest('.barcode-range-popover')&&!e.target.closest('.date-input'))close()});
    addEventListener('resize',position);addEventListener('scroll',position,true);
  })();
  document.querySelector('[data-navto="home"]').onclick=()=>location.href='../index.html'; document.querySelector('[data-navto="product"]').onclick=()=>location.href='categories.html';
  function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2200)}
  const p=document.getElementById('pagination');p.innerHTML=['«','1','2','3','4','5','...','246','»'].map(x=>`<button class="page-btn ${x==='1'?'active':''}">${x}</button>`).join('');p.onclick=e=>{if(!e.target.classList.contains('page-btn'))return;p.querySelectorAll('.page-btn').forEach(b=>b.classList.remove('active'));if(/^\d+$/.test(e.target.textContent))e.target.classList.add('active');};
  render();
})();
