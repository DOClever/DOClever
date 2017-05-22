<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    项目信息
                </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-if="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray">
                            项目信息
                        </h4>
                    </el-row>
                    <el-form ref="form" label-width="100px">
                        <el-form-item label="名称" style="text-align: center">
                            <el-input style="margin-top: 8px;width: 80%" v-model="project.name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" style="text-align: center">
                            <el-input type="textarea" :rows="3" style="width: 80%;height: 80%;margin-top: 8px;" v-model="project.dis" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间" style="text-align: center">
                            <div style="width: 80%;display: inline-block;text-align: left">
                                {{project.createdAt}}
                            </div>
                        </el-form-item>
                    </el-form>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    var bus=require("../bus/projectInfoBus");
    var config=require("../util/config")
    module.exports={
        data:function () {
            return {
                project:{},
                name:"",
                role:0,
                type:0
            }
        },
        computed:{

        },
        components:{

        },
        methods:{

        },
        created:function () {
            var _this=this;
            bus.$on("initInfo",function (data) {
                _this.project=data;
            })
        }
    }
</script>
