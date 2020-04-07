const DummyConsultantLogic = require('../scripts/elasticsearch/dummyConsultantLogic')
// const yenv = require('yenv')
// const env = yenv()

module.exports = class {
  constructor (params) {
    this.params = params
  }

  async getDataElastic () {
    const filter = new DummyConsultantLogic(this.params)
    return filter.getQueryConsultantDummy()
  }
}
