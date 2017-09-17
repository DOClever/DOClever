<template>
    <div style="width: 100%;">
        <table style="background-color: transparent;width: 100%;height: 100%">
            <tbody>
            <template v-for="n in arrLength">
                <tr>
                    <template v-for="index in 4">
                        <td  style="padding: 10px;height: 150px;width: 25%">
                            <div v-if="arr[(n-1)*4+(index-1)]" class="item" :style="{backgroundImage: 'url(\'../pic/back'+index+'.jpg\')',borderRadius:'5px',color:'gray',fontSize:'25px',wordBreak: 'break-all',display:'table'}" @click="info(arr[(n-1)*4+(index-1)])">
                                <div style="display: table-cell;vertical-align: middle">
                                    {{arr[(n-1)*4+(index-1)].name}}
                                </div>
                                <el-row class="row" style="height: 30px;line-height:30px;font-size: 15px;color: gray;position: absolute;left: 0;bottom: 0;text-align: left;background-color: rgba(215,215,215,0.51)">
                                    &nbsp;{{"成员:"+arr[(n-1)*4+(index-1)].userCount}}&nbsp;
                                    {{"接口:"+arr[(n-1)*4+(index-1)].interfaceCount}}
                                    <el-dropdown style="float: right;height: 30px" v-if="manageRole">
                                        <el-button type="text" style="width:40px;height: 30px" class="el-dropdown-link" @click.stop="">
                                            管理
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native="user(arr[(n-1)*4+(index-1)])">成员管理</el-dropdown-item>
                                            <el-dropdown-item @click.native="quit(arr[(n-1)*4+(index-1)],(n-1)*4+(index-1))">踢出团队</el-dropdown-item>
                                            <el-dropdown-item @click.native="remove(arr[(n-1)*4+(index-1)],(n-1)*4+(index-1))">删除项目</el-dropdown-item>
                                            <el-dropdown-item @click.native="transfer(arr[(n-1)*4+(index-1)],(n-1)*4+(index-1))">指定所有者</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-row>
                            </div>
                        </td>
                    </template>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>
<style>
    .item{
        text-align: center;font-size:20px;color: #50a3ff;width: 100%;height: 100%;cursor: pointer;position: relative;box-shadow: 2px 2px 2px #888888;
    }
</style>
<script>
    var sessionChange=require("../../mixins/session");
    module.exports={
        data:function () {
            return {
            }
        },
        mixins:[sessionChange],
        computed:{
            arrLength:function () {
                return Math.floor(this.$store.state.project.length/4)+1
            },
            arr:function () {
                return this.$store.state.project
            },
            ownRole:function () {
                return this.$store.getters.ownRole;
            },
            manageRole:function () {
                return this.$store.getters.manageRole;
            }
        },
        methods:{
            info:function (item) {
                session.set("projectId",item._id);
                session.set("projectName",item.name);
                location.href="/html/web/projectinfo/projectinfo.html";
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否确认删除项目，该项目下一切数据都会删除",function () {
                    var loading=_this.$loading({fullscreen:true});
                    net.delete("/project/item",{
                        id:item._id
                    }).then(function (data) {
                        loading.close();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.$store.state.project.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            quit:function (item,index) {
                var _this=this;
                $.confirm("是否踢出该项目，该项目下数据会被保留",function () {
                    var loading=_this.$loading({fullscreen:true});
                    net.delete("/team/project",{
                        id:session.get("teamId"),
                        project:item._id
                    }).then(function (data) {
                        loading.close();
                        if(data.code==200)
                        {
                            $.notify("踢出成功",1);
                            _this.$store.state.project.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            user:function (item) {
                $.startHud();
                var _this=this;
                net.get("/team/projectuser",{
                    id:session.get("teamId"),
                    project:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,"teamProjectUser",{
                            arr:data.data,
                            id:item._id
                        },"team/component");
                        child.$on("update",function (arr) {
                            item.userCount=arr.length+1;
                            arr.forEach(function (obj) {
                                if(obj.user==session.get("id"))
                                {
                                    item.role=obj.role;
                                }
                            })
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            transfer:function (item,index) {
                $.startHud();
                var _this=this;
                net.get("/team/projectuser",{
                    id:session.get("teamId"),
                    project:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,"projectTransfer",{
                            arr:data.data,
                            id:item._id
                        },"team/component");
                        child.$on("userMinus",function () {
                            item.userCount--;
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        events:{

        }
    }
</script>
