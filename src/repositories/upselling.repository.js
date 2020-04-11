const BuildQuery = require('../scripts/elasticsearch/buildQuery')
const ElasticsearchManager = require('../utils/elasticsearchManager')

module.exports = class {
  constructor (params) {
    this.params = params
  }

  async getDataElastic () {
    const buildQuery = new BuildQuery(this.params, [])
    const query = buildQuery.getQueryUpselling()
    // console.log('query UPSELLING', JSON.stringify(query))
    return await ElasticsearchManager.search(this.params.country, this.params.campaign, query)
  }
}
