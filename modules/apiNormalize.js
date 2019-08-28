import camelCaseKeys from 'camelcase-keys'

export const toCamelCase = (item) => camelCaseKeys(item, { deep: true });


export const normalizeSolrResponse = (docs, locale='en') => {
  for (let i = 0; i < docs.length; i++){
    // eslint-disable-next-line
    for (const variable in docs[i]){
      let sanitizedPropName

      if(~variable.indexOf('_')){
        sanitizedPropName = variable.slice(0, variable.indexOf('_'))

        docs[i][sanitizedPropName] = docs[i][variable]
      }
      if(isLString(docs[i][sanitizedPropName]))
        docs[i][sanitizedPropName] = normalizeLString(docs[i][sanitizedPropName], locale)
    }

    docs[i] = camelCaseKeys(docs[i], { deep: true })
  }
  return docs
}

export const normalizeApiResponse = (docs) => camelCaseKeys(docs, { deep: true })

export const isLString = (prop) => prop && (!isUndefined(prop.ar) || !isUndefined(prop.en) || !isUndefined(prop.zh) || !isUndefined(prop.ru) || !isUndefined(prop.fr) || !isUndefined(prop.es))

export const normalizeLString = (prop, locale='en') => {
  if(prop && prop[locale]) return prop[locale]
  return prop.en
}

export const isUndefined = (prop) => typeof prop === 'undefined'
