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
                        <el-col class="col" :span="18">
                            <el-input size="small" style="width: 90%" placeholder="请填入返回值或返回语句，字符串请加双引号" v-model="item.value"></el-input>
                        </el-col>
                        <el-col class="col" :span="3">
                            <el-button size="mini" type="text" style="font-weight: 900;font-size: 16px;" icon="el-icon-plus" @click="obj.argv.splice(index+1,0,{value:''})"></el-button>
                        </el-col>
                        <el-col class="col" :span="3">
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
        props:["argv","data"],
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
                                    value:""
                                }
                            ]
                        }
                        return obj;
                    }
                    else
                    {
                        obj.data=this.data;
                        obj.argv=this.argv.map(function (obj) {
                            return {
                                value:obj
                            }
                        })
                        if(obj.argv.length==0)
                        {
                            obj.argv=[
                                {
                                    value:""
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
                        arr.push(obj.value);
                    }
                })
                this.$emit("save",this.obj.data,arr);
                this.showDialog=false;
            }
        }
    }
</script>








