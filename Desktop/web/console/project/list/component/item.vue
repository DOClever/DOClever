<template>
    <div style="width: 100%;">
        <table style="background-color: transparent;width: 100%;height: 100%" v-if="arr.length>0">
            <tbody>
            <tr v-for="n in arrLength">
                <td v-for="index in 5" style="padding: 10px;width: 20%;height: 120px">
                    <el-row v-if="arr[(n-1)*5+(index-1)]" :style="{borderRadius:'5px',color:'gray'}" style="text-align: center;height: 100%;cursor: pointer;border: 1px #ebebeb solid;" @click.native="info(arr[(n-1)*5+(index-1)])">
                        <el-row class="row" style="height: 65px;">
                            <div type="primary" size="small" style="width: 26px;height: 26px;line-height:26px;border-radius: 13px;display: inline-block;color:white;margin-top: 15px;font-size: 14px" :style="{backgroundColor:color(arr[(n-1)*5+(index-1)])}">
                                {{category=="interface"?"接":(category=="doc"?"文":"测")}}
                            </div>
                            <div style="font-size: 14px;color: black;display: table;table-layout: fixed;width: 100%;margin-top: 5px"><div style="display: table-cell;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">{{arr[(n-1)*5+(index-1)].name}}</div></div>
                        </el-row>
                        <el-row class="row" style="height: 30px;line-height: 30px;font-size: 13px;display: table;table-layout: fixed;">
                            <div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display: table-cell;height: 25px">
                                {{arr[(n-1)*5+(index-1)].dis?arr[(n-1)*5+(index-1)].dis:"&nbsp;"}}
                            </div>
                        </el-row>
                        <el-row class="row" style="height: 25px;line-height:25px;font-size: 12px;color: #b9b9b9;border-top: 1px lightgray solid;background-color: rgb(245,246,249)">
                            <el-col class="col" :span="12" style="border-right: 1px lightgray solid;">
                                {{"成员:"+arr[(n-1)*5+(index-1)].userCount}}
                            </el-col>
                            <el-col class="col" :span="12">
                                {{category=="interface"?("接口:"+arr[(n-1)*5+(index-1)].interfaceCount):(category=="doc"?("文档:"+arr[(n-1)*5+(index-1)].docCount):("用例:"+arr[(n-1)*5+(index-1)].testCount))}}
                            </el-col>
                        </el-row>
                        <el-dropdown style="position: absolute;right: 5px;top: 0px;" v-if="manageRole">
                            <el-button type="text" size="mini" icon="el-icon-setting" class="el-dropdown-link" style="font-size: 15px;color: #17b9e6" @click.stop="">
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="user(arr[(n-1)*5+(index-1)])">成员管理</el-dropdown-item>
                                <el-dropdown-item @click.native="quit(arr[(n-1)*5+(index-1)],(n-1)*5+(index-1))">踢出团队</el-dropdown-item>
                                <el-dropdown-item @click.native="remove(arr[(n-1)*5+(index-1)],(n-1)*5+(index-1))">删除项目</el-dropdown-item>
                                <el-dropdown-item @click.native="transfer(arr[(n-1)*5+(index-1)],(n-1)*5+(index-1))">指定所有者</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-row>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
    .el-row::after, .el-row::before {
        display: none;
    }
</style>
<script>
    var sessionChange=require("common/mixins/session");
    module.exports={
        props:["type","category"],
        data:function () {
            return {

            }
        },
        mixins:[sessionChange],
        computed:{
            arr:function () {
                if(this.category=="interface")
                {
                    if(this.type=="create")
                    {
                        return this.$store.state.projectCreateList;
                    }
                    else if(this.type=="join")
                    {
                        return this.$store.state.projectJoinList;
                    }
                    else if(this.type=="public")
                    {
                        return this.$store.state.projectPublicList;
                    }
                    else if(this.type=="team")
                    {
                        return this.$store.state.projectTeamList;
                    }
                }
                else if(this.category=="doc")
                {
                    if(this.type=="create")
                    {
                        return this.$store.state.docCreateList;
                    }
                    else if(this.type=="join")
                    {
                        return this.$store.state.docJoinList;
                    }
                    else if(this.type=="public")
                    {
                        return this.$store.state.docPublicList;
                    }
                    else if(this.type=="team")
                    {
                        return this.$store.state.docTeamList;
                    }
                }
                else if(this.category=="test")
                {
                    if(this.type=="create")
                    {
                        return this.$store.state.testCreateList;
                    }
                    else if(this.type=="join")
                    {
                        return this.$store.state.testJoinList;
                    }
                    else if(this.type=="team")
                    {
                        return this.$store.state.testTeamList;
                    }
                }
            },
            arrLength:function () {
                var val=this.arr.length/5;
                return Math.floor(val)===val?val:(Math.floor(val)+1)
            },
            manageRole:function () {
                if(this.session.teamId)
                {
                    return this.$store.getters.teamManageRole;
                }
                else
                {
                    return false;
                }
            }
        },
        methods:{
            info:function (item) {
                if(this.category=="interface" || (this.category=="doc" && item.role==0) || this.category=="test")
                {
                    this.$store.dispatch("info",{
                        id:item._id,
                        name:item.name,
                        type:this.category
                    })
                }
                else if(this.category=="doc" && item.role!=0)
                {
                    window.open($.basePath()+"read/read.html#"+item._id+encodeURIComponent(sessionStorage.getItem("baseUrl")),"_blank");
                }
            },
            changeSort:function () {
                this.$store.commit("changeSort",{
                    type:this.type,
                    category:this.category
                });
            },
            color:function (item) {
                if(item.own)
                {
                    return "#17b9e6"
                }
                else
                {
                    if(item.role==0)
                    {
                        return "#17b9e6"
                    }
                    else
                    {
                        return "#67C23A";
                    }
                }
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否确认删除项目，该项目下一切数据都会删除",function () {
                    var loading=_this.$loading({fullscreen:true});
                    var pro;
                    if(_this.category=="interface")
                    {
                        pro=net.delete("/project/item",{
                            id:item._id
                        })
                    }
                    else if(_this.category=="doc")
                    {
                        pro=net.delete("/doc/project",{
                            project:item._id
                        })
                    }
                    else if(_this.category=="test")
                    {
                        pro=net.delete("/test/project",{
                            project:item._id
                        })
                    }
                    pro.then(function (data) {
                        loading.close();
                        if(data.code==200)
                        {
                            $.tip("删除成功",1);
                            if(_this.category=="interface") {
                                _this.$store.state.projectTeamList.splice(index, 1);
                            }
                            else if(_this.category=="doc")
                            {
                                _this.$store.state.docTeamList.splice(index, 1);
                            }
                            else if(_this.category=="test")
                            {
                                _this.$store.state.testTeamList.splice(index, 1);
                            }
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            quit:function (item,index) {
                var _this=this;
                $.confirm("是否踢出该项目，该项目下数据会被保留",function () {
                    var loading=_this.$loading({fullscreen:true});
                    var pro;
                    if(_this.category=="interface")
                    {
                        pro=net.delete("/team/project",{
                            id:session.get("teamId"),
                            project:item._id
                        })
                    }
                    else if(_this.category=="doc")
                    {
                        pro=net.delete("/team/doc",{
                            id:session.get("teamId"),
                            project:item._id
                        })
                    }
                    else if(_this.category=="test")
                    {
                        pro=net.delete("/team/test",{
                            id:session.get("teamId"),
                            project:item._id
                        })
                    }
                    pro.then(function (data) {
                        loading.close();
                        if(data.code==200)
                        {
                            $.tip("踢出成功",1);
                            if(_this.category=="interface")
                            {
                                _this.$store.state.projectTeamList.splice(index,1);
                            }
                            else if(_this.category=="doc")
                            {
                                _this.$store.state.docTeamList.splice(index,1);
                            }
                            else if(_this.category=="test")
                            {
                                _this.$store.state.testTeamList.splice(index,1);
                            }
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            user:function (item) {
                $.startHud();
                var _this=this;
                var pro;
                if(this.category=="interface")
                {
                    pro=net.get("/team/projectuser",{
                        id:session.get("teamId"),
                        project:item._id
                    })
                }
                else if(this.category=="doc")
                {
                    pro=net.get("/team/docuser",{
                        id:session.get("teamId"),
                        project:item._id
                    })
                }
                else if(this.category=="test")
                {
                    pro=net.get("/team/testuser",{
                        id:session.get("teamId"),
                        project:item._id
                    })
                }
                pro.then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("../../../team/info/component/teamProjectUser.vue"),{
                            arr:data.data,
                            id:item._id,
                            type:_this.category
                        });
                        child.$on("update",function (arr) {
                            item.userCount=arr.length+1;
                            if(_this.category=="interface")
                            {
                                arr.forEach(function (obj) {
                                    if(obj.user==session.get("id"))
                                    {
                                        item.role=obj.role;
                                    }
                                })
                            }
                        })
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            transfer:function (item,index) {
                $.startHud();
                var _this=this;
                var pro;
                if(this.category=="interface")
                {
                    pro=net.get("/team/projectuser",{
                        id:session.get("teamId"),
                        project:item._id
                    })
                }
                else if(this.category=="doc")
                {
                    pro=net.get("/team/docuser",{
                        id:session.get("teamId"),
                        project:item._id
                    })
                }
                else if(this.category=="test")
                {
                    pro=net.get("/team/testuser",{
                        id:session.get("teamId"),
                        project:item._id
                    })
                }
                pro.then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("../../../team/info/component/projectTransfer.vue"),{
                            arr:data.data,
                            id:item._id,
                            type:_this.category
                        });
                        child.$on("userMinus",function () {
                            item.userCount--;
                        })
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            }
        }
    }
</script>
