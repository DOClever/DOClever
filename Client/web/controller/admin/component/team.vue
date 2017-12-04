<template>
    <el-row class="row" style="padding-bottom: 10px">
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
            <el-col class="col" :span="12" style="border-right: 1px gray solid">
                总共:{{total}}
            </el-col>
            <el-col class="col" :span="12" style="border-right: 1px gray solid">
                今日新建:{{create}}
            </el-col>
        </el-row>
        <el-row class="row" style="text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;margin-top: 20px">
            <el-row class="row" style="height: 50px;line-height: 50px;border-bottom:1px lightgray solid">
                <el-col class="col" :span="4">
                    <el-select size="small" v-model="type" style="width: 90%">
                        <el-option label="今日创建" :value="0"></el-option>
                        <el-option label="所有团队" :value="1"></el-option>
                    </el-select>
                </el-col>
                <el-col class="col" :span="16">
                    <el-input size="small" style="width: 80%" placeholder="请输入你要查找的项目" v-model="team" v-if="type==1"></el-input>
                    <span v-else>
                        &nbsp;
                    </span>
                </el-col>
                <el-col class="col" :span="2">
                    <el-button size="mini" type="primary" @click="$refs.page.init()">查询</el-button>
                </el-col>
                <el-col class="col" :span="2">
                    <el-button size="mini" type="primary" @click="add">新建</el-button>
                </el-col>
            </el-row>
            <table class="table-hover" style="width: 100%">
                <thead>
                <th>
                    团队名
                </th>
                <th>
                    创建时间
                </th>
                <th>
                    创建者
                </th>
                <th>
                    项目数
                </th>
                <th>
                    用户数
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
                            {{item.createdAt}}
                        </td>
                        <td style="width: 20%">
                            {{item.owner.name}}
                        </td>
                        <td style="width: 20%">
                            {{item.projectCount}}
                        </td>
                        <td style="width: 10%">
                            {{item.userCount}}
                        </td>
                        <td style="width: 10%">
                            <el-dropdown>
                                <el-button size="mini" type="text" class="el-dropdown-link">
                                    操作<i class="el-icon-caret-bottom el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="edit(item,index)">编辑</el-dropdown-item>
                                    <el-dropdown-item @click.native="own(item,index)">指定所有者</el-dropdown-item>
                                    <el-dropdown-item @click.native="user(item,index)">管理成员</el-dropdown-item>
                                    <el-dropdown-item @click.native="project(item,index)">管理项目</el-dropdown-item>
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
    var teamAdd=require("./teamAdd.vue");
    var teamUserEdit=require("./teamUserEdit.vue");
    var teamProjectEdit=require("./teamProjectEdit.vue");
    module.exports={
        data:function () {
            return {
                type:0,
                team:""
            }
        },
        computed:{
            total:function () {
                return this.$store.state.team.total;
            },
            create:function () {
                return this.$store.state.team.todayCreate;
            },
            list:function () {
                return this.$store.state.team.list;
            }
        },
        components:{
            "page":page
        },
        methods:{
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否删除改团队？",function () {
                    $.startHud();
                    _this.$store.dispatch("removeTeam",{
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
                if(this.team)
                {
                    query.key=this.team;
                }
                $.startHud();
                this.$store.dispatch("teamList",query).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                });
            },
            edit:function (item,index) {
                var _this=this;
                $.inputTwo(this.$root,"名称","描述","请输入名称","请输入描述",item.name,item.dis,function (title,content) {
                    if(!title)
                    {
                        $.notify("请输入名称",0);
                        return
                    }
                    _this.$store.dispatch("editTeamInfo",{
                        id:item._id,
                        name:title,
                        dis:content
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            $.notify("修改成功",1);
                            item.name=data.data.name
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                    return true;
                })
            },
            own:function (item,index) {
                var _this=this;
                $.input("请输入指定的所有者",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入指定的所有者",0);
                        return false;
                    }
                    $.startHud();
                    _this.$store.dispatch("setTeamOwner",{
                        id:item._id,
                        user:val.value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("指定成功",1);
                            item.owner=data.data;
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                    return true;
                })
            },
            user:function (item,index) {
                var _this=this;
                $.startHud();
                this.$store.dispatch("getTeamUserList",{
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this.$root,teamUserEdit,{
                            propObj:data.data,
                            teamId:item._id
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            project:function (item,index) {
                var _this=this;
                $.startHud();
                this.$store.dispatch("getTeamProjectList",{
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this.$root,teamProjectEdit,{
                            propObj:data.data,
                            teamId:item._id
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            add:function () {
                $.showBox(this.$root,teamAdd);
            },
        }
    }
</script>