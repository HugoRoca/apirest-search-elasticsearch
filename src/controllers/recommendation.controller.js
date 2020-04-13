const RecommendationService = require('../services/recommendation.service')
const RecommendationModel = require('../models/recommendationRequest.model')
const ResponseModel = require('../models/response.model')
const LogManager = require('../utils/logManager')
const validate = require('../utils/is')

module.exports = class {
  async runRecommendation (ctx) {
    const logger = new LogManager()
    const recommendationModel = new RecommendationModel(
      ctx.params.country,
      ctx.params.campaign,
      ctx.request.body.codigoConsultora,
      ctx.params.origin,
      ctx.request.body.codigoZona,
      ctx.request.body.cuv,
      ctx.request.body.codigoProducto,
      ctx.request.body.cantidadProductos,
      ctx.request.body.personalizaciones,
      ctx.request.body.configuracion
    )
    try {
      if (!validate.isCountryActive(ctx.params.country)) ctx.body = new ResponseModel(0, [], [], `This country ${ctx.params.country} is not enabled`)
      const recommendationService = new RecommendationService(recommendationModel)
      ctx.body = await recommendationService.runRecommendation()
    } catch (error) {
      logger.logError('recommendation.controller', recommendationModel.country, 'runCategory', recommendationModel, error, recommendationModel.origin)
      ctx.throw(400, error)
    }
  }
}
