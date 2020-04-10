const KoaRouter = require('koa-router')
const CategoryController = require('../controllers/category.controller')
const CategoryModel = require('../models/categoryRequest.model')
const yenv = require('yenv')

const searhEngineRouter = new KoaRouter()
const controller = new CategoryController()
const env = yenv()

searhEngineRouter.post(`${env.ENDPOINTS.CATEGORY}/:country/:campaign/:origin?`, async ctx => {
  try {
    const categoryModel = new CategoryModel(
      ctx.params.country,
      ctx.params.campaign,
      ctx.request.body.codigoConsultora,
      ctx.request.body.codigoZona,
      ctx.request.body.textoBusqueda,
      ctx.request.body.personalizaciones,
      ctx.request.body.configuracion
    )
    ctx.body = await controller.runCategory(categoryModel)
  } catch (error) {
    const origin = ctx.params.origin
    console.log(origin, error)
  }
})

module.exports = searhEngineRouter
