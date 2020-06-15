exports.active = { term: { activo: true } }
exports.greaterThanZero = { range: { precio: { gt: 0 } } }
exports.categoriesKeyword = {
  terms: {
    'categorias.keyword': ['Maquillaje', 'Fragancias', 'Cuidado Personal', 'Tratamiento Facial', 'Tratamiento Corporal']
  }
}
exports.groupArticleKeyword = {
  terms: {
    'grupoArticulos.keyword': ['Maquillaje', 'Fragancias', 'Cuidado Personal', 'Tratamiento Facial', 'Tratamiento Corporal']
  }
}
