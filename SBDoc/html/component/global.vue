<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    BaseUrl
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
            editStatus:function (item) {
                var _this=this;
                var child=$.showBox(this,"statusEdit",{
                    source:item
                });
            },
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
