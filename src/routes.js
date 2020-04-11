const indexRouter = require('./routes/index.route')
const searchEngineRoute = require('./routes/searchEngine.route')
const personalizationRoute = require('./routes/personalization.route')
const categoryRoute = require('./routes/category.route')
const recommendationRoute = require('./routes/recommendation.route')
const upSellingRoute = require('./routes/upselling.route')

module.exports = [
  indexRouter,
  searchEngineRoute,
  personalizationRoute,
  categoryRoute,
  recommendationRoute,
  upSellingRoute
]
