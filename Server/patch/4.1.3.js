var async=require("asyncawait/async")
var await=require("asyncawait/await")
var admin=require("../model/adminModel")
module.exports=async (function () {
    let obj=await (admin.findOneAsync({
        name:"DOClever"
    }));
    if(!obj)
    {
        await (admin.createAsync({
            name:"DOClever",
            password:"DOClever"
        }));
    }
})