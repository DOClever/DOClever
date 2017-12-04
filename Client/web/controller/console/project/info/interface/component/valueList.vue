<template>
    <el-dialog title="编辑值"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-radio class="radio" :label="0" v-model="info.type" :checked="info.type==0" id="bodyKey">普通值</el-radio>&nbsp;&nbsp;
            <el-radio class="radio" :label="1" v-model="info.type" :checked="info.type==1" id="bodyRaw">状态码映射</el-radio>
        </el-row>
        <el-row class="row" style="height: 100%;overflow-y: auto;margin-top: 20px" v-if="info.type==0">
            <table class="table-hover" style="width: 100%;">
                <tbody>
                <template v-for="(item,index) in info.data">
                    <tr style="text-align: center;vertical-align: middle;height: 50px">
                        <td style="width: 40%;text-align: center;vertical-align: middle;">
                            <el-input style="width: 95%" v-model="item.value" placeholder="请输入可能的值" size="small"></el-input>
                        </td>
                        <td style="width: 50%;text-align: center;vertical-align: middle;">
                            <el-input style="width: 95%" v-model="item.remark" placeholder="请输入备注" size="small"></el-input>
                        </td>
                        <td style="width: 10%;text-align: center;vertical-align: middle;">
                            <el-button size="small" type="text" style="color: red;width: 30px;height: 30px;font-size: 15px" icon="el-icon-close" @click="remove(index)"></el-button>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </el-row>
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;margin-top: 20px" v-else>
            <el-col class="col" :span="4">
                状态码
            </el-col>
            <el-col class="col" :span="20">
                <el-select size="small" style="width: 90%" v-model="info.status">
                    <el-option value="" label="无"></el-option>
                    <el-option v-for="item in arrStatus" :value="item.id" :label="item.name" :key="item.id"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="add" size="small">
                新增
            </el-button>
            <el-button type="primary" @click="save" size="small">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["source"],
        data:function () {
            return {
                info:function () {
                    var obj= $.clone(this.source);
                    if(obj.type==0)
                    {
                        var arr1=[];
                        if(this.source.data.length==0)
                        {
                            arr1.push({
                                value:"",
                                remark:""
                            });
                        }
                        else
                        {
                            arr1=$.clone(this.source.data)
                        }
                        obj.data=arr1;
                    }
                    else
                    {
                        if(!this.source.status)
                        {
                            obj.status="";
                        }
                        else
                        {
                            var bFind=false;
                            var _this=this;
                            this.$store.getters.status.forEach(function (obj) {
                                if(obj.id==_this.source.status)
                                {
                                    bFind=true;
                                }
                            })
                            if(bFind)
                            {
                                obj.status= _this.source.status;
                            }
                            else
                            {
                                obj.status=""
                                $.tip("状态码已不存在!",0);
                            }
                        }
                    }
                    return obj;
                }.call(this),
                showDialog:false
            }
        },
        computed:{
            arrStatus:function () {
                return this.$store.getters.status
            }
        },
        methods:{
            remove:function (index) {
                this.info.data.splice(index,1);
            },
            add:function () {
                this.info.data.push({
                    value:"",
                    remark:""
                })
            },
            save:function () {
                this.info.data=this.info.data.filter(function (obj) {
                    if(obj.value)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                })
                this.$emit("save",this.info);
                this.showDialog=false;
            }
        }
    }
</script>
