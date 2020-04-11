const KoaRouter = require('koa-router')
const RecommendationController = require('../controllers/recommendation.controller')
const RecommendationModel = require('../models/recommendationRequest.model')
const yenv = require('yenv')

const recommendationRouter = new KoaRouter()
const controller = new RecommendationController()
const env = yenv()

recommendationRouter.post(`${env.ENDPOINTS.RECOMMENDATION}/:country/:campaign/:origin?`, async ctx => {
  try {
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
    ctx.body = await controller.runRecommendation(recommendationModel)
  } catch (error) {
    const origin = ctx.params.origin
    console.log(origin, error)
  }
})

module.exports = recommendationRouter
