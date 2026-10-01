
/* V132: richer demo data across management/listing modules. */
(()=>{
  const listingPages = new Set([
    'index.html','supplier-overview.html','supplier-categories.html','supplier-contacts.html','supplier-management.html',
    'branch-dashboard.html','branch-expenses.html','branch-performance.html','branch-status.html','branch-targets.html','branch-master.html','branch-management.html',
    'employee-management.html','customer-management.html','system-settings.html','accounting-finance.html','reports-analytics.html','sales-billing.html',
    'stock-by-warehouse.html','stock-transfers.html','warehouse-overview.html','warehouse-master.html','rack-bin-management.html','overview-list.html','warehouse-management.html',
    'units.html','categories.html','product-variants.html','sub-categories.html','batch-management.html','brands.html','barcode-management.html','products.html','product-management.html',
    'financial-year.html','gst-settings.html','tax-configuration.html','currency-settings.html','company-management.html',
    'purchase-returns.html','purchase-invoices.html','goods-receipt.html','supplier-payments.html','purchase-orders.html','purchase-reports.html','purchase-management.html',
    'stock-adjustment.html','stock-count.html','inventory-management.html'
  ]);
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(!listingPages.has(page)) return;
  const suffixes=['Central','North','South','East','West','City','Metro','Express','Prime','Plus','Hub','Mart','Fresh','Daily','Select'];
  function varyText(root, n){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      let t=node.nodeValue;
      // Make common record identifiers unique without disturbing labels, dates, amounts or button copy.
      t=t.replace(/\b((?:PO|GRN|INV|RET|SUP|EMP|CUS|BR|WH|SKU|BAT|ADJ|CNT|TRF)[- ]?\d{2,})\b/gi,(m)=>m+'-'+String(n).padStart(2,'0'));
      node.nodeValue=t;
    });
  }
  function enrichTables(){
    document.querySelectorAll('tbody').forEach((tb,tableIndex)=>{
      if(tb.closest('.modal,.dialog,[role="dialog"],#stockOverlay,#successOverlay')) return;
      let rows=[...tb.children].filter(x=>x.tagName==='TR' && !/no .*found|no data|empty/i.test(x.innerText));
      if(!rows.length || rows.length>=15) return;
      const originals=[...rows];
      let i=rows.length;
      while(i<15){
        const clone=originals[i%originals.length].cloneNode(true);
        clone.removeAttribute('id'); clone.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));
        const first=clone.querySelector('td');
        if(first && /^\s*\d+\s*$/.test(first.textContent)) first.textContent=String(i+1);
        varyText(clone,i+1);
        // Slightly vary a plain name cell on cloned records so the demo does not look duplicated.
        const cells=[...clone.querySelectorAll('td')];
        const nameCell=cells.find((c,idx)=>idx>0 && idx<4 && /^[A-Za-z][A-Za-z0-9 .&()/-]{3,}$/.test(c.textContent.trim()) && !c.querySelector('button,input,select'));
        if(nameCell && !/active|inactive|pending|completed|stock|warehouse|grocery|household/i.test(nameCell.textContent)){
          const base=nameCell.textContent.trim();
          if(!/\b(Central|North|South|East|West|City|Metro|Express|Prime|Plus|Hub|Mart|Fresh|Daily|Select)\b/.test(base)) nameCell.textContent=base+' '+suffixes[i%suffixes.length];
        }
        tb.appendChild(clone); i++;
      }
    });
  }
  function enrichCards(){
    const selectors=['.activity-item','.recent-item','.transaction-item','.notification-item','.list-item','.timeline-item'];
    selectors.forEach(sel=>document.querySelectorAll(sel).forEach(()=>{}));
    selectors.forEach(sel=>{
      const all=[...document.querySelectorAll(sel)].filter(x=>!x.closest('.modal,.dialog,[role="dialog"]'));
      if(!all.length || all.length>=10) return;
      const parent=all[0].parentElement; if(!parent || !all.every(x=>x.parentElement===parent)) return;
      let i=all.length; while(i<10){const c=all[i%all.length].cloneNode(true);c.removeAttribute('id');varyText(c,i+1);parent.appendChild(c);i++;}
    });
  }
  // Run after page-specific renderers have populated their tables.
  window.addEventListener('load',()=>{setTimeout(()=>{enrichTables();enrichCards();},180)});
})();
