<template>
    <el-dialog title="编辑接口入参"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-row class="row" style="height: 50px;line-height: 50px;text-align: center" v-for="(item,index) in arr">
                <el-col class="col" :span="20">
                    <el-tooltip class="item" effect="dark" content='参数值会以javascript语句的方式运行，如果你需要字符串，请加上双引号，比如"aaa"' placement="bottom" >
                        <el-input size="small" v-model="item.value" style="width: 90%" :placeholder="'请输入第'+index+'个参数'"></el-input>
                    </el-tooltip>
                </el-col>
                <el-col class="col" :span="2">
                    <el-button size="mini" type="text" style="font-weight: 900;font-size: 16px;" icon="el-icon-plus" @click="arr.splice(index+1,0,{value:''})"></el-button>
                </el-col>
                <el-col class="col" :span="2">
                    <el-button size="mini" type="text" style="font-weight: 900;color:red;font-size: 16px;" icon="el-icon-close" @click="index>0?arr.splice(index,1):(item.value='')"></el-button>
                </el-col>
            </el-row>
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
        props:["argv"],
        data: function () {
            return {
                showDialog:false,
                arr:function (data) {
                    var arr=[];
                    data.forEach(function (obj) {
                        arr.push({
                            value:obj
                        })
                    })
                    if(arr.length==0)
                    {
                        arr.push({
                            value:""
                        })
                    }
                    return arr;
                }.call(this,this.argv)
            }
        },
        methods: {
            save:function () {
                var arr=[];
                this.arr.forEach(function (obj) {
                    if(obj.value)
                    {
                        arr.push(obj.value);
                    }
                })
                this.argv.splice(0,this.argv.length);
                for(var i=0;i<arr.length;i++)
                {
                    this.argv[i]=arr[i];
                }
                this.showDialog=false;
            }
        }
    }
</script>