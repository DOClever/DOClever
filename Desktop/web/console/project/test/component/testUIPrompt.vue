<template>
    <el-dialog :title="title"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form label-width="100px">
            <el-form-item label="标题" v-if="two" style="text-align: center">
                <el-input size="small" placeholder="请输入标题" v-model="name" style="width: 95%"></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                    <el-col class="col" :span="5" v-if="category" style="text-align: right">
                        <el-select size="small" v-model="type" style="width: 95%">
                            <el-option label="String" value="string"></el-option>
                            <el-option label="Code" value="code"></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="col" :span="category?19 :24">
                        <el-input size="small" :placeholder="placeholder?placeholder:''" v-model="value" @keypress.native="keyPress($event)"  style="width: 95%"></el-input>
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
        props:["title","placeholder","default","index","category","two","propName"],
        data: function () {
            return {
                value:this.default?this.default:"",
                showDialog:false,
                type:"string",
                name:this.two?this.propName:""
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
                if(this.category)
                {
                    if(this.type=="string")
                    {
                        this.value="\""+this.value+"\"";
                    }
                }
                this.$emit("save",this.value,this.name);
                this.showDialog=false;
            },
            keyPress:function (event) {
                var _this=this;
                if(event.key=="$" && (!this.category || (this.category && this.type=="code")))
                {
                    var child=$.showMenu(this.$root,event.target,helper.getTestUIArgvList(this.$store.state.selTest.ui,this.index));
                    child.$on("click",function (arr) {
                        event.target.focus();
                        $.insertTextAtCursor(event.target,arr.join(".").replace(/\.0/g,"[0]"));
                        _this.value=event.target.value;
                    })
                }
                else if(event.key=="#" && (!this.category || (this.category && this.type=="code")))
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