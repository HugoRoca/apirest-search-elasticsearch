/* eslint-disable prefer-const */
const _ = require('lodash')
const yenv = require('yenv')
const env = yenv()

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
exports.decodeText = str => str.replace(/&#(\d+);/g, (match, dec) => {
  return String.fromCharCode(dec)
})

exports.buildImageUrl = (nameImage, country, originType, campaign, brandId) => {
  const urlSB = env.EXTERNAL_APIS.IMAGES_SB
  const urlAPP = env.EXTERNAL_APIS.IMAGES_APP_CATALOGUE
  const origin = parseInt(originType)
  if (_.isUndefined(nameImage) || _.isNull(nameImage) || _.size(nameImage) === 0) return 'no_tiene_imagen.jpg'
  if (nameImage.startsWith('http') || nameImage.startsWith('https')) return nameImage
  if (origin === 1) return `${urlSB}Matriz/${country}/${nameImage}`
  if (origin === 2) {
    const brands = ['L', 'E', 'C']
    const split = nameImage.split('|')
    if (_.size(split) > 1) return `${urlAPP}${split[0]}/${split[1]}/${brands[brandId - 1]}/productos/${split[2]}`
    return `${urlAPP}${country}/${campaign}/${brands[brandId - 1]}/productos/${nameImage}`
  }
  return 'no_tiene_imagen.jpg'
}
