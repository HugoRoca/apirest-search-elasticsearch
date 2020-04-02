const KoaRouter = require('koa-router')
const SearchEngineController = require('../controllers/searchEngine.controller')
const yenv = require('yenv')

const searhEngineRouter = new KoaRouter()
const controller = new SearchEngineController()
const env = yenv()

searhEngineRouter.post(`${env.ENDPOINTS.SEARHENGINE}/:country/:campaign/:origin?`, async ctx => {
  try {
    const params = {
      country: ctx.params.country,
      test: ctx.request.body.test
    }
    ctx.body = await controller.execJob(params)
  } catch (error) {
    console.log(error)
  }
})

module.exports = searhEngineRouter
