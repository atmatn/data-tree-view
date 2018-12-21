let mockDsPermsList = [
  {
    'ds': 'A',
    'perms': ['p1', 'p2']
  },
  {
    'ds': 'B',
    'perms': ['p3', 'p4']
  }
]

let indexMap = {}
function doIndex () {
  indexMap = {}
  mockDsPermsList.forEach((item, idx) => {
    indexMap[item.ds] = idx
  })
}
doIndex()

export const getDsPerms = ({ url, type, body }) => {
  return { dsPermsList: mockDsPermsList }
}

export const setDsPerms = ({ url, type, body }) => {
  var j = JSON.parse(body)
  mockDsPermsList[ indexMap[j.ds] ].perms = j.perms
  return {

  }
}

export const deleteDsAndPerms = ({ url, type, body }) => {
  var j = JSON.parse(body)
  mockDsPermsList.splice(indexMap[j.ds], 1)
  doIndex()
  return {

  }
}

export const addDsAndPerms = ({ url, type, body }) => {
  var j = JSON.parse(body)
  mockDsPermsList.push({
    ds: j.ds,
    perms: j.perms
  })
  doIndex()
  return {

  }
}

export const getAvailablePerms = ({ url, type, body }) => {
  // debugger
  return {
    perms: [
      { title: 'p1', value: 'p1' },
      { title: 'p2', value: 'p2' },
      { title: 'p3', value: 'p3' },
      { title: 'p4', value: 'p4' }
    ]
  }
}

export const listAvailableDataSources = ({ url, type, body }) => {
  // debugger
  return {
    dsList: [
      'p3', 'p4'
    ]
  }
}
