module.exports = class {
  constructor (params) {
    this.params = params
  }

  getQueryRecommendation () {
    return {
      terms: { tipoPersonalizacion: ['GND', 'LIQ', 'CAT', 'LMG'] }
    }
  }

  getQueryUpsellingCuv () {
    return {
      term: { cuv: this.params.cuv }
    }
  }

  getQueryUpsellingPersonalization () {
    return {
      terms: { tipoPersonalizacion: ['GND', 'LIQ', 'CAT', 'HV', 'LAN'] }
    }
  }
}
