<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    环境变量
                </el-button><el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=1">
                状态码
            </el-button><el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=2">
                环境注入
            </el-button><el-button type="primary" style="margin: 20px 0 20px 0;width: 80%;" @click="type=3">
                文档
            </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-show="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray">
                            环境变量
                        </h4>
                    </el-row>
                    <urllist></urllist>
                </el-row>
                <el-row v-show="type==1" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;float: left">
                            状态码
                        </h4>
                        <el-button type="text" style="float: right;margin-top: 15px;margin-right: 10px" @click="createStatus" v-if="globalStatusRole">新建状态码</el-button>
                        <el-button type="text" style="float: right;margin-top: 15px;margin-right: 10px" @click="importJSON" v-if="globalStatusRole">导入</el-button>
                    </el-row>
                    <el-row class="row">
                        <table class="table-hover" border="1"  style="width: 100%;border-collapse: collapse" bordercolor="#ddd">
                            <template v-for="(item,index) in status">
                                <tr style="text-align: center;height: 50px">
                                    <td style="width: 80%;cursor: pointer" @click="editStatus(item)">{{item.name}}</td>
                                    <td style="width: 10%">
                                        <el-button type="text" size="small" style="font-size: 15px;" title="导出" icon="upload2" @click="exportJSON(item)">
                                        </el-button>
                                    </td>
                                    <td style="width: 10%">
                                        <el-button type="text" size="small" style="color: red;font-size: 15px;"  icon="close" @click="remove(item,index)" title="删除" v-if="globalStatusRole"></el-button>
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </el-row>
                </el-row>
                <el-row v-show="type==2" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray">
                            环境注入
                        </h4>
                    </el-row>
                    <inject></inject>
                </el-row>
                <el-row v-show="type==3" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;display: inline-block">
                            文档
                        </h4>
                        <el-button type="primary" style="float: right;margin-right: 20px;margin-top: 15px" @click="createArticle"  v-if="globalDocRole">
                            创建文档
                        </el-button>
                    </el-row>
                    <el-row class="row">
                        <template v-for="item in arrArticle">
                            <el-row class="row article" @click.native="editArticle(item,index)" style="margin-left: 20px;cursor: pointer">
                                <el-row class="row" style="font-size: 20px">
                                    {{item.title}}
                                </el-row>
                                <el-row class="row" style="color: gray">
                                    {{item.updatedAt}}&nbsp;&nbsp;&nbsp;
                                    <el-button type="text" size="small" style="color:#FF4949" icon="delete2" @click.stop="removeArticle(item,index)" titile="删除" v-if="globalDocRole">
                                    </el-button>
                                </el-row>
                            </el-row>
                        </template>
                    </el-row>
                    <page @change="changePage"></page>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<style>
    .article:hover {
        background-color: rgb(247,246,242) ;
    }
</style>

<script>
    var urlList=require("./urlList.vue")
    var inject=require("./globalInject.vue")
    var page=require("../../component/page.vue")
    var store=require("../store")._modulesNamespaceMap["global/"].context;
    var sessionChange=require("../../mixins/session");
    module.exports={
        data:function () {
            return {
                type:0,
                arrArticle:[],
                page:0
            }
        },
        mixins:[sessionChange],
        store:store,
        computed:{
            status:function () {
                return this.$store.getters.status;
            },
            globalBaseUrlRole:function () {
                return this.$store.getters.globalBaseUrlRole;
            },
            globalStatusRole:function () {
                return this.$store.getters.globalStatusRole;
            },
            globalInjectRole:function () {
                return this.$store.getters.globalInjectRole;
            },
            globalDocRole:function () {
                return this.$store.getters.globalDocRole;
            },
        },
        components:{
            "urllist":urlList,
            "inject":inject,
            "page":page
        },
        methods:{
            createStatus:function () {
                var _this=this;
                var child=$.showBox(this,require("./statusEdit.vue"),{});
                child.$on("save",function (data) {
                    _this.status.unshift(data);
                })
            },
            editStatus:function (item) {
                var _this=this;
                var child=$.showBox(this,require("./statusEdit.vue"),{
                    source:item
                },"projectinfo/global");
                child.$on("save",function (data) {
                    for(var key in data)
                    {
                        item[key]=data[key];
                    }
                })
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否确认删除?",function () {
                    $.startHud();
                    net.delete("/status/remove",{
                        id:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",0);
                            _this.status.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            exportJSON:function (item) {
                var type=navigator.userAgent;
                if(type.indexOf("Firefox")>-1)
                {
                    window.open(location.protocol+"//"+location.host+"/status/exportjson?id="+item._id);
                }
                else
                {
                    var link=document.createElement("a");
                    link.href="/status/exportjson?id="+item._id;
                    link.download=item.name+".json";
                    link.click();
                }
            },
            importJSON:function () {
                var _this=this;
                $.inputMul(this,"请输入DOClever导出状态码的JSON",function (val) {
                    if(!val)
                    {
                        $.tip("请输入JSON",0);
                        return false;
                    }
                    $.startHud();
                    net.post("/status/importjson",{
                        project:session.get("projectId"),
                        json:val
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("导入成功",1);
                            _this.status.unshift(data.data);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            removeArticle:function(item,index)
            {
                var _this=this;
                $.confirm("是否删除该文章?",function () {
                    $.startHud();
                    net.delete("/article/item",{
                        id:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.arrArticle.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            changePage:function (page) {
                var _this=this;
                net.get("/article/list",{
                    project:session.get("projectId"),
                    page:page
                }).then(function (data) {
                    if(data.code==200)
                    {
                        _this.arrArticle=data.data;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            createArticle:function () {
                var _this=this;
                var child=$.showBox(this,require("./article.vue"),{
                    propNew:1
                },"projectinfo/global");
                child.$on("save",function (obj) {
                    _this.arrArticle.unshift(obj);
                })
            },
            editArticle:function(item,index)
            {
                var _this=this;
                $.startHud();
                net.get("/article/item",{
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./article.vue"),{
                            propObj:data.data
                        },"projectinfo/global");
                        child.$on("save",function (obj) {
                            _this.arrArticle.splice(index,1,obj);
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        created:function () {
            var _this=this;
            net.get("/article/list",{
                project:session.get("projectId"),
                page:this.page
            }).then(function (data) {
                if(data.code==200)
                {
                    _this.arrArticle=data.data;
                }
                else
                {
                    $.notify(data.msg,0)
                }
            })
        }
    }
</script>
