const CategoryService = require('../services/category.service')
const CategoryModel = require('../models/categoryRequest.model')
const ResponseModel = require('../models/response.model')
const LogManager = require('../utils/logManager')
const validate = require('../utils/is')

module.exports = class {
  async runCategory (ctx) {
    const logger = new LogManager()
    const categoryModel = new CategoryModel(
      ctx.params.country,
      ctx.params.campaign,
      ctx.params.origin,
      ctx.request.body.codigoConsultora,
      ctx.request.body.codigoZona,
      ctx.request.body.textoBusqueda,
      ctx.request.body.personalizaciones,
      ctx.request.body.configuracion
    )
    try {
      if (!validate.isCountryActive(categoryModel.country)) ctx.body = new ResponseModel(0, [], [], `This country ${categoryModel.country} is not enabled`)
      const categoryService = new CategoryService(categoryModel)
      ctx.body = await categoryService.runCategory()
    } catch (error) {
      logger.logError('category.controller', categoryModel.country, 'runCategory', categoryModel, error, categoryModel.origin)
      ctx.throw(400, error)
    }
  }
}
