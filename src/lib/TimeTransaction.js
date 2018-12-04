// 在time transaction中的callback，只有最后一个被执行
class TimeTransaction {
  startTransaction () {
    console.log('start time transaction')
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.inTransaction = true
    this.callbackList = []
    this.timer = setTimeout(() => {
      if (this.callbackList.length > 0) {
        console.log('calling last callback when time transaction end [finalize]')
        this.callbackList[this.callbackList.length - 1]()
      }
      this.inTransaction = false
    }, 5000)
  }

  addCallback (cb) {
    if (this.inTransaction) {
      console.log('adding callback to time transaction [active]')
      this.callbackList.push(cb)
    } else {
      console.log('adding callback to time transaction [not active]')
      cb()
    }
  }
}

export default TimeTransaction
