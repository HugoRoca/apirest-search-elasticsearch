/* eslint-disable prefer-const */
exports.selectInArray = (array, key, value) => {
  let result = []
  for (let i = 0; i < array.length; i++) {
    const element = array[i]
    if (element[key] === value) result.push(element)
  }
  return result
}
