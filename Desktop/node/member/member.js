var path=require("path");
var ipc=require("electron").ipcMain;
var fs=require("fs-extra");
var crypto=require("crypto-js");
function Member(electron) {
    this.encodeToken=function (token) {
        let wordArray = crypto.enc.Utf8.parse(token);
        let str = crypto.enc.Base64.stringify(wordArray);
        str+=Math.floor(Math.random() * (99 - 10 + 1) + 10);
        str=str.split("").reverse().join("");
        return str;
    }
}
module.exports=Member;