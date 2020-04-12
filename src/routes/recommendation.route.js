const KoaRouter = require('koa-router')
const RecommendationController = require('../controllers/recommendation.controller')
const yenv = require('yenv')

const recommendationRouter = new KoaRouter()
const controller = new RecommendationController()
const env = yenv()

recommendationRouter.post(`${env.ENDPOINTS.RECOMMENDATION}/:country/:campaign/:origin?`, controller.runRecommendation)

module.exports = recommendationRouter
