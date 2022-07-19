/**
 * @description: 获取导出时的表头数据和表格数据
 * @param {*} { sourceData:后端返回的源数据,header:表格头中因为对应关系}
 * @return {*}
 */

// 处理函数中对key判断如果发生当前它是聘用形式 通过枚举做一下处理 返回中文

// 枚举处理函数 根据1/2返回正式或者非正式
function transEmployment(value) {
  const TYPES = {
    1: '正式',
    2: '非正式'
  }
  return TYPES[value]
}

export function getExportData(sourceData, headerRelation) {
  const data = sourceData.map(item => {
    const arr = []
    Object.values(headerRelation).forEach(key => {
      // 关键位置：把所有的value不做任何处理直接扔到了数组中 导致excel是源数据
      // 如果是当前要处理的是聘用形式 就先转化一步再添加到数组中
      if (key === 'formOfEmployment') {
        const formatValue = transEmployment(item[key])
        arr.push(formatValue)
      } else {
        arr.push(item[key])
      }
    })
    return arr
  })
  return {
    data
  }
}

/**
 * @description: 获取导入时的处理之后的接口数据
 * @param {*} results
 * @return {*}
 */
export function getImportJsData(results, headerRelation) {
  const newArr = []
  // 将所有的中文key转换成英文key 然后添加到新数组中
  results.forEach(item => {
    const map = {}
    Object.keys(item).forEach(key => {
      map[headerRelation[key]] = item[key]
    })
    newArr.push(map)
  })
  // 时间处理
  newArr.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key === 'timeOfEntry') {
        item[key] = new Date(formatDate(item[key], '/'))
      }
    })
  })
  return newArr
}

export function formatDate(numb, format) {
  const time = new Date((numb - 1) * 24 * 3600000 + 1)
  time.setYear(time.getFullYear() - 70)
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate() - 1 + ''
  if (format && format.length === 1) {
    return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
  }
  return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}
