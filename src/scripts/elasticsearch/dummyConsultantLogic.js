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
    this.configurations = params.configurations
  }

  getQueryConsultantDummy () {
    const consultantCodes = {
      CONSULTAN_CODE: this.params.consultantCode,
      ZERO: env.CONSTANTS.CONSULTING_CODES.ZERO,
      DUMMY: env.CONSTANTS.CONSULTING_CODES.DUMMY,
      FORCED: env.CONSTANTS.CONSULTING_CODES.FORCED
    }
    const should = []
    for (let i = 0; i < this.listPersonalizations.length; i++) {
      const personalization = this.listPersonalizations[i]
      let must = [{ term: { tipoPersonalizacion: personalization } }]
      let excludePAD = false

      if (this.personalizationHasLogicDummy(personalization)) {
        console.log(personalization, 'true')
        switch (personalization) {
          case 'ODD':
            must.push({ term: { diaInicio: this.configurations.billingDay } })
            break
          case 'SR':
            must.push({ term: { revistaDigital: 0 } })
            break
          case 'OPT':
          case 'PAD':
          case 'OPM':
            if (this.configurations.rd && this.configurations.mdo && !this.configurations.activeSubscription && !excludePAD) {
              must = [{ terms: { tipoPersonalizacion: [personalization, 'PAD'] } }, { term: { revistaDigital: 0 } }]
              excludePAD = true
            }
            break
        }
        if (validate.isDummy(this.params.personalization, personalization)) {
          must.push({ terms: { codigoConsultora: [consultantCodes.DUMMY, consultantCodes.FORCED] } })
        } else {
          must.push({ terms: { codigoConsultora: [consultantCodes.CONSULTAN_CODE, consultantCodes.ZERO, consultantCodes.FORCED] } })
        }
      } else {
        console.log(personalization, 'false')
        if (['GND', 'LAN'].some(x => x === personalization)) continue
        if (['LIQ', 'CAT', 'REV', 'HV'].some(x => x === personalization)) {
          must.push({ term: { codigoConsultora: consultantCodes.ZERO } })
        } else {
          must.push({ terms: { codigoConsultora: [consultantCodes.CONSULTAN_CODE, consultantCodes.ZERO, consultantCodes.FORCED] } })
        }
      }
      should.push({
        bool: { must }
      })
    }
    return {
      bool: { should }
    }
  }

  personalizationHasLogicDummy (personalization) {
    if (personalization === 'GND') return this.GNDHasLogicDummy()
    if (personalization === 'LAN') return this.LANHasLogicDummy()
    if (personalization === 'ODD') return this.ODDHasLogicDummy()
    if (personalization === 'OPT') return this.OPTHasLogicDummy()
    if (personalization === 'SR') return this.SRHasLogicDummy()
    return false
  }

  GNDHasLogicDummy () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.GND) return false
    if (this.configurations.businessPartner === '1') return false
    if (this.configurations.businessPartner === '0' && this.configurations.activeSubscription) return false
    return true
  }

  LANHasLogicDummy () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.LAN) return false
    if (!this.configurations.activeSubscription) return false
    return true
  }

  ODDHasLogicDummy () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.ODD) return false
    return true
  }

  SRHasLogicDummy () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.SR) return false
    if ((this.configurations.rd && this.configurations.mdo && !this.configurations.activeSubscription) || !this.configurations.rd) {
      return true
    }
    return false
  }

  OPTHasLogicDummy () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.OPT) return false
    if (this.configurations.rd && this.configurations.mdo && this.configurations.activeSubscription) return true
    if (this.configurations.rd && this.configurations.mdo && !this.configurations.activeSubscription) return true
    if (this.configurations.rd && !this.configurations.mdo && this.configurations.activeSubscription) return true
    if (this.configurations.rd && !this.configurations.mdo && !this.configurations.activeSubscription) return true
    if (this.configurations.rdi) return true
    return false
  }
}
