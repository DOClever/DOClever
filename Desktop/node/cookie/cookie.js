var path=require("path");
var ipc=require("electron").ipcMain;
var fs=require("fs-extra");
function Cookie(electron) {
    this.all=function (url) {
        var _this=this;
        return new Promise(function (resolve) {
            electron.mainWindow.webContents.session.cookies.get({url:url?url:"http://localhost"},function (err,cookies) {
                let str="";
                for(let o of cookies)
                {
                    str+=o.name+"="+o.value+";"
                }
                resolve(str);
            })
        })
    }
    this.get=function (key,url) {
        var _this=this;
        return new Promise(function (resolve) {
            electron.mainWindow.webContents.session.cookies.get({url:url?url:"http://localhost"},function (err,cookies) {
                for(let o of cookies)
                {
                    if(o.name==key)
                    {
                        resolve(o.value);
                        return;
                    }
                }
                resolve();
            })
        })
    }
    this.set=function (key,value,remember,url) {
        var _this=this;
        return new Promise(function (resolve) {
            let obj={
                name:key,
                value:value,
                path:"/",
                url:url?url:"http://localhost"
            }
            if(remember)
            {
                let Days = 10000;
                let exp = new Date();
                let date = Math.round(exp.getTime() / 1000) + Days * 24 * 60 * 60;
                obj.expirationDate=date;
            }
            electron.mainWindow.webContents.session.cookies.set(obj,function (error) {
                resolve();
            })
        })
    }
    this.remove=function (key,url) {
        var _this=this;
        return new Promise(function (resolve) {
            electron.mainWindow.webContents.session.cookies.remove(url?url:"http://localhost","key",function (error) {
                resolve();
            })
        })
    }
}
module.exports=Cookie;