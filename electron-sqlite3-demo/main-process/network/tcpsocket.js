const electron = require('electron')
const ipc = electron.ipcMain 
const net = require('net');
const PORT = 8899;
console.info('tcp socket listening...');
var sock_array=[];
// heartbeat timeout detect
setInterval(function() {
    if(sock_array != undefined){
        for(var k=0;k<sock_array.length;k++){	
            if((sock_array[k].clientHeatbeatTime != undefined) && (Date.now() - sock_array[k].clientHeatbeatTime > 2000)) { // if status chaged, send msg to renderer process
                console.info( 'sock'+ sock_array[k].devIdentify  + '心跳停止');
                if(Date.now() - sock_array[k].clientHeatbeatTime > 10000){    
                    console.info('摧毁sock',sock_array[k].devIdentify); 
                    let sock_destory = sock_array[k];
                    sock_array.splice(k,1);
                    sock_destory.destoryed;    
               }
            }       
        }
    }
}, 1000);
net.createServer(function(sock) {
    console.info('tcp socket listening...');
    console.info('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);
    let ver_msg,len_msg,type_msg;
    let len_para,type_para,val_para;
    let cnt_para;
    let array_para = []; 
    sock.devIdentify = null;
    sock.clientHeatbeatTime = null;    
    // [{'indentify','sock'},]
   
    sock.on('data', function(data) {
        // parse socket data
        //系统自动维护sock列表sock[]
        //为为每个sock添加心跳标记        
        len_msg = (data[2] << 8) + data[3];
        ver_msg = data[0];
        type_msg = data[1];  
        if(0x21 !== type_msg) 
            console.info('rev type msg',type_msg);

        let msg_str = '' + data;
        if(msg_str == 'hello') {
            console.info('recieved hello!');
            return;
        }
        if(0x01 !== ver_msg)
            return;
        data = data.slice(4, 4 + len_msg);
        while(data.length > 4) {
            type_para = (data[0] << 8) + data[1];
            len_para = (data[2] << 8) + data[3];
            val_para = data.slice(4, 4 + len_para);
            array_para.push({type_para, val_para});
            data = data.slice(4 + len_para, data.length);
        }
        cnt_para = array_para.length; 
        // DevIdentify msg,Dev send it when first tcp connected
        if((0x01 == ver_msg) & (0x11 ==type_msg)) { //heartbeat
            console.info('type msg is',type_msg);
            
            for(i=0; i<cnt_para; i++) {
              
                switch(array_para[i].type_para) {
                    
                    case 0x0001:
                       
                        let ipAddr = "" + array_para[i].val_para;
                        
                        break;
                    case 0x0002:
                        
                        let deviceType = array_para[i].val_para;
                       
                        break;
                    case 0x0003:
                        var devIdentify = '' + array_para[i].val_para;
                      
                    break;
                                                
                }
            }
            //add code here, if sock not existed in sock_array, add it to sock_array   
            for(var k=0;k<sock_array.length;k++){	
                switch(sock_array[k].devIdentify){
                    case devIdentify:              
                        sock_array[k].destoryed;
                    break;                                   
                }             
            }     
            sock.devIdentify = devIdentify; 
            sock_array.push(sock);
              
        }
        // heartbeat msg
        if((0x01 == ver_msg) & (0x21 ==type_msg)) { //heartbeat
            // console.info('type msg is %d from socket%s',type_msg,sock.devIdentify);
            sock.clientHeatbeatTime = Date.now();
            for(i=0; i<cnt_para; i++) {
              
                switch(array_para[i].type_para) {
                    
                    case 0x0001:
                       
                        let ipAddr = "" + array_para[i].val_para;
                        
                        break;
                    case 0x0002:
                        
                        let deviceType = array_para[i].val_para;
                       
                        break;
                    case 0x0003:
                        let devIdentify = '' + array_para[i].val_para;
                      
                    break;
                                                
                }
            }
        }
        //HCommonSetting from client 
        if((0x01 == ver_msg) & (0x41 ==type_msg)) { 
            console.info('type msg is %d from socket%s',type_msg,sock.devIdentify);
            for(i=0; i<cnt_para; i++) {
                switch(array_para[i].type_para) {
                    case 0x0001:
                        let devIdentify = '' + array_para[i].val_para;
                        
                    break; 
                    case 0x0011:
                        let backLight = array_para[i].val_para;
                    
                        break;
                    case 0x0012:
                        let gamma = array_para[i].val_para;                
                    break;
                    case 0x0021:
                        let logLevel = array_para[i].val_para;                
                    break;  
                    case 0x0031:
                        let screenshot  = '' + array_para[i].val_para;               
                    break; 
                    case 0x0041:
                        let freshPackagePath  = '' + array_para[i].val_para;               
                    break;  
                    case 0x0042:
                        let freshProgress = array_para[i].val_para;                
                    break;                                              
                }
            }
        }    
        // HMediaSetting from client 
        if((0x01 == ver_msg) & (0x51 ==type_msg)) { 
            console.info('type msg is %d from socket%s',type_msg,sock.devIdentify);
            for(i=0; i<cnt_para; i++) {
                switch(array_para[i].type_para) {
                    case 0x0001:
                        let mediaCheck  = '' + array_para[i].val_para;
                        
                    break; 
                    case 0x0002:
                        let mediaDelte = '' + array_para[i].val_para;
                    
                        break;
                    case 0x0003:
                        let mediaDownload = '' + array_para[i].val_para;               
                    break;
                    case 0x0004:
                        let mediaUpload = '' + array_para[i].val_para;               
                    break;  
                    case 0x0005:
                        let mediaClear = '' + array_para[i].val_para;               
                    break; 
                    case 0x0011:
                        let mediaProgress = array_para[i].val_para;              
                    break;  
                                                    
                }
            }
        
        }
        // HDispStyleSetting from client 
        if((0x01 == ver_msg) & (0x52 ==type_msg)) { 
            console.info('type msg is %d from socket%s',type_msg,sock.devIdentify);
            for(i=0; i<cnt_para; i++) {
                switch(array_para[i].type_para) {
                    case 0x0001:
                        let scrollTextType  = array_para[i].val_para;
                        
                    break; 
                    case 0x0002:
                        let scrollTextColor = array_para[i].val_para;
                    
                        break;
                    case 0x0003:
                        let scrollTextSize = array_para[i].val_para;               
                    break;
                    case 0x0004:
                        let scrollTextFont = '' + array_para[i].val_para;               
                    break;  
                    case 0x0021:
                        let scrollPicType = array_para[i].val_para;               
                    break; 
                    case 0x0022:
                        let scrollPicTime = array_para[i].val_para;              
                    break; 
                    case 0x0031:
                        let videoPlayType = array_para[i].val_para;              
                    break;               
                                                    
                }
            }
    
        }


    });

    sock.on('close', function(data) {
       console.info('close sock');
        console.info('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
        });
        for(var k=0;k<sock_array.length;k++){
            switch(sock_array[k].devIdentify ){
                case sock.devIdentify:
                    let sock_destory= sock_array[k];
                    sock_array.splice(k,1);
                    sock_destory.destoryed;   
                break;
                default:
                continue;
            }
        }

    }).listen(PORT);



//handler tcp msg from client 
ipc.on('tcp-msg-HNetSetting', function (event, arg) {
    
    //let netSettingMsg = {'sock':null,ipAddrMast':'','ipAddrSpare':'','ipAddr0':'','mask0':'','gw0':'','ipAddr1':'','mask1':'','gw1':'','workMode':'','playPath0':'','playPath1':''};
    let dev_info = arg; // obj of socket, ip, mac etc. 
    let ver_msg = 0x01;
    let type_msg = 0x31;
    let len_msg,type_para,len_para,buf_para;
    let header_msg
    let content_msg = Buffer.from('');
    len_msg = 0;
    for(let val in dev_info) {
        switch(val) {
            case 'ipAddrMast':
                buf_para = Buffer.from(dev_info.ipAddrMast);
                type_para = 0x0001;
                break;
            case 'ipAddrSpare':
                buf_para = Buffer.from(dev_info.ipAddrSpare);
                type_para = 0x0002;
                break;
            case 'ipAddr0':
                    buf_para = Buffer.from(dev_info.ipAddr0);
                    type_para = 0x0011;
            break;
            case 'mask0':
                    buf_para = Buffer.from(dev_info.mask0);
                    type_para = 0x0012;
            break;
            case 'gw0':
                    buf_para = Buffer.from(dev_info.gw0);
                    type_para = 0x0013;
            break;
            case 'ipAddr1':
                    buf_para = Buffer.from(dev_info.ipAddr1);
                    type_para = 0x0021;
            break;
            case 'mask1':
                    buf_para = Buffer.from(dev_info.mask1);
                    type_para = 0x0022;
            break;
            case 'gw1':
                    buf_para = Buffer.from(dev_info.gw1);
                    type_para = 0x0023;
            break;
            case 'workMode':
                    buf_para = Buffer.from(str2Array(dev_info.workMode));
                    type_para = 0x0031;
            break;
            case 'playPath0':
                    buf_para = Buffer.from(dev_info.playPath0);
                    type_para = 0x0032;
            break;
            case 'playPath1':
                    buf_para = Buffer.from(dev_info.playPath1);
                    type_para = 0x0033;
            break;
            default:
                continue;
        }
        len_para = buf_para.length;
        len_msg += len_para + 4;
        let header_para = Buffer.from([type_para>>8,type_para,len_para>>8,len_para]);
        content_msg = bufcopy(header_para,content_msg);
        content_msg = bufcopy(buf_para,content_msg);
    }
    header_msg = Buffer.from([ver_msg, type_msg, (len_msg>>8), len_msg]);
    let message = bufcopy(content_msg,header_msg);
    console.info('tcp-msg-HNetSetting has sended.',message);
    // if(sock_array[0] != undefined) {
    //     sock_array[0].write(message);
    //     event.sender.send('tcp-msg-sended', dev_info.sock)
    // }
    for(var i=0;i<sock_array.length;i++) {
        if(sock_array[i] != undefined)
            sock_array[i].write(message);
    }


}) 
ipc.on('tcp-msg-HDecoderSetting', function (event, arg) {
    //let decoderSettingMsg = {'sock':null,'decoderStaus':0,'vol':Byte};
    let dev_info = arg; // obj of socket, ip, mac etc. 
    let ver_msg = 0x01;
    let type_msg = 0x32;
    let len_msg,type_para,len_para,buf_para;
    let header_msg
    let content_msg = Buffer.from('');
    len_msg = 0;
    for(let val in dev_info) {
        switch(val) {
            case 'decoderStaus':
                buf_para = Buffer.from(str2Array(dev_info.decoderStaus));
                type_para = 0x0001;
                break;
            case 'vol':
                buf_para = Buffer.from(str2Array(dev_info.vol));
                type_para = 0x0002;
                break;
            default:
                continue;
        }
        len_para = buf_para.length;
        len_msg += len_para + 4;
        let header_para = Buffer.from([type_para>>8,type_para,len_para>>8,len_para]);
        content_msg = bufcopy(header_para,content_msg);
        content_msg = bufcopy(buf_para,content_msg);
    }
    header_msg = Buffer.from([ver_msg, type_msg, (len_msg>>8), len_msg]);
    let message = bufcopy(content_msg,header_msg);
    // if(sock_array[0] != undefined) {
    //     sock_array[0].write(message);
    //     event.sender.send('tcp-msg-sended', dev_info.sock)
    // }
    console.info('tcp-msg-HDecoderSetting has sended.',message);
    for(var i=0;i<sock_array.length;i++) {
        if(sock_array[i] != undefined)
            sock_array[i].write(message);
    }


}) 
ipc.on('tcp-msg-HSeederSetting', function (event, arg) {
    //let seederSettingMsg = {'sock':null,'broadcastEnable':0,'broadcastMode':1,'ipSpare':'','portSpare':'','playModeSwitch':0,'playMode':0};
    let dev_info = arg; // obj of socket, ip, mac etc. 
    let ver_msg = 0x01;
    let type_msg = 0x33;
    let len_msg,type_para,len_para,buf_para;
    let header_msg
    let content_msg = Buffer.from('');
    len_msg = 0;
    for(let val in dev_info) {
        switch(val) {
            case 'broadcastEnable':
                buf_para = Buffer.from(str2Array(dev_info.broadcastEnable));
                type_para = 0x0001;
                break;
            case 'broadcastMode':
                buf_para = Buffer.from(str2Array(dev_info.broadcastMode));
                type_para = 0x0011;
                break;
            case 'ipSpare':
                buf_para = Buffer.from(dev_info.ipSpare);
                type_para = 0x0012;
            break;
            case 'portSpare':
                buf_para = Buffer.from(str2Array(dev_info.portSpare));
                type_para = 0x0013;
            break;
            case 'playModeSwitch':
                buf_para = Buffer.from(str2Array(dev_info.playModeSwitch));
                type_para = 0x0021;
            break;
            case 'playMode':
                buf_para = Buffer.from(str2Array(dev_info.playMode));
                type_para = 0x0022;
            break;
            default:
                continue;
        }
        len_para = buf_para.length;
        len_msg += len_para + 4;
        let header_para = Buffer.from([type_para>>8,type_para,len_para>>8,len_para]);
        content_msg = bufcopy(header_para,content_msg);
        content_msg = bufcopy(buf_para,content_msg);
    }
    header_msg = Buffer.from([ver_msg, type_msg, (len_msg>>8), len_msg]);
    let message = bufcopy(content_msg,header_msg);
    console.info('tcp-msg-HSeederSetting has sended.',message);
    // if(sock_array[0] != undefined) {
    //     sock_array[0].write(message);
    //     event.sender.send('tcp-msg-sended', dev_info.sock)
    // }
    for(var i=0;i<sock_array.length;i++) {
        if(sock_array[i] != undefined)
            sock_array[i].write(message);
    }


}) 
ipc.on('tcp-msg-HCommonSetting', function (event, arg) {
    //let commonSettingMsg = {'sock':null,'devIdentify':'','backLight':Byte,'gamma':Byte,'logLevel':Byte,'screenshot':'','freshPackagePath':'','freshProgress':Byte};
    let dev_info = arg; // obj of socket, ip, mac etc. 
    let ver_msg = 0x01;
    let type_msg = 0x41;
    let len_msg,type_para,len_para,buf_para;
    let header_msg
    let content_msg = Buffer.from('');
    len_msg = 0;
    for(let val in dev_info) {
        switch(val) {
            case 'devIdentify':
                buf_para = Buffer.from(dev_info.devIdentify);
                type_para = 0x0001;
                break;
            case 'backLight':
                buf_para = Buffer.from(str2Array(dev_info.backLight));
                type_para = 0x0011;
                break;
            case 'gamma':
                buf_para = Buffer.from(str2Array(dev_info.gamma));
                type_para = 0x0012;
            break;
            case 'logLevel':
                buf_para = Buffer.from(str2Array(dev_info.logLevel));
                type_para = 0x0021;
            break;
            case 'screenshot':
                buf_para = Buffer.from(dev_info.screenshot);
                type_para = 0x0031;
            break;
            case 'freshPackagePath':
                buf_para = Buffer.from(dev_info.freshPackagePath);
                type_para = 0x0041;
            break;
            case 'freshProgress':
                buf_para = Buffer.from(str2Array(dev_info.freshProgress));
                type_para = 0x0042;
            break;
            default:
                continue;
        }
        len_para = buf_para.length;
        len_msg += len_para + 4;
        let header_para = Buffer.from([type_para>>8,type_para,len_para>>8,len_para]);
        content_msg = bufcopy(header_para,content_msg);
        content_msg = bufcopy(buf_para,content_msg);
    }
    header_msg = Buffer.from([ver_msg, type_msg, (len_msg>>8), len_msg]);
    let message = bufcopy(content_msg,header_msg);
    // if(sock_array[0] != undefined) {
    //     sock_array[0].write(message);
    //     event.sender.send('tcp-msg-sended', dev_info.sock)
    // }
    for(var i=0;i<sock_array.length;i++) {
        if(sock_array[i] != undefined)
            sock_array[i].write(message);
    }

    console.info('tcp-msg-HCommonSetting has sended.',message);
}) 
ipc.on('tcp-msg-HMediaSetting', function (event, arg) {
    //let mediaSettingMsg = {'sock':null,'mediaCheck':'','mediaDelte':'','mediaDownload':'','mediaUpload':'','mediaClear':'','mediaProgress':''};
    let dev_info = arg; // obj of socket, ip, mac etc. 
    let ver_msg = 0x01;
    let type_msg = 0x51;
    let len_msg,type_para,len_para,buf_para;
    let header_msg
    let content_msg = Buffer.from('');
    len_msg = 0;
    for(let val in dev_info) {
        switch(val) {
            case 'mediaCheck':
                buf_para = Buffer.from(dev_info.mediaCheck);
                type_para = 0x0001;
                break;
            case 'mediaDelte':
                buf_para = Buffer.from(dev_info.mediaDelte);
                type_para = 0x0002;
                break;
            case 'mediaDownload':
                buf_para = Buffer.from(dev_info.mediaDownload);
                type_para = 0x0003;
            break;
            case 'mediaUpload':
                buf_para = Buffer.from(dev_info.mediaUpload);
                type_para = 0x0004;
            break;
            case 'mediaClear':
                buf_para = Buffer.from(dev_info.mediaClear);
                type_para = 0x0005;
            break;
            case 'mediaProgress':
                buf_para = Buffer.from(str2Array(dev_info.mediaProgress));
                type_para = 0x0011;
            break;
            default:
                continue;
        }
        len_para = buf_para.length;
        len_msg += len_para + 4;
        let header_para = Buffer.from([type_para>>8,type_para,len_para>>8,len_para]);
        content_msg = bufcopy(header_para,content_msg);
        content_msg = bufcopy(buf_para,content_msg);
    }
    header_msg = Buffer.from([ver_msg, type_msg, (len_msg>>8), len_msg]);
    let message = bufcopy(content_msg,header_msg);
    // if(sock_array[0] != undefined) {
    //     sock_array[0].write(message);
    //     event.sender.send('tcp-msg-sended', dev_info.sock)
    // }
    for(var i=0;i<sock_array.length;i++) {
        if(sock_array[i] != undefined)
            sock_array[i].write(message);
    }

    console.info('tcp-msg-HMediaSetting has sended.',message);
}) 
ipc.on('tcp-msg-HDispStyleSetting', function (event, arg) {
    //let seederSettingMsg = {'sock':null,'scrollTextType':Byte,'scrollTextColor':Byte,'scrollTextSize':Byte,'scrollTextFont':'','mediaClear':Byte,'mediaProgress':Byte};
    let dev_info = arg; // obj of socket, ip, mac etc. 
    let ver_msg = 0x01;
    let type_msg = 0x52;
    let len_msg,type_para,len_para,buf_para;
    let header_msg
    let content_msg = Buffer.from('');
    len_msg = 0;
    for(let val in dev_info) {
        switch(val) {
            case 'scrollTextType':
                buf_para = Buffer.from(str2Array(dev_info.scrollTextType));
                type_para = 0x0001;
                break;
            case 'scrollTextColor':
                buf_para = Buffer.from(str2Array(dev_info.scrollTextColor));
                type_para = 0x0002;
                break;
            case 'scrollTextSize':
                buf_para = Buffer.from(str2Array(dev_info.scrollTextSize));
                type_para = 0x0003;
            break;
            case 'scrollTextFont':
                buf_para = Buffer.from(dev_info.scrollTextFont);
                type_para = 0x0004;
            break;
            case 'scrollPicType':
                buf_para = Buffer.from(str2Array(dev_info.scrollPicType));
                type_para = 0x0021;
            break;
            case 'scrollPicTime':
                buf_para = Buffer.from(str2Array(dev_info.scrollPicTime));
                type_para = 0x0022;
            break;
            case 'videoPlayType':
                buf_para = Buffer.from(str2Array(dev_info.videoPlayType));
                type_para = 0x0031;
            break;
            default:
                continue;
        }
        len_para = buf_para.length;
        len_msg += len_para + 4;
        let header_para = Buffer.from([type_para>>8,type_para,len_para>>8,len_para]);
        content_msg = bufcopy(header_para,content_msg);
        content_msg = bufcopy(buf_para,content_msg);
    }
    header_msg = Buffer.from([ver_msg, type_msg, (len_msg>>8), len_msg]);
    let message = bufcopy(content_msg,header_msg);
    // if(sock_array[0] != undefined) {
    //     sock_array[0].write(message);
    //     event.sender.send('tcp-msg-sended', dev_info.sock)
    // }
    for(var i=0;i<sock_array.length;i++) {
        if(sock_array[i] != undefined)
            sock_array[i].write(message);
    }

    console.info('tcp-msg-HDispStyleSetting has sended.',message);
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
