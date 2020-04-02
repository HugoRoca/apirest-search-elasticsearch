const validate = require('../utils/is')

module.exports = class {
  constructor (
    country,
    campaign,
    consultantCode,
    zoneCode,
    searchText,
    quantityProducts,
    businessPartner,
    activeSubscription,
    mdo,
    rd,
    rdi,
    rdr,
    billingDay,
    personalizations,
    numberPage,
    order,
    orderType,
    filter,
    isBilling
  ) {
    this.country = country
    this.campaign = campaign
    this.consultantCode = consultantCode
    this.zoneCode = zoneCode
    this.textoBusqueda = searchText
    this.quantityProducts = quantityProducts
    this.businessPartner = businessPartner
    this.activeSubscription = activeSubscription
    this.mdo = mdo
    this.rd = rd
    this.rdi = rdi
    this.rdr = rdr
    this.billingDay = billingDay
    this.personalizations = personalizations
    this.numberPage = numberPage
    this.order = order
    this.orderType = orderType
    this.filter = filter
    this.isBilling = isBilling
  }

  get fromValue () {
    return this.cantidadProductos * this.numeroPagina
  }

  get sortValue () {
    if (
      validate.isUndefined(this.order) ||
      this.order === '' ||
      validate.isUndefined(this.orderType) ||
      this.orderType === ''
    ) return false

    let json = `[{'${this.order.toLowerCase()}':'${this.orderType.toLowerCase()}'}, '_score']`

    if (this.order.toLowerCase() === 'orden') {
      json = `[{'ordenEstrategia': {'unmapped_type': 'integer'}}, {'${this.order.toLowerCase()}':'${this.orderType.toLowerCase()}'}, '_score']`
    }

    return JSON.parse(json)
  }
}
