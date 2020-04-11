const KoaRouter = require('koa-router')
const UpsellingController = require('../controllers/upselling.controller')
const UpsellingModel = require('../models/upselling.model')
const yenv = require('yenv')

const upsellingRouter = new KoaRouter()
const controller = new UpsellingController()
const env = yenv()

upsellingRouter.post(`${env.ENDPOINTS.UPSELLING}/:country/:campaign/:origin?`, async ctx => {
  try {
    const upsellingModel = new UpsellingModel(
      ctx.params.country,
      ctx.params.campaign,
      ctx.request.body.codigoConsultora,
      ctx.request.body.codigoZona,
      ctx.request.body.cuv,
      ctx.request.body.codigoProducto,
      ctx.request.body.precioProducto,
      ctx.request.body.cantidadProductos,
      ctx.request.body.personalizaciones,
      ctx.request.body.configuracion
    )
    ctx.body = await controller.runUpselling(upsellingModel)
  } catch (error) {
    const origin = ctx.params.origin
    console.log(origin, error)
  }
})

module.exports = upsellingRouter
