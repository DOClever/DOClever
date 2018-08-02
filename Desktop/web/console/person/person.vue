<template>
    <el-row class="row" style="padding: 10px 10px 60px 10px;height: 100%;overflow-y: auto;font-size: 14px" id="personInfo">
        <el-row class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white">
            <el-row class="row" style="height: 40px;line-height: 40px;padding-left: 20px;color: #17b9e6">
                个人资料
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 40px">
                <el-form ref="form" label-width="100px" label-position="top">
                    <img width="60" height="60" :src="session.photo!='undefined'?session.photo:''" id="showimg">&nbsp;&nbsp;&nbsp;&nbsp;
                    <a  href="javascript:void(0)" class="file" style="display: inline-block;top: -15px;font-size: 13px">
                        选择头像<input type="file"  v-imgfile="'showimg'" id="file">
                    </a>
                    <el-row class="row" style="margin-top: 10px">
                        <el-col class="col" :span="10">
                            <el-form-item label="年龄">
                                <el-input size="small" style="width: 90%" name="age" v-model="session.age"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="性别">
                                <el-select size="small" style="width: 90%" name="sex" v-model="session.sex">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="公司">
                                <el-input size="small" style="width: 90%" name="company" v-model="session.company"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="qq">
                                <el-input size="small" style="width: 90%" name="qq" v-model="session.qq"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="邮箱">
                                <el-input size="small" style="width: 90%" name="email" v-model="session.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="手机">
                                <el-input size="small" style="width: 90%" name="phone" v-model="session.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" size="mini" style="width: 100px;margin-top: 10px" @click.prevent="saveInfo" :loading="savePending">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-row>
        <el-row class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px">
            <el-row class="row" style="height: 40px;line-height: 40px;padding-left: 20px;color: #17b9e6">
                修改密码
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 40px">
                <el-form ref="form" label-width="100px" label-position="top">
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="原密码">
                                <el-input size="small" style="width: 90%" type="password" v-model="oldPass"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="margin-top: 10px">
                        <el-col class="col" :span="10">
                            <el-form-item label="新密码">
                                <el-input size="small" style="width: 90%" type="password" v-model="newPass"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="确认密码">
                                <el-input size="small" style="width: 90%" type="password" v-model="newPass1"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button size="mini" type="primary" style="width: 100px;margin-top: 10px" @click.prevent="editPass":loading="passPending">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-row>
        <el-row class="row" style="border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);background-color: white;margin-top: 10px">
            <el-row class="row" style="height: 40px;line-height: 40px;padding-left: 20px;color: #17b9e6">
                发件设置
            </el-row>
            <el-row class="row" style="background-color: lightgray;height: 1px"></el-row>
            <el-row class="row" style="padding: 10px 20px 10px 40px">
                <el-form ref="form" label-width="100px" label-position="top">
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="发件人邮箱账户">
                                <el-input size="small" placeholder="请输入发件人的邮箱账户(如：aaa@qq.com)" style="width: 90%" v-model="sendInfo.user"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="发件人邮箱密码">
                                <el-input size="small" placeholder="请输入发件人的邮箱密码" style="width: 90%" v-model="sendInfo.password"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col class="col" :span="10">
                            <el-form-item label="发件人smtp地址">
                                <el-input size="small" placeholder="请输入发件人的smtp地址(如：smtp.qq.com)" style="width: 90%" v-model="sendInfo.smtp"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-form-item label="发件人smtp端口">
                                <el-input size="small" placeholder="请输入发件人smtp端口号" style="width: 90%" v-model="sendInfo.port"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button size="mini" type="primary" style="width: 100px;margin-top: 10px" @click.prevent="saveSendInfo" :loading="sendPending">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-row>
    </el-row>
</template>

<style>
    #personInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #personInfo .el-form-item {
        margin-bottom: 0;
    }
</style>

<script>
    var imgFile=require("common/director/imgFile")
    var proxyImg=require("common/director/proxyImg")
    var config=require("common/js/config");
    var sessionChange=require("common/mixins/session");
    var store=require("../store")._modulesNamespaceMap["person/"].context;
    module.exports={
        data:function () {
            return {
                infoShow:1,
                oldPass:"",
                newPass:"",
                newPass1:"",
                savePending:false,
                passPending:false,
                sendPending:false,
            }
        },
        mixins:[sessionChange],
        directives:{
            "imgfile":imgFile,
            "proxy":proxyImg
        },
        store:store,
        computed:{
            sendInfo:function () {
                return this.$store.state.sendInfo;
            }
        },
        methods:{
            saveInfo:function () {
                var _this=this;
                var obj={};
                if($.query("#file").value)
                {
                    obj.photo=$.query("#file").files[0];
                }
                if(this.session.age)
                {
                    obj.age=this.session.age
                }
                if(this.session.sex)
                {
                    obj.sex=this.session.sex
                }
                if(this.session.company)
                {
                    obj.company=this.session.company
                }
                if(this.session.qq)
                {
                    obj.qq=this.session.qq
                }
                if(this.session.email)
                {
                    obj.email=this.session.email
                }
                if(this.session.phone)
                {
                    obj.phone=this.session.phone
                }
                obj.userid=this.session.id;
                this.savePending=true;
                net.upload("post","/user/save",obj).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.tip("更新成功",1);
                        session.update(data.data);
                    }
                    else
                    {
                       $.tip(data.msg,0)
                    }
                })
            },
            editPass:function () {
                if(!this.oldPass || !this.newPass || !this.newPass1)
                {
                    this.$message.error("请填写完整信息");
                    return;
                }
                else if(this.newPass!=this.newPass1)
                {
                    this.$message.error("两次填写的密码不一致");
                    return;
                }
                var _this=this;
                this.passPending=true;
                net.put("/user/editpass",{
                    userid:_this.session.id,
                    oldpass:_this.oldPass,
                    newpass:_this.newPass
                }).then(function (data) {
                    _this.passPending=false;
                    if(data.code==200)
                    {
                        _this.$notify({
                            title: '修改成功',
                            type: 'success'
                        });
                        _this.oldPass="";
                        _this.newPass="";
                        _this.newPass1="";
                    }
                    else
                    {
                        _this.$notify({
                            title: data.msg,
                            type: 'error'
                        });
                    }
                })
            },
            saveSendInfo:function () {
                if(!this.sendInfo.user)
                {
                    $.tip("请输入邮箱账户",0);
                    return;
                }
                else if(!this.sendInfo.password)
                {
                    $.tip("请输入邮箱密码",0);
                    return;
                }
                else if(!this.sendInfo.smtp)
                {
                    $.tip("请输入smtp地址",0);
                    return;
                }
                else if(!this.sendInfo.port)
                {
                    $.tip("请输入smtp端口",0);
                    return;
                }
                var _this=this;
                this.sendPending=true;
                net.put("/user/sendinfo",this.sendInfo).then(function (data) {
                    _this.sendPending=false;
                    if(data.code==200)
                    {
                        $.tip("保存成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0)
                    }
                })
            }
        }
    }
</script>