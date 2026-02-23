export default (queryObj = {}) => {
    const query = {}

    for (const key in queryObj)
        query[key] = JSON.stringify(queryObj[key])
    
    return query
}