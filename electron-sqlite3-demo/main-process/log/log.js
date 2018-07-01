const log = require('electron-log')
const fs = require('fs')
const os = require('os')
const electron = require('electron')
const ipc = electron.ipcMain 

log.transports.file.level = 'info';
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s}:{ms} {text}'
log.transports.file.maxSize = 5 * 1024 * 1024;
log.transports.file.file = __dirname + 'log/log.txt'
log.transports.file.streamConfig = { flags: 'w' }
log.transports.file.stream = fs.createWriteStream('log/log.txt',{'flags':'a'})

log.log('---------------------------')
log.log('')
log.log('DMS Starting...')
log.log(os.hostname() + ' ' + os.release() + ' ' + os.arch())
log.log('Free Memory:' + (os.freemem()/1024/1024).toFixed(0) + 'MB')


ipc.on('log-to-file', function (event,arg) {
    log.log(arg)
  })

var logtofile = function(arg) {
  log.log(arg)
}

module.exports = logtofile
