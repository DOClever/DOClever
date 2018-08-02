var update=require("./update/update");
var plugin=require("./plugin/plugin");
var cookie=require("./cookie/cookie");
var member=require("./member/member")
var path=require("path")
var fs=require("fs-extra")
function Handle(electron) {
    global.pathEnv=path.join(electron.app.getPath("home"),"DOClever-Desktop");
    if(!fs.existsSync(global.pathEnv))
    {
        fs.mkdirSync(global.pathEnv);
    }
    this.update=new update(electron);
    this.plugin=new plugin(electron);
    this.cookie=new cookie(electron);
    this.member=new member(electron);
    this.request=require("request");
    this.fs=require("fs-extra")
}

module.exports=Handle