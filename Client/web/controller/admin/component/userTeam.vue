<template>
    <el-dialog title="用户团队"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-tabs type="card">
            <el-tab-pane label="创建" style="height: 500px;overflow-y: auto">
                <table class="table-hover" style="width: 100%;">
                    <thead>
                    <th>
                        名称
                    </th>
                    <th>
                        描述
                    </th>
                    <th>
                        创建时间
                    </th>
                    <th>
                        用户数
                    </th>
                    <th>
                        项目数
                    </th>
                    <th>
                        操作
                    </th>
                    </thead>
                    <template v-for="(item,index) in obj.own">
                        <tr style="height: 50px;text-align: center;vertical-align: middle">
                            <td style="width: 20%">
                                {{item.name}}
                            </td>
                            <td style="width: 20%">
                                {{item.dis?item.dis:"无"}}
                            </td>
                            <td style="width: 20%">
                                {{item.createdAt}}
                            </td>
                            <td style="width: 10%">
                                {{item.userCount}}
                            </td>
                            <td style="width: 10%">
                                {{item.projectCount}}
                            </td>
                            <td style="width: 10%">
                                <el-button size="mini" type="text" @click="transfer(item,index)" title="转让"><i class="fa fa-sign-in"></i></el-button>&nbsp;&nbsp;
                                <el-button size="mini" type="text" icon="el-icon-close" style="color: red" @click="remove(item,index)" title="删除"></el-button>
                            </td>
                        </tr>
                    </template>
                </table>
            </el-tab-pane>
            <el-tab-pane label="加入" style="height: 500px;overflow-y: auto">
                <table class="table-hover" style="width: 100%;">
                    <thead>
                    <th>
                        名称
                    </th>
                    <th>
                        描述
                    </th>
                    <th>
                        创建人
                    </th>
                    <th>
                        创建时间
                    </th>
                    <th>
                        用户数
                    </th>
                    <th>
                        项目数
                    </th>
                    <th>
                        角色
                    </th>
                    <th>
                        操作
                    </th>
                    </thead>
                    <template v-for="(item,index) in obj.join">
                        <tr style="height: 50px;text-align: center;vertical-align: middle">
                            <td style="width: 10%">
                                {{item.name}}
                            </td>
                            <td style="width: 15%">
                                {{item.dis?item.dis:"无"}}
                            </td>
                            <td style="width: 10%">
                                {{item.owner.name}}
                            </td>
                            <td style="width: 15%">
                                {{item.createdAt}}
                            </td>
                            <td style="width: 10%">
                                {{item.userCount}}
                            </td>
                            <td style="width: 10%">
                                {{item.projectCount}}
                            </td>

                            <td style="width: 20%">
                                <el-select size="small" v-model="item.role" @input="role(item,index)" style="width: 60%">
                                    <el-option label="管理员" :value="0"></el-option>
                                    <el-option label="普通成员" :value="1"></el-option>
                                </el-select>
                            </td>
                            <td style="width: 10%">
                                <el-button size="mini" type="text" icon="el-icon-close" style="color: red" @click="quit(item,index)" title="退出"></el-button>
                            </td>
                        </tr>
                    </template>
                </table>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
    var roleOption=require("component/roleOption.vue")
    module.exports={
        props:["propObj","user"],
        data:function () {
            return {
                showDialog:false,
                obj:this.propObj
            }
        },
        computed:{
            ownTabLabel:function () {
                return "创建("+this.obj.own.length+")"
            },
            joinTabLabel:function () {
                return "创建("+this.obj.join.length+")"
            }
        },
        methods:{
            transfer:function (item,index) {
                var _this=this;
                $.input("请输入转让的用户名",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入用户名",0);
                        return false;
                    }
                    $.startHud();
                    net.put("/admin/userteamown",{
                        id:item._id,
                        user:val.value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("转让成功",1);
                            _this.obj.own.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否删除该团队",function () {
                    $.startHud();
                    net.delete("/admin/team",{
                        id:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.obj.own.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            quit:function (item,index) {
                var _this=this;
                $.confirm("是否退出该团队",function () {
                    $.startHud();
                    net.put("/admin/userquitteam",{
                        id:item._id,
                        user:_this.user._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("退出成功",1);
                            _this.obj.join.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            role:function (item,index) {
                var _this=this;
                $.startHud();
                net.put("/admin/teamuser",{
                    id:item._id,
                    user:this.user._id,
                    role:item.role
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            }
        }
    }
</script>