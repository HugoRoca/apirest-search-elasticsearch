const indexRouter = require('./routes/index.route')
const searchEngineRoute = require('./routes/searchEngine.route')
const personalizationRoute = require('./routes/personalization.route')

module.exports = [
  indexRouter,
  searchEngineRoute,
  personalizationRoute
]
