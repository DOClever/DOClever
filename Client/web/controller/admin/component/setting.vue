<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;padding-bottom: 20px">
                <el-button size="mini" type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    修改管理密码
                </el-button><el-button size="mini" type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=1">
                系统设置
            </el-button><el-button size="mini" type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=2">
                数据备份
            </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-show="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;">
                            修改管理密码
                        </h4>
                    </el-row>
                    <el-form ref="form" label-width="100px">
                        <el-form-item label="原密码" style="text-align: center">
                            <el-input size="small" style="margin-top: 8px;width: 80%" v-model="oldPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" style="text-align: center">
                            <el-input size="small" style="margin-top: 8px;width: 80%" v-model="newPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="重复新密码" style="text-align: center">
                            <el-input size="small" style="margin-top: 8px;width: 80%" v-model="newPassword1"></el-input>
                        </el-form-item>
                        <el-row class="row" style="text-align: center">
                            <el-button size="mini" type="primary" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click.prevent="editPassword" :loading="passwordPending">
                                保存
                            </el-button>
                        </el-row>
                    </el-form>
                </el-row>
                <el-row v-show="type==1" class="row" style="padding-bottom: 20px">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;">
                            基本设置
                        </h4>
                    </el-row>
                    <el-form ref="form" label-width="100px">
                        <el-form-item label="当前版本">
                            {{setting.info.version}}
                        </el-form-item>
                        <el-form-item label="注册">
                            <el-switch v-model="setting.info.register" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                        </el-form-item>
                        <el-row class="row" style="text-align: center">
                            <el-button size="mini" type="primary" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click="editInfo" :loading="infoPending">
                                保存
                            </el-button>
                        </el-row>
                    </el-form>
                    <hr>
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;">
                            连接配置(保存后请重启服务器）
                        </h4>
                    </el-row>
                    <el-form ref="form" label-width="100px">
                        <el-form-item label="数据库地址">
                            <el-input size="small" style="width: 80%" v-model="setting.connect.db" placeholder="请输入mongodb数据库地址（比如：mongodb://localhost:27017/DOClever)"></el-input>
                        </el-form-item>
                        <el-form-item label="上传文件地址">
                            <el-input size="small" style="width: 80%" v-model="setting.connect.filePath" placeholder="请输入DOClever上传文件路径（比如：/Users/Shared/DOClever）"></el-input>
                        </el-form-item>
                        </el-form-item>
                        <el-form-item label="启动端口">
                            <el-input size="small" style="width: 80%" v-model="setting.connect.port" placeholder="请输入端口号（比如10000）"></el-input>
                        </el-form-item>
                        <el-row class="row" style="text-align: center">
                            <el-button size="mini" type="primary" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click="editConfig" :loading="configPending">
                                保存
                            </el-button>
                        </el-row>
                    </el-form>
                </el-row>
                <el-row v-show="type==2" class="row" style="padding-bottom: 20px">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;">
                            备份
                        </h4>
                    </el-row>
                    <el-form ref="form" label-width="150px">
                        <el-form-item label="mongodb执行文件所在目录">
                            <el-input size="small" style="width: 80%" v-model="setting.db.dbPath"></el-input>
                        </el-form-item>
                        <el-form-item label="数据文件备份目录">
                            <el-input size="small" style="width: 80%" v-model="setting.db.backPath"></el-input>
                        </el-form-item>
                        <el-form-item label="定时备份时间">
                            <el-checkbox-group v-model="setting.db.hours">
                                <el-checkbox :label="n-1" v-for="n in 24" :key="n-1">{{n-1}}:00</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="数据库Host">
                            <el-input size="small" style="width: 80%" v-model="setting.db.host"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库名称">
                            <el-input size="small" style="width: 80%" v-model="setting.db.name"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库用户名">
                            <el-input size="small" style="width: 80%" v-model="setting.db.user" placeholder="没有可不填"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库密码">
                            <el-input size="small" style="width: 80%" v-model="setting.db.pass" placeholder="没有可不填"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库用户验证库">
                            <el-input size="small" style="width: 80%" v-model="setting.db.authDb" placeholder="没有可不填"></el-input>
                        </el-form-item>
                        <el-form-item label="立即备份一次">
                            <el-switch v-model="immediate" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </el-form-item>
                        <el-row class="row" style="text-align: center">
                            <el-button size="mini" type="primary" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click="backInfo" :loading="backPending">
                                保存
                            </el-button>
                        </el-row>
                    </el-form>
                    <hr>
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;">
                            还原(保存后请重启服务器）
                        </h4>
                    </el-row>
                    <table class="table-hover" style="width: 100%">
                        <thead>
                            <th>
                                版本
                            </th>
                            <th>
                                备份时间
                            </th>
                            <th>
                                操作
                            </th>
                        </thead>
                        <template v-for="(item,index) in setting.files">
                            <tr :key="item" style="text-align: center;vertical-align: middle">
                                <td style="width: 30%">
                                    {{item.split("@")[0]}}
                                </td>
                                <td style="width: 50%">
                                    {{date(item.split("@")[1])}}
                                </td>
                                <td style="width: 20%">
                                    <el-button size="mini" type="primary" @click="restore(item)">还原</el-button>
                                    <el-button size="mini" type="danger" @click="removeBackup(item,index)">删除</el-button>
                                </td>
                            </tr>
                        </template>
                        <tr style="text-align: center;vertical-align: middle">
                            <td colspan="3">
                                <page @change="changePage"></page>
                            </td>
                        </tr>
                    </table>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    var page=require("component/page.vue");
    module.exports={
        data:function () {
            return {
                type:0,
                passwordPending:false,
                oldPassword:"",
                newPassword:"",
                newPassword1:"",
                infoPending:false,
                configPending:false,
                backPending:false,
                immediate:0
            }
        },
        computed:{
            setting:function () {
                return this.$store.state.setting;
            }
        },
        components:{
            "page":page
        },
        methods: {
            editPassword:function () {
                if(!this.oldPassword)
                {
                    $.tip("原密码不能为空",0);
                    return;
                }
                else if(!this.newPassword)
                {
                    $.tip("新密码不能为空",0);
                    return;
                }
                else if(!this.newPassword1)
                {
                    $.tip("重复新密码不能为空",0);
                    return;
                }
                else if(this.newPassword!=this.newPassword1)
                {
                    $.tip("两次输入新密码不一致",0);
                    return;
                }
                this.editPending=true;
                var _this=this;
                this.$store.dispatch("editPassword",{
                    old:this.oldPassword,
                    password:this.newPassword
                }).then(function (data) {
                    _this.editPending=false;
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        _this.oldPassword="";
                        _this.newPassword="";
                        _this.newPassword1="";
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            editInfo:function () {
                var _this=this;
                this.infoPending=true;
                net.put("/admin/basicinfo",{
                    register:this.setting.info.register
                }).then(function (data) {
                    _this.infoPending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            editConfig:function () {
                if(!this.setting.connect.db)
                {
                    $.tip("请输入数据库地址");
                    return
                }
                else if(!this.setting.connect.filePath)
                {
                    $.tip("请输入上传文件地址");
                    return
                }
                else if(!this.setting.connect.port)
                {
                    $.tip("请输入启动端口");
                    return
                }
                var _this=this;
                this.configPending=true;
                net.put("/admin/connectinfo",{
                    db:this.setting.connect.db,
                    file:this.setting.connect.filePath,
                    port:this.setting.connect.port
                }).then(function (data) {
                    _this.configPending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功，请重新启动服务端！",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            date:function (item) {
                var year=item.substr(0,4);
                var month=item.substr(4,2);
                var day=item.substr(6,2);
                var hour=item.substr(8,2);
                var minute=item.substr(10,2);
                var second=item.substr(12,2);
                return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
            },
            backInfo:function () {
                var query={};
                if(!this.setting.db.dbPath)
                {
                    $.tip("请输入mongodb执行文件所在目录",0);
                    return
                }
                else
                {
                    query.dbpath=this.setting.db.dbPath;
                }
                if(!this.setting.db.backPath)
                {
                    $.tip("请输入数据文件备份目录",0);
                    return
                }
                else
                {
                    query.backpath=this.setting.db.backPath;
                }
                query.hours=JSON.stringify(this.setting.db.hours);
                if(!this.setting.db.host)
                {
                    $.tip("请输入数据库Host",0);
                    return
                }
                else
                {
                    query.host=this.setting.db.host;
                }
                if(!this.setting.db.name)
                {
                    $.tip("请输入数据库名称",0);
                    return
                }
                else
                {
                    query.name=this.setting.db.name;
                }
                if(this.setting.db.user && this.setting.db.pass && this.setting.db.authDb)
                {
                    query.user=this.setting.db.user;
                    query.pass=this.setting.db.pass;
                    query.authdb=this.setting.db.authDb;
                }
                query.immediate=this.immediate;
                var _this=this;
                var _this=this;
                this.backPending=true;
                net.put("/admin/backup",query).then(function (data) {
                    _this.backPending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1)
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            restore:function (item) {
                var _this=this;
                $.confirm("是否还原该备份？",function () {
                    $.startHud();
                    net.put("/admin/restore",{
                        id:item
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("还原成功，请重新启动服务端",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            removeBackup:function (item,index) {
                var _this=this;
                $.confirm("是否删除该备份？",function () {
                    $.startHud();
                    net.delete("/admin/backup",{
                        id:item
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.setting.files.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            changePage:function (page) {
                var _this=this;
                $.startHud();
                net.get("/admin/backuplist",{
                    page:page
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        _this.setting.files=data.data;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            }
        }
    }
</script>
