const UpsellingService = require('../services/upselling.service')
const UpsellingModel = require('../models/upsellingRequest.model')
const ResponseModel = require('../models/response.model')
const validate = require('../utils/is')

module.exports = class {
  async runUpselling (ctx) {
    try {
      if (!validate.isCountryActive(ctx.params.country)) ctx.body = new ResponseModel(0, [], [], `This country ${ctx.params.country} is not enabled`)
      const upsellingModel = new UpsellingModel(
        ctx.params.country,
        ctx.params.campaign,
        ctx.request.body.codigoConsultora,
        ctx.request.body.codigoZona,
        ctx.request.body.cuv,
        ctx.request.body.codigoProducto,
        ctx.request.body.precioProducto,
        ctx.request.body.cantidadProductos,
        ctx.request.body.personalizaciones,
        ctx.request.body.configuracion
      )
      const upsellingService = new UpsellingService(upsellingModel)
      ctx.body = await upsellingService.runUpselling()
    } catch (error) {
      ctx.throw(400, error)
    }
  }
}
