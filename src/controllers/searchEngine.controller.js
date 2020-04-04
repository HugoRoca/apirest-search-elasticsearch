const SearchEngineService = require('../services/searchEngine.service')
const ResponseModel = require('../models/response.model')
const validate = require('../utils/is')

module.exports = class {
  async runSearch (params) {
    if (!validate.isCountryActive(params.country)) return new ResponseModel(0, [], [], `This country ${params.country} is not enabled`)
    const searchEngineService = new SearchEngineService()
    return await searchEngineService.runSearch(params)
  }
}
