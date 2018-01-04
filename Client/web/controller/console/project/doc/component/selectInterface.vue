<template>
    <el-dialog title="选择接口"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form ref="form" label-width="100px">
            <el-form-item label="接口">
                <el-cascader size="small" expand-trigger="hover" :options="arrInterface" v-model="selInterface" :show-all-levels="false" placeholder="请选择接口" :props="props" filterable clearable style="width: 90%">
                </el-cascader>
            </el-form-item>
            <el-form-item label="允许运行">
                <el-switch v-model="run" active-color="#13ce66" inactive-color="lightgray" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
        </el-form>
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
        props:["arr"],
        data: function () {
            return {
                showDialog:false,
                selInterface:[],
                arrInterface:this.arr,
                props:{
                    value:"_id",
                    label:"name",
                    children:"data"
                },
                run:1
            }
        },
        methods: {
            save:function () {
                if(this.selInterface.length==0)
                {
                    $.tip("请选择接口",0);
                    return;
                }
                this.showDialog=false;
                var name="",obj=this.arrInterface;
                for(var i=0;i<this.selInterface.length;i++)
                {
                    var id=this.selInterface[i];
                    for(var j=0;j<obj.length;j++)
                    {
                        if(obj[j]._id==id && i<this.selInterface.length-1)
                        {
                            obj=obj[j].data;
                            break;
                        }
                        else if(obj[j]._id==id && i==this.selInterface.length-1)
                        {
                            name=obj[j].name
                            break;
                        }
                    }
                    if(name)
                    {
                        break;
                    }
                }
                this.$emit("save",{
                    interface:this.selInterface[this.selInterface.length-1],
                    run:this.run,
                    name:name
                })
            }
        }
    }
</script>