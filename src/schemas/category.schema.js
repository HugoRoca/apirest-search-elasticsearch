const Joi = require('@hapi/joi')

exports.post = Joi.object().keys({
  country: Joi.string().min(2).required()
})
