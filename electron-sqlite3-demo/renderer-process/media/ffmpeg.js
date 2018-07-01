const ipc = require('electron').ipcRenderer

const streamingBtn = document.getElementById('select-straming-file')

streamingBtn.addEventListener('click', function (event) {
  ipc.send('start-stream')
})

ipc.on('streaming', function (event, path) {
    const message = `正在发送直播流...`
    ipc.send('log-to-file',message)
    document.getElementById('streaming-msg').innerHTML = message
  })

  ipc.on('close-stream', function (event, path) {
    const message = `直播流已关闭`
    ipc.send('log-to-file',message)
    document.getElementById('streaming-msg').innerHTML = message
  })