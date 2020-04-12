/* eslint-disable prefer-const */
const RecommendationRepository = require('../repositories/recommendation.repository')
const ResponseModel = require('../models/response.model')
const ProductModel = require('../models/product.model')
const StockRepository = require('../repositories/stock.repository')
const Utils = require('../utils/utils')
const yenv = require('yenv')
const env = yenv()
const _ = require('lodash')

module.exports = class {
  constructor (params) {
    this.params = params
    this.stockRepository = new StockRepository()
    this.recommendationRepository = new RecommendationRepository(this.params)
  }

  async runRecommendation () {
    const dataElastic = await this.recommendationRepository.getDataElastic()
    const total = dataElastic.hits.total
    if (total === 0) return new ResponseModel(0, [], [], 'No data', [], [], true)
    const hits = dataElastic.hits.hits
    const products = await this.getProducts(hits)
    const productsConsulted = await this.getProductConsulted()
    return new ResponseModel(products.length, products, [], 'OK', productsConsulted, [], true)
  }

  async getProductConsulted () {
    if (!this.params.configurations.showProduct) return []
    const dataElastic = await this.recommendationRepository.getDataOnlyCuv()
    const total = dataElastic.hits.total
    if (total === 0) return []
    let productConsulted = []
    for (let i = 0; i < dataElastic.hits.hits.length; i++) {
      const item = dataElastic.hits.hits[i]._source
      const image = Utils.buildImageUrl(item.imagen, this.params.country.toUpperCase(), item.imagenOrigen, this.params.campaign, item.marcaId)
      productConsulted.push(new ProductModel(
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
    }
    return productConsulted
  }

  async getProducts (data) {
    let products = []
    let cuvs = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]._source
      const image = Utils.buildImageUrl(item.imagen, this.params.country.toUpperCase(), item.imagenOrigen, this.params.campaign, item.marcaId)
      products.push(new ProductModel(
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
      let productsHasStock = []
      const listCuvsStock = await this.stockRepository.validateStock(this.params.country, this.params.campaign, cuvs, this.params.configurations.isBilling)
      listCuvsStock.forEach(item => {
        const indexCuv = products.indexOf(x => x.cuv === item.coD_VENTA_PADRE)
        if (item.stock === 1) productsHasStock.push(products[indexCuv])
      })
      products = productsHasStock
    }

    return products
  }
}
