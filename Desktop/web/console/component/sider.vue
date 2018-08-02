<template>
    <transition name="sider">
    <el-row class="row" style="position: absolute;left: 0;top: 0;width: 100%;height:100%;background-color: rgba(0,0,0,0.3)" v-show="show">
            <el-row class="row" style="position: absolute;top:0;right: 0;height:calc(100vh);background-color: white" :style="{width:width}">
                <el-row class="row" style="height: 50px;line-height: 50px;padding-left: 15px;font-size: 15px;color: #00adef;border-bottom: 1px lightgray solid">
                    {{title}}
                    <i class="el-icon-close fa-lg" style="float: right;margin-top: 15px;margin-right: 10px;cursor: pointer" @click="close"></i>
                </el-row>
                <el-row class="row" style="height: calc(100% - 50px);overflow-y: auto;background-color: rgb(248,248,248)" ref="content">

                </el-row>
            </el-row>
    </el-row>
    </transition>
</template>

<style scoped>
    .sider-enter-active, .sider-leave-active {
        transition: opacity 0.5s;
    }
    .sider-enter, .sider-leave-to {
        opacity: 0;
    }
</style>

<script>
    module.exports={
        props:["title","width","component","attr"],
        data:function () {
            return {
                show:false,
                child:null
            }
        },
        methods:{
            close:function () {
                this.$emit("close");
                if(this.child)
                {
                    this.child.$el.parentNode.removeChild(this.child.$el);
                    this.child.$destroy();
                }
            }
        },
        mounted:function () {
            let content=this.$refs.content;
            let ele=document.createElement("div");
            content.$el.appendChild(ele);
            var Child = Vue.extend(this.component);
            this.child = new Child({
                el: ele,
                parent: this,
                propsData:this.attr?this.attr:null
            });
            this.$nextTick(function () {
                this.show=true;
            })

        },
        created:function () {
            window.store.state.event.$on("closeSider",this.close)
        },
        beforeDestroy:function () {
            window.store.state.event.$off("closeSider",this.close)
        }
    }
</script>