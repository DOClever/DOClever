<template>
    <el-dialog :title="propPoll?'编辑轮询':'创建轮询'"  size="large" ref="box" >
        <el-row class="row">
            测试用例:<span style="color: red">(请不要选择带有input和文件上传的用例，因为在无人干预的情况下测试可能会失败！)</span><br>&nbsp;
        </el-row>
        <el-tree :data="arrTest" :props="defaultProps" show-checkbox node-key="_id"  ref="tree" :default-checked-keys="selNode">
        </el-tree>
        <el-row class="row" style="height: 20px">
        </el-row>
        <el-row class="row">
            成员邮件接受:<span style="color: red">(请成员在个人设置里设置邮箱信息)</span><br>&nbsp;
        </el-row>
        <el-row class="row" style="max-height:300px;overflow-y: auto">
            <el-table :data="arrUser" border style="width: 100%" @selection-change="handleSelectionChange" ref="user">
                <el-table-column type="selection" style="width: 20%">
                </el-table-column>
                <el-table-column label="成员" style="width: 80%;vertical-align: middle">
                    <template scope="scope">
                        <el-row class="row" style="height: 40px;line-height: 40px">
                            <el-col class="col" :span="4">
                                <img v-proxy="scope.row.photo" style="border-radius: 15px;margin-top: 5px"  width="30" height="30">
                            </el-col>
                            <el-col class="col" :span="20">
                                <span style="margin-left: 10px">{{ scope.row.name }}</span>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row class="row" style="height: 20px">
        </el-row>
        <el-form ref="form" label-width="100px">
            <el-form-item label="时刻" style="text-align: center">
                <el-checkbox-group v-model="poll.time">
                    <el-checkbox :label="n-1" v-for="n in 24">{{n-1}}:00</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="星期" style="text-align: center">
                <el-checkbox-group v-model="poll.date">
                    <el-checkbox :label="0">周一</el-checkbox>
                    <el-checkbox :label="1">周二</el-checkbox>
                    <el-checkbox :label="2">周三</el-checkbox>
                    <el-checkbox :label="3">周四</el-checkbox>
                    <el-checkbox :label="4">周五</el-checkbox>
                    <el-checkbox :label="5">周六</el-checkbox>
                    <el-checkbox :label="6">周日</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="baseUrl" style="text-align: center">
                <el-select v-model="poll.baseUrl" style="width: 80%">
                    <el-option v-for="item in arrBaseUrl" :value="item.url" style="height: auto"><span>{{item.url}}</span><br><span style="font-size: 13px;color: gray">{{item.remark}}</span></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发件人邮箱账户" style="text-align: center">
                <el-input placeholder="请输入发件人的邮箱账户(如：aaa@qq.com)" style="width: 80%" v-model="poll.sendInfo.user"></el-input>
            </el-form-item>
            <el-form-item label="发件人邮箱密码" style="text-align: center">
                <el-input placeholder="请输入发件人的邮箱密码" style="width: 80%" v-model="poll.sendInfo.password"></el-input>
            </el-form-item>
            <el-form-item label="发件人smtp地址" style="text-align: center">
                <el-input placeholder="请输入发件人的smtp地址(如：smtp.qq.com)" style="width: 80%" v-model="poll.sendInfo.smtp"></el-input>
            </el-form-item>
            <el-form-item label="发件人smtp端口" style="text-align: center">
                <el-input placeholder="请输入发件人smtp端口号" style="width: 80%" v-model="poll.sendInfo.port"></el-input>
            </el-form-item>
        </el-form>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="danger" @click="remove" :loading="removePending" v-if="propPoll">
                删除轮询
            </el-button>
            <el-button type="primary" @click="save" :loading="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("../director/proxyImg")
    module.exports={
        props:["propPoll","propTest","propUser","propBaseUrl"],
        data:function () {
            return {
                poll:function () {
                   if(this.propPoll)
                   {
                        return this.propPoll
                   }
                   else
                   {
                        return {
                            date:[],
                            time:[],
                            sendInfo:{
                                user:"",
                                password:"",
                                smtp:"",
                                port:465
                            },
                            baseUrl:this.propBaseUrl.length>0?this.propBaseUrl[0].url:""
                        }
                   }
                }.call(this),
                arrTest:this.propTest,
                arrUser:this.propUser,
                arrBaseUrl:this.propBaseUrl,
                defaultProps:{
                    children:"data",
                    label:"name"
                },
                selNode:function () {
                    if(this.propPoll)
                    {
                        return this.propPoll.test;
                    }
                    else
                    {
                        return []
                    }
                }.call(this),
                multipleSelection: [],
                savePending:false,
                removePending:false
            }
        },
        directives:{
            proxy:proxyImg
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val.map(function (obj) {
                    return obj._id
                });
            },
            save:function () {
                var arrTest=this.$refs.tree.getCheckedNodes();
                arrTest=arrTest.filter(function (obj) {
                    if(!obj.data)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                })
                if(arrTest.length==0)
                {
                    $.tip("请选择用例",0);
                    return;
                }
                arrTest=arrTest.map(function (obj) {
                    return obj._id
                });
                var arrUser=this.multipleSelection;
                if(arrUser.length==0)
                {
                    $.tip("请选择邮件接受用户",0);
                    return;
                }
                if(this.poll.time.length==0)
                {
                    $.tip("请选择时刻",0);
                    return;
                }
                if(this.poll.date.length==0)
                {
                    $.tip("请选择星期",0);
                    return;
                }
                if(!this.poll.baseUrl)
                {
                    $.tip("请选择baseUrl",0);
                    return;
                }
                if(!this.poll.sendInfo.user)
                {
                    $.tip("请输入发件人邮箱账户",0);
                    return;
                }
                if(!this.poll.sendInfo.password)
                {
                    $.tip("请输入发件人邮箱密码",0);
                    return;
                }
                if(!this.poll.sendInfo.smtp)
                {
                    $.tip("请输入发件人smtp地址",0);
                    return;
                }
                if(!this.poll.sendInfo.port)
                {
                    $.tip("请输入发件人smtp端口",0);
                    return;
                }
                this.savePending=true;
                var _this=this;
                net.post("/poll/save",{
                    project:session.get("projectId"),
                    users:JSON.stringify(arrUser),
                    date:JSON.stringify(this.poll.date),
                    time:JSON.stringify(this.poll.time),
                    user:this.poll.sendInfo.user,
                    password:this.poll.sendInfo.password,
                    smtp:this.poll.sendInfo.smtp,
                    port:this.poll.sendInfo.port,
                    url:this.poll.baseUrl,
                    test:JSON.stringify(arrTest)
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                        _this.$refs.box.close()
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            remove:function () {
                var _this=this;
                $.confirm("是否确认删除轮询",function () {
                    _this.removePending=true;
                    net.delete("/poll/item",{
                        project:session.get("projectId")
                    }).then(function (data) {
                        _this.removePending=false;
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.$refs.box.close()
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                })
            }
        },
        created:function () {
            if(this.propPoll)
            {
                var _this=this;
                this.propPoll.users.forEach(function (obj) {
                    _this.arrUser.forEach(function (obj1) {
                        if(obj1._id==obj._id)
                        {
                            _this.$nextTick(function () {
                                _this.$refs.user.toggleRowSelection(obj1,true);
                            })
                        }
                    })
                })
            }
        }
    }
</script>