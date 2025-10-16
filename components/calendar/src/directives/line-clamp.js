const css = 'display:block;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis'
const currentValueProp = 'vLineClampValue'
let useFallbackFunc = false


function defaultFallbackFunc(el, bindings, lines){
  if(lines){
    let lineHeight = parseInt(bindings.arg)

    if (isNaN(lineHeight))
      lineHeight = 16

    const maxHeight = lineHeight * lines

    el.style.maxHeight = maxHeight ? maxHeight+'px' : ''
    el.style.overflowX = 'hidden'
    el.style.lineHeight = lineHeight+'px' // to ensure consistency
  }
  else {
    //eslint-disable-next-line
    el.style.maxHeight = el.style.overflowX = ''
  }
}

function truncateText(el, bindings, useFallbackFunc){
  const lines = parseInt(bindings.value)

  if (isNaN(lines)){ return }

  else if (lines !== el[currentValueProp]){
    el[currentValueProp] = lines
    if (useFallbackFunc)
      useFallbackFunc(el, bindings, lines)
    
    else
      el.style.webkitLineClamp = lines || ''
  }
}

export default  {
  bind (el){
    if(typeof document === 'undefined') return

    useFallbackFunc =
    'webkitLineClamp' in document.body.style
      ? undefined
      : defaultFallbackFunc;
    el.style.cssText += css
  },
  inserted        : (el, bindings) => truncateText(el, bindings, useFallbackFunc),
  updated         : (el, bindings) => truncateText(el, bindings, useFallbackFunc),
  componentUpdated: (el, bindings) => truncateText(el, bindings, useFallbackFunc)
}
