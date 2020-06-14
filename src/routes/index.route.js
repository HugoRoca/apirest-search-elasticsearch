const Router = require('koa-router')

const indexRouter = new Router()

indexRouter.get('/', async ctx => {
  ctx.status = 200
  ctx.body = {
    message: 'ok'
  }
})

module.exports = indexRouter
