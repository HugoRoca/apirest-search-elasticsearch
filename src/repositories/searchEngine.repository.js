const BuildQuery = require('../queries/elasticsearch/buildQuery')
const ElasticsearchManager = require('../utils/elasticsearchManager')

module.exports = class {
  constructor (params) {
    this.params = params
  }

  async getDataElastic (filtersCache) {
    const buildQuery = new BuildQuery(this.params, filtersCache)
    const query = buildQuery.getQuerySearchEngine()
    // console.log('query', JSON.stringify(query))
    return await ElasticsearchManager.search(this.params.country, this.params.campaign, query)
  }
}
