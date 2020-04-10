const PersonalizationService = require('../services/personalization.service')

module.exports = class {
  async runPersonalization (params) {
    const personalizationService = new PersonalizationService(params)
    return await personalizationService.runPersonalization()
  }
}
