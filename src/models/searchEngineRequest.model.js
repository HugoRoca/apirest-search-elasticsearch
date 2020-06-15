// eslint-disable-next-line no-unused-vars
const { isUndefined } = require('lodash')

module.exports = class {
  constructor (
    country,
    campaign,
    consultantCode,
    origin,
    zoneCode,
    searchText,
    personalizations,
    configurations,
    pagination,
    order,
    selectedFilters
  ) {
    this.country = country
    this.campaign = campaign
    this.consultantCode = consultantCode
    this.origin = origin
    this.zoneCode = zoneCode
    this.searchText = searchText || ''
    this.personalizationsDummy = personalizations
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
    this.selectedFilters = selectedFilters
  }

  get fromValue () {
    return this.pagination.quantityProducts * this.pagination.numberPage
  }

  get sortValue () {
    if (
      isUndefined(this.order.field) ||
      this.order.field === '' ||
      isUndefined(this.order.type) ||
      this.order.type === ''
    ) return false

    let json = `[{"${this.order.field.toLowerCase()}":"${this.order.type.toLowerCase()}"}, "_score"]`

    if (this.order.field.toLowerCase() === 'orden') {
      json = `[{"ordenEstrategia": "asc"}, {"${this.order.field.toLowerCase()}":"${this.order.type.toLowerCase()}"}, "_score"]`
    }
    return JSON.parse(json)
  }
}
