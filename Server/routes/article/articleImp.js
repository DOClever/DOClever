/**
 * Created by sunxin on 2017/7/7.
 */
var articleClass=require("./article");
var article=new articleClass();
var interface=[
    {
        "method":"POST",
        "path":"/article/save",
        "param": {
            project:{
                type:String
            },
            id:{
                type:String,
                optional:1
            },
            title:{
                type:String,
            },
            content:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[article.save]
    },
    {
        "method":"DELETE",
        "path":"/article/item",
        "param": {
            id:{
                type:String
            },
        },
        "data":String,
        user:1,
        handle:[article.remove]
    },
    {
        "method":"GET",
        "path":"/article/item",
        "param": {
            id:{
                type:String
            },
        },
        "data":String,
        user:1,
        handle:[article.info]
    },
    {
        "method":"GET",
        "path":"/article/list",
        "param": {
            project:{
                type:String
            },
            page:Number
        },
        "data":String,
        user:1,
        handle:[article.list]
    },
];

module.exports=interface;