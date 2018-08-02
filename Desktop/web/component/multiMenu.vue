<template>
    <el-row class="row" style="font-size:14px;position: absolute;width: auto;z-index: 10000;border-radius:3px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);border:1px solid #e4e7ed" :menuIndex="val.length+1">
        <el-col class="col" style="width:150px;background: white;height: 200px;overflow-y: auto" ref="menu" :menuIndex="val.length+1">
            <el-row class="row" v-for="item in arr" style="height: 35px;line-height: 35px" @mouseenter.native="enter(item)" @mouseleave.native="leave(item,$event)" :style="{backgroundColor:item.select?'#F3F3F3':''}" :menuIndex="val.length+1" @click.native="select(item)">
                <el-col class="col" :style="{width: item.data?'80%':'100%'}" :menuIndex="val.length+1" style="padding-left: 10px;overflow: hidden;text-overflow: ellipsis" :title="item.label">
                    {{item.label}}
                </el-col>
                <el-col class="col" style="width: 20%;text-align: center;padding-right: 10px;color: gray" v-if="item.data" :menuIndex="val.length+1">
                    >
                </el-col>
            </el-row>
        </el-col>
        <template v-for="(item,index) in arr">
            <multimenu v-if="item.data && item.data.length>0 && item.select" :val="val.concat(item.value)" :source="item.data" :style="{left:'150px',top:0}" :key="String(index)" @click="click" @level="level"></multimenu>
        </template>
    </el-row>
</template>

<style>

</style>

<script>
    module.exports = {
        name:"multimenu",
        props:{
            val:{
                type:Array,
                default:[]
            },
            source:{
                type:Array,
                default:[]
            },
            xy:{
                type:Object
            },
        },
        data: function () {
            return {
                closeHandle:this.close.bind(this),
                arr:function () {
                    var arr=_$.clone(this.source);
                    arr.forEach(function (obj) {
                        obj.select=0;
                    })
                    return arr;
                }.call(this),
                selItem:null
            }
        },
        methods: {
            enter:function (item) {
                if(this.selItem)
                {
                    this.selItem.select=0;
                }
                item.select=1;
                this.selItem=item;
                if(item.data && item.data.length>0)
                {
                    this.$emit("level",this.val.length+2);
                }
                else
                {
                    this.$emit("level",this.val.length+1);
                }
            },
            leave:function (item,event) {
                var ele=event.relatedTarget;
                if(event.relatedTarget==this.$refs.menu.$el)
                {
                    item.select=1;
                }
                else if(ele.hasAttribute("menuIndex"))
                {
                    var index=ele.getAttribute("menuIndex");
                    if(index>this.val.length+1)
                    {
                        item.select=1;
                    }
                    else
                    {
                        item.select=0;
                    }
                }
                else
                {
                    item.select=0;
                }
            },
            close:function () {
                if(this.val.length==0)
                {
                    this.$el.parentNode.removeChild(this.$el);
                    this.$destroy();
                }
            },
            select:function (item) {
                this.$emit("click",this.val.concat([item.value]));
            },
            click:function (arr) {
                this.$emit("click",arr);
            },
            level:function (level) {
                this.$emit("level",level);
            }
        },
        created:function () {
            if(this.val.length==0)
            {
                document.addEventListener("click",this.closeHandle,false);
            }
        },
        mounted:function () {
            if(this.val.length==0)
            {
                document.addEventListener("keydown",this.closeHandle,false);
            }
        },
        beforeDestroy:function () {
            if(this.val.length==0)
            {
                document.removeEventListener("click",this.closeHandle);
                document.removeEventListener("keydown",this.closeHandle);
            }
        }
    }
</script>