const SearchEngineRepository = require('../repositories/searchEngine.repository')

module.exports = class {
  async runSearch (params) {
    const searchEngineRepository = new SearchEngineRepository(params)
    const dataElastic = searchEngineRepository.getDataElastic()
    return dataElastic
  }
}
