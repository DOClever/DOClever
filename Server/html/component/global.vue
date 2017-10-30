<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    BaseUrl
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
                <el-row v-if="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray">
                            baseUrl
                        </h4>
                    </el-row>
                    <urllist :source="baseUrl"></urllist>
                </el-row>
                <el-row v-else-if="type==1" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;float: left">
                            状态码
                        </h4>
                    </el-row>
                    <el-row class="row">
                        <table class="table-hover" border="1"  style="width: 100%;border-collapse: collapse" bordercolor="#ddd">
                            <template v-for="(item,index) in status">
                                <tr style="text-align: center;height: 50px">
                                    <td style="width: 100%;cursor: pointer" @click="editStatus(item)">{{item.name}}</td>
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
                <el-row v-if="type==3" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;display: inline-block">
                            文档
                        </h4>
                    </el-row>
                    <el-row class="row">
                        <template v-for="item in arrArticle">
                            <el-row class="row article" @click.native="editArticle(item,index)" style="margin-left: 20px;cursor: pointer">
                                <el-row class="row" style="font-size: 20px">
                                    {{item.title}}
                                </el-row>
                                <el-row class="row" style="color: gray">
                                    {{item.updatedAt}}&nbsp;&nbsp;&nbsp;
                                    </el-button>
                                </el-row>
                            </el-row>
                        </template>
                    </el-row>
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
    var bus=require("../bus/projectInfoBus")
    var urlList=require("./urlList.vue")
    var inject=require("./globalInject.vue")
    module.exports={
        data:function () {
            return {
                type:0,
                baseUrl:[],
                status:[],
                before:"",
                after:"",
                arrArticle:[],
            }
        },
        computed:{

        },
        components:{
            "urllist":urlList,
            "inject":inject
        },
        methods:{
            editStatus:function (item) {
                var _this=this;
                var child=$.showBox(this,require("./statusEdit.vue"),{
                    source:item
                });
            },
            editArticle:function(item,index)
            {
                var child=$.showBox(this,require("./article.vue"),{
                    propObj:item
                });
            }
        },
        created:function () {
            var _this=this;
            bus.$on("initInfo",function (data) {
                _this.baseUrl=data.baseUrls;
                _this.before=data.before;
                _this.after=data.after;
                _this.arrArticle=data.article;
            })
            bus.$on("initStatus",function (data) {
                _this.status=data;
            })
        }
    }
</script>
