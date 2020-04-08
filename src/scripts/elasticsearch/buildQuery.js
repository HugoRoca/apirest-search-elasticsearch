const DummyConsultantLogic = require('./dummyConsultantLogic')
const FilterLogic = require('./filterLogic')
const ParametersIdHard = require('./parametersInHard')

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
    must.push({ bool: { should } })
    return {
      must,
      aggs
    }
  }
}
