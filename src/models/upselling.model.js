module.exports = class {
  constructor (
    country,
    campaign,
    consultantCode,
    zoneCode,
    cuv,
    codeProduct,
    quantityProducts,
    personalizations,
    configurations
  ) {
    this.country = country
    this.campaign = campaign
    this.consultantCode = consultantCode
    this.zoneCode = zoneCode
    this.cuv = cuv
    this.codeProduct = codeProduct
    this.quantityProducts = quantityProducts
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
  }

  get sortValue () {
    return [
      {
        precio: 'desc'
      }
    ]
  }
}
