<template>
    <el-dialog title="编辑值"  size="small" ref="box" >
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
                        this.$store.state.status.forEach(function (obj) {
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
                }.call(this)
            }
        },
        computed:{
            arr:function () {
                return this.$store.state.status;
            }
        },
        methods:{

        }
    }
</script>
