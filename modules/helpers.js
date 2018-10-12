


export const formatBytes = (a,b)=>{if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

export const isObject = (item) => {
  return (typeof item === "object" && !Array.isArray(item) && item !== null);
}

export const isEmpty = (item) => {
  if(Array.isArray(item) && !item.length)
    return true

  if(typeof item === "object" && !Array.isArray(item) && item !== null && !Object.keys(item).length)
    return true

  if(!item) return true

  return false
}

export const $ =  {
                    isObject:isObject,
                    isEmpty:isEmpty
                  }
