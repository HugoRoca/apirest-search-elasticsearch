const ResponseModel = require('../models/response.model')
const validate = require('../utils/is')

module.exports = class {
  async execJob (params) {
    if (!validate.isCountryActive(params.country)) return new ResponseModel(0, [], [], `This country ${params.country} is not enabled`)
    return params
  }
}
