module.exports = class {
  constructor (params) {
    this.params = params
  }

  getQueryRecommendation () {
    return {
      terms: { tipoPersonalizacion: ['GND', 'LIQ', 'CAT', 'LMG'] }
    }
  }
}
