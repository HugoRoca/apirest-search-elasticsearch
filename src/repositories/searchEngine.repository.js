const BuildQuery = require('../scripts/elasticsearch/buildQuery')
const SqlManager = require('../utils/sqlManager')
const CacheManager = require('../utils/cacheManager')
const _ = require('lodash')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (params) {
    this.params = params
    this.sqlManager = new SqlManager(params.country)
  }

  async getDataElastic () {
    const filters = [] // this.getFilters()
    const buildQuery = new BuildQuery(this.params, filters)
    return buildQuery.getQuerySearchEngine()
  }

  async getFilters () {
    const key = `${env.ENVIRONMENT}_${env.LOGGING.APPLICATION}_Filters`
    let filters = await CacheManager.get(key)
    if (_.isUndefined(filters) || _.isNull(filters)) {
      filters = await this.sqlManager.execStoreProcedure('[Buscador].[ListaFiltro]')
      await CacheManager.set(key, JSON.stringify(filters))
    }
    return JSON.parse(filters)
  }
}
