const MS_WORD = [ 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ]

export const isPDF = (contentType) => contentType.includes('application/pdf')
export const isMsWord = (contentType) => MS_WORD.includes(contentType)
