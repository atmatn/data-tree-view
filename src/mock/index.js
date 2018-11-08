import Mock from 'mockjs'

var getWelcomeMsg = function getWelcomeMsg ({ url, type, body }) {
  return {
    msg: 'mock hello world!'
  }
}

Mock.mock(/\/getWelcomeMsg/, 'get', getWelcomeMsg)

Mock.setup({
  timeout: 0
})

export default Mock
