<template>
    <el-row class="row">
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px;font-size: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;">
            <el-col class="col" :span="8" style="border-right: 1px gray solid">
                项目:{{projectCount}}
            </el-col>
            <el-col class="col" :span="8" style="border-right: 1px gray solid">
                接口:{{interfaceCount}}
            </el-col>
            <el-col class="col" :span="8">
                用户:{{userCount}}
            </el-col>
        </el-row>
        <el-form ref="form" label-width="100px" style="margin-top: 20px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;padding: 20px">
            <el-form-item label="名称" style="text-align: center">
                <el-input style="width: 80%" v-model="obj.name"></el-input>
            </el-form-item>
            <el-form-item label="简介" style="text-align: center">
                <el-input type="textarea" :rows="3" style="width: 80%;height: 80%;" v-model="obj.dis"></el-input>
            </el-form-item>
            <el-form-item label="团队ID" style="text-align: center">
                <div style="width: 80%;display: inline-block;text-align: left">
                    {{obj._id}}
                </div>
            </el-form-item>
            <el-form-item label="团队角色" style="text-align: center">
                <div style="width: 80%;display: inline-block;text-align: left">
                    {{ownRole?'所有者':(manageRole?'管理员':'普通成员')}}
                </div>
            </el-form-item>
            <el-form-item label="创建时间" style="text-align: center">
                <div style="width: 80%;display: inline-block;text-align: left">
                    {{obj.createdAt}}
                </div>
                <el-button type="danger" style="width: 90px;position: absolute;right: 50px" @click.prevent="removeTeam" :loading="deletePending">
                    {{ownRole?'删除团队':'退出团队'}}
                </el-button>
                <el-button type="primary" style="width: 80px;position: absolute;right: 160px" @click.prevent="saveInfo" :loading="infoPending" v-if="manageRole">
                    保存
                </el-button>
                <el-button type="primary" style="width: 80px;position: absolute;right: 270px" @click.prevent="transfer" v-if="ownRole">
                    转让
                </el-button>
            </el-form-item>
        </el-form>
        <el-row class="row" style="border-radius: 5px;box-shadow: 0px 2px 2px #888888;background-color: white;padding: 20px;margin-top: 20px;">
            <el-collapse v-loading="moreLoading">
                <el-collapse-item>
                    <template slot="title">
                        <span style="font-size: 15px">
                            团队公告
                        </span>&nbsp;&nbsp;&nbsp;
                        <el-button type="text" icon="plus" @click.stop="addNotice" v-if="manageRole"></el-button>
                    </template>
                    <template v-for="(item,index) in notice">
                        <el-row class="row">
                            <el-row class="row" style="font-size: 17px">
                                {{item.content}}
                            </el-row>
                            <el-row class="row" style="color: gray">
                                {{item.date}}&nbsp;&nbsp;&nbsp;
                                <el-button type="text" size="small" style="color:#FF4949" icon="delete2" @click="removeNotice(item,index)" titile="删除">

                                </el-button>
                            </el-row>
                        </el-row>
                    </template>
                    <el-row class="row" style="height: 30px;line-height: 30px;text-align: center;color: gray;border-top: 1px lightgray solid;cursor:pointer" v-if="more && notice.length>0" @click.native="moreNotice">
                        获取更多
                    </el-row>
                </el-collapse-item>
            </el-collapse>
        </el-row>
    </el-row>
</template>


<script>
    var sessionChange=require("../../mixins/session");
    module.exports={
        data:function () {
            return {
                infoPending:false,
                deletePending:false,
                moreLoading:false,
                page:0,
                more:true
            }
        },
        mixins:[sessionChange],
        computed:{
            obj:function () {
                return this.$store.state.team;
            },
            projectCount:function () {
                return this.$store.getters.projectCount;
            },
            interfaceCount:function () {
                return this.$store.getters.interfaceCount;
            },
            userCount:function () {
                return this.$store.getters.userCount;
            },
            notice:function () {
                return this.$store.state.notice
            },
            ownRole:function () {
                return this.$store.getters.ownRole;
            },
            manageRole:function () {
                return this.$store.getters.manageRole;
            }
        },
        methods:{
            saveInfo:function () {
                var _this=this;
                this.infoPending=true;
                net.post("/team/save",{
                    id:session.get("teamId"),
                    dis:_this.$store.state.team.dis,
                    name:_this.$store.state.team.name
                }).then(function (data) {
                    _this.infoPending=false;
                    if(data.code)
                    {
                        session.set("teamName",data.data.name);
                        _this.$root.session.teamName=data.data.name;
                        $.notify("修改成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            removeTeam:function () {
                var _this=this;
                if(this.ownRole)
                {
                    $.confirm("确定删除该团队？",function () {
                        _this.deletePending=true;
                        net.delete("/team/item",{
                            id:session.get("teamId")
                        }).then(function (data) {
                            _this.deletePending=false;
                            if(data.code==200)
                            {
                                $.notify("删除成功",1);
                                setTimeout(function () {
                                    location.href="../../project/project.html"
                                },1500);

                            }
                        })
                    })
                }
                else
                {
                    $.confirm("确定退出该团队？你同时也会退出团队中的项目",function () {
                        _this.deletePending=true;
                        net.delete("/team/projectuser",{
                            id:session.get("teamId"),
                            user:session.get("id")
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                if(data.data.length>0)
                                {
                                    _this.deletePending=false;
                                    var child=$.showBox(_this,require("./teamUserOwner.vue"),{
                                        arr:data.data,
                                        user:session.get("id"),
                                        self:1
                                    })
                                    child.$on("remove",function () {
                                        setTimeout(function () {
                                            location.href="../../project/project.html"
                                        },1500);
                                    })
                                }
                                else
                                {
                                    net.delete("/team/user",{
                                        id:session.get("teamId"),
                                        user:session.get("id"),
                                        self:1
                                    }).then(function (data) {
                                        _this.deletePending=false;
                                        if(data.code==200)
                                        {
                                            $.notify("删除成功",1);
                                            setTimeout(function () {
                                                location.href="../../project/project.html"
                                            },1500);
                                        }
                                        else
                                        {
                                            $.notify(data.msg,0);
                                        }
                                    })
                                }
                            }
                            else
                            {
                                _this.deletePending=false;
                                $.notify(data.msg,0);
                            }
                        })
                    })
                }
            },
            removeNotice:function (item,index) {
                var _this=this;
                $.confirm("是否删除该公告?",function () {
                    net.delete("/team/notice",{
                        id:session.get("teamId"),
                        notice:item._id
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.$store.state.notice.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            moreNotice:function () {
                var _this=this;
                this.moreLoading=true;
                net.get("/team/notice",{
                    id:session.get("teamId"),
                    page:++_this.page
                }).then(function (data) {
                    _this.moreLoading=false;
                    if(data.code==200)
                    {
                        if(data.data.length>0)
                        {
                            _this.$store.state.notice.concat(data.data);
                        }
                        else
                        {
                            _this.more=false;
                            $.tip("已经到最底部啦",1);
                        }
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            addNotice:function () {
                var _this=this;
                $.inputMul(this,"请输入公告",function (val) {
                    if(!val)
                    {
                        $.tip("请输入公告",0);
                        return false;
                    }
                    net.post("/team/notice",{
                        id:session.get("teamId"),
                        content:val
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            $.notify("添加成功",1);
                            _this.$store.state.notice.unshift(data.data);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            transfer:function () {
                $.startHud();
                var _this=this;
                net.get("/team/user",{
                    id:session.get("teamId"),
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./teamTransfer.vue"),{
                            arr:data.data
                        });
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        created:function () {

        }
    }
</script>










