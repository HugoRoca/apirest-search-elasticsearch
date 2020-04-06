const validate = require('../../utils/is')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (params) {
    this.params = params
  }

  getAllLogicFilters () {
    let personalizationsFilters = this.params.personalizationsFilters
    for (let i = 0; i < personalizationsFilters.length; i++) {
      const item = personalizationsFilters[i]
      const isDummy =


    }

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

  excludeLogicFilterGND () {
    if (!env.CONSTANTS.LOGIC_CONSULTANT_DUMMY.GND) return false
    if (this.params.configurations.businessPartner === '1') return true
    if (this.params.configurations.businessPartner === '1' && this.params.configurations.activeSubscription) return true
    return false
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
