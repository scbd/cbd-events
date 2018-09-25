




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
