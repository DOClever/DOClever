<template>
    <el-dialog title="接口详情"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <transition name="component-fade" mode="out-in">
                <preview v-if="type=='preview'" :source="source" ref="preview"></preview>
                <run v-else-if="type=='run'" :interfaceEdit="runInterfaceEdit" :index="index" :baseUrls="baseUrls" :status="status" :before="before" :after="after"></run>
            </transition>
        </el-row>
        <el-row class="dialog-footer" slot="footer" v-if="run">
            <el-button type="primary" @click="switchType">
                {{type=="preview"?"运行":"返回"}}
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>

</style>

<script>
    var preview=require("./preview.vue");
    var run=require("./run.vue")
    module.exports = {
        props:["run","source","baseUrls","status","before","after"],
        data: function () {
            return {
                showDialog:false,
                type:"preview"
            }
        },
        methods: {
            switchType:function () {
                if(this.type=="preview")
                {
                    this.type="run"
                }
                else if(this.type=="run")
                {
                    this.type="preview"
                }
            }
        },
        computed:{
            runInterfaceEdit:function () {
                var obj=$.clone(this.$refs.preview.interface);
                obj.param=$.clone(this.$refs.preview.param);
                return obj;
            },
            index:function () {
                if(this.$refs.preview)
                {
                    return this.$refs.preview.tabIndex;
                }
                else
                {
                    return 0;
                }
            }
        },
        components:{
            "preview":preview,
            "run":run
        }
    }
</script>