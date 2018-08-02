<template>
    <el-dialog title="管理用户"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="height: 50px;line-height: 50px">
            <el-col class="col" :span="3" style="line-height: 50px;font-size: 15px;text-align: center;white-space: nowrap">
                邀请用户
            </el-col>
            <el-col class="col" :span="11" style="text-align: center">
                <el-input size="small" placeholder="输入新增的用户名" style="width: 80%" v-model="name"></el-input>
            </el-col>
            <el-col class="col" :span="4" style="text-align: center" v-if="category==0">
                <el-select size="small" style="width: 80%" v-model="role">
                    <el-option :value="1" label="观察者"></el-option>
                    <el-option :value="0" label="管理员"></el-option>
                </el-select>
            </el-col>
            <el-col class="col" :span="3" style="line-height: 50px;text-align: center" v-if="category==0">
                <el-button  style="font-size: 15px" size="mini" @click="editOption" type="text" v-if="role==1">权限</el-button>
            </el-col>
            <el-col class="col" :span="3" style="line-height: 50px;text-align: center">
                <el-button size="mini" type="primary" style="font-size: 15px" @click="invite" :loading="invitePending">
                    新增
                </el-button>
            </el-col>
        </el-row>
        <el-row class="row" style="height: 300px;overflow-y: auto">
            <table width="100%" class="table-hover">
                <template v-for="(item,index) in arr">
                    <tr style="text-align: center;vertical-align: middle;height: 80px">
                        <td style="width: 15%">
                            <img v-proxy="category==0?item.user.photo:item.photo" style="border-radius: 30px"  width="60" height="60">
                        </td>
                        <td style="width: 50%;text-align: center">
                            {{category==0?item.user.name:item.name}}
                        </td>
                        <td style="width: 15%;text-align: center" v-if="category==0">
                            <el-select size="small" v-model="item.role" @input="editRole(item)" style="width: 90%">
                                <el-option :value="1" label="观察者"></el-option>
                                <el-option :value="0" label="管理员"></el-option>
                            </el-select>
                        </td>
                        <td style="width: 10%;text-align: center" v-if="category==0">
                            <el-button  style="font-size: 15px" size="mini" @click="editRoleOption(item,index)" type="text" v-if="item.role==1">权限</el-button>
                        </td>
                        <td style="width: 10%;text-align: center">
                            <el-button  style="color:red;font-size: 15px" size="mini" icon="el-icon-close" @click="remove(item,index)" type="text"></el-button>
                        </td>
                    </tr>
                </template>
            </table>
        </el-row>
    </el-dialog>
</template>

<script>
    var roleOption=require("component/roleOption.vue");
    var proxyImg=require("director/proxyImg.js")
    module.exports={
        props:["propObj","projectId","category"],
        data:function () {
            return {
                arr:this.propObj,
                invitePending:false,
                showDialog:false,
                name:"",
                role:0,
                roleOption:{
                    "ie":0,
                    "te":0,
                    "gb":0,
                    "gs":0,
                    "gi":0,
                    "gt":0,
                    "gd":0,
                    "ve":0,
                    "vr":0
                }
            }
        },
        computed:{

        },
        directives:{
            proxy:proxyImg
        },
        watch:{
            role:function (val) {
                if(val==1)
                {
                    this.roleOption={
                        "ie":0,
                        "te":0,
                        "gb":0,
                        "gs":0,
                        "gi":0,
                        "gt":0,
                        "gd":0,
                        "ve":0,
                        "vr":0
                    }
                }
            }
        },
        methods:{
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否踢出该成员！",function () {
                    $.startHud();
                    _this.$store.dispatch("removeProjectUser",{
                        id:_this.projectId,
                        user:_this.category==0?item.user._id:item._id,
                        category:_this.category
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("踢出成功",1);
                            _this.arr.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            editRole:function (item) {
                var _this=this;
                $.startHud();
                var obj={
                    id:this.projectId,
                    user:item.user._id,
                    role:item.role
                }
                this.$store.dispatch("editProjectUser",obj).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        if(item.role==0)
                        {
                            delete item.option;
                        }
                        else
                        {
                            Vue.set(item,"option",{
                                "ie":0,
                                "te":0,
                                "gb":0,
                                "gs":0,
                                "gi":0,
                                "gt":0,
                                "gd":0,
                                "ve":0,
                                "vr":0
                            })
                        }
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            editRoleOption:function (item) {
                var _this=this;
                var child=$.showBox(this.$root,roleOption,{
                    data:item.option
                });
                child.$on("save",function (val) {
                    $.startHud();
                    var obj={
                        id:_this.projectId,
                        user:item.user._id,
                        role:item.role,
                        option:JSON.stringify(val)
                    }
                    _this.$store.dispatch("editProjectUser",obj).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            item.option=val;
                            $.notify("修改成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            },
            invite:function () {
                var _this=this;
                this.invitePending=true;
                this.$store.dispatch("editProjectUser",{
                    id:this.projectId,
                    user:this.name,
                    role:this.role,
                    option:JSON.stringify(this.roleOption),
                    category:this.category
                }).then(function (data) {
                    _this.invitePending=false;
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        _this.arr.push(data.data);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            editOption:function () {
                var _this=this;
                var child=$.showBox(this.$root,roleOption,{
                    data:this.roleOption
                });
                child.$on("save",function (val) {
                    _this.roleOption=val;
                })
            }
        }
    }
</script>