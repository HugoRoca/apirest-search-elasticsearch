const path = require('path')
const swagger = require('swagger2')
const swaggerKoa = require('swagger2-koa')

const file = path.join(__dirname, '../../docs.yaml')
const document = swagger.loadDocumentSync(file)

module.exports = swaggerKoa.ui(document, '/docs')
