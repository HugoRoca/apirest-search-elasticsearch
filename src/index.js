const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const logger = require('koa-logger')
const yenv = require('yenv')
const routes = require('./routes')
const ElasticsearchManager = require('./utils/elasticsearchManager')

const env = yenv()
const server = new Koa()

server.use(bodyParser()).use(json()).use(logger())

routes.map((r) => {
  server.use(r.routes()).use(r.allowedMethods())
})

ElasticsearchManager.createConnectionPool()
  .then(
    () => {
      console.log('All connections were successful')
      server.listen(env.PORT, () => {
        console.log(`Listening on port: ${env.PORT}`)
      })
    },
    () => {
      console.log(
        'Application not started because at least one connectionString was unsuccessful...'
      )
    }
  )
  .catch((err) => {
    console.log(err)
  })
