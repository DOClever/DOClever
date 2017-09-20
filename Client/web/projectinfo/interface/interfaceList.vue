<template>
    <el-row class="row" style="cursor: pointer;white-space: nowrap" id="tree">
        <template v-for="(item,index) in arr">
            <el-row class="row" :draggable="interfaceEditRole && item.type==0" style="height: 40px;line-height: 40px;white-space: nowrap" :id="item.type==1?'recycle':('group'+index)" @dragover.native="dragOver($event,item)" @dragleave.native="dragLeave($event)" @drop.native="drop($event,item)" :key="item._id" v-if="level==0 || (item.data && parent.show)" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}" @dragstart.native="dragStart($event,item,index)">
                <template v-if="level>0">
                    <el-col :span="2" class="col" v-for="n in level" :style="{'borderRight':'1px lightgray dashed'}">
                        &nbsp;
                    </el-col>
                </template>
                <el-col class="col" :span="4" style="font-size: large;text-align: center;white-space: nowrap" @click.native="item.show=!item.show">
                    <span :class="item.show?'fa fa-folder-open':'fa fa-folder'" style="color:#c7c7c7 "></span>
                </el-col>
                <el-col class="col" :span="20-2*level" :style="{margin: 0,fontSize: 'larger',color: item.type==0?'#50bfff':'red',whiteSpace: 'nowrap',padding: 0,textOverflow:'ellipsis',overflow:'hidden'}" @click.native="item.show=!item.show" :title="item.name">
                    {{item.name}}({{item.data.length}})
                </el-col>
                <div class="col" style="height: 40px;white-space: nowrap;text-align: center;position: absolute;top: 0px;right: 0px;width: 40px" v-show="item.menu">
                    <el-dropdown trigger="click" v-if="interfaceEditRole && !search"  style="width: 100%;height: 100%;cursor: pointer">
                        <div class="el-dropdown-link">
                            <i class="fa fa-edit"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  v-if="item.type==0"><div @click="addInterface(item)">新建接口</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0"><div @click="addGroup(item)">新建分组</div></el-dropdown-item>
                            <el-dropdown-item ><div @click="refresh">刷新</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0"><div @click="renameGroup(item)">重命名</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0"><div @click="removeGroup(item)">删除</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==1"><div @click="clear">清空</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0 && objCopy"><div @click="paste(item)">粘贴</div></el-dropdown-item>
                            <el-dropdown-item ><div @click="importInterface(item)" v-if="item.type==0">导入接口</div></el-dropdown-item>
                            <el-dropdown-item ><div @click="exportGroup(item)" v-if="item.type==0">导出分组</div></el-dropdown-item>
                            <el-dropdown-item ><div @click="importGroup(item)" v-if="item.type==0">导入分组</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-row>
            <interfacelist v-if="item.data && item.data.length>0 && item.show" :level="level+1" :data="item.data" :parent="item"></interfacelist>
            <el-row class="row" :draggable="interfaceEditRole" style="height: 40px;line-height: 40px;cursor: move" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" @click.native="info(item,index,$event)" :section="index" :row="index" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}" @dragstart.native="dragStart($event,item,index)" :key="item._id" v-else-if="!item.data && parent.show">
                <template v-if="level>0">
                    <el-col :span="2" class="col" v-for="n in level" :style="{'borderRight':'1px lightgray dashed'}">
                        &nbsp;
                    </el-col>
                </template>
                <el-col class="col" :span="4" :style="{fontSize: 'small',margin: 0,color:item.select?'white':methodColor(item.finish),padding:0,lineHeight:'40px','textAlign':'center'}" name="treeMethod">
                    {{item.method=="DELETE"?"DEL":item.method}}
                </el-col>
                <el-col class="col" :span="20-2*level" :style="{margin: 0,color: item.finish==1?'green':(item.finish==2?'gray':'#50bfff'),color:item.select?'white':'#50bfff',lineHeight:'40px',textOverflow:'ellipsis',overflow:'hidden'}" name="treeName" :title="item.name">
                    {{item.name}}
                </el-col>
                <div class="col" style="margin: 0;height: 40px;white-space: nowrap;text-align: center;position: absolute;top: 0px;right: 0px;width: 40px" v-show="item.menu">
                    <el-dropdown trigger="click" v-if="interfaceEditRole"  style="width: 100%;height: 100%;cursor: pointer">
                        <div class="el-dropdown-link">
                            <i class="fa fa-edit"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="parent.type==0"><div @click="removeInterface(item)">删除</div></el-dropdown-item>
                            <el-dropdown-item><div @click="copy(item)">复制</div></el-dropdown-item>
                            <el-dropdown-item v-if="parent.type==1"><div @click="destroyInterface(item)">彻底删除</div></el-dropdown-item>
                            <el-dropdown-item><div @click="exportInterface(item)">导出接口</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-row>
        </template>
    </el-row>
</template>

<script>
    var sessionChange=require("../../mixins/session");
    module.exports={
        name:"interfacelist",
        props:{
            level:{
                type:Number,
                default:0
            },
            data:Array,
            parent:Object
        },
        data:function () {
            return {

            }
        },
        mixins:[sessionChange],
        computed:{
            interfaceEditRole:function () {
                return this.$store.getters.interfaceEditRole;
            },
            arr:function () {
                if(this.level==0)
                {
                    return this.$store.state.search?this.$store.state.interfaceSearchList:this.$store.state.interfaceList
                }
                else
                {
                    return this.data
                }
            },
            objCopy:{
                get:function () {
                    return this.$store.state.objCopy
                },
                set:function (value) {
                    this.$store.commit("setObjCopy",value);
                }
            },
            search:function () {
                return this.$store.state.search
            }
        },
        methods:{
            mouseEnter:function (event,item) {
                item.menu=1;
            },
            mouseLeave:function (event,item) {
                item.menu=0;
            },
            methodColor:function (m) {
                return helper.methodColor(m);
            },
            refresh:function () {
                $.startHud("#body");
                this.$store.dispatch("refresh").then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            renameGroup:function (item) {
                var _this=this;
                $.input("请输入重命名的名称",function (val) {
                    if(val.value==="")
                    {
                        $.tip("请输入重命名的名称",0);
                        return
                    }
                    var query={};
                    query.id=session.get("projectId");
                    query.name=val.value;
                    query.group=item._id
                    $.startHud("#body");
                    _this.$store.dispatch("renameGroup",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("重命名成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                });
            },
            removeGroup:function (item) {
                var _this=this;
                $.confirm("确定删除该分组？",function () {
                    var query={
                        id:session.get("projectId"),
                        group:item._id
                    }
                    $.startHud("#body");
                    _this.$store.dispatch("removeGroup",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            clear:function () {
                var _this=this;
                $.confirm("确定清空回收站？",function () {
                    $.startHud("#body");
                    _this.$store.dispatch("clear").then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("清空成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            removeInterface:function (item) {
                var _this=this;
                $.confirm("确定删除该接口到回收站？",function () {
                    $.startHud("#body");
                    _this.$store.dispatch("removeInterface",item._id).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            destroyInterface:function (item) {
                var _this=this;
                $.confirm("确定要彻底删除该接口？",function () {
                    $.startHud("#body");
                    _this.$store.dispatch("destroyInterface",item._id).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            info:function (item,index,event) {
                if(event.target.getAttribute("name")!="treeMethod" && event.target.getAttribute("name")!="treeName")
                {
                    return;
                }
                session.remove("snapshotId");
                session.remove("snapshotDis");
                session.remove("snapshotCreator");
                session.remove("snapshotDate");
                $.startHud("#body");
                this.$store.dispatch("info",{
                    item:this.parent,
                    item1:item,
                    index:index
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {

                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })

            },
            addInterface:function (item) {
                session.remove("snapshotId");
                session.remove("snapshotDis");
                session.remove("snapshotCreator");
                session.remove("snapshotDate");
                this.$store.dispatch("add",{
                    item:null,
                    id:item._id
                })
            },
            dragStart:function (event,item,index) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text", JSON.stringify({
                    id:item._id,
                    group:this.parent?this.parent._id:"",
                    index:index,
                    folder:item.data?1:0
                }));
            },
            dragOver:function (event,item) {
                var ele=event.target;
                while(ele.className.indexOf("row")==-1)
                {
                    ele=ele.parentNode;
                }
                if(!item.parent)
                {
                    if(!ele.timer)
                    {
                        ele.timer=setTimeout(function () {
                            ele.style.backgroundColor="orange";
                        },2000)
                        ele.style.backgroundColor="rgb(223,236,191)";
                    }
                }
                else
                {
                    ele.style.backgroundColor="rgb(223,236,191)";
                }
                event.preventDefault();
                return true;
            },
            dragLeave:function (event) {
                var ele=event.target;
                while(ele.className.indexOf("row")==-1)
                {
                    ele=ele.parentNode;
                }
                ele.style.backgroundColor="white";
                if(ele.timer)
                {
                    clearTimeout(ele.timer);
                    ele.timer=null;
                }
            },
            drop:function (event,group) {
                var ele=event.target;
                while(ele.className.indexOf("row")==-1)
                {
                    ele=ele.parentNode;
                }
                var bTop=false;
                if(ele.timer)
                {
                    clearTimeout(ele.timer);
                    ele.timer=null;
                }
                if(ele.style.backgroundColor=="orange")
                {
                    bTop=true;
                }
                ele.style.backgroundColor="white";
                event.preventDefault();
                if(event.dataTransfer.getData("text"))
                {
                    var obj=JSON.parse(event.dataTransfer.getData("text"));
                    if(!obj.id)
                    {
                        return;
                    }
                    if((group._id==obj.group && !bTop) || group._id==obj.id)
                    {
                        return;
                    }
                    else if(bTop && !obj.group)
                    {
                        $.tip("已经是最外层分组了!",0);
                        return;
                    }
                    else if(group.type==1 && obj.folder)
                    {
                        this.removeGroup({
                            _id:obj.id
                        });
                        return;
                    }
                    else
                    {
                        if(obj.folder)
                        {
                            var ret=[];
                            (function _map(arr) {
                                for(var i=0;i<arr.length;i++)
                                {
                                    var obj=arr[i];
                                    if(obj.data)
                                    {
                                        ret.push(obj._id);
                                        if(obj._id==group._id)
                                        {
                                            return true;
                                        }
                                        else
                                        {
                                            var v=arguments.callee(obj.data);
                                            if(v)
                                            {
                                                return true;
                                            }
                                            else
                                            {
                                                ret.pop();
                                            }
                                        }
                                    }
                                }
                                return false;
                            })(this.$store.state.interfaceList)
                            if(ret.indexOf(obj.id)>-1)
                            {
                                $.tip("不能移动到子分组内！",0);
                                return;
                            }
                        }
                    }
                    $.startHud("#body");
                    this.$store.dispatch("move",{
                        obj:obj,
                        group:group,
                        top:(bTop && obj.group)
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("移动成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                }
            },
            copy:function (item) {
                this.$store.dispatch("copy",{
                    item:this.parent,
                    item1:item
                }).then(function (data) {
                    if(data.code==200)
                    {
                        $.notify("复制成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            paste:function (item) {
                if(this.objCopy)
                {
                    this.objCopy.group._id=item._id
                    this.objCopy=$.clone(this.objCopy);
                    this.$store.dispatch("add",{
                        item:this.objCopy,
                        id:null
                    })
                    this.objCopy=null;
                    $.notify("粘贴完成，请修改后保存",1);
                }
            },
            importInterface:function (item) {
                $.inputMul(this,"请输入DOClever导出接口的JSON",function (val) {
                    if(!val)
                    {
                        $.tip("请输入JSON",0);
                        return false;
                    }
                    $.startHud();
                    net.post("/interface/importjson",{
                        group:item._id,
                        json:val
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("导入成功",1);
                            var o={
                                _id:data.data._id,
                                name:data.data.name,
                                method:data.data.method,
                                finish:data.data.finish,
                                select:0
                            }
                            item.data.push(o)
                            item.show=1;
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            exportGroup:function (item) {
                var type=navigator.userAgent;
                if(type.indexOf("Firefox")>-1)
                {
                    window.open(location.protocol+"//"+location.host+"/group/exportjson?group="+item._id);
                }
                else
                {
                    var link=document.createElement("a");
                    link.href="/group/exportjson?group="+item._id;
                    link.download=item.name+".json";
                    link.click();
                }
            },
            exportInterface:function (item) {
                var type=navigator.userAgent;
                if(type.indexOf("Firefox")>-1)
                {
                    window.open(location.protocol+"//"+location.host+"/interface/exportjson?id="+item._id);
                }
                else
                {
                    var link=document.createElement("a");
                    link.href="/interface/exportjson?id="+item._id;
                    link.download=item.name+".json";
                    link.click();
                }
            },
            addGroup:function (item) {
                var _this=this;
                $.input("请输入分组名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入分组名称",0);
                        return false
                    }
                    var query={};
                    query.id=session.get("projectId");
                    query.name=val.value;
                    query.parent=item._id;
                    $.startHud("#body");
                    _this.$store.dispatch("addGroup",{
                        query:query,
                        group:item
                    }).then(function (data) {
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
            importGroup:function (item) {
                var _this=this;
                $.inputMul(this,"请输入DOClever导出分组的JSON",function (val) {
                    if(!val)
                    {
                        $.tip("请输入JSON",0);
                        return false;
                    }
                    $.startHud();
                    net.post("/group/importjson",{
                        id:session.get("projectId"),
                        json:val,
                        group:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("导入成功",1);
                            _this.$store.commit("initInterfaceList",data.data);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                })
            }
        }
    }
</script>
