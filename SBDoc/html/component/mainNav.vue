<template>
    <el-row id="navBar" class="row" :style="transparent?{height:'60px','backgroundColor':'rgba(0,0,0,0.3)',left:0,top:0,position:'absolute'}:{height:'60px','backgroundColor':'white'}">
        <slot name="other"></slot>
        <el-col class="col" :span="3" style="text-align: left;line-height: 60px;color:#20A0FF ;font-size: 30px;padding-left: 20px">
            DOClever
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px;">
            <slot name="slot3">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px;">
            <slot name="slot4">
            </slot>
        </el-col>
        <el-col class="col" :span="1" style="text-align: center;line-height: 60px;">

        </el-col>
        <el-col class="col" :span="8" style="text-align: center;line-height: 60px;font-size: 25px;color: #20A0FF">
            <slot name="title">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px;">
            <slot name="slot1">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 60px;">
            <slot name="slot2">
            </slot>
        </el-col>
        <el-col class="col" :span="4"  style="white-space: nowrap;text-align: center;line-height: 60px">

        </el-col>

    </el-row>
</template>
<script>
    module.exports={
        props:["transparent"],
        data:function () {
            return {
            }
        },
        directives:{

        },
        methods:{

        },
        created:function () {
            var ele;
            this.$nextTick(function () {
                ele=document.getElementById("navBar");
                ele.style.zIndex=100
            })
            var _this=this;
            if(this.transparent)
            {
                $.addEventListener(window,"scroll",function () {
                    if(document.body.scrollTop>60)
                    {
                        ele.style.position="fixed";
                        ele.style.top=0;
                        ele.style.backgroundColor="rgb(39,52,68)"
                    }
                    else
                    {
                        ele.style.top=0;
                        ele.style.backgroundColor="rgba(0,0,0,0.3)"
                        ele.style.position="absolute";
                    }
                })
            }
        }
    }
</script>
