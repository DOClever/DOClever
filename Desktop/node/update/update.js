var path=require("path");
var ipc=require("electron").ipcMain;
function Update(electron) {
    this.updateEnv=async function (id,url) {
        let webContent=electron.mainWindow.webContents;
        let mainWindow=electron.mainWindow;
        return new Promise(function (resolve,reject) {
            webContent.session.once('will-download', (e, item) => {
                const totalBytes = item.getTotalBytes();
                const filePath = path.join(global.pathEnv,id,item.getFilename());
                item.setSavePath(filePath);
                item.on('updated', () => {
                    webContent.send("updateEnvProcess",item.getReceivedBytes() / totalBytes)
                });
                item.on('done', (e, state) => {
                    if (state === 'interrupted') {
                        reject("下载没有完成!");
                    }
                    if (state === 'completed') {
                        resolve(filePath);
                    }
                });
            });
            webContent.downloadURL(url);
        })
    }
}
module.exports=Update;