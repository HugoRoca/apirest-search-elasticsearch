const DummyConsultantLogic = require('./dummyConsultantLogic')
const FilterLogic = require('./filterLogic')
const ParametersIdHard = require('./parametersInHard')
const Constants = require('../../utils/constants')
const _ = require('lodash')

module.exports = class {
  constructor (params, filters) {
    this.params = params
    this.filters = filters
  }

  getQuerySearchEngine () {
    const dummyConsultantLogic = new DummyConsultantLogic(this.params)
    const filterLogic = new FilterLogic(this.filters, this.params.selectedFilters)
    const aggs = filterLogic.getAggregations()
    const should = dummyConsultantLogic.getQueryConsultantDummy()
    const must = ParametersIdHard.hardSearchEngine
    const festivals = this.getQueryFestivals()
    if (_.size(festivals) > 0) must.push(festivals)
    must.push({ bool: { should } })
    return {
      must,
      aggs
    }
  }

  getQueryFestivals () {
    const existsFestivals = this.params.selectedFilters.filter(val => {
      return val.idFiltro === Constants.codeCategories.festivals
    })

    if (existsFestivals.length > 0) {
      return {
        term: { flagFestival: 1 }
      }
    }

    return {}
  }
}
