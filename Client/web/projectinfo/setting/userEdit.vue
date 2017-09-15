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
                    <td style="width: 15%;text-align: center">
                        <el-select v-model="item.role" @input="editRole(item)" style="width: 90%">
                            <el-option :value="1" label="观察者"></el-option>
                            <el-option :value="0" label="管理员"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 10%;text-align: center">
                        <el-button  style="font-size: 15px" size="small" @click="editRoleOption(item,index)" type="text" v-if="item.role==1">权限</el-button>
                    </td>
                    <td style="width: 10%;text-align: center">
                        <el-button  style="color:red;font-size: 15px" size="small" icon="close" @click="remove(item,index)" type="text"></el-button>
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script>
    var proxyImg=require("../../director/proxyImg")
    module.exports={
        data:function () {
            return {

            }
        },
        directives:{
            proxy:proxyImg
        },
        computed:{
            arr:function () {
                var arr=this.$store.getters.project.users.filter(function (obj) {
                    if(obj.user._id==session.get("id"))
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                })
                return arr;
            },
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
                            var index=-1;
                            _this.$store.getters.project.users.forEach(function (obj,i) {
                                if(obj.user._id==item.user._id)
                                {
                                    index=i;
                                }
                            })
                            if(index>-1)
                            {
                                _this.$store.getters.project.users.splice(index,1);
                            }
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
                        if(item.role==0)
                        {
                            delete item.option;
                        }
                        else
                        {
                            Vue.set(item,"option",{
                                "ie":0,
                                "te":0,
                                "gb":0,
                                "gs":0,
                                "gi":0,
                                "gd":0,
                                "ve":0,
                                "vr":0
                            })
                        }
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            editRoleOption:function (item) {
                var _this=this;
                var child=$.showBox(this,"roleOption",{
                    data:item.option
                });
                child.$on("save",function (val) {
                    var loading=_this.$loading({fullscreen:true});
                    net.put("/project/role",{
                        id:session.get("projectId"),
                        user:item.user._id,
                        role:item.role,
                        option:JSON.stringify(val)
                    }).then(function (data) {
                        loading.close();
                        if(data.code==200)
                        {
                            item.option=val;
                            $.notify("修改成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            }
        }
    }
</script>
