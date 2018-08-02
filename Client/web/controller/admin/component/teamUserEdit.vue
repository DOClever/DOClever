<template>
    <el-dialog title="管理用户"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
            <el-col class="col" :span="20">
                <el-input size="small" style="width: 90%" placeholder="请输入你要筛选的用户名" v-model="searchName"></el-input>
            </el-col>
            <el-col class="col" :span="4">
                <el-button size="mini" type="text" style="font-size: 15px;width:40px;height: 50px" title="添加部门" @click="addGroup">
                    添加部门
                </el-button>
            </el-col>
        </el-row>
        <el-collapse>
            <template v-for="(item,index) in arrFilter">
                <el-collapse-item class="hover" :key="item._id">
                    <template slot="title">
                            <span style="font-size: 15px">
                                {{item.name+"("+item.users.length+")"}}
                            </span>&nbsp;&nbsp;&nbsp;
                        <el-dropdown>
                            <el-button size="mini" type="text" icon="el-icon-setting" class="el-dropdown-link" @click.stop="">
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="inviteUser(item)">邀请用户</el-dropdown-item>
                                <el-dropdown-item @click.native="renameGroup(item)">重命名</el-dropdown-item>
                                <el-dropdown-item @click.native="removeGroup(item,index)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template v-for="(item1,index1) in item.users">
                        <el-row class="row" style="height: 40px;line-height: 40px;text-align: center" :key="item1.user._id">
                            <el-col class="col" :span="4">
                                <img v-proxy="item1.user.photo" style="width: 30px;height: 30px; border-radius:50%;vertical-align: middle">
                            </el-col>
                            <el-col class="col" :span="10">
                                {{item1.user.name}}
                            </el-col>
                            <el-col class="col" :span="6">
                                <template v-if="item1.role!=2">
                                    <el-select size="small" v-model="item1.role" @input="changeRole(item1)">
                                        <el-option :value="0" label="团队管理员"></el-option>
                                        <el-option :value="1" label="团队成员"></el-option>
                                    </el-select>
                                </template>
                                <span v-else>
                                    团队所有者
                                </span>
                            </el-col>
                            <el-col class="col" :span="4">
                                <el-dropdown v-if="item1.role!=2">
                                    <el-button size="mini" type="text"  class="el-dropdown-link" @click.stop="">
                                        操作
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="moveUser(item1,index1,item)">移动</el-dropdown-item>
                                        <el-dropdown-item @click.native="removeUser(item1,index1,item)">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-col>
                        </el-row>
                    </template>
                </el-collapse-item>
            </template>
        </el-collapse>
        <el-dialog title="选择部门" :visible.sync="showGroup" width="50%" append-to-body>
            <el-row class="row" style="height: 30px;line-height: 30px;text-align: center">
                <el-select size="small" v-model="selectGroup" style="width: 50%">
                    <el-option :label="item.name" :value="item.id" v-for="item in arrGroup" :key="item.id"></el-option>
                </el-select>
            </el-row>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="handleMoveUser" :loading="movePending">确 定</el-button>
        </span>
        </el-dialog>
    </el-dialog>
</template>

<script>
    var proxyImg=require("director/proxyImg.js")
    module.exports={
        props:["propObj","teamId"],
        data:function () {
            return {
                arr:this.propObj,
                invitePending:false,
                showDialog:false,
                name:"",
                role:0,
                searchName:"",
                showGroup:false,
                movePending:false,
                moveUserId:"",
                selectGroup:"",
                moveUserIndex:-1,
                moveUserParent:null
            }
        },
        computed:{
            arrFilter:function () {
                if(!this.searchName)
                {
                    return this.arr;
                }
                var arr=[];
                var _this=this;
                this.arr.forEach(function (obj) {
                    var objCopy=$.clone(obj);
                    objCopy.users=objCopy.users.filter(function (obj) {
                        if(obj.user.name.toLowerCase().indexOf(_this.searchName.toLowerCase())>-1)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    })
                    if(objCopy.users.length>0)
                    {
                        arr.push(objCopy);
                    }
                })
                return arr;
            },
            arrGroup:function () {
                return this.arr.map(function (obj) {
                    return {
                        name:obj.name,
                        id:obj._id
                    }
                })
            },
        },
        directives:{
            proxy:proxyImg
        },
        methods:{
            inviteUser:function (item) {
                var _this=this;
                $.input("请输入邀请的用户名",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入邀请的用户名",0);
                        return;
                    }
                    $.startHud();
                    _this.$store.dispatch("pullTeamUser",{
                        id:_this.teamId,
                        user:val.value,
                        group:item._id,
                        role:1
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("邀请成功",1);
                            item.users.push(data.data);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            renameGroup:function (item) {
                var _this=this;
                $.input("请输入部门名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入部门名称",0);
                        return;
                    }
                    $.startHud();
                    _this.$store.dispatch("addTeamGroup",{
                        id:_this.teamId,
                        name:val.value,
                        group:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("重命名成功",1);
                            item.name=val.value;
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            removeGroup:function (item,index) {
                var _this=this;
                if(item.users.length>0)
                {
                    $.tip("请在删除部门前清空部门成员!",0);
                    return;
                }
                else
                {
                    $.confirm("是否删除该部门",function () {
                        $.startHud();
                        _this.$store.dispatch("removeTeamGroup",{
                            group:item._id
                        }).then(function (data) {
                            $.stopHud();
                            if(data.code==200)
                            {
                                $.notify("删除成功",1);
                                _this.arr.splice(index,1);
                            }
                            else
                            {
                                $.notify(data.msg,0);
                            }
                        })
                    })
                }
            },
            changeRole:function (item) {
                this.$store.dispatch("editTeamUserRole",{
                    id:this.teamId,
                    user:item.user._id,
                    role:item.role
                }).then(function (data) {
                    if(data.code==200)
                    {
                        $.notify("设置成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            moveUser:function (item,index,parent) {
                this.showGroup=true;
                this.moveUserId=item.user._id
                this.moveUserIndex=index;
                this.moveUserParent=parent;
                this.selectGroup=parent._id
            },
            removeUser:function (item,index,parent) {
                var _this=this;
                $.confirm("是否确定从团队中删除该用户，团队中的项目也会一并删除该用户",function () {
                    $.startHud();
                    _this.$store.dispatch("removeTeamUser",{
                        id:_this.teamId,
                        user:item.user._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            parent.users.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            handleMoveUser:function () {
                if(!this.selectGroup)
                {
                    $.tip("请选择部门",0);
                    return;
                }
                else if(this.selectGroup==this.moveUserParent._id)
                {
                    $.tip("请不要移动到同一个部门",0);
                    return;
                }
                var _this=this;
                this.movePending=true;
                this.$store.dispatch("moveTeamUser",{
                    id:this.teamId,
                    user:this.moveUserId,
                    group:this.selectGroup
                }).then(function (data) {
                    _this.movePending=false;
                    if(data.code==200)
                    {
                        $.notify("移动成功",1);
                        _this.showGroup=false;
                        _this.moveUserParent.users.splice(_this.moveUserIndex,1);
                        var group;
                        _this.arr.forEach(function (obj) {
                            if(obj._id==_this.selectGroup)
                            {
                                group=obj;
                            }
                        })
                        group.users.push(data.data);
                        group.users.sort(function (obj1,obj2) {
                            return obj1.user.name>obj2.user.name
                        })
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            addGroup:function () {
                var _this=this;
                $.input("请输入部门名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入部门名称",0);
                        return;
                    }
                    $.startHud();
                    _this.$store.dispatch("addTeamGroup",{
                        id:_this.teamId,
                        name:val.value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("新建成功",1);
                            _this.arr.push(data.data);
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