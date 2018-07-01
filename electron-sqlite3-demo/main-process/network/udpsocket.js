const electron = require('electron')
const ipc = electron.ipcMain 
const dgram = require('dgram'); 
const server = dgram.createSocket('udp4');
const multicastAddr = '238.10.21.100';
server.on('close',()=>{
    console.info('udp socket closed');
});

server.on('error',(err)=>{
    console.info(err);
});

server.on('listening',()=>{
    console.info('udp socket listening...');
    server.addMembership(multicastAddr);
    server.setMulticastTTL(128);

});

server.on('message',(msg,rinfo)=>{
    console.info(`receive message from ${rinfo.address}:${rinfo.port}`);
});

server.bind(8999);

ipc.on('udp-msg-multicast', function (event,arg) {
    let ver_msg = 0x01;
    let type_msg = 0x11;
    let tcpPort='8899'; 
    tcpPort = str2Array(tcpPort);    
    let os = require("os");
    let networkInterfaces = os.networkInterfaces();
    let ip_addr = networkInterfaces['本地连接'][1].address;
    let len_msg = ip_addr.length + 4 + tcpPort.length + 4;    
    let header_msg = Buffer.from([ver_msg, type_msg, 0x00, len_msg]);
    let ip_msg = bufcopy(Buffer.from(ip_addr), Buffer.from([0x00, 0x01, 0x00,  ip_addr.length]));
    let port_msg = bufcopy(Buffer.from(tcpPort),Buffer.from([0x00, 0x02, 0x00, tcpPort.length]));
    let message = bufcopy(port_msg,bufcopy(ip_msg,header_msg)); 
    server.send(message,0,message.length,8999,multicastAddr);
    console.info('msg has sended.',message);
    // send = function(){
    //     server.send(message,0,message.length,8999,multicastAddr);
    //     console.info('msg has sended.');
    // }
})
ipc.on('udp-msg-HRegisterRequest', function (event,arg) {
    let ver_msg = 0x01;
    let type_msg = 0x12;   
    debugMode = str2Array(arg);    
    let len_msg = debugMode.length + 4;    
    let header_msg = Buffer.from([ver_msg, type_msg, 0x00, len_msg]);
    let debug_msg = bufcopy(Buffer.from(debugMode), Buffer.from([0x00, 0x01, 0x00,  debugMode.length]));    
    let message = bufcopy(debug_msg,header_msg); 
    server.send(message,0,message.length,8999,multicastAddr);
    console.info('msg has sended.',message);
    // this.send = function(){
    //     server.send(message,0,message.length,8999,multicastAddr);
    //     console.info('msg has sended.');
    // }
})



let bufcopy = function(src,dest) {
    let result = new Buffer(dest.length + src.length);
    dest.copy(result,0,0,dest.length);
    src.copy(result,dest.length,0,src.length);
    return result;
}

//string to char arrary
function str2Array(str){
    if(typeof str !="string"){
        return [];
    }
    var arr= [];
    if(str.length<4){
        for(var i=4;i-str.length>0;i--)
            arr.push('0') 
        for(var i=0;i<str.length;i++)           
            arr.push(str.charAt(i))
    }
    else if(str.length == 4){
        for(var i=0;i<str.length;i++)           
            arr.push(str.charAt(i))    
    }
    else{
        console.info('输入数据位数大于4')
    }
       return arr;
    }
