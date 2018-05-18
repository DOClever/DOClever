<template>
    <el-dialog title="编辑断言"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form label-width="100px">
            <el-form-item label="标题" style="text-align: center">
                <el-input size="small" placeholder="请输入标题" v-model="name" style="width: 95%"></el-input>
            </el-form-item>
            <el-form-item label="内容" style="text-align: center">
                <el-input size="small" placeholder="请输入断言语句(字符串请加双引号)" v-model="value" @keypress.native="keyPress($event)"  style="width: 95%"></el-input>
            </el-form-item>
            <el-form-item label="通过" style="text-align: center">
                <el-checkbox v-model="pass" :true-label="1" :false-label="0">断言为真则用例状态已通过(后续内容不执行)</el-checkbox>
            </el-form-item>
        </el-form>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" size="small">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>

</style>

<script>
    module.exports = {
        props:["default","index","propName","propPass"],
        data: function () {
            return {
                value:this.default?this.default:"",
                showDialog:false,
                name:this.propName?this.propName:"",
                pass:this.propPass!==undefined?this.propPass:0
            }
        },
        methods: {
            save:function () {
                if(!this.name)
                {
                    $.tip("标题不能为空!",0);
                    return;
                }
                if(!this.value)
                {
                    $.tip("内容不能为空!",0);
                    return;
                }
                this.$emit("save",this.value,this.name,this.pass);
                this.showDialog=false;
            },
            keyPress:function (event) {
                var _this=this;
                if(event.key=="$")
                {
                    var child=$.showMenu(this.$root,event.target,helper.getTestUIArgvList(this.$store.state.selTest.ui,this.index));
                    child.$on("click",function (arr) {
                        event.target.focus();
                        $.insertTextAtCursor(event.target,arr.join(".").replace(/\.0/g,"[0]"));
                        _this.value=event.target.value;
                    })
                }
                else if(event.key=="#")
                {
                    var child=$.showMenu(this.$root,event.target,helper.getTestBaseUrlList(this.$store.state.baseUrls));
                    child.$on("click",function (arr) {
                        event.target.focus();
                        event.target.selectionStart-=1;
                        event.target.selectionEnd=event.target.selectionStart+1;
                        $.insertTextAtCursor(event.target,arr[arr.length-1]);
                        _this.value=event.target.value;
                    })
                }
            }
        }
    }
</script>