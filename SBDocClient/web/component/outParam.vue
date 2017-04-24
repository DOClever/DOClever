<template>
    <el-row class="row" style="cursor: pointer;height: 100%">
        <table width="100%" style="border-spacing: 0">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle;cursor: move;height: 50px;line-height: 50px" :draggable="item.drag?item.drag:'false'" @dragover="dragOver($event,item)" @dragleave="dragLeave($event,item)" @drop="drop($event,item,arr)" @dragstart="dragStart($event,item,index,arr)" @dragend="dragEnd($event)">
                    <td :style="{width: '30%',verticalAlign: 'middle',paddingLeft:level*20+'px'}">
                        <el-col class="col" :span="2" v-if="(item.type==4 || item.type==3)" @click.native="toggle(item)">
                            <span :class="item.show?'el-icon-caret-bottom':'el-icon-caret-right'" style="color:#c7c7c7 "></span>
                        </el-col>
                        <el-col class="col" :span="2" v-else>
                            &nbsp;
                        </el-col>
                        <el-col class="col" :span="22">
                            <el-input style="width: 90%;" placeholder="请填写名称" v-model="item.name" v-if="item.name!=null && (level!=0 || type!=1)" @focus="focus(item)" @blur="blur(item)"></el-input>
                            <el-input style="width: 90%;" placeholder="该字段没有名称" disabled v-else></el-input>
                        </el-col>
                    </td>
                    <td style="width: 14%">
                        <el-select v-model="item.type" style="width: 90%" @input="changeType(item)">
                            <el-option :value="0" label="String"></el-option>
                            <el-option :value="1" label="Number"></el-option>
                            <el-option :value="2" label="Boolean"></el-option>
                            <el-option :value="3" label="Array"></el-option>
                            <el-option :value="4" label="Object"></el-option>
                            <el-option :value="5" label="Mixed"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 8%">
                        <span style="display: inline-block;">
                            <el-checkbox v-model="item.must" :true-label="1" :false-label="0">必有</el-checkbox>
                        </span>
                    </td>
                    <td style="width: 18%">
                        <el-input type="textarea" style="width: 90%;height: 46px;line-height: 46px" resize="none" :rows="0" placeholder="请填写备注;" v-model="item.remark" @focus="focus(item)" @blur="blur(item)"></el-input>
                    </td>
                    <td style="width: 20%">
                        <el-input type="textarea" style="width: 90%;height: 46px;line-height: 46px" resize="none" :rows="0" placeholder="请填写Mock数据;" v-model="item.mock" v-if="item.type!=4" @focus="focus(item)" @blur="blur(item)"></el-input>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" icon="close" style="color: red;font-size: 15px" @click="remove(item,index,level)" size="small"></el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" style="font-size: 15px" icon="plus" size="small"  @click="add(arr)" v-if="(item.type==2 || item.type==5)"></el-button>
                        <template v-else-if="item.type==0 || item.type==1">
                            <el-button type="text" style="font-size: 15px" icon="plus" size="small"  @click="add(arr)" v-if="!statusExist"></el-button>
                            <el-dropdown v-else>
                                <el-button type="text" icon="plus" size="small" style="font-size: 15px">
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="add(arr)">兄弟节点</el-dropdown-item>
                                    <el-dropdown-item @click.native="editStatus(item)">{{statusValid(item)?"修改状态码":"绑定状态码"}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-dropdown v-else>
                            <el-button type="text" icon="plus" size="small" style="font-size: 15px">
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="add(arr)">兄弟节点</el-dropdown-item>
                                <el-dropdown-item @click.native="addChild(item)">子节点</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </td>
                </tr>
                <tr v-if="(item.type==4 || item.type==3) && (item.data && item.data.length>0) && item.show">
                    <td colspan="7" style="width: 100%;margin:0;padding: 0 ">
                        <outparam :source="item.data" :le="level+1" :parent="item"></outparam>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>

<script>
    var dragArr=null,dragItem=null;
    module.exports={
        name:"outparam",
        props:["source","le","parent"],
        data:function () {
            return {
                level:this.le?this.le:0,
            }
        },
        computed:{
            arr:function () {
                return this.source?this.source:this.$store.state.result
            },
            statusExist:function () {
                return (this.$store.state.status && this.$store.state.status.length>0)?true:false;
            },
            type:function () {
                return this.$store.state.outInfo.jsonType;
            }
        },
        methods:{
            remove:function (item,index,level) {
                if(item.type==3 || item.type==4)
                {
                    var _this=this;
                    $.confirm("该元素是"+(item.type==3?"Array":"Object")+"类型,是否确认删除！",function () {
                        _remove.call(_this,index,level);
                    })
                }
                else
                {
                    _remove.call(this,index,level);
                }
                function _remove(index,level) {
                    if(this.arr.length==1 && level==0)
                    {
                        this.arr[0].name="";
                        this.arr[0].must=0;
                        this.arr[0].remark="";
                        this.arr[0].type=0;
                        this.arr[0].show=0;
                        this.arr[0].mock="";
                        this.arr[0].drag=1;
                    }
                    else
                    {
                        this.arr.splice(index,1)
                    }
                }

            },
            toggle:function (item) {
                item.show=Number(!item.show);
            },
            add:function (arr) {
                arr.push({
                    name:(this.parent && this.parent.type==3)?null:"",
                    must:1,
                    type:0,
                    remark:"",
                    show:1,
                    mock:"",
                    drag:1
                })
            },
            addChild:function(item)
            {
                if(!item.data)
                {
                    this.$set(item,"data",[]);
                }
                item.data.push({
                    name:item.type==4?"":null,
                    must:1,
                    type:0,
                    remark:"",
                    show:1,
                    mock:"",
                    drag:1
                })
                item.show=1
            },
            changeType:function (item) {
                if(item.type==4 || item.type==3)
                {
                    if(!item.data)
                    {
                        this.$set(item,"data",[]);
                    }
                    else
                    {
                        item.data=[];
                    }
                    item.show=0;
                }
                else
                {
                    delete item.data
                }
            },
            dragStart:function (event,item,index,arr) {
                if(event.target.tagName.toLowerCase()=="input" || event.target.tagName.toLowerCase()=="textarea")
                {
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text", JSON.stringify({
                    item:item,
                    index:index
                }));
                dragArr=arr;
                dragItem=item;
            },
            dragOver:function (event,item) {
                if(item.type==3 || item.type==4)
                {
                    var ele=event.target;
                    while(ele.tagName.toLowerCase()!="tr")
                    {
                        ele=ele.parentNode;
                    }
                    if(this.level==0)
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
                }
                event.preventDefault();
                return true;
            },
            dragLeave:function (event,item) {
                if(item.type==3 || item.type==4)
                {
                    var ele=event.target;
                    while(ele.tagName.toLowerCase()!="tr")
                    {
                        ele=ele.parentNode;
                    }
                    ele.style.backgroundColor="white";
                    if(ele.timer)
                    {
                        clearTimeout(ele.timer);
                        ele.timer=null;
                    }
                }
            },
            drop:function (event,item,arr) {
                event.preventDefault();
                if(item.type==3 || item.type==4)
                {
                    var ele=event.target;
                    while(ele.tagName.toLowerCase()!="tr")
                    {
                        ele=ele.parentNode;
                    }
                    if(ele.timer)
                    {
                        clearTimeout(ele.timer);
                        ele.timer=null;
                    }
                    if(event.dataTransfer.getData("text"))
                    {
                        var obj=JSON.parse(event.dataTransfer.getData("text"));
                        if(!obj.item || !obj.item.name)
                        {
                            if(obj.item && !obj.item.name)
                            {
                                $.tip("名字为空的元素不允许拖动!",0);
                            }
                            ele.style.backgroundColor="white";
                            return false;
                        }
                        if(ele.style.backgroundColor=="orange")
                        {
                            if(this.arr.indexOf(dragItem)>-1)
                            {
                                $.tip("已经是顶部元素了!",0);
                                ele.style.backgroundColor="white";
                                return false;
                            }
                            dragArr.splice(obj.index,1);
                            this.arr.push(obj.item);
                        }
                        else
                        {
                            if(item.data.indexOf(dragItem)>-1)
                            {
                                $.tip("已经是直接父子元素关系了!",0);
                                ele.style.backgroundColor="white";
                                return false;
                            }
                            var objFind={
                                find:false
                            };
                            this.handleDragItem(dragItem,item,objFind);
                            if(!objFind.find)
                            {
                                dragArr.splice(obj.index,1);
                                item.data.push(obj.item);
                                item.show=1;
                                if(item.type==3)
                                {
                                    obj.item.name=null;
                                }
                            }
                            else
                            {
                                $.tip("不允许拖动子元素内!",0);
                            }
                        }
                    }
                    ele.style.backgroundColor="white";
                }
                return false;
            },
            dragEnd:function () {
                dragArr=null;
                dragItem=null;
            },
            handleDragItem:function (item,item1,obj) {
                if(item==item1)
                {
                    obj.find=true;
                }
                else if(item.type==3 || item.type==4)
                {
                    for(var i=0;i<item.data.length;i++)
                    {
                        this.handleDragItem(item.data[i],item1,obj)
                    }
                }
            },
            focus:function (item) {
                item.drag=0;
            },
            blur:function (item) {
                item.drag=1;
            },
            editStatus:function (item) {
                if(!item.status)
                {
                    Vue.set(item,"status","");
                }
                var child=$.showBox(this,"chooseStatus",{
                    status:item.status
                });
                child.$on("save",function (data) {
                    item.status=data;
                })
            },
            statusValid:function (item) {
                if(!item.status)
                {
                    return false;
                }
                else
                {
                    var bFind=false;
                    this.$store.state.status.forEach(function (obj) {
                        if(obj.id==item.status)
                        {
                            bFind=true;
                        }
                    })
                    if(bFind)
                    {
                        return item.status;
                    }
                    else
                    {
                        item.status="";
                        return ""
                    }
                }
            }
        }
    }
</script>
