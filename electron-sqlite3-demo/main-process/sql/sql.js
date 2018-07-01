const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')
const ipc = require('electron').ipcMain

//const db_path = path.join(__dirname, process.cwd()+ '/db/')
const db_path = process.cwd()+ '/db/';
if (!fs.existsSync(db_path)) {
  fs.mkdirSync(db_path)
}
const db = new sqlite3.Database(path.join(db_path, 'dms.db'))


let foreign_on = 'PRAGMA foreign_keys = ON;'
let creat_group_table = 'CREATE TABLE IF NOT EXISTS "group" (\
  "id"  INTEGER,\
  "name"  TEXT(30) NOT NULL,\
  PRIMARY KEY ("id" ASC)\
  );'

let insert_group = 'INSERT INTO "group" (name) VALUES(?);'
let delete_group_name = 'DELETE FROM "group" WHERE name = ? ;'
let update_group_name = 'UPDATE "group" SET name = ? WHERE name = ? ;'
let check_group = 'SELECT * FROM "group";'
let check_group_name = 'SELECT * FROM "group" WHERE name=?;'
let count_group_maxId = 'SELECT * FROM "group" WHERE id = (select max(id) from "group");'

let creat_device_table = 'CREATE TABLE IF NOT EXISTS "device" (\
  "id"  INTEGER NOT NULL,\
  "identify"  TEXT(30),\
  "type"  INTEGER,\
  "ip"  TEXT(30),\
  "mac"  TEXT(30),\
  "version_app"  TEXT(30),\
  "version_gw"  TEXT(30),\
  "version_ui"  TEXT(30),\
  "diskfree_mb"  INTEGER,\
  "group_id"  INTEGER,\
  PRIMARY KEY ("id" ASC),\
  CONSTRAINT "group_id" FOREIGN KEY ("group_id") REFERENCES "group" ("id") ON DELETE CASCADE ON UPDATE CASCADE\
  );'
let insert_device = 'INSERT INTO device(identify,type,ip,mac,version_app,version_gw,version_ui,diskfree_mb,group_id) VALUES(?,?,?,?,?,?,?,?,?);'
let delete_device_identify = 'DELETE FROM "device" WHERE identify = ? ;'
let update_device_identify = 'UPDATE "device" SET type = ?,ip = ?,mac = ?,version_app = ?,version_gw = ?,version_ui = ?,diskfree_mb = ?,group_id = ? WHERE identify = ? ;'
let check_device = 'SELECT * FROM "device";'
let check_device_identify = 'SELECT * FROM "device" WHERE identify=?;'
let count_device_maxId = 'SELECT * FROM "device" WHERE id = (select max(id) from "device");'
// creat sql table
db.serialize(function() {
  db.run(foreign_on)
  db.run(creat_group_table)
  db.run(creat_device_table)
})
// add code here. insert,del,update,select
//operate to table group
ipc.on('insert-group',function(event,arg){
  db.serialize(function() {
    let sql_cmd = db.prepare(insert_group)
    sql_cmd.run(arg,function(err){
      if(err){
        let sqlite3_response = 'sql insert-group"'+arg+'"'+err;
        event.sender.send('operate-sqlite3-done',sqlite3_response)        
      } 
      else{
        let sqlite3_response = 'sql insert-group"'+arg+'"sucess!';
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
    })
    sql_cmd.finalize
  })  
})
ipc.on('check-group',function(event){
  db.serialize(function() {    
    db.all(check_group,function(err,rows){
      if(err){
        let sqlite3_response = 'sql check-group '+ err; 
        event.sender.send('operate-sqlite3-done',sqlite3_response)       
      }
      else{
        let sqlite3_response_data = rows;  
        let sqlite3_response = 'sql check-group sucess!'; 
        event.sender.send('sqlite3-response',sqlite3_response_data)  
        event.sender.send('operate-sqlite3-done',sqlite3_response) 
      }    
    })
  })
})
ipc.on('check-group-name',function(event,arg){
  db.serialize(function() {  
    db.all(check_group_name,arg,function(err,row){  
      db.all(check_group_name,arg,function(err,rows){
        if(err){        
          let sqlite3_response = 'sql check-group-name"'+arg+'"'+err;
          event.sender.send('operate-sqlite3-done',sqlite3_response)
        }
        else if(row.length==0){
          let sqlite3_response = 'sql check-group-name"'+arg+'"error: can not find this name in group'
          event.sender.send('operate-sqlite3-done',sqlite3_response)
        }
        else{
          let sqlite3_response_data = rows.length;   
          let sqlite3_response = 'sql check-group-name"'+arg+'"sucess!';       
          event.sender.send('sqlite3-response',sqlite3_response_data)
          event.sender.send('operate-sqlite3-done',sqlite3_response)
        }    
    })
  })
  })
})
ipc.on('delete-group-name',function(event,arg){
  db.serialize(function() {
    let sql_cmd = db.prepare(delete_group_name)
    sql_cmd.run(arg,function(err){
      if(err){      
        let sqlite3_response = 'sql delete-group-name"'+arg+'"'+err;
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      else{
        let sqlite3_response = 'sql delete-group-name"'+arg+'"sucess!';
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
    })
    sql_cmd.finalize
  })  
})
ipc.on('update-group-name',function(event,arg){
  db.serialize(function() {
    let sql_cmd = db.prepare(update_group_name)
    sql_cmd.run(arg,function(err){
      if(err){
        let sqlite3_response = 'sql update-group-name"'+arg+'"error!'
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      else{
        let sqlite3_response = 'update-group-name"'+arg+'"sucess!'
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      } 
    })
    sql_cmd.finalize
  })
})
ipc.on('count-group-maxId',function(event){
  db.serialize(function() {    
    db.all(count_group_maxId,function(err,num){
      if(err){
        let sqlite3_response = 'sql count-group-maxId'+'sucess!';
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      else{
        let sqlite3_response_data = num[0].id;   
        let sqlite3_response = 'sql count-group-maxId' +'sucess!'; 
        event.sender.send('sqlite3-response',sqlite3_response_data)
        event.sender.send('operate-sqlite3-done',sqlite3_response) 
      }
    })
  })
})

//operate to table device
ipc.on('insert-device',function(event,arg){
  db.serialize(function() {
    let sql_cmd = db.prepare(insert_device)
    sql_cmd.run(arg,function(err){
      if(err){
        let sqlite3_response = 'sql insert-device"'+arg+'"'+err
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      else{
        let sqlite3_response = 'sql insert-device"'+arg+'"sucess!'
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
    })
    sql_cmd.finalize
  })
})
ipc.on('check-device',function(event){
  db.serialize(function() {    
    db.all(check_device,function(err,rows){
      if(err){
        let sqlite3_response = 'sql check-device error!'; 
        event.sender.send('operate-sqlite3-done',sqlite3_response)       
      }
      else{
        let sqlite3_response_data = rows;  
        let sqlite3_response = 'sql check-device sucess!'; 
        event.sender.send('sqlite3-response',sqlite3_response_data)  
        event.sender.send('operate-sqlite3-done',sqlite3_response) 
      }    
    })
  })
})
ipc.on('check-device-identify',function(event,arg){
  db.serialize(function() {    
    db.all(check_device_identify,arg,function(err,rows){
      if(err){        
        let sqlite3_response = 'sql check-device-identify"'+arg+'"'+err;
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      else{
        let sqlite3_response_data = rows;   
        let sqlite3_response = 'sql check-device-identify"'+arg+'"sucess!';       
        event.sender.send('sqlite3-response',sqlite3_response_data)
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }    
    })
  })
})
ipc.on('delete-device-identify',function(event,arg){
  db.serialize(function() {
    let sql_cmd = db.prepare(delete_device_identify)
    sql_cmd.run(arg,function(err){
      if(err){
        let sqlite3_response = 'sql delete-device-identify"'+arg+'"'+err
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      else{
        let sqlite3_response = 'sql delete-device-identify"'+arg+'"sucess!'
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      })
    sql_cmd.finalize
  })
})
ipc.on('update-device-identify',function(event,arg){
  db.serialize(function() {
    let sql_cmd = db.prepare(update_device_identify)
    sql_cmd.run([arg[1],arg[2],arg[3],arg[4],arg[5],arg[6],arg[7],arg[8],arg[0]],function(err){
      if(err){
        let sqlite3_response = 'sql update-devuce-name"'+arg+'"'+err
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      else{
        let sqlite3_response = 'sql update-devuce-name"'+arg+'"sucess!'
        event.sender.send('operate-sqlite3-done',sqlite3_response)
      }
      })
    sql_cmd.finalize
  })
})
ipc.on('count-device-maxId',function(event){
  db.serialize(function() {    
    db.all(count_device_maxId,function(err,num){
      if(err){
        let sqlite3_response = 'count-device-maxId"'+'"'+err
        event.sender.send('operate-sqlite3-done',sqlite3_response) 
      }
      else{
        let sqlite3_response = 'count-device-maxId"'+'"sucess!';
        let sqlite3_response_data = num[0].id;         
        event.sender.send('operate-sqlite3-done',sqlite3_response)
        event.sender.send('sqlite3-response',sqlite3_response_data) 
      }
    })
  })
})
