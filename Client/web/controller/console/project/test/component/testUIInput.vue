<template>
    <el-dialog title="用户输入"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form label-width="100px">
            <el-form-item label="提示标题">
                <el-input size="small" v-model="title" placeholder="请输入用户输入提示的标题"></el-input>
            </el-form-item>
            <el-form-item  label="提示内容">
                <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                    <el-col class="col" :span="7">
                        <el-select size="small" v-model="type">
                            <el-option label="String" value="string"></el-option>
                            <el-option label="Code" value="code"></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="col" :span="17">
                        <el-input size="small" v-model="value" @keypress.native="keyPress($event)" placeholder="请输入用户输入提示的内容" style="width: 95%"></el-input>
                    </el-col>
                </el-row>
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
        props:["defaultTitle","defaultValue","index"],
        data: function () {
            return {
                value:this.defaultValue?this.defaultValue:"",
                showDialog:false,
                type:"string",
                title:this.defaultTitle?this.defaultTitle:"",
            }
        },
        methods: {
            save:function () {
                if(this.type=="string")
                {
                    this.value="\""+this.value+"\"";
                }
                this.$emit("save",this.title,this.value);
                this.showDialog=false;
            },
            keyPress:function (event) {
                var _this=this;
                if(event.key=="$" && this.type=="code")
                {
                    var child=$.showMenu(this.$root,event.target,helper.getTestUIArgvList(this.$store.state.selTest.ui,this.index));
                    child.$on("click",function (arr) {
                        event.target.focus();
                        $.insertTextAtCursor(event.target,arr.join(".").replace(/\.0/g,"[0]"));
                        _this.value=event.target.value;
                    })
                }
                else if(event.key=="#" && this.type=="code")
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
        },
        created:function () {
            this.type=helper.getArgvType(this.value);
            if(this.type=="string")
            {
                this.value=this.value.substr(1,this.value.length-2);
            }
        }
    }
</script>