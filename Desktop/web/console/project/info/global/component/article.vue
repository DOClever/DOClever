<template>
    <el-dialog :title="propObj?'编辑':'新建'"  fullscreen="true" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-input size="small" placeholder="请输入标题" v-model="obj.title"></el-input>
        </el-row>
        <el-row class="row" style="height: 30px;line-height: 30px;color: gray">
            作者：{{obj.creator.name}}&nbsp;&nbsp;最后修改：{{obj.updatedAt}}
        </el-row>
        <el-row class="row">
            <el-col :span="12" class="col" style="border-right: 1px gray solid">
                <textarea v-tab style="height: 500px;width: calc(100% - 10px);border: none;margin: 0;padding: 0 5px 0 5px" v-model="obj.content" placeholder="支持markdown语法编写" id="markdownEditor"></textarea>
            </el-col>
            <el-col :span="12" class="col">
                <vue-markdown :html="false" style="height: 500px;width: 100%;padding-left: 5px;padding-right: 5px;overflow-y:auto" :source="obj.content" id="markdownPreview"></vue-markdown>
            </el-col>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" :laoding="savePending" v-if="globalDocRole">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>
    #markdownPreview table {
        border-collapse:collapse;
        width:100%
    }
    #markdownPreview table tr td{
        border:1px solid lightgray;
        text-align: center;
        vertical-align: middle;
        padding: 5px;
    }
    #markdownPreview pre {
        padding: 10px;
        background-color: #ededed;
    }
</style>
<script>
    var tab=require("common/director/tab");
    var sessionChange=require("common/mixins/session");
    Vue.use(VueMarkdown);
    module.exports={
        props:["propObj"],
        data:function () {
            return {
                obj:this.propObj?this.propObj:{
                    title:"",
                    content:"",
                    creator:{
                        name:session.get("name")
                    },
                    createdAt:$.getNowFormatDate("yyyy-MM-dd hh:mm:ss")
                },
                savePending:false,
                showDialog:false
            }
        },
        mixins:[sessionChange],
        directives:{
            "tab":tab
        },
        computed:{
            globalDocRole:function () {
                return this.$store.getters.globalDocRole;
            }
        },
        methods: {
            save: function () {
                var _this = this;
                this.savePending = true;
                var query = {
                    project: session.get("projectId"),
                    title: this.obj.title,
                    content: this.obj.content
                }
                if (this.obj._id) {
                    query.id = this.obj._id
                }
                net.post("/article/save", query).then(function (data) {
                    _this.savePending = false;
                    if (data.code == 200) {
                        $.tip("保存成功", 1)
                        _this.$emit("save", data.data);
                    }
                    else {
                        $.tip(data.msg, 0)
                    }
                })
            }
        },
        mounted:function () {

        }
    }
</script>
