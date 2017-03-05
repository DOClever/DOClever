<template>
    <el-dialog title="编辑值"  size="small" ref="box">
        <el-row class="row" style="height: 100%;overflow-y: auto">
            <table class="table-hover" style="width: 100%;">
                <tbody>
                <template v-for="(item,index) in arr">
                    <tr style="text-align: center;vertical-align: middle;height: 50px">
                        <td style="width: 80%;text-align: center;vertical-align: middle;">
                            <el-input style="width: 95%" v-model="item.name" placeholder="请输入可能的值"></el-input>
                        </td>
                        <td style="width: 20%;text-align: center;vertical-align: middle;">
                            <el-button size="small" type="text" style="color: red;width: 30px;height: 30px;" icon="close" @click="remove(index)"></el-button>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="add">
                新增
            </el-button>
            <el-button type="primary" @click="save">
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
                arr:function () {
                    var arr1=[];
                    if(this.source.length==0)
                    {
                        arr1.push({
                            name:"",
                        });
                    }
                    else
                    {
                        arr1=this.source.map(function (obj) {
                            return {name:obj}
                        })
                    }
                    return arr1;
                }.call(this)
            }
        },
        methods:{
            remove:function (index) {
                this.arr.splice(index,1);
            },
            add:function () {
                this.arr.push({
                    name:"",
                })
            },
            save:function () {
                var arr=[];
                this.arr.forEach(function (obj) {
                    if(obj.name)
                    {
                        arr.push(obj.name);
                    }
                })
                this.$emit("save",arr);
                this.$refs.box.close();
            }
        }
    }
</script>
