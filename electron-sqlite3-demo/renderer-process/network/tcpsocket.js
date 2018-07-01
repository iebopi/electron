const ipc = require('electron').ipcRenderer

// tcp test buttons in desktop-capturer.html
const testResponse = document.getElementById('tcp-response')
const HNetSetting = document.getElementById('HNetSetting')
const HDecoderSetting = document.getElementById('HDecoderSetting')
const HSeederSetting = document.getElementById('HSeederSetting')
const HCommonSetting = document.getElementById('HCommonSetting')
const HMediaSetting = document.getElementById('HMediaSetting')
const HDispStyleSetting = document.getElementById('HDispStyleSetting')
const butt = document.getElementById('butt')


var  netSettingMsg = {'ipAddrMast':'192.168.1.171:1111','ipAddrSpare':'192.168.1.172:1111','ipAddr0':'192.168.1.172','mask0':'255.255.255.0','gw0':'123456','ipAddr1':'192.168.1.172','mask1':'192.168.1.172','gw1':'192.168.1.172','workMode':'1','playPath0':'c:/video','playPath1':'c:/abc'};
HNetSetting.addEventListener('click', function () {  
  ipc.send('tcp-msg-HNetSetting', netSettingMsg)
  testResponse.textContent = '发送成功'
})
HDecoderSetting.addEventListener('click', function () {
  let decoderSettingMsg = {'sock':null,'decoderStaus':'0','vol':'255'};  
  ipc.send('tcp-msg-HDecoderSetting', decoderSettingMsg)
  testResponse.textContent = '发送成功'
})
HSeederSetting.addEventListener('click', function () {
  let seederSettingMsg = {'sock':null,'broadcastEnable':'0','broadcastMode':'1','ipSpare':'192.168.1.171','portSpare':'8899','playModeSwitch':0,'playMode':0};
  ipc.send('tcp-msg-HSeederSetting', seederSettingMsg)
  testResponse.textContent = '发送成功'
})
HCommonSetting.addEventListener('click', function () {
  let commonSettingMsg = {'sock':null,'devIdentify':'11111111111111111111','backLight':'10','gamma':'10','logLevel':'10','screenshot':'1111','freshPackagePath':'c:/123','freshProgress':'1'};
    ipc.send('tcp-msg-HCommonSetting', commonSettingMsg)
    testResponse.textContent = '发送成功'
})
HMediaSetting.addEventListener('click', function () {
  let mediaSettingMsg = {'sock':null,'mediaCheck':'c:/123','mediaDelte':'c:/123','mediaDownload':'c:/123','mediaUpload':'c:/123','mediaClear':'c:/123','mediaProgress':'10'};
  ipc.send('tcp-msg-HMediaSetting', mediaSettingMsg)
  testResponse.textContent = '发送成功'
})
HDispStyleSetting.addEventListener('click', function () {
  let seederSettingMsg = {'sock':null,'scrollTextType':'1111','scrollTextColor':'1111','scrollTextSize':'1111','scrollTextFont':'1111','scrollPicType':'5','scrollPicTime':'5','videoPlayType':''};
  ipc.send('tcp-msg-HDispStyleSetting', seederSettingMsg)
  testResponse.textContent = '发送成功'
})