let mockDsoList = [
  {
    'product': 'A',
    'category': 'quick',
    'tblName': 'a'
  },
  {
    'product': 'B',
    'category': 'prior',
    'tblName': 'b'
  },
  {
    'product': 'C',
    'category': 'normal',
    'tblName': 'c'
  }
]

let indexMap = {}
function doIndex () {
  indexMap = {}
  mockDsoList.forEach((item, idx) => {
    indexMap[item.product] = idx
  })
}
doIndex()

export const getDsoProductList = ({ url, type, body }) => {
  return { dsoProductList: mockDsoList }
}

export const setDsoCategory = ({ url, type, body }) => {
  var j = JSON.parse(body)
  mockDsoList[ indexMap[j.product] ].category = j.category
  return {

  }
}

export const deleteDso = ({ url, type, body }) => {
  var j = JSON.parse(body)
  mockDsoList.splice(indexMap[j.product], 1)
  doIndex()
  return {

  }
}

export const listProducts = ({ url, type, body }) => {
  return {
    productList: ['E', 'F', 'G']
  }
}

export const addProduct = ({ url, type, body }) => {
  var j = JSON.parse(body)
  mockDsoList.push({
    product: j.product,
    category: j.category
  })
  doIndex()
  return {

  }
}
