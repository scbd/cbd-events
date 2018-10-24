import camelcasekeys from 'camelcase-keys'

export const toCamelCase = (item) => {
  return camelcasekeys(item, {deep: true});
}


export const normalizeSolrResponse = (docs, locale='en') => {

  for (var i = 0; i < docs.length; i++) {

    for (let variable in docs[i]) {
      if(~variable.indexOf('_')){
        let sanitizedPropName = variable.slice(0,variable.indexOf('_'))
        docs[i][sanitizedPropName] = docs[i][variable]
      }
      if(isLString(docs[i][sanitizedPropName]))
        docs[i][sanitizedPropName] = normalizeLString(docs[i][sanitizedPropName],locale)
    }

    docs[i] = camelcasekeys(docs[i],{deep: true})

  }
  return docs
}

export const normalizeApiResponse = (docs, locale='en') => {

  for (var i = 0; i < docs.length; i++) {
    // 
    // for (let variable in docs[i]){
    //   if(isLString(docs[i][variable]))
    //     docs[i][variable] = normalizeLString(docs[i][variable],locale)
    //
    // }

    docs[i] = camelcasekeys(docs[i],{deep: true})
  }

  return docs
}

export const isLString = (prop) => {

  return prop && (!isUndefined(prop.ar) || !isUndefined(prop.en) || !isUndefined(prop.zh) || !isUndefined(prop.ru) || !isUndefined(prop.fr) || !isUndefined(prop.es))
}

export const normalizeLString = (prop, locale='en') => {
  if(prop && prop[locale]) return prop[locale]
  return prop.en
}

export const isUndefined = (prop) => {
  return typeof prop === "undefined";
}
