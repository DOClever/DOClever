<template>
    <el-dialog title="编辑返回值"  width="70%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="text-align: center;">
            <el-form ref="form" label-width="100px">
                <el-form-item label="状态">
                    <el-select size="small" v-model="obj.data">
                        <el-option label="通过" value="true"></el-option>
                        <el-option label="不通过" value="false"></el-option>
                        <el-option label="未判定" value="undefined"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="返回参数">
                    <el-row class="row" v-for="(item,index) in obj.argv" style="height: 40px;line-height: 40px;text-align: center">
                        <el-col class="col" :span="4">
                            <el-select size="small" v-model="item.type">
                                <el-option label="Number" value="number"></el-option>
                                <el-option label="String" value="string"></el-option>
                                <el-option label="Boolean" value="boolean"></el-option>
                                <el-option label="Code" value="code"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="col" :span="16">
                            <el-input size="small" style="width: 90%" v-model="item.value" @keypress.native="keyPress($event,item)"></el-input>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;font-size: 16px;" icon="el-icon-plus" @click="obj.argv.splice(index+1,0,{value:'',type:'string'})"></el-button>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;color:red;font-size: 16px;" icon="el-icon-close" @click="index>0?obj.argv.splice(index,1):(item.value='')"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
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
        props:["argv","data","index"],
        data: function () {
            return {
                showDialog:false,
                obj:function () {
                    var obj={};
                    if(!this.data)
                    {
                        obj={
                            data:"undefined",
                            argv:[
                                {
                                    value:"",
                                    type:"string"
                                }
                            ]
                        }
                        return obj;
                    }
                    else
                    {
                        obj.data=this.data;
                        obj.argv=this.argv.map(function (obj) {
                            var o=helper.handleArgvData(undefined,obj);
                            return o
                        })
                        if(obj.argv.length==0)
                        {
                            obj.argv=[
                                {
                                    value:"",
                                    type:"string"
                                }
                            ]
                        }
                        return obj;
                    }
                }.call(this)
            }
        },
        methods: {
            save:function () {
                var arr=[];
                this.obj.argv.forEach(function (obj) {
                    if(obj.value)
                    {
                        arr.push(helper.setArgvValue(obj.value,obj.type));
                    }
                })
                this.$emit("save",this.obj.data,arr);
                this.showDialog=false;
            },
            keyPress:function (event,item) {
                if(event.key=="$" && item.type=="code")
                {
                    var child=$.showMenu(this.$root,event.target,helper.getTestUIArgvList(this.$store.state.selTest.ui,this.index));
                    child.$on("click",function (arr) {
                        event.target.focus();
                        $.insertTextAtCursor(event.target,arr.join(".").replace(/\.0/g,"[0]"));
                        item.value=event.target.value;
                    })
                }
                else if(event.key=="#" && item.type=="code")
                {
                    var child=$.showMenu(this.$root,event.target,helper.getTestBaseUrlList(this.$store.state.baseUrls));
                    child.$on("click",function (arr) {
                        event.target.focus();
                        event.target.selectionStart-=1;
                        event.target.selectionEnd=event.target.selectionStart+1;
                        $.insertTextAtCursor(event.target,arr[arr.length-1]);
                        item.value=event.target.value;
                    })
                }
            }
        }
    }
</script>








