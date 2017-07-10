<template>
    <el-dialog :title="propObj?'编辑':'新建'"  size="large" ref="box" >
        <el-row class="row">
            <el-input placeholder="请输入标题" v-if="edit" v-model="obj.title"></el-input>
            <span style="font-size: 20px" v-else>
                {{obj.title}}
            </span>
        </el-row>
        <el-row class="row" style="height: 30px;line-height: 30px;color: gray">
            作者：{{obj.creator.name}}&nbsp;&nbsp;最后修改：{{obj.updatedAt}}
        </el-row>
        <el-row class="row">
            <textarea v-tab style="height: 500px;width: 100%" v-model="obj.content" v-if="edit"></textarea>
            <el-row class="row" style="height: 500px;overflow-y: auto" v-html="preContent" v-else></el-row>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="edit=0" v-if="edit">
                预览
            </el-button>
            <el-button type="primary" @click="edit=1" v-else>
                编辑
            </el-button>
            <el-button type="primary" @click="save" :laoding="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var tab=require("../director/tab");
    var markdown = require( "markdown" ).markdown;
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
                edit:this.propObj?0:1,
                savePending:false
            }
        },
        directives:{
            "tab":tab
        },
        computed:{
            preContent:function () {
                return markdown.toHTML(this.obj.content);
            }
        },
        methods:{
            save:function () {
                var _this=this;
                this.savePending=true;
                var query={
                    project:session.get("projectId"),
                    title:this.obj.title,
                    content:this.obj.content
                }
                if(this.obj._id)
                {
                    query.id=this.obj._id
                }
                net.post("/article/save",query).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1)
                        _this.$emit("save",data.data);
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            }
        }
    }
</script>
