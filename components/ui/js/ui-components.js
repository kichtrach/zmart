(() => {
  const root = document.documentElement;

  // Shared helper API for future/inner module pages.
  window.ZMartUI = {
    themeColor: getComputedStyle(root).getPropertyValue('--zm-theme').trim() || '#2e9f34',
    closeDropdowns(except = null) {
      document.querySelectorAll('.ui-dropdown,[data-ui-dropdown]').forEach(el => {
        if (el !== except) el.hidden = true;
      });
    },
    bindDropdown(trigger, menu) {
      if (!trigger || !menu) return;
      trigger.addEventListener('click', e => {
        e.stopPropagation();
        const willOpen = menu.hidden;
        this.closeDropdowns(menu);
        menu.hidden = !willOpen;
      });
    },
    styleDynamicControls(scope = document) {
      scope.querySelectorAll('select:not(.ui-select)').forEach(el => el.classList.add('ui-select'));
      scope.querySelectorAll('input[type="text"],input[type="email"],input[type="number"],input[type="tel"],input[type="password"]').forEach(el => {
        if (!el.closest('.topbar-search')) el.classList.add('ui-input');
      });
    }
  };

  window.ZMartUI.styleDynamicControls();

  const observer = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === 1) window.ZMartUI.styleDynamicControls(node);
    }));
  });
  observer.observe(document.body,{childList:true,subtree:true});
})();

/* Reusable ZMart calendar: body-level popup avoids modal clipping */
(function(){
  function pad(n){ return String(n).padStart(2,'0'); }
  function parse(v){
    if(!v) return new Date();
    var m=v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(m) return new Date(+m[1],+m[2]-1,+m[3]);
    m=v.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})$/);
    return m ? new Date(+m[3],+m[2]-1,+m[1]) : new Date();
  }
  function format(d){ return pad(d.getDate())+'-'+pad(d.getMonth()+1)+'-'+d.getFullYear(); }

  var active = null;

  function closeActive(){
    if(active && active.pop){
      active.pop.remove();
      active.pop = null;
    }
    active = null;
  }

  function positionPopup(state){
    if(!state || !state.pop || !state.input) return;
    var rect = state.input.getBoundingClientRect();
    var popW = Math.min(320, window.innerWidth - 24);
    var left = Math.max(12, Math.min(rect.left, window.innerWidth - popW - 12));
    var estimatedH = 330;
    var below = rect.bottom + 6;
    var top = (below + estimatedH <= window.innerHeight)
      ? below
      : Math.max(12, rect.top - estimatedH - 6);
    state.pop.style.left = left + 'px';
    state.pop.style.top = top + 'px';
  }

  function enhance(input){
    if(input.dataset.zmCalendar) return;
    input.dataset.zmCalendar='1';

    var initial=input.value;
    input.type='text';
    input.value=initial ? format(parse(initial)) : '';
    input.placeholder='DD-MM-YYYY';
    input.autocomplete='off';

    var wrap=document.createElement('div');
    wrap.className='ui-date-wrap';
    input.parentNode.insertBefore(wrap,input);
    wrap.appendChild(input);

    var trig=document.createElement('button');
    trig.type='button';
    trig.className='ui-date-trigger';
    trig.setAttribute('aria-label','Open calendar');
    trig.innerHTML='<i class="fa-regular fa-calendar-days"></i>';
    wrap.appendChild(trig);

    var shown=parse(initial);
    var selected=initial ? parse(initial) : null;

    function draw(){
      closeActive();

      var pop=document.createElement('div');
      pop.className='ui-calendar-pop';
      pop.setAttribute('role','dialog');
      pop.setAttribute('aria-label','Select date');

      var state={input:input,pop:pop};
      active=state;

      var y=shown.getFullYear(), mo=shown.getMonth();
      var first=new Date(y,mo,1);
      var startDate=new Date(y,mo,1-first.getDay());

      var html='<div class="ui-calendar-head">'
        +'<button type="button" class="ui-calendar-nav" data-cal="prev" aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>'
        +'<strong>'+shown.toLocaleString('en-US',{month:'long'})+' '+y+'</strong>'
        +'<button type="button" class="ui-calendar-nav" data-cal="next" aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>'
        +'</div>'
        +'<div class="ui-calendar-week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>'
        +'<div class="ui-calendar-grid">';

      for(var i=0;i<42;i++){
        var d=new Date(startDate);
        d.setDate(startDate.getDate()+i);
        var cls='ui-calendar-day'
          +(d.getMonth()!=mo?' muted':'')
          +(selected && d.toDateString()==selected.toDateString()?' selected':'');
        html+='<button type="button" class="'+cls+'" data-date="'
          +d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'">'+d.getDate()+'</button>';
      }

      html+='</div><div class="ui-calendar-foot">'
        +'<button type="button" class="ui-calendar-link" data-cal="clear">Clear</button>'
        +'<button type="button" class="ui-calendar-link" data-cal="today">Today</button>'
        +'</div>';

      pop.innerHTML=html;
      document.body.appendChild(pop);
      positionPopup(state);

      pop.addEventListener('click',function(e){
        e.stopPropagation();
        var b=e.target.closest('button');
        if(!b) return;

        var action=b.dataset.cal;
        if(action==='prev' || action==='next'){
          shown=new Date(y,mo+(action==='prev'?-1:1),1);
          draw();
          return;
        }
        if(action==='clear'){
          input.value='';
          selected=null;
          input.dispatchEvent(new Event('change',{bubbles:true}));
          closeActive();
          return;
        }
        if(action==='today'){
          selected=new Date();
          shown=new Date(selected);
          input.value=format(selected);
          input.dispatchEvent(new Event('change',{bubbles:true}));
          closeActive();
          return;
        }
        if(b.dataset.date){
          selected=parse(b.dataset.date);
          shown=new Date(selected);
          input.value=format(selected);
          input.dispatchEvent(new Event('change',{bubbles:true}));
          closeActive();
        }
      });
    }

    trig.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation();
      if(active && active.input===input) closeActive();
      else draw();
    });

    input.addEventListener('click',function(e){
      e.stopPropagation();
      if(!(active && active.input===input)) draw();
    });
  }

  function init(){
    document.querySelectorAll('input[type="date"].ui-input').forEach(enhance);
  }

  document.addEventListener('click',function(e){
    if(active && !e.target.closest('.ui-calendar-pop') && !e.target.closest('.ui-date-wrap')) closeActive();
  });
  window.addEventListener('resize',function(){ if(active) positionPopup(active); });
  window.addEventListener('scroll',function(){ if(active) positionPopup(active); }, true);

  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init) : init();
  new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true});
})();
