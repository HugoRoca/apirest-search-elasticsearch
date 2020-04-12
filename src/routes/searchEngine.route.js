const KoaRouter = require('koa-router')
const SearchEngineController = require('../controllers/searchEngine.controller')
const yenv = require('yenv')

const searhEngineRouter = new KoaRouter()
const controller = new SearchEngineController()
const env = yenv()

searhEngineRouter.post(`${env.ENDPOINTS.SEARHENGINE}/:country/:campaign/:origin?`, controller.runSearch)

module.exports = searhEngineRouter
