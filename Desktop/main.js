const electron = require('electron')
const app = electron.app
const session = electron.session
const menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const update=require("electron-updater").autoUpdater;
const dialog=electron.dialog;
const config=require("./package.json");
global.api=new (require("./node/handle"))(electron);
global.version=config.version;
if(config.debug)
{
    require("./hmr");
}
if(!global.debug)
{
    global.appPath=__dirname;
}
let mainWindow;
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
    }
})

if (isSecondInstance) {
    app.quit()
}
let updateUrl=config.update;
update.setFeedURL(updateUrl);
update.on('error', function (error) {
    const options = {
        type: 'error',
        title: 'DOClever',
        message: "更新出错",
        buttons: ["确定"]
    }
    dialog.showMessageBox(options)
});
update.on('update-available', function (info) {
    const options = {
        type: 'info',
        title: 'DOClever',
        message: `发现最新版本:${info.version}\n${info.remark}`,
        buttons: ["下载","取消"]
    }
    dialog.showMessageBox(options,function (index) {
        if(index==0)
        {
            update.downloadUpdate();
        }
    })
});
update.on('update-not-available', function (info) {
    const options = {
        type: 'info',
        title: 'DOClever',
        message: "已经是最新版本",
        buttons: ["确定"]
    }
    dialog.showMessageBox(options)
});
update.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    const options = {
        type: 'info',
        title: 'DOClever',
        message: "下载完成，是否安装更新!",
        buttons: ["是","否"]
    }
    dialog.showMessageBox(options,function (index) {
        if(index==0)
        {
            update.quitAndInstall();
        }
    })
});
function createWindow () {
    let size=electron.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        width: size.width,
        height: size.height,
        webPreferences:{
            webSecurity:false,
        }
     })
    mainWindow.loadURL(url.format({
        pathname: global.debug?"localhost:8081/web/basic/login/login.html":path.join(__dirname, './web/basic/login/login.html'),
        protocol: global.debug?'http:':"file:",
        slashes: true
    }))
    if(global.debug)
    {
        mainWindow.webContents.openDevTools()
    }
    electron.globalShortcut.register('CommandOrControl+Alt+SHIFT+S+X', function () {
        BrowserWindow.getFocusedWindow().webContents.openDevTools()
    })
    electron.globalShortcut.register('CommandOrControl+Alt+SHIFT+R', function () {
        BrowserWindow.getFocusedWindow().webContents.reload();
    })
    mainWindow.on('closed', function () {
        mainWindow = null
    })
    mainWindow.webContents.on( 'new-window', function (event,url,fname,disposition,options) {
        let childWindow;
        childWindow = new BrowserWindow({
            width: size.width,
            height: size.height,
            webPreferences: {webSecurity:false,}
        });
        childWindow.loadURL(url);
        event.preventDefault();
    });
    electron.mainWindow=mainWindow;
    let template=[
        {
            label:"DOClever",
            submenu:[
                {
                    label:"当前版本:"+config.version
                },
                {
                   label:"检查更新",
                   click:function () {
                       update.autoDownload=false;
                       update.checkForUpdates();
                   }
            },
            {
                 label:"退出",
                 click:function () {
                     app.quit();
                 }
            }]
        },
        {
            label: "Edit",
            submenu: [
                { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
            ]
        }]
    const m = menu.buildFromTemplate(template)
    menu.setApplicationMenu(m)
}
app.on('ready', createWindow)
app.on('window-all-closed', function () {
    app.quit()
})
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

