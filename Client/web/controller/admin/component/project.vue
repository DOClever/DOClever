<template>
    <el-row class="row" style="padding-bottom: 10px">
        <el-tabs tab-position="left" v-model="tabType">
            <el-tab-pane :name="0" label="接口">
                <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        总共:{{interfaceTotal}}
                    </el-col>
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        今日新建:{{interfaceCreate}}
                    </el-col>
                </el-row>
                <el-row class="row" style="text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;margin-top: 20px">
                    <el-row class="row" style="height: 50px;line-height: 50px;border-bottom:1px lightgray solid">
                        <el-col class="col" :span="4">
                            <el-select size="small" v-model="interfaceType" style="width: 90%">
                                <el-option label="今日创建" :value="0"></el-option>
                                <el-option label="所有项目" :value="1"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="col" :span="16">
                            <el-input size="small" style="width: 80%" placeholder="请输入你要查找的项目" v-model="project" v-if="interfaceType==1"></el-input>
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
                            ID
                        </th>
                        <th>
                            项目名
                        </th>
                        <th>
                            创建时间
                        </th>
                        <th>
                            创建者
                        </th>
                        <th>
                            接口数
                        </th>
                        <th>
                            用户数
                        </th>
                        <th>
                            团队
                        </th>
                        <th>
                            公开
                        </th>
                        <th>
                            操作
                        </th>
                        </thead>
                        <tbody>
                        <template v-for="(item,index) in interfaceList">
                            <tr style="text-align: center;vertical-align: middle" :key="item._id">
                                <td style="width: 10%">
                                    {{item._id}}
                                </td>
                                <td style="width: 10%">
                                    {{item.name}}
                                </td>
                                <td style="width: 15%">
                                    {{item.createdAt}}
                                </td>
                                <td style="width: 15%">
                                    {{item.owner.name}}
                                </td>
                                <td style="width: 10%">
                                    {{item.interfaceCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.userCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.team?item.team.name:"无"}}
                                </td>
                                <td style="width: 10%">
                                    {{item.public?"公开":"不公开"}}
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
                                            <el-dropdown-item v-if="item.team" @click.native="quit(item,index)">退出团队</el-dropdown-item>
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
                                <page @change="changeInterfacePage" ref="page"></page>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :name="1" label="文档">
                <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        总共:{{docTotal}}
                    </el-col>
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        今日新建:{{docCreate}}
                    </el-col>
                </el-row>
                <el-row class="row" style="text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;margin-top: 20px">
                    <el-row class="row" style="height: 50px;line-height: 50px;border-bottom:1px lightgray solid">
                        <el-col class="col" :span="4">
                            <el-select size="small" v-model="interfaceType" style="width: 90%">
                                <el-option label="今日创建" :value="0"></el-option>
                                <el-option label="所有项目" :value="1"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="col" :span="16">
                            <el-input size="small" style="width: 80%" placeholder="请输入你要查找的项目" v-model="project" v-if="interfaceType==1"></el-input>
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
                            ID
                        </th>
                        <th>
                            项目名
                        </th>
                        <th>
                            创建时间
                        </th>
                        <th>
                            创建者
                        </th>
                        <th>
                            文档数
                        </th>
                        <th>
                            用户数
                        </th>
                        <th>
                            团队
                        </th>
                        <th>
                            公开
                        </th>
                        <th>
                            操作
                        </th>
                        </thead>
                        <tbody>
                        <template v-for="(item,index) in docList">
                            <tr style="text-align: center;vertical-align: middle" :key="item._id">
                                <td style="width: 10%">
                                    {{item._id}}
                                </td>
                                <td style="width: 10%">
                                    {{item.name}}
                                </td>
                                <td style="width: 15%">
                                    {{item.createdAt}}
                                </td>
                                <td style="width: 15%">
                                    {{item.owner.name}}
                                </td>
                                <td style="width: 10%">
                                    {{item.docCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.userCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.team?item.team.name:"无"}}
                                </td>
                                <td style="width: 10%">
                                    {{item.public?"公开":"不公开"}}
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
                                            <el-dropdown-item v-if="item.team" @click.native="quit(item,index)">退出团队</el-dropdown-item>
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
                                <page @change="changeInterfacePage" ref="page"></page>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :name="2" label="测试">
                <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        总共:{{testTotal}}
                    </el-col>
                    <el-col class="col" :span="12" style="border-right: 1px gray solid">
                        今日新建:{{testCreate}}
                    </el-col>
                </el-row>
                <el-row class="row" style="text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;margin-top: 20px">
                    <el-row class="row" style="height: 50px;line-height: 50px;border-bottom:1px lightgray solid">
                        <el-col class="col" :span="4">
                            <el-select size="small" v-model="interfaceType" style="width: 90%">
                                <el-option label="今日创建" :value="0"></el-option>
                                <el-option label="所有项目" :value="1"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="col" :span="16">
                            <el-input size="small" style="width: 80%" placeholder="请输入你要查找的项目" v-model="project" v-if="interfaceType==1"></el-input>
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
                            ID
                        </th>
                        <th>
                            项目名
                        </th>
                        <th>
                            创建时间
                        </th>
                        <th>
                            创建者
                        </th>
                        <th>
                            用例数
                        </th>
                        <th>
                            用户数
                        </th>
                        <th>
                            团队
                        </th>
                        <th>
                            公开
                        </th>
                        <th>
                            操作
                        </th>
                        </thead>
                        <tbody>
                        <template v-for="(item,index) in testList">
                            <tr style="text-align: center;vertical-align: middle" :key="item._id">
                                <td style="width: 10%">
                                    {{item._id}}
                                </td>
                                <td style="width: 10%">
                                    {{item.name}}
                                </td>
                                <td style="width: 15%">
                                    {{item.createdAt}}
                                </td>
                                <td style="width: 15%">
                                    {{item.owner.name}}
                                </td>
                                <td style="width: 10%">
                                    {{item.testCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.userCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.team?item.team.name:"无"}}
                                </td>
                                <td style="width: 10%">
                                    {{item.public?"公开":"不公开"}}
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
                                            <el-dropdown-item v-if="item.team" @click.native="quit(item,index)">退出团队</el-dropdown-item>
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
                                <page @change="changeInterfacePage" ref="page"></page>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>


<script>
    var page=require("component/page.vue");
    var projectAdd=require("./projectAdd.vue");
    var editProjectUser=require("./projectUserEdit.vue");
    module.exports={
        data:function () {
            return {
                interfaceType:0,
                project:"",
                tabType:0
            }
        },
        computed:{
            interfaceTotal:function () {
                return this.$store.state.project.interface.total;
            },
            interfaceCreate:function () {
                return this.$store.state.project.interface.todayCreate;
            },
            docTotal:function () {
                return this.$store.state.project.doc.total;
            },
            docCreate:function () {
                return this.$store.state.project.doc.todayCreate;
            },
            testTotal:function () {
                return this.$store.state.project.test.total;
            },
            testCreate:function () {
                return this.$store.state.project.test.todayCreate;
            },
            interfaceList:function () {
                return this.$store.state.project.interface.list;
            },
            docList:function () {
                return this.$store.state.project.doc.list;
            },
            testList:function () {
                return this.$store.state.project.test.list;
            }
        },
        components:{
            "page":page
        },
        methods:{
            edit:function (item,index) {
                var _this=this;
                $.startHud();
                net.get("/admin/project",{
                    id:item._id,
                    category:this.tabType
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this.$root,require("./projectEdit.vue"),{
                            propObj:data.data,
                            category:_this.tabType
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
                $.confirm("是否删除改项目？",function () {
                    $.startHud();
                    _this.$store.dispatch("removeProject",{
                        id:item._id,
                        index:index,
                        category:_this.tabType
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
            changeInterfacePage:function (page) {
                var query={
                    page:page,
                    type:this.interfaceType,
                    category:this.tabType
                }
                if(this.project)
                {
                    query.key=this.project;
                }
                $.startHud();
                this.$store.dispatch("projectList",query).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                });
            },
            add:function () {
                $.showBox(this.$root,projectAdd,{
                    category:this.tabType
                });
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
                    _this.$store.dispatch("setProjectOwner",{
                        project:item._id,
                        user:val.value,
                        category:_this.tabType
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
                this.$store.dispatch("projectUserList",{
                    id:item._id,
                    category:this.tabType
                }).then(function (data) {
                    if(data.code==200)
                    {
                        $.showBox(_this.$root,editProjectUser,{
                            propObj:data.data,
                            projectId:item._id,
                            category:_this.tabType
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            quit:function (item,index) {
                var _this=this;
                $.confirm("是否确定退出团队",function () {
                    $.startHud();
                    _this.$store.dispatch("teamRemoveProject",{
                        team:item.team._id,
                        project:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("退出成功",1);
                            item.team=null;
                            delete item.team;
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