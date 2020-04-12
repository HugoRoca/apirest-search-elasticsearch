const KoaRouter = require('koa-router')
const UpsellingController = require('../controllers/upselling.controller')
const yenv = require('yenv')

const upsellingRouter = new KoaRouter()
const controller = new UpsellingController()
const env = yenv()

upsellingRouter.post(`${env.ENDPOINTS.UPSELLING}/:country/:campaign/:origin?`, controller.runUpselling)

module.exports = upsellingRouter
