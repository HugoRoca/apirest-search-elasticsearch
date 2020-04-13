const KoaRouter = require('koa-router')
const CategoryController = require('../controllers/category.controller')
const yenv = require('yenv')

const searhEngineRouter = new KoaRouter()
const controller = new CategoryController()
const env = yenv()

searhEngineRouter.post(`${env.ENDPOINTS.CATEGORY}/:country/:campaign/:origin?`, controller.runCategory)

module.exports = searhEngineRouter
