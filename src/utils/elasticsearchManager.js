const Elasticsearch = require('elasticsearch')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (params) {
    this.country = params.country
    this.campaign = params.campaign
  }

  getClient () {
    const host = this.getCluster(this.country).ENDPOINT
    const requestTimeout = env.ELASTICSEARCH.REQUEST_TIMEOUT ? parseInt(env.ELASTICSEARCH.REQUEST_TIMEOUT) : 30000
    return new Elasticsearch.Client({
      host,
      requestTimeout
    })
  }

  getIndexName () {
    return `${env.ELASTICSEARCH.INDEX_NAME}_${this.country.toLowerCase()}_${this.campaign}_*`
  }

  getCluster () {
    return env.ELASTICSEARCH.CLUSTERS.find((item) => {
      return item.COUNTRIES.some((x) => {
        return x.toUpperCase() === this.country.toUpperCase()
      })
    })
  }

  async search (body) {
    const indexName = this.getIndexName()
    return await this.getClient().search({
      index: indexName,
      type: env.ELASTICSEARCH.INDEX_TYPE,
      body
    })
  }
}
