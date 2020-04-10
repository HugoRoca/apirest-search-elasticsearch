const axios = require('axios')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  async validateStock (country, campaign, listCuvs, isBilling) {
    const cuvs = listCuvs.join('|')
    return await axios.post(env.EXTERNAL_APIS.API_PROL, {
      json: {
        paisISO: country,
        campaniaID: campaign,
        listaCUVs: cuvs,
        flagDetalle: 0,
        esFacturacion: isBilling
      }
    })
  }
}
