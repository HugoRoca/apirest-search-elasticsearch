module.exports = class {
  constructor (filters, selectedFilters) {
    this.filters = filters
    this.selectedFilters = selectedFilters
  }

  getAggregations () {
    return {}
  }
}
