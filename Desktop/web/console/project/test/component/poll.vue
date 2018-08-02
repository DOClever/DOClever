<template>
    <el-dialog :title="propPoll?'编辑轮询':'创建轮询'"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <span style="color: red">带有input和文件上传的用例，在无人干预的情况下测试可能会失败！</span>
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
                    <el-checkbox :label="n-1" v-for="n in 24" :key="n-1">{{n-1}}:00</el-checkbox>
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
            <el-form-item label="立即执行一次" style="text-align: center">
                <el-switch v-model="immediate" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="用例失败才发送" style="text-align: center">
                <el-switch v-model="poll.failSend" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="BaseUrl" style="text-align: center">
                <el-cascader size="small" expand-trigger="hover" :options="arrProjectUrl" v-model="arrSelBaseUrl" style="width: 90%" filterable clearable placeholder="请选择BaseUrl" :props="props" @input="changeBaseUrl">
                </el-cascader>
            </el-form-item>
            <el-tabs type="card">
                <el-tab-pane label="邮箱">
                    <el-form-item label="发件人邮箱账户" style="text-align: center">
                        <el-input size="small" placeholder="请输入发件人的邮箱账户(如：aaa@qq.com)" style="width: 80%" v-model="poll.sendInfo.user"></el-input>
                    </el-form-item>
                    <el-form-item label="发件人邮箱密码" style="text-align: center">
                        <el-input size="small" placeholder="请输入发件人的邮箱密码" style="width: 80%" v-model="poll.sendInfo.password"></el-input>
                    </el-form-item>
                    <el-form-item label="发件人smtp地址" style="text-align: center">
                        <el-input size="small" placeholder="请输入发件人的smtp地址(如：smtp.qq.com)" style="width: 80%" v-model="poll.sendInfo.smtp"></el-input>
                    </el-form-item>
                    <el-form-item label="发件人smtp端口" style="text-align: center">
                        <el-input size="small" placeholder="请输入发件人smtp端口号" style="width: 80%" v-model="poll.sendInfo.port"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="短信">
                    <el-form-item label="URL方法" style="text-align: center">
                        <el-select size="small" v-model="poll.phoneInfo.method">
                            <el-option label="GET" value="GET"></el-option>
                            <el-option label="POST" value="POST"></el-option>
                            <el-option label="PUT" value="PUT"></el-option>
                            <el-option label="DELETE" value="DELETE"></el-option>
                            <el-option label="PATCH" value="PATCH"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="URL" style="text-align: center">
                        <el-input size="small" placeholder="请输入URL地址" style="width: 80%" v-model="poll.phoneInfo.baseUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="号码绑定字段" style="text-align: center">
                        <el-input size="small" placeholder="请输入绑定到url参数的手机号码字段名称" style="width: 80%" v-model="poll.phoneInfo.bindParam"></el-input>
                    </el-form-item>
                    <el-form-item label="号码分隔符" style="text-align: center">
                        <el-input size="small" placeholder="请输入手机号码分隔符" style="width: 80%" v-model="poll.phoneInfo.split"></el-input>
                    </el-form-item>
                    <el-form-item label="内容绑定字段" style="text-align: center">
                        <el-input size="small" placeholder="请输入绑定到url参数的发送内容的字段名称" style="width: 80%" v-model="poll.phoneInfo.contentParam"></el-input>
                    </el-form-item>
                    <el-form-item label="签名" style="text-align: center">
                        <el-input size="small" placeholder="请输入附加到发送内容的签名" style="width: 80%" v-model="poll.phoneInfo.sign"></el-input>
                    </el-form-item>
                    <el-form-item label="url参数" style="text-align: center">
                        <template v-for="(item,index) in poll.phoneInfo.param">
                            <el-row class="row" style="height: 50px;line-height: 50px;width: 90%;display: inline-block">
                                <el-col :span="10" class="col">
                                    <el-input size="small" placeholder="请输入参数名称" style="width: 80%" v-model="item.key" @input="index==poll.phoneInfo.param.length-1?addParam():''"></el-input>
                                </el-col>
                                <el-col :span="10" class="col">
                                    <el-input size="small" placeholder="请输入参数值" style="width: 80%" v-model="item.value"></el-input>
                                </el-col>
                                <el-col :span="4" class="col">
                                    <el-button size="mini" type="text" icon="close" style="color: red" @click="removeParam(item,index)">
                                    </el-button>
                                </el-col>
                            </el-row>
                        </template>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <el-row class="dialog-footer" slot="footer">
            <el-button size="mini" type="danger" @click="remove" :loading="removePending" v-if="propPoll">
                删除轮询
            </el-button>
            <el-button size="mini" type="primary" @click="save" :loading="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    module.exports={
        props:["propPoll","propUser","propBaseUrl","propSendInfo","collection"],
        data:function () {
            return {
                arrProjectUrl:this.propBaseUrl,
                arrSelBaseUrl:function () {
                    var arr=[];
                    if(this.propPoll)
                    {
                        for(var i=0;i<this.propBaseUrl.length;i++)
                        {
                            arr.push(this.propBaseUrl[i]._id)
                            for(var j=0;j<this.propBaseUrl[i].data.length;j++)
                            {
                                if(this.propBaseUrl[i].data[j].name==this.propPoll.baseUrl)
                                {
                                    arr.push(this.propBaseUrl[i].data[j].name);
                                    return arr;
                                }
                            }
                            arr.pop();
                        }
                    }
                    return arr;
                }.call(this),
                props:{
                    value:"_id",
                    label:"name",
                    children:"data"
                },
                poll:function () {
                    if(this.propPoll)
                    {
                        if(!this.propPoll.phoneInfo)
                        {
                            this.propPoll.phoneInfo={
                                method:"GET",
                                baseUrl:"",
                                param:[{
                                    key:"",
                                    value:""
                                }],
                                bindParam:"",
                                split:",",
                                contentParam:"",
                                sign:""
                            }
                        }
                        return this.propPoll
                    }
                    else
                    {
                        return {
                            date:[],
                            time:[],
                            sendInfo:this.propSendInfo.user?this.propSendInfo:{
                                user:"",
                                password:"",
                                smtp:"",
                                port:465
                            },
                            baseUrl:this.propBaseUrl.length>0?this.propBaseUrl[0].url:"",
                            phoneInfo:{
                                method:"GET",
                                baseUrl:"",
                                param:[{
                                    key:"",
                                    value:""
                                }],
                                bindParam:"",
                                split:",",
                                contentParam:"",
                                sign:""
                            },
                            failSend:0
                        }
                    }
                }.call(this),
                arrUser:this.propUser,
                multipleSelection: [],
                savePending:false,
                removePending:false,
                showDialog:false,
                immediate:false
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
                var query={
                    project:session.get("projectId"),
                    users:JSON.stringify(arrUser),
                    date:JSON.stringify(this.poll.date),
                    time:JSON.stringify(this.poll.time),
                    user:this.poll.sendInfo.user,
                    password:this.poll.sendInfo.password,
                    smtp:this.poll.sendInfo.smtp,
                    port:this.poll.sendInfo.port,
                    url:this.poll.baseUrl,
                    immediate:this.immediate?1:0,
                    phoneinfo:JSON.stringify(this.poll.phoneInfo),
                    failsend:Number(this.poll.failSend),
                    collection:this.collection,
                    interproject:this.poll.interProject?this.poll.interProject:"",
                    owner:this.$store.state.selUser
                };
                if(this.poll._id)
                {
                    query.id=this.poll._id;
                }
                else
                {
                    query.owner=session.get("id");
                }
                net.post("/poll/save",query).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.tip("保存成功",1);
                        _this.showDialog=false;
                        _this.$emit("save",data.data._id);
                        if(!query.id)
                        {
                            helper.addPoint("addPoll","新建轮询");
                        }
                    }
                    else
                    {
                        $.tip(data.msg,0)
                    }
                })
            },
            remove:function () {
                var _this=this;
                $.confirm("是否确认删除轮询",function () {
                    _this.removePending=true;
                    net.delete("/poll/item",{
                        id:_this.poll._id
                    }).then(function (data) {
                        _this.removePending=false;
                        if(data.code==200)
                        {
                            $.tip("删除成功",1);
                            _this.showDialog=false;
                            _this.$emit("remove")
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            addParam:function () {
                this.poll.phoneInfo.param.push({
                    key:"",
                    value:""
                })
            },
            removeParam:function (item,index) {
                if(index==0)
                {
                    this.poll.phoneInfo.param[0]={
                        key:"",
                        value:""
                    }
                }
                else
                {
                    this.poll.phoneInfo.param.splice(index,1)
                }
            },
            changeBaseUrl:function () {
                var id;
                for(var i=0;i<this.arrProjectUrl.length;i++)
                {
                    var bFind=false;
                    for(var j=0;j<this.arrProjectUrl[i].data.length;j++)
                    {
                        if(this.arrProjectUrl[i].data[j].name==this.arrSelBaseUrl[1])
                        {
                            id=this.arrProjectUrl[i]._id;
                            bFind=true;
                            break;
                        }
                    }
                    if(bFind)
                    {
                        break;
                    }
                }
                this.poll.baseUrl=this.arrSelBaseUrl[1];
                this.poll.interProject=id;
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