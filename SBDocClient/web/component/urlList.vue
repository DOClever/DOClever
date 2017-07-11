<template>
    <div style="width: 100%">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 50%">
                        <el-input style="width: 90%;margin: 0 auto" placeholder="请填写baseurl地址" v-model="item.url"></el-input>
                    </td>
                    <td style="width: 30%">
                        <el-input style="width: 90%;margin: 0 auto" placeholder="请填写备注" v-model="item.remark"></el-input>
                    </td>
                    <td style="width: 10%">
                        <el-button type="text" size="small" style="color: red;font-size: 15px;" @click="remove(index)" icon="close"></el-button>
                    </td>
                    <td style="width: 10%">
                        <el-button style="font-size: 15px" v-if="index==arr.length-1" @click="arr.push({url:'',remark:''})" size="small" type="text" icon="plus"></el-button>
                    </td>
                </tr>
            </template>
            <tfoot>
            <tr>
                <td style="text-align: center;vertical-align: middle;width: 100%;padding: 20px" colspan="3">
                    <el-button type="primary" style="width: 60%" @click="save" :loading="savePending">
                        保存
                    </el-button>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
    module.exports={
        props:["source"],
        data:function () {
            return {
                arr:function () {
                    if(this.source.length>0)
                    {
                        return this.source
                    }
                    else
                    {
                        return [{
                            url:"",
                            remark:""
                        }]
                    }
                }.call(this),
                savePending:false
            }
        },
        watch:{
            source:function (val) {
                if(val && val.length>0)
                {
                    this.arr= val;
                }
                else
                {
                    this.arr= [{
                        url:"",
                        remark:""
                    }]
                }
            }
        },
        methods:{
            remove:function (index) {
                if(this.arr.length>1)
                {
                    this.arr.splice(index,1)
                }
                else
                {
                    this.arr[0].url="";
                    this.arr[0].remark="";
                }
            },
            save:function () {
                var arr=[];
                this.arr.forEach(function (obj) {
                    if(obj.url)
                    {
                        arr.push(obj);
                    }
                })
                var _this=this;
                this.savePending=true;
                net.put("/project/url",{
                    id:session.get("projectId"),
                    urls:JSON.stringify(arr)
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        _this.$emit("save",data.data);
                    }
                })
            }
        },
    }
</script>
