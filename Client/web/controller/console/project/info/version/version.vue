<template>
    <el-row class="row" style="padding: 10px 10px 60px 10px;height: calc(100vh - 115px);overflow-y: auto;font-size: 14px" id="versionInfo">
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                版本信息
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <el-form ref="form" label-width="100px" label-position="top" v-if="session.versionId">
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="版本号">
                                <el-input size="small" style="width: 90%" v-model="session.versionName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="版本信息">
                                <el-input size="small" style="width: 90%" v-model="session.versionDis"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="margin-top: 10px">
                        <el-button size="mini" type="primary" @click.prevent="saveVersion" :loading="savePending" v-if="versionEditRole">
                            保存
                        </el-button>
                        <el-button size="mini" type="danger" @click.prevent="rollVersion" :loading="rollPending" v-if="versionRollRole">
                            回滚
                        </el-button>
                        <el-button size="mini" type="danger" @click.prevent="removeVersion" :loading="removePending" v-if="versionEditRole">
                            删除
                        </el-button>
                        <el-button type="primary" size="mini" @click="returnMaster">
                            返回主版本
                        </el-button>
                    </el-row>
                </el-form>
                <el-row class="row" v-else>
                    当前是主版本
                    <el-button type="primary" size="mini" style="margin-left: 20px" @click="showVersion=true" :loading="createPending" v-if="!session.versionId && versionEditRole">
                        创建版本
                    </el-button>
                </el-row>
            </el-row>
        </expand>
        <expand class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px;" id="statusEdit">
            <el-row class="row" style="height: 40px;line-height: 40px;color: #17b9e6" slot="title">
                版本列表
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 20px">
                <div v-if="$refs.page && $refs.page.page==0 && versionList.length==0">
                    版本列表为空
                </div>
                <table class="table-hover" style="width: 100%;border-collapse: collapse;" v-else>
                    <thead style="color: gray">
                    <th>
                        版本号
                    </th>
                    <th>
                        版本信息
                    </th>
                    <th>
                        创建时间
                    </th>
                    <th>
                        创建人
                    </th>
                    <th>
                        操作
                    </th>
                    </thead>
                    <tbody>
                    <template v-for="(item,index) in versionList">
                        <tr style="height: 40px;text-align: center;vertical-align: middle">
                            <td style="width:15%">
                                {{item.version}}
                            </td>
                            <td style="width:20%">
                                {{item.dis}}
                            </td>
                            <td style="width:20%">
                                {{item.createdAt}}
                            </td>
                            <td style="width:15%">
                                {{item.creator.name}}
                            </td>
                            <td style="width:20%">
                                <el-button type="text" size="mini" @click.native="editIndex=index,editId=item._id,editName=item.version,editDis=item.dis,showEditVersion=true" v-if="versionEditRole">编辑</el-button>
                                <el-button type="text" size="mini" @click.native="switchVersion(item,index)">切换</el-button>
                                <el-button type="text" size="mini" @click.native="rollVersion(item,index)" style="color: red" v-if="versionRollRole">回滚</el-button>
                                <el-button type="text" size="mini" @click.native="removeVersion(item,index)" style="color: red" v-if="versionEditRole">删除</el-button>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                    <tfoot>
                    <tr style="text-align: center;vertical-align: middle;">
                        <td colspan="5" style="border-bottom: none">
                            <page @change="changePage" ref="page"></page>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </el-row>
        </expand>
        <el-dialog title="创建版本" :visible.sync="showVersion" width="50%" append-to-body>
            <el-form ref="form" label-width="100px">
                <el-form-item label="版本号" style="text-align: center">
                    <el-input size="small" style="width: 80%" v-model="newVersionName"></el-input>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本信息" style="text-align: center">
                    <el-input size="small" type="textarea" style="width: 80%" v-model="newVersionDis" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="createVersion" :loading="createPending">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="修改版本" :visible.sync="showEditVersion" width="50%" append-to-body>
            <el-form ref="form" label-width="100px">
                <el-form-item label="版本号" style="text-align: center">
                    <el-input size="small" style="width: 80%" v-model="editName"></el-input>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本信息" style="text-align: center">
                    <el-input size="small" type="textarea" style="width: 80%" v-model="editDis" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="editVersion" :loading="editPending">确 定</el-button>
        </span>
        </el-dialog>
    </el-row>
</template>

<style>
    #versionInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #versionInfo .el-form-item {
        margin-bottom: 0;
    }
</style>

<script>
    var page=require("component/page.vue");
    var store=require("../../../store")._modulesNamespaceMap["project/info/version/"].context;
    var sessionChange=require("common/mixins/session");
    var expand=require("component/expand.vue")
    module.exports={
        props:[],
        data:function () {
            return {
                type:0,
                savePending:false,
                createPending:false,
                versionList:[],
                rollPending:false,
                removePending:false,
                showVersion:false,
                newVersionName:"",
                newVersionDis:"",
                editPending:false,
                editIndex:-1,
                showEditVersion:false,
                editId:"",
                editName:"",
                editDis:""
            }
        },
        mixins:[sessionChange],
        store:store,
        components:{
            "page":page,
            "expand":expand
        },
        computed:{
            versionEditRole:function () {
                return this.$store.getters.versionEditRole;
            },
            versionRollRole:function () {
                return this.$store.getters.versionRollRole;
            }
        },
        methods:{
            saveVersion:function () {
                if(!this.session.versionName)
                {
                    $.tip("版本号不能为空",0);
                    return;
                }
                var _this=this;
                this.savePending=true;
                net.post("/version/save",{
                    id:session.get("versionId"),
                    project:session.get("projectId"),
                    version:this.session.versionName,
                    dis:this.session.versionDis
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                        session.set("versionName",_this.session.versionName);
                        session.set("versionDis",_this.session.versionDis);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            createVersion:function () {
                if(!this.newVersionName)
                {
                    $.tip("版本号不能为空",0);
                    return;
                }
                var _this=this;
                this.createPending=true;
                net.post("/version/save",{
                    project:session.get("projectId"),
                    version:this.newVersionName,
                    dis:this.newVersionDis,
                    creator:session.get("id")
                }).then(function (data) {
                    _this.createPending=false;
                    _this.newVersionName="";
                    _this.newVersionDis="";
                    if(data.code==200)
                    {
                        _this.showVersion=false;
                        $.notify("新建成功",1);
                        _this.versionList.unshift(data.data);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            rollVersion:function (item,index) {
                var _this=this;
                this.rollPending=true;
                $.confirm("确认回滚到该版本?",function () {
                    net.put("/version/roll",{
                        id:index!==undefined?item._id:session.get("versionId")
                    }).then(function (data) {
                        _this.rollPending=false;
                        if(data.code==200)
                        {
                            $.startLoading(1);
                            _this.$store.dispatch("switchVersion").then(function (data) {
                                $.stopLoading();
                                if(typeof(data)=="string")
                                {
                                    $.notify(data,0);
                                }
                                else
                                {
                                    $.notify("回滚成功",1);
                                }
                            })
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            removeVersion:function (item,index) {
                var _this=this;
                $.confirm("是否确认删除版本，该版本所有数据都会被删除",function () {
                    $.startHud();
                    net.delete("/version/item",{
                        id:index!==undefined?item._id:session.get("versionId")
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.versionList.splice(index,1);
                            if((index!==undefined && item._id==session.get("versionId")) || index===undefined)
                            {
                                $.startLoading(1);
                                _this.$store.dispatch("switchVersion").then(function (data) {
                                    $.stopLoading();
                                    if(typeof(data)=="string")
                                    {
                                        $.notify(data,0);
                                    }
                                    else
                                    {
                                        $.notify("删除成功",1);
                                    }
                                })
                            }
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            changePage:function (page) {
                var _this=this;
                $.startHud();
                net.get("/version/list",{
                    project:session.get("projectId"),
                    page:page
                }).then(function (data) {
                    $.stopHud();
                    _this.versionList=data.data
                })
            },
            editVersion:function () {
                if(!this.editName)
                {
                    $.tip("版本号不能为空",0);
                    return;
                }
                var _this=this;
                this.editPending=true;
                net.post("/version/save",{
                    id:this.editId,
                    project:session.get("projectId"),
                    version:this.editName,
                    dis:this.editDis
                }).then(function (data) {
                    _this.editPending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                        _this.showEditVersion=false;
                        _this.versionList[_this.editIndex].version=_this.editName;
                        _this.versionList[_this.editIndex].dis=_this.editDis;
                        if(session.get("versionId")==_this.editId)
                        {
                            session.set("versionName",_this.editName);
                            session.set("versionDis",_this.editDis);
                            _this.$root.session.versionName=_this.editName;
                        }
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            switchVersion:function(item,index)
            {
                var _this=this;
                $.confirm("是否切换至"+item.version+"版本？",function () {
                    $.startLoading(1);
                    _this.$store.dispatch("switchVersion",item).then(function (data) {
                        $.stopLoading();
                        if(typeof(data)=="string")
                        {
                            $.notify(data,0);
                        }
                        else
                        {
                            $.notify("切换成功",1);
                        }
                    })
                })
            },
            returnMaster:function () {
                var _this=this;
                $.confirm("是否返回主版本？",function () {
                    $.startLoading(1);
                    _this.$store.dispatch("switchVersion").then(function (data) {
                        $.stopLoading();
                        if(typeof(data)=="string")
                        {
                            $.notify(data,0);
                        }
                        else
                        {
                            $.notify("切换成功",1);
                        }
                    })
                })
            },
            initVersion:function (data) {
                this.versionList=data;
            }
        },
        created:function () {
            var _this=this;
            store.getters.event.$on("initVersion",this.initVersion)
        },
        beforeDestroy:function () {
            store.getters.event.$off("initVersion",this.initVersion)
        }
    }
</script>