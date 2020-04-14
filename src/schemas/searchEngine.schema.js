const Joi = require('@hapi/joi')

const paramsSchema = Joi.object().keys({
  country: Joi
    .string()
    .length(2)
    .required(),
  campaign: Joi
    .string()
    .regex(/^20\d{4}$/)
    .required(),
  origin: Joi
    .string()
    .optional()
})

const bodySchema = Joi.object().keys({
  codigoConsultora: Joi
    .string()
    .required(),
  codigoZona: Joi.string()
    .regex(/^\d{4}$/),
  textoBusqueda: Joi.string().optional(),
  personalizaciones: Joi.string().optional(),
  configuracion: {
    sociaEmpresaria: Joi
      .string()
      .length(1)
      .valid('0', '1')
      .default('0'),
    suscripcionActiva: Joi
      .string()
      .valid('true', 'false', 'True', 'False')
      .default('True'),
    mdo: Joi
      .string()
      .valid('true', 'false', 'True', 'False')
      .default('True'),
    rd: Joi
      .string()
      .valid('true', 'false', 'True', 'False')
      .default('True'),
    rdi: Joi
      .string()
      .valid('true', 'false', 'True', 'False')
      .default('True'),
    rdr: Joi
      .string()
      .valid('true', 'false', 'True', 'False')
      .default('True'),
    diaFacturacion: Joi
      .number()
      .integer()
      .min(0)
      .default(0),
    esFacturacion: Joi
      .bool()
      .default(false)
  },
  paginacion: {
    numeroPagina: Joi
      .number()
      .integer()
      .min(0)
      .default(0),
    cantidad: Joi
      .number()
      .integer()
      .min(1)
      .default(20)
  },
  orden: {
    campo: Joi
      .string()
      .default('orden'),
    tipo: Joi
      .string()
      .valid('asc', 'desc')
      .default('asc')
  },
  filtro: Joi.any()
})

module.exports = {
  bodySchema,
  paramsSchema
}
