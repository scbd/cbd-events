//vue directive
export default  {
  inserted
}

//============================================================
//
//============================================================
function inserted(el, binding){
  if(typeof window === 'undefined') return //ssr

  function removeEvent (evt){
    if (binding.value(evt, el))
      window.removeEventListener('scroll', removeEvent)
  }

  if(el === document.body || el === document || el === window)
    document.onscroll = removeEvent;
  
  else
  if (el.addEventListener)
    el.addEventListener('scroll', removeEvent);
  
  else
    el.attachEvent('onscroll', removeEvent);
      

  // window.addEventListener('scroll', f)
}
