const validate = require('../utils/is')

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
      activeSubscription: configurations.suscripcionActiva,
      mdo: configurations.mdo,
      rd: configurations.rd,
      rdi: configurations.rdi,
      rdr: configurations.rdr,
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
      validate.isUndefined(this.order.field) ||
      this.order.field === '' ||
      validate.isUndefined(this.order.type) ||
      this.order.type === ''
    ) return false

    let json = `[{'${this.order.field.toLowerCase()}':'${this.order.type.toLowerCase()}'}, '_score']`

    if (this.order.toLowerCase() === 'orden') {
      json = `[{'ordenEstrategia': 'asc'}, {'${this.order.field.toLowerCase()}':'${this.order.type.toLowerCase()}'}, '_score']`
    }

    return JSON.parse(json)
  }
}
