var exampleClass=require("./example");
var example=new exampleClass();
var interface=[
    {
        "method":"POST",
        "path":"/example/item",
        "param": {
            project:String,
            id:{
                type:String,
                optional:1
            },
            interface:String,
            paramid:String,
            name:String,
            param:String
        },
        "data":{

        },
        user:1,
        handle:[example.saveExample]
    },
    {
        "method":"GET",
        "path":"/example/item",
        "param": {
            id:String,
        },
        "data":{

        },
        user:1,
        handle:[example.exampleInfo]
    },
    {
        "method":"GET",
        "path":"/example/list",
        "param": {
            interface:String,
            paramid:String
        },
        "data":{

        },
        user:1,
        handle:[example.exampleList]
    },
    {
        "method":"DELETE",
        "path":"/example/item",
        "param": {
            id:String,
        },
        "data":{

        },
        user:1,
        handle:[example.removeExample]
    },
    {
        "method":"GET",
        "path":"/example/alllist",
        "param": {
            interface:String,
        },
        "data":{

        },
        user:1,
        handle:[example.exampleAllList]
    },
];

module.exports=interface;