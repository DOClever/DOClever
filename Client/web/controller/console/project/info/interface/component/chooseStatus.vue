<template>
    <el-dialog title="编辑值"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-col class="col" :span="4">
                状态码
            </el-col>
            <el-col class="col" :span="20">
                <el-select style="width: 90%" v-model="statusEdit">
                    <el-option value="" label="无"></el-option>
                    <el-option v-for="item in arr" :value="item.id" :label="item.name" :key="item.id"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["status"],
        data:function () {
            return {
                statusEdit:function () {
                    if(!this.status)
                    {
                        return "";
                    }
                    else
                    {
                        var bFind=false;
                        var _this=this;
                        this.$store.getters.status.forEach(function (obj) {
                            if(obj.id==_this.status)
                            {
                                bFind=true;
                            }
                        })
                        if(bFind)
                        {
                            return _this.status;
                        }
                        else
                        {
                            $.tip("状态码已不存在!",0);
                            return ""
                        }
                    }
                }.call(this),
                showDialog:false
            }
        },
        computed:{
            arr:function () {
                return this.$store.getters.status;
            }
        },
        methods:{
            save:function () {
                this.$emit("save",this.statusEdit);
                this.showDialog=false;
            }
        }
    }
</script>
