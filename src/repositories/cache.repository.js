const SqlManager = require('../utils/sqlManager')
const CacheManager = require('../utils/cacheManager')
const _ = require('lodash')

module.exports = class {
  constructor (params) {
    this.params = params
  }

  async getFiltersCache (key, storeProcedureName) {
    const sqlManager = new SqlManager(this.params.country)
    let dataCache = await CacheManager.get(key)
    if (_.isUndefined(dataCache) || _.isNull(dataCache)) {
      dataCache = JSON.stringify(await sqlManager.execStoreProcedure(storeProcedureName))
      await CacheManager.set(key, dataCache)
    }
    return JSON.parse(dataCache)
  }
}
