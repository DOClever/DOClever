<template>
    <div style="width: 100%">
        <table width="100%" class="table-hover">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle;height: 80px">
                    <td style="width: 15%">
                        <img v-proxy="item.user.photo" style="border-radius: 30px"  width="60" height="60">
                    </td>
                    <td style="width: 50%;text-align: center">
                        {{item.user.name}}
                    </td>
                    <td style="width: 20%;text-align: center">
                        <el-select v-model="item.role" @input="editRole(item)" style="width: 90%">
                            <el-option :value="1" label="观察者"></el-option>
                            <el-option :value="0" label="管理员"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 15%;text-align: center">
                        <el-button  style="color: red;font-size: 15px" size="small" icon="close" @click="remove(item,index)" type="text"></el-button>
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script>
    var proxyImg=require("../director/proxyImg")
    module.exports={
        props:["arr"],
        data:function () {
            return {

            }
        },
        directives:{
            proxy:proxyImg
        },
        methods:{
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否踢出该成员！",function () {
                    var loading=_this.$loading({fullscreen:true});
                    net.delete("/project/member",{
                        id:session.get("projectId"),
                        user:item.user._id
                    }).then(function (data) {
                        loading.close();
                        if(data.code==200)
                        {
                            $.notify("踢出成功",1);
                            _this.arr.splice(index,1)
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            editRole:function (item) {
                var _this=this;
                var loading=_this.$loading({fullscreen:true});
                net.put("/project/role",{
                    id:session.get("projectId"),
                    user:item.user._id,
                    role:item.role
                }).then(function (data) {
                    loading.close();
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
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
