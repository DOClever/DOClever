<template>
    <el-row class="row" style="cursor: pointer;white-space: nowrap;background-color: white" id="docTree">
        <template v-for="(item,index) in group">
            <el-row class="row" style="height: 35px;line-height: 35px;white-space: nowrap" :key="item._id" v-if="level==0 || (item.childDoc && parent.show)" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}">
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
            </el-row>
            <el-collapse-transition>
                <docgrouplist v-if="item.show" :level="level+1" :group="item.childGroup" :doc="item.childDoc" :parent="item"></docgrouplist>
            </el-collapse-transition>
        </template>
        <template v-for="(item,index) in doc">
            <el-row class="row" style="height: 35px;line-height: 35px;" @mouseenter.native="mouseEnter($event,item)" @mouseleave.native="mouseLeave($event,item)" @click.native="info(item,index,$event)" :section="index" :row="index" :style="{backgroundColor:item.select?'#50bfff':(item.menu?'rgb(247,246,242':'')}" :key="item._id" v-if="parent.show">
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
            </el-row>
        </template>
    </el-row>
</template>

<script>
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
        computed:{

        },
        methods:{
            mouseEnter:function (event,item) {
                item.menu=1;
            },
            mouseLeave:function (event,item) {
                item.menu=0;
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
        }
    }
</script>