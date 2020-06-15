const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const logger = require('koa-logger')
const yenv = require('yenv')
const routes = require('./routes')
const ElasticsearchManager = require('./utils/elasticsearchManager')
const docs = require('./utils/api.docs')
const log = require('fancy-log')

const env = yenv()
const server = new Koa()

server.use(bodyParser()).use(json()).use(logger()).use(docs)

routes.map((r) => {
  server.use(r.routes()).use(r.allowedMethods())
})

if (env.NODE_ENV !== 'test') {
  ElasticsearchManager.createConnectionPool()
    .then(
      () => {
        log.info('All connections were successful')
        server.listen(env.PORT, () => {
          log.info(`Listening on port: ${env.PORT}`)
        })
      },
      () => {
        log.error('Application not started because at least one connectionString was unsuccessful...')
      }
    )
    .catch((err) => {
      log.error(err)
    })
}

module.exports = server
