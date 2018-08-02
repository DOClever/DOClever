<template>
    <el-dialog title="通知用户" :visible.sync="showDialog"  width="50%" ref="box" :close-on-click-modal="false" append-to-body>
        <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
            <el-col class="col" :span="4">
                筛选
            </el-col>
            <el-col class="col" :span="20">
                <el-input size="small" style="width: 90%" placeholder="请输入你要筛选的用户" v-model="filter"></el-input>
            </el-col>
        </el-row>
        <table style="width: 100%;max-height: 300px;overflow: auto" class="table-hover">
            <tbody>
            <template v-for="item in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 10%">
                        <el-checkbox v-model="item.select" :true-label="1" :false-label="0"></el-checkbox>
                    </td>
                    <td style="width: 20%">
                        <img v-proxy="item.photo" style="border-radius: 30px" width="50" height="50">
                    </td>
                    <td style="width: 70%">
                        {{item.name}}
                    </td>
                </tr>
            </template>
            </tbody>
        </table>
        <el-row class="row" style="text-align:center ">
            <el-input size="small" type="textarea" style="width: 90%" :rows="3" v-model="text" placeholder="请填写你需要发送的信息"></el-input>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" size="small" @click="save" :loading="savePending">
                通知
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    module.exports={
        props:["source","id"],
        data:function () {
            return {
                filter:"",
                savePending:false,
                arrMember:function () {
                    return this.source.map(function (obj) {
                        Vue.set(obj,"select",0);
                        return obj;
                    })
                }.call(this),
                showDialog:false,
                text:""
            }
        },
        directives:{
            proxy:proxyImg
        },
        computed:{
            arr:function () {
                var _this=this;
                return this.arrMember.filter(function (obj) {
                    if(obj.name.toLowerCase().indexOf(_this.filter.toLowerCase())>-1)
                    {
                        return true
                    }
                    else
                    {
                        return false;
                    }
                })

            }
        },
        methods:{
            save:function () {
                var arr=$.clone(this.arrMember.filter(function (obj) {
                    if(obj.select==1)
                    {
                        return true
                    }
                    else
                    {
                        return false;
                    }
                }));
                if(arr.length==0)
                {
                    $.tip("请选择你需要通知的用户",0);
                    return;
                }
                arr=arr.map(function (obj) {
                    return obj._id;
                })
                this.savePending=true;
                var _this=this;
                net.post("/interface/notify",{
                    id:this.id,
                    users:arr.join(","),
                    content:this.text
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        _this.showDialog=false;
                        $.tip("通知成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
        }
    }
</script>