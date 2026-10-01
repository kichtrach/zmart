/* V133 - richer demo data for primary ZMart management modules. */
(()=>{
  const names=['Arun Kumar','Priya Nair','Rahul Menon','Divya S','Karthik R','Meera Joseph','Naveen Raj','Anjali P','Vignesh K','Lakshmi R'];
  const branches=['Anna Nagar','T. Nagar','Velachery','Adyar','Tambaram','Porur','Ambattur','Chrompet','OMR','Guindy'];
  const products=['Ponni Rice 5kg','Groundnut Oil 1L','Idli Rice 5kg','Green Gram 1kg','Chilli Powder 500g','Horlicks 500g','Harpic 1L','Colgate 200g','Good Day 200g','Aavin Ghee 500ml'];
  const suppliers=['Kaveri Foods','Southern Agro','Metro Wholesale','Green Valley Traders','Sri Lakshmi Distributors','Freshway Foods','Prime FMCG','Chennai Provisions','Royal Consumer Goods','Everfresh Supply Co.'];
  function mutateCell(cell,rowIndex,colIndex){
    if(!cell) return;
    const raw=cell.textContent.trim();
    if(colIndex===0 && /^\d+$/.test(raw)){cell.textContent=rowIndex+1;return;}
    if(/₹\s?[\d,]+(?:\.\d+)?/.test(raw)){const n=1250+(rowIndex*1375)+(colIndex*225);cell.innerHTML=cell.innerHTML.replace(/₹\s?[\d,]+(?:\.\d+)?/,`₹${n.toLocaleString('en-IN')}`);return;}
    if(/^\d{1,3}(?:,\d{3})*(?:\.\d+)?$/.test(raw) && Number(raw.replace(/,/g,''))>100){cell.textContent=(Number(raw.replace(/,/g,''))+rowIndex*137).toLocaleString('en-IN');return;}
    if(/(PO|GRN|INV|SUP|WH|BR|SKU|BAT|TRN|RET|PAY|STK)-?\d/i.test(raw)){cell.innerHTML=cell.innerHTML.replace(/((?:PO|GRN|INV|SUP|WH|BR|SKU|BAT|TRN|RET|PAY|STK)[-\w]*?)(\d{2,})/i,(m,p,n)=>p+String(Number(n)+rowIndex+7).padStart(n.length,'0'));return;}
    if(/ZMart\s/i.test(raw) && branches[rowIndex%branches.length]){cell.innerHTML=cell.innerHTML.replace(/ZMart\s(?:-|–)?\s*[A-Za-z. ]+/,'ZMart - '+branches[rowIndex%branches.length]);return;}
  }
  function expandTable(table,target=15){
    const body=table.tBodies&&table.tBodies[0]; if(!body) return;
    const originals=[...body.rows]; if(!originals.length || originals.length>=target) return;
    for(let i=originals.length;i<target;i++){
      const row=originals[i%originals.length].cloneNode(true);
      [...row.cells].forEach((c,j)=>mutateCell(c,i,j));
      // diversify common descriptive cells while retaining table structure
      const txt=row.textContent;
      if(/product|sku|category|brand/i.test(table.tHead?.textContent||'')){
        [...row.cells].forEach(c=>{if(products.some(p=>c.textContent.includes(p))) return;});
      }
      body.appendChild(row);
    }
    // update common footer count labels
    const scope=table.closest('section, .ui-card, .panel, main')||document;
    scope.querySelectorAll('.pagination span,.inv-footer>span').forEach(s=>{if(/Showing/i.test(s.textContent))s.textContent=`Showing 1 to ${Math.min(target,15)} of ${Math.max(target,48)} entries`;});
  }
  function diversify(table){
    const body=table.tBodies?.[0]; if(!body)return;
    const headers=[...(table.tHead?.rows?.[0]?.cells||[])].map(x=>x.textContent.toLowerCase());
    [...body.rows].forEach((r,i)=>{
      [...r.cells].forEach((c,j)=>{
        const h=headers[j]||'';
        if(i>=5 && /product name|product details/.test(h) && !c.querySelector('input,select,button')) c.textContent=products[i%products.length];
        if(i>=5 && /supplier/.test(h) && !c.querySelector('input,select,button')) c.textContent=suppliers[i%suppliers.length];
        if(i>=5 && /branch name|branch \/ location/.test(h) && !c.querySelector('input,select,button')) c.textContent='ZMart '+branches[i%branches.length];
        if(i>=5 && /contact person|created by|employee/.test(h) && !c.querySelector('input,select,button')) c.textContent=names[i%names.length];
      });
    });
  }
  function run(){document.querySelectorAll('table').forEach(t=>{expandTable(t,15);diversify(t);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,40)); else setTimeout(run,40);
})();
