<template>
    <el-row class="row">
        <template v-if="bEmpty">
            <el-row class="row" style="text-align: center;margin-top: 100px;color: gray">
                <i class="fa fa-list-alt" style="font-size: 60px"></i><br><br>
                <span style="font-size: 14px">还没有团队，点击下方按钮新增或者导入团队</span><br><br>
                <el-button type="primary" size="small" @click="showAdd=true">
                    <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增团队
                </el-button>
                <el-button size="small" style="margin-left: 10px;" @click="showApply=true">
                    <i class="fa fa-user-o" style="font-weight:900"></i>&nbsp;申请团队
                </el-button>
            </el-row>
        </template>
        <tempalte v-else>
            <el-row class="row" style="height: 50px;line-height: 50px;padding-right: 20px">
                <el-button type="primary" size="small" style="margin-left: 20px;" @click="showAdd=true">
                    <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增团队
                </el-button>
                <el-button size="small" style="margin-left: 10px;" @click="showApply=true">
                    <strong><i class="fa fa-user-o" style="font-weight:900"></i></strong>&nbsp;申请团队
                </el-button>
                <el-button size="small" type="text" style="float: right;margin-right: 10px;margin-top: 15px;color: gray">
                    <div style="display: inline-block;height: 10px;width: 10px;border-radius: 5px;background-color: #67C23A;"></div>&nbsp;观察者
                </el-button>
                <el-button size="small" type="text" style="float: right;margin-right: 10px;margin-top: 15px;color: gray">
                    <div style="display: inline-block;height: 10px;width: 10px;border-radius: 5px;background-color: #17b9e6;"></div>&nbsp;管理员
                </el-button>
            </el-row>
            <el-row class="row" style="margin: 10px 20px 10px 20px;width: calc(100% - 40px);height: calc(100vh - 120px);overflow-y: auto">
                <expand :expand="1" style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);" v-if="arrCreate.length>0">
                    <div slot="title" style="font-size: 14px">
                        我创建的团队
                    </div>
                    <el-radio-group v-model="$store.state.teamCreateSort" size="mini" slot="append" style="margin-right: 20px" @change="changeCreateSort">
                        <el-radio-button :label="0">时间&nbsp;↓</el-radio-button>
                        <el-radio-button :label="1">名称&nbsp;↑</el-radio-button>
                    </el-radio-group>
                    <el-row class="row">
                        <list type="create" ref="createList"></list>
                    </el-row>
                </expand>
                <expand :expand="1" style="background-color: white;margin-top: 20px;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);" v-if="arrJoin.length>0">
                    <div slot="title" style="font-size: 14px">
                        我加入的团队
                    </div>
                    <el-radio-group v-model="$store.state.teamJoinSort" size="mini" slot="append" style="margin-right: 20px" @change="changeJoinSort">
                        <el-radio-button :label="0">时间&nbsp;↓</el-radio-button>
                        <el-radio-button :label="1">名称&nbsp;↑</el-radio-button>
                    </el-radio-group>
                    <el-row class="row">
                        <list type="join" ref="joinList"></list>
                    </el-row>
                </expand>
            </el-row>
        </tempalte>
        <el-dialog title="新建团队" :visible.sync="showAdd" width="50%" append-to-body>
            <el-form label-position="top" ref="form" label-width="100px">
                <el-form-item label="名称">
                    <el-input size="small" style="width: 100%"  v-model="name" placeholder="请输入新团队的名称"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input size="small" type="textarea" :rows="2"  style="width: 100%"  v-model="dis" placeholder="请输入新团队的简介"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showAdd = false">取 消</el-button>
            <el-button type="primary" @click="addTeam" :loading="addPending">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="团队申请" :visible.sync="showApply" width="50%" ref="apply" append-to-body>
            <el-form ref="form" label-width="100px">
                <el-form-item label="团队ID">
                    <el-input size="small" style="width: 80%"  v-model="applyName" placeholder="请输入你要申请的团队ID"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input size="small" type="textarea" :rows="2"  style="width: 80%"  v-model="applyDis" placeholder="请输入你要申请的备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showApply = false">取 消</el-button>
            <el-button type="primary" @click="applyTeam" :loading="applyPending">确 定</el-button>
        </span>
        </el-dialog>
    </el-row>
</template>

<style scoped>

</style>

<script>
    var store=require("../../store")._modulesNamespaceMap["team/list/"].context;
    var sessionChange=require("common/mixins/session");
    var refresh=require("common/mixins/refresh");
    var expand=require("component/expand.vue");
    var list=require("./component/list.vue")
    var expand=require("component/expand.vue")
    module.exports = {
        data: function () {
            return {
                showAdd:false,
                name:"",
                dis:"",
                addPending:false,
                showApply:false,
                applyPending:false,
                applyName:"",
                applyDis:""
            }
        },
        mixins:[sessionChange,refresh],
        store:store,
        components:{
            "list":list,
            "expand":expand
        },
        computed:{
            bEmpty:function () {
                if(store.state.teamCreateList.length==0 && store.state.teamJoinList.length==0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            },
            arrCreate:function () {
                return store.state.teamCreateList
            },
            arrJoin:function () {
                return store.state.teamJoinList
            }
        },
        methods: {
            changeCreateSort:function () {
                this.$refs.createList.changeSort();
            },
            changeJoinSort:function () {
                this.$refs.joinList.changeSort();
            },
            addTeam:function () {
                if(!this.name)
                {
                    this.$message.error("请输入名称");
                    return;
                }
                var _this=this;
                this.addPending=true;
                store.dispatch("addTeam",{
                    name:this.name,
                    dis:this.dis
                }).then(function (data) {
                    _this.addPending=false;
                    _this.name="";
                    _this.dis=""
                    if(data.code==200)
                    {
                        $.notify("创建成功",1);
                        _this.showAdd=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            applyTeam:function () {
                if(!this.applyName)
                {
                    $.tip("请输入团队ID",0);
                    return;
                }
                this.applyPending=true;
                var _this=this;
                net.put("/team/userapply",{
                    id:this.applyName,
                    dis:this.applyDis
                }).then(function (data) {
                    _this.applyPending=false;
                    _this.applyName="";
                    _this.applyDis=""
                    if(data.code==200)
                    {
                        $.notify("请求已发送，等待团队管理员响应",1);
                        _this.showApply=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
        }
    }
</script>