(function(){
  function init(root){
    (root||document).querySelectorAll('select:not([data-zselect-ready])').forEach(function(sel){
      if(!sel.closest('.rpb, .pending-bills-page')) return;
      sel.dataset.zselectReady='1';
      var wrap=document.createElement('div'); wrap.className='zselect';
      var btn=document.createElement('button'); btn.type='button'; btn.className='zselect-trigger'; btn.setAttribute('aria-haspopup','listbox');
      var txt=document.createElement('span'); txt.className='zselect-value';
      var ico=document.createElement('i'); ico.className='fa-solid fa-chevron-down';
      btn.append(txt,ico);
      var menu=document.createElement('div'); menu.className='zselect-menu'; menu.setAttribute('role','listbox');
      function render(){
        txt.textContent=sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : 'Select';
        menu.innerHTML='';
        Array.from(sel.options).forEach(function(opt,idx){
          var item=document.createElement('button'); item.type='button'; item.className='zselect-option'+(idx===sel.selectedIndex?' selected':''); item.textContent=opt.text; item.disabled=opt.disabled;
          item.onclick=function(e){e.stopPropagation(); sel.selectedIndex=idx; sel.dispatchEvent(new Event('change',{bubbles:true})); render(); close();};
          menu.appendChild(item);
        });
      }
      function close(){wrap.classList.remove('open');btn.setAttribute('aria-expanded','false');}
      btn.onclick=function(e){e.stopPropagation(); document.querySelectorAll('.zselect.open').forEach(function(x){if(x!==wrap)x.classList.remove('open')}); wrap.classList.toggle('open'); btn.setAttribute('aria-expanded',wrap.classList.contains('open')?'true':'false');};
      sel.parentNode.insertBefore(wrap,sel); wrap.append(sel,btn,menu); render();
      sel.addEventListener('change',render);
    });
  }
  document.addEventListener('click',function(){document.querySelectorAll('.zselect.open').forEach(function(x){x.classList.remove('open')})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('.zselect.open').forEach(function(x){x.classList.remove('open')})});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){init(document)});else init(document);
})();
