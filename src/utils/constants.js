const codeCategories = {
  festivals: 'cat-festival'
}

const storeProcedures = {
  getFilters: '[Buscador].[ListaFiltro]',
  getCategories: '[Buscador].[ListaCategoria]'
}

const filterFields = {
  elasticsearchField: 'ElasticsearchCampo',
  elasticsearchOperator: 'ElasticsearchOperador'
}

module.exports = {
  storeProcedures,
  codeCategories,
  filterFields
}
