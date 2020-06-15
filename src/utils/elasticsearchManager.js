/* eslint-disable prefer-const */
const Elasticsearch = require('elasticsearch')
const yenv = require('yenv')
const log = require('fancy-log')
const env = yenv()

class ElasticsearchManager {
  constructor () {
    if (!ElasticsearchManager.instance) {
      this.connection = {}
      ElasticsearchManager.instance = this
    }
    return ElasticsearchManager.instance
  }

  getClient (country) {
    const cluster = env.ELASTICSEARCH.CLUSTERS.find((item) => {
      return item.COUNTRIES.some((x) => {
        return x.toUpperCase() === country.toUpperCase()
      })
    })
    return this.connection[cluster.ID]
  }

  async search (country, campaign, body) {
    const index = `${env.ELASTICSEARCH.INDEX_NAME}_${country.toLowerCase()}_${campaign}_*`
    return await this.getClient(country).search({
      index,
      type: env.ELASTICSEARCH.INDEX_TYPE,
      body
    })
  }

  prepareConnectionPool (clusterId, endPoint) {
    return new Promise((resolve, reject) => {
      if (this.connection[clusterId]) resolve(this.connection[clusterId])
      else {
        this.connection[clusterId] = Elasticsearch.Client({
          host: endPoint
        })
        log.info(`Successfull connection to elasticsearch => ${clusterId} ✓`)
        resolve(this.connection[clusterId])
      }
    })
  }

  createConnectionPool () {
    let promise = []
    for (let i = 0; i < env.ELASTICSEARCH.CLUSTERS.length; i++) {
      const item = env.ELASTICSEARCH.CLUSTERS[i]
      promise.push(this.prepareConnectionPool(item.ID, item.ENDPOINT))
    }
    return Promise.all(promise)
  }
}

const instance = new ElasticsearchManager()
Object.freeze(instance)

module.exports = instance
