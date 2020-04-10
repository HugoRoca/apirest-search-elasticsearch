/* eslint-disable prefer-const */
const DummyConsultantLogic = require('./dummyConsultantLogic')
const FilterLogic = require('./filterLogic')
const OtherQuery = require('./otherQuery')
const InHardQuery = require('./inHardQuery')
const _ = require('lodash')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (params, dataCache) {
    this.params = params
    this.dataCache = dataCache
  }

  getQuerySearchEngine () {
    const filterLogic = new FilterLogic(this.dataCache, this.params.selectedFilters)
    const dummyConsultantLogic = new DummyConsultantLogic(this.params)
    const otherQuery = new OtherQuery(this.params)
    const aggregations = filterLogic.getAggregations()
    const selectedFiltersQuery = filterLogic.getSelectedFiltersQuery()
    const consultantDummyQuery = dummyConsultantLogic.getConsultantDummyQuery(env.CONSTANTS.PERSONALIZATIONS)
    const must = otherQuery.getQueryMultiMatch()
    const festivals = otherQuery.getQueryFestivals()
    let filter = [] // 'filter' is a word reserved in elasticsearch
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

  getQueryPersonalization () {
    return {
      size: 0,
      query: {
        bool: {
          must: [{
            term: {
              codigoConsultora: this.params.consultantCode
            }
          }]
        }
      },
      aggs: {
        unique_personalizacion: {
          terms: {
            field: 'tipoPersonalizacion'
          }
        }
      }
    }
  }

  getQueryCategory () {
    const dummyConsultantLogic = new DummyConsultantLogic(this.params)
    const consultantDummyQuery = dummyConsultantLogic.getConsultantDummyQuery(env.CONSTANTS.PERSONALIZATIONS)
    let filter = [] // 'filter' is a word reserved in elasticsearch
    filter.push(InHardQuery.active)
    filter.push(InHardQuery.greaterThanZero)
    if (_.size(consultantDummyQuery) > 0) filter.push({ bool: { should: consultantDummyQuery } })
    return {
      size: 0,
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        unique_categoria: {
          terms: {
            field: 'categorias.keyword',
            size: 500
          }
        }
      }
    }
  }
}
