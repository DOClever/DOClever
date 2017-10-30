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
                    <el-select v-model="type" style="width: 90%">
                        <el-option label="今日创建" :value="0"></el-option>
                        <el-option label="所有项目" :value="1"></el-option>
                    </el-select>
                </el-col>
                <el-col class="col" :span="16">
                    <el-input style="width: 80%" placeholder="请输入你要查找的项目" v-model="project" v-if="type==1"></el-input>
                    <span v-else>
                        &nbsp;
                    </span>
                </el-col>
                <el-col class="col" :span="4">
                    <el-button type="primary" @click="$refs.page.init()">查询</el-button>
                </el-col>
            </el-row>
            <table class="table-hover" style="width: 100%">
                <thead>
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
                    公开
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
                            {{item.interfaceCount}}
                        </td>
                        <td style="width: 10%">
                            {{item.userCount}}
                        </td>
                        <td style="width: 10%">
                            {{item.public?"公开":"不公开"}}
                        </td>
                        <td style="width: 10%">
                            <el-dropdown>
                                <el-button type="text" class="el-dropdown-link">
                                    操作<i class="el-icon-caret-bottom el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="edit(item,index)">编辑</el-dropdown-item>

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
    var page=require("../../component/page.vue");
    module.exports={
        data:function () {
            return {
                type:0,
                project:""
            }
        },
        computed:{
            total:function () {
                return this.$store.state.project.total;
            },
            create:function () {
                return this.$store.state.project.todayCreate;
            },
            list:function () {
                return this.$store.state.project.list;
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
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.showBox(_this.$root,require("./projectEdit.vue"),{
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
                $.confirm("是否删除改项目？",function () {
                    $.startHud();
                    _this.$store.dispatch("removeProject",{
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
            }
        }
    }
</script>