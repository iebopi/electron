# this demo refer to electron-api-demos in github

# env install instructions

copy the flowing to windows cmd to prepare environment
--------------------------------------------------------
cnpm install electron@1.7.6 --save
 
cnpm install sqlite3@4.0.0 --save --build-from-source --runtime=electron --target=1.7.6 --dist-url=https://atom.io/download/electron
 
cnpm install electron-log --save
 
cnpm install express --save
 
cnpm install electron-log --save

cnpm install electron-settings --save

-------------------------------------------------------


# debug env instructions

1. 扩展商店安装vscode-electron-demo

2. F5调试，选择electron

3. 调试配置选择electron主

4. 如果调试超时，把lunch.json中的protocol配置改为inspector

5. 主进程调试使用vscode；渲染进程调试使用devtool，在程序工具栏中打开调试模式，或者在main.js中打开DEBUG

6. enjoy it
