/* Shared Item Master Attributes mapping for Add Product and Edit Product. */
(()=>{'use strict';
const KEY='zmart_product_master_matrix_v2';
const fields={
'Item Name':'pName','Item Code':'pItemCode','Barcode':'pBarcode','Category':'pCategory','Sub Category':'pSubCategory','Brand':'pBrand','Unit':'pUnit','GST / Tax Rate':'pTax','HSN Code':'pHsn','Selling Price':'pSelling','Cost Price':'pCost','Purchase Price':'pPurchase','Maximum Retail Price':'pMrp','Reorder Level':'pReorder','Opening Stock':'pOpening','Stock Tracking':'pTrack','Description':'pDescription','Packing Type':'pPackType','Packing Size':'pPackSize','Batch Number':'pBatchNumber','Expiry Date':'pExpiryDate','Shelf Life':'pShelf','Weight':'pWeight','Country of Origin':'pCountry','Manufacturer':'pManufacturer'
};
const aliases={'Product Name':'Item Name','MRP':'Maximum Retail Price','GST Rate':'GST / Tax Rate'};
const protectedFields=new Set(['Item Name','Item Code']);
const baselineRequired=new Set(['Item Name','Item Code']);
function config(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return {}}}
const popupIds={'Item Name':'newProductName','Item Code':'newProductItemCode','Barcode':'newProductBarcode','Category':'newProductCategory','Sub Category':'newProductSub','Brand':'newProductBrand','Unit':'newProductUnit','Purchase Price':'newProductPurchase','Selling Price':'newProductPrice','GST / Tax Rate':'newProductTax','HSN Code':'newProductHsn','Reorder Level':'newProductReorder','Opening Stock':'newProductStock','Status':'newProductStatus','Description':'newProductDescription'};
function findInput(name,root=document){if(root.id==='productModal'){const popup=root.querySelector('#'+popupIds[name]);if(popup)return popup}let id=fields[name];if(id){let el=root.querySelector('#'+id);if(el)return el}if(name==='Country of Origin'||name==='Manufacturer'){const labels=[...root.querySelectorAll('.ap-field > label')];const label=labels.find(x=>x.textContent.trim().toLowerCase()===name.toLowerCase());return label?.closest('.ap-field')?.querySelector('input,select')||null}return null}
function configFor(name,data){return data['Item Master Attributes::'+name]||data['Item Master Attributes::'+(aliases[name]||name)]||null}
function setDefault(el,val){if(val===undefined||val===null||String(val).trim()==='')return;if(el.type==='checkbox'){el.checked=/^(yes|true|1|active)$/i.test(String(val));return}if(el.tagName==='SELECT'){const match=[...el.options].find(o=>o.value.toLowerCase()===String(val).toLowerCase()||o.textContent.trim().toLowerCase()===String(val).toLowerCase()||o.textContent.toLowerCase().includes('gst '+String(val).replace('%','')+'%'));if(match)el.value=match.value;return}if(el.type==='date'&&!/^\d{4}-\d\d-\d\d$/.test(String(val)))return;el.value=String(val);el.dispatchEvent(new Event('input',{bubbles:true}))}
function apply(root=document,{defaults=true}={}){const data=config(),active=[];Object.keys(fields).forEach(name=>{const el=findInput(name,root),rule=configFor(name,data);if(!el||!rule)return;const wrap=el.closest('.ap-field')||el.closest('label');if(!wrap)return;const required=protectedFields.has(name)||!!rule.mandatory;const visible=protectedFields.has(name)||rule.visible!==false;wrap.hidden=!visible;wrap.style.display=visible?'':'none';el.required=required;el.dataset.masterRequired=required?'1':'0';el.dataset.masterName=name;const label=wrap.matches('label')?wrap:(wrap.querySelector('label')||null);if(label){let star=label.querySelector('.master-required');if(required&&!label.querySelector('.req')&&!star){star=document.createElement('span');star.className='master-required';star.textContent=' *';star.style.color='#e11d48';label.appendChild(star)}if(!required&&star)star.remove();const existing=label.querySelector('.field-label-inline em');if(existing)existing.style.display=required?'':'none';if(!required){const req=label.querySelector('.req');if(req)req.style.display='none'}else{const req=label.querySelector('.req');if(req)req.style.display=''}}if(defaults)setDefault(el,rule.value);if(visible&&required)active.push(el)});return active}
function validate(root=document){for(const el of root.querySelectorAll('[data-master-required="1"]')){if(el.closest('[hidden]')||el.closest('.ap-field')?.hidden||el.closest('.ap-field')?.style.display==='none')continue;if(el.type==='checkbox'?!el.checked:!String(el.value).trim()){el.focus();el.style.borderColor='#dc2626';setTimeout(()=>el.style.borderColor='',1800);return false}}return true}
function extendPopup(root,{defaults=true}={}){
 const grid=root.querySelector('.add-product-grid');if(!grid)return;
 grid.querySelectorAll('[data-master-extra]').forEach(x=>x.remove());
 const data=config();const extras=Object.entries(data).filter(([key,v])=>key.startsWith('Item Master Attributes::')&&v&&v.visible!==false);
 extras.forEach(([key,rule])=>{
  const name=key.split('::').slice(1).join('::');if(findInput(name,root))return;
  const label=document.createElement('label');label.dataset.masterExtra=name;label.className='master-extra-field';
  label.appendChild(document.createTextNode(name));if(rule.mandatory){const em=document.createElement('em');em.textContent=' *';em.style.color='#e11d48';label.appendChild(em)}
  const control=document.createElement('input');control.type=/date/i.test(name)?'date':/price|stock|quantity|weight|level|size|factor/i.test(name)?'number':'text';
  control.dataset.masterName=name;control.dataset.masterRequired=rule.mandatory?'1':'0';control.required=!!rule.mandatory;
  if(defaults&&rule.value!=null&&rule.value!=='')control.value=String(rule.value);
  label.appendChild(control);grid.appendChild(label)
 });
 const existing=root.querySelector('.master-map-caption');if(existing)existing.remove();
}
const originalApply=apply;
function extendEdit(root){
 const grid=root.querySelector('.modal-form');if(!grid)return;
 grid.querySelectorAll('[data-master-extra]').forEach(el=>el.remove());
 const data=config();
 Object.entries(data).forEach(([key,rule])=>{
  if(!key.startsWith('Item Master Attributes::')||!rule||rule.visible===false)return;
  const name=key.slice('Item Master Attributes::'.length);
  if(findInput(name,root))return;
  const label=document.createElement('label');label.dataset.masterExtra=name;label.className='master-extra-field';
  label.textContent=name+(rule.mandatory?' *':'');
  const input=document.createElement('input');input.dataset.masterName=name;input.dataset.masterRequired=rule.mandatory?'1':'0';input.required=!!rule.mandatory;
  input.value=window.ZMartProductAttributeValues?.[name]??String(rule.value??'');label.appendChild(input);grid.appendChild(label);
 });
}
function applyAll(root=document,opts={}){const result=originalApply(root,opts);if(root.id==='productModal'){if(root.querySelector('.add-product-grid'))extendPopup(root,opts);else extendEdit(root)}return result}
function collect(root){const values={};root.querySelectorAll('[data-master-name]').forEach(el=>{if(!el.closest('[hidden]')&&!el.closest('[style*=\"display: none\"]'))values[el.dataset.masterName]=el.type==='checkbox'?el.checked:el.value});return values}

window.ZMartItemMasterMapping={apply:applyAll,validate,config,fields,collect};
window.addEventListener('pageshow',()=>{if(document.querySelector('#productFormView'))apply(document,{defaults:true})});
if(document.querySelector('#productFormView')){apply(document,{defaults:true});const save=document.querySelector('#saveProduct');if(save){save.addEventListener('click',e=>{if(!validate(document)){e.preventDefault();e.stopImmediatePropagation()}},true)}}
})();
