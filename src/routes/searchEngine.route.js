const KoaRouter = require('koa-router')
const SearchEngineController = require('../controllers/searchEngine.controller')
const SearchEngineModel = require('../models/searchEngineRequest.model')
const yenv = require('yenv')

const searhEngineRouter = new KoaRouter()
const controller = new SearchEngineController()
const env = yenv()

searhEngineRouter.post(`${env.ENDPOINTS.SEARHENGINE}/:country/:campaign/:origin?`, async ctx => {
  try {
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
    ctx.body = await controller.execJob(searchEngineModel)
  } catch (error) {
    const origin = ctx.params.origin
    console.log(origin, error)
  }
})

module.exports = searhEngineRouter
