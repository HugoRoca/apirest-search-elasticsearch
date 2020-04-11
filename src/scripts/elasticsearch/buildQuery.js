/* eslint-disable camelcase */
/* eslint-disable prefer-const */
const DummyConsultantLogic = require('./dummyConsultantLogic')
const FilterLogic = require('./filterLogic')
const OtherQuery = require('./otherQuery')
const NotInQuery = require('./notInQuery')
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

  getQueryRecommendation () {
    let personalizations = env.CONSTANTS.PERSONALIZATIONS
    personalizations = personalizations.filter(x => x !== 'GND')
    personalizations = personalizations.filter(x => x !== 'LIQ')
    personalizations = personalizations.filter(x => x !== 'CAT')
    personalizations = personalizations.filter(x => x !== 'LMG')
    const dummyConsultantLogic = new DummyConsultantLogic(this.params)
    const notInQuery = new NotInQuery(this.params)
    const consultantDummyQuery = dummyConsultantLogic.getConsultantDummyQuery(personalizations)
    let filter = [] // 'filter' is a word reserved in elasticsearch
    let must_not = []
    filter.push(InHardQuery.active)
    filter.push(InHardQuery.greaterThanZero)
    must_not.push(notInQuery.getQueryRecommendation())
    if (_.size(consultantDummyQuery) > 0) filter.push({ bool: { should: consultantDummyQuery } })
    let codeProduct = this.params.codeProduct
    if (_.isString(codeProduct)) {
      codeProduct = [this.params.codeProduct]
    }
    return {
      size: this.params.quantityProducts,
      sort: this.params.sortValue,
      query: {
        bool: {
          must: { terms: { codigoProductos: codeProduct } },
          must_not,
          filter
        }
      }
    }
  }

  getQueryOnlyCuv () {
    return {
      query: {
        term: {
          cuv: this.params.cuv
        }
      }
    }
  }

  getQueryUpselling () {
    let personalizations = env.CONSTANTS.PERSONALIZATIONS
    personalizations = personalizations.filter(x => x !== 'GND')
    personalizations = personalizations.filter(x => x !== 'LIQ')
    personalizations = personalizations.filter(x => x !== 'CAT')
    personalizations = personalizations.filter(x => x !== 'LMG')
    personalizations = personalizations.filter(x => x !== 'LAN')
    const notInQuery = new NotInQuery(this.params)
    const dummyConsultantLogic = new DummyConsultantLogic(this.params)
    const consultantDummyQuery = dummyConsultantLogic.getConsultantDummyQuery(personalizations)
    let filter = [] // 'filter' is a word reserved in elasticsearch
    let must_not = []
    filter.push(InHardQuery.active)
    filter.push(InHardQuery.greaterThanZero)
    filter.push(InHardQuery.categoriesKeyword)
    filter.push(InHardQuery.groupArticleKeyword)
    if (_.size(consultantDummyQuery) > 0) filter.push({ bool: { should: consultantDummyQuery } })
    must_not.push(notInQuery.getQueryUpsellingCuv())
    must_not.push(notInQuery.getQueryUpsellingPersonalization())
    let codeProduct = this.params.codeProduct
    if (_.isString(codeProduct)) {
      codeProduct = [this.params.codeProduct]
    }
    return {
      size: this.params.quantityProducts,
      sort: this.params.sortValue,
      query: {
        bool: {
          must: { terms: { codigoProductos: codeProduct } },
          must_not,
          filter
        }
      },
      collapse: {
        field: 'cuv'
      }
    }
  }
}
