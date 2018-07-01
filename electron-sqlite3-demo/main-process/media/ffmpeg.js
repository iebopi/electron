const cp = require('child_process')
const electron = require('electron')
const ipc = electron.ipcMain 
const dialog = electron.dialog

var ffmpeg
var ffplay
let options = {
  cwd: process.cwd() + '\\child-process\\execution',
  env: {'SDL_AUDIODRIVER': 'directsound'}
}
ipc.on('start-stream',function(event,arg) {

  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (files) {
    if (files) {
      ffmpeg = cp.execFile('ffmpeg.exe', ['-re', '-stream_loop', '-1', '-i', files, '-c', 'copy', '-f', 'mpegts', 'udp://238.0.0.1:1234'],options)
      ffplay = cp.execFile('ffplay.exe', ['udp://@238.0.0.1:1234','-x','640','-y','360'],options)
      // ffmpeg = cp.exec('ffmpeg.exe -re -stream_loop -1 -i D:\\FTP\\1.mp4 -c copy -f mpegts udp://127.0.0.1:1234',options)
      // ffplay = cp.exec('ffplay.exe udp://127.0.0.1:1234 -x 640 -y 360',options)

      event.sender.send('streaming')
    }

    ffplay.on('exit', (code) => {
      ffmpeg.kill()
      // ffplay.kill()
      event.sender.send('close-stream')
      console.log(`child_process exit code：${code}`);
    });

  })
})
