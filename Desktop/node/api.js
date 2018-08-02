const path=require("path");
var fs,request,decompress,getmac,rm;
if(location.href.startsWith("http"))
{
    window.debug=true;
    let curPath="/Users/sunxin/DOCleverClient";
    fs=require(path.join(curPath,"./node_modules/fs-extra"));
    request=require(path.join(curPath,"./node_modules/request"));
    decompress =require(path.join(curPath,"./node_modules/decompress"));
    getmac =require(path.join(curPath,"./node_modules/getmac"));
    rm =require(path.join(curPath,"./node_modules/rimraf"));
}
else
{
    fs=require("fs-extra");
    request=require("request");
    decompress =require("decompress");
    getmac=require("getmac")
    rm=require("rimraf")
}
console.log(__dirname);
const remote=require('electron').remote;
global.remote=remote;
const remoteApi=remote.getGlobal("api");
const ipc=require('electron').ipcRenderer;
const app=remote.app;
const pathEnv=path.join(app.getPath("home"),"DOClever-Desktop")
global.api={
    update:{
        checkIfNeededUpdate:async function (id,remoteVersion) {
            let p=path.join(pathEnv,id);
            let pVer=path.join(p,"ver");
            if(!await fs.exists(pVer))
            {
                return true;
            }
            let verContent=(await fs.readFile(pVer)).toString();
            if(verContent!=remoteVersion)
            {
                return true;
            }
            return false;
        },
        updateEnv:async function(id,url)
        {
            let p=path.join(pathEnv,id);
            if(!await fs.exists(p))
            {
                await fs.mkdir(p);
            }
            ipc.removeAllListeners("updateEnvProcess");
            ipc.on("updateEnvProcess",this.getProcess);
            global.rootVue.$emit("startUpdate")
            let zip=await remoteApi.update.updateEnv(id,url);
            global.rootVue.$emit("updateUnzip")
            await fs.remove(path.join(zip,"..","content"));
            await decompress(zip,path.join(zip,".."));
            await fs.unlink(zip);
            global.rootVue.$emit("finishUpdate")
            return path.join(zip,"..");
        },
        getProcess:async function (sender,val) {
            global.rootVue.$emit("updateProcess",val)
        },
        handlePluginInfo:async function(envId,userId)
        {
            let p=path.join(pathEnv,envId,"plugin");
            if(!(await fs.exists(p)))
            {
                await fs.mkdir(p);
            }
            p=path.join(p,userId);
            let objPlugin={};
            if(!(await fs.exists(p)))
            {
                await fs.mkdir(p);
            }
            else
            {
                let dirs=await fs.readdir(p);
                for(let o of dirs)
                {
                    let p1=path.join(p,o);
                    let stat=await fs.stat(p1);
                    if(stat.isDirectory())
                    {
                        let p2=path.join(p1,"ver");
                        if(await fs.exists(p2))
                        {
                            let verContent=(await fs.readFile(p2)).toString();
                            objPlugin[o]=verContent;
                        }
                    }
                }
            }
            return objPlugin;
        }
    },
    path:{
        getEnvPath:function (id) {
            return path.join(pathEnv,id);
        },
        delEnv:function (id) {
            let p=path.join(pathEnv,id);
            return new Promise(function (resolve) {
                rm(p,function () {
                    resolve();
                })
            })
        },
        delPlugin:async function (member) {
            let p=pathEnv;
            let arr=await fs.readdir(p);
            let ret=[];
            for(let o of arr)
            {
                let p1=path.join(p,o);
                let stat=await fs.stat(p1);
                if(stat.isDirectory())
                {
                    let p=path.join(p1,"plugin",member);
                    if(await fs.exists(p))
                    {
                        ret.push(new Promise(function (resolve) {
                            rm(p,function () {
                                resolve();
                            })
                        }))
                    }
                }
            }
            return Promise.all(ret);
        }
    },
    computeName:function () {
        return require("os").hostname();
    },
    macAddress:function () {
        return new Promise(function (resolve,reject) {
            getmac.getMac(function (err,mac) {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve(mac);
                }
            })
        })
    },
    cookie:{
        get:function (key) {
            return remoteApi.cookie.get(key);
        },
        set:function (key,value,remember) {
            return remoteApi.cookie.set(key,value,remember);
        },
        remove:function (key) {
            return remoteApi.cookie.remove(key);
        }
    }
};
