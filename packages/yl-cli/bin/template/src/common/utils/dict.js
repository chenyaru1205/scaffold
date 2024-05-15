const { DICT: parentDict } = $ylConfig
const { lang } = $ylI18n

export const DICT = {
  ...parentDict,
  ...{
  }
}

export const getDictByCode = (type, valType = 'code') => {
  const dictList = JSON.parse(localStorage.getItem('dict') || '[]')
  const dictData = []
  if (!dictList || !dictList.length) {
    console.warn('数据字典无数据')
    return []
  }
  dictList.forEach((item) => {
    if (item.code === type) {
      item.child.forEach((item2) => {
        dictData.push({ value: item2[valType], label: lang(item2.localName || item2.name), id: item2[valType] })
      })
    }
  })
  return dictData
}
