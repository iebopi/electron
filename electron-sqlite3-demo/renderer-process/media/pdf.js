const ipc = require('electron').ipcRenderer

const printPDFBtn = document.getElementById('print-pdf')
c
printPDFBtn.addEventListener('click', function (event) {
  ipc.send('print-to-pdf')
})

ipc.on('wrote-pdf', function (event, path) {
  const message = `PDF 保存到: ${path}`
  ipc.send('log-to-file',message)
  document.getElementById('pdf-path').innerHTML = message
})
