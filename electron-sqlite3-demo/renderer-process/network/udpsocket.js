const ipc = require('electron').ipcRenderer

const multicastBtn = document.getElementById('multicastBtn')

multicastBtn.addEventListener('click', function () {
  ipc.send('udp-msg-multicast')
})


const HRegisterReponseBtn = document.getElementById('HRegisterReponseBtn')
HRegisterReponseBtn.addEventListener('click', function () {
  ipc.send('udp-msg-HRegisterRequest','1')   

})