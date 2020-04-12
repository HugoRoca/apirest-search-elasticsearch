const PersonalizationService = require('../services/personalization.service')
const PersonalizationModel = require('../models/personalizationRequest.model')
const ResponseModel = require('../models/response.model')
const validate = require('../utils/is')

module.exports = class {
  async runPersonalization (ctx) {
    try {
      if (!validate.isCountryActive(ctx.params.country)) ctx.body = new ResponseModel(0, [], [], `This country ${ctx.params.country} is not enabled`)
      const personalizationModel = new PersonalizationModel(
        ctx.params.country,
        ctx.params.campaign,
        ctx.params.consultantCode
      )
      const personalizationService = new PersonalizationService(personalizationModel)
      ctx.body = await personalizationService.runPersonalization()
    } catch (error) {
      ctx.throw(400, error)
    }
  }
}
