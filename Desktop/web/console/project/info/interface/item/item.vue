<template>
    <transition name="component-fade" mode="out-in">
        <run v-if="$store.state.type=='run'" ref="run" :interface-edit="runInterfaceEdit" :index="$store.state.index" @save="$store.dispatch('newInterface');"></run>
        <keep-alive>
            <edit v-if="$store.state.type=='edit'" ref="edit"></edit>
            <preview v-if="$store.state.type=='preview'" ref="preview"></preview>
        </keep-alive>
    </transition>
</template>

<style>

</style>

<script>
    var edit=require("../component/edit.vue");
    var preview=require("../component/preview.vue");
    var run=require("../run/run.vue")
    module.exports={
        props:["item"],
        data:function () {
            return {

            }
        },
        store:function () {
            let obj=new Vuex.Store(require("./store.js"));
            return obj;
        },
        components:{
            "edit":edit,
            "preview":preview,
            "run":run
        },
        computed:{
            runInterfaceEdit:function () {
                var obj=$.clone(this.$store.state.interfaceEdit);
                obj.param=$.clone(this.$store.state.param);
                return obj;
            },
        },
        created:async function () {
            this.$store.commit("setTabItem",this.item);
            if(isNaN(this.item._id))
            {
                this.$store.commit("setInterface",this.item);
                await this.$store.dispatch("init",this.item);
            }
            else
            {
                this.$store.dispatch("add",{
                    id:this.item.group,
                    item:this.item.item
                })
            }
        }
    }
</script>