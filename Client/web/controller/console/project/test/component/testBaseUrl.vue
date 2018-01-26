<template>
    <el-dialog title="设置BaseUrl"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-col class="col" :span="4">
                BaseUrl
            </el-col>
            <el-col class="col" :span="20">
                <el-cascader size="small" expand-trigger="hover" :options="arrProjectUrl" v-model="arrSelBaseUrl" style="width: 90%" filterable clearable placeholder="请选择BaseUrl" :props="props">
                </el-cascader>
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
        props:["url","arrUrl"],
        data:function () {
            return {
                arrProjectUrl:this.arrUrl,
                showDialog:false,
                props:{
                    value:"_id",
                    label:"name",
                    children:"data"
                },
                arrSelBaseUrl:function () {
                    var arr=[];
                    for(var i=0;i<this.arrUrl.length;i++)
                    {
                        arr.push(this.arrUrl[i]._id)
                        for(var j=0;j<this.arrUrl[i].data.length;j++)
                        {
                            if(this.arrUrl[i].data[j].name==this.url)
                            {
                                arr.push(this.arrUrl[i].data[j].name);
                                return arr;
                            }
                        }
                        arr.pop();
                    }
                    return arr;
                }.call(this)
            }
        },
        computed:{
        },
        methods:{
            save:function () {
                var env=[];
                for(var i=0;i<this.arrUrl.length;i++)
                {
                    var bFind=false;
                    for(var j=0;j<this.arrUrl[i].data.length;j++)
                    {
                        if(this.arrUrl[i].data[j].name==this.arrSelBaseUrl[1])
                        {
                            env=this.arrUrl[i].data[j].env?this.arrUrl[i].data[j].env:[];
                            bFind=true;
                            break;
                        }
                    }
                    if(bFind)
                    {
                        break;
                    }
                }
                this.$emit("save",{
                    url:this.arrSelBaseUrl[1],
                    env:env
                });
                this.showDialog=false;
            }
        }
    }
</script>
