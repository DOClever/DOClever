/**
 * Created by sunxin on 2016/11/9.
 */
var userClass=require("./user");
var user=new userClass();
var interface=[
    {
        "method":"POST",
        "path":"/user/login",
        "param": {
            name:{
                type:String,
                optional:1
            },
            password:{
                type:String,
                optional:1
            },
            id:{
                type:String,
                optional:1
            },
            qqid:{
                type:String,
                optional:1
            },
            qqimg:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        handle:user.login
    },
    {
        "method":"POST",
        "path":"/user/createqq",
        "param": {
            name:{
                type:String,
            },
            password:{
                type:String,
            },
            qqid:{
                type:String,
            },
            qqimg:{
                type:String,
            },
            question:{
                type:String
            },
            answer:{
                type:String
            },
            email:{
                type:String
            }
        },
        "data":{

        },
        handle:user.createQQ
    },
    {
        "method":"POST",
        "path":"/user/save",
        "param": {
            userid:{
                optional:1,
                type:String
            },
            name:{
                optional:1,
                type:String
            },
            password:{
                optional:1,
                type:String
            },
            sex:{
                optional:1,
                type:String
            },
            age:{
                optional:1,
                type:Number,
                validate:{
                    value:{
                        gte:0,
                        lte:100
                    }
                }
            },
            company:{
                optional:1,
                type:String
            },
            photo:{
                optional:1,
                type:String
            },
            phone:{
                optional:1,
                type:String
            },
            qq:{
                optional:1,
                type:String
            },
            email:{
                optional:1,
                type:String
            },
            question:{
                optional:1,
                type:String
            },
            answer:{
                optional:1,
                type:String
            }
        },
        "data":{

        },
        handle:user.save
    },
    {
        "method":"POST",
        "path":"/user/logout",
        "param": {
        },
        "data":{

        },
        handle:user.logout
    },
    {
        "method":"PUT",
        "path":"/user/editpass",
        "param": {
            userid:{
                type:String
            },
            oldpass:{
                type:String
            },
            newpass:{
                type:String
            }
        },
        "data":{

        },
        user:1,
        handle:user.editPass
    },
    {
        "method":"PUT",
        "path":"/user/reset",
        "param": {
            name:{
                type:String
            },
            password:{
                type:String
            },
            answer:{
                type:String
            }
        },
        "data":{

        },
        handle:user.reset
    },
    {
        "method":"GET",
        "path":"/user/question",
        "param": {
            name:{
                type:String
            },
        },
        "data":{

        },
        handle:user.question
    },
    {
        "method":"GET",
        "path":"/user/applylist",
        "param": {

        },
        "data":{

        },
        user:1,
        handle:user.applyList
    },
    {
        "method":"PUT",
        "path":"/user/handleapply",
        "param": {
            apply:{
                type:String
            },
            state:{
                type:Number,
                in:[1,2]
            }
        },
        "data":{

        },
        user:1,
        handle:user.handleApply
    },
    {
        "method":"PUT",
        "path":"/user/sendinfo",
        "param": {
            user:{
                type:String
            },
            password:{
                type:String
            },
            smtp:{
                type:String
            },
            port:{
                type:Number
            }
        },
        "data":{

        },
        user:1,
        handle:user.setSendInfo
    },
    {
        "method":"GET",
        "path":"/user/sendinfo",
        "param": {

        },
        "data":{

        },
        user:1,
        handle:user.getSendInfo
    },
    {
        "method":"GET",
        "path":"/user/version",
        "param": {
        },
        "data":{

        },
        handle:user.version
    },
];

module.exports=interface;