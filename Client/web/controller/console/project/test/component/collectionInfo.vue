<template>
    <el-row class="row">
        <el-row class="row" style="height: 35px;line-height: 35px">
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" @click="poll" v-if="editRole">
                {{info.poll?"编辑轮询":"加入轮询"}}
            </el-button>
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" @click="run" :loading="runPending">
                运行
            </el-button>
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 10px;margin-left: 0px" @click="save"   :loading="savePending" v-if="editRole">
                保存
            </el-button>
            <testbaseurl style="width: 300px"></testbaseurl>
        </el-row>
        <el-row class="row" style="height: calc(100vh - 150px);margin-top: 5px">
            <el-row class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;height: 66%;">
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    集合&nbsp;
                    <el-tooltip class="item" effect="dark" placement="bottom" trigger="hover" :content="editInfo">
                        <i class="el-icon-info" style="font-size: 12px;"></i>
                    </el-tooltip>
                    <el-button type="text" size="mini" style="float: right;margin-right: 10px;margin-top: 5px;color: red" @click="clear">
                        清空
                    </el-button>
                    <el-button type="text" size="mini" style="float: right;margin-right: 10px;margin-top: 5px" @click="add">
                        添加用例
                    </el-button>
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <el-row class="row" style="height: calc(100% - 41px);border-bottom-left-radius: 5px;border-bottom-right-radius: 5px">
                    <el-row class="row" style="height: 30px;line-height: 30px;text-align: center;background-color: #ebebeb" :style="{paddingRight:paddingRight+'px'}">
                        <el-col class="col" :span="8">
                            名称
                        </el-col>
                        <el-col class="col" :span="2">
                            ID
                        </el-col>
                        <el-col class="col" :span="3">
                            UI/代码
                        </el-col>
                        <el-col class="col" :span="2">
                            状态
                        </el-col>
                        <el-col class="col" :span="2">
                            耗时(s)
                        </el-col>
                        <el-col class="col" :span="7">
                            操作
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: calc(100% - 30px);overflow-y: auto;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px" id="collectionInfo">
                        <el-row class="row" style="height: 40px;line-height: 40px;text-align: center;cursor: move" v-for="(item,index) in arr" @mouseenter.native="$event.target.style.backgroundColor='#f3f3f3'" @mouseleave.native="$event.target.style.backgroundColor='white'" draggable="true" @dragover.native="dragOver($event,item)" @dragleave.native="dragLeave($event)" @dragenter.native="dragEnter($event,item)" @drop.native="drop($event,item,index)" @dragend.native="dragEnd($event)" @dragstart.native="dragStart($event,item,index)">
                            <el-col class="col" :span="8" style="overflow: hidden;text-overflow:ellipsis;">
                                <el-tooltip class="item" effect="dark" :content="item.test.module.name+'/'+item.test.group.name+'/'+item.test.name" placement="bottom">
                                    <span>{{item.test.name}}({{item.test.module.name}}/{{item.test.group.name}})</span>
                                </el-tooltip>
                            </el-col>
                            <el-col class="col" :span="2">
                                {{item.id}}
                            </el-col>
                            <el-col class="col" :span="3">
                                <el-switch size="small" v-model="item.mode" active-value="code" inactive-value="ui">
                                </el-switch>
                            </el-col>
                            <el-col class="col" :span="2">
                                <i class="el-icon-question" style="color: gray" v-if="item.status==0"></i>
                                <i class="el-icon-loading" v-else-if="item.status==1"></i>
                                <i class="el-icon-success" style="color: green" v-else-if="item.status==2"></i>
                                <i class="el-icon-error" style="color: red" v-else-if="item.status==3"></i>
                                <i class="el-icon-warning
" style="color: orange" v-else-if="item.status==4"></i>
                            </el-col>
                            <el-col class="col" :span="2">
                                {{(item.time/1000).toFixed(3)}}
                            </el-col>
                            <el-col class="col" :span="7">
                                <el-button type="text" size="mini" @click="editArgv(item,index)">
                                    入参
                                </el-button>
                                <el-button type="text" size="mini" @click="showOutput(item)">
                                    输出
                                </el-button>
                                <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                    删除
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>
            </el-row>
            <el-row class="row" style="height:34%;padding: 15px 0">
                <el-row class="row" style="height: 100%;background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);">
                    <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                        输出
                    </el-row>
                    <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                    <el-row class="row" style="height: calc(100% - 41px);border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;overflow-y: auto;padding-left: 10px">
                        总共运行：{{info.output.total}}<br>
                        成功：<span style="color: green">{{info.output.success}}</span><br>
                        失败：<span style="color: red">{{info.output.fail}}</span><br>
                        未判定：<span style="color: orange">{{info.output.unknown}}</span><br>
                        一共耗时(s):{{(info.output.time/1000).toFixed(3)}}<br>
                        平均耗时(s):{{info.output.total==0?"0.000":(info.output.time/1000/info.output.total).toFixed(3)}}
                    </el-row>
                </el-row>
            </el-row>
        </el-row>
    </el-row>
</template>

<style>

</style>

<script>
    var testBaseUrl=require("./testBaseUrl.vue");
    module.exports = {
        data: function () {
            return {
                runPending:false,
                savePending:false,
                arr:[],
                dragItem:null,
                lastEle:null,
                paddingRight:0
            }
        },
        components:{
            "testbaseurl":testBaseUrl
        },
        computed:{
            info:function () {
                return this.$store.state.selCollection;
            },
            editInfo:function () {
                return "该集合于"+this.info.createdAt+"创建，最后修改在"+this.info.updatedAt;
            },
            editRole:function () {
                return this.$store.getters.editRole;
            }
        },
        watch:{
            "info.tests":{
                handler:function (val) {
                    this.arr=$.clone(val);
                },
                immediate:true
            },
            arr:{
                handler:function () {
                    this.$nextTick(function () {
                        var ele=document.getElementById("collectionInfo");
                        if(ele)
                        {
                            this.paddingRight=ele.offsetWidth-ele.clientWidth;
                        }
                        else
                        {
                            this.paddingRight=0;
                        }
                    })
                },
                immediate:true
            }
        },
        methods: {
            run:async function () {
                var _this=this;
                if(!this.$store.state.baseUrl)
                {
                    $.tip("请设置BaseUrl",0);
                    return;
                }
                this.runPending=true;
                var test={
                    name:"",
                    status:0
                };
                var root={}
                root.output="";
                root.projectInfo=[];
                root.total=this.arr.length;
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
                var arr=this.arr.map(function (obj) {
                    return {
                        type:"test",
                        data:obj.test._id,
                        mode:obj.mode,
                        id:obj.id,
                        name:obj.test.name,
                        argv:obj.argv,
                    }
                })
                var str=helper.convertToCode(arr);
                try
                {
                    await helper.runTestCode(str,test,{},{
                        baseUrl:this.$store.state.baseUrl,
                        env:env,
                    },root,[],"ui",undefined,0);
                    _this.runPending=false;
                    $.notify("运行完成",1);
                }
                catch(e)
                {
                    _this.runPending=false;
                    root.output+=e+"<br>"
                }
                this.info.output.total=root.total;
                this.info.output.success=root.success;
                this.info.output.fail=root.fail;
                this.info.output.unknown=root.unknown;
                this.info.output.time=0;
                var _this=this;
                this.arr.forEach(function (obj) {
                    _this.info.output.time+=obj.time;
                })
            },
            save:function () {
                var arr=this.arr.map(function (obj) {
                    var o=$.clone(obj);
                    o.test=o.test._id;
                    return o;
                })
                this.savePending=true;
                var _this=this;
                this.$store.dispatch("saveCollection",{
                    collection:this.info._id,
                    name:this.info.name,
                    test:JSON.stringify(arr),
                    output:JSON.stringify(this.info.output)
                }).then(function (data) {
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
                        $.notify(data.msg,0)
                    }
                })
            },
            add:function () {
                var _this=this;
                var child=$.showBox(this,require("./testChooseTest.vue"));
                child.$on("save",function (obj) {
                    obj.data.forEach(function (o) {
                        _this.arr.push({
                            test:$.clone(o),
                            output:"",
                            argv:[],
                            status:0,
                            id:_this.getNewId(),
                            time:0,
                            mode:obj.mode,
                        })
                    })
                })
            },
            getNewId:function () {
                var ids=this.arr.map(function (obj) {
                    return obj.id;
                })
                for(var i=0;;i++)
                {
                    if(ids.indexOf(i)==-1)
                    {
                        return i;
                    }
                }
            },
            dragOver:function (event,item) {
                if(this.dragItem==item || !this.lastEle)
                {
                    return;
                }
                var bound=this.lastEle.getBoundingClientRect();
                var top=event.clientY;
                var height=bound.bottom-bound.top;
                if(top<bound.top+(bound.bottom-bound.top)/2)
                {
                    this.lastEle.style.borderTop="2px #50bfff solid";
                    this.lastEle.style.borderBottom="";
                }
                else
                {
                    this.lastEle.style.borderTop="";
                    this.lastEle.style.borderBottom="2px #50bfff solid";
                }
                event.preventDefault();
                return true;
            },
            dragLeave:function (event) {
                return true;
            },
            dragEnter:function (event,item) {
                if(this.dragItem==item)
                {
                    return;
                }
                var ele=event.target;
                while(ele.className.indexOf("row")==-1)
                {
                    ele=ele.parentNode;
                }
                if(this.lastEle && this.lastEle==ele)
                {
                    return true;
                }
                else if(this.lastEle && this.lastEle!=ele)
                {
                    this.lastEle.style.borderBottom="";
                    this.lastEle.style.borderTop="";
                    this.lastEle.style.backgroundColor="white";
                }
                this.lastEle=ele;
                return true;
            },
            drop:function (event,item,index) {
                if(this.lastEle)
                {
                    this.lastEle.style.borderBottom="";
                    this.lastEle.style.borderTop="";
                    this.lastEle.style.backgroundColor="white";
                    event.preventDefault();
                    if(this.dragItem==item)
                    {
                        return false;
                    }
                    var bound=this.lastEle.getBoundingClientRect();
                    var top=event.clientY;
                    var height=bound.bottom-bound.top;
                    if(event.dataTransfer.getData("text"))
                    {
                        var obj=JSON.parse(event.dataTransfer.getData("text"));
                        if(obj.id===undefined)
                        {
                            return;
                        }
                        if(item.id==obj.id)
                        {
                            return;
                        }
                        var temp=this.arr[obj.index];
                        if(top<bound.top+height/2)
                        {
                            if(index>obj.index)
                            {
                                this.arr.splice(obj.index,1);
                                this.arr.splice(index-1,0,temp);
                            }
                            else
                            {
                                this.arr.splice(obj.index,1);
                                this.arr.splice(index,0,temp);
                            }
                        }
                        else
                        {
                            if(index>obj.index)
                            {
                                this.arr.splice(obj.index,1);
                                this.arr.splice(index,0,temp);
                            }
                            else
                            {
                                this.arr.splice(obj.index,1);
                                this.arr.splice(index+1,0,temp);
                            }
                        }
                    }
                    this.lastEle=null;
                }
                return false;
            },
            dragEnd:function (event) {
                this.dragItem=null;
                if(this.lastEle)
                {
                    this.lastEle.style.borderBottom="";
                    this.lastEle.style.borderTop="";
                    this.lastEle.style.backgroundColor="white";
                }
            },
            dragStart:function (event,item,index) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text", JSON.stringify({
                    id:item.id,
                    index:index,
                }));
                this.dragItem=item;
                this.lastEle=null;
            },
            editArgv:function (item,index) {
                $.showBox(this,require("./testUITestArgv.vue"),{
                    argv:item.argv
                })
            },
            showOutput:function (item) {
                if(item.output)
                {
                    this.$alert("<div style='width: 100%;max-height: 300px;overflow-y: auto'>"+item.output+"</div>",item.test.name+"的输出", {
                        dangerouslyUseHTMLString: true
                    });
                }
                else
                {
                    $.tip("该用例无输出",0);
                }
            },
            remove:function (index) {
                var _this=this;
                $.confirm("是否删除该项！",function () {
                    _this.arr.splice(index,1);
                })
            },
            setStatus:function (type,id) {
                var item=null;
                for(var i=0;i<this.arr.length;i++)
                {
                    var obj=this.arr[i];
                    if(obj.id==id)
                    {
                        item=obj;
                        break;
                    }
                }
                if(item)
                {
                    if(type=="interfaceStart" || type=="testStart")
                    {
                        item.status=1;
                    }
                    else if(type=="interfaceSuccess" || type=="testSuccess")
                    {
                        item.status=2;
                    }
                    else if(type=="interfaceFail" || type=="testFail")
                    {
                        item.status=3;
                    }
                    else if(type=="testUnknown")
                    {
                        item.status=4;
                    }
                }
            },
            setInfo:function (id,str,time) {
                var item=null;
                for(var i=0;i<this.arr.length;i++)
                {
                    var obj=this.arr[i];
                    if(obj.id==id)
                    {
                        item=obj;
                        break;
                    }
                }
                if(item)
                {
                    item.time=time;
                    item.output=str;
                }
            },
            clear:function () {
                var _this=this;
                $.confirm("是否确定清空！",function () {
                    _this.arr=[];
                })
            },
            poll:function () {
                var _this=this;
                $.startHud();
                var arr=[
                    net.get("/test/users",{
                        project:session.get("projectId")
                    }),
                    net.get("/test/urllist",{
                        project:session.get("projectId"),
                        user:this.$store.state.selUser
                    }),
                    net.get("/user/sendinfo")
                ];
                if(this.info.poll)
                {
                    arr.unshift(net.get("/poll/item",{
                        id:this.info.poll
                    }))
                }
                else
                {
                    arr.unshift({
                        code:0,
                        data:null
                    })
                }
                Promise.all(arr).then(function (data) {
                    $.stopHud();
                    var obj1=data[0];
                    var obj2=data[1];
                    var obj3=data[2];
                    var obj4=data[3];
                    var poll,test,user,baseUrl,sendInfo;
                    if(obj1.code==200)
                    {
                        poll=obj1.data;
                    }
                    else
                    {
                        poll=null;
                    }
                    if(obj2.code==200)
                    {
                        user=obj2.data;
                    }
                    else
                    {
                        throw obj2.msg;
                    }
                    if(obj3.code==200)
                    {
                        baseUrl=obj3.data;
                    }
                    else
                    {
                        throw obj3.msg;
                    }
                    if(obj4.code==200)
                    {
                        sendInfo=obj4.data;
                    }
                    else
                    {
                        throw obj4.msg;
                    }
                    var child=$.showBox(_this,require("./poll.vue"),{
                        "propPoll":poll,
                        "propUser":user,
                        "propBaseUrl":baseUrl,
                        "propSendInfo":sendInfo,
                        "collection":_this.info._id
                    })
                    child.$on("remove",function () {
                        _this.info.poll=null;
                    })
                    child.$on("save",function (id) {
                        _this.info.poll=id;
                    })
                }).catch(function (err) {
                    $.stopHud();
                    $.notify(err,0);
                })
            }
        },
        created:function () {
            this.$store.getters.event.$on("testRunStatus",this.setStatus)
            this.$store.getters.event.$on("testCollectionRun",this.setInfo)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("testRunStatus",this.setStatus)
            this.$store.getters.event.$off("testCollectionRun",this.setInfo)
        },
    }
</script>







