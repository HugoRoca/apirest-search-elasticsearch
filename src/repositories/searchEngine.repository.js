const BuildQuery = require('../scripts/elasticsearch/buildQuery')
const SqlManager = require('../utils/sqlManager')
const CacheManager = require('../utils/cacheManager')
const Constants = require('../utils/constants')
const Utils = require('../utils/utils')
const _ = require('lodash')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (params) {
    this.params = params
    this.sqlManager = new SqlManager(params.country)
  }

  async getDataElastic () {
    const filters = await this.getFiltersCache()
    const filtersOnlyActive = Utils.selectInArrayByKey(filters, 'Estado', 1)
    const buildQuery = new BuildQuery(this.params, filtersOnlyActive)
    return buildQuery.getQuerySearchEngine()
  }

  async getFiltersCache () {
    const key = `${env.ENVIRONMENT}_${env.LOGGING.APPLICATION}_FilterCache`
    let filters = await CacheManager.get(key)
    if (_.isUndefined(filters) || _.isNull(filters)) {
      console.log('entro save redis')
      filters = JSON.stringify(await this.sqlManager.execStoreProcedure(Constants.storeProcedures.getFilters))
      await CacheManager.set(key, filters)
    }
    return JSON.parse(filters)
  }
}
