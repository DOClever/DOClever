var templateClass=require("./template");
var template=new templateClass();
var interface=[
    {
        "method":"POST",
        "path":"/template/item",
        "param": {
            project:String,
            id:{
                type:String,
                optional:1
            },
            name:String,
            url:{
                type:String,
                optional:1
            },
            remark:{
                type:String,
                optional:1
            },
            method:String,
            param:Array,
            version:{
                type:String,
                optional:1
            },
        },
        "data":{

        },
        user:1,
        handle:[template.saveTemplate]
    },
    {
        "method":"GET",
        "path":"/template/item",
        "param": {
            id:String,
        },
        "data":{

        },
        user:1,
        handle:[template.templateInfo]
    },
    {
        "method":"GET",
        "path":"/template/list",
        "param": {
            project:String,
        },
        "data":{

        },
        user:1,
        handle:[template.templateList]
    },
    {
        "method":"DELETE",
        "path":"/template/item",
        "param": {
            id:String,
        },
        "data":{

        },
        user:1,
        handle:[template.removeTemplate]
    }
];

module.exports=interface;