/* eslint-disable prefer-const */
const SearchEngineRepository = require('../repositories/searchEngine.repository')
const ResponseModel = require('../models/response.model')
const SearchEngineProduct = require('../models/searchEngineProduct.model')
const StockRepository = require('../repositories/stock.repository')
const CacheManager = require('../utils/cacheManager')
const Utils = require('../utils/utils')
const Constants = require('../utils/constants')
const yenv = require('yenv')
const env = yenv()
const _ = require('lodash')

module.exports = class {
  async runSearch (params) {
    const filtersCache = await this.getFiltersCache()
    const searchEngineRepository = new SearchEngineRepository(params, filtersCache)
    const dataElastic = await searchEngineRepository.getDataElastic()
    const total = dataElastic.hits.total
    if (total === 0) return new ResponseModel(0, [], [], 'OK')
    const products = await this.getProducts(dataElastic.hits.hits, params)
    const filters = this.getFilters(dataElastic.aggregations, params, filtersCache)
    return new ResponseModel(total, products, filters, 'OK')
  }

  async getFiltersCache () {
    const key = `${env.ENVIRONMENT}_${env.LOGGING.APPLICATION}_FilterCache`
    let filters = await CacheManager.get(key)
    if (_.isUndefined(filters) || _.isNull(filters)) {
      filters = JSON.stringify(await this.sqlManager.execStoreProcedure(Constants.storeProcedures.getFilters))
      await CacheManager.set(key, filters)
    }
    const filtersOnlyActive = Utils.selectInArrayByKey(JSON.parse(filters), 'Estado', 1)
    return filtersOnlyActive
  }

  async getProducts (data, params) {
    let products = []
    let cuvs = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]._source
      const image = Utils.buildImageUrl(item.imagen, params.country.toUpperCase(), item.imagenOrigen, params.campaign, item.marcaId)
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
      const stockRepository = new StockRepository()
      const getValidatesCuvs = await stockRepository.validateStock(params.country, params.campaign, cuvs, params.configurations.isBilling)
      getValidatesCuvs.forEach(item => {
        const indexCuv = products.indexOf(x => x.cuv === item.coD_VENTA_PADRE)
        products[indexCuv].stock = item.stock === 1
      })
    }

    return products
  }

  getFilters (aggs, params, filtersCache) {
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
      let filtroSeccionRequest = Utils.selectInArrayByKey(params.selectedFilters, 'idSeccion', item.IdSeccion)
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
