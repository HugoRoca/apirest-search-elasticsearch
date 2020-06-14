const supertest = require('supertest')
const server = require('../../../src/server')

const app = server.listen()

afterAll(() => {
  app.close()
})

describe('Testing index.route.js', () => {
  let request

  beforeEach(() => {
    request = supertest(app)
  })

  describe('GET /', () => {
    it('Should return status 200t', async () => {
      const url = '/'
      const res = await request
        .get(url)
        .expect('Content-Type', /json/)
        .expect(200)

      const { message } = res.body
      expect(message).toMatch('ok')
    })
  })
})
