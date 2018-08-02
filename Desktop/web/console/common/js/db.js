const dexie=require("dexie").default;
const uuid=require("uuid");
function db() {
    let db=new dexie("doclever");
    db.version(1).stores({
        env:"id,name,url"
    })
    this.db=db;
    this.addEnv=async function (id,name,url) {
        let arr=await this.getAllEnv();
        for(let o of arr)
        {
            if(o.name==name)
            {
                throw {
                    msg:"名称不能相同!"
                }
            }
        }
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
}
module.exports=new db();