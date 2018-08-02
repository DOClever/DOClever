<template>
    <el-dialog title="编辑变量"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <table width="100%" class="table-hover">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 30%">
                        <el-input size="small" style="width: 90%;margin: 0 auto" placeholder="请填写变量名称" v-model="item.key"></el-input>
                    </td>
                    <td style="width: 30%">
                        <el-input size="small" style="width: 90%;margin: 0 auto" placeholder="请填写变量值" v-model="item.value"></el-input>
                    </td>
                    <td style="width: 20%">
                        <el-input size="small" style="width: 90%;margin: 0 auto" placeholder="请填写变量备注" v-model="item.remark"></el-input>
                    </td>
                    <td style="width: 10%">
                        <el-button type="text" size="mini" style="color: red;font-size: 15px;" @click="arr.splice(index,1)" icon="el-icon-close"></el-button>
                    </td>
                    <td style="width: 10%">
                        <el-button type="text" size="mini" style="font-size: 15px;" @click="arr.push({key:'',remark:'',value:''})" icon="el-icon-plus"></el-button>
                    </td>
                </tr>
            </template>
        </table>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" v-if="globalBaseUrlRole">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var sessionChange=require("common/mixins/session");
    module.exports={
        props:["propObj"],
        data:function () {
            return {
                arr:function () {
                    var arr=$.clone(this.propObj);
                    if(arr.length==0)
                    {
                        arr.push({
                            key:"",
                            value:"",
                            remark:""
                        })
                    }
                    return arr;
                }.call(this),
                savePending:false,
                showDialog:false
            }
        },
        mixins:[sessionChange],
        computed:{
            globalBaseUrlRole:function () {
                return this.$store.getters.globalBaseUrlRole;
            },
        },
        methods:{
            save:function () {
                var arr=[];
                this.arr.forEach(function (obj) {
                    if(obj.key)
                    {
                        arr.push(obj);
                    }
                })
                this.propObj.length=0;
                var _this=this;
                arr.forEach(function (obj) {
                    _this.propObj.push(obj);
                })
                this.showDialog=false;
            }
        }
    }
</script>
