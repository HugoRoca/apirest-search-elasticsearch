const CategoryRepository = require('../repositories/category.repository')
const CacheRepository = require('../repositories/cache.repository')
const Constants = require('../utils/constants')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (params) {
    this.params = params
    this.cacheRepository = new CacheRepository(params)
  }

  async runCategory () {
    const categoryRepository = new CategoryRepository(this.params)
    const dataElastic = await categoryRepository.getDataElastic()
    const dataCache = await this.getDataCache()
    const total = dataElastic.hits.total
    if (total === 0) return []
    const hits = dataElastic.aggregations.unique_categoria.buckets
    return this.getCategories(hits, dataCache)
  }

  async getDataCache () {
    const key = `${env.ENVIRONMENT}_${env.LOGGING.APPLICATION}_CategoryCache`
    return await this.cacheRepository.getFiltersCache(key, Constants.storeProcedures.getCategories)
  }

  getCategories (dataElastic, dataCache) {
    // eslint-disable-next-line prefer-const
    let result = []
    for (let i = 0; i < dataCache.length; i++) {
      const item = dataCache[i]
      const category = dataElastic.find(x => x.key === item.Nombre)
      result.push({
        codigo: item.codigo,
        nombre: item.Nombre,
        cantidad: category ? category.doc_count : 0,
        imagen: item.imagen,
        imagenAncha: item.imagenAncha === 1
      })
    }
    return result
  }
}
