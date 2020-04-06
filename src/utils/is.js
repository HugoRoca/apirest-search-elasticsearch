const yenv = require('yenv')
const env = yenv()

exports.isArray = param => Array.isArray(param)
exports.isBoolean = param => param === true || param === false || toString.call(param) === '[object Boolean]'
exports.isCountryActive = param => env.ENABLED_COUNTRIES.some(x => x.toLowerCase() === param.toLowerCase())
exports.isDefined = param => typeof param !== 'undefined' && param !== null
exports.idDummy = (listPersonalization, typePersonalization) => {
  if (this.isUndefined(listPersonalization) || listPersonalization === '') return false
  if (listPersonalization === 'XYZ') return true
  const dummy = listPersonalization.indexOf(typePersonalization)
  return !(dummy > -1)
}
exports.isFalse = param => this.isDefined(param) && param === false
exports.isJson = str => {
  if (!str || str === null) {
    return false
  }

  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }

  return true
}
exports.isFunction = param => typeof param === 'function'
exports.isNumber = param => typeof param === 'number'
exports.isObject = param => this.isDefined(param) && typeof param === 'object' && !Array.isArray(param)
exports.isString = param => this.isDefined(param) && typeof param === 'string'
exports.isUndefined = param => typeof param === 'undefined' || param === null
