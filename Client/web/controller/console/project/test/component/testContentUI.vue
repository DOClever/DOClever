<template>
    <el-row class="row">
        <el-row class="row" style="height: 50px;line-height: 50px">
            <el-dropdown trigger="hover" style="margin-left: 15px">
                <div class="el-dropdown-link">
                    <el-button size="mini" type="primary">
                        {{type==1?"接口":"接口/用例"}}&nbsp;<i class="el-icon-caret-bottom
"></i>
                    </el-button>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="insertInterface">接口</el-dropdown-item>
                    <el-dropdown-item @click.native="insertTest" v-if="type!=1">用例</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="hover" style="margin-left: 15px">
                <div class="el-dropdown-link">
                    <el-button size="mini" type="primary">
                        条件控制&nbsp;<i class="el-icon-caret-bottom
"></i>
                    </el-button>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="insertIfBegin">if</el-dropdown-item>
                    <el-dropdown-item @click.native="insertElseIf">elseif</el-dropdown-item>
                    <el-dropdown-item @click.native="insertElse">else</el-dropdown-item>
                    <el-dropdown-item @click.native="insertIfEnd">endif</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button size="mini" type="primary" style="margin-left: 15px" @click="insertVar">
                变量
            </el-button>
            <el-button size="mini" type="primary" style="margin-left: 15px" @click="insertReturn">
                返回值
            </el-button>
            <el-dropdown trigger="hover" style="margin-left: 15px">
                <div class="el-dropdown-link">
                    <el-button size="mini" type="primary">
                        工具&nbsp;<i class="el-icon-caret-bottom
"></i>
                    </el-button>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="insertAssert">断言(assert)</el-dropdown-item>
                    <el-dropdown-item @click.native="insertLog">打印(log)</el-dropdown-item>
                    <el-dropdown-item @click.native="insertInput">用户输入(input)</el-dropdown-item>
                    <el-dropdown-item @click.native="insertBaseUrl">设置BaseUrl</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button size="mini" type="danger" style="margin-left: 15px;" @click="convertToCode" v-if="arr.length>0">
                转成代码
            </el-button>
        </el-row>
        <el-row class="row" style="margin-top: 10px;padding: 0 10px;">
            <el-row class="row" style="height: 30px;line-height: 30px;text-align: center;background-color: #ebebeb" :style="{paddingRight:paddingRight+'px'}">
                <el-col class="col" :span="3">
                    类型
                </el-col>
                <el-col class="col" :span="9">
                    名称
                </el-col>
                <el-col class="col" :span="3">
                    ID
                </el-col>
                <el-col class="col" :span="2">
                    状态
                </el-col>
                <el-col class="col" :span="7">
                    操作
                </el-col>
            </el-row>
            <el-row class="row" style="height: 100px;border: 1px dashed lightgray;border-top:none;text-align: center;line-height: 100px;;font-size: 20px;color: gray" v-if="arr.length==0">
                请点击上方按钮添加对象
            </el-row>
            <el-row class="row" style="max-height: 300px;overflow-y: auto" id="testUIEdit" v-else>
                <el-row class="row testUILine" v-for="(item,index) in arr" style="height: 40px;line-height: 40px;text-align: center;cursor: move;" draggable="true" @dragover.native="dragOver($event,item)" @dragleave.native="dragLeave($event)" @dragenter.native="dragEnter($event,item)" @drop.native="drop($event,item,index)" @dragend.native="dragEnd($event)" @dragstart.native="dragStart($event,item,index)" @mouseenter.native="$event.target.style.backgroundColor='#f3f3f3'" @mouseleave.native="$event.target.style.backgroundColor='white'">
                    <el-col class="col" :span="3" v-html="getTypeName(item.type,item)" :style="{textDecoration:item.modify==2?'line-through':(item.modify==1?'underline':'none'),textDecorationColor:item.modify==1?'red':'black'}">
                    </el-col>
                    <el-col class="col" :span="9" style="overflow:hidden;text-overflow:ellipsis;">
                        {{item.name}}
                    </el-col>
                    <el-col class="col" :span="3">
                        {{item.id}}
                    </el-col>
                    <el-col class="col" :span="2">
                        <template v-if="item.type=='interface' || item.type=='test'">
                            <i class="el-icon-question" style="color: gray" v-if="item.status==0"></i>
                            <i class="el-icon-loading" v-else-if="item.status==1"></i>
                            <i class="el-icon-success" style="color: green" v-else-if="item.status==2"></i>
                            <i class="el-icon-error" style="color: red" v-else-if="item.status==3"></i>
                            <i class="el-icon-warning
" style="color: orange" v-else-if="item.status==4"></i>
                        </template>
                        <template v-else-if="item.type=='assert'">
                            <i class="el-icon-question" style="color: gray" v-if="item.status==0"></i>
                            <i class="el-icon-success" style="color: green" v-else-if="item.status==1"></i>
                            <i class="el-icon-error" style="color: red" v-else-if="item.status==2"></i>
                        </template>
                        <template v-else>
                            &nbsp;
                        </template>
                    </el-col>
                    <el-col class="col" :span="7">
                        <template v-if="item.type=='interface'">
                            <el-button type="text" size="mini" @click="editInterface(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" size="mini" @click="editInterfaceArgv(item,index)">
                                入参
                            </el-button>
                            <el-button type="text" size="mini" @click="showInterfaceOutput(item)">
                                输出
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='test'">
                            <el-button type="text" size="mini" @click="editTest(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" size="mini" @click="editTestArgv(item,index)">
                                入参
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='ifbegin'">
                            <el-button type="text" size="mini" @click="editIfBegin(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='elseif'">
                            <el-button type="text" size="mini" @click="editElseIf(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='else' || item.type=='ifend'">
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='var'">
                            <el-button type="text" size="mini" @click="editVar(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='return'">
                            <el-button type="text" size="mini" @click="editReturn(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='log'">
                            <el-button type="text" size="mini" @click="editLog(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='input'">
                            <el-button type="text" size="mini" @click="editInput(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='baseurl'">
                            <el-button type="text" size="mini" @click="editBaseUrl(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                        <template v-if="item.type=='assert'">
                            <el-button type="text" size="mini" @click="editAssert(item,index)">
                                编辑
                            </el-button>
                            <el-button type="text" style="color: red" size="mini" @click="remove(index)">
                                删除
                            </el-button>
                        </template>
                    </el-col>
                </el-row>
            </el-row>
        </el-row>
    </el-row>
</template>

<style>

</style>

<script>
    module.exports = {
        props:["type"],
        data: function () {
            return {
                dragItem:null,
                lastEle:null,
                paddingRight:0
            }
        },
        computed:{
            test:function () {
                return this.$store.state.selTest
            },
            arr:function () {
                return this.test.ui;
            }
        },
        watch:{
            arr:{
                handler:function () {
                    this.$nextTick(function () {
                        var ele=document.getElementById("testUIEdit");
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
            initTestContent:function (data) {
                this.arr=data;
            },
            insertInterface:function () {
                var _this=this;
                var child=$.showBox(_this,require("./testInterfaceRun.vue"),{
                    url:[],
                    status:[],
                    index:0,
                });
                child.$on("save",function (obj,example) {
                    var id=_this.getNewId();
                    var o={
                        type:"interface",
                        id:id,
                        name:example?(obj.name+"("+example+")"):obj.name,
                        data:JSON.stringify(obj),
                        argv:{
                            param:{},
                            query:{},
                            header:{},
                            body:{}
                        },
                        status:0,
                        modify:0
                    };
                    _this.arr.push(o);
                })
            },
            editInterface:function (item,index) {
                if(item.modify==2)
                {
                    $.tip("该接口已经不存在",0);
                    this.arr.splice(index,1);
                    return;
                }
                var objInterface=JSON.parse(item.data);
                $.startHud();
                var _this=this;
                var arrPromise=[
                    net.get("/project/interface",{
                        id:objInterface.project._id
                    }),
                    net.get("/status/list",{
                        id:objInterface.project._id
                    }),
                    net.get("/test/interface",{
                        interface:objInterface._id,
                        only:1
                    })
                ];
                if(objInterface.example)
                {
                    arrPromise.push(net.get("/example/item",{
                        id:objInterface.example
                    }))
                }
                Promise.all(arrPromise).then(function (values) {
                    $.stopHud();
                    var obj1=values[0];
                    var obj2=values[1];
                    var obj3=values[2];
                    var obj4=values[3];
                    if(obj1.code==200 && obj2.code==200)
                    {
                        if(obj3.code==200)
                        {
                            if(obj4 && obj4.code==200)
                            {
                                helper.updateTestInterfaceWithExample(objInterface,obj4.data);
                            }
                            var index1=helper.handleTestInterface(objInterface,obj3.data,obj2.data,_this.type?1:0);
                            var child=$.showBox(_this,require("./testInterfaceRun.vue"),{
                                url:obj1.data.baseUrl,
                                status:obj2.data,
                                interface:objInterface,
                                index:index1,
                                netInterface:obj3.data
                            });
                            child.$on("save",function (obj,example) {
                                item.data=JSON.stringify(obj);
                                item.name=example?(obj.name+"("+example+")"):obj.name;
                                item.argv={
                                    param:{},
                                    query:{},
                                    header:{},
                                    body:{}
                                }
                                item.modify=0;
                            })
                        }
                        else
                        {
                            $.notify(obj3.msg,0);
                            _this.arr.splice(index,1);
                        }

                    }
                    else
                    {
                        $.notify(obj1.code!=200?obj1.msg:obj2.msg,0);
                    }
                })
            },
            insertTest:function () {
                $.startHud();
                var _this=this;
                net.get("/test/list",{
                    project:this.type==2?this.$store.state.selTest.project:session.get("projectId")
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./testTestRun.vue"),{
                            source:data.data,
                            self:_this.test.id,
                            mode:"code"
                        });
                        child.$on("save",function (obj) {
                            var o={
                                type:"test",
                                id:_this.getNewId(),
                                data:obj.id,
                                mode:obj.mode,
                                name:obj.name,
                                argv:[],
                                status:0,
                                modify:0
                            }
                            _this.arr.push(o);
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            editTest:function (item,index) {
                if(item.modify==2)
                {
                    $.tip("该用例已经不存在",0);
                    this.arr.splice(index,1);
                    return;
                }
                $.startHud();
                var _this=this;
                Promise.all([
                    net.get("/test/list",{
                        project:this.type==2?this.$store.state.selTest.project:session.get("projectId")
                    }),
                    net.get("/test/test",{
                        id:item.data,
                        project:this.type==2?this.$store.state.selTest.project:session.get("projectId")
                    })
                ]).then(function (values) {
                    $.stopHud();
                    var obj1=values[0];
                    var obj2=values[1];
                    if(obj1.code==200)
                    {
                        if(obj2.code==200)
                        {
                            var child=$.showBox(_this,require("./testTestRun.vue"),{
                                source:obj1.data,
                                test:obj2.data,
                                self:_this.test.id,
                                mode:item.mode
                            });
                            child.$on("save",function (obj) {
                                item.data=obj.id;
                                item.mode=obj.mode;
                                item.name=obj.name;
                                item.modify=0;
                            })
                        }
                        else
                        {
                            $.notify(obj2.msg,0);
                            _this.arr.splice(index,1);
                        }
                    }
                    else
                    {
                        $.notify(obj1.msg,0);
                    }
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
            getTypeName:function (type,item) {
                if(type=="interface")
                {
                    return "<span style='color: blue'>接口</span>"
                }
                else if(type=="test")
                {
                    return "<span style='color: orange'>用例("+(item.mode=="code"?"代码":"UI")+")</span>"
                }
                else if(type=="ifbegin" || type=="elseif" || type=="else" || type=="ifend")
                {
                    return "<span style='color: green'>"+type+"</span>"
                }
                else if(type=="var")
                {
                    return "<span style='color: deepskyblue'>"+(item.global?"全局":"局部")+"变量</span>"
                }
                else if(type=="return")
                {
                    return "<span style='color: orangered'>返回值</span>"
                }
                else if(type=="log")
                {
                    return "<span style='color: gray'>打印</span>"
                }
                else if(type=="input")
                {
                    return "<span style='color: #097c8f'>用户输入</span>"
                }
                else if(type=="baseurl")
                {
                    return "<span style='color: #82548f'>BaseUrl</span>"
                }
                else if(type=="assert")
                {
                    return "<span style='color: deeppink'>断言</span>"
                }
            },
            remove:function (index) {
                var _this=this;
                $.confirm("是否删除该项！",function () {
                    _this.arr.splice(index,1);
                })
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
            editInterfaceArgv:function (item,index) {
                $.showBox(this,require("./testUIInterfaceArgv.vue"),{
                    argv:item.argv,
                    index:index
                })
            },
            editTestArgv:function (item,index) {
                $.showBox(this,require("./testUITestArgv.vue"),{
                    argv:item.argv,
                    index:index
                })
            },
            setStatus:function (type,id,res) {
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
                        if(type=="interfaceStart")
                        {
                            if(item.info)
                            {
                                Vue.delete(item,"info");
                            }
                        }
                    }
                    else if(type=="interfaceSuccess" || type=="testSuccess")
                    {
                        item.status=2;
                        if(type=="interfaceSuccess")
                        {
                            Vue.set(item,"info",res);
                        }
                    }
                    else if(type=="interfaceFail" || type=="testFail")
                    {
                        item.status=3;
                        if(type=="interfaceFail")
                        {
                            Vue.set(item,"info",res);
                        }
                    }
                    else if(type=="testUnknown")
                    {
                        item.status=4;
                    }
                    else if(type=="assertSuccess")
                    {
                        item.status=1;
                    }
                    else if(type=="assertFail")
                    {
                        item.status=2;
                    }
                }
            },
            insertIfBegin:function () {
                var _this=this;
                var child=$.showBox(this,require("./testUIPrompt.vue"),{
                    title:"输入if判断的语句",
                    placeholder:"输入if判断的语句(字符串请加双引号)",
                    index:this.arr.length-1,
                    two:1
                })
                child.$on("save",function (val,name) {
                    _this.arr.push({
                        type:"ifbegin",
                        data:val,
                        id:_this.getNewId(),
                        name:name
                    })
                })
            },
            insertElseIf:function () {
                var _this=this;
                var child=$.showBox(this,require("./testUIPrompt.vue"),{
                    title:"输入elseif判断的语句",
                    placeholder:"输入elseif判断的语句(字符串请加双引号)",
                    index:this.arr.length-1,
                    two:1
                })
                child.$on("save",function (val,name) {
                    _this.arr.push({
                        type:"elseif",
                        data:val,
                        id:_this.getNewId(),
                        name:name
                    })
                })
            },
            insertElse:function () {
                this.arr.push({
                    type:"else",
                    data:"",
                    id:this.getNewId(),
                    name:"else"
                })
            },
            insertIfEnd:function () {
                this.arr.push({
                    type:"ifend",
                    data:"",
                    id:this.getNewId(),
                    name:"endif"
                })
            },
            editIfBegin:function (item,index) {
                var _this=this;
                var child=$.showBox(this,require("./testUIPrompt.vue"),{
                    title:"输入if判断的语句",
                    placeholder:"输入if判断的语句(字符串请加双引号)",
                    index:index,
                    default:item.data,
                    two:1,
                    propName:item.name
                })
                child.$on("save",function (val,name) {
                    item.data=val;
                    item.name=name
                })
            },
            editElseIf:function (item,index) {
                var _this=this;
                var child=$.showBox(this,require("./testUIPrompt.vue"),{
                    title:"输入elseif判断的语句",
                    placeholder:"输入elseif判断的语句(字符串请加双引号)",
                    index:index,
                    default:item.data,
                    two:1,
                    propName:item.name
                })
                child.$on("save",function (val,name) {
                    item.data=val;
                    item.name=name
                })
            },
            insertVar:function () {
                var _this=this;
                var child=$.showBox(this,require("./testUIVar.vue"),{
                    index:this.arr.length-1
                })
                child.$on("save",function (globalEdit,varEdit,valueEdit) {
                    _this.arr.push({
                        type:"var",
                        id:_this.getNewId(),
                        global:globalEdit,
                        name:varEdit,
                        data:valueEdit,
                    })
                })
            },
            editVar:function (item,index) {
                var _this=this;
                var child=$.showBox(this,require("./testUIVar.vue"),{
                    global:item.global,
                    var:item.name,
                    value:item.data,
                    index:index
                })
                child.$on("save",function (globalEdit,varEdit,valueEdit) {
                    item.global=globalEdit;
                    item.name=varEdit;
                    item.data=valueEdit;
                })
            },
            insertReturn:function () {
                var _this=this;
                var child=$.showBox(this,require("./testUIReturn.vue"),{
                    index:this.arr.length-1
                })
                child.$on("save",function (ret,argv) {
                    _this.arr.push({
                        type:"return",
                        id:_this.getNewId(),
                        name:(ret=="true"?"通过":(ret=="false"?"不通过":"未判定")),
                        data:ret,
                        argv:argv
                    })
                })
            },
            editReturn:function (item,index) {
                var _this=this;
                var child=$.showBox(this,require("./testUIReturn.vue"),{
                    data:item.data,
                    argv:item.argv,
                    index:index
                })
                child.$on("save",function (ret,argv) {
                    item.name=(ret=="true"?"通过":(ret=="false"?"不通过":"未判定"));
                    item.data=ret;
                    item.argv=argv;
                })
            },
            insertLog:function () {
                var _this=this;
                var child=$.showBox(this,require("./testUIPrompt.vue"),{
                    title:"输入需要打印的值或JS语句",
                    placeholder:"输入需要打印的值或JS语句(Code类型下字符串请加双引号)",
                    index:this.arr.length-1,
                    category:1,
                    two:1
                })
                child.$on("save",function (val,name) {
                    _this.arr.push({
                        type:"log",
                        data:val,
                        id:_this.getNewId(),
                        name:name
                    })
                })
            },
            editLog:function (item,index) {
                var _this=this;
                var child=$.showBox(this,require("./testUIPrompt.vue"),{
                    title:"输入需要打印的值或JS语句",
                    placeholder:"输入需要打印的值或JS语句(Code类型下字符串请加双引号)",
                    index:index,
                    default:item.data,
                    category:1,
                    two:1,
                    propName:item.name
                })
                child.$on("save",function (val,name) {
                    item.data=val;
                    item.name=name
                })
            },
            insertInput:function () {
                var _this=this;
                var child=$.showBox(this,require("./testUIInput.vue"),{
                    index:_this.arr.length-1
                });
                child.$on("save",function (title,val) {
                    _this.arr.push({
                        type:"input",
                        data:val,
                        id:_this.getNewId(),
                        name:title
                    })
                })
            },
            editInput:function (item,index) {
                var _this=this;
                var child=$.showBox(this,require("./testUIInput.vue"),{
                    defaultTitle:item.name,
                    defaultValue:item.data,
                    index:_this.arr.length-1
                });
                child.$on("save",function (title,val) {
                    item.name=title;
                    item.data=val;
                })
            },
            convertToCode:function () {
                var _this=this;
                $.confirm("是否转换成代码，当前代码模式的代码将被覆盖！",function () {
                    _this.$store.getters.event.$emit("convertToCode",_this.arr);
                })
            },
            insertBaseUrl:function () {
                var _this=this;
                var child=$.showBox(this,require("./testUIPrompt.vue"),{
                    title:"请输入BaseUrl",
                    placeholder:"请输入BaseUrl(Code类型下字符串请加双引号)",
                    index:this.arr.length-1,
                    category:1,
                    two:1
                })
                child.$on("save",function (val,name) {
                    _this.arr.push({
                        type:"baseurl",
                        data:$.trim(val),
                        name:name,
                        id:_this.getNewId()
                    })
                })
            },
            editBaseUrl:function (item,index) {
                var _this=this;
                var child=$.showBox(this,require("./testUIPrompt.vue"),{
                    title:"请输入BaseUrl",
                    placeholder:"请输入BaseUrl(Code类型下字符串请加双引号)",
                    index:index,
                    default:item.data,
                    category:1,
                    two:1,
                    propName:item.name
                })
                child.$on("save",function (val,name) {
                    item.name=name;
                    item.data=$.trim(val);
                })
            },
            insertAssert:function () {
                var _this=this;
                var child=$.showBox(this,require("./testUIAssert.vue"),{
                    index:this.arr.length-1
                })
                child.$on("save",function (val,name,pass) {
                    _this.arr.push({
                        type:"assert",
                        data:val,
                        id:_this.getNewId(),
                        name:name,
                        status:0,
                        pass:pass
                    })
                })
            },
            editAssert:function (item,index) {
                var _this=this;
                var child=$.showBox(this,require("./testUIAssert.vue"),{
                    index:index,
                    default:item.data,
                    propName:item.name,
                    propPass:item.pass
                })
                child.$on("save",function (val,name,pass) {
                    item.data=val;
                    item.name=name;
                    item.pass=pass;
                })
            },
            initTestContent:function () {
                this.arr.forEach(function (obj) {
                    if(obj.type=="interface")
                    {
                        var inter=JSON.parse(obj.data);
                        net.get("/test/interface",{
                            interface:inter._id,
                            only:1
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                var date=inter.updatedAt;
                                if(date!=data.data.updatedAt)
                                {
                                    obj.modify=1;
                                }
                            }
                            else
                            {
                                obj.modify=2;
                            }
                        });
                    }
                    else if(obj.type=="test")
                    {
                        var id=obj.data;
                        net.get("/test/test",{
                            id:id,
                            project:this.type==2?this.$store.state.selTest.project:session.get("projectId")
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                obj.modify=0;
                            }
                            else
                            {
                                obj.modify=2;
                            }
                        });
                    }
                })
            },
            showInterfaceOutput:function (item) {
                if(item.info)
                {
                    $.showBox(this,require("./testInterfaceOutput.vue"),{
                        source:item.info
                    })
                }
                else
                {
                    $.tip("接口暂无输出",0);
                }
            }
        },
        created:function () {
            this.$store.getters.event.$on("testRunStatus",this.setStatus)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("testRunStatus",this.setStatus)
        },
    }
</script>