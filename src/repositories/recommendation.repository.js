const BuildQuery = require('../scripts/elasticsearch/buildQuery')
const ElasticsearchManager = require('../utils/elasticsearchManager')

module.exports = class {
  constructor (params) {
    this.params = params
  }

  async getDataElastic () {
    const buildQuery = new BuildQuery(this.params)
    const query = buildQuery.getQueryRecommendation()
    // console.log('query REOMMENDATION', JSON.stringify(query))
    return await ElasticsearchManager.search(this.params.country, this.params.campaign, query)
  }

  async getDataOnlyCuv () {
    const buildQuery = new BuildQuery(this.params)
    const query = buildQuery.getQueryOnlyCuv()
    // console.log('query RECOMMENDATION CUV', JSON.stringify(query))
    return await ElasticsearchManager.search(this.params.country, this.params.campaign, query)
  }
}
