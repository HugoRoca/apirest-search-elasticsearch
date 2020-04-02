const Router = require('koa-router')

const indexRouter = new Router()

indexRouter.get('/', async ctx => {
  ctx.status = 200
  ctx.body = '<h1>Search Engine</h1>'
})

module.exports = indexRouter
