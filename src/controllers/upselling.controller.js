const UpsellingService = require('../services/upselling.service')
const UpsellingModel = require('../models/upsellingRequest.model')
const ResponseModel = require('../models/response.model')
const LogManager = require('../utils/logManager')
const validate = require('../utils/is')

module.exports = class {
  async runUpselling (ctx) {
    const logger = new LogManager()
    const upsellingModel = new UpsellingModel(
      ctx.params.country,
      ctx.params.campaign,
      ctx.params.origin,
      ctx.request.body.codigoConsultora,
      ctx.request.body.codigoZona,
      ctx.request.body.cuv,
      ctx.request.body.codigoProducto,
      ctx.request.body.precioProducto,
      ctx.request.body.cantidadProductos,
      ctx.request.body.personalizaciones,
      ctx.request.body.configuracion
    )
    try {
      if (!validate.isCountryActive(ctx.params.country)) ctx.body = new ResponseModel(0, [], [], `This country ${ctx.params.country} is not enabled`)
      const upsellingService = new UpsellingService(upsellingModel)
      ctx.body = await upsellingService.runUpselling()
    } catch (error) {
      logger.logError('searchEngine.controller', upsellingModel.country, 'runCategory', upsellingModel, error, upsellingModel.origin)
      ctx.throw(400, error)
    }
  }
}
