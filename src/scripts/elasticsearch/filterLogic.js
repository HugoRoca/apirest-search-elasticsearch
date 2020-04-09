/* eslint-disable prefer-const */
const Utils = require('../../utils/utils')
const _ = require('lodash')

module.exports = class {
  constructor (filters) {
    this.filtersCache = filters
  }

  getSelectedFiltersQuery (selectedFilters) {
    console.log('this.params.selectedFilters', selectedFilters)
    if (_.size(selectedFilters) === 0) return {}
    const sectionsFilters = Utils.distinctInArray(this.filtersCache, 'IdSeccion')
    let must = []
    for (let i = 0; i < sectionsFilters.length; i++) {
      const item = sectionsFilters[i]
      const filterSelected = Utils.selectInArrayByKey(selectedFilters, 'idSeccion', item.IdSeccion)
      for (let j = 0; j < filterSelected.length; j++) {
        const element = filterSelected[j]
        const dataFilter = this.filtersCache.find(x => x.Codigo === element.idFiltro)
        if (dataFilter) {
          let ranges = []
          let should = []
          switch (dataFilter.ElasticsearchOperador) {
            case 'term':
              should.push({
                term: {
                  [dataFilter.ElasticsearchCampo]: dataFilter.FiltroNombre || ''
                }
              })
              break
            case 'range':
              if (dataFilter.ValorMinimo > 0 && dataFilter.ValorMaximo > 0) {
                ranges.push({
                  from: dataFilter.ValorMinimo,
                  to: dataFilter.ValorMaximo
                })
              } else {
                if (dataFilter.ValorMaximo > 0) ranges.push({ to: dataFilter.ValorMaximo })
                if (dataFilter.ValorMinimo > 0) ranges.push({ from: dataFilter.ValorMinimo })
              }

              if (ranges.length > 0) {
                should.push({
                  range: {
                    [dataFilter.ElasticsearchCampo]: ranges
                  }
                })
              }
              break
          }
          must.push({ bool: { should } })
        }
      }
    }
    if (must.length === 0) return {}
    return {
      bool: must
    }
  }

  getAggregations () {
    if (_.isUndefined(this.filtersCache)) return []
    const filters = Utils.distinctInArray(this.filtersCache, 'ElasticsearchCampo')
    let aggs = '{'
    let point = 0
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i]
      if (point > 0) aggs += ','
      if (filter.ElasticsearchOperador === 'term') {
        if (filter.ElasticsearchCampo === 'categorias.keyword') {
          aggs += `"${filter.ElasticsearchCampo}":{ "terms": { "field": "${filter.ElasticsearchCampo}", "size": 500 }}`
        } else {
          aggs += `"${filter.ElasticsearchCampo}":{ "terms": { "field": "${filter.ElasticsearchCampo}" }}`
        }
      }
      if (filter.ElasticsearchOperador === 'range') {
        const onlyRanges = Utils.selectInArrayByKey(this.filtersCache, 'ElasticsearchOperador', filter.ElasticsearchOperador)
        let pointRange = 0
        aggs += `"${filter.ElasticsearchCampo}": { "range": { "field": "${filter.ElasticsearchCampo}", "ranges": [`
        for (let j = 0; j < onlyRanges.length; j++) {
          const item = onlyRanges[j]
          if (pointRange > 0) aggs += ','
          aggs += `{ "key": "${item.FiltroNombre}"`
          if (item.ValorMinimo > 0) aggs += `, "from": "${item.ValorMinimo}"`
          if (item.ValorMaximo > 0) aggs += `, "to": "${item.ValorMaximo}"`
          aggs += '}'

          pointRange++
        }
        aggs += ']}}'
      }
      point++
    }
    aggs += '}'
    return JSON.parse(aggs)
  }
}
