<template>
    <el-row class="row">
        <el-row class="row" style="height: 35px;line-height: 35px">
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" @click="run" :loading="runPending">
                运行
            </el-button>
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 10px;margin-left: 0px" @click="save"   :loading="savePending" v-if="editRole">
                保存
            </el-button>
            <testbaseurl style="width: 300px"></testbaseurl>
        </el-row>
        <el-row class="row" style="height: calc(100vh - 150px);overflow-y: auto;margin-top: 5px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);padding-bottom: 15px" >
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    信息&nbsp;
                    <el-tooltip class="item" effect="dark" placement="bottom" trigger="hover" :content="editInfo">
                        <i class="el-icon-info" style="font-size: 12px;"></i>
                    </el-tooltip>
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <el-form label-position="top" label-width="80px" style="padding: 10px 100px 20px 10px" id="testBasicInfo">
                    <el-row class="row">
                        <el-col class="col" :span="12">
                            <el-form-item label="名称">
                                <el-input size="small" style="width: 90%" placeholder="请输入测试名称" v-model="test.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col class="col" :span="12">
                            <el-form-item label="业务">
                                <el-cascader size="small" expand-trigger="hover" :options="arrGroup" v-model="groupModel" style="width: 90%"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="12">
                            <el-form-item label="状态">
                                <el-select size="small" style="width: 90%;text-align: center" v-model="test.status">
                                    <el-option  :value="0" label="未判定"></el-option>
                                    <el-option  :value="1" label="已通过"></el-option>
                                    <el-option  :value="2" label="未通过"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-form-item label="备注">
                            <el-input size="small" type="textarea" :rows="3" style="width: 95%;vertical-align: middle" placeholder="请输入关于该用例的备注" v-model="test.remark"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row class="row" style="background-color: white;margin-top: 15px;padding-bottom: 30px;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);">
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    内容
                    <el-switch v-model="type" active-value="code" inactive-value="ui" active-text="代码模式" inactive-text="UI模式" style="float: right;margin-right: 10px;margin-top: 10px;">
                    </el-switch>
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <testcode v-show="type=='code'" ref="code"></testcode>
                <testui v-show="type=='ui'" ref="ui"></testui>
            </el-row>
            <el-row class="row" style="background-color: white;margin-top: 15px;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)">
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    输出
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <el-row class="row" v-html="test.output" style="padding: 0px 20px;word-break: break-all;word-wrap: break-word;" id="testOutput">

                </el-row>
            </el-row>
            <el-row class="row" style="height: 100px">

            </el-row>
        </el-row>
    </el-row>
</template>

<style>
    #testBasicInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #testBasicInfo .el-form-item {
        margin-bottom: 0;
    }
    #testOutput pre{
        white-space: pre-wrap!important;
        word-wrap: break-word!important;
        *white-space:normal!important;
    }
</style>

<script>
    var testContentCode=require("./testContentCode.vue");
    var testContentUI=require("./testContentUI.vue");
    var testBaseUrl=require("./testBaseUrl.vue");
    module.exports = {
        data: function () {
            return {
                runPending:false,
                savePending:false,
                type:"ui"
            }
        },
        components:{
            "testcode":testContentCode,
            "testui":testContentUI,
            "testbaseurl":testBaseUrl
        },
        watch:{
            type:function (val) {
                if(val=="code")
                {
                    this.$nextTick(function () {
                        var ele=document.getElementById("testContent");
                        this.$refs.code.line=Math.round(ele.scrollHeight/(1.5*15));
                    })
                }
            }
        },
        computed:{
            editRole:function () {
                return this.$store.getters.editRole;
            },
            test:function () {
                return this.$store.state.selTest
            },
            selNode:function () {
                return this.$store.state.selNode
            },
            editInfo:function () {
                if(this.test)
                {
                    return this.test.owner.name+"在"+this.test.createdAt+"创建，最近修改被"+this.test.editor.name+"在"+this.test.updatedAt+"改动";
                }
                else
                {
                    return ""
                }
            },
            arrGroup:function () {
                var arr=this.$store.state.tree.root.childNodes.map(function (obj) {
                    return {
                        label:obj.data.name,
                        value:obj.data._id,
                        children:obj.childNodes.map(function (obj) {
                            return {
                                label:obj.data.name,
                                value:obj.data._id,
                            }
                        })
                    }
                })
                return arr;
            },
            groupModel:{
                get:function () {
                    return this.$store.state.groupModel
                },
                set:function (val) {
                    this.$store.commit("setGroupModel",val)
                }
            }
        },
        methods: {
            save:function () {
                var _this=this;
                this.savePending=true;
                this.$store.dispatch("save").then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.tip("保存成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            run: (async function () {
                var _this=this;
                if(!this.$store.state.baseUrl)
                {
                    $.tip("请设置BaseUrl",0);
                    return;
                }
                this.runPending=true;
                this.test.output="";
                var root={}
                root.output="";
                root.projectInfo=[];
                root.success=0;
                root.fail=0;
                root.unknown=0;
                var env={};
                if(this.$store.state.env)
                {
                    this.$store.state.env.forEach(function (obj) {
                        env[obj.key]=obj.value;
                    })
                }
                var str="";
                if(this.type=="code")
                {
                    var ele=document.getElementById("testContent");
                    str=ele.innerHTML;
                }
                else if(this.type=="ui")
                {
                    var arr=this.test.ui;
                    str=helper.convertToCode(arr);
                }
                try
                {
                    helper.runTestCode(str,this.test,{},{
                        baseUrl:this.$store.state.baseUrl,
                        env:env,
                    },root,[],this.type,undefined,0).then(function (ret) {
                        _this.runPending=false;
                        _this.test.output=root.output;
                        $.tip("运行完成",1);
                    }).catch(function (err) {
                        _this.runPending=false;
                        root.output+=err+"<br>"
                        _this.test.output=root.output;
                    })
                }
                catch(e)
                {
                    _this.runPending=false;
                    root.output+=e+"<br>"
                    _this.test.output=root.output;
                }
            }),
            setBaseUrl:function () {
                var _this=this;
                $.startHud();
                this.$store.dispatch("baseUrl").then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./testBaseUrl.vue"),{
                            url:_this.$store.state.baseUrl,
                            arrUrl:data.data
                        })
                        child.$on("save",function (data) {
                            _this.$store.state.baseUrl=data.url;
                            _this.$store.state.env=data.env;
                        })
                    }
                    else
                    {
                        $.tip(data.msg,0)
                    }
                })
            },
            initTestContent:function (data) {
                var type;
                this.$refs.code.initTestContent(data.code);
                this.$refs.ui.initTestContent();
                if(data.code)
                {
                    type="code";
                }
                if(data.ui.length>0)
                {
                    type="ui";
                }
                if(!data.code && data.ui.length==0)
                {
                    type="ui";
                }
                this.type=type;
            },
            convertToCode:function (data) {
                this.$refs.code.convertToCode(data);
                this.type="code";
            }
        },
        created:function () {
            var _this=this;
            this.$store.getters.event.$on("initTestContent",this.initTestContent)
            this.$store.getters.event.$on("convertToCode",this.convertToCode)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("initTestContent",this.initTestContent)
            this.$store.getters.event.$off("convertToCode",this.convertToCode)
        },
        mounted:function () {
            if(this.$store.state.tempData)
            {
                this.initTestContent(this.$store.state.tempData);
                this.$store.state.tempData=null;
            }
        }
    }
</script>