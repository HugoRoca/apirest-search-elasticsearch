const KoaRouter = require('koa-router')
const PersonalizationController = require('../controllers/personalization.controller')
const PersonalizationModel = require('../models/personalizationRequest.mode')
const yenv = require('yenv')

const personalizationRouter = new KoaRouter()
const controller = new PersonalizationController()
const env = yenv()

personalizationRouter.get(`${env.ENDPOINTS.PERSONALIZATION}/:country/:campaign/:consultantCode/:origin?`, async ctx => {
  try {
    const personalizationModel = new PersonalizationModel(
      ctx.params.country,
      ctx.params.campaign,
      ctx.params.consultantCode,
      ctx.params.origin
    )
    ctx.body = await controller.runPersonalization(personalizationModel)
  } catch (error) {
    const origin = ctx.params.origin
    console.log(origin, error)
  }
})

module.exports = personalizationRouter
