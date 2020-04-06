const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (params) {
    this.params = params
  }

  getAllLogicFilters () {
    this.params.personalizationsFilters = this.filterGND()
    this.params.personalizationsFilters = this.filterLAN()
    return this.params.personalizationsFilters
  }

  filterGND () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.GND) return this.params.personalizationsFilters
    if (this.params.configurations.businessPartner === '1') return this.params.personalizationsFilters.filter((x) => x !== 'GND')
    if (this.params.configurations.businessPartner === '1' &&
     this.params.configurations.activeSubscription) return this.params.personalizationsFilters.filter((x) => x !== 'GND')
    return this.params.personalizationsFilters
  }

  filterLAN () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.LAN) return this.params.personalizationsFilters
    if (!this.params.configurations.activeSubscription) return this.params.personalizationsFilters.filter((x) => x !== 'LAN')
    return this.params.personalizationsFilters
  }

  filterODD () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.ODD) return this.params.personalizationsFilters
    return this.params.personalizationsFilters.filter((x) => x !== 'ODD')
  }

  filterOPT () {

  }
}
