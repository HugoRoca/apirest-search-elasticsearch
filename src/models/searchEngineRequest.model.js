// eslint-disable-next-line no-unused-vars
const _ = require('lodash')

module.exports = class {
  constructor (
    country,
    campaign,
    consultantCode,
    zoneCode,
    searchText,
    personalizations,
    configurations,
    pagination,
    order,
    filter
  ) {
    this.country = country
    this.campaign = campaign
    this.consultantCode = consultantCode
    this.zoneCode = zoneCode
    this.textoBusqueda = searchText
    this.personalizations = personalizations
    this.configurations = {
      businessPartner: configurations.sociaEmpresaria,
      activeSubscription: configurations.suscripcionActiva.toLowerCase() === 'true',
      mdo: configurations.mdo.toLowerCase() === 'true',
      rd: configurations.rd.toLowerCase() === 'true',
      rdi: configurations.rdi.toLowerCase() === 'true',
      rdr: configurations.rdr.toLowerCase() === 'true',
      billingDay: configurations.diaFacturacion,
      isBilling: configurations.esFacturacion
    }
    this.pagination = {
      quantityProducts: pagination.cantidad,
      numberPage: pagination.numeroPagina
    }
    this.order = {
      field: order.campo,
      type: order.tipo
    }
    this.filter = filter
  }

  get fromValue () {
    return this.cantidadProductos * this.numeroPagina
  }

  get sortValue () {
    if (
      _.isUndefined(this.order.field) ||
      this.order.field === '' ||
      _.isUndefined(this.order.type) ||
      this.order.type === ''
    ) return false

    let json = `[{"${this.order.field.toLowerCase()}":"${this.order.type.toLowerCase()}"}, "_score"]`

    if (this.order.field.toLowerCase() === 'orden') {
      json = `[{"ordenEstrategia": "asc"}, {"${this.order.field.toLowerCase()}":"${this.order.type.toLowerCase()}"}, "_score"]`
    }
    return JSON.parse(json)
  }
}
