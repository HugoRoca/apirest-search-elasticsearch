module.exports = class {
  constructor (total, products, filters, message, productsConsulted = []) {
    this.total = total
    this.productos = products
    this.filtros = filters
    this.mensage = message
    this.productoConsultado = productsConsulted
  }
}
