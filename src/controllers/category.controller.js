const CategoryService = require('../services/category.service')

module.exports = class {
  async runCategory (params) {
    const categoryService = new CategoryService(params)
    return await categoryService.runCategory()
  }
}
