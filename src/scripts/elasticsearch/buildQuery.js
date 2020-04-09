/* eslint-disable prefer-const */
const DummyConsultantLogic = require('./dummyConsultantLogic')
const FilterLogic = require('./filterLogic')
const OtherQuery = require('./otherQuery')
const InHardQuery = require('./inHardQuery')
const _ = require('lodash')

module.exports = class {
  constructor (params, filterCache) {
    this.params = params
    this.filterLogic = new FilterLogic(filterCache, params.selectedFilters)
    this.dummyConsultantLogic = new DummyConsultantLogic(params)
    this.otherQuery = new OtherQuery(params)
  }

  getQuerySearchEngine () {
    let filter = [] // 'filter' is a word reserved in elasticsearch
    const aggregations = this.filterLogic.getAggregations()
    const selectedFiltersQuery = this.filterLogic.getSelectedFiltersQuery()
    const consultantDummyQuery = this.dummyConsultantLogic.getConsultantDummyQuery()
    const must = this.otherQuery.getQueryMultiMatch()
    const festivals = this.otherQuery.getQueryFestivals()
    filter.push(InHardQuery.active)
    filter.push(InHardQuery.greaterThanZero)
    if (_.size(festivals) > 0) filter.push(festivals)
    if (_.size(selectedFiltersQuery) > 0) filter.push({ bool: { must: selectedFiltersQuery } })
    if (_.size(consultantDummyQuery) > 0) filter.push({ bool: { should: consultantDummyQuery } })
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
