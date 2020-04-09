/* eslint-disable prefer-const */
exports.selectInArrayByKey = (array, key, value) => {
  let result = []
  for (let i = 0; i < array.length; i++) {
    const element = array[i]
    if (element[key] === value) result.push(element)
  }
  return result
}
exports.distinctInArray = (array, key) => {
  let result = []
  let map = new Map()
  for (const item of array) {
    if (!map.has(item[key])) {
      map.set(item[key], true)
      result.push(item)
    }
  }
  return result
}
exports.decodeText = str => {
  return str.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec)
  })
}
