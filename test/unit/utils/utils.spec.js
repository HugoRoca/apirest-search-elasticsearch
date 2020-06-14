/* eslint-disable no-undef */
const utils = require('../../../src/utils/utils')
const yenv = require('yenv')
const env = yenv()

describe('#selectInArrayByKey', () => {
  test('should look in an array by a key and value', () => {
    const array = [{
      key: 1
    },
    {
      key: 2
    }]
    const output = [{ key: 1 }]
    expect(utils.selectInArrayByKey(array, 'key', 1)).toEqual(output)
  })
})

describe('#distinctInArray', () => {
  test('should look in an array of duplicate objects', () => {
    const array = [{
      key: 1
    },
    {
      key: 1
    },
    {
      key: 2
    }]
    const output = [{ key: 1 }, { key: 2 }]
    expect(utils.distinctInArray(array, 'key')).toEqual(output)
  })
})

describe('#decodeText', () => {
  test('should decode a text sent by http', () => {
    const encode = utils.decodeText('pack%20talco')
    const output = 'pack%20talco'
    expect(utils.decodeText(encode)).toEqual(output)
  })
})

describe('#buildImageUrl', () => {
  test('must validate when it does not meet any condition', () => {
    const validate = utils.buildImageUrl('test', 'PE', 3, '202006', 1)
    const output = 'no_tiene_imagen.jpg'
    expect(validate).toEqual(output)
  })
  test('should validate when the image name is null or undefined', () => {
    const validate = utils.buildImageUrl(null, 'PE', 3, '202006', 1)
    const output = 'no_tiene_imagen.jpg'
    expect(validate).toEqual(output)
  })
  test('should validate when the image name is a URL', () => {
    const validate = utils.buildImageUrl('http://somosbelcorp.com/images/pack.js', 'PE', 3, '202006', 1)
    const output = 'http://somosbelcorp.com/images/pack.js'
    expect(validate).toEqual(output)
  })
  test('should validate when the ogirin id is 1', () => {
    const validate = utils.buildImageUrl('test', 'PE', 1, '202006', 1)
    const urlSB = env.EXTERNAL_APIS.IMAGES_SB
    const output = `${urlSB}Matriz/PE/test`
    expect(validate).toEqual(output)
  })
  test('should validate when the ogirin id is 2', () => {
    const validate = utils.buildImageUrl('test', 'PE', 1, '202006', 1)
    const urlSB = env.EXTERNAL_APIS.IMAGES_SB
    const output = `${urlSB}Matriz/PE/test`
    expect(validate).toEqual(output)
  })
  test('must validate when the source id is 2 and the image name comes with "|"', () => {
    const nameImage = 'L|E|C'
    const urlAPP = env.EXTERNAL_APIS.IMAGES_APP_CATALOGUE
    const brands = ['L', 'E', 'C']
    const split = nameImage.split('|')
    const output = `${urlAPP}${split[0]}/${split[1]}/${brands[0]}/productos/${split[2]}`
    const validate = utils.buildImageUrl(nameImage, 'PE', 2, '202006', 1)
    expect(validate).toEqual(output)
  })
  test('should validate when the source ID is 2 and the image name', () => {
    const nameImage = 'test'
    const country = 'PE'
    const campaign = '202006'
    const urlAPP = env.EXTERNAL_APIS.IMAGES_APP_CATALOGUE
    const brands = ['L', 'E', 'C']
    const output = `${urlAPP}${country}/${campaign}/${brands[0]}/productos/${nameImage}`
    const validate = utils.buildImageUrl(nameImage, country, 2, campaign, 1)
    expect(validate).toEqual(output)
  })
})
