<template>
    <el-dialog title="编辑变量"  width="60%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-radio size="small" v-model="globalEdit" :label="0">
                局部变量
            </el-radio>
            <el-radio size="small" v-model="globalEdit" :label="1">
                全局变量
            </el-radio>
                <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
                    <el-col class="col" :span="6">
                        <el-input size="small" placeholder="请输入变量名" style="width: 90%" v-model="varEdit"></el-input>
                    </el-col>
                    <el-col class="col" :span="4">
                        <el-select size="small" v-model="type">
                            <el-option label="Number" value="number"></el-option>
                            <el-option label="String" value="string"></el-option>
                            <el-option label="Boolean" value="boolean"></el-option>
                            <el-option label="Code" value="code"></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="col" :span="14">
                        <el-input size="small"  style="width: 90%" v-model="valueEdit" @keypress.native="keyPress($event)"></el-input>
                    </el-col>
                </el-row>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>

</style>

<script>
    module.exports = {
        props:["global","var","value","index"],
        data: function () {
            return {
                showDialog:false,
                globalEdit:this.global!==undefined?this.global:0,
                varEdit:this.var!==undefined?this.var:"",
                valueEdit:this.value!==undefined?this.value:"",
                type:"string"
            }
        },
        methods: {
            save:function () {
                if(!this.varEdit)
                {
                    $.tip("请输入变量名！");
                    return;
                }
                if(this.type=="string")
                {
                    this.valueEdit="\""+this.valueEdit+"\"";
                }
                if(!this.valueEdit)
                {
                    this.valueEdit="undefined";
                }
                this.$emit("save",this.globalEdit,this.varEdit,this.valueEdit);
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
                        _this.valueEdit=event.target.value;
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
                        _this.valueEdit=event.target.value;
                    })
                }
            }
        },
        created:function () {
            this.type=helper.getArgvType(this.valueEdit);
            if(this.type=="string")
            {
                this.valueEdit=this.valueEdit.substr(1,this.valueEdit.length-2);
            }
        }
    }
</script>