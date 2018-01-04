<template>
    <el-row class="row" style="cursor: pointer;white-space: nowrap;background-color: white" id="tree">
        <template v-for="(item,index) in arr">
            <el-row class="row" :draggable="interfaceEditRole && ((item.type==0 && session.sort!=2) || session.sort==2)" style="height: 35px;line-height: 35px;white-space: nowrap" :id="item.type==1?'recycle':('group'+index)" @dragover.native="dragOver($event,item)" @dragleave.native="dragLeave($event)" @dragenter.native="dragEnter($event,item)" @drop.native="drop($event,item,index)" @dragend.native="dragEnd($event)" :key="item._id" v-if="level==0 || (item.data && parent.show)" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}" @dragstart.native="dragStart($event,item,index)">
                <template v-if="level>0">
                    <el-col :span="2" class="col" v-for="n in level" :style="{'borderRight':'1px lightgray dashed'}">
                        &nbsp;
                    </el-col>
                </template>
                <el-col class="col" :span="4" style="text-align: center;white-space: nowrap" @click.native="item.show=!item.show">
                    <span :class="item.show?'fa fa-folder-open':'fa fa-folder'" style="color:#c7c7c7;font-size: 13px "></span>
                </el-col>
                <el-col class="col" :span="20-2*level" :style="{margin: 0,fontSize: '14px',color: item.type==0?'gray':'red',whiteSpace: 'nowrap',padding: 0,textOverflow:'ellipsis',overflow:'hidden',textDecoration:item.delete?'line-through':'none'}" @click.native="item.show=!item.show" :title="item.name">
                    {{item.name}}({{item.data.length}})
                </el-col>
                <div class="col" style="height: 35px;white-space: nowrap;text-align: center;position: absolute;top: 0px;right: 0px;" v-show="item.menu && interfaceEditRole && !search">
                    <el-dropdown style="height: 100%;cursor: pointer;float: right;margin-right: 3px">
                        <div class="el-dropdown-link">
                            <i class="el-icon-more" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 3px;color:#17B9E6;background-color: white;font-weight: 900 "></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  v-if="item.type==0"><div @click="addGroup(item)">新建分组</div></el-dropdown-item>
                            <el-dropdown-item ><div @click="refresh">刷新</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0"><div @click="renameGroup(item)">重命名</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==1"><div @click="clear">清空</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0 && objCopy"><div @click="paste(item)">粘贴</div></el-dropdown-item>
                            <el-dropdown-item v-if="item.type==0"><div @click="importInterface(item)">导入接口</div></el-dropdown-item>
                            <el-dropdown-item v-if="item.type==0"><div @click="exportGroup(item)" >导出分组</div></el-dropdown-item>
                            <el-dropdown-item v-if="item.type==0"><div @click="importGroup(item)">导入分组</div></el-dropdown-item>
                            <el-dropdown-item v-if="item.type==0 && item.delete"><div @click="mergeGroup(item)" >合并</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div style="height: 35px;line-height: 35px;display: inline-block;margin-right: 3px;float: right;" v-if="interfaceEditRole">
                        <i class="el-icon-delete" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 3px;color:red;background-color: white;font-weight: 900" v-if="item.type==0" @click="removeGroup(item)" title="删除分组"></i>
                    </div>
                    <template v-if="interfaceEditRole && item.type==0">
                        <div style="height: 35px;line-height: 35px;display: inline-block;margin-right: 3px;float: right;" v-if="template.length==0">
                            <i class="el-icon-plus" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 3px;color:#17B9E6;background-color: white;font-weight: 900" @click="addInterface(item)" title="新建接口"></i>
                        </div>
                        <el-dropdown style="height: 100%;cursor: pointer;float: right;margin-right: 3px" v-else>
                            <div class="el-dropdown-link" style="height: 35px;line-height: 35px;display: inline-block;margin-right: 3px;float: right;">
                                <i class="el-icon-plus" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 3px;color:#17B9E6;background-color: white;font-weight: 900" title="新建接口"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><div @click="addInterface(item)">新接口</div></el-dropdown-item>
                                <el-dropdown-item><div @click="addInterfaceFromTemplate(item)">从模板创建</div></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </div>
            </el-row>
            <el-collapse-transition>
                <interfacelist v-if="item.data && item.data.length>0 && item.show" :level="level+1" :data="item.data" :parent="item"></interfacelist>
            </el-collapse-transition>
            <el-row class="row" :draggable="interfaceEditRole" style="height: 35px;line-height: 35px;cursor: move" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" @click.native="info(item,index,$event)" :section="index" :row="index" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}" @dragstart.native="dragStart($event,item,index)" @dragenter.native="dragEnter($event,item)" @dragover.native="dragOver($event,item)" @dragleave.native="dragLeave($event)" @drop.native="drop($event,item,index)" @dragend.native="dragEnd($event)" :key="item._id" v-if="!item.data && parent.show">
                <template v-if="level>0">
                    <el-col :span="2" class="col" v-for="n in level" :style="{'borderRight':'1px lightgray dashed'}">
                        &nbsp;
                    </el-col>
                </template>
                <el-col class="col" :span="4" :style="{fontSize: '13px',margin: 0,color:item.select?'white':methodColor(item.finish),padding:0,lineHeight:'35px','textAlign':'center',textDecoration:(parent.type==0 && item.delete)?'line-through':'none'}" name="treeMethod">
                    {{item.method=="DELETE"?"DEL":item.method}}
                </el-col>
                <el-col class="col" :span="20-2*level" :style="{fontSize:'14px',margin: 0,color:item.select?'white':'gray',lineHeight:'35px',textOverflow:'ellipsis',overflow:'hidden',textDecoration:item.delete?'line-through':'none'}" name="treeName" :title="item.name">
                    {{item.name}}
                </el-col>
                <div class="col" style="margin: 0;height: 35px;white-space: nowrap;text-align: center;position: absolute;top: 0px;right: 0px;width: 40px" v-show="item.menu">
                    <el-dropdown v-if="interfaceEditRole"  style="width: 100%;height: 100%;cursor: pointer">
                        <div class="el-dropdown-link">
                            <i class="el-icon-more" style="border: 1px lightgray solid;font-size: 12px;padding: 3px;color:#17B9E6;background-color: white;font-weight: 900 "></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="parent.type==0"><div @click="removeInterface(item)">删除</div></el-dropdown-item>
                            <el-dropdown-item><div @click="copy(item)">复制</div></el-dropdown-item>
                            <el-dropdown-item v-if="parent.type==1"><div @click="destroyInterface(item)">彻底删除</div></el-dropdown-item>
                            <el-dropdown-item><div @click="exportInterface(item)">导出接口</div></el-dropdown-item>
                            <el-dropdown-item v-if="parent.type==0 && item.delete"><div @click="mergeInterface(item)">合并</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-row>
        </template>
    </el-row>
</template>

<script>
    var dragItem=null,lastEle=null;
    var sessionChange=require("common/mixins/session");
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
            template:function () {
                return this.$store.getters.template;
            },
            interfaceEditRole:function () {
                return this.$store.getters.interfaceEditRole;
            },
            arr:function () {
                if(this.level==0)
                {
                    return this.$store.state.searchText?this.$store.state.interfaceSearchList:this.$store.state.interfaceList
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
                return this.$store.state.searchText
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
                var pro;
                if(this.$store.state.autoSave)
                {
                    if(this.$store.state.interfaceEdit && this.$store.state.interfaceEdit._id)
                    {
                        pro=this.$store.dispatch("save");
                    }
                    else
                    {
                        pro=helper.delay(0);
                    }
                }
                else
                {
                    pro=helper.delay(0);
                }
                var _this=this;
                pro.then(function () {
                    session.remove("snapshotId");
                    session.remove("snapshotDis");
                    session.remove("snapshotCreator");
                    session.remove("snapshotDate");
                    $.startLoading(2);
                    _this.$store.dispatch("info",{
                        item:_this.parent,
                        item1:item,
                        index:index
                    }).then(function (data) {
                        $.stopLoading()
                        if(data.code==200)
                        {

                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
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
                    folder:item.data?1:0,
                    trash:(item.data && item.type==1)?1:0,
                    select:item.select?1:0
                }));
                dragItem=item;
                lastEle=null;
            },
            dragOver:function (event,item) {
                if(dragItem==item || !lastEle || (dragItem.data && !item.data))
                {
                    return;
                }
                var bound=lastEle.getBoundingClientRect();
                var top=event.clientY;
                var height=bound.bottom-bound.top;
                if(item.data)
                {
                    if(top<bound.top+height/3 && session.get("sort")==2)
                    {
                        lastEle.style.borderTop="2px #50bfff solid";
                        lastEle.style.borderBottom="";
                        lastEle.style.backgroundColor="white";
                    }
                    else if(top>bound.bottom-height/3 && session.get("sort")==2)
                    {
                        lastEle.style.borderTop="";
                        lastEle.style.borderBottom="2px #50bfff solid";
                        lastEle.style.backgroundColor="white";
                    }
                    else
                    {
                        lastEle.style.borderTop="";
                        lastEle.style.borderBottom="";
                        lastEle.style.backgroundColor="rgb(223,236,191)";
                    }
                }
                else if(session.get("sort")==2)
                {
                    if(top<bound.top+(bound.bottom-bound.top)/2)
                    {
                        lastEle.style.borderTop="2px #50bfff solid";
                        lastEle.style.borderBottom="";
                    }
                    else
                    {
                        lastEle.style.borderTop="";
                        lastEle.style.borderBottom="2px #50bfff solid";
                    }
                }
                event.preventDefault();
                return true;
            },
            dragEnter:function (event,item) {
                if(dragItem==item)
                {
                    return;
                }
                var ele=event.target;
                while(ele.className.indexOf("row")==-1)
                {
                    ele=ele.parentNode;
                }
                if(lastEle && lastEle==ele)
                {
                    return true;
                }
                else if(lastEle && lastEle!=ele)
                {
                    lastEle.style.borderBottom="";
                    lastEle.style.borderTop="";
                    lastEle.style.backgroundColor="white";
                }
                lastEle=ele;
                console.log("enter"+item.name);
                return true;
            },
            dragLeave:function (event) {
                return true;
            },
            drop:function (event,itemDrop,index) {
                if(lastEle)
                {
                    var bTop=false;
                    if(!this.parent)
                    {
                        bTop=true;
                    }
                    lastEle.style.borderBottom="";
                    lastEle.style.borderTop="";
                    lastEle.style.backgroundColor="white";
                    event.preventDefault();
                    if(dragItem==itemDrop)
                    {
                        return false;
                    }
                    var bound=lastEle.getBoundingClientRect();
                    var top=event.clientY;
                    var height=bound.bottom-bound.top;
                    if(event.dataTransfer.getData("text"))
                    {
                        var obj=JSON.parse(event.dataTransfer.getData("text"));
                        if(!obj.id)
                        {
                            return;
                        }
                        if(session.get("sort")!=2)
                        {
                            if((itemDrop._id==obj.group && !bTop) || itemDrop._id==obj.id)
                            {
                                return;
                            }
                            else if(bTop && !obj.group)
                            {
                                $.tip("已经是最外层分组了!",0);
                                return;
                            }
                            else if(itemDrop.type==1 && obj.folder)
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
                                                if(obj._id==itemDrop._id)
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
                                group:itemDrop,
                                top:(bTop && obj.group),
                                index:0
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
                        else
                        {
                            if(itemDrop._id==obj.id)
                            {
                                return;
                            }
                            var ret=[];
                            (function _map(arr) {
                                for(var i=0;i<arr.length;i++)
                                {
                                    var obj=arr[i];
                                    if(obj.data)
                                    {
                                        ret.push(obj._id);
                                        if(obj._id==itemDrop._id)
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
                            var bIn;
                            if(itemDrop.data && top>bound.top+height/3 && top<bound.bottom-height/3)
                            {
                                bIn=true;
                                if(itemDrop.type==1 && obj.folder)
                                {
                                    this.removeGroup({
                                        _id:obj.id
                                    });
                                    return;
                                }
                                else if(obj.trash)
                                {
                                    $.tip("回收站不能移动到其他分组内！",0);
                                    return;
                                }
                            }
                            else if(top<bound.top+height/2)
                            {
                                bIn=false;
                                if(obj.index<index && obj.parent==this.parent)
                                {
                                    index--
                                }
                                if(this.parent && this.parent.type==1 && obj.folder)
                                {
                                    this.removeGroup({
                                        _id:obj.id
                                    });
                                    return;
                                }
                                else if(obj.trash && this.parent)
                                {
                                    $.tip("回收站不能移动到其他分组内！",0);
                                    return;
                                }
                                else if(!obj.folder && !this.parent)
                                {
                                    $.tip("接口不可以移动到最外层！",0);
                                    return;
                                }
                            }
                            else
                            {
                                bIn=false;
                                if(obj.index<index && ((obj.group=="" && this.parent==undefined) || (this.parent && obj.group==this.parent._id)))
                                {

                                }
                                else
                                {
                                    index++;
                                }
                                if(this.parent && this.parent.type==1 && obj.folder)
                                {
                                    this.removeGroup({
                                        _id:obj.id
                                    });
                                    return;
                                }
                                else if(obj.trash && this.parent)
                                {
                                    $.tip("回收站不能移动到其他分组内！",0);
                                    return;
                                }
                                else if(!obj.folder && !this.parent)
                                {
                                    $.tip("接口不可以移动到最外层！",0);
                                    return;
                                }
                            }
                            $.startHud("#body");
                            this.$store.dispatch("move",{
                                obj:obj,
                                group:bIn?(itemDrop.data?itemDrop:this.parent):this.parent,
                                index:index,
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
                    }
                    lastEle=null;
                }
                return false;
            },
            dragEnd:function () {
                dragItem=null;
                if(lastEle)
                {
                    lastEle.style.borderBottom="";
                    lastEle.style.borderTop="";
                    lastEle.style.backgroundColor="white";
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
            },
            mergeGroup:function (item) {
                var _this=this;
                $.confirm("是否确认该分组的合并",function () {
                    $.startHud();
                    _this.$store.dispatch("mergeGroup",item._id).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("合并成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            mergeInterface:function (item) {
                var _this=this;
                $.confirm("是否确认该接口的合并",function () {
                    $.startHud();
                    _this.$store.dispatch("mergeInterface",item._id).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("合并成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            addInterfaceFromTemplate:function (item) {
                $.showBox(this,require("./chooseTemplate.vue"),{
                    groupId:item._id
                })
            }
        }
    }
</script>
