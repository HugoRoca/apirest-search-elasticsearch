const CategoryService = require('../services/category.service')
const CategoryModel = require('../models/categoryRequest.model')
const ResponseModel = require('../models/response.model')
const validate = require('../utils/utils')

module.exports = class {
  async runCategory (ctx) {
    try {
      if (!validate.isCountryActive(ctx.params.country)) ctx.body = new ResponseModel(0, [], [], `This country ${ctx.params.country} is not enabled`)
      const categoryModel = new CategoryModel(
        ctx.params.country,
        ctx.params.campaign,
        ctx.request.body.codigoConsultora,
        ctx.request.body.codigoZona,
        ctx.request.body.textoBusqueda,
        ctx.request.body.personalizaciones,
        ctx.request.body.configuracion
      )
      const categoryService = new CategoryService(categoryModel)
      ctx.body = await categoryService.runCategory()
    } catch (error) {
      ctx.throw = error
    }
  }
}
