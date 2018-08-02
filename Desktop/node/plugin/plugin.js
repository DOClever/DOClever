var path=require("path");
var ipc=require("electron").ipcMain;
var fs=require("fs-extra");
function Plugin(electron) {
    this.download=async function (id,userId,pluginId,url) {
        let webContent=electron.mainWindow.webContents;
        let mainWindow=electron.mainWindow;
        let p=path.join(global.pathEnv,id,"plugin",userId,pluginId);
        if(!(await fs.exists(p)))
        {
            await fs.mkdir(p)
        }
        return new Promise(function (resolve,reject) {
            webContent.session.on('will-download', (e, item) => {
                const totalBytes = item.getTotalBytes();
                const filePath = path.join(global.pathEnv,id,"plugin",userId,pluginId,item.getFilename());
                item.setSavePath(filePath);
                item.on('done', (e, state) => {
                    if (!mainWindow.isDestroyed()) {
                        mainWindow.setProgressBar(-1);
                    }
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
module.exports=Plugin;