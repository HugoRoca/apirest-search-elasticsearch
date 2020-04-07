const _ = require('lodash')
const yenv = require('yenv')
const env = yenv()

exports.isCountryActive = param => env.ENABLED_COUNTRIES.some(x => x.toLowerCase() === param.toLowerCase())
exports.isDummy = (listPersonalization, typePersonalization) => {
  if (_.isUndefined(listPersonalization) || listPersonalization === '') return false
  if (listPersonalization === 'XYZ') return true
  const dummy = listPersonalization.indexOf(typePersonalization)
  return !(dummy > -1)
}
