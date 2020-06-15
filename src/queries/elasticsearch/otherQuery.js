const Constants = require('../../utils/constants')
const Utils = require('../../utils/utils')
const _ = require('lodash')

module.exports = class {
  constructor (params) {
    this.params = params
  }

  getQueryMultiMatch () {
    if (_.isNull(this.params.searchText) || _.isEmpty(this.params.searchText)) return undefined
    const decodeText = Utils.decodeText(this.params.searchText)
    return [{
      multi_match: {
        query: decodeText,
        type: 'best_fields',
        fields: [
          'textoBusqueda^20',
          'textoBusqueda.synonym^15',
          'textoBusqueda.ngram^12',
          'textoBusqueda.phonetic^10',
          'cuv',
          'marcas^8',
          'marcas.synonym^6',
          'marcas.phonetic^4',
          'marcas.ngram',
          'categorias^8',
          'categorias.synonym^6',
          'categorias.phonetic^4',
          'categorias.ngram',
          'lineas^8',
          'lineas.synonym^6',
          'lineas.phonetic^2',
          'lineas.ngram',
          'grupoArticulos^8',
          'grupoArticulos.synonym^8',
          'grupoArticulos.phonetic^6',
          'grupoArticulos.ngram',
          'seccion1^8',
          'seccion1.synonym^6',
          'seccion1.phonetic^4',
          'seccion1.ngram'
        ]
      }
    }]
  }

  getQueryFestivals () {
    const existsFestivals = this.params.selectedFilters.filter(val => {
      return val.idFiltro === Constants.codeCategories.festivals
    })

    if (existsFestivals.length > 0) {
      return {
        term: { flagFestival: 1 }
      }
    }

    return {}
  }
}
