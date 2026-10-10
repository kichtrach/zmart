/* ZMart Category Management — one parent-ID based hierarchy shared by both navigation entries. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY='zmart-category-hierarchy-v2', OLD='zmart-category-hierarchy-v1';
const initial=[
['Grocery & Staples','',420],['Fresh Foods','',270],['Beverages','',190],['Snacks & Packaged Foods','',240],['Personal Care','',165],['Home Care','',145],['Household Items','',135],['Baby & Kids','',90],
['Rice & Grains','Grocery & Staples',145],['Pulses & Dals','Grocery & Staples',80],['Flour & Atta','Grocery & Staples',75],['Spices & Masala','Grocery & Staples',70],['Cooking Oils','Grocery & Staples',50],
['Basmati Rice','Rice & Grains',35],['Matta Rice','Rice & Grains',48],['Raw Rice','Rice & Grains',62],['Toor Dal','Pulses & Dals',30],['Moong Dal','Pulses & Dals',28],['Urad Dal','Pulses & Dals',22],['Wheat Atta','Flour & Atta',45],['Rice Flour','Flour & Atta',30],['Turmeric','Spices & Masala',22],['Chilli Powder','Spices & Masala',25],['Coriander Powder','Spices & Masala',23],['Sunflower Oil','Cooking Oils',30],['Coconut Oil','Cooking Oils',20],
['Fruits','Fresh Foods',80],['Vegetables','Fresh Foods',95],['Dairy & Eggs','Fresh Foods',95],['Tropical Fruits','Fruits',38],['Apples & Pears','Fruits',42],['Leafy Greens','Vegetables',35],['Root Vegetables','Vegetables',60],['Milk','Dairy & Eggs',40],['Curd & Yogurt','Dairy & Eggs',30],['Eggs','Dairy & Eggs',25],
['Tea & Coffee','Beverages',80],['Juices','Beverages',60],['Soft Drinks','Beverages',50],['Tea','Tea & Coffee',42],['Coffee','Tea & Coffee',38],['Fruit Juice','Juices',36],['Coconut Water','Juices',24],['Cola','Soft Drinks',30],['Soda','Soft Drinks',20],
['Biscuits','Snacks & Packaged Foods',70],['Chips & Namkeen','Snacks & Packaged Foods',80],['Breakfast Foods','Snacks & Packaged Foods',90],['Cookies','Biscuits',35],['Cream Biscuits','Biscuits',35],['Potato Chips','Chips & Namkeen',42],['Mixtures','Chips & Namkeen',38],['Cereals','Breakfast Foods',45],['Oats','Breakfast Foods',45],
['Hair Care','Personal Care',60],['Skin Care','Personal Care',55],['Oral Care','Personal Care',50],['Shampoo','Hair Care',32],['Hair Oil','Hair Care',28],['Soap','Skin Care',28],['Body Lotion','Skin Care',27],['Toothpaste','Oral Care',30],['Toothbrushes','Oral Care',20],
['Laundry','Home Care',60],['Cleaning Supplies','Home Care',55],['Air Fresheners','Home Care',30],['Detergent Powder','Laundry',35],['Fabric Softener','Laundry',25],['Floor Cleaner','Cleaning Supplies',30],['Dishwash','Cleaning Supplies',25],
['Kitchen & Dining','Household Items',70],['Storage & Organization','Household Items',65],['Containers','Kitchen & Dining',40],['Kitchen Tools','Kitchen & Dining',30],['Plastic Storage','Storage & Organization',35],['Baskets','Storage & Organization',30],
['Baby Food','Baby & Kids',35],['Diapers','Baby & Kids',30],['Baby Toiletries','Baby & Kids',25]
];
function seed(){const byName=new Map();const a=initial.map(([name,,products],i)=>{const n={id:'cat-'+(i+1),code:'CAT-'+String(i+1).padStart(3,'0'),name,parentId:null,status:name==='Baby Care'?'Inactive':'Active',products,order:i+1,description:''};byName.set(name,n.id);return n});a.forEach((n,i)=>n.parentId=byName.get(initial[i][1])||null);return a}
let nodes;try{nodes=JSON.parse(localStorage.getItem(KEY));if(!Array.isArray(nodes)||nodes.length===0)throw Error()}catch{nodes=null}
if(!nodes){nodes=seed();try{const old=JSON.parse(localStorage.getItem(OLD));if(Array.isArray(old)){const byName=new Map(nodes.map(n=>[n.name,n.id]));old.forEach(n=>{if(!byName.has(n.name)){const id='cat-import-'+byName.size;byName.set(n.name,id);nodes.push({id,code:'CAT-'+String(byName.size).padStart(3,'0'),name:n.name,parentId:null,status:n.status||'Active',products:Number(n.products)||0,order:byName.size,description:''})}});old.forEach(n=>{const target=nodes.find(x=>x.name===n.name);if(target&&n.parent)target.parentId=byName.get(n.parent)||null})}}catch{}}
let selected=nodes[0]?.id||null, editing=null, expanded=new Set(nodes.map(n=>n.id)), view='tree';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(nodes))}catch(err){console.warn('Category storage unavailable',err)}};save();
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=id=>nodes.find(n=>n.id===id);
const sortNodes=arr=>{const mode=$('#filterSort')?.value||'order';return arr.sort((a,b)=>mode==='name'?a.name.localeCompare(b.name):mode==='name-desc'?b.name.localeCompare(a.name):mode==='products'?(b.products||0)-(a.products||0):mode==='level'?level(a)-level(b)||a.name.localeCompare(b.name):a.order-b.order||a.name.localeCompare(b.name))};
const kids=id=>sortNodes(nodes.filter(n=>n.parentId===id));
const descendants=id=>{const result=new Set();function walk(v){kids(v).forEach(n=>{if(!result.has(n.id)){result.add(n.id);walk(n.id)}})}walk(id);return result};
const level=n=>{let depth=1,p=n.parentId,seen=new Set([n.id]);while(p&&get(p)&&!seen.has(p)){depth++;seen.add(p);p=get(p).parentId}return depth};
const path=n=>{const names=[n.name],seen=new Set([n.id]);let p=n.parentId;while(p&&get(p)&&!seen.has(p)){seen.add(p);names.unshift(get(p).name);p=get(p).parentId}return names.join(' → ')};
const toast=msg=>{const el=$('#categoryToast');if(el){el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}};
function render(){const q=$('#categorySearch').value.trim().toLowerCase(),st=$('#filterStatus').value;
const lv=$('#filterLevel').value,par=$('#filterParent').value,mapping=$('#filterMapping').value;
const parentSelect=$('#filterParent');const keep=parentSelect.value;
parentSelect.innerHTML='<option value="all">All Parent Categories</option><option value="root">Root / Major Categories</option>'+nodes.slice().sort((a,b)=>path(a).localeCompare(path(b))).map(n=>`<option value="${esc(n.id)}">${esc(path(n))}</option>`).join('');parentSelect.value=keep;
const matches=n=>(!q||(path(n)+' '+n.code).toLowerCase().includes(q))&&(st==='All Status'||n.status===st)&&(lv==='all'||(lv==='4+'?level(n)>=4:level(n)===Number(lv)))&&(par==='all'||(par==='root'?!n.parentId:n.parentId===par))&&(mapping==='all'||(mapping==='mapped'?(Number(n.products)||0)>0:(Number(n.products)||0)===0));
const filtering=!!q||st!=='All Status'||lv!=='all'||par!=='all'||mapping!=='all';
const branch=(n,depth,seen=new Set())=>{if(seen.has(n.id))return '';const next=new Set(seen);next.add(n.id);const children=kids(n.id);const childHTML=children.map(x=>branch(x,depth+1,next)).join('');if(!matches(n)&&!childHTML)return '';const opened=expanded.has(n.id)||filtering;return `<div class="category-tree-branch"><div class="category-tree-row ${selected===n.id?'selected':''}" style="padding-left:${12+depth*22}px"><button class="category-tree-toggle" data-toggle="${esc(n.id)}" ${children.length?'':'disabled'} aria-label="Expand or collapse">${children.length?(opened?'▾':'▸'):'·'}</button><button class="category-node-name" data-select="${esc(n.id)}"><i class="fa-${children.length?'solid':'regular'} fa-folder${children.length?'-open':''}"></i><span>${esc(n.name)}</span></button><span class="category-tree-meta">Level ${depth+1} · ${n.products||0} products</span><span class="cat-status ${n.status==='Active'?'active':'inactive'}">${esc(n.status)}</span><button class="cat-btn" data-add="${esc(n.id)}" title="Add child category"><i class="fa-solid fa-plus"></i> Child</button><button class="cat-btn" data-edit="${esc(n.id)}" title="Edit category"><i class="fa-solid fa-pen"></i></button><button class="cat-btn" data-remove="${esc(n.id)}" title="Delete category"><i class="fa-solid fa-trash"></i></button></div>${opened?childHTML:''}</div>`};
$('#categoryTreeNodes').innerHTML=kids(null).map(n=>branch(n,0)).join('')||'<p class="category-tree-empty">No categories match your filters.</p>';
const sel=get(selected);$('#categoryTreeDetails').innerHTML=sel?`<strong>${esc(sel.name)}</strong><span>${esc(path(sel))}</span><span>Code: ${esc(sel.code)} · Level ${level(sel)} · ${sel.products||0} products · ${esc(sel.status)}</span>`:'Select a category to view its details.';
const filtered=sortNodes(nodes.filter(matches));
$('#categoryTable tbody').innerHTML=filtered.map((n,i)=>`<tr><td>${i+1}</td><td><span class="folder"><i class="fa-regular fa-folder"></i></span>${esc(n.name)}<small class="category-path">${esc(path(n))}</small></td><td>${n.products||0}</td><td><span class="cat-status ${n.status==='Active'?'active':'inactive'}">${esc(n.status)}</span></td><td>${esc(n.code)}</td><td><button class="cat-btn" data-edit="${esc(n.id)}">Edit</button> <button class="cat-btn" data-add="${esc(n.id)}">+ Child</button></td></tr>`).join('');
$('#categoryTable thead').innerHTML='<tr><th>#</th><th>Category / Full Path</th><th>Products</th><th>Status</th><th>Code</th><th>Actions</th></tr>';
$('#categoryCount').textContent=`Showing ${filtered.length} of ${nodes.length} categories`;
const k=$$('.cat-kpis article strong');if(k.length>=4){k[0].textContent=nodes.length;k[1].textContent=nodes.filter(n=>n.status==='Active').length;k[2].textContent=nodes.filter(n=>n.status!=='Active').length;k[3].textContent=nodes.reduce((a,n)=>a+(Number(n.products)||0),0).toLocaleString()}
}
function switchView(v){view=v;$('#categoryTreePanel').hidden=v!=='tree';$('.cat-table-wrap').hidden=v==='tree';$('.cat-table-foot').hidden=v==='tree';$('#categoryTreeView').classList.toggle('primary',v==='tree');$('#categoryListView').classList.toggle('primary',v==='list');render()}
function nextCategoryCode(){const used=new Set(nodes.map(n=>n.code));let i=1;while(used.has('CAT-'+String(i).padStart(6,'0')))i++;return 'CAT-'+String(i).padStart(6,'0')}
function modal(id=null,parentId=null){
 editing=id;const n=get(id),exclude=id?descendants(id):new Set();
 const actualParent=n?n.parentId:parentId;
 const depth=actualParent?level(get(actualParent))+1:1;
 const kind=depth===1?'Major Category':depth===2?'Category':'Subcategory';
 const options=nodes.filter(x=>x.id!==id&&!exclude.has(x.id)).sort((a,b)=>path(a).localeCompare(path(b)));
 $('#modalParentCategory').innerHTML='<option value="">No parent — Major Category</option>'+options.map(x=>`<option value="${esc(x.id)}">${esc(path(x))}</option>`).join('');
 $('#categoryModalTitle').textContent=(n?'Edit ':'Add ')+kind;
 $('#modalCategoryName').value=n?.name||'';
 $('#modalCategoryCode').value=n?.code||nextCategoryCode();
 $('#modalCategoryCode').readOnly=true;
 $('#modalParentCategory').value=actualParent||'';
 const parentField=$('#modalParentCategoryField');
 parentField.hidden=!n&&!actualParent;
 $('#modalParentCategory').required=!n&&!!actualParent;
 $('#modalParentCategory').disabled=!n&&!actualParent;
 parentField.firstChild.textContent='Parent Category';
 $('#modalStatus').value=n?.status||'Active';
 $('#modalDisplayOrder').value=n?.order||Math.max(0,...nodes.filter(x=>x.parentId===(actualParent||null)).map(x=>Number(x.order)||0))+1;
 $('#modalCategoryDescription').value=n?.description||'';
 $('#categorySaveButton').textContent=n?'Save Changes':'Save Category';
 $('#categoryModal').classList.add('show');
 $('#modalCategoryName').focus();
}
function close(){$('#categoryModal').classList.remove('show')}
$('#modalParentCategory').addEventListener('change',()=>{const p=$('#modalParentCategory').value;const depth=p&&get(p)?level(get(p))+1:1;$('#categoryModalTitle').textContent=(editing?'Edit ':'Add ')+(depth===1?'Major Category':depth===2?'Category':'Subcategory')});
$('#categoryForm').addEventListener('submit',e=>{e.preventDefault();const name=$('#modalCategoryName').value.trim(),code=$('#modalCategoryCode').value.trim(),parentId=$('#modalParentCategory').disabled?null:($('#modalParentCategory').value||null);if(!name||!code)return;if(nodes.some(n=>n.id!==editing&&n.parentId===parentId&&n.name.toLowerCase()===name.toLowerCase()))return alert('This category already exists under the selected parent.');if(nodes.some(n=>n.id!==editing&&n.code.toLowerCase()===code.toLowerCase()))return alert('Category code must be unique.');if(editing&&(parentId===editing||descendants(editing).has(parentId)))return alert('Cannot move a category under its own descendant.');const data={code,name,parentId,status:$('#modalStatus').value,order:Number($('#modalDisplayOrder').value)||1,description:$('#modalCategoryDescription').value.trim()};if(editing)Object.assign(get(editing),data);else{data.id='cat-'+Date.now();data.products=0;nodes.push(data)}selected=editing||data.id;if(parentId){expanded.add(parentId);let p=get(parentId);while(p?.parentId){expanded.add(p.parentId);p=get(p.parentId)}}save();close();render();toast(editing?'Category updated successfully':'Category saved successfully')});
$('#categoryTreeNodes').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.toggle){expanded.has(d.toggle)?expanded.delete(d.toggle):expanded.add(d.toggle);render()}else if(d.select){selected=d.select;render()}else if(d.add)modal(null,d.add);else if(d.edit)modal(d.edit);else if(d.remove)remove(d.remove)});
function remove(id){const n=get(id);if(!n)return;if(kids(id).length)return alert('Move or remove child categories before deleting this category.');if(n.products>0)return alert('Cannot delete a category with mapped products.');if(!confirm('Delete '+n.name+'?'))return;nodes=nodes.filter(x=>x.id!==id);if(selected===id)selected=null;save();render();toast('Category deleted')}
$('#categoryTable').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.add)modal(null,b.dataset.add);else if(b.dataset.edit)modal(b.dataset.edit)});
$('#categoryTreeView').onclick=()=>switchView('tree');$('#categoryListView').onclick=()=>switchView('list');$('#expandCategoryTree').onclick=()=>{expanded=new Set(nodes.map(n=>n.id));render()};$('#collapseCategoryTree').onclick=()=>{expanded.clear();render()};$('#newRootCategory').onclick=()=>modal();$('#addCategoryTop').onclick=()=>modal();$('#addCategoryQuick')?.addEventListener('click',()=>modal());$('#closeCategoryModal').onclick=close;$('#cancelCategoryModal').onclick=close;$('#categoryModal').addEventListener('click',e=>{if(e.target.id==='categoryModal')close()});$('#applyCategoryFilter').onclick=render;$('#categorySearch').addEventListener('input',render);['filterStatus','filterLevel','filterParent','filterMapping','filterSort'].forEach(id=>$('#'+id).addEventListener('change',render));$('#resetCategoryFilter').onclick=()=>{$('#categorySearch').value='';$('#filterStatus').value='All Status';$('#filterLevel').value='all';$('#filterParent').value='all';$('#filterMapping').value='all';$('#filterSort').value='order';render()};$('#categoryHierarchy')?.addEventListener('click',()=>switchView('tree'));
$('#categoryReport')?.addEventListener('click',()=>switchView('list'));
if(new URLSearchParams(location.search).get('view')==='subcategories'){$('.cat-list-head h3').textContent='Subcategory Management — Unified Hierarchy';switchView('tree')}else switchView('tree');
})();
/* V320: honor overview shortcuts after category UI has initialized. */
window.addEventListener('load', function(){
  var query=new URLSearchParams(window.location.search);
  if(query.get('view')==='list') document.getElementById('categoryListView')?.click();
  if(query.get('action')==='add') document.getElementById('addCategoryTop')?.click();
});
