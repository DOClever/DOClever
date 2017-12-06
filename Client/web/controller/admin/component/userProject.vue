<template>
    <el-dialog title="用户项目"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
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
                            接口数
                        </th>
                        <th>
                            团队
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
                                {{item.interfaceCount}}
                            </td>
                            <td style="width: 10%">
                                {{item.team?item.team.name:"无"}}
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
                        接口数
                    </th>
                    <th>
                        团队
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
                            <td style="width: 10%">
                                {{item.dis?item.dis:"无"}}
                            </td>
                            <td style="width: 5%">
                                {{item.owner.name}}
                            </td>
                            <td style="width: 10%">
                                {{item.createdAt}}
                            </td>
                            <td style="width: 10%">
                                {{item.userCount}}
                            </td>
                            <td style="width: 10%">
                                {{item.interfaceCount}}
                            </td>
                            <td style="width: 10%">
                                {{item.team?item.team.name:"无"}}
                            </td>
                            <td style="width: 25%">
                                <el-select size="small" v-model="item.role" @input="role(item,index)" style="width: 60%">
                                    <el-option label="管理员" :value="0"></el-option>
                                    <el-option label="观察者" :value="1"></el-option>
                                </el-select>
                                &nbsp;
                                <el-button size="mini" v-if="item.role==1" type="text" @click="roleOption(item,index)">权限</el-button>
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
                    net.put("/admin/userprojectown",{
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
                $.confirm("是否删除该项目",function () {
                    $.startHud();
                    net.delete("/admin/project",{
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
                $.confirm("是否退出该项目",function () {
                    $.startHud();
                    net.put("/admin/userquitproject",{
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
                net.post("/admin/projectuserrole",{
                    id:item._id,
                    user:this.user._id,
                    role:item.role
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        if(item.role==0)
                        {
                            delete item.option;
                        }
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            roleOption:function (item,index) {
                var _this=this;
                var child=$.showBox(this.$root,roleOption,{
                    data:item.option,
                    hudremove:1
                });
                child.$on("save",function (data) {
                    Vue.set(item,"option",data);
                    net.post("/admin/projectuserrole",{
                        id:item._id,
                        user:_this.user._id,
                        role:item.role,
                        option:JSON.stringify(data)
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
                })
            }
        }
    }
</script>