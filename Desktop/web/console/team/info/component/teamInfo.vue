<template>
    <el-row class="row" style="height: calc(100vh - 115px);overflow-y: auto;padding:10px 10px 50px 10px" id="teamBasicInfo">
        <el-row class="row" style="text-align: center;height: 100px;font-size: 30px;cursor: pointer">
            <el-col class="col" :span="7">
                <el-row class="row" style="width: 90%;height: 100%;border: 1px #e1e1e1 solid;background-color: white;border-radius: 5px;padding-top: 30px;padding-bottom: 30px">
                    <el-tooltip class="item" effect="dark" content="接口项目数" placement="bottom">
                        <el-col class="col" :span="12" style="border-right: 1px lightgray solid;line-height: 40px">
                            {{projectCount}}
                        </el-col>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="接口数" placement="bottom">
                        <el-col class="col" :span="12" style="line-height: 40px">
                            {{interfaceCount}}
                        </el-col>
                    </el-tooltip>
                    <div style="position: absolute;top:5px;left: 10px;color: gray;font-size: 12px;line-height: normal">
                        接口:
                    </div>
                </el-row>
            </el-col>
            <el-col class="col" :span="7" >
                <el-row class="row" style="width: 90%;height: 100%;border: 1px #e1e1e1 solid;background-color: white;border-radius: 5px;padding-top: 30px;padding-bottom: 30px">
                    <el-tooltip class="item" effect="dark" content="文档项目数" placement="bottom">
                        <el-col class="col" :span="12" style="border-right: 1px lightgray solid;line-height: 40px">
                            {{docProjectCount}}
                        </el-col>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="文档数" placement="bottom">
                        <el-col class="col" :span="12" style="line-height: 40px">
                            {{docCount}}
                        </el-col>
                    </el-tooltip>
                    <div style="position: absolute;top:5px;left: 10px;color: gray;font-size: 12px;line-height: normal">
                        文档:
                    </div>
                </el-row>
            </el-col>
            <el-col class="col" :span="7">
                <el-row class="row" style="width: 90%;height: 100%;border: 1px #e1e1e1 solid;background-color: white;border-radius: 5px;line-height: 100px">
                    {{userCount}}
                    <div style="position: absolute;top:5px;left: 10px;color: gray;font-size: 12px;line-height: normal">
                        成员:
                    </div>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 20px;">
            <el-row class="row" style="height: 40px;line-height: 40px;padding-left: 20px;color: #17b9e6">
                团队概况
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 20px 20px">
                <el-form ref="form" label-width="100px" label-position="top">
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="名称">
                                <el-input size="small" style="width: 90%" v-model="obj.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="简介">
                                <el-tooltip class="item" effect="dark" :content="obj.dis" placement="bottom" :disabled="!obj.dis">
                                    <el-input size="small" style="width: 90%;" v-model="obj.dis">
                                        <i slot="suffix" class="el-input__icon el-icon-edit" @click="editDis" style="cursor: pointer"></i>
                                    </el-input>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="团队ID">
                                <div style="width: 90%;">
                                    {{obj._id}}
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="团队角色">
                                <div style="width: 90%;">
                                    {{ownRole?'所有者':(manageRole?'管理员':'普通成员')}}
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="创建时间">
                                <div style="width: 80%;display: inline-block;text-align: left">
                                    {{obj.createdAt}}
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="margin-top: 10px">
                        <el-button size="mini" type="primary" @click.prevent="saveInfo" :loading="infoPending" v-if="manageRole">
                            保存
                        </el-button>
                        <el-button size="mini" type="primary" @click.prevent="transfer" v-if="ownRole">
                            转让
                        </el-button>
                        <el-button size="mini" type="danger" @click.prevent="removeTeam" :loading="deletePending">
                            {{ownRole?'删除团队':'退出团队'}}
                        </el-button>
                    </el-row>
                </el-form>
            </el-row>
        </el-row>
        <el-row class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 20px;">
            <el-row class="row" style="height: 40px;line-height: 40px;padding-left: 20px;color: #17b9e6">
                团队公告
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 20px 20px">
                <el-button type="primary" size="mini" @click.stop="addNotice" v-if="manageRole" style="margin-bottom: 10px">新增</el-button>
                <template v-for="n in arrLength">
                    <el-row class="row" style="height: 120px">
                        <template v-for="n1 in 4">
                            <el-col class="col" :span="6" v-if="notice[(n-1)*4+(n1-1)]">
                                <el-row class="row" style="margin-top: 10px;margin-left: 10px;width: calc(100% - 20px);height: 100px;border: 1px lightgray solid;border-radius: 5px">
                                    <el-row class="row" style="height: 70px;padding: 10px;font-size: 13px;overflow: auto;" :title="notice[(n-1)*4+(n1-1)].content">
                                        {{notice[(n-1)*4+(n1-1)].content}}
                                    </el-row>
                                    <el-row class="row" style="height: 30px;line-height: 30px;padding-left: 10px">
                                        <el-col class="col" :span="18" style="color: gray;font-size: 12px">
                                            {{notice[(n-1)*4+(n1-1)].date}}
                                        </el-col>
                                        <el-col class="col" :span="6" style="text-align: right;padding-right: 10px">
                                            <el-button type="text" size="mini" @click="removeNotice(notice[(n-1)*4+(n1-1)],(n-1)*4+(n1-1))" icon="el-icon-delete" style="color: red">
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </el-row>
                            </el-col>
                        </template>
                    </el-row>
                </template>
            </el-row>
        </el-row>
    </el-row>
</template>

<style>
    #teamBasicInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #teamBasicInfo .el-form-item {
        margin-bottom: 0;
    }
</style>

<script>
    var sessionChange=require("common/mixins/session");
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
            arrLength:function () {
                var val=this.notice.length/4;
                return Math.floor(val)===val?val:(Math.floor(val)+1)
            },
            obj:function () {
                return this.$store.state.team;
            },
            projectCount:function () {
                return this.$store.getters.projectCount;
            },
            interfaceCount:function () {
                return this.$store.getters.interfaceCount;
            },
            docProjectCount:function () {
                return this.$store.getters.docProjectCount;
            },
            docCount:function () {
                return this.$store.getters.docCount;
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
                    id:this.$store.state.teamId,
                    dis:_this.$store.state.team.dis,
                    name:_this.$store.state.team.name
                }).then(function (data) {
                    _this.infoPending=false;
                    if(data.code)
                    {
                        session.set("teamName",data.data.name);
                        _this.$root.session.teamName=data.data.name;
                        $.tip("修改成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0);
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
                            id:_this.$store.state.teamId
                        }).then(function (data) {
                            _this.deletePending=false;
                            if(data.code==200)
                            {
                                $.tip("删除成功",1);
                                window.store.state.event.$emit("closeSider");
                                window.store.dispatch("init")

                            }
                        })
                    })
                }
                else
                {
                    $.confirm("确定退出该团队？你同时也会退出团队中的项目",function () {
                        _this.deletePending=true;
                        net.delete("/team/projectuser",{
                            id:_this.$store.state.teamId,
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
                                        window.store.state.event.$emit("closeSider");
                                        window.store.dispatch("init")
                                    })
                                }
                                else
                                {
                                    net.delete("/team/user",{
                                        id:_this.$store.state.teamId,
                                        user:session.get("id"),
                                        self:1
                                    }).then(function (data) {
                                        _this.deletePending=false;
                                        if(data.code==200)
                                        {
                                            $.tip("退出成功",1);
                                            window.store.state.event.$emit("closeSider");
                                            window.store.dispatch("init")
                                        }
                                        else
                                        {
                                            $.tip(data.msg,0);
                                        }
                                    })
                                }
                            }
                            else
                            {
                                _this.deletePending=false;
                                $.tip(data.msg,0);
                            }
                        })
                    })
                }
            },
            removeNotice:function (item,index) {
                var _this=this;
                $.confirm("是否删除该公告?",function () {
                    net.delete("/team/notice",{
                        id:_this.$store.state.teamId,
                        notice:item._id
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            $.tip("删除成功",1);
                            _this.$store.state.notice.splice(index,1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            moreNotice:function () {
                var _this=this;
                this.moreLoading=true;
                net.get("/team/notice",{
                    id:this.$store.state.teamId,
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
                        $.tip(data.msg,0);
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
                        id:_this.$store.state.teamId,
                        content:val
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            $.tip("添加成功",1);
                            _this.$store.state.notice.unshift(data.data);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            transfer:function () {
                $.startHud();
                var _this=this;
                net.get("/team/user",{
                    id:this.$store.state.teamId,
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
                        $.tip(data.msg,0);
                    }
                })
            },
            editDis:function () {
                var _this=this;
                $.inputMul(this,"编辑简介",function (val) {
                    _this.obj.dis=val;
                    return true;
                },1,this.obj.dis)
            },
        },
        created:function () {

        }
    }
</script>










