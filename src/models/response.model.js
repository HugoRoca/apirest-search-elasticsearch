module.exports = class {
  constructor (total, products, filters, message, productsConsulted = [], result = [], success = true) {
    this.success = success
    this.total = total
    this.productos = products
    this.filtros = filters
    this.message = message
    this.productoConsultado = productsConsulted
    this.result = result
  }
}
