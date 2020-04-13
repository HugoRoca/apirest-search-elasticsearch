const axios = require('axios')
const yenv = require('yenv')
const LogEventModel = require('../models/logEvent.model')
const _ = require('lodash')
const env = yenv()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

module.exports = class {
  constructor () {
    this.elasticPattern = env.LOGGING.PATTERN
    this.elasticEndpoint = env.LOGGING.ENDPOINT
    this.elasticType = env.LOGGING.TYPE
    this.application = env.LOGGING.APPLICATION
  }

  getUrl () {
    const today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1
    const yyyy = today.getFullYear()
    if (dd < 10) {
      dd = `0${dd}`
    }
    if (mm < 10) {
      mm = `0${mm}`
    }
    const indexName = `${this.elasticPattern}${yyyy}.${mm}.${dd}`
    return `${this.elasticEndpoint}/${indexName}/${this.elasticType}`
  }

  addLog (logEvent) {
    logEvent.Application = this.application
    axios.post(this.getUrl(), logEvent).catch(err => {
      console.log(err)
    })
  }

  logInfo (
    controller,
    country,
    method,
    parameters,
    message,
    origin
  ) {
    if (!env.LOGGING.ENABLED_INFO) return false
    let parametersString = parameters
    if (_.isObject(parameters) && !_.isNull(parameters)) parametersString = JSON.stringify(parameters)
    const logEventModel = new LogEventModel(
      'INFO',
      controller,
      method,
      country,
      origin,
      parametersString,
      message,
      {},
      this.application
    )
    this.addLog(logEventModel)
  }

  logError (
    controller,
    country,
    method,
    parameters,
    exception,
    origin
  ) {
    if (!env.LOGGING.ENABLED_ERROR) return false
    let parametersString = parameters
    let exceptionString = exception.message
    if (_.isObject(parameters) && !_.isNull(parameters)) parametersString = JSON.stringify(parameters)
    if (exception instanceof SyntaxError) exceptionString = this.printError(exception, true)
    else {
      exceptionString = this.printError(exception, false)
    }
    const logEventModel = new LogEventModel(
      'ERROR',
      controller,
      method,
      country,
      origin,
      parametersString,
      '',
      exceptionString,
      this.application
    )
    this.addLog(logEventModel)
  }

  printError (error, explicit) {
    return `[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`
  }
}
