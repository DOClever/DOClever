<template>
    <el-row class="row" style="cursor: pointer;white-space: nowrap;background-color: white" id="docTree">
        <template v-for="(item,index) in group">
            <el-row class="row" :draggable="true" style="height: 35px;line-height: 35px;white-space: nowrap" @dragover.native="dragOver($event,item)" @dragleave.native="dragLeave($event)" @dragenter.native="dragEnter($event,item)" @drop.native="drop($event,item,index)" @dragend.native="dragEnd($event)" :key="item._id" v-if="level==0 || (item.childDoc && parent.show)" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}" @dragstart.native="dragStart($event,item,index)">
                <template v-if="level>0">
                    <el-col :span="2" class="col" v-for="n in level" :style="{'borderRight':'1px lightgray dashed'}">
                        &nbsp;
                    </el-col>
                </template>
                <el-col class="col" :span="4" style="text-align: center;white-space: nowrap" @click.native="item.show=!item.show">
                    <span :class="item.show?'fa fa-folder-open':'fa fa-folder'" style="color:#c7c7c7;font-size: 13px "></span>
                </el-col>
                <el-col class="col" :span="20-2*level" :style="{margin: 0,fontSize: '14px',color: 'gray',whiteSpace: 'nowrap',padding: 0,textOverflow:'ellipsis',overflow:'hidden',textDecoration:item.delete?'line-through':'none'}" @click.native="item.show=!item.show" :title="item.name">
                    {{item.name}}
                </el-col>
                <div class="col" style="height: 35px;white-space: nowrap;text-align: center;position: absolute;top: 0px;right: 0px;" v-show="item.menu">
                    <el-dropdown style="height: 100%;cursor: pointer;float: right;margin-right: 3px">
                        <div class="el-dropdown-link">
                            <i class="el-icon-more" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 3px;color:#17B9E6;background-color: white;font-weight: 900 "></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><div @click="addGroup(item)">新建分组</div></el-dropdown-item>
                            <el-dropdown-item><div @click="renameGroup(item)">重命名</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div style="height: 35px;line-height: 35px;display: inline-block;margin-right: 3px;float: right;">
                        <i class="el-icon-delete" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 3px;color:red;background-color: white;font-weight: 900" @click="removeGroup(item)" title="删除分组"></i>
                    </div>
                    <div style="height: 35px;line-height: 35px;display: inline-block;margin-right: 3px;float: right;">
                        <i class="el-icon-plus" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 3px;color:#17B9E6;background-color: white;font-weight: 900" @click="addDoc(item)" title="新建文档"></i>
                    </div>
                </div>
            </el-row>
            <el-collapse-transition>
                <docgrouplist v-if="item.show" :level="level+1" :group="item.childGroup" :doc="item.childDoc" :parent="item"></docgrouplist>
            </el-collapse-transition>
        </template>
        <template v-for="(item,index) in doc">
            <el-row class="row" :draggable="true" style="height: 35px;line-height: 35px;" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" @click.native="info(item,index,$event)" :section="index" :row="index" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}" @dragstart.native="dragStart($event,item,index)" @dragenter.native="dragEnter($event,item)" @dragover.native="dragOver($event,item)" @dragleave.native="dragLeave($event)" @drop.native="drop($event,item,index)" @dragend.native="dragEnd($event)" :key="item._id" v-if="parent.show">
                <template v-if="level>0">
                    <el-col :span="2" class="col" v-for="n in level" :style="{'borderRight':'1px lightgray dashed'}">
                        &nbsp;
                    </el-col>
                </template>
                <el-col class="col" :span="4" style="text-align: center">
                    <i class="el-icon-document"></i>
                </el-col>
                <el-col class="col" :span="20-2*level" :style="{fontSize:'14px',margin: 0,color:item.select?'white':'gray',lineHeight:'35px',textOverflow:'ellipsis',overflow:'hidden'}" name="treeName" :title="item.name">
                    {{item.name}}
                </el-col>
                <div class="col" style="margin: 0;height: 35px;white-space: nowrap;text-align: center;position: absolute;top: 0px;right: 0px;width: 40px" v-show="item.menu">
                    <div style="height: 35px;line-height: 35px;display: inline-block;margin-right: 3px;float: right;">
                        <el-dropdown style="height: 100%;cursor: pointer;float: right;margin-right: 3px">
                            <div class="el-dropdown-link">
                                <i class="el-icon-more" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 3px;color:#17B9E6;background-color: white;font-weight: 900 "></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><div @click="removeDoc(item,index)">删除</div></el-dropdown-item>
                                <el-dropdown-item><div @click="renameDoc(item,index)">重命名</div></el-dropdown-item>
                                <el-tooltip class="item" effect="dark" :content="docInfo(item)" placement="right">
                                    <el-dropdown-item><div>信息</div></el-dropdown-item>
                                </el-tooltip>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-row>
        </template>
    </el-row>
</template>

<script>
    var dragItem=null,lastEle=null;
    var sessionChange=require("common/mixins/session");
    module.exports={
        name:"docgrouplist",
        props:{
            level:{
                type:Number,
                default:0
            },
            group:Array,
            doc:{
                type:Array,
                default:[]
            },
            parent:Object
        },
        data:function () {
            return {

            }
        },
        mixins:[sessionChange],
        computed:{

        },
        methods:{
            docInfo:function (item) {
                return item.owner.name+"在"+item.createdAt+"创建，"+item.editor.name+"在"+item.updatedAt+"修改"
            },
            mouseEnter:function (event,item) {
                item.menu=1;
            },
            mouseLeave:function (event,item) {
                item.menu=0;
            },
            methodColor:function (m) {
                return helper.methodColor(m);
            },
            renameGroup:function (item) {
                var _this=this;
                $.input("请输入重命名的名称",function (val) {
                    if(val.value==="")
                    {
                        $.tip("请输入重命名的名称",0);
                        return
                    }
                    var query={
                        item:item,
                        name:val.value,
                        parent:_this.parent
                    }
                    $.startHud();
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
                    $.startHud();
                    var query={
                        id:item._id
                    }
                    if(_this.parent)
                    {
                        query.parent=_this.parent
                    }
                    _this.$store.dispatch("removeGroup",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            removeDoc:function (item,index) {
                var _this=this;
                $.confirm("确定删除该文档？",function () {
                    _this.$store.dispatch("removeDoc",{
                        group:_this.parent,
                        index:index,
                        id:item._id
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            $.notify("删除成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            renameDoc:function (item) {
                var _this=this;
                $.input("请输入重命名的名称",function (val) {
                    if(val.value==="")
                    {
                        $.tip("请输入重命名的名称",0);
                        return
                    }
                    _this.$store.dispatch("renameDoc",{
                        item:item,
                        group:_this.parent._id,
                        name:val.value
                    }).then(function (data) {
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
            info:function (item,index,event) {
                if(this.$store.state.selItem && item._id==this.$store.state.selItem._id)
                {
                    return;
                }
                $.startHud();
                this.$store.dispatch("info",item).then(function (data) {
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
            addDoc:function (item) {
                var _this=this;
                $.input("请输入文档标题",function (val) {
                    if(val.value==="")
                    {
                        $.tip("请输入文档标题",0);
                        return
                    }
                    $.startHud();
                    _this.$store.dispatch("addDoc",{
                        name:val.value,
                        group:item
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("新建成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                    return true;
                })
            },
            dragStart:function (event,item,index) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text", JSON.stringify({
                    id:item._id,
                    group:this.parent?this.parent._id:"",
                    index:index,
                    folder:item.childDoc?1:0,
                    select:item.select?1:0
                }));
                dragItem=item;
                lastEle=null;
            },
            dragOver:function (event,item) {
                if(dragItem==item || !lastEle || (dragItem.childDoc && !item.childDoc))
                {
                    return;
                }
                var bound=lastEle.getBoundingClientRect();
                var top=event.clientY;
                var height=bound.bottom-bound.top;
                if(item.childDoc)
                {
                    if(top<bound.top+height/3)
                    {
                        lastEle.style.borderTop="2px #50bfff solid";
                        lastEle.style.borderBottom="";
                        lastEle.style.backgroundColor="white";
                    }
                    else if(top>bound.bottom-height/3)
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
                else
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
                        if(itemDrop._id==obj.id)
                        {
                            return;
                        }
                        var ret=[];
                        (function _map(arr) {
                            for(var i=0;i<arr.length;i++)
                            {
                                var obj=arr[i];
                                if(obj.childGroup)
                                {
                                    ret.push(obj._id);
                                    if(obj._id==itemDrop._id)
                                    {
                                        return true;
                                    }
                                    else
                                    {
                                        var v=arguments.callee(obj.childGroup);
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
                        })(this.$store.state.list)
                        if(ret.indexOf(obj.id)>-1)
                        {
                            $.tip("不能移动到子分组内！",0);
                            return;
                        }
                        var bIn;
                        if(itemDrop.childDoc && top>bound.top+height/3 && top<bound.bottom-height/3)
                        {
                            bIn=true;
                        }
                        else if(top<bound.top+height/2)
                        {
                            bIn=false;
                            if(obj.index<index && obj.parent==this.parent)
                            {
                                index--
                            }
                            if(!obj.folder && !this.parent)
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
                            if(!obj.folder && !this.parent)
                            {
                                $.tip("接口不可以移动到最外层！",0);
                                return;
                            }
                        }
                        $.startHud();
                        this.$store.dispatch("move",{
                            obj:obj,
                            group:bIn?(itemDrop.childDoc?itemDrop:this.parent):this.parent,
                            index:bIn?0:index,
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
            addGroup:function (item) {
                var _this=this;
                $.input("请输入分组名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入分组名称",0);
                        return false
                    }
                    var query={
                        name:val.value,
                        parent:item
                    }
                    $.startHud();
                    _this.$store.dispatch("addGroup",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("新建成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                });
            },
        }
    }
</script>
