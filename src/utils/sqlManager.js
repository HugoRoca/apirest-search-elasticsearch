const mssql = require('mssql')
const yenv = require('yenv')
const env = yenv()

module.exports = class {
  constructor (country) {
    this.country = country
  }

  connect () {
    mssql.ConnectionError('error', err => {
      console.log(err)
      mssql.close()
    })

    const dataBaseName = env.SQL.DATABASES[this.country.toUpperCase()]
    const connectionString = env.SQL.CONNECTION_STRING.replace('dataBaseName', dataBaseName)

    return mssql.connect(connectionString)
  }

  async execStoreProcedure (nameStore) {
    return new Promise((resolve, reject) => {
      const exec = this.connect().then(pool => pool.request().query(nameStore))
      exec.then(result => {
        mssql.close()
        resolve(result.recordset)
      }).catch(err => {
        mssql.close()
        reject(err)
      })
    })
  }
}
