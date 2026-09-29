(()=>{
const counts=[
['SC-2025-012','Main Warehouse (WH-001)','Full Count','REF-001','28 Sep 2025','-','In Progress','1,020 / 2,560','-'],
['SC-2025-011','Branch - TVM (WH-003)','Cycle Count','REF-002','25 Sep 2025','27 Sep 2025','Completed','850 / 850','0'],
['SC-2025-010','Branch - KLM (WH-002)','Full Count','REF-003','20 Sep 2025','22 Sep 2025','Completed','1,245 / 1,245','+5'],
['SC-2025-009','Main Warehouse (WH-001)','Cycle Count','REF-004','15 Sep 2025','16 Sep 2025','Completed','650 / 650','-3'],
['SC-2025-008','Branch - TVM (WH-003)','Full Count','REF-005','10 Sep 2025','12 Sep 2025','Pending Review','980 / 980','+12'],
['SC-2025-007','Main Warehouse (WH-001)','Cycle Count','REF-006','05 Sep 2025','06 Sep 2025','Completed','420 / 420','0'],
['SC-2025-006','Branch - KLM (WH-002)','Cycle Count','REF-007','01 Sep 2025','02 Sep 2025','Completed','310 / 310','-1'],
['SC-2025-005','Main Warehouse (WH-001)','Full Count','REF-008','28 Aug 2025','30 Aug 2025','Completed','2,560 / 2,560','+3'],
['SC-2025-004','Branch - TVM (WH-003)','Cycle Count','REF-009','24 Aug 2025','25 Aug 2025','Completed','540 / 540','0'],
['SC-2025-003','Branch - KLM (WH-002)','Full Count','REF-010','18 Aug 2025','20 Aug 2025','Completed','1,110 / 1,110','-4'],
['SC-2025-002','Main Warehouse (WH-001)','Cycle Count','REF-011','12 Aug 2025','-','In Progress','340 / 600','-'],
['SC-2025-001','Branch - TVM (WH-003)','Full Count','REF-012','05 Aug 2025','-','In Progress','710 / 1,480','-']
];
const tbody=document.querySelector('#countRows');
function renderCounts(q=''){tbody.innerHTML=counts.filter(r=>r.join(' ').toLowerCase().includes(q.toLowerCase())).map((r,i)=>`<tr><td><input type="checkbox"></td><td>${i+1}</td><td><a href="#">${r[0]}</a></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td><span class="status ${r[6]==='Completed'?'completed':r[6]==='Pending Review'?'pending':'progress'}">${r[6]}</span></td><td>${r[7]}</td><td class="variance ${r[8].startsWith('+')?'pos':r[8].startsWith('-')&&r[8]!=='-'?'neg':''}">${r[8]}</td><td><button class="more" data-row="${i}">⋮</button></td></tr>`).join('');bindMenus()}
renderCounts(); document.querySelector('#countSearch').oninput=e=>renderCounts(e.target.value);document.querySelector('#resetCount').onclick=()=>{document.querySelector('#countSearch').value='';renderCounts()};

const wizard=document.querySelector('#countWizard'),success=document.querySelector('#successModal'),loc=document.querySelector('#locationModal');let step=1,locStep=1;
function showStep(){document.querySelectorAll('.sc-pane').forEach(x=>x.classList.toggle('active',+x.dataset.step===step));document.querySelectorAll('.sc-steps>div').forEach((x,i)=>{x.classList.toggle('active',i+1===step);x.classList.toggle('done',i+1<step);x.querySelector('span').textContent=i+1<step?'✓':i+1});document.querySelector('#countBack').style.visibility=step===1?'hidden':'visible';document.querySelector('#countNext').textContent=step===4?'✓ Submit Stock Count':'Next →'}
document.querySelector('#newCount').onclick=()=>{wizard.classList.add('show');step=1;showStep()};document.querySelectorAll('[data-close-count]').forEach(x=>x.onclick=()=>wizard.classList.remove('show'));document.querySelector('#countBack').onclick=()=>{if(step>1){step--;showStep()}};document.querySelector('#countNext').onclick=()=>{if(step<4){step++;showStep()}else document.querySelector('#successModal').classList.add('show')};

const locations=[['Main Warehouse (WH-001)','TC 24/123, Industrial Estate, Trivandrum','Main Warehouse','2,560','15 Aug 2025'],['Aisle A - Dry Goods','WH-001','Aisle','420','15 Aug 2025'],['Aisle B - Beverages','WH-001','Aisle','380','15 Aug 2025'],['Aisle C - Personal Care','WH-001','Aisle','610','15 Aug 2025'],['Cold Storage','WH-001','Storage','120','10 Aug 2025'],['Receiving Area','WH-001','Receiving','90','10 Aug 2025'],['Dispatch Bay','WH-001','Dispatch','75','08 Aug 2025'],['Returns Zone','WH-001','Storage','65','06 Aug 2025']];
document.querySelector('#locationRows').innerHTML=locations.map((r,i)=>`<tr><td><input type="checkbox" ${i<3?'checked':''}></td><td>${i+1}</td><td><b>${r[0]}</b><br><small>${r[1]}</small></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td><span class="status completed">Active</span></td></tr>`).join('');

const items=[['Basmati Rice 5kg','RIC-001','Food Grains',230,'Pack','India Gate'],['Sunflower Oil 1L','OIL-002','Cooking Oil',170,'Bottle','Freedom'],['White Sugar 1kg','SUG-004','Sugar',120,'Pack','Dhampur'],['Tata Tea 500g','TEA-007','Beverages',85,'Pack','Tata'],['Marie Biscuit 200g','BIS-010','Snacks',310,'Pack','Britannia'],['Surf Excel 1kg','DET-003','Cleaning',95,'Pack','Surf'],['Dettol Handwash 250ml','HW-008','Personal Care',140,'Bottle','Dettol'],['Harpic 500ml','CLN-012','Cleaning',60,'Bottle','Harpic'],['Toor Dal 1kg','DAL-013','Food Grains',185,'Pack','Tata Sampann'],['Colgate 200g','PC-014','Personal Care',125,'Tube','Colgate'],['Amul Milk Powder 500g','MLK-015','Dairy',90,'Pack','Amul'],['Maggi Noodles 280g','NDL-016','Snacks',205,'Pack','Maggi']];
document.querySelector('#itemRows').innerHTML=items.map((r,i)=>`<tr><td><input type="checkbox" ${[0,1,2,5,6,8,9].includes(i)?'checked':''}></td><td>${i+1}</td><td><b>${r[0]}</b><br><small>Brand: ${r[5]}</small></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td><span class="switch ${[3,4,7,10,11].includes(i)?'off':''}"></span></td><td><select><option>${[3,4,7,10,11].includes(i)?'-':'Full Count'}</option></select></td><td><input class="qty-input" value="${[3,4,7,10,11].includes(i)?'':r[3]}"></td><td><input placeholder="Remarks"></td></tr>`).join('');
document.querySelector('#reviewItems').innerHTML=items.filter((_,i)=>[0,1,2,5,6,8,9].includes(i)).map((r,i)=>`<tr><td>${i+1}</td><td><b>${r[0]}</b><br><small>Brand: ${r[5]}</small></td><td>${r[1]}</td><td>${r[3]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('');

document.querySelector('#addLocation').onclick=()=>{loc.classList.add('show');locStep=1;showLoc()};
function showLoc(){document.querySelectorAll('.loc-pane').forEach(x=>x.classList.toggle('active',+x.dataset.loc===locStep));document.querySelectorAll('.loc-steps>div').forEach((x,i)=>{x.classList.toggle('active',i+1===locStep);x.classList.toggle('done',i+1<locStep);x.querySelector('span').textContent=i+1<locStep?'✓':i+1});document.querySelector('#locBack').style.visibility=locStep===1?'hidden':'visible';document.querySelector('#locNext').textContent=locStep===3?'✓ Create Location':'Next →'}
document.querySelectorAll('[data-close-location]').forEach(x=>x.onclick=()=>loc.classList.remove('show'));document.querySelector('#locBack').onclick=()=>{if(locStep>1){locStep--;showLoc()}};document.querySelector('#locNext').onclick=()=>{if(locStep<3){locStep++;showLoc()}else{
  document.querySelector('.location-modal .loc-body').innerHTML=`<div class="loc-created"><div class="success-check"><i class="fa-solid fa-check"></i></div><h2>Location Created Successfully!</h2><p>The new location has been added to your warehouse.</p><div class="success-details"><p><span>Warehouse</span><b>Main Warehouse (WH-001)</b></p><p><span>Location Code</span><b>A1-01</b></p><p><span>Location Name</span><b>Aisle A - Section 01</b></p><p><span>Location Type</span><b>Regular Storage</b></p><p><span>Capacity</span><b>500 Units</b></p><p><span>Status</span><b class="status completed">Active</b></p></div></div>`;
  document.querySelector('.location-modal .loc-steps').style.display='none';
  document.querySelector('.location-modal footer').innerHTML=`<button class="sc-btn" data-close-created>Add Another Location</button><div><button class="sc-btn">View in List</button><button class="sc-btn primary" data-done-created>Done</button></div>`;
  document.querySelector('[data-done-created]').onclick=()=>loc.classList.remove('show');
  document.querySelector('[data-close-created]').onclick=()=>loc.classList.remove('show');
}};
document.querySelectorAll('[data-close-success]').forEach(x=>x.onclick=()=>{document.querySelector('#successModal').classList.remove('show');wizard.classList.remove('show')});

function bindMenus(){document.querySelectorAll('.more').forEach(b=>b.onclick=e=>{document.querySelector('.action-menu')?.remove();let m=document.createElement('div');m.className='action-menu';m.innerHTML='<button>👁 View Details</button><button>✎ Edit Count</button><button>✓ Update Status</button><button>⎙ Print Count Sheet</button><button>⇩ Export Report</button>';document.body.appendChild(m);let r=e.currentTarget.getBoundingClientRect();m.style.left=Math.max(8,r.right-190)+'px';m.style.top=Math.min(innerHeight-210,r.bottom+4)+'px';m.querySelectorAll('button').forEach(x=>x.onclick=()=>m.remove())})}
document.addEventListener('click',e=>{if(!e.target.closest('.more')&&!e.target.closest('.action-menu'))document.querySelector('.action-menu')?.remove()});
showStep();showLoc();
})();
// V105 themed generic date picker
(function(){
 const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
 const pad=n=>String(n).padStart(2,'0');
 let popup=null, active=null, view=null;
 function closePicker(){ popup?.remove(); popup=null; active?.classList.remove('open'); active=null; }
 function render(){
   if(!popup||!view)return;
   popup.querySelector('.zdp-month').textContent=MONTHS[view.getMonth()]+' '+view.getFullYear();
   const grid=popup.querySelector('.zdp-days'); grid.innerHTML='';
   const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());
   const selected=active.dataset.dateValue;
   const today=new Date();
   for(let i=0;i<42;i++){
     const d=new Date(start); d.setDate(start.getDate()+i);
     const iso=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
     const b=document.createElement('button'); b.type='button'; b.textContent=d.getDate();
     if(d.getMonth()!=m)b.classList.add('muted');
     if(iso===selected)b.classList.add('selected');
     if(d.toDateString()===today.toDateString())b.classList.add('today');
     b.onclick=()=>{active.dataset.dateValue=iso;active.querySelector('span').textContent=`${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;closePicker();};
     grid.appendChild(b);
   }
 }
 function openPicker(btn){
   closePicker(); active=btn; btn.classList.add('open');
   const [y,m,d]=(btn.dataset.dateValue||'2025-09-24').split('-').map(Number); view=new Date(y,m-1,d);
   popup=document.createElement('div'); popup.className='z-datepicker';
   popup.innerHTML=`<div class="zdp-head"><strong class="zdp-month"></strong><div class="zdp-nav"><button type="button" data-prev>‹</button><button type="button" data-next>›</button></div></div><div class="zdp-week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div><div class="zdp-days"></div><div class="zdp-foot"><button type="button" data-clear>Clear</button><button type="button" data-today>Today</button></div>`;
   document.body.appendChild(popup);
   const r=btn.getBoundingClientRect(), w=286, h=330;
   popup.style.left=Math.min(innerWidth-w-10,Math.max(10,r.left))+'px';
   popup.style.top=(r.bottom+h<innerHeight?r.bottom+4:Math.max(10,r.top-h-4))+'px';
   popup.querySelector('[data-prev]').onclick=()=>{view.setMonth(view.getMonth()-1);render()};
   popup.querySelector('[data-next]').onclick=()=>{view.setMonth(view.getMonth()+1);render()};
   popup.querySelector('[data-clear]').onclick=()=>{btn.dataset.dateValue='';btn.querySelector('span').textContent='Select date';closePicker()};
   popup.querySelector('[data-today]').onclick=()=>{const t=new Date();btn.dataset.dateValue=`${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`;btn.querySelector('span').textContent=`${pad(t.getDate())}-${pad(t.getMonth()+1)}-${t.getFullYear()}`;closePicker()};
   render();
 }
 document.querySelectorAll('.z-date-field').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openPicker(b)}));
 document.addEventListener('click',e=>{if(popup&&!popup.contains(e.target))closePicker()});
 window.addEventListener('resize',closePicker);
})();
