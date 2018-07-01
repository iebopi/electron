const ipc = require('electron').ipcRenderer

const insertBtn = document.getElementById('insert-group')
const sqlResponse = document.getElementById('sql-response')
insertBtn.addEventListener('click', function (event) {
  //var arg=new Array("200",0,"192.168.1.171","EE:EE:EE:EE","V3.0","V3.0","V3.0",10,10) 
  // var arg=new Array("2000")
  // delete_device_identify(arg)
  // var arg=new Array("6","1","192.168.1.171","EE:EE:EE:EE","V3.0","V3.0","V3.0",11,13) 
  // update_device_identify(arg)
  // var arg=new Array("中电1")
  // update_group_name(arg);
  //count_device_maxId();
  arg=new Array("1100","0");
  check_group_name(arg);
})
//数据库操作反馈消息
ipc.on('operate-sqlite3-done', function (event, sqlite3_response) {
    const message = sqlite3_response
    ipc.send('log-to-file',message)
    sqlResponse.innerHTML = message
  })
  ipc.on('sqlite3-response', function (event, sqlite3_response_data) {
    const response_data = sqlite3_response_data  
        sqlResponse.innerHTML = response_data
     })
//对表group的操作
function insert_group(arg){
  ipc.send('insert-group',arg)

}
function delete_group_name(arg){
  ipc.send('delete-group-name',arg)

}

function update_group_name(arg){//identify在arg的最后一个成员
  ipc.send('update-group-name',arg)

}
function check_group(){
  ipc.send('check-group')

}
function check_group_name(arg){
  ipc.send('check-group-name',arg)

}
function count_group_maxId(){
  ipc.send('count-group-maxId')

}
//对表device的操作

function insert_device_test(arg){
  ipc.send('insert-device-test',arg)

}
function insert_device(arg){
  ipc.send('insert-device',arg)

}
function delete_device_identify(arg){
  ipc.send('delete-device-identify',arg)

}

function update_device_identify(arg){//identify在arg的最后一个成员
  ipc.send('update-device-identify',arg)

}
function check_device(){
  ipc.send('check-device')

}
function check_device_identify(arg){
  ipc.send('check-device-identify',arg)

}
function count_device_maxId(){
  ipc.send('count-device-maxId')

}