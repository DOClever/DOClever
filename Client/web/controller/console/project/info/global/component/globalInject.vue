<template>
    <el-row class="row">
        <el-row class="row" style="height: 30px;line-height: 30px">
            <el-radio class="radio" :label="0" v-model="type">
                Before
            </el-radio>
            <el-radio class="radio" :label="1" v-model="type">
                After
            </el-radio>
            <el-button type="text" size="mini" style="font-size: 15px;float: right;margin-right: 10px" onclick="window.open('/html/web/resource/other/inject.html','_blank')">
                注入规则
            </el-button>
        </el-row>
        <el-row class="row" style="margin-top: 10px">
            <el-input size="small" v-model="before" type="textarea" :rows="5" v-if="type==0" placeholder="请输入你需要在运行前注入的JS代码">

            </el-input>
            <el-input size="small" v-model="after" type="textarea" :rows="5" v-else placeholder="请输入你需要在运行后注入的JS代码">

            </el-input>
        </el-row>
        <el-row class="row">
            <el-button size="mini" type="primary" style="margin: 20px 0 20px 0" @click="save" :loading="savePending" v-if="globalInjectRole">保存</el-button>
        </el-row>
    </el-row>
</template>

<script>
    var sessionChange=require("common/mixins/session");
    module.exports={
        data:function () {
            return {
                type:0,
                before:"",
                after:"",
                savePending:false,
            }
        },
        mixins:[sessionChange],
        computed:{
            globalInjectRole:function () {
                return this.$store.getters.globalInjectRole;
            }
        },
        methods:{
            save:function () {
                var _this=this;
                this.savePending=true;
                net.put("/project/inject",{
                    id:session.get("projectId"),
                    before:this.before,
                    after:this.after
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                        _this.$store.dispatch("setInject",{
                            before:_this.before,
                            after:_this.after
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            init:function () {
                this.before=this.$store.getters.before
                this.after=this.$store.getters.after
            }
        },
        created:function () {
            var _this=this;
            this.$store.getters.event.$on("init",this.init)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("init",this.init)
        }
    }
</script>
