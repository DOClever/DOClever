const dexie=require("dexie").default;
const uuid=require("uuid");
function db() {
    let db=new dexie("doclever");
    db.version(1).stores({
        env:"id,name,url",
        member:"user,pass"
    })
    this.addEnv=async function (id,name,url) {
        let arr=await this.getAllEnv();
        let obj={
            name:name,
            url:url
        };
        if(id)
        {
            obj.id=id;
        }
        else
        {
            obj.id=uuid();
        }
        await db.env.put(obj)
        return obj;
    }
    this.delEnv=function (id) {
        return db.env.delete(id)
    }
    this.getAllEnv=function () {
        return db.env.toArray();
    }
    this.getEnv=function (id) {
        return db.env.get(id)
    }
    this.editMember=async function (user,pass) {
        let arr=await db.member.toArray();
        let obj;
        for(let o of arr)
        {
            if(o.user==user)
            {
                obj=o;
                break;
            }
        }
        if(obj)
        {
            obj.pass=pass;
            await db.member.put(obj);
        }
        else
        {
            obj={
                user:user,
                pass:pass,
            }
            await db.member.put(obj);
        }
    }
    this.getAllMember=function () {
        return db.member.toArray();
    }
    this.removeMember=function (user) {
        return db.env.delete(user)
    }
}
module.exports=new db();












