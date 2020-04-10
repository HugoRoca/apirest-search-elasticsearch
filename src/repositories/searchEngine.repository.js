const BuildQuery = require('../scripts/elasticsearch/buildQuery')
const SqlManager = require('../utils/sqlManager')
const ElasticsearchManager = require('../utils/elasticsearchManager')

module.exports = class {
  constructor (params, filterCache) {
    this.params = params
    this.filterCache = filterCache
    this.sqlManager = new SqlManager(params.country)
  }

  async getDataElastic () {
    const buildQuery = new BuildQuery(this.params, this.filterCache)
    const query = buildQuery.getQuerySearchEngine()
    console.log('query', JSON.stringify(query))
    return await ElasticsearchManager.search(this.params.country, this.params.campaign, query)
  }
}
