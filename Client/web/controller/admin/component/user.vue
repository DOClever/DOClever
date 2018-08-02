<template>
    <el-row class="row" style="padding-bottom: 10px">
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
            <el-col class="col" :span="8" style="border-right: 1px gray solid">
                总共:{{total}}
            </el-col>
            <el-col class="col" :span="8" style="border-right: 1px gray solid">
                今日注册:{{register}}
            </el-col>
            <el-col class="col" :span="8">
                今日登陆:{{login}}
            </el-col>
        </el-row>
        <el-row class="row" style="text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;margin-top: 20px">
            <el-row class="row" style="height: 50px;line-height: 50px;border-bottom:1px lightgray solid">
                <el-col class="col" :span="4">
                    <el-select size="small" v-model="type" style="width: 90%">
                        <el-option label="今日注册" :value="0"></el-option>
                        <el-option label="今日登陆" :value="1"></el-option>
                        <el-option label="登陆最多" :value="2"></el-option>
                        <el-option label="活跃用户" :value="4"></el-option>
                        <el-option label="所有用户" :value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col class="col" :span="16">
                    <el-input size="small" style="width: 80%" placeholder="请输入你要查找的用户" v-model="user" v-if="type==3"></el-input>
                    <span v-else>
                        &nbsp;
                    </span>
                </el-col>
                <el-col class="col" :span="2">
                    <el-button size="mini" type="primary" @click="$refs.page.init()">查询</el-button>
                </el-col>
                <el-col class="col" :span="2">
                    <el-button size="mini" type="primary" @click="create">新建</el-button>
                </el-col>
            </el-row>
            <table class="table-hover" style="width: 100%">
                <thead>
                <th>
                    用户名
                </th>
                <th>
                    头像
                </th>
                <th>
                    注册时间
                </th>
                <th>
                    最后登陆
                </th>
                <th>
                    登陆次数
                </th>
                <th>
                    状态
                </th>
                <th>
                    操作
                </th>
                </thead>
                <tbody>
                    <template v-for="(item,index) in list">
                        <tr style="text-align: center;vertical-align: middle" :key="item._id">
                            <td style="width: 15%">
                                {{item.name}}
                            </td>
                            <td style="width: 15%">
                                <img v-proxy="item.photo" style="border-radius: 18px" width="36" height="36">
                            </td>
                            <td style="width: 20%">
                                {{item.createdAt}}
                            </td>
                            <td style="width: 20%">
                                {{item.lastLoginDate}}
                            </td>
                            <td style="width: 10%">
                                {{item.loginCount}}
                            </td>
                            <td style="width: 10%">
                                {{item.state?"启用":"禁用"}}
                            </td>
                            <td style="width: 10%">
                                <el-dropdown>
                                    <el-button size="mini" type="text" class="el-dropdown-link">
                                        操作<i class="el-icon-caret-bottom el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="edit(item,index)">编辑</el-dropdown-item>
                                        <el-dropdown-item @click.native="userProject(item,index)">项目</el-dropdown-item>
                                        <el-dropdown-item @click.native="userTeam(item,index)">团队</el-dropdown-item>
                                        <el-dropdown-item @click.native="remove(item,index)" style="color: red">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tfoot>
                <tr style="text-align: center;vertical-align: middle">
                    <td colspan="7">
                        <page @change="changePage" ref="page"></page>
                    </td>
                </tr>
                </tfoot>
            </table>
        </el-row>
    </el-row>
</template>


<script>
    var page=require("component/page.vue");
    var proxyImg=require("director/proxyImg.js");
    var userProject=require("./userProject.vue");
    var userTeam=require("./userTeam.vue");
    module.exports={
        data:function () {
            return {
                type:0,
                user:""
            }
        },
        computed:{
            total:function () {
                return this.$store.state.user.total;
            },
            register:function () {
                return this.$store.state.user.todayRegister;
            },
            login:function () {
                return this.$store.state.user.todayLogin;
            },
            list:function () {
                return this.$store.state.user.list;
            }
        },
        directives:{
            proxy:proxyImg
        },
        components:{
            "page":page
        },
        methods:{
            create:function () {
                $.showBox(this.$root,require("./userEdit.vue"));
            },
            edit:function (item,index) {
                var _this=this;
                $.startHud();
                net.get("/admin/userinfo",{
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this.$root,require("./userEdit.vue"),{
                            propObj:data.data
                        });
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否删除改用户？",function () {
                    $.startHud();
                    _this.$store.dispatch("removeUser",{
                        id:item._id,
                        index:index
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            changePage:function (page) {
                var query={
                    page:page,
                    type:this.type
                }
                if(this.user)
                {
                    query.key=this.user;
                }
                $.startHud();
                this.$store.dispatch("userList",query).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                });
            },
            userProject:function (item) {
                var _this=this;
                $.startHud();
                net.get("/admin/userprojectlist",{
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this.$root,userProject,{
                            propObj:data.data,
                            user:item
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            userTeam:function (item) {
                var _this=this;
                $.startHud();
                net.get("/admin/userteamlist",{
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this.$root,userTeam,{
                            propObj:data.data,
                            user:item
                        })
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