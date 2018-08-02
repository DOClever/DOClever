<template>
    <el-row class="row" style="background-color: rgb(248,249,248)">
        <template v-if="bEmpty">
            <el-row class="row" style="text-align: center;margin-top: 100px;color: gray;height: calc(100vh - 173px)">
                <i class="fa fa-list-alt" style="font-size: 60px"></i><br><br>
                <span style="font-size: 14px">{{teamId?"当前团队下您":""}}还没有项目，点击下方按钮新增或者导入项目</span><br><br>
                <template v-if="type=='interface'">
                    <el-dropdown  v-if="teamId">
                        <el-button type="primary" size="mini" style="margin-left: 20px;">
                            <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增项目
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="showAdd=true">新项目</el-dropdown-item>
                            <el-dropdown-item @click.native="addExistProject">已有项目</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" size="mini" @click="showAdd=true" style="font-size: 14px" v-else>
                        <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增项目
                    </el-button>
                    <el-button size="mini" style="margin-left: 10px;" @click="importProject">
                        <i class="el-icon-download" style="font-weight:900"></i>&nbsp;导入项目
                    </el-button>
                </template>
                <template v-else-if="type=='doc' || type=='test'">
                    <el-dropdown v-if="teamId">
                        <el-button type="primary" size="mini" style="margin-left: 20px;">
                            <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增项目
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="showAdd=true">新项目</el-dropdown-item>
                            <el-dropdown-item @click.native="addExistProject">已有项目</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" size="mini" style="margin-left: 20px;" @click="showAdd=true" v-else>
                        <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增项目
                    </el-button>
                    <el-button size="mini" style="margin-left: 10px;" @click="importTestProject" v-if="type=='test'">
                        <i class="el-icon-download" style="font-weight:900"></i>&nbsp;导入项目
                    </el-button>
                </template>
            </el-row>
        </template>
        <tempalte v-else>
            <el-row class="row" style="height: 50px;line-height: 50px;padding-right: 20px;">
                <template v-if="type=='interface'">
                    <el-dropdown  v-if="teamId">
                        <el-button type="primary" size="mini" style="margin-left: 20px;">
                            <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增项目
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="showAdd=true">新项目</el-dropdown-item>
                            <el-dropdown-item @click.native="addExistProject">已有项目</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" size="mini" style="margin-left: 20px;" @click="showAdd=true" v-else>
                        <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增项目
                    </el-button>
                    <el-button size="mini" style="margin-left: 10px;" @click="importProject">
                        <strong><i class="el-icon-download" style="font-weight:900"></i></strong>&nbsp;导入项目
                    </el-button>
                </template>
                <template v-else-if="type=='doc' || type=='test'">
                    <el-dropdown  v-if="teamId">
                        <el-button type="primary" size="mini" style="margin-left: 20px;">
                            <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增项目
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="showAdd=true">新项目</el-dropdown-item>
                            <el-dropdown-item @click.native="addExistProject">已有项目</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" size="mini" style="margin-left: 20px;" @click="showAdd=true" v-else>
                        <i class="el-icon-plus" style="font-weight:900"></i>&nbsp;新增项目
                    </el-button>
                    <el-button size="mini" style="margin-left: 10px;" @click="importTestProject" v-if="type=='test'">
                        <i class="el-icon-download" style="font-weight:900"></i>&nbsp;导入项目
                    </el-button>
                </template>
                <el-button size="mini" type="text" style="float: right;margin-right: 10px;margin-top: 15px;color: gray">
                    <div style="display: inline-block;height: 10px;width: 10px;border-radius: 5px;background-color: #67C23A;"></div>&nbsp;观察者
                </el-button>
                <el-button size="mini" type="text" style="float: right;margin-right: 10px;margin-top: 15px;color: gray">
                    <div style="display: inline-block;height: 10px;width: 10px;border-radius: 5px;background-color: #17b9e6;"></div>&nbsp;管理员
                </el-button>
            </el-row>
            <el-row class="row" style="margin: 10px 20px 10px 20px;width: calc(100% - 40px);height: calc(100vh - 240px);overflow-y: auto;">
                <template v-if="!teamId">
                    <expand :expand="1" style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);" v-if="arrCreate.length>0">
                        <div slot="title" style="font-size: 14px">
                            我创建的项目
                        </div>
                        <el-radio-group v-model="createSort" size="mini" slot="append" style="margin-right: 20px" @change="changeCreateSort">
                            <el-radio-button :label="0">时间&nbsp;↓</el-radio-button>
                            <el-radio-button :label="1">名称&nbsp;↑</el-radio-button>
                        </el-radio-group>
                        <el-row class="row">
                            <list type="create" ref="createList" key="create" :category="type"></list>
                        </el-row>
                    </expand>
                    <expand :expand="1" style="background-color: white;margin-top: 20px;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);" v-if="arrJoin.length>0">
                        <div slot="title" style="font-size: 14px">
                            我加入的项目
                        </div>
                        <el-radio-group v-model="joinSort" size="mini" slot="append" style="margin-right: 20px" @change="changeJoinSort">
                            <el-radio-button :label="0">时间&nbsp;↓</el-radio-button>
                            <el-radio-button :label="1">名称&nbsp;↑</el-radio-button>
                        </el-radio-group>
                        <el-row class="row">
                            <list type="join" ref="joinList" key="join" :category="type"></list>
                        </el-row>
                    </expand>
                    <expand :expand="1" style="background-color: white;margin-top: 20px;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);" v-if="arrPublic.length>0">
                        <div slot="title" style="font-size: 14px">
                            公开的项目
                        </div>
                        <el-radio-group v-model="publicSort" size="mini" slot="append" style="margin-right: 20px" @change="changePublicSort">
                            <el-radio-button :label="0">时间&nbsp;↓</el-radio-button>
                            <el-radio-button :label="1">名称&nbsp;↑</el-radio-button>
                        </el-radio-group>
                        <el-row class="row">
                            <list type="public" ref="publicList" key="public" :category="type"></list>
                        </el-row>
                    </expand>
                </template>
                <expand :expand="1" style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);" v-else>
                    <div slot="title" style="font-size: 14px">
                        团队中的项目
                    </div>
                    <el-radio-group v-model="teamSort" size="mini" slot="append" style="margin-right: 20px" @change="changeTeamSort">
                        <el-radio-button :label="0">时间&nbsp;↓</el-radio-button>
                        <el-radio-button :label="1">名称&nbsp;↑</el-radio-button>
                    </el-radio-group>
                    <el-row class="row">
                        <list type="team" ref="teamList" key="team" :category="type"></list>
                    </el-row>
                </expand>
            </el-row>
        </tempalte>
        <el-dialog title="新建项目" :visible.sync="showAdd" width="50%" append-to-body>
            <el-form label-position="top" ref="form" label-width="100px">
                <el-form-item label="名称">
                    <el-input  style="width: 100%"  v-model="name" placeholder="请输入新项目的名称"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :rows="2"  style="width: 100%"  v-model="dis" placeholder="请输入新项目的简介"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showAdd = false">取 消</el-button>
            <el-button type="primary" @click="addProject" :loading="addPending">确 定</el-button>
        </span>
        </el-dialog>
    </el-row>
</template>

<script>
    var sessionChange=require("common/mixins/session");
    var expand=require("component/expand.vue");
    var list=require("./item.vue");
    var importProject=require("./import.vue")
    module.exports={
        props:["type"],
        data:function () {
            return {
                showAdd:false,
                name:"",
                dis:"",
                addPending:false,
            }
        },
        mixins:[sessionChange],
        watch:{

        },
        components:{
            "expand":expand,
            "list":list
        },
        computed:{
            createSort:{
                get:function () {
                    if(this.type=="interface")
                    {
                        return this.$store.state.projectCreateSort;
                    }
                    else if(this.type=="doc")
                    {
                        return this.$store.state.docCreateSort;
                    }
                    else if(this.type=="test")
                    {
                        return this.$store.state.testCreateSort;
                    }
                },
                set:function (val) {
                    if(this.type=="interface")
                    {
                        this.$store.state.projectCreateSort=val;
                    }
                    else if(this.type=="doc")
                    {
                        this.$store.state.docCreateSort=val;
                    }
                    else if(this.type=="test")
                    {
                        this.$store.state.testCreateSort=val;
                    }
                }
            },
            joinSort:{
                get:function () {
                    if(this.type=="interface")
                    {
                        return this.$store.state.projectJoinSort;
                    }
                    else if(this.type=="doc")
                    {
                        return this.$store.state.docJoinSort;
                    }
                    else if(this.type=="test")
                    {
                        return this.$store.state.testJoinSort;
                    }
                },
                set:function (val) {
                    if(this.type=="interface")
                    {
                        this.$store.state.projectJoinSort=val;
                    }
                    else if(this.type=="doc")
                    {
                        this.$store.state.docJoinSort=val;
                    }
                    else if(this.type=="test")
                    {
                        this.$store.state.testJoinSort=val;
                    }
                }
            },
            publicSort:{
                get:function () {
                    if(this.type=="interface")
                    {
                        return this.$store.state.projectPublicSort;
                    }
                    else if(this.type=="doc")
                    {
                        return this.$store.state.docPublicSort;
                    }
                    else if(this.type=="test")
                    {
                        return this.$store.state.testPublicSort;
                    }
                },
                set:function (val) {
                    if(this.type=="interface")
                    {
                        this.$store.state.projectPublicSort=val;
                    }
                    else if(this.type=="doc")
                    {
                        this.$store.state.docPublicSort=val;
                    }
                    else if(this.type=="test")
                    {
                        this.$store.state.testPublicSort=val;
                    }
                }
            },
            teamSort:{
                get:function () {
                    if(this.type=="interface")
                    {
                        return this.$store.state.projectTeamSort;
                    }
                    else if(this.type=="doc")
                    {
                        return this.$store.state.docTeamSort;
                    }
                    else if(this.type=="test")
                    {
                        return this.$store.state.testTeamSort;
                    }
                },
                set:function (val) {
                    if(this.type=="interface")
                    {
                        this.$store.state.projectTeamSort=val;
                    }
                    else if(this.type=="doc")
                    {
                        this.$store.state.docTeamSort=val;
                    }
                    else if(this.type=="test")
                    {
                        this.$store.state.testTeamSort=val;
                    }
                }
            },
            bEmpty:function () {
                if(this.teamId)
                {
                    if(this.type=="interface")
                    {
                        if(this.$store.state.projectTeamList.length==0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else if(this.type=="doc")
                    {
                        if(this.$store.state.docTeamList.length==0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else if(this.type=="test")
                    {
                        if(this.$store.state.testTeamList.length==0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    if(this.type=="interface")
                    {
                        if(this.$store.state.projectCreateList.length==0 && this.$store.state.projectJoinList.length==0 && this.$store.state.projectPublicList.length==0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else if(this.type=="doc")
                    {
                        if(this.$store.state.docCreateList.length==0 && this.$store.state.docJoinList.length==0 && this.$store.state.docPublicList.length==0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else if(this.type=="test")
                    {
                        if(this.$store.state.testCreateList.length==0 && this.$store.state.testJoinList.length==0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
            },
            arrCreate:function () {
                if(this.type=="interface")
                {
                    return this.$store.state.projectCreateList
                }
                else if(this.type=="doc")
                {
                    return this.$store.state.docCreateList
                }
                else if(this.type=="test")
                {
                    return this.$store.state.testCreateList
                }
            },
            arrJoin:function () {
                if(this.type=="interface")
                {
                    return this.$store.state.projectJoinList
                }
                else if(this.type=="doc")
                {
                    return this.$store.state.docJoinList
                }
                else if(this.type=="test")
                {
                    return this.$store.state.testJoinList
                }
            },
            arrPublic:function () {
                if(this.type=="interface")
                {
                    return this.$store.state.projectPublicList
                }
                else if(this.type=="doc")
                {
                    return this.$store.state.docPublicList
                }
                else if(this.type=="test")
                {
                    return [];
                }
            },
            teamId:function () {
                return this.$store.state.teamId;
            }
        },
        methods:{
            changeCreateSort:function () {
                this.$refs.createList.changeSort();
            },
            changeJoinSort:function () {
                this.$refs.joinList.changeSort();
            },
            changePublicSort:function () {
                this.$refs.publicList.changeSort();
            },
            changeTeamSort:function () {
                this.$refs.teamList.changeSort();
            },
            addProject:function () {
                if(!this.name)
                {
                    this.$message.error("请输入名称");
                    return;
                }
                var _this=this;
                this.addPending=true;
                this.$store.dispatch("addProject",{
                    name:this.name,
                    dis:this.dis,
                    type:this.type
                }).then(function (data) {
                    _this.addPending=false;
                    _this.name="";
                    _this.dis=""
                    if(data.code==200)
                    {
                        $.tip("创建成功",1);
                        _this.showAdd=false;
                        helper.addPoint("addProject","新建项目");
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            importProject:function () {
                $.showBox(this,importProject)
            },
            addExistProject:function () {
                var _this=this;
                $.input("请输入已有项目的项目ID",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入项目ID",0);
                        return false
                    }
                    $.startHud();
                    var pro;
                    if(_this.type=="interface")
                    {
                        pro=net.put("/team/pullproject",{
                            id:_this.teamId,
                            project:val.value
                        })
                    }
                    else if(_this.type=="doc")
                    {
                        pro=net.put("/team/pulldoc",{
                            id:_this.teamId,
                            project:val.value
                        })
                    }
                    else if(_this.type=="test")
                    {
                        pro=net.put("/team/pulltest",{
                            id:_this.teamId,
                            project:val.value
                        })
                    }
                    pro.then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("请求已发出，等待项目管理员响应",1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            importTestProject:function () {
                var _this=this;
                $.inputMul(this,"请输入导入的JSON数据",function (val) {
                    if(!val)
                    {
                        $.tip("请输入json数据",0);
                        return false;
                    }
                    var query={
                        content:val,
                    }
                    if(session.get("teamId"))
                    {
                        query.team=session.get("teamId");
                    }
                    $.startHud();
                    net.post("/test/importproject",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("导入成功",1);
                            _this.$store.commit("addProject",{
                                data:data.data,
                                type:"test"
                            });
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                    return true;
                })
            }
        }
    }
</script>