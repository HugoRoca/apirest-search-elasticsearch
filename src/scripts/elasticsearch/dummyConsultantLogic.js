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
    this.consultantCodes = {
      CONSULTAN_CODE: this.params.consultantCode,
      ZERO: env.CONSTANTS.CONSULTING_CODES.ZERO,
      DUMMY: env.CONSTANTS.CONSULTING_CODES.DUMMY,
      FORCED: env.CONSTANTS.CONSULTING_CODES.FORCED
    }
  }

  getConsultantDummyQuery () {
    const should = []
    let LogicOPMAndOPTInLoop = true
    for (let i = 0; i < this.listPersonalizations.length; i++) {
      const personalization = this.listPersonalizations[i]
      let must = [{ term: { tipoPersonalizacion: personalization } }]
      if (this.personalizationIsActiveLogicDummy(personalization)) {
        switch (personalization) {
          case 'GND':
            if (!this.GNDLogicDummy()) {
              must.push(this.getConsultantCodeOrDummy(personalization))
            }
            break
          case 'LAN':
            if (!this.LANLogicDummy()) {
              must.push(this.getConsultantCodeOrDummy(personalization))
            }
            break
          case 'ODD':
            must.push({ term: { diaInicio: this.configurations.billingDay } })
            must.push(this.getConsultantCodeOrDummy(personalization))
            break
          case 'SR':
            if (this.SRLogicDummy()) {
              must.push({ term: { revistaDigital: 0 } })
              must.push(this.getConsultantCodeOrDummy(personalization))
            } else {
              must.push(this.getConsultantCodeOrDummy(personalization))
            }
            break
          case 'OPT':
          case 'OPM':
          case 'PAD':
            if (!LogicOPMAndOPTInLoop) continue
            if (this.OPTLogicDummy()) {
              LogicOPMAndOPTInLoop = false
              must = [{ terms: { tipoPersonalizacion: ['OPM', 'PAD'] } }]
              must.push(this.getConsultantCodeOrDummy(personalization))
            }
            if (this.OPMLogicDummy()) {
              LogicOPMAndOPTInLoop = false
              if (this.configurations.rd && this.configurations.mdo && !this.configurations.activeSubscription) {
                must = [{ terms: { tipoPersonalizacion: ['OPM', 'PAD'] } }]
                must.push({ term: { revistaDigital: 0 } })
                must.push(this.getConsultantCodeOrDummy(personalization))
              }
            }
            if (LogicOPMAndOPTInLoop) {
              must = [{ terms: { tipoPersonalizacion: ['OPT', 'OPM', 'PAD'] } }]
              must.push(this.getConsultantCodeOrDummy(personalization))
              LogicOPMAndOPTInLoop = false
            }
            break
        }
      } else {
        if (['CAT', 'LIQ', 'HV', 'REV'].some(x => x === personalization)) {
          must.push({ term: { codigoConsultora: this.consultantCodes.ZERO } })
        } else {
          must.push(this.getConsultantCodeOrDummy(personalization))
        }
      }
      if (must.length === 1) continue
      should.push({
        bool: { must }
      })
    }
    return should
  }

  getConsultantCodeOrDummy (personalization) {
    if (validate.isDummy(this.params.personalizationsDummy, personalization)) {
      return { terms: { codigoConsultora: [this.consultantCodes.DUMMY, this.consultantCodes.FORCED] } }
    } else {
      return { terms: { codigoConsultora: [this.consultantCodes.CONSULTAN_CODE, this.consultantCodes.ZERO, this.consultantCodes.FORCED] } }
    }
  }

  personalizationIsActiveLogicDummy (personalization) {
    if (personalization === 'GND') return env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.GND
    if (personalization === 'LAN') return env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.LAN
    if (personalization === 'ODD') return env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.ODD
    if (['OPT', 'OPM', 'PAD'].some(x => x === personalization)) return env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.OPT
    if (personalization === 'SR') return env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.SR
    return false
  }

  GNDLogicDummy () {
    if (this.configurations.businessPartner === '1') return true
    if (this.configurations.businessPartner === '0' && this.configurations.activeSubscription) return true
    return false
  }

  LANLogicDummy () {
    if (!this.configurations.activeSubscription) return true
    return false
  }

  SRLogicDummy () {
    if ((this.configurations.rd && this.configurations.mdo && !this.configurations.activeSubscription) || !this.configurations.rd) return true
    return false
  }

  OPTLogicDummy () {
    if (this.configurations.rd && this.configurations.mdo && this.configurations.activeSubscription) return true
    if (this.configurations.rd && !this.configurations.mdo && this.configurations.activeSubscription) return true
    return false
  }

  OPMLogicDummy () {
    if (this.configurations.rd && this.configurations.mdo && !this.configurations.activeSubscription) return true
    if (this.configurations.rd && !this.configurations.mdo && !this.configurations.activeSubscription) return true
    if (this.configurations.rdi) return true
    return false
  }
}
