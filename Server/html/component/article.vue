<template>
    <el-dialog title="浏览"  size="large" ref="box" >
        <el-row class="row">
            <span style="font-size: 20px">
                {{obj.title}}
            </span>
        </el-row>
        <el-row class="row" style="height: 30px;line-height: 30px;color: gray">
            作者：{{obj.creator.name}}&nbsp;&nbsp;最后修改：{{obj.updatedAt}}
        </el-row>
        <el-row class="row">
            <el-row class="row" style="height: 500px;overflow-y: auto" v-html="preContent"></el-row>
        </el-row>
    </el-dialog>
</template>

<script>
    var markdown = require( "markdown" ).markdown;
    module.exports={
        props:["propObj"],
        data:function () {
            return {
                obj:this.propObj,
            }
        },
        computed:{
            preContent:function () {
                return markdown.toHTML(this.obj.content);
            }
        },
        methods:{

        }
    }
</script>
