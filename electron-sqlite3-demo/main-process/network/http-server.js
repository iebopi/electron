const cp = require('child_process');
const child = cp.fork(process.cwd() + '/child-process/network/http-server.js')

child.on('message',function(arg) {
    console.info(arg)
})