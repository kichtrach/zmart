(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=$('#arbToast'), modal=$('#successModal');
const notify=(m)=>{toast.textContent=m;toast.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toast.classList.remove('show'),2200)};
const goBack=()=>location.href='rack-bin-management.html';
$('#cancelTop').onclick=goBack; $('#cancelBottom').onclick=goBack;
function setPreview(){
  const type=$('input[name="createType"]:checked').value==='rack'?'Rack':'Bin';
  $('#pvType').textContent=type;$('#pvCode').textContent=$('#rackCode').value||'-';
  const wh=$('#warehouseSelect').value; const m=wh.match(/^(.*) \((.*)\)$/); $('#pvWarehouse').innerHTML=m?`${m[1]}<br>(${m[2]})`:wh;
  $('#pvArea').textContent=$('#areaSelect').value;$('#pvLevels').textContent=$('#levels').value||'-';
  $('#pvDimensions').textContent=`${$('#length').value||0} (L) × ${$('#width').value||0} (W) × ${$('#height').value||0} (H)`;
  $('#pvCapacity').textContent=`${$('#capacity').value||0} kg`;$('#pvStatus').textContent=$('#status').value;
  $('#pvStatus').style.background=$('#status').value==='Active'?'#e7f7ec':'#fff3dd';
}
$$('#rackBinForm input,#rackBinForm select,#rackBinForm textarea').forEach(el=>el.addEventListener('input',setPreview));
$$('input[name="createType"]').forEach(el=>el.addEventListener('change',()=>{const isBin=el.value==='bin'&&el.checked;if(isBin){$('#rackCode').value='BIN-011-01';$('#rackName').value='Aisle 01 Bin 01';$('#levels').value='1';notify('Bin mode selected. Parent rack can now be selected.')}else if(el.checked){$('#rackCode').value='RACK-011';$('#rackName').value='Aisle 01 Rack 03';$('#levels').value='4';}setPreview()}));
$('#colorPicker').addEventListener('input',e=>$('#colorCode').value=e.target.value.toUpperCase());
$('#colorCode').addEventListener('input',e=>{if(/^#[0-9a-fA-F]{6}$/.test(e.target.value))$('#colorPicker').value=e.target.value});
$('#barcodeBtn').onclick=()=>{const parts=[$('#rackCode').value,$('#aisle').value.replace(/\s+/g,''),$('#bay').value.replace(/\s+/g,''),$('#column').value.replace(/\s+/g,''),$('#position').value.replace(/\s+/g,'')];$('#barcode').value=parts.join('-').toUpperCase();notify('Location barcode generated.')};
function addFile(file){if(file.size>5*1024*1024){notify(`${file.name} exceeds 5MB.`);return;}const row=document.createElement('div');row.className='file-row';row.innerHTML=`<i class="fa-regular ${file.type.includes('pdf')?'fa-file-pdf':'fa-file-image'} red"></i><span>${file.name}</span><b>${Math.max(1,Math.round(file.size/1024))} KB</b><i class="fa-regular fa-circle-check ok"></i><button type="button" class="delete-file"><i class="fa-regular fa-trash-can"></i></button>`;$('#uploadedList').appendChild(row)}
$('#attachmentInput').addEventListener('change',e=>[...e.target.files].forEach(addFile));
document.addEventListener('click',e=>{const b=e.target.closest('.delete-file');if(b)b.closest('.file-row').remove()});
const submit=()=>{if(!$('#rackCode').value.trim()||!$('#rackName').value.trim()){notify('Please complete all required rack/bin details.');return;}$('#savedCode').textContent=$('#rackCode').value;modal.classList.add('show');modal.setAttribute('aria-hidden','false')};
$('#rackBinForm').addEventListener('submit',e=>{e.preventDefault();submit()});$('#saveTop').onclick=submit;
$('.success-close').onclick=()=>modal.classList.remove('show');$('#backToList').onclick=goBack;$('#createAnother').onclick=()=>{modal.classList.remove('show');$('#rackCode').value='RACK-012';$('#rackName').value='Aisle 01 Rack 04';setPreview();window.scrollTo({top:0,behavior:'smooth'})};
setPreview();
})();
