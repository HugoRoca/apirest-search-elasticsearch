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
    const key = `${env.ENVIRONMENT}_${env.LOGGING.APPLICATION}_Filters`
    let filters = await CacheManager.get(key)
    if (_.isUndefined(filters) || _.isNull(filters)) {
      filters = await this.sqlManager.execStoreProcedure(Constants.storeProcedures.getFilters)
      await CacheManager.set(key, JSON.stringify(filters))
    }
    console.log('filters', filters.length)
    return JSON.parse(filters)
  }
}
