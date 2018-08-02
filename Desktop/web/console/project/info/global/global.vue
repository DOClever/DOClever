<template>
    <el-row class="row" style="padding: 10px 10px 60px 10px;height: calc(100vh - 115px);overflow-y: auto;font-size: 14px" id="globalInfo">
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                环境变量
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <urllist></urllist>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px" id="statusEdit">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                状态码
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <table class="table-hover" style="width: 100%;border-collapse: collapse;">
                    <template v-for="(item,index) in status">
                        <tr style="height: 40px;">
                            <td style="width: 80%;cursor: pointer;padding-left: 10px" @click="editStatus(item)">{{item.name}}</td>
                            <td style="width: 10%">
                                <el-button type="text" size="small" style="font-size: 15px;" title="导出" icon="el-icon-upload2" @click="exportJSON(item)">
                                </el-button>
                            </td>
                            <td style="width: 10%">
                                <el-button type="text" size="small" style="color: red;font-size: 15px;"  icon="el-icon-close" @click="remove(item,index)" title="删除" v-if="globalStatusRole"></el-button>
                            </td>
                        </tr>
                    </template>
                </table>
                <el-button size="mini" type="primary" style="margin-top: 15px;margin-right: 10px" @click="createStatus" v-if="globalStatusRole">新建状态码</el-button>
                <el-button size="mini" type="primary" style="margin-top: 15px;" @click="importJSON" v-if="globalStatusRole">导入</el-button>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                环境注入
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <inject></inject>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                接口模板
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <table class="table-hover" style="width: 100%;border-collapse: collapse;" id="templateList">
                    <template v-for="(item,index) in template">
                        <tr style="height: 40px;">
                            <td style="width: 50%;cursor: pointer;padding-left: 10px">{{item.name}}</td>
                            <td style="width: 30%;cursor: pointer;padding-left: 10px">{{item.createdAt}}</td>
                            <td style="width: 10%">
                                <el-button type="text" size="mini" @click="editTemplate(item,index)">
                                    编辑
                                </el-button>
                            </td>
                            <td style="width: 10%">
                                <el-button type="text" size="mini" style="color: red;"  @click="removeTemplate(item,index)" v-if="globalTemplateRole">
                                    删除
                                </el-button>
                            </td>
                        </tr>
                    </template>
                </table>
                <el-button type="primary" size="mini"  @click="addTemplate" style="margin-top: 10px" v-if="globalTemplateRole">
                    新建
                </el-button>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                文档
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <template v-for="item in arrArticle">
                    <el-row class="row article" @click.native="editArticle(item,index)" style="cursor: pointer">
                        <el-row class="row" style="font-size: 14px">
                            {{item.title}}
                        </el-row>
                        <el-row class="row" style="color: gray;font-size: 13px">
                            {{item.updatedAt}}&nbsp;&nbsp;&nbsp;
                            <el-button type="text" size="small" style="color:#FF4949" icon="el-icon-close" @click.stop="removeArticle(item,index)" titile="删除" v-if="globalDocRole">
                            </el-button>
                        </el-row>
                    </el-row>
                </template>
                <el-button size="mini" type="primary" style="margin-top: 15px" @click="createArticle"  v-if="globalDocRole">
                    创建文档
                </el-button>
            </el-row>
        </expand>
    </el-row>
</template>

<style>
    #globalInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #globalInfo .el-form-item {
        margin-bottom: 0;
    }
    .article:hover {
        background-color: rgb(247,246,242) ;
    }
    #statusEdit td{
        border-bottom:1px solid #BBB;
    }
    #statusEdit th{
        border-bottom:1px solid #BBB;
    }
    #templateList td{
        border-bottom:1px solid #BBB;
    }
    #templateList th{
        border-bottom:1px solid #BBB;
    }
</style>

<script>
    var urlList=require("./component/urlList.vue")
    var inject=require("./component/globalInject.vue")
    var page=require("component/page.vue")
   // var store=require("../../../store")._modulesNamespaceMap["project/info/global/"].context;
    var sessionChange=require("common/mixins/session");
    var expand=require("component/expand.vue")
    var config=require("common/js/config")
    module.exports={
        data:function () {
            return {
                type:0,
                arrArticle:[],
                page:0
            }
        },
        mixins:[sessionChange],
        store:function () {
            return $.getProjectStore("info/global/");
        },
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
            globalTemplateRole:function () {
                return this.$store.getters.globalTemplateRole;
            },
            globalDocRole:function () {
                return this.$store.getters.globalDocRole;
            },
            template:function () {
                return this.$store.getters.template;
            }
        },
        components:{
            "urllist":urlList,
            "inject":inject,
            "page":page,
            "expand":expand
        },
        methods:{
            createStatus:function () {
                var _this=this;
                var child=$.showBox(this,require("./component/statusEdit.vue"),{});
                child.$on("save",function (data) {
                    _this.status.unshift(data);
                })
            },
            editStatus:function (item) {
                var _this=this;
                var child=$.showBox(this,require("./component/statusEdit.vue"),{
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
                            $.tip("删除成功",0);
                            _this.status.splice(index,1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            exportJSON:function (item) {
                var link=document.createElement("a");
                link.href=config.baseUrl+"/status/exportjson?id="+item._id;
                link.download=item.name+".json";
                link.click();
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
                            $.tip("导入成功",1);
                            _this.status.unshift(data.data);
                        }
                        else
                        {
                            $.tip(data.msg,0);
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
                            $.tip("删除成功",1);
                            _this.arrArticle.splice(index,1);
                        }
                        else
                        {
                            $.tip(data.msg,0)
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
                        $.tip(data.msg,0)
                    }
                })
            },
            createArticle:function () {
                var _this=this;
                var child=$.showBox(this,require("./component/article.vue"),{
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
                        var child=$.showBox(_this,require("./component/article.vue"),{
                            propObj:data.data
                        },"projectinfo/global");
                        child.$on("save",function (obj) {
                            _this.arrArticle.splice(index,1,obj);
                        })
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            addTemplate:function () {
                var _this=this;
                var child=$.showBox(this,require("./component/template.vue"))
                child.$on("save",function (data) {
                    _this.template.unshift({
                        _id:data._id,
                        name:data.name,
                        createdAt:data.createdAt
                    })
                })
            },
            editTemplate:function (item,index) {
                var _this=this;
                $.startHud();
                net.get("/template/item",{
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./component/template.vue"),{
                            source:data.data
                        })
                        child.$on("save",function (data) {
                            item.name=data.name;
                        })
                    }
                    else
                    {
                        $.tip(data.msg,0)
                    }
                })
            },
            removeTemplate:function (item,index) {
                var _this=this;
                $.confirm("是否删除该模板",function () {
                    $.startHud();
                    net.delete("/template/item",{
                        id:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("删除成功",1);
                            _this.template.splice(index,1);
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
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
                    $.tip(data.msg,0)
                }
            })
        }
    }
</script>