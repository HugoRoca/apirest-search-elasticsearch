module.exports = class {
  constructor (params) {
    this.params = params
  }

  getQueryRecommendation () {
    return {
      terms: { tipoPersonalizacion: ['GND', 'LIQ', 'CAT', 'LMG'] }
    }
  }

  getQueryUpselling () {
    return [
      {
        term: { cuv: this.params.cuv }
      },
      {
        terms: { tipoPersonalizacion: ['GND', 'LIQ', 'CAT', 'HV', 'LAN'] }
      }
    ]
  }
}
