const PersonalizationService = require('../services/personalization.service')
const PersonalizationModel = require('../models/personalizationRequest.model')
const ResponseModel = require('../models/response.model')
const LogManager = require('../utils/logManager')
const validate = require('../utils/is')

module.exports = class {
  async runPersonalization (ctx) {
    const logger = new LogManager()
    const personalizationModel = new PersonalizationModel(
      ctx.params.country,
      ctx.params.campaign,
      ctx.params.consultantCode,
      ctx.params.origin
    )
    try {
      if (!validate.isCountryActive(ctx.params.country)) ctx.body = new ResponseModel(0, [], [], `This country ${ctx.params.country} is not enabled`)
      const personalizationService = new PersonalizationService(personalizationModel)
      ctx.body = await personalizationService.runPersonalization()
    } catch (error) {
      logger.logError('personalization.controller', personalizationModel.country, 'runCategory', personalizationModel, error, personalizationModel.origin)
      ctx.throw(400, error)
    }
  }
}
