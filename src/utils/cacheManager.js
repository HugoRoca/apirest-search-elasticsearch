const IoRedis = require('ioredis')
const yenv = require('yenv')
const env = yenv()

class CacheManager {
  constructor () {
    if (!CacheManager.instance) {
      this.client = env.REDIS && env.REDIS.ENABLED ? this.connect() : null
      CacheManager.instance = this
    }
    return CacheManager.instance
  }

  connect () {
    const client = new IoRedis({
      host: env.REDIS.ENDPOINT,
      port: env.REDIS.PORT,
      lazyConnect: true,
      retryStrategy (times) {
        const delay = Math.min(times * env.REDIS.TIME_TO_RETRY, 1000)
        return delay
      },
      maxRetriesPerRequest: env.REDIS.RETRIES
    })

    client.on('connect', () => {
      console.log('Conectado a redis')
    })

    client.on('error', err => {
      console.error('Redis error ' + err)
    })

    return client
  }

  async clear () {
    await this.client.flushall()
  }

  async get (key) {
    if (env.REDIS && env.REDIS.ENABLED) {
      return await this.client.get(key)
    } else {
      return null
    }
  }

  async set (key, value) {
    if (env.REDIS && env.REDIS.ENABLED) {
      return await this.client.set(key, value, 'EX', env.REDIS.TIME_TO_LIVE)
    }
  }
}

const instance = new CacheManager()
Object.freeze(instance)

module.exports = instance
