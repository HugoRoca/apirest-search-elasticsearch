const KoaRouter = require('koa-router')
const CategoryController = require('../controllers/category.controller')
const CategorySchema = require('../schemas/category.schema')
const schemaValidator = require('../utils/schemaValidator')
const yenv = require('yenv')

const searhEngineRouter = new KoaRouter()
const controller = new CategoryController()
const postValidator = schemaValidator({ params: CategorySchema.post })
const env = yenv()

searhEngineRouter.post(env.ENDPOINTS.CATEGORY, '/:country/:campaign/:origin?', postValidator, controller.runCategory)

module.exports = searhEngineRouter
