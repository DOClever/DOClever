<template>
    <el-row class="row" style="cursor: pointer;white-space: nowrap" id="tree">
        <template v-for="(item,index) in arr">
            <el-row class="row"  style="height: 40px;line-height: 40px;white-space: nowrap" :id="item.type==1?'recycle':('group'+index)" :key="item._id" v-if="level==0 || (item.data && parent.show)" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}">
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
            </el-row>
            <interfacelist v-if="item.data && item.data.length>0 && item.show" :level="level+1" :data="item.data" :parent="item"></interfacelist>
            <el-row class="row" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" :section="index" :row="index" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}" :key="item._id" v-else-if="!item.data && parent.show">
                <template v-if="level>0">
                    <el-col :span="2" class="col" v-for="n in level" :style="{'borderRight':'1px lightgray dashed'}">
                        &nbsp;
                    </el-col>
                </template>
                <el-col class="col" :span="4" :style="{fontSize: 'small',margin: 0,color:item.select?'white':methodColor(item.finish),padding:0,lineHeight:'40px','textAlign':'center'}" name="treeMethod">
                    {{item.method=="DELETE"?"DEL":item.method}}
                </el-col>
                <el-col class="col" :span="20-2*level" :style="{margin: 0,color: item.finish==1?'green':(item.finish==2?'gray':'#50bfff'),color:item.select?'white':'#50bfff',lineHeight:'40px',textOverflow:'ellipsis',overflow:'hidden'}" name="treeName" :title="item.name" @click.native="info(item,index,$event)" >
                    {{item.name}}
                </el-col>
            </el-row>
        </template>
    </el-row>
</template>

<script>
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
        computed:{
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
            info:function (item,index,event) {
                if(event.target.getAttribute("name")!="treeMethod" && event.target.getAttribute("name")!="treeName")
                {
                    return;
                }
                this.$store.dispatch("info",{
                    item:this.parent,
                    item1:item,
                    index:index
                })

            },
        }
    }
</script>
