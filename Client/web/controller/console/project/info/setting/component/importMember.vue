<template>
    <el-dialog title="导入用户" :visible.sync="showDialog"  width="50%" ref="box" :close-on-click-modal="false" append-to-body>
        <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
            <el-col class="col" :span="4">
                筛选
            </el-col>
            <el-col class="col" :span="20">
                <el-input size="small" style="width: 90%" placeholder="请输入你要筛选的用户" v-model="filter"></el-input>
            </el-col>
        </el-row>
        <table style="width: 100%;" class="table-hover">
            <tbody style="max-height: 300px;overflow: auto;display: block">
            <template v-for="item in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 10%">
                        <el-checkbox v-model="item.select" :true-label="1" :false-label="0"></el-checkbox>
                    </td>
                    <td style="width: 20%">
                        <img v-proxy="item.user.photo" style="border-radius: 30px" width="50" height="50">
                    </td>
                    <td style="width: 35%">
                        {{item.user.name}}
                    </td>
                    <td style="width: 25%">
                        <el-select size="small" v-model="item.role" style="width: 90%" @input="changeRole(item)">
                            <el-option :value="1" label="观察者"></el-option>
                            <el-option :value="0" label="管理员"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 10%">
                        <el-button  style="font-size: 15px" size="mini" @click="editRoleOption(item)" type="text" v-if="item.role==1">权限</el-button>
                    </td>
                </tr>
            </template>
            </tbody>
        </table>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" :loading="savePending">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    module.exports={
        props:["source"],
        data:function () {
            return {
                filter:"",
                savePending:false,
                arrMember:this.source,
                showDialog:false
            }
        },
        directives:{
            proxy:proxyImg
        },
        computed:{
            arr:function () {
                var _this=this;
                return this.arrMember.filter(function (obj) {
                    if(obj.user.name.toLowerCase().indexOf(_this.filter.toLowerCase())>-1)
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
                var arr=$.clone(this.source.filter(function (obj) {
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
                    $.tip("请选择你需要导入的用户",0);
                    return;
                }
                arr.forEach(function (obj) {
                    delete obj.select;
                })
                var arrSend=arr.map(function (obj) {
                    var obj1={
                        user:obj.user._id,
                        role:obj.role
                    };
                    if(obj.role==1)
                    {
                        obj1.option=obj.option;
                    }
                    return obj1
                })
                this.savePending=true;
                var _this=this;
                net.post("/project/importmember",{
                    id:session.get("projectId"),
                    data:JSON.stringify(arrSend)
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        _this.$emit("save",arr)
                        _this.showDialog=false;
                        $.notify("导入成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            changeRole:function (item) {
                if(item.role==1)
                {
                    Vue.set(item,"option",{
                        "ie":0,
                        "te":0,
                        "gb":0,
                        "gs":0,
                        "gi":0,
                        "gt":0,
                        "gd":0,
                        "ve":0,
                        "vr":0
                    });
                }
                else
                {
                    delete item.option
                }
            },
            editRoleOption:function (item) {
                var _this=this;
                var child=$.showBox(this,require("component/roleOption.vue"),{
                    hudremove:true,
                    data:item.option
                });
                child.$on("save",function (val) {
                    item.option=val;
                })
            }
        }
    }
</script>
