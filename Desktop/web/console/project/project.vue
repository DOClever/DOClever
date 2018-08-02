<template>
    <el-row class="row" style="height: 100%;">
        <transition name="component-fade" mode="out-in">
            <component :is="$store.state.type" :id="id"></component>
        </transition>
    </el-row>
</template>

<style scoped>
    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active for below version 2.1.8 */ {
        opacity: 0;
    }
</style>

<script>
    var sessionChange=require("common/mixins/session");
    var list=require("./list/list.vue");
    var info=require("./info/info.vue");
    var doc=require("./doc/doc.vue");
    var test=require("./test/test.vue");
    module.exports = {
        props:["id"],
        data: function () {
            return {}
        },
        computed:{

        },
        mixins:[sessionChange],
        store:function () {
            let obj=new Vuex.Store(require("./store.js"));
            if(!window.projectStore)
            {
                window.projectStore={};
            }
            window.projectStore[session.get("teamId")?session.get("teamId"):""]=obj;
            return obj;
        },
        components:{
            "info":info,
            "list":list,
            "doc":doc,
            "test":test
        },
        methods: {},
    }
</script>