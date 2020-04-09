// const DummyConsultantLogic = require('./dummyConsultantLogic')
const FilterLogic = require('./filterLogic')
const OtherQuery = require('./otherQuery')
const ParametersIdHard = require('./parameterInHardQuery')
const _ = require('lodash')

module.exports = class {
  constructor (params, filterCache) {
    this.params = params
    this.filterCache = filterCache
    // this.dummyConsultantLogic = new DummyConsultantLogic(params)
  }

  getQuerySearchEngine () {
    const filterLogic = new FilterLogic(this.filterCache)
    const otherQuery = new OtherQuery(this.params)
    const aggregations = filterLogic.getAggregations()
    const selectedFiltersQuery = filterLogic.getSelectedFiltersQuery(this.params.selectedFilters)
    // const consultantDummyQuery = this.dummyConsultantLogic.getConsultantDummyQuery()
    const filter = ParametersIdHard.hardSearchEngine // 'filter' is a word reserved in elasticsearch
    const must = otherQuery.getQueryMultiMatch()
    const festivals = otherQuery.getQueryFestivals()
    if (_.size(festivals) > 0) filter.push(festivals)
    if (_.size(selectedFiltersQuery) > 0) filter.push({ bool: { must: selectedFiltersQuery } })
    // if (_.size(consultantDummyQuery) > 0) filter.push({ bool: { should: consultantDummyQuery } })
    return {
      from: this.params.fromValue,
      size: this.params.pagination.quantityProducts,
      sort: this.params.sortValue,
      query: {
        bool: {
          must,
          filter
        }
      },
      aggregations
    }
  }
}
