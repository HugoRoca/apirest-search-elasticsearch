const PersonalizationRepository = require('../repositories/personalization.repository')

module.exports = class {
  constructor (params) {
    this.params = params
  }

  async runPersonalization () {
    const personalizationRepository = new PersonalizationRepository(this.params)
    const dataElastic = await personalizationRepository.getDataElastic()
    if (dataElastic.hits.total === 0) return 'XYZ'
    const aggs = dataElastic.aggregations.unique_personalizacion.buckets
    if (aggs.length === 0) return 'XYZ'
    // eslint-disable-next-line prefer-const
    let result = []
    for (let i = 0; i < aggs.length; i++) {
      const item = aggs[i]
      const source = item.key
      result.push(source)
    }
    return result.join(',')
  }
}
