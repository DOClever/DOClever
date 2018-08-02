<template>
    <el-dialog title="编辑项目"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form ref="form" label-width="100px">
            <el-form-item label="名称" style="text-align: center">
                <el-input  size="small" style="width: 80%" name="name" v-model="obj.name"></el-input>
            </el-form-item>
            <el-form-item label="描述" style="text-align: center">
                <el-input size="small" :rows="3"  style="width: 80%" name="dis" v-model="obj.dis"></el-input>
            </el-form-item>
            <el-form-item label="公开" style="text-align: center" v-if="category!=2">
                <el-switch v-model="obj.public" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
        </el-form>
        <el-row class="dialog-footer" slot="footer">
            <el-button size="mini" type="primary" @click="save" :laoding="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["propObj","category"],
        data:function () {
            return {
                obj:this.propObj,
                savePending:false,
                showDialog:false
            }
        },
        computed:{

        },
        methods:{
            save:function () {
                var _this=this;
                var obj={
                    id:this.obj._id,
                    name:this.obj.name,
                    dis:this.obj.dis,
                    category:this.category
                };
                if(this.category==0 || this.category==1)
                {
                    obj.public=this.obj.public;
                }
                this.savePending=true;
                this.$store.dispatch("saveProject",obj).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                        _this.showDialog=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        }
    }
</script>