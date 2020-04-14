const KoaRouter = require('koa-router')
// const searchSchemas = require('../schemas/searchEngine.schema')
// const schemaValidator = require('../utils/schemaValidator')
const SearchEngineController = require('../controllers/searchEngine.controller')
const yenv = require('yenv')
// const validator = schemaValidator({
//   params: searchSchemas.paramsSchema,
//   body: searchSchemas.bodySchema
// })
const searhEngineRouter = new KoaRouter()
const controller = new SearchEngineController()
const env = yenv()

// searhEngineRouter.post(`${env.ENDPOINTS.SEARHENGINE}/:country/:campaign/:origin?`, validator, controller.runSearch)
searhEngineRouter.post(`${env.ENDPOINTS.SEARHENGINE}/:country/:campaign/:origin?`, controller.runSearch)

module.exports = searhEngineRouter
