

var admin=require("../model/adminModel")
module.exports=async function () {
    await (admin.createAsync({
        name:"DOClever",
        password:"DOClever"
    }));
}