<template>
    <el-row class="row" style="padding: 0 10px 0 10px;font-size: 14px">
        <el-col class="col" :span="6" style="padding-right: 5px;">
            <el-row class="row" style="height: 35px;line-height: 35px">
                <el-tooltip class="item" effect="dark" content="新增模块" placement="bottom">
                    <el-button size="mini" type="primary" @click.native="addModule" v-if="testEditRole">
                        <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="创建轮询" placement="bottom" v-if="testEditRole">
                    <el-button size="mini" style="margin-left: 3px" @click.native="poll">
                        <i class="el-icon-download" style="font-weight:900"></i>&nbsp;轮询
                    </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="设置BaseUrl" placement="bottom">
                    <el-button size="mini" style="margin-left: 3px" @click.native="setBaseUrl">
                        <i class="fa fa-link" style="font-weight:900"></i>
                    </el-button>
                </el-tooltip>
            </el-row>
            <el-row class="row" style="background-color: white;padding: 5px;border-radius: 5px;height: calc(100vh - 150px);overflow-y: auto;margin-top: 5px">
                <el-row class="row" style="height: 40px;line-height: 40px;text-align: center;font-weight: bold;padding: 0;">
                    <el-col :span="6" class="col">
                        <el-checkbox v-model="selectAll" :true-label="1" :false-label="0" @change="changeSelectAll">全选</el-checkbox>
                    </el-col>
                    <el-col :span="10" class="col">
                    </el-col>
                    <el-col :span="8" class="col" style="text-align: right">
                        <el-button size="mini" type="primary" @click="runGroup">运行</el-button>
                    </el-col>
                </el-row>
                <testlist ref="tree"></testlist>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" id="testInfoContent" style="height: calc(100vh - 110px);">
            <el-row class="row" style="height: 35px;line-height: 35px" v-if="selNode">
                <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" @click="run" :loading="runPending">
                    运行
                </el-button>
                <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 10px;margin-left: 0px" @click="save" v-if="testEditRole"  :loading="savePending">
                    保存
                </el-button>
            </el-row>
            <el-row class="row" style="height: calc(100vh - 150px);overflow-y: auto;margin-top: 5px" v-if="selNode">
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
                    </el-row>
                    <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-button size="mini" type="primary" style="margin-left: 20px" @click="insertInterface">插入接口</el-button>&nbsp;&nbsp;&nbsp;
                        <el-button size="mini" type="primary" @click="insertTest">插入用例</el-button>
                        <a href="/html/web/resource/other/test.html" style="float: right;margin-right: 20px;color: #17b9e6" target="_blank">如何编写</a>
                    </el-row>
                    <div class="row" style="height: 300px;border:1px gray solid;margin: 0 auto;width: 95%;padding: 5px;overflow: auto" contenteditable="true" id="testContent">

                    </div>
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
        </el-col>
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
    var store=require("../../../store")._modulesNamespaceMap["project/info/test/"].context;
    var testList=require("./component/testlist.vue")
    module.exports={
        data:function () {
            return {
                selectAll:0,
                savePending:false,
                runPending:false,
                baseUrl:"",
            }
        },
        store:store,
        components:{
            "testlist":testList
        },
        watch:{

        },
        computed:{
            testEditRole:function () {
                return this.$store.getters.testEditRole;
            },
            before:function () {
                return this.$store.getters.before;
            },
            after:function () {
                return this.$store.getters.after;
            },
            test:function () {
                return store.state.test
            },
            selNode:function () {
                return store.state.selNode
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
                var arr=this.$refs.tree.$refs.tree.root.childNodes.map(function (obj) {
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
                    return store.state.groupModel
                },
                set:function (val) {
                    store.commit("setGroupModel",val)
                }
            }
        },
        methods:{
            changeSelectAll:function () {
                if(this.selectAll==1)
                {
                    var arr=this.$refs.tree.$refs.tree.root.childNodes.map(function (obj) {
                        return obj.data.id
                    });
                    this.$refs.tree.$refs.tree.setCheckedKeys(arr);
                }
                else
                {
                    this.$refs.tree.$refs.tree.setCheckedKeys([]);
                }
            },
            addModule:function () {
                var _this=this;
                $.input("请输入模块名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入模块名称",0);
                        return false
                    }
                    var query={};
                    query.project=session.get("projectId");
                    query.name=val.value;
                    query.tree=_this.$refs.tree.$refs.tree;
                    $.startHud("#body");
                    store.dispatch("addModule",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("新建成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                });
            },
            save:function () {
                var _this=this;
                this.savePending=true;
                store.dispatch("save").then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            insertInterface:function () {
                var selection=helper.getSelection();
                if(!selection)
                {
                    return;
                }
                $.startHud();
                var _this=this;
                Promise.all([
                    net.get("/project/interface",{
                        id:session.get("projectId")
                    }),
                    net.get("/status/list",{
                        id:session.get("projectId")
                    }),
                ]).then(function (values) {
                    $.stopHud();
                    var obj1=values[0];
                    var obj2=values[1];
                    if(obj1.code==200 && obj2.code==200)
                    {
                        var child=$.showBox(_this,require("./component/testInterfaceRun.vue"),{
                            source:obj1.data.data,
                            url:obj1.data.baseUrl,
                            status:obj2.data,
                            index:0
                        });
                        child.$on("save",function (obj) {
                            var a=document.createElement("a");
                            a.setAttribute("type","1");
                            a.setAttribute("data",JSON.stringify(obj));
                            a.href="javascript:void(0)";
                            a.style.cursor="pointer";
                            a.style.textDecoration="none";
                            a.innerText=obj.name;
                            a.onclick=function () {
                                _this.editInterface(a);
                            }
                            selection.deleteContents();
                            selection.insertNode(a);
                        })
                    }
                    else
                    {
                        $.notify(obj1.code!=200?obj1.msg:obj2.msg,0);
                    }
                })
            },
            editInterface:function (ele) {
                var objInterface=JSON.parse(ele.getAttribute("data"));
                $.startHud();
                var _this=this;
                Promise.all([
                    net.get("/project/interface",{
                        id:session.get("projectId")
                    }),
                    net.get("/status/list",{
                        id:session.get("projectId")
                    }),
                    net.get("/interface/item",{
                        id:objInterface.id,
                        project:session.get("projectId")
                    })
                ]).then(function (values) {
                    $.stopHud();
                    var obj1=values[0];
                    var obj2=values[1];
                    var obj3=values[2];
                    if(obj1.code==200 && obj2.code==200)
                    {
                        if(obj3.code==200)
                        {
                            var index=helper.handleTestInterface(objInterface,obj3.data,obj2.data);
                            var child=$.showBox(_this,require("./component/testInterfaceRun.vue"),{
                                source:obj1.data.data,
                                url:obj1.data.baseUrl,
                                status:obj2.data,
                                interface:objInterface,
                                index:index,
                                netInterface:obj3.data
                            });
                            child.$on("save",function (obj) {
                                ele.setAttribute("data",JSON.stringify(obj));
                                ele.innerText=obj.name;
                                ele.style.textDecoration="none";
                            })
                        }
                        else
                        {
                            $.notify(obj3.msg,0);
                            ele.parentNode.removeChild(ele);
                        }

                    }
                    else
                    {
                        $.notify(obj1.code!=200?obj1.msg:obj2.msg,0);
                    }
                })
            },
            insertTest:function () {
                var selection=helper.getSelection();
                if(!selection)
                {
                    return;
                }
                $.startHud();
                var _this=this;
                net.get("/test/list",{
                    project:session.get("projectId")
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./component/testTestRun.vue"),{
                            source:data.data,
                            self:_this.test.id
                        });
                        child.$on("save",function (obj) {
                            var a=document.createElement("a");
                            a.setAttribute("type","2");
                            a.setAttribute("data",obj.id);
                            a.href="javascript:void(0)";
                            a.style.cursor="pointer";
                            a.style.textDecoration="none";
                            a.style.color="orange"
                            a.innerText=obj.name;
                            a.onclick=function () {
                                _this.editTest(a);
                            }
                            selection.deleteContents();
                            selection.insertNode(a);
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            editTest:function (ele) {
                var id=ele.getAttribute("data");
                $.startHud();
                var _this=this;
                Promise.all([
                    net.get("/test/list",{
                        project:session.get("projectId")
                    }),
                    net.get("/test/info",{
                        id:id,
                        project:session.get("projectId")
                    })
                ]).then(function (values) {
                    $.stopHud();
                    var obj1=values[0];
                    var obj2=values[1];
                    if(obj1.code==200)
                    {
                        if(obj2.code==200)
                        {
                            var child=$.showBox(_this,require("./component/testTestRun.vue"),{
                                source:obj1.data,
                                test:obj2.data,
                                self:_this.test.id
                            });
                            child.$on("save",function (obj) {
                                ele.setAttribute("data",obj.id);
                                ele.innerText=obj.name;
                                ele.style.textDecoration="none";
                            })
                        }
                        else
                        {
                            $.notify(obj2.msg,0);
                            ele.parentNode.removeChild(ele);
                        }
                    }
                    else
                    {
                        $.notify(obj1.msg,0);
                    }
                })
            },
            setBaseUrl:function () {
                var _this=this;
                $.startHud();
                store.dispatch("urlList").then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        if(data.data.length>0 && !_this.baseUrl)
                        {
                            _this.baseUrl=data.data[0].url
                        }
                        var child=$.showBox(_this,require("./component/testBaseUrl.vue"),{
                            url:_this.baseUrl,
                            arrUrl:data.data
                        })
                        child.$on("save",function (url) {
                            _this.baseUrl=url;
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            run: (async function () {
                var _this=this;
                var ele=document.getElementById("testContent");
                try
                {
                    this.runPending=true;
                    this.test.output="";
                    helper.runTestCode(ele.innerHTML,this.test,{},{
                        baseUrl:this.baseUrl,
                        before:this.before,
                        after:this.after,
                        baseUrls:this.$store.getters.baseUrls
                    },this.test).then(function (ret) {
                        _this.runPending=false;
                        $.notify("运行完成",1);
                    }).catch(function (err) {
                        _this.runPending=false;
                        _this.test.output+=err+"<br>"
                    })
                }
                catch(e)
                {
                    _this.runPending=false;
                    this.test.output+=e+"<br>"
                }

            }),
            runGroup:async function () {
                var arr=this.$refs.tree.$refs.tree.getCheckedNodes();
                if(arr.length==0)
                {
                    $.tip("请选择用例",0);
                    return;
                }
                var arrTest=[];
                $.startHud();
                for(var i=0;i<arr.length;i++)
                {
                    var obj=arr[i];
                    var data=await net.get("/test/info",{
                        id:obj._id
                    });
                    if(data.code==200)
                    {
                        arrTest.push(data.data);
                    }
                }
                $.stopHud();
                $.showBox(this,require("./component/testRunGroup.vue"),{
                    source:arrTest,
                    opt:{
                        baseUrl:this.baseUrl,
                        before:this.before,
                        after:this.after,
                        baseUrls:this.$store.getters.baseUrls
                    }
                })
            },
            poll:function () {
                var _this=this;
                $.startHud();
                Promise.all([
                    net.get("/poll/item",{
                        project:session.get("projectId")
                    }),
                    net.get("/test/list",{
                        project:session.get("projectId")
                    }),
                    net.get("/project/users",{
                        id:session.get("projectId")
                    }),
                    net.get("/project/urllist",{
                        id:session.get("projectId")
                    }),
                    net.get("/user/sendinfo")
                ]).then(function (data) {
                    $.stopHud();
                    var obj1=data[0];
                    var obj2=data[1];
                    var obj3=data[2];
                    var obj4=data[3];
                    var obj5=data[4];
                    var poll,test,user,baseUrl,sendInfo;
                    if(obj1.code==200)
                    {
                        poll=obj1.data;
                    }
                    else if(obj1.code==36)
                    {
                        poll=null;
                    }
                    else
                    {
                        throw obj1.msg;
                    }
                    if(obj2.code==200)
                    {
                        test=obj2.data;
                    }
                    else
                    {
                        throw obj2.msg;
                    }
                    if(obj3.code==200)
                    {
                        user=obj3.data;
                    }
                    else
                    {
                        throw obj3.msg;
                    }
                    if(obj4.code==200)
                    {
                        baseUrl=obj4.data;
                    }
                    else
                    {
                        throw obj4.msg;
                    }
                    if(obj5.code==200)
                    {
                        sendInfo=obj5.data;
                    }
                    else
                    {
                        throw obj5.msg;
                    }
                    $.showBox(_this,require("./component/poll.vue"),{
                        "propPoll":poll,
                        "propTest":test,
                        "propUser":user,
                        "propBaseUrl":baseUrl,
                        "propSendInfo":sendInfo
                    })
                }).catch(function (err) {
                    $.stopHud();
                    $.notify(err,0);
                })
            }
        },
        created:function () {
            var _this=this;
            this.$store.getters.event.$on("initTest",function (data) {
                store.commit("init",data);
            })
            this.$store.getters.event.$on("init",function (data) {
                _this.baseUrl=_this.$store.getters.baseUrls.length>0?_this.$store.getters.baseUrls[0].url:"";
            })
            this.$store.getters.event.$on("initTestContent",function () {
                var ele=document.getElementById("testContent");
                var arr=ele.getElementsByTagName("a");
                var arrPromise=[];
                $.startHud();
                Array.prototype.slice.call(arr).forEach(function (obj) {
                    if(obj.getAttribute("type")=="1")
                    {
                        obj.onclick=function () {
                            _this.editInterface(obj);
                        }
                        var inter=JSON.parse(obj.getAttribute("data"));
                        arrPromise.push(net.get("/interface/item",{
                            id:inter.id,
                            project:session.get("projectId")
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                var date=inter.updatedAt;
                                if(date==data.data.updatedAt)
                                {
                                    obj.style.textDecoration="none"
                                }
                                else
                                {
                                    obj.style.textDecoration="underline"
                                    obj.style.textDecorationColor="red"
                                }
                            }
                            else
                            {
                                obj.style.textDecoration="line-through"
                                obj.style.textDecorationColor="black"
                            }
                        }));
                    }
                    else
                    {
                        obj.onclick=function () {
                            _this.editTest(obj);
                        }
                        var id=obj.getAttribute("data");
                        arrPromise.push(net.get("/test/info",{
                            id:id,
                            project:session.get("projectId")
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                obj.style.textDecoration="none"
                                obj.style.color="orange"
                            }
                            else
                            {
                                obj.style.textDecoration="line-through"
                                obj.style.textDecorationColor="black"
                            }
                        }));
                    }
                })
                Promise.all(arrPromise).then(function (data) {
                    $.stopHud();
                })
            })
        },
        mounted:function () {
            var _this=this;
            this.$refs.tree.$refs.tree.$on("check-change",function () {
                var arrSelKey=_this.$refs.tree.$refs.tree.getCheckedKeys();
                var bSel=1;
                _this.$refs.tree.$refs.tree.root.childNodes.forEach(function (obj) {
                    if(arrSelKey.indexOf(obj.data.id)==-1)
                    {
                        bSel=0;
                    }
                })
                _this.selectAll=bSel;
            })
        }
    }
</script>