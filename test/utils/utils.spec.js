const utils = require('../../src/utils/utils')

describe('#selectInArrayByKey', () => {
  test('should look in an array by a key and value', () => {
    const array = [{
      valor: 1
    },
    {
      valor: 2
    }]
    const output = [{ valor: 1 }]
    expect(utils.selectInArrayByKey(array, 'valor', 1)).toEqual(output)
  })
})
