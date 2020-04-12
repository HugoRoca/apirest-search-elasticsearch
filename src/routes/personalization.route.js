const KoaRouter = require('koa-router')
const PersonalizationController = require('../controllers/personalization.controller')
const yenv = require('yenv')

const personalizationRouter = new KoaRouter()
const controller = new PersonalizationController()
const env = yenv()

personalizationRouter.get(`${env.ENDPOINTS.PERSONALIZATION}/:country/:campaign/:consultantCode/:origin?`, controller.runPersonalization)

module.exports = personalizationRouter
