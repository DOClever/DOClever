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

                </el-col>
            </el-row>
            <template v-for="(item1,index1) in item.data">
                <el-row class="row" :draggable="false" style="height: 40px;line-height: 40px;cursor: move" v-if="item.show" @mouseenter.native="mouseEnter($event,item1)" @mouseleave.native="mouseLeave($event,item1)" @click.native="info(item,item1,index1,$event)" :section="index" :row="index1" :style="{backgroundColor:item1.select?'#20A0FF':''}">
                    <el-col class="col" :span="2" style="height: 40px;line-height: 40px;text-align: right">
                        <span class="fa fa-check" style="color: #13ce66;display: inline-block;" v-if="item1.finish==1"></span>
                        <span class="fa fa-exclamation" style="color: red;display: inline-block;" v-else-if="item1.finish==2"></span>
                        <span v-else>&nbsp;</span>
                    </el-col>
                    <el-col class="col" :span="5" :style="{fontSize: 'small',margin: 0,color:methodColor(item1.method),padding:0,textAlign:'center',lineHeight:'40px'}" name="treeMethod">
                        {{item1.method}}
                    </el-col>
                    <el-col class="col" :span="11" :style="{margin: 0,color: '#20A0FF',color:item1.select?'white':'#20A0FF',lineHeight:'40px',textOverflow:'ellipsis',overflow:'hidden'}" name="treeName">
                        {{item1.name}}
                    </el-col>
                    <el-col class="col" :span="6" style="margin: 0;height: 40px;text-align: center">

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
            info:function (item,item1,index,event) {
                if(event.target.getAttribute("name")!="treeMethod" && event.target.getAttribute("name")!="treeName")
                {
                    return;
                }
                this.$store.dispatch("info",{
                    item:item,
                    item1:item1,
                    index:index
                })

            },
        }
    }
</script>
