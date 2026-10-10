(()=>{'use strict';const KEY='zmart_item_master_records_v1',CONFIG='zmart_product_master_configuration_v1';const $=id=>document.getElementById(id);const base=[['ITM-000001','Aachi Basmati Rice 1kg','8901234567890','Grocery','Aachi',120,'Active'],['ITM-000002','Tata Salt 1kg','8901030425112','Grocery','Tata',38,'Active'],['ITM-000003','Dabur Honey 500g','8901207006294','Grocery','Dabur',155,'Active'],['ITM-000004','Ariel Matic 1kg','4902430650231','Home Care','P&G',210,'Active'],['ITM-000005','Colgate Strong Teeth 200g','8901023011236','Personal Care','Colgate',85,'Active'],['ITM-000006','Parle-G Original 250g','8901719000010','Biscuits','Parle',20,'Active'],['ITM-000007','Amul Taaza Milk 1L','8901262100018','Dairy','Amul',56,'Active'],['ITM-000008','Britannia Good Day 200g','8901063310291','Biscuits','Britannia',32,'Inactive']].map(x=>({code:x[0],name:x[1],barcode:x[2],category:x[3],brand:x[4],price:x[5],status:x[6],attributes:{}}));let records;try{records=JSON.parse(localStorage.getItem(KEY))||base}catch{records=base}let editing=-1,readonly=false;const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));function persist(){localStorage.setItem(KEY,JSON.stringify(records))}function toast(msg){$('itemToast').textContent=msg;setTimeout(()=>$('itemToast').textContent='',2600)}function render(){const search=$('itemSearch').value.trim().toLowerCase(),cat=$('itemCategoryFilter').value,status=$('itemStatusFilter').value;const cats=[...new Set(records.map(r=>r.category).filter(Boolean))].sort();$('itemCategoryFilter').innerHTML='<option value="">All Categories</option>'+cats.map(c=>`<option ${cat===c?'selected':''}>${escape(c)}</option>`).join('');const shown=records.map((r,i)=>({...r,i})).filter(r=>(!search||[r.code,r.name,r.barcode,r.brand,r.category].some(v=>String(v||'').toLowerCase().includes(search)))&&(!cat||r.category===cat)&&(!status||r.status===status));$('itemRows').innerHTML=shown.map((r,n)=>`<tr><td><input type="checkbox" class="im-item-check" data-code="${escape(r.code)}"></td><td>${n+1}</td><td>${escape(r.code)}</td><td><strong>${escape(r.name)}</strong></td><td>${escape(r.barcode)}</td><td>${escape(r.category)}</td><td>${escape(r.brand)}</td><td>₹ ${Number(r.price||0).toFixed(2)}</td><td><span class="im-pill ${r.status==='Inactive'?'off':''}">${escape(r.status)}</span></td><td><button data-action="view" data-i="${r.i}">View</button><button data-action="edit" data-i="${r.i}">Edit</button><button data-action="status" data-i="${r.i}">${r.status==='Active'?'Deactivate':'Activate'}</button></td></tr>`).join('')||'<tr><td colspan="10">No items found</td></tr>';$('itemCount').textContent=`Showing ${shown.length} of ${records.length} items`;}const core=[['name','Item Name','text',true],['code','Item Code','text',true],['barcode','Barcode','text'],['category','Category','select',true,['Grocery','Home Care','Personal Care','Dairy','Biscuits','Beverages','Stationery']],['brand','Brand','text'],['price','Selling Price (₹)','number'],['status','Status','select',true,['Active','Inactive']]];const MATRIX_KEY='zmart_product_master_matrix_v2';
const aliases={
 'Item Name':['Item Name','Product Name'], 'Item Code':['Item Code'],
 'Short Name':['Short Name','Alternate Name'], 'Manufacturer Name':['Manufacturer Name','Manufacturer'],
 'Supplier Name':['Supplier Name','Default Supplier','Supplier'],
 'Alias':['Alias'], 'Item Product Type':['Item Product Type','Item Type'],
 'Category':['Category'],'Sub-Category':['Sub-Category','Sub Category'],
 'Brand':['Brand'], 'HSN Code':['HSN Code'],
 'GST Code':['GST Code','GST / Tax Rate','GST Rate','Tax Category'],
 'GST UOM':['GST UOM'], 'UPC/EAN Code':['UPC/EAN Code','EAN / UPC Code','Barcode'],
 'Custom Barcode Profile':['Custom Barcode Profile'],
 'Batch/Expiry Date Details':['Batch/Expiry Date Details','Batch Control'],
 'Item Preparations Status':['Item Preparations Status'],
 'Batch / Expiry Optional':['Batch / Expiry Optional'],
 'Decimal Point':['Decimal Point'], 'Apply Selling Rate From Master':['Apply Selling Rate From Master'],
 'Minimum Days From Expiry':['Minimum Days From Expiry','Expiry Alert Days'],
 'Expiry Date Format':['Expiry Date Format'], 'Sell By':['Sell By'],
 'Item Per Unit':['Item Per Unit'],
 'Maintain Selling & M.R.P By':['Maintain Selling & M.R.P By'],
 'Is Weighable':['Is Weighable'], 'Selling Price (₹)':['Selling Price (₹)','Selling Price','Default Selling Price'],
 'Status':['Status']
};
function configuration(){try{return JSON.parse(localStorage.getItem(MATRIX_KEY))||{}}catch{return {}}}
function normalized(){const c=configuration(),out=[];for(const [key,rule] of Object.entries(c)){if(!key.includes('::')||!rule||typeof rule!=='object')continue;const [group,...rest]=key.split('::');out.push({group,name:rest.join('::'),mandatory:rule.mandatory,visible:rule.visible,value:rule.value})}return out}
function configFor(label){
 const c=configuration(),names=[...(aliases[label]||[label]),label];
 const canonical=v=>String(v).toLowerCase().replace(/[^a-z0-9]/g,'');
 const wanted=new Set(names.map(canonical));
 const entries=Object.entries(c).filter(([k,v])=>k.includes('::')&&v&&typeof v==='object'&&wanted.has(canonical(k.slice(k.indexOf('::')+2))));
 // The Item Master Attributes section is authoritative when the same field appears in multiple groups.
 entries.sort((a,b)=>Number(b[0].startsWith('Item Master Attributes::'))-Number(a[0].startsWith('Item Master Attributes::')));
 return entries.length?entries[0][1]:null;
}
function configuredDefault(cfg){return cfg?.value??cfg?.defaultValue}
function field(key,label,type,required,options,value,disabled){let cfg=configFor(label);if(cfg&&cfg.visible===false&&!required)return '';if(cfg&&cfg.mandatory!==undefined)required=required||cfg.mandatory;let val=value??cfg?.defaultValue??cfg?.value??'';let control=type==='select'?`<select name="${escape(key)}" ${required?'required':''} ${disabled?'disabled':''}>${(options||[]).map(o=>`<option value="${escape(o)}" ${String(val)===String(o)?'selected':''}>${escape(o)}</option>`).join('')}</select>`:`<input name="${escape(key)}" type="${type}" value="${escape(val)}" ${required?'required':''} ${disabled?'readonly':''} ${type==='number'?'min="0" step="0.01"':''}>`;return `<label class="im-field"><span class="im-field-caption">${escape(label)}${required?' <span class="req">*</span>':''}</span>${control}</label>`}const sections=[
['Item Information',[
['name','Item Name','text',true],['shortName','Short Name','text',true],['manufacturer','Manufacturer Name','select',true,['Aachi','Tata','Dabur','P&G','Colgate','Parle','Amul','Britannia','ITC','HUL']],['supplier','Supplier Name','select',true,['Local Distributor','Metro Wholesale','Reliance Wholesale','Direct Supplier','Regional Supplier']],['alias','Alias','text']]],
['Category Information',[
['productType','Item Product Type','select',false,['Standard','Variant','Combo','Service','Weighable']],['category','Category','select',true,['Grocery','Home Care','Personal Care','Dairy','Biscuits','Beverages','Stationery']],['subCategory','Sub-Category','select',false,['Rice & Grains','Pulses & Dal','Edible Oils','Atta, Flours & Sooji','Milk','Soap','Shampoo','Snacks']],['brand','Brand','text']]],
['Tax Information',[
['hsn','HSN Code','text'],['gst','GST Code','select',true,['Select GST','0%','5%','12%','18%','28%']],['gstUom','GST UOM','select',false,['NOS','KGS','GMS','LTR','MLT','PAC','BOX']]]],
['EAN Code/Barcode Configurations',[
['barcode','UPC/EAN Code','text'],['barcodeProfile','Custom Barcode Profile','select',false,['Profile 1','Profile 2','EAN-13','UPC-A','Code 128']]]],
['Packing',[
['batchExpiry','Batch/Expiry Date Details','select',false,['Not Required','Batch Only','Expiry Only','Batch and Expiry']],['preparation','Item Preparations Status','select',false,['Trade As Is','Prepared Item','Manufactured Item']],['batchOptional','Batch / Expiry Optional','select',false,['Not Applicable','Optional','Mandatory']]]],
['Item Properties',[
['decimalPoint','Decimal Point','number',true],['applySellingRate','Apply Selling Rate From Master','checkbox'],['minExpiryDays','Minimum Days From Expiry','number'],['expiryFormat','Expiry Date Format','select',false,['None','MM/YYYY','DD/MM/YYYY','YYYY-MM-DD']]]],
['Pricing',[
['sellBy','Sell By','select',false,['None','Piece','Weight','Volume','Pack']],['itemPerUnit','Item Per Unit','number',true],['maintainSelling','Maintain Selling & M.R.P By','select',false,['Multiple Selling Price & Multiple MRP','Single Selling Price','Batch Wise','Outlet Wise']],['weighable','Is Weighable','checkbox'],['price','Selling Price (₹)','number']]],
['Other Details',[
['code','Item Code','text',true],['status','Status','select',true,['Active','Inactive']]]]
];
const initial={productType:'Standard',barcodeProfile:'Profile 1',batchExpiry:'Not Required',preparation:'Trade As Is',batchOptional:'Not Applicable',decimalPoint:0,expiryFormat:'None',sellBy:'None',itemPerUnit:1,maintainSelling:'Multiple Selling Price & Multiple MRP',gstUom:'NOS',status:'Active'};
function sectionField(def,r,view){
const [key,label,type,baseRequired,options]=def;
const cfg=configFor(label);
if(cfg?.visible===false&&!['name','code'].includes(key))return '';
const required=['name','code'].includes(key)|| (cfg ? !!cfg.mandatory : !!baseRequired);
const value=r[key]??r.attributes?.[label]??configuredDefault(cfg)??initial[key]??'';
let control;
if(type==='checkbox')control=`<input class="im-toggle" type="checkbox" name="${escape(key)}" value="Yes" ${value===true||value==='Yes'?'checked':''} ${view?'disabled':''}>`;
else if(type==='select')control=`<select name="${escape(key)}" ${required?'required':''} ${view?'disabled':''}><option value="">Select ${escape(label)}</option>${(options||[]).map(o=>`<option value="${escape(o)}" ${String(value)===String(o)?'selected':''}>${escape(o)}</option>`).join('')}</select>`;
else control=`<input name="${escape(key)}" type="${type}" value="${escape(value)}" ${required?'required':''} ${view?'readonly':''} ${type==='number'?'min="0" step="any"':''}>`;
return `<label class="im-field ${type==='checkbox'?'im-switch-field':''}"><span class="im-field-caption">${escape(label)}${required?' <span class="req">*</span>':''}</span>${control}</label>`;
}
function open(i=-1,view=false){
editing=i;readonly=view;
const r=i<0?{}:records[i];
$('itemDialogTitle').textContent=view?'Item Details':i<0?'Add New Item':'Edit Item';
let html=sections.map(([heading,defs],index)=>`<section class="im-form-section"><h3>${escape(heading)}</h3><div class="im-section-grid">${defs.map(d=>sectionField(d,r,view)).join('')}</div></section>`).join('');
const used=new Set(sections.flatMap(x=>x[1].map(y=>y[1].toLowerCase())));
const mapped=new Set(Object.values(aliases).flat().map(x=>x.toLowerCase()));
// Prefer the Item Master Attributes entry when an attribute is defined in multiple groups.
const all=normalized();const byName=new Map();
for(const attr of all){const normalizedName=attr.name.toLowerCase().replace(/[^a-z0-9]/g,'');if(!byName.has(normalizedName)||attr.group==='Item Master Attributes')byName.set(normalizedName,attr)}
const extras=[...byName.values()].filter(a=>a.visible===true&&!used.has(a.name.toLowerCase())&&!mapped.has(a.name.toLowerCase()));
if(extras.length){
let fields='',seen=new Set();
for(const a of extras){const label=a.name||a.label||a.attributeName;if(!label||seen.has(label))continue;seen.add(label);const val=r.attributes?.[label]??configuredDefault(a)??'';const bool=/^(allow|enable|is )/i.test(label)||['yes','no'].includes(String(val).toLowerCase());fields+=field('attr_'+label,label,bool?'select':'text',!!a.mandatory,bool?['Yes','No']:null,val,view)}
html+=`<section class="im-form-section"><h3>Additional Item Master Attributes</h3><div class="im-section-grid">${fields}</div></section>`;
}
$('itemFields').innerHTML=html;
$('itemForm').querySelector('button[type=submit]').hidden=view;
$('itemOverlay').hidden=false;
}
function close(){$('itemOverlay').hidden=true}document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const i=+b.dataset.i;if(b.dataset.action==='status'){records[i].status=records[i].status==='Active'?'Inactive':'Active';persist();render();toast('Status updated')}else open(i,b.dataset.action==='view')});$('itemForm').addEventListener('submit',e=>{e.preventDefault();if(readonly)return;const f=new FormData(e.currentTarget),obj=editing<0?{attributes:{}}:{...records[editing],attributes:{...records[editing].attributes}};for(const key of ['applySellingRate','weighable'])if(e.currentTarget.elements.namedItem(key))obj[key]=f.has(key)?'Yes':'No';for(const [k,v]of f){if(k.startsWith('attr_'))obj.attributes[k.slice(5)]=v;else obj[k]=k==='price'?Number(v):v}if(records.some((r,i)=>r.code===obj.code&&i!==editing)){toast('Item Code already exists');return}if(editing<0)records.unshift(obj);else records[editing]=obj;persist();render();close();toast(editing<0?'Item created':'Item updated')});$('addItem').onclick=()=>open();$('closeItem').onclick=close;$('cancelItem').onclick=close;$('itemOverlay').addEventListener('click',e=>{if(e.target===$('itemOverlay'))close()});$('itemSearch').oninput=render;$('itemCategoryFilter').onchange=render;$('itemStatusFilter').onchange=render;$('resetFilters').onclick=()=>{$('itemSearch').value='';$('itemCategoryFilter').value='';$('itemStatusFilter').value='';render()};document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});render();window.ZMartItemMaster={getRecords:()=>records,refresh:render,persist};})();