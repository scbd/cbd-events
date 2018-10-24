//vue directive
export default  {
  inserted:inserted
}

//============================================================
//
//============================================================
function inserted(el, binding) {
  if(typeof window === 'undefined') return //ssr

  let f = function (evt) {

        if (binding.value(evt, el)) {
          window.removeEventListener('scroll', f)
        }
      }
      if(el === document.body || el === document || el === window) {
        document.onscroll = f;
      } else {
        if (el.addEventListener) {
          el.addEventListener('scroll', f);
        } else {
          el.attachEvent('onscroll', f);
        }
      }

  // window.addEventListener('scroll', f)
}
