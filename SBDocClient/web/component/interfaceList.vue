<template>
    <el-row class="row" style="cursor: pointer;border: 1px white solid;white-space: nowrap" id="tree">
        <template v-for="(item,index) in arr">
            <el-row class="row" style="height: 40px;line-height: 40px;border-bottom: 0.5px gray solid;white-space: nowrap" :id="item.type==1?'recycle':('group'+index)" @dragover.native="dragOver($event)" @dragleave.native="dragLeave($event)" @drop.native="drop($event,item)">
                <el-col class="col" :span="4" style="font-size: large;text-align: center;white-space: nowrap" @click.native="item.show=!item.show">
                    <span :class="item.show?'el-icon-caret-bottom':'el-icon-caret-right'" style="color:#c7c7c7 "></span>
                </el-col>
                <el-col class="col" :span="12" :style="{margin: 0,fontSize: 'larger',color: item.type==0?'#20A0FF':'red',whiteSpace: 'nowrap',padding: 0,textOverflow:'ellipsis',overflow:'hidden'}" @click.native="item.show=!item.show">
                    {{item.name}}({{item.data.length}})
                </el-col>
                <el-col class="col" :span="4" style="height: 40px;white-space: nowrap" @click.native="item.show=!item.show">

                </el-col>
                <el-col class="col" :span="4" style="height: 40px;white-space: nowrap;text-align: center">
                    <el-dropdown trigger="click" v-if="session.role==0 && !search"  style="width: 100%;height: 100%;cursor: pointer">
                        <div class="el-dropdown-link">
                            <i class="el-icon-more"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  v-if="item.type==0"><div @click="addInterface(item)">新建接口</div></el-dropdown-item>
                            <el-dropdown-item ><div @click="refresh">刷新</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0"><div @click="renameGroup(item)">重命名</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0"><div @click="removeGroup(item)">删除</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==1"><div @click="clear">清空</div></el-dropdown-item>
                            <el-dropdown-item  v-if="item.type==0 && objCopy"><div @click="paste(item)">粘贴</div></el-dropdown-item>
                            <el-dropdown-item ><div @click="importInterface(item)" v-if="item.type==0">导入接口</div></el-dropdown-item>
                            <el-dropdown-item ><div @click="exportGroup(item)" v-if="item.type==0">导出分组</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
            <template v-for="(item1,index1) in item.data">
                <el-row class="row" :draggable="session.role==0" style="height: 40px;line-height: 40px;cursor: move" v-if="item.show" @mouseenter.native="mouseEnter($event,item1)" @mouseleave.native="mouseLeave($event,item1)" @click.native="info(item,item1,index1,$event)" :section="index" :row="index1" :style="{backgroundColor:item1.select?'#20A0FF':''}" @dragstart.native="dragStart($event,item1,item,index1)">
                    <el-col class="col" :span="2" style="height: 40px;line-height: 40px;text-align: right">
                        <span class="fa fa-check" style="color: #13ce66;display: inline-block;" v-if="item1.finish"></span>
                        <span v-else>&nbsp;</span>
                    </el-col>
                    <el-col class="col" :span="5" :style="{fontSize: 'small',margin: 0,color:methodColor(item1.method),padding:0,textAlign:'center',lineHeight:'40px'}" name="treeMethod">
                        {{item1.method}}
                    </el-col>
                    <el-col class="col" :span="11" :style="{margin: 0,color: '#20A0FF',color:item1.select?'white':'#20A0FF',lineHeight:'40px',textOverflow:'ellipsis',overflow:'hidden'}" name="treeName">
                        {{item1.name}}
                    </el-col>
                    <el-col class="col" :span="6" style="margin: 0;height: 40px;text-align: center">
                        <el-dropdown trigger="click" v-if="session.role==0"  style="width: 100%;height: 100%;cursor: pointer">
                            <div class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="item.type==0"><div @click="removeInterface(item1)">删除</div></el-dropdown-item>
                                <el-dropdown-item><div @click="copy(item,item1)">复制</div></el-dropdown-item>
                                <el-dropdown-item v-if="item.type==1"><div @click="destroyInterface(item1)">彻底删除</div></el-dropdown-item>
                                <el-dropdown-item><div @click="exportInterface(item1)">导出接口</div></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </template>
        </template>
    </el-row>
</template>

<script>
    module.exports={
        data:function () {
            return {
                session:$.clone(session.raw()),
            }
        },
        computed:{
            arr:function () {
                return this.$store.state.search?this.$store.state.interfaceSearchList:this.$store.state.interfaceList
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
                if(!item.select)event.target.style.backgroundColor='rgb(247,246,242)'
            },
            mouseLeave:function (event,item) {
                if(!item.select)event.target.style.backgroundColor=''
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
            info:function (item,item1,index,event) {
                if(event.target.getAttribute("name")!="treeMethod" && event.target.getAttribute("name")!="treeName")
                {
                    return;
                }
                $.startHud("#body");
                this.$store.dispatch("info",{
                    item:item,
                    item1:item1,
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
                this.$store.dispatch("add",{
                    item:null,
                    id:item._id
                })
            },
            dragStart:function (event,item,group,index) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text", JSON.stringify({
                    id:item._id,
                    group:group._id,
                    index:index
                }));
            },
            dragOver:function (event) {
                var ele=event.target;
                while(ele.className.indexOf("row")==-1)
                {
                    ele=ele.parentNode;
                }
                ele.style.backgroundColor="rgb(223,236,191)";
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
            },
            drop:function (event,group) {
                var ele=event.target;
                while(ele.className.indexOf("row")==-1)
                {
                    ele=ele.parentNode;
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
                    if(group._id==obj.group)
                    {
                        return;
                    }
                    $.startHud("#body");
                    this.$store.dispatch("move",{
                        obj:obj,
                        group:group
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
            copy:function (item,item1) {
                this.$store.dispatch("copy",{
                    item:item,
                    item1:item1
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
                $.inputMul(this,"请输入SBDoc导出接口的JSON",function (val) {
                    if(!val)
                    {
                        $.tip("请输入JSON",0);
                        return false;
                    }
                    $.startHud();
                    net.post("/interface/importjson",{
                        id:item._id,
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
                var link=document.createElement("a");
                link.href="/group/exportjson?group="+item._id;
                link.download=item.name+".json";
                link.click();
            },
            exportInterface:function (item) {
                var link=document.createElement("a");
                link.href="/interface/exportjson?id="+item._id;
                link.download=item.name+".json";
                link.click();
            }
        }
    }
</script>
