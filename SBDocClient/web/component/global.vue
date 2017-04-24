<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    修改BaseUrl
                </el-button><el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=1">
                状态码
            </el-button><el-button type="primary" style="margin: 20px 0 20px 0;width: 80%;" @click="type=2">
                环境注入
            </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-if="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray">
                            修改baseUrl
                        </h4>
                    </el-row>
                    <urllist :source="baseUrl" @save="saveUrls"></urllist>
                </el-row>
                <el-row v-else-if="type==1" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;float: left">
                            状态码
                        </h4>
                        <el-button type="text" style="float: right;margin-top: 15px;margin-right: 10px" @click="createStatus">新建状态码</el-button>
                        <el-button type="text" style="float: right;margin-top: 15px;margin-right: 10px" @click="importJSON">导入</el-button>
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
                                        <el-button type="text" size="small" style="color: red;font-size: 15px;"  icon="close" @click="remove(item,index)" title="删除"></el-button>
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </el-row>
                </el-row>
                <el-row v-if="type==2" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray">
                            环境注入
                        </h4>
                    </el-row>
                    <inject :before="before" :after="after" @save="saveInject"></inject>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    var bus=require("../bus/projectInfoBus")
    var urlList=require("./urlList.vue")
    var inject=require("./globalInject.vue")
    module.exports={
        data:function () {
            return {
                type:0,
                session:$.clone(session.raw()),
                baseUrl:[],
                status:[],
                before:"",
                after:"",
            }
        },
        computed:{

        },
        components:{
            "urllist":urlList,
            "inject":inject
        },
        methods:{
            saveUrls:function (arr) {
                this.baseUrl=arr;
                bus.$emit("baseUrl",arr);
            },
            createStatus:function () {
                var _this=this;
                var child=$.showBox(this,"statusEdit");
                child.$on("save",function (data) {
                    _this.status.unshift(data);
                })
            },
            editStatus:function (item) {
                var _this=this;
                var child=$.showBox(this,"statusEdit",{
                    source:item
                });
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
                var link=document.createElement("a");
                link.href="/status/exportjson?id="+item._id;
                link.download=item.name+".json";
                link.click();
            },
            importJSON:function () {
                var _this=this;
                $.inputMul(this,"请输入SBDoc导出状态码的JSON",function (val) {
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
            saveInject:function (before,after) {
                this.before=before;
                this.after=after;
                bus.$emit("globalInject",{
                    before:before,
                    after:after
                })
            }
        },
        created:function () {
            var _this=this;
            bus.$on("initInfo",function (data) {
                _this.baseUrl=data.baseUrls;
                _this.before=data.before;
                _this.after=data.after;
            })
            bus.$on("initStatus",function (data) {
                _this.status=data;
            })
        }
    }
</script>
