<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-button type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    版本信息
                </el-button><el-button type="primary" style="margin: 20px 0 20px 0;width: 80%;" @click="type=1">
                版本列表
            </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-if="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;display: inline-block">
                            版本信息
                        </h4>
                        <template v-if="session.role==0">
                            <el-button type="primary" style="float: right;margin-right: 20px;margin-top: 15px" @click="showVersion=true" :loading="createPending" v-if="!session.versionId">
                                创建版本
                            </el-button>
                            <el-button type="primary" style="float: right;margin-right: 20px;margin-top: 15px" @click="returnMaster" v-else>
                                返回主版本
                            </el-button>
                        </template>
                    </el-row>
                    <el-form ref="form" label-width="100px" v-if="session.versionId">
                        <el-form-item label="版本号" style="text-align: center">
                            <el-input style="margin-top: 8px;width: 80%" v-model="name"></el-input>
                        </el-form-item>
                        <el-form-item label="版本信息" style="text-align: center">
                            <el-input type="textarea" :rows="3" style="width: 80%;height: 80%;margin-top: 8px;" v-model="dis"></el-input>
                        </el-form-item>
                        <el-row class="row" style="text-align: center" v-if="session.role==0">
                            <el-col class="col" :span="8" style="text-align: center">
                                <el-button type="primary" style="width: 80%;margin-top: 20px;margin-bottom: 20px" @click.prevent="saveVersion" :loading="savePending">
                                    保存
                                </el-button>
                            </el-col>
                            <el-col class="col" :span="8" style="text-align: center">
                                <el-button type="danger" style="width: 80%;margin-top: 20px;margin-bottom: 20px" @click.prevent="rollVersion" :loading="rollPending">
                                    回滚
                                </el-button>
                            </el-col>
                            <el-col class="col" :span="8" style="text-align: center">
                                <el-button type="danger" style="width: 80%;margin-top: 20px;margin-bottom: 20px" @click.prevent="removeVersion" :loading="removePending">
                                    删除
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-row class="row" style="text-align: center" v-else>
                        <h3>
                            当前是主版本
                        </h3>
                    </el-row>
                </el-row>
                <el-row v-if="type==1" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray">
                            版本列表
                        </h4>
                    </el-row>
                    <el-row class="row">
                        <table class="table-hover" style="width: 100%;margin-bottom: 20px">
                            <thead>
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
                                    <tr style="height: 50px;text-align: center;vertical-align: middle">
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
                                            <el-dropdown>
                                                <el-button type="text" class="el-dropdown-link">
                                                    操作<i class="el-icon-caret-bottom el-icon--right"></i>
                                                </el-button>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item @click.native="editIndex=index,editId=item._id,editName=item.version,editDis=item.dis,showEditVersion=true" v-if="session.role==0">编辑</el-dropdown-item>
                                                    <el-dropdown-item @click.native="switchVersion(item,index)">切换</el-dropdown-item>
                                                    <el-dropdown-item @click.native="rollVersion(item,index)" style="color: red" v-if="session.role==0">回滚</el-dropdown-item>
                                                    <el-dropdown-item @click.native="removeVersion(item,index)" style="color: red" v-if="session.role==0">删除</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                            <tfoot>
                                <tr style="text-align: center;vertical-align: middle">
                                    <td colspan="5">
                                        <page @change="changePage"></page>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </el-row>
                </el-row>
            </el-row>
        </el-col>
        <el-dialog title="创建版本" v-model="showVersion" size="small">
            <el-form ref="form" label-width="100px">
                <el-form-item label="版本号" style="text-align: center">
                    <el-input style="width: 80%" v-model="newVersionName"></el-input>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本信息" style="text-align: center">
                    <el-input type="textarea" style="width: 80%" v-model="newVersionDis" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createVersion" :loading="createPending">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="修改版本" v-model="showEditVersion" size="small">
            <el-form ref="form" label-width="100px">
                <el-form-item label="版本号" style="text-align: center">
                    <el-input style="width: 80%" v-model="editName"></el-input>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本信息" style="text-align: center">
                    <el-input type="textarea" style="width: 80%" v-model="editDis" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editVersion" :loading="editPending">确 定</el-button>
        </span>
        </el-dialog>
    </el-row>
</template>

<script>
    var page=require("./page.vue");
    var bus=require("../bus/projectInfoBus")
    module.exports={
        props:[],
        data:function () {
            return {
                type:0,
                session:$.clone(session.raw()),
                name:session.get("versionName")?session.get("versionName"):"",
                dis:session.get("versionDis")?session.get("versionDis"):"",
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
        components:{
            "page":page
        },
        methods:{
            saveVersion:function () {
                if(!this.name)
                {
                    $.tip("版本号不能为空",0);
                    return;
                }
                var _this=this;
                this.savePending=true;
                net.post("/version/save",{
                    id:session.get("versionId"),
                    project:session.get("projectId"),
                    version:this.name,
                    dis:this.dis
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                        session.set("versionName",_this.name);
                        session.set("versionDis",_this.dis);
                        _this.$root.session.versionName=_this.name;
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
                            $.notify("回滚成功",1);
                            session.remove("versionId");
                            session.remove("versionName");
                            session.remove("versionDis");
                            setTimeout(function () {
                                location.reload();
                            },1500)
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
                            if(item._id==session.get("versionId"))
                            {
                                session.remove("versionId");
                                session.remove("versionName");
                                session.remove("versionDis");
                                setTimeout(function () {
                                    location.reload();
                                },1500)
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
                    session.set("versionId",item._id);
                    session.set("versionName",item.version);
                    session.set("versionDis",item.dis);
                    location.reload();
                })
            },
            returnMaster:function () {
                $.confirm("是否返回主版本？",function () {
                    session.remove("versionId");
                    session.remove("versionName");
                    session.remove("versionDis");
                    location.reload();
                })
            }
        },
        created:function () {
            var _this=this;
            bus.$on("initVersion",function (data) {
                _this.versionList=data;
            })
        }
    }
</script>
