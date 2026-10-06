(()=>{let step=1;const pages=[...document.querySelectorAll('.dc-page')],tabs=[...document.querySelectorAll('.dc-stepper button')],next=document.querySelector('#next'),prev=document.querySelector('#prev');function render(){pages.forEach(x=>x.classList.toggle('active',+x.dataset.page===step));tabs.forEach(x=>{x.classList.toggle('active',+x.dataset.step===step);x.classList.toggle('done',+x.dataset.step<step)});prev.style.visibility=step===1?'hidden':'visible';next.innerHTML=step===5?'Close Business Day <i class="fa-solid fa-lock"></i>':'Next <i class="fa-solid fa-arrow-right"></i>'}next.onclick=()=>{if(step<5){step++;render()}else{if(!document.querySelector('#finalAck').checked){alert('Please confirm the final closure checklist.');return}document.querySelector('#success').classList.add('show')}};prev.onclick=()=>{if(step>1){step--;render()}};tabs.forEach(t=>t.onclick=()=>{step=+t.dataset.step;render()});document.querySelector('#draft').onclick=()=>alert('Day close draft saved successfully.');render()})();
// V240: replace browser-native selects in Close Business Day with ZMart generic dropdowns
(function(){
  function closeAll(except){document.querySelectorAll('.dcw .dc-select.open').forEach(function(x){if(x!==except)x.classList.remove('open');});}
  function enhance(sel){
    if(sel.dataset.dcEnhanced==='1') return;
    sel.dataset.dcEnhanced='1'; sel.classList.add('dc-select-native');
    var wrap=document.createElement('div'); wrap.className='dc-select';
    var btn=document.createElement('button'); btn.type='button'; btn.className='dc-select-btn'; btn.setAttribute('aria-haspopup','listbox');
    var menu=document.createElement('div'); menu.className='dc-select-menu'; menu.setAttribute('role','listbox');
    sel.parentNode.insertBefore(wrap,sel); wrap.appendChild(sel); wrap.appendChild(btn); wrap.appendChild(menu);
    function render(){
      var opt=sel.options[sel.selectedIndex]; btn.textContent=opt?opt.text:''; menu.innerHTML='';
      Array.from(sel.options).forEach(function(o,i){var item=document.createElement('div'); item.className='dc-select-option'+(i===sel.selectedIndex?' selected':''); item.textContent=o.text; item.setAttribute('role','option'); item.onclick=function(e){e.stopPropagation();sel.selectedIndex=i;sel.dispatchEvent(new Event('change',{bubbles:true}));render();wrap.classList.remove('open');}; menu.appendChild(item);});
    }
    btn.onclick=function(e){e.stopPropagation();var will=!wrap.classList.contains('open');closeAll(wrap);wrap.classList.toggle('open',will);};
    btn.onkeydown=function(e){if(e.key==='Escape')wrap.classList.remove('open'); if(e.key==='ArrowDown'||e.key==='Enter'||e.key===' '){e.preventDefault();closeAll(wrap);wrap.classList.add('open');}};
    sel.addEventListener('change',render); render();
  }
  function init(){document.querySelectorAll('.dcw select.so-control').forEach(enhance);document.addEventListener('click',function(){closeAll();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
