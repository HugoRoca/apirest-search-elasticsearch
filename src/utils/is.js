const yenv = require('yenv')
const env = yenv()

exports.isCountryActive = param => env.ENABLED_COUNTRIES.some(x => x.toLowerCase() === param.toLowerCase())
exports.idDummy = (listPersonalization, typePersonalization) => {
  if (this.isUndefined(listPersonalization) || listPersonalization === '') return false
  if (listPersonalization === 'XYZ') return true
  const dummy = listPersonalization.indexOf(typePersonalization)
  return !(dummy > -1)
}
