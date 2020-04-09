const SearchEngineRepository = require('../repositories/searchEngine.repository')
const ResponseModel = require('../models/response.model')
const SearchEngineProduct = require('../models/searchEngineProduct.model')
const Utils = require('../utils/utils')

module.exports = class {
  async runSearch (params) {
    const searchEngineRepository = new SearchEngineRepository(params)
    const dataElastic = await searchEngineRepository.getDataElastic()
    const total = dataElastic.hits.total
    if (total === 0) return new ResponseModel(0, [], [], 'OK')
    const hits = dataElastic.hits.hits
    const aggs = dataElastic.aggregations
    const products = this.getProducts(hits, params)
    return new ResponseModel(total, products, aggs, 'OK')
  }

  getProducts (data, params) {
    // eslint-disable-next-line prefer-const
    let result = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]._source
      const image = Utils.buildImageUrl(item.imagen, params.country.toUpperCase(), item.imagenOrigen, params.campaign, item.marcaId)
      result.push(new SearchEngineProduct(
        item.cuv,
        item.codigoProducto,
        image,
        item.descripcion,
        item.valorizado ? item.valorizado : 0,
        item.precio,
        item.marcaId,
        item.tipoPersonalizacion,
        item.codigoEstrategia ? item.codigoEstrategia : 0,
        item.codigoTipoEstrategia ? item.codigoTipoEstrategia : '0',
        item.tipoEstrategiaId ? item.tipoEstrategiaId : 0,
        item.limiteVenta ? item.limiteVenta : 0,
        true,
        item.estrategiaId,
        item.materialGanancia === true,
        item.SubCampania === true,
        item.codigoTipoOferta ? item.codigoTipoOferta : '',
        item.flagFestival ? item.flagFestival : 0,
        item.flagAgotado ? item.flagAgotado : false
      ))
    }
    return result
  }
}
