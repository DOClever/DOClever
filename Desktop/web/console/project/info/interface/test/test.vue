<template>
    <el-dialog title="快速测试" width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-form label-position="top" label-width="80px" style="padding: 0 100px 10px 10px" id="testBasicInfo" v-if="testType==1">
                <el-row class="row">
                    <el-col class="col" :span="12">
                        <el-form-item label="名称">
                            <el-input size="small" style="width: 90%" placeholder="请输入测试名称" v-model="test.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="col" :span="12">
                        <el-form-item label="BaseUrl">
                            <el-select size="small" style="width: 90%;" v-model="$store.state.baseUrl">
                                <el-option v-for="item in baseUrls" :value="item.url" style="height: auto" :key="item.url"><span>{{item.url}}</span><br><span style="font-size: 13px;color: gray">{{item.remark}}</span></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="row">
                    <el-col class="col" :span="12">
                        <el-form-item label="业务">
                            <el-cascader size="small" expand-trigger="hover" :options="arrGroup" v-model="$store.state.groupModel" style="width: 90%" :props="defaultProps"></el-cascader>
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
            <el-row class="row" v-else>
                <el-form label-width="100px">
                    <el-form-item label="用例">
                        <el-cascader size="small" expand-trigger="hover" :options="arrTest" v-model="arrSelTest" style="width: 90%" :props="defaultProps" @change="changeTest" filterable clearable></el-cascader>
                    </el-form-item>
                    <el-form-item  label="BaseUrl">
                        <el-select size="small" style="width: 90%;" v-model="$store.state.baseUrl">
                            <el-option v-for="item in baseUrls" :value="item.url" style="height: auto" :key="item.url"><span>{{item.url}}</span><br><span style="font-size: 13px;color: gray">{{item.remark}}</span></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row class="row" style="background-color: white;padding-bottom: 30px;">
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    <el-switch v-model="type" active-value="code" inactive-value="ui" active-text="代码模式" inactive-text="UI模式" style="margin-top: 10px;">
                    </el-switch>
                    <el-button type="text" size="mini" style="float: right;margin-top: 15px" :icon="interfacePending?'el-icon-loading':'el-icon-check'">{{interfacePending?"接口数据初始化中":"接口数据初始化完成"}}</el-button>
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <testcode v-show="type=='code'" ref="code" :type="testType"></testcode>
                <testui v-show="type=='ui'" ref="ui" :type="testType"></testui>
            </el-row>
            <el-row class="row" style="background-color: white;">
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    输出
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <el-row class="row" v-html="test.output" style="padding: 0px 20px;word-break: break-all;word-wrap: break-word;" id="testOutput">

                </el-row>
            </el-row>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="run" :loading="runPending">
                运行
            </el-button>
            <el-button type="primary" @click="save" :loading="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>

</style>

<script>
    //var store=require("../../../../store")._modulesNamespaceMap["project/info/interface/test/"].context;
    var testContentCode=require("../../../test/component/testContentCode.vue");
    var testContentUI=require("../../../test/component/testContentUI.vue");
    module.exports = {
        props:["testType","propTestGroupList","propArrTest","propJoin"],
        data: function () {
            return {
                showDialog:false,
                type:"ui",
                arrGroup:this.propTestGroupList?this.propTestGroupList:[],
                defaultProps:{
                    label:"name",
                    value:"_id"
                },
                runPending:false,
                savePending:false,
                arrTest:this.propArrTest?this.propArrTest:[],
                arrSelTest:[],
                interfacePending:true
            }
        },
        store:function () {
            let obj=new Vuex.Store(require("./store.js"));
            return obj;
        },
        components:{
            "testcode":testContentCode,
            "testui":testContentUI
        },
        computed:{
            test:function () {
                return this.$store.state.selTest;
            },
            baseUrls:function () {
                return this.$store.getters.baseUrls;
            },
        },
        watch:{
            "$store.state.baseUrl":{
                handler:function (val) {
                    var _this=this;
                    this.$store.getters.baseUrls.forEach(function (obj) {
                        if(obj.url==val)
                        {
                            _this.$store.state.env=obj.env;
                        }
                    })
                },
                immediate:true
            }
        },
        methods: {
            save:function () {
                var _this=this;
                $.confirm("是否保存该用例",function () {
                    _this.savePending=true;
                    _this.$store.dispatch("save").then(function (data) {
                        _this.savePending=false;
                        if(data.code==200)
                        {
                            $.tip("保存成功",1);
                            if(_this.testType==1)
                            {
                                _this.showDialog=false;
                            }
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            run:function () {
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
            },
            changeTest:function () {
                var id=this.arrSelTest[this.arrSelTest.length-1];
                $.startHud();
                this.$store.dispatch("testInfo",id).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            convertToCode:function (data) {
                this.$refs.code.convertToCode(data);
                this.type="code";
            }
        },
        created:function () {
            this.$store.getters.event.$on("convertToCode",this.convertToCode)
            if(this.propJoin)
            {
                this.$store.state.selTest.ui.push(this.propJoin);
            }
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("convertToCode",this.convertToCode)
        },
        beforeCreate:function () {
            var _this=this;
            this.$store.commit("init");
            net.get("/test/interfacelist").then(function (data) {
                if(data.code==200)
                {
                    _this.interfacePending=false;
                    _this.$store.commit("setInterfaceList",data.data);
                }
            })
        }
    }
</script>