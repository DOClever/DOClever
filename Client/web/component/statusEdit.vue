<template>
    <el-dialog title="编辑状态码"  size="small" ref="box">
        <el-row class="row">
            <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                <el-col class="col" :span="4">
                    名称
                </el-col>
                <el-col class="col" :span="20">
                    <el-input placeholder="请输入状态码名称" style="width: 90%" v-model="obj.name"></el-input>
                </el-col>
            </el-row>
            <table style="width: 100%" class="table-hover">
                <template v-for="(item,index) in obj.data">
                    <tr style="text-align: center;vertical-align: middle">
                        <td style="width: 40%">
                            <el-input style="width: 90%;margin: 0 auto" placeholder="请填写键" v-model="item.key"></el-input>
                        </td>
                        <td style="width: 40%">
                            <el-input style="width: 90%;margin: 0 auto" placeholder="请填写值" v-model="item.remark"></el-input>
                        </td>
                        <td style="width: 10%">
                            <el-button type="text" size="small" style="color: red;font-size: 15px;" @click="remove(index)" icon="close"></el-button>
                        </td>
                        <td style="width: 10%">
                            <el-button style="font-size: 15px" v-if="index==obj.data.length-1" @click="obj.data.push({key:'',remark:''})" size="small" type="text" icon="plus"></el-button>
                        </td>
                    </tr>
                </template>
            </table>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" :loading="savePending">
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
                obj:function () {
                    if(this.source)
                    {
                        var obj=$.clone(this.source)
                        if(obj.data.length==0)
                        {
                            obj.data.push({
                                key:"",
                                remark:""
                            })
                        }
                        return obj;
                    }
                    else
                    {
                        return {
                            name:"",
                            data:[
                                {
                                    key:"",
                                    remark:""
                                }
                            ]
                        }
                    }
                }.call(this),
                savePending:false
            }
        },
        methods:{
            remove:function (index) {
                if(this.obj.data.length>1)
                {
                    this.obj.data.splice(index,1)
                }
                else
                {
                    this.obj.data[0].key="";
                    this.obj.data[0].remark="";
                }
            },
            save:function () {
                if(!this.obj.name)
                {
                    $.tip("请输入名称",0);
                    return;
                }
                var arr=[];
                this.obj.data.forEach(function (obj) {
                    if(obj.key)
                    {
                        arr.push(obj);
                    }
                })
                var _this=this;
                this.savePending=true;
                var query={
                    name:this.obj.name,
                    project:session.get("projectId"),
                    data:JSON.stringify(arr)
                }
                if(this.obj._id)
                {
                    query.id=this.obj._id;
                }
                net.post("/status/save",query).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        _this.$emit("save",data.data);
                        _this.$refs.box.close();
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
