const utils = require('../../utils/utils')
const Constants = require('../../utils/constants')
const _ = require('lodash')

module.exports = class {
  constructor (filters, selectedFilters) {
    this.filters = filters
    this.selectedFilters = selectedFilters
  }

  getAggregations () {
    if (_.isUndefined(this.filters) || _.size(this.selectedFilters) === 0) return []
    const filters = utils.distinctInArray(this.filters, Constants.filterFields.elasticsearchField)
    // eslint-disable-next-line no-unused-vars
    let aggs = '{'
    // eslint-disable-next-line prefer-const
    let point = 0
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i]
      if (point > 0) aggs += ','
      if (filter.ElasticsearchOperador === 'term') {
        if (filter.ElasticsearchCampo === 'categorias.keyword') {
          aggs += `"${filter.ElasticsearchCampo}":{ "terms": { "field": "${filter.ElasticsearchCampo}", "size": 500 }}`
        } else {
          aggs += `"${filter.ElasticsearchCampo}":{ "terms": { "field": "${filter.ElasticsearchCampo}" }}`
        }
      }
    }
  }
}
