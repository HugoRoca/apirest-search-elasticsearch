const os = require('os')

module.exports = class {
  constructor (
    level,
    controller,
    method,
    country,
    origin,
    parameters,
    message,
    exception,
    application = ''
  ) {
    this.Date = new Date()
    this.HostName = os.hostname()
    this.Trace = 'LogEvent'
    this.Level = level
    this.Controller = controller
    this.Method = method
    this.Country = country
    this.Origin = origin
    this.Parameters = parameters
    this.Message = message
    this.Exception = exception
    this.Application = application
  }
}
