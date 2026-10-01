/* V156 — global action fallback: makes previously visual/dead action items interactive without overriding page-specific handlers. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const textOf=el=>(el?.innerText||el?.textContent||'').replace(/\s+/g,' ').trim();
 function toast(msg,type='success'){
   let t=document.createElement('div');t.className='zg-toast '+type;t.innerHTML=`<i class="fa-solid ${type==='success'?'fa-circle-check':'fa-circle-info'}"></i><span>${esc(msg)}</span>`;document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),220)},2200);
 }
 function modal(title,body,confirm){
   document.querySelector('.zg-action-overlay')?.remove();
   const o=document.createElement('div');o.className='zg-action-overlay';o.innerHTML=`<section class="zg-action-dialog" role="dialog" aria-modal="true"><header><div><span class="zg-dialog-icon"><i class="fa-solid fa-pen-to-square"></i></span><div><h3>${esc(title)}</h3><p>ZMart quick action</p></div></div><button class="zg-x" type="button" aria-label="Close">×</button></header><div class="zg-dialog-body">${body}</div><footer><button class="zg-btn" data-zg-close type="button">Cancel</button>${confirm?`<button class="zg-btn primary" data-zg-confirm type="button">${esc(confirm)}</button>`:''}</footer></section>`;document.body.appendChild(o);
   const close=()=>o.remove();o.querySelector('.zg-x').onclick=close;o.querySelector('[data-zg-close]').onclick=close;o.addEventListener('click',e=>{if(e.target===o)close()});
   return {o,close};
 }
 function rowData(el){const tr=el.closest('tr');if(!tr)return '';return [...tr.cells].slice(0,6).map(td=>textOf(td)).filter(Boolean).join(' • ')}
 function handle(el,label){
   const l=label.toLowerCase(), data=rowData(el);
   if(/view|details|history|performance|track|preview/.test(l)){
     modal(label,`<div class="zg-detail-card"><b>Selected record</b><p>${esc(data||'Details are available for the selected record.')}</p></div>`,'Close').o.querySelector('[data-zg-confirm]').onclick=e=>e.currentTarget.closest('.zg-action-overlay').remove();return;
   }
   if(/edit|update|change status|assign|adjust|configure/.test(l)){
     const m=modal(label,`<label class="zg-field">Remarks <span class="required">*</span><textarea placeholder="Enter update remarks...">${/edit/.test(l)?'Update selected record':''}</textarea></label>`,'Save Changes');m.o.querySelector('[data-zg-confirm]').onclick=()=>{m.close();toast(label+' updated successfully')};return;
   }
   if(/delete|remove|cancel/.test(l)){
     const m=modal(label,`<div class="zg-warning"><i class="fa-solid fa-triangle-exclamation"></i><div><b>Confirm ${esc(label)}</b><p>${esc(data||'This action will update the selected record.')}</p></div></div>`,'Confirm');m.o.querySelector('[data-zg-confirm]').onclick=()=>{const tr=el.closest('tr');if(/delete|remove/.test(l)&&tr)tr.remove();m.close();toast(label+' completed')};return;
   }
   if(/print/.test(l)){window.print();return}
   if(/export|download/.test(l)){toast(label+' prepared');return}
   if(/duplicate|copy/.test(l)){const tr=el.closest('tr');if(tr){const c=tr.cloneNode(true);tr.after(c)}toast('Record duplicated');return}
   toast(label+' action completed');
 }
 // Only fallback when a click produced no page-specific state/navigation.
 document.addEventListener('click',e=>{
   const el=e.target.closest('.action-menu button,.action-menu a,.dropdown-menu button,.dropdown-menu a,.context-menu button,.context-menu a,[class*="action-menu"] button,[class*="action-menu"] a');if(!el)return;
   const href=el.getAttribute('href');if(href&&href!=='#'&&!href.startsWith('javascript:'))return;
   const label=textOf(el);if(!label)return;
   setTimeout(()=>{if(!document.body.contains(el))return;handle(el,label);el.closest('.action-menu,.dropdown-menu,.context-menu,[class*="action-menu"]')?.remove()},0);
 },true);
 // Generic tooltip for icon-only controls lacking a title.
 document.addEventListener('mouseover',e=>{const b=e.target.closest('button');if(!b||b.title||textOf(b))return;const a=b.getAttribute('aria-label');if(a)b.title=a});
 window.ZMartActions={toast,modal};
})();
