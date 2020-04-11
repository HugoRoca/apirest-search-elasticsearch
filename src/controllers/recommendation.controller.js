const RecommendationService = require('../services/recommendation.service')

module.exports = class {
  async runRecommendation (params) {
    const recommendationService = new RecommendationService(params)
    return await recommendationService.runRecommendation()
  }
}
