const UpsellingService = require('../services/upselling.service')

module.exports = class {
  async runUpselling (params) {
    const upsellingService = new UpsellingService(params)
    return await upsellingService.runUpsellin()
  }
}
