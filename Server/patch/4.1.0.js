var async=require("asyncawait/async")
var await=require("asyncawait/await")
var admin=require("../model/adminModel")
module.exports=async (function () {
    await (admin.createAsync({
        name:"DOClever",
        password:"DOClever"
    }));
})