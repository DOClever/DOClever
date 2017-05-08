<template>
    <el-row class="row" style="margin:0 0 0 5px" :gutter="20">
        <el-col class="col" :span="7" style="background-color: white;box-shadow: 2px 2px 2px #888888;border-radius: 5px;margin: 0;padding: 0">
            <el-row class="row" style="height: 50px;background-color: #20A0FF;color: white;margin: 0;padding: 0">
                <el-col class="col" :span="6" style="line-height: 50px;text-align: center;font-weight: bold;font-size: 15px;padding: 0">
                    模块
                </el-col>
                <el-col :span="12" class="col"></el-col>
                <el-col :span="3" class="col" style="text-align: center;line-height: 50px;cursor: pointer;" @click.native="setBaseUrl" title="设置BaseUrl">
                    <i class="fa fa-link"></i>
                </el-col>
                <el-col :span="3" class="col" style="text-align: center;line-height: 50px;cursor: pointer;" @click.native="addModule" title="添加模块">
                    <i class="el-icon-plus"></i>
                </el-col>
            </el-row>
            <testlist ref="tree" style="min-height: 300px;"></testlist>
            <el-row class="row" style="height: 50px;line-height: 50px;text-align: center;font-weight: bold;font-size: 15px;padding: 0;background-color: #20A0FF;color: white">
                <el-col :span="6" class="col">
                    <el-checkbox v-model="selectAll" :true-label="1" :false-label="0" @change="changeSelectAll"><span style="color: white">全选</span></el-checkbox>
                </el-col>
                <el-col :span="14" class="col">
                </el-col>
                <el-col :span="4" class="col">
                    <el-button type="text" style="color: white" @click="runGroup">运行</el-button>
                </el-col>
            </el-row>
        </el-col>
        <el-col class="col" :span="17" v-if="selNode">
            <el-row class="row">
                <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;padding: 15px 0" >
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            名称
                        </el-col>
                        <el-col class="col" :span="10" style="height: 50px;line-height: 50px;text-align: left">
                            <el-input style="width: 90%" placeholder="请输入接口名称" v-model="test.name"></el-input>
                        </el-col>
                        <el-col class="col" :span="2" style="text-align: center">
                            <el-popover ref="popover1" placement="bottom" title="修改信息" width="400" trigger="hover" :content="editInfo">
                            </el-popover>
                            <el-button type="text" v-popover:popover1 style="font-size: 20px">
                                <span class="fa fa-user"></span>
                            </el-button>
                        </el-col>
                        <el-col class="col" :span="1" style="text-align: left">
                        </el-col>
                        <el-col class="col" :span="4" style="height: 50px;line-height: 50px;text-align: left">
                            <el-button :loading="savePending" type="primary" style="width: 65%" @click="save">
                                保存
                            </el-button>
                        </el-col>
                        <el-col class="col" :span="1" style="text-align: left">
                        </el-col>
                        <el-col class="col" :span="4" style="height: 50px;line-height: 50px;text-align: left">
                            <el-button type="primary" style="width: 65%" :loading="runPending" @click="run">
                                运行
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            业务
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-cascader expand-trigger="hover" :options="arrGroup" v-model="groupModel" style="width: 90%">
                            </el-cascader>
                        </el-col>
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            状态
                        </el-col>
                        <el-col class="col" :span="10" style="text-align: center">
                            <el-select style="width: 80%;text-align: center" v-model="test.status">
                                <el-option  :value="0" label="未判定"></el-option>
                                <el-option  :value="1" label="已通过"></el-option>
                                <el-option  :value="2" label="未通过"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 90px;line-height: 90px;text-align: center">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            备注
                        </el-col>
                        <el-col class="col" :span="22" style="text-align: left">
                            <el-input type="textarea" :rows="3" style="width: 95%;vertical-align: middle" placeholder="请输入关于该用例的备注" v-model="test.remark"></el-input>
                        </el-col>
                    </el-row>
                </el-row>
                <el-row class="row" style="background-color: white;padding: 20px;margin-top: 15px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                    <el-tabs type="card">
                        <el-tab-pane label="内容">
                            <el-row class="row" style="height: 50px">
                                <el-button type="primary" style="margin-left: 20px" @click="insertInterface">插入接口</el-button>&nbsp;&nbsp;&nbsp;
                                <el-button type="primary" @click="insertTest">插入用例</el-button>
                                <a href="/html/web/projectinfo/test.html" style="float: right;margin-right: 20px;margin-top: 5px">如何编写</a>
                            </el-row>
                            <div class="row" style="height: 300px;border:1px gray solid;margin: 0 auto;width: 95%;padding: 5px;overflow: auto" contenteditable="true" id="testContent">

                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
                <el-row class="row" style="background-color: white;padding: 20px;margin-top: 15px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                    <el-tabs type="card">
                        <el-tab-pane label="输出">
                            <el-row class="row" v-html="test.output">

                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
                <el-row class="row" style="height: 100px">

                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    var store=require("../projectinfo/storeTest");
    var bus=require("../bus/projectInfoBus")
    var testList=require("./testlist.vue")
    module.exports={
        data:function () {
            return {
                selectAll:0,
                savePending:false,
                runPending:false,
                baseUrl:"",
                before:"",
                after:""
            }
        },
        store:store,
        components:{
            "testlist":testList
        },
        watch:{

        },
        computed:{
            test:function () {
                return store.state.test
            },
            selNode:function () {
                return store.state.selNode
            },
            editInfo:function () {
                return this.test.owner.name+"在"+this.test.createdAt+"创建，最近修改被"+this.test.editor.name+"在"+this.test.updatedAt+"改动";
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
                        var child=$.showBox(_this,"testInterfaceRun",{
                            source:obj1.data.data,
                            url:obj1.data.baseUrl,
                            status:obj2.data
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
                        id:objInterface.id
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
                            helper.handleTestInterface(objInterface,obj3.data,obj2.data);
                            var child=$.showBox(_this,"testInterfaceRun",{
                                source:obj1.data.data,
                                url:obj1.data.baseUrl,
                                status:obj2.data,
                                interface:objInterface
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
                        var child=$.showBox(_this,"testTestRun",{
                            source:data.data,
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
                        id:id
                    })
                ]).then(function (values) {
                    $.stopHud();
                    var obj1=values[0];
                    var obj2=values[1];
                    if(obj1.code==200)
                    {
                        if(obj2.code==200)
                        {
                            var child=$.showBox(_this,"testTestRun",{
                                source:obj1.data,
                                test:obj2.data
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
                            _this.baseUrl=data.data[0]
                        }
                        var child=$.showBox(_this,"testBaseUrl",{
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
                        after:this.after
                    },this.test).then(function (ret) {
                        _this.runPending=false;
                        $.notify("运行完成",1);
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
                $.showBox(this,"testRunGroup",{
                    source:arrTest,
                    opt:{
                        baseUrl:this.baseUrl,
                        before:this.before,
                        after:this.after
                    }
                })
            }
        },
        created:function () {
            var _this=this;
            bus.$on("initTest",function (data) {
                store.commit("init",data);
            })
            bus.$on("initInfo",function (data) {
                _this.baseUrl=data.baseUrls.length>0?data.baseUrls[0]:"";
                _this.before=data.before;
                _this.after=data.after;
            })
            bus.$on("globalInject",function (data) {
                _this.before=data.before;
                _this.after=data.after;
            })
            bus.$on("initTestContent",function () {
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