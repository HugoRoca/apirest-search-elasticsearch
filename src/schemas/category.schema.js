const Joi = require('@hapi/joi')

exports.post = Joi.object().keys({
  country: Joi.string().required(),
  campaign: Joi.string().required(),
  origin: Joi.string().min(1)
})
