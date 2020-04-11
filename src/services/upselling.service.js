/* eslint-disable prefer-const */
const UpsellingRepository = require('../repositories/upselling.repository')
const StrategyModel = require('../models/strategy.model')
const ResponseModel = require('../models/response.model')
const StockRepository = require('../repositories/stock.repository')
const Utils = require('../utils/utils')
const yenv = require('yenv')
const env = yenv()
const _ = require('lodash')

module.exports = class {
  constructor (params) {
    this.params = params
    this.upsellingRepository = new UpsellingRepository(params)
    this.stockRepository = new StockRepository()
  }

  async runUpsellin () {
    const dataElastic = await this.upsellingRepository.getDataElastic()
    const total = dataElastic.hits.total
    if (total === 0) return new ResponseModel(0, [], [], 'No data', [], [], true)
    const hits = dataElastic.hits.hits
    const products = await this.getProducts(hits)
    return new ResponseModel(total, [], [], 'OK', [], products, true)
  }

  async getProducts (dataElastic) {
    const price = this.params.priceProduct
    let cuvs = []
    let products = []
    let greaterProducts = []
    let minorProducts = []
    for (let i = 0; i < dataElastic.length; i++) {
      const item = dataElastic[i]._source
      const image = Utils.buildImageUrl(item.imagen, this.params.country.toUpperCase(), item.imagenOrigen, this.params.campaign, item.marcaId)
      const id = dataElastic[i]._id
      const brand = env.CONSTANTS.BRANDS[item.marcaId]
      const strategyModel = new StrategyModel(
        id,
        item.estrategiaId,
        item.codigoTipoEstrategia ? item.codigoTipoEstrategia : 0,
        item.codigoCampania,
        item.activo,
        item.cuv,
        item.descripcion,
        item.descripcion,
        item.descripcion,
        item.descripcion,
        item.descripcion,
        item.valorizado ? item.valorizado : 0,
        item.precio,
        item.ganancia,
        image,
        item.limiteVenta ? item.limiteVenta : 0,
        item.tipoEstrategiaId ? item.tipoEstrategiaId : 0,
        item.tipoPersonalizacion,
        item.codigoTipoEstrategia ? item.codigoTipoEstrategia : '0',
        item.marcaId,
        brand,
        item.codigoProducto,
        item.SubCampania === true,
        item.codigoProductos.length,
        item.marcas.length > 1,
        image,
        item.valorizado ? item.valorizado.toString() : '0',
        item.precio ? item.precio.toString() : '0',
        item.ganancia ? item.ganancia.toString() : '0',
        true,
        item.codigoEstrategia.toString(),
        item.materialGanancia,
        item.flagFestival,
        item.flagAgotado
      )
      if (_.isUndefined(cuvs.find(x => x === item.cuv))) {
        cuvs.push(item.cuv)
      }
      if (item.precio > price) greaterProducts.push(strategyModel)
      else {
        minorProducts.push(strategyModel)
      }
    }
    greaterProducts.sort((a, b) => parseFloat(a.Precio2) - parseFloat(b.Precio2))
    minorProducts.sort((a, b) => parseFloat(b.Precio2) - parseFloat(a.Precio2))
    if (greaterProducts.length > 0) products = greaterProducts.concat(minorProducts)

    if (env.CONSTANTS.VALIDATE_STOCK) {
      const listCuvsStock = await this.stockRepository.validateStock(this.params.country, this.params.campaign, cuvs, this.params.configurations.isBilling)
      listCuvsStock.forEach(item => {
        const indexCuv = products.indexOf(x => x.cuv === item.coD_VENTA_PADRE)
        if (item.stock === 1) {
          products[indexCuv].stock = true
        } else {
          products.splice(indexCuv, 1)
        }
      })
    }

    return products
  }
}
