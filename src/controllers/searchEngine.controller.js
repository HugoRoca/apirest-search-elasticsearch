const SearchEngineService = require('../services/searchEngine.service')
const ResponseModel = require('../models/response.model')
const SearchEngineModel = require('../models/searchEngineRequest.model')
const validate = require('../utils/is')

module.exports = class {
  async runSearch (ctx) {
    try {
      if (!validate.isCountryActive(ctx.params.country)) ctx.body = new ResponseModel(0, [], [], `This country ${ctx.params.country} is not enabled`)
      const searchEngineModel = new SearchEngineModel(
        ctx.params.country,
        ctx.params.campaign,
        ctx.request.body.codigoConsultora,
        ctx.request.body.codigoZona,
        ctx.request.body.textoBusqueda,
        ctx.request.body.personalizaciones,
        ctx.request.body.configuracion,
        ctx.request.body.paginacion,
        ctx.request.body.orden,
        ctx.request.body.filtro
      )
      const searchEngineService = new SearchEngineService(searchEngineModel)
      ctx.body = await searchEngineService.runSearch()
    } catch (error) {
      ctx.throw(400, error)
    }
  }
}
