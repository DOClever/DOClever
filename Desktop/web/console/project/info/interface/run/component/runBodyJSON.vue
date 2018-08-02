<template>
    <el-row class="row" style="cursor: pointer;height: 100%">
        <table width="100%" style="border-spacing: 0;border-collapse: collapse">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle;cursor: move;height: 50px;line-height: 50px" :draggable="item.drag?item.drag:'false'" @dragover="dragOver($event,item)" @dragleave="dragLeave($event,item)" @dragenter="dragEnter($event,item)" @drop="drop($event,item,index,arr)" @dragstart="dragStart($event,item,index,arr)" @dragend="dragEnd($event)">
                    <td :style="{width: '30%',verticalAlign: 'middle',paddingLeft:level*20+'px'}">
                        <el-col class="col" :span="2" v-if="(item.type==4 || item.type==3)" @click.native="toggle(item)">
                            <span :class="item.show?'el-icon-caret-bottom':'el-icon-caret-right'" style="color:#c7c7c7 "></span>
                        </el-col>
                        <el-col class="col" :span="2" v-else>
                            &nbsp;
                        </el-col>
                        <el-col class="col" :span="22">
                            <el-input size="small" style="width: 90%;" placeholder="请填写名称" v-model.trim="item.name" v-if="item.name!=null && (level!=0 || type!=1)" @focus="focus(item)" @blur="blur(item)"></el-input>
                            <el-input size="small" style="width: 90%;" placeholder="该字段没有名称" disabled v-else></el-input>
                        </el-col>
                    </td>
                    <td style="width: 14%">
                        <el-select size="small" v-model="item.type" style="width: 90%" @input="changeType(item)">
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
                    <td style="width: 18%;line-height: normal;">
                        {{item.remark?item.remark:"无备注"}}
                    </td>
                    <td style="width: 20%">
                        <el-autocomplete size="small" class="inline-input" v-model="item.mock" :fetch-suggestions="querySearch" placeholder="选择或者填入你的值" @mouseenter.native="focusAuto(item)" @mouseleave.native="blur(item)" style="width:100%" popper-class="my-autocomplete" v-if="item.type!=3 && item.type!=4 && (item.value && (item.value.data.length>0 || item.value.status))">
                            <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete" style="cursor: pointer"></i>
                            <template slot-scope="props">
                                <div class="value">{{ props.item.value }}</div>
                                <span class="remark">{{ props.item.remark }}</span>
                            </template>
                        </el-autocomplete>
                        <el-input size="small" placeholder="请填写值" v-model="item.mock" v-else-if="item.type!=3 && item.type!=4 && (!item.value || (item.value.data.length==0 && !item.value.status))" @focus="focus(item)" @blur="blur(item)"></el-input>
                    </td>
                    <td style="width: 5%">
                        <el-button size="mini" type="text" icon="el-icon-close" style="color: red;font-size: 15px" @click="remove(item,index,level)"></el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" style="font-size: 15px" icon="el-icon-plus" size="mini"  @click="add(arr)" v-if="(item.type==0 || item.type==1 || item.type==2 || item.type==5)"></el-button>
                        <el-dropdown v-else>
                            <el-button type="text" icon="el-icon-plus" size="mini" style="font-size: 15px">
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
                        <runparambodyjson :source="item.data" :le="level+1" :parent="item"></runparambodyjson>
                    </td>
                </tr>
            </template>
        </table>
    </el-row>
</template>

<script>
    var dragArr=null,dragItem=null,lastEle=null;
    module.exports={
        name:"runparambodyjson",
        props:["source","le","parent","index","data"],
        data:function () {
            return {
                level:this.le?this.le:0,
                itemSel:null,
            }
        },
        computed:{
            arr:function () {
                return this.source?this.source:(this.data?this.data.bodyInfo.rawJSON:[])
            },
            type:function () {
                return this.data.bodyInfo.rawJSONType;
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
                    name:((this.parent && this.parent.type==3) || (this.level==0 && this.type==1))?null:"",
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
                if(dragItem==item || !lastEle)
                {
                    return;
                }
                var bound=lastEle.getBoundingClientRect();
                var top=event.clientY;
                var height=bound.bottom-bound.top;
                if(item.type==3 || item.type==4)
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
                while(ele.tagName.toLowerCase()!="tr")
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
            dragLeave:function (event,item) {
                return true;
            },
            drop:function (event,item,index,arr) {
                if(lastEle)
                {
                    lastEle.style.borderBottom="";
                    lastEle.style.borderTop="";
                    lastEle.style.backgroundColor="white";
                    event.preventDefault();
                    if(dragItem==item)
                    {
                        return false;
                    }
                    var bound=lastEle.getBoundingClientRect();
                    var top=event.clientY;
                    var height=bound.bottom-bound.top;
                    if(event.dataTransfer.getData("text"))
                    {
                        var obj=JSON.parse(event.dataTransfer.getData("text"));
                        if(obj.item.name===null)
                        {
                            obj.item.name="";
                        }
                        if((item.type==3 || item.type==4) && top>bound.top+height/3 && top<bound.bottom-height/3)
                        {
                            if(item.data.indexOf(dragItem)>-1)
                            {
                                $.tip("已经是直接父子元素关系了!",0);
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
                                $.tip("不允许拖动到子元素内!",0);
                            }
                        }
                        else if(top<bound.top+height/2)
                        {
                            if(dragArr==arr)
                            {
                                if(index>obj.index)
                                {
                                    arr.splice(obj.index,1);
                                    arr.splice(index-1,0,obj.item);
                                }
                                else
                                {
                                    arr.splice(obj.index,1);
                                    arr.splice(index,0,obj.item);
                                }
                            }
                            else
                            {
                                dragArr.splice(obj.index,1);
                                arr.splice(index,0,obj.item);
                            }
                        }
                        else
                        {
                            if(dragArr==arr)
                            {
                                if(index>obj.index)
                                {
                                    arr.splice(obj.index,1);
                                    arr.splice(index,0,obj.item);
                                }
                                else
                                {
                                    arr.splice(obj.index,1);
                                    arr.splice(index+1,0,obj.item);
                                }
                            }
                            else
                            {
                                dragArr.splice(obj.index,1);
                                arr.splice(index+1,0,obj.item);
                            }
                        }
                    }
                    lastEle=null;
                }
                return false;
            },
            dragEnd:function () {
                dragArr=null;
                dragItem=null;
                if(lastEle)
                {
                    lastEle.style.borderBottom="";
                    lastEle.style.borderTop="";
                    lastEle.style.backgroundColor="white";
                }
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
            focusAuto:function (item) {
                this.itemSel=item;
                item.drag=0;
            },
            showAutoComplete:function (event) {
                this.itemSel.mock="";
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
            },
            querySearch:function (queryString,cb) {
                var results=[];
                if(this.itemSel.value.type==0)
                {
                    results=this.itemSel.value.data.map(function (obj) {
                        return {
                            value:obj.value,
                            remark:obj.remark
                        }
                    })
                }
                else
                {
                    if(this.itemSel.value.status)
                    {
                        var objStatus=null;
                        var _this=this;
                        this.$store.getters.status.forEach(function (obj) {
                            if(obj.id==_this.itemSel.value.status)
                            {
                                objStatus=obj;
                            }
                        })
                        if(objStatus)
                        {
                            results=objStatus.data.map(function (obj) {
                                return {
                                    value:obj.key,
                                    remark:obj.remark
                                }
                            })
                        }
                    }
                }
                if(queryString)
                {
                    results=results.filter(function (obj) {
                        return obj.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
                    })
                }
                cb(results);
            },
        }
    }
</script>