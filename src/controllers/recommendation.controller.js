const RecommendationService = require('../services/recommendation.service')
const RecommendationModel = require('../models/recommendationRequest.model')
const ResponseModel = require('../models/response.model')
const validate = require('../utils/is')

module.exports = class {
  async runRecommendation (ctx) {
    try {
      if (!validate.isCountryActive(ctx.params.country)) ctx.body = new ResponseModel(0, [], [], `This country ${ctx.params.country} is not enabled`)
      const recommendationModel = new RecommendationModel(
        ctx.params.country,
        ctx.params.campaign,
        ctx.request.body.codigoConsultora,
        ctx.request.body.codigoZona,
        ctx.request.body.cuv,
        ctx.request.body.codigoProducto,
        ctx.request.body.cantidadProductos,
        ctx.request.body.personalizaciones,
        ctx.request.body.configuracion
      )
      const recommendationService = new RecommendationService(recommendationModel)
      ctx.body = await recommendationService.runRecommendation()
    } catch (error) {
      ctx.throw(400, error)
    }
  }
}
