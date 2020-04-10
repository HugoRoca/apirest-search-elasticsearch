/* eslint-disable prefer-const */
const SearchEngineRepository = require('../repositories/searchEngine.repository')
const ResponseModel = require('../models/response.model')
const SearchEngineProduct = require('../models/searchEngineProduct.model')
const StockRepository = require('../repositories/stock.repository')
const CacheRepository = require('../repositories/cache.repository')
const Utils = require('../utils/utils')
const Constants = require('../utils/constants')
const yenv = require('yenv')
const env = yenv()
const _ = require('lodash')

module.exports = class {
  constructor (params) {
    this.params = params
    this.searchEngineRepository = new SearchEngineRepository(params)
    this.cacheRepository = new CacheRepository(params)
    this.stockRepository = new StockRepository()
  }

  async runSearch () {
    const filtersCache = await this.getFiltersCache()
    const dataElastic = await this.searchEngineRepository.getDataElastic(filtersCache)
    const total = dataElastic.hits.total
    if (total === 0) return new ResponseModel(0, [], [], 'OK')
    const products = await this.getProducts(dataElastic.hits.hits, this.params)
    const filters = this.getFilters(dataElastic.aggregations, filtersCache)
    return new ResponseModel(total, products, filters, 'OK')
  }

  async getFiltersCache () {
    const key = `${env.ENVIRONMENT}_${env.LOGGING.APPLICATION}_FiltersCache`
    let filters = await this.cacheRepository.getFiltersCache(key, Constants.storeProcedures.getFilters)
    const filtersCacheOnlyActive = Utils.selectInArrayByKey(filters, 'Estado', 1)
    return filtersCacheOnlyActive
  }

  async getProducts (data) {
    let products = []
    let cuvs = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]._source
      const image = Utils.buildImageUrl(item.imagen, this.params.country.toUpperCase(), item.imagenOrigen, this.params.campaign, item.marcaId)
      products.push(new SearchEngineProduct(
        item.cuv,
        item.codigoProducto,
        image,
        item.descripcion,
        item.valorizado ? item.valorizado : 0,
        item.precio,
        item.marcaId,
        item.tipoPersonalizacion,
        item.codigoEstrategia || 0,
        item.codigoTipoEstrategia || '0',
        item.tipoEstrategiaId || 0,
        item.limiteVenta || 0,
        true,
        item.estrategiaId,
        item.materialGanancia === true,
        item.SubCampania === true,
        item.codigoTipoOferta || '',
        item.flagFestival || 0,
        item.flagAgotado || false
      ))
      if (_.isUndefined(cuvs.find(x => x === item.cuv))) {
        cuvs.push(item.cuv)
      }
    }

    if (env.CONSTANTS.VALIDATE_STOCK) {
      const getValidatesCuvs = await this.stockRepository.validateStock(this.params.country, this.params.campaign, cuvs, this.params.configurations.isBilling)
      getValidatesCuvs.forEach(item => {
        const indexCuv = products.indexOf(x => x.cuv === item.coD_VENTA_PADRE)
        products[indexCuv].stock = item.stock === 1
      })
    }

    return products
  }

  getFilters (aggs, filtersCache) {
    let filterOriginDistinct = Utils.distinctInArray(filtersCache, 'IdSeccion')
    let filterOriginDistinctElastic = Utils.distinctInArray(filtersCache, 'ElasticsearchCampo')
    let filterOrigin = filtersCache
    let filterElasticsearch = aggs
    let result = []
    let dataElastic = []
    filterOriginDistinctElastic.forEach(item => {
      let data = filterElasticsearch[item.ElasticsearchCampo].buckets
      for (const key in data) {
        dataElastic.push(data[key])
      }
    })

    for (let i = 0; i < filterOriginDistinct.length; i++) {
      const item = filterOriginDistinct[i]

      let filtroSeccionOrigen = Utils.selectInArrayByKey(filterOrigin, 'IdSeccion', item.IdSeccion)
      let filtroSeccionRequest = Utils.selectInArrayByKey(this.params.selectedFilters, 'idSeccion', item.IdSeccion)
      let filtroSeccion = []

      for (let j = 0; j < filtroSeccionOrigen.length; j++) {
        const element = filtroSeccionOrigen[j]
        let filtro = dataElastic.find(x => x.key === element.FiltroNombre)
        let filtroRequest = filtroSeccionRequest ? filtroSeccionRequest.find(x => x.idFiltro === element.Codigo) : filtroSeccionRequest
        filtroSeccion.push({
          idFiltro: element.Codigo,
          nombreFiltro: element.Descripcion || element.FiltroNombre,
          cantidad: filtro ? filtro.doc_count : 0,
          marcado: _.size(filtroRequest) > 0,
          id: element.IdFiltro,
          parent: element.IdPadre,
          type: item.Tipo,
          idSeccion: item.IdSeccion
        })
      }

      result.push({
        IdSeccion: item.IdSeccion,
        NombreGrupo: item.Seccion,
        Tipo: item.Tipo,
        Opciones: filtroSeccion
      })
    }

    let sortingResult = []
    result.forEach(item => {
      item.Opciones = this.sortFiltersRecursive(item.Opciones, 0)
      sortingResult.push(item)
    })

    return sortingResult
  }

  sortFiltersRecursive (arr, parent) {
    let out = []
    for (let i in arr) {
      if (arr[i].parent === parent) {
        let children = this.sortFiltersRecursive(arr, arr[i].id)
        arr[i].totalChildren = children.length
        if (children.length) arr[i].children = children
        out.push(arr[i])
      }
    }
    return out
  }
}
