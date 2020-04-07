/* eslint-disable prefer-const */
// eslint-disable-next-line no-unused-vars
const _ = require('lodash')
const validate = require('../../utils/is')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (params) {
    this.params = params
    this.listPersonalizations = env.CONSTANTS.PERSONALIZATIONS
  }

  getQueryFilters () {
    const personalizationsProducts = ['LIQ', 'CAT', 'REV', 'HV']
    const consultantCodes = {
      ZERO: env.CONSTANTS.CONSULTING_CODES.ZERO,
      DUMMY: env.CONSTANTS.CONSULTING_CODES.DUMMY,
      FORCED: env.CONSTANTS.CONSULTING_CODES.FORCED
    }
    const query = []
    for (let i = 0; i < this.listPersonalizations.length; i++) {
      const personalization = this.listPersonalizations[i]
      let must = [{ term: { tipoPersonalizacion: personalization } }]
      switch (personalization) {
        case 'GND':
        case 'LAN':
          if (personalization === 'GND' && this.GNDisExcluded()) break
          if (personalization === 'LAN' && this.LANisExcluded()) break
          if (validate.isDummy(this.params.personalization, personalization)) {
            must.push({ terms: { codigoConsultora: [consultantCodes.DUMMY, consultantCodes.FORCED] } })
          } else {
            must.push({ terms: { codigoConsultora: [this.params.consultantCode, consultantCodes.ZERO, consultantCodes.FORCED] } })
          }
          break
        case 'ODD':
          if (this.ODDisExcluded()) break
          must.push({ term: { diaInicio: this.params.configurations.billingDay } })
          if (validate.isDummy(this.params.personalization, personalization)) {
            must.push({ terms: { codigoConsultora: [consultantCodes.DUMMY, consultantCodes.FORCED] } })
          } else {
            must.push({ terms: { codigoConsultora: [this.params.consultantCode, consultantCodes.ZERO, consultantCodes.FORCED] } })
          }
          break
        default:
          if (validate.isDummy(this.params.personalization, personalization)) {
            if (personalizationsProducts.some(x => x === personalization)) {
              must.push({ term: { codigoConsultora: consultantCodes.ZERO } })
            } else {
              must.push({ terms: { codigoConsultora: [consultantCodes.DUMMY, consultantCodes.FORCED] } })
            }
          } else {
            must.push({ terms: { codigoConsultora: [this.params.consultantCode, consultantCodes.ZERO, consultantCodes.FORCED] } })
          }
          break
      }
      query.push({
        bool: { must }
      })
    }
    return query
  }

  GNDisExcluded () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.GND) return false
    if (this.params.configurations.businessPartner === '1') return true
    if (this.params.configurations.businessPartner === '0' && this.params.configurations.activeSubscription) return true
    return false
  }

  LANisExcluded () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.LAN) return false
    if (!this.params.configurations.activeSubscription) return true
    return false
  }

  ODDisExcluded () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.ODD) return false
    return false
  }

  filterOPT () {

  }
}
