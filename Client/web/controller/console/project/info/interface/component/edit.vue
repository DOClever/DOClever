<template>
    <el-row class="row">
        <el-row class="row" style="height: 35px;line-height: 35px">
            <el-tooltip class="item" effect="dark" content="启用自动保存后，每5秒自动保存当前接口编辑信息" placement="bottom">
                <el-checkbox v-model="$store.state.autoSave" :true-label="1" :false-label="0" style="font-size: 14px">自动保存</el-checkbox>
            </el-tooltip>
            <el-button size="mini" type="text" icon="fa fa-arrows-alt" style="margin-left: 5px;font-size: 15px" title="放大/缩小" @click="$store.getters.event.$emit('toggleMax')"></el-button>
            <el-button size="mini" type="text" icon="el-icon-document" style="margin-left: 5px;font-size: 15px" title="文档引用" @click="docRef" v-if="interfaceEdit._id"></el-button>
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" @click="$store.dispatch('changeType','run')" v-if="arrExample.length==0">
                运行
            </el-button>
            <el-dropdown split-button type="primary" size="mini" style="float: right;margin-right: 5px;margin-left: 0px" @click="$store.dispatch('changeType','run')" v-else>
                运行
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in arrExample" @click.native="run(item)">
                        {{item.name}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown split-button type="primary" size="mini" style="float: right;margin-right: 5px;margin-left: 0px" @click="save" v-if="interfaceEditRole" id="btnSave" :loading="savePending" :disabled="savePending">
                <span v-if="!savePending">保存</span>
                <i class="el-icon-loading" v-else></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="saveTemplate">保存为模板</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0" @click="$store.dispatch('changeType','preview')">
                预览
            </el-button>
            <transition name="el-fade-in-linear">
                <i class="fa fa-envelope-o" id="mail" v-show="mailShow"  style="float: right;margin-top: 9px;color:#17B9E6;margin-right: 5px;cursor: pointer;width: auto " @click="sendMail"></i>
            </transition>
        </el-row>
        <el-row class="row" style="margin-top: 5px;overflow-y: auto;height: calc(100vh - 150px);padding-bottom: 80px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)">
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    基本信息&nbsp;
                    <el-tooltip class="item" effect="dark" placement="bottom" trigger="hover" :content="editInfo">
                        <i class="el-icon-info" style="font-size: 12px;"></i>
                    </el-tooltip>
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <el-form label-position="top" label-width="80px" style="padding: 10px 100px 20px 10px" id="interfaceBasicInfo">
                    <el-row class="row">
                        <el-col class="col" :span="12">
                            <el-form-item label="名称">
                                <el-input style="width: 90%" size="small" v-model="interfaceEdit.name" placeholder="请输入接口名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="12">
                            <el-form-item label="简介">
                                <el-tooltip class="item" effect="dark" :content="interfaceEdit.remark" placement="bottom" :disabled="!interfaceEdit.remark">
                                    <el-input style="width: 90%" size="small" v-model="interfaceEdit.remark">
                                        <i slot="suffix" class="el-input__icon el-icon-edit" @click="editRemark" style="cursor: pointer"></i>
                                    </el-input>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-col class="col" :span="12">
                            <el-form-item label="分组">
                                <el-cascader expand-trigger="hover" :options="arrGroup" :show-all-levels="false" style="width: 90%;text-align: center" v-model="group" :disabled="objSnapshot.id" size="small"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="12">
                            <el-form-item label="状态">
                                <el-select style="width: 90%;text-align: center" v-model="interfaceEdit.finish" size="small">
                                    <el-option  :value="0" label="开发中"></el-option>
                                    <el-option  :value="1" label="开发完成"></el-option>
                                    <el-option  :value="2" label="已废弃"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-form-item label="路径">
                            <el-select style="width: 20%;text-align: center" v-model="interfaceEdit.method" @input="changeMethod" size="small">
                                <el-option  value="GET"></el-option>
                                <el-option  value="POST"></el-option>
                                <el-option  value="PUT"></el-option>
                                <el-option  value="DELETE"></el-option>
                                <el-option  value="PATCH"></el-option>
                            </el-select>
                            <el-input size="small" style="width: calc(75% - 14px);margin-left: 10px" placeholder="请输入接口路径(不包含BaseUrl)" v-model.trim="interfaceEdit.url" @input="changeUrl" @paste.native="paste"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row class="row" v-if="interfaceEdit.id">
                        <el-form-item label="分享">
                            <el-input size="small" style="width: 95%" v-model="shareUrl" id="shareUrl" disabled>
                                <i slot="suffix" class="el-input__icon fa fa-copy" @click="copyClipboard" title="复制" style="cursor: pointer"></i>
                            </el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row class="row" style="background-color: white;margin-top: 15px;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);" v-if="interfaceEdit._id">
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    快照信息
                    <template v-if="objSnapshot.id">
                        <el-button @click="returnMaster" type="primary" size="mini" style="float: right;margin-right: 5px;margin-left: 0;margin-top: 6px" key="returnMaster">返回主干</el-button>
                        <el-button @click.native="snapshotList" type="primary" size="mini" style="float: right;margin-right: 5px;margin-left: 0;margin-top: 6px" key="snapshotList">列表</el-button>
                        <el-button @click.native="rollSnapshot" type="primary" size="mini" style="float: right;margin-right: 5px;margin-left: 0;margin-top: 6px" key="rollSnapshot">回滚</el-button>
                        <el-button @click.native="removeSnapshot" type="danger" size="mini" style="float: right;margin-right: 5px;margin-left: 0;margin-top: 6px" key="removeSnapshot">删除</el-button>
                    </template>
                    <template v-else>
                        <el-button @click.native="snapshotList" type="primary" size="mini" style="float: right;margin-right: 5px;margin-left: 0;margin-top: 6px" key="snapshotList1">列表</el-button>
                        <el-button @click.native="createSnapshot" type="primary" size="mini" style="float: right;margin-right: 5px;margin-left: 0;margin-top: 6px" key="createSnapshot">创建</el-button>
                    </template>
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <el-row class="row" style="padding-left: 10px;font-size: 14px">
                    <div v-if="!objSnapshot.id" style="height: 50px;line-height: 50px">
                        当前为主干
                    </div>
                    <template v-else>
                        <el-form size="small" label-width="80px" label-position="left">
                            <el-form-item label="时间">
                                {{objSnapshot.date}}
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input type="textarea" :rows="2" style="width: 90%" v-model="objSnapshot.dis"></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-row>
            </el-row>
            <el-tabs type="border-card" editable @edit="editTab" style="background-color: white;padding: 0px;margin-top: 15px;border-radius: 5px;" id="mainParam" v-model="tabIndex">
                <template v-for="(item, index) in param">
                    <el-tab-pane :key="item.id" :name="index">
                    <span slot="label">
                        <el-tooltip class="item" effect="dark" placement="bottom" width="200" :content="item.remark" v-if="item.remark">
                            <span>{{item.name}}</span>
                        </el-tooltip>
                        <span v-else>{{item.name}}</span>&nbsp
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-caret-bottom" style="color:rgb(80, 191, 255) ;"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="editParam(item)">编辑</el-dropdown-item>
                                <el-dropdown-item @click.native="cloneParam(item)">克隆</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                        <interfaceparam :index="index" :item="item"></interfaceparam>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </el-row>
    </el-row>
</template>

<style>
    #interfaceBasicInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #interfaceBasicInfo .el-form-item {
        margin-bottom: 0;
    }
    #mainParam .el-tabs__new-tab
    {
        color: rgb(80, 191, 255);
        border: 1px rgb(80, 191, 255) solid;
        margin-right: 5px;
    }
    #mainParam .el-tabs__nav-wrap
    {
        border-radius: 5px;
    }
    #mainParam .el-tabs__header {
        border-radius: 5px;
    }
    #mainParam .el-tabs__nav-scroll {
        padding-left: 0px;
        padding-right: 0px;
    }
    #mainParam.el-tabs--border-card {
        border: none
    }
    #mainParam .el-tabs__content {
        padding: 0 5px 20px 10px;
    }
</style>

<script>
    var con=require("common/js/config");
    var interfaceParam=require("./interfaceParam.vue");
    var saveTemplate=require("./saveTemplate.vue")
    module.exports = {
        data: function () {
            return {
                savePending:false,
                snapshot:{},
                mailShow:false,
                timerSave:null
            }
        },
        components:{
            "interfaceparam":interfaceParam
        },
        computed:{
            arrExample:function () {
                var id=this.param[this.index].id;
                if(id && this.$store.state.example[id])
                {
                    return this.$store.state.example[id]
                }
                else
                {
                    return [];
                }
            },
            interfaceEdit:function () {
                return this.$store.state.interfaceEdit
            },
            editInfo:function () {
                return this.interfaceEdit?(this.interfaceEdit.createdAt?((this.interfaceEdit.owner?this.interfaceEdit.owner.name:"")+"在"+this.interfaceEdit.createdAt+"创建，最近修改被"+(this.interfaceEdit.editor?this.interfaceEdit.editor.name:"")+"在"+this.interfaceEdit.updatedAt+"改动"):"接口尚未保存"):"";
            },
            param:function () {
                return this.$store.state.param
            },
            index:function () {
                return this.$store.state.index
            },
            tabIndex:{
                get:function () {
                    var val=this.$store.state.index;
                    if(val===0)
                    {
                        val="0"
                    }
                    return val;
                },
                set:function (val) {
                    this.$store.commit("setIndex",parseInt(val));
                }
            },
            baseUrls:function(){
                return this.$store.getters.baseUrls;
            },
            group:{
                get:function () {
                    var val=this.interfaceEdit.group._id;
                    var arr=this.arrGroup;
                    var ret=[];
                    (function _map(arr) {
                        for(var i=0;i<arr.length;i++)
                        {
                            var obj=arr[i];
                            ret.push(obj.value);
                            if(obj.value==val)
                            {
                                return true;
                            }
                            else if(obj.children)
                            {
                                var v=arguments.callee(obj.children);
                                if(v)
                                {
                                    return true;
                                }
                                else
                                {
                                    ret.pop();
                                }
                            }
                            else
                            {
                                ret.pop();
                            }
                        }
                        return false;
                    })(arr)
                    return ret;
                },
                set:function (val) {
                    this.interfaceEdit.group._id=val[val.length-1];
                }
            },
            arrGroup:function () {
                var arr=this.$store.state.interfaceList;
                var arrGroup=[];
                (function _map(arr,arrGroup) {
                    for(var i=0;i<arr.length;i++)
                    {
                        var obj=arr[i];
                        if(obj.data)
                        {
                            var obj1={
                                value:obj._id,
                                label:obj.name,
                            };
                            if(obj.data.length>0)
                            {
                                obj1.children=[];
                                arguments.callee(obj.data,obj1.children);
                                if(obj1.children.length==0)
                                {
                                    delete obj1.children
                                }
                            }
                            arrGroup.push(obj1);
                        }
                    }
                })(arr,arrGroup);
                return arrGroup;
            },
            objSnapshot:function () {
                if(this.interfaceEdit)
                {
                    this.snapshot= {
                        id:session.get("snapshotId"),
                        dis:session.get("snapshotDis"),
                        creator:session.get("snapshotCreator"),
                        date:session.get("snapshotDate")
                    }
                }
                else
                {
                    this.snapshot= {};
                }
                return this.snapshot;
            },
            interfaceEditRole:function () {
                return this.$store.getters.interfaceEditRole
            },
            shareUrl:function () {
                if(this.interfaceEdit)
                {
                    return con.baseUrl+"/html/web/controller/share/share.html#"+this.interfaceEdit._id;
                }
                else
                {
                    return ""
                }
            },
        },
        watch:{
            "objSnapshot.dis":function (val) {
                session.set("snapshotDis",val);
            },
            mailShow:function (val) {
                if(val)
                {
                    var _this=this;
                    setTimeout(function () {
                        _this.mailShow=false;
                    },2000);
                }
            },
            "interfaceEdit.url":function (val) {
                if(/http\:\/\/|https\:\/\//i.test(val))
                {
                    $.tip("请不要在路径里面包含baseUrl",0);
                }
            },
            "$store.state.autoSave":function (val) {
                if(val==0)
                {
                    if(this.timerSave)
                    {
                        clearTimeout(this.timerSave);
                        this.timerSave=null;
                    }
                }
                else
                {
                    if(!this.timerSave)
                    {
                        var _this=this;
                        this.timerSave=setTimeout(function autoSave() {
                            if(_this.$store.state.autoSave==0)
                            {
                                clearTimeout(_this.timerSave);
                                _this.timerSave=null;
                                return
                            }
                            if(_this.$store.state.interfaceEdit && _this.$store.state.interfaceEdit._id)
                            {
                                _this.$store.dispatch("save").then(function (data) {
                                    if(data.code==200)
                                    {
                                        _this.timerSave=setTimeout(autoSave,5000);
                                    }
                                })
                            }
                            else
                            {
                                _this.timerSave=setTimeout(autoSave,5000);
                            }
                        },5000);
                    }
                }
            }
        },
        methods: {
            changeMethod:function () {
                this.$store.commit("changeMethod");
            },
            save:function () {
                if(!this.interfaceEdit.name)
                {
                    $.tip("请填入接口名称",0);
                    return;
                }
                else if(!this.interfaceEdit.url)
                {
                    $.tip("请填入接口地址",0);
                    return;
                }
                this.savePending=true;
                var _this=this;
                this.$store.dispatch("save").then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        if(data.msg.indexOf("成功")>-1)
                        {
                            $.notify("保存成功",1)
                        }
                        else
                        {
                            $.tip(data.msg,2)
                        }
                        _this.mailShow=true;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            changeUrl:function (val) {
                this.$store.commit("changeUrl",val);
            },
            paste:function () {
                var _this=this;
                setTimeout(function () {
                    var path=_this.interfaceEdit.url;
                    var bMark=false;
                    var index=path.indexOf("?");
                    if(index>-1)
                    {
                        bMark=true;
                        _this.interfaceEdit.url=_this.interfaceEdit.url.substring(0,index);
                    }
                    else
                    {
                        return;
                    }
                    for(var i=0;i<_this.$store.state.param.length;i++)
                    {
                        var arrStoreQuery=_this.$store.state.param[i].query;
                        arrStoreQuery.splice(0,arrStoreQuery.length);
                        if(bMark)
                        {

                            var arr=path.split("?");
                            if(arr[1])
                            {
                                var query=arr[1];
                                var arrQuery=query.split("&");
                                for(var i=0;i<arrQuery.length;i++)
                                {
                                    if(arrQuery[i])
                                    {
                                        var arrQuery1=arrQuery[i].split("=");
                                        arrStoreQuery.push({
                                            name:arrQuery1[0],
                                            value:arrQuery1[1]?{
                                                type:0,
                                                status:"",
                                                data:[{
                                                    value:decodeURIComponent(arrQuery1[1]),
                                                    remark:""
                                                }]
                                            }:{
                                                type:0,
                                                status:"",
                                                data:[]
                                            },
                                            must:1,
                                            remark:""
                                        })
                                    }
                                }
                            }
                        }
                        else
                        {
                            arrStoreQuery.push({
                                name:"",
                                must:0,
                                remark:""
                            })
                        }
                        _this.$store.state.param[i].queryParam=arrStoreQuery;
                    }
                },100)
            },
            createSnapshot:function () {
                if(!this.interfaceEdit.name)
                {
                    $.tip("请填入接口名称",0);
                    return;
                }
                else if(!this.interfaceEdit.url)
                {
                    $.tip("请填入接口地址",0);
                    return;
                }
                var _this=this;
                $.inputMul(this,"请输入快照信息",function (val) {
                    if(!val)
                    {
                        $.tip("请输入快照信息",0);
                        return false
                    }
                    $.startHud();
                    _this.$store.dispatch("save").then(function (data) {
                        if(data.code==200)
                        {
                            return net.post("/interface/snapshot",{
                                id:_this.interfaceEdit._id,
                                dis:val
                            })
                        }
                        else
                        {
                            throw data.msg
                        }
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            $.stopHud();
                            $.notify("创建成功",1);
                        }
                        else
                        {
                            throw data.msg
                        }
                    }).catch(function (err) {
                        $.stopHud();
                        $.notify(err,0)
                    })
                    return true;
                })
            },
            snapshotList:function () {
                var _this=this;
                $.startHud();
                net.get("/interface/snapshotlist",{
                    id:this.interfaceEdit._id,
                    page:0
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./snapshotList.vue"),{
                            arr:data.data,
                            id:_this.interfaceEdit._id
                        });

                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            returnMaster:function () {
                session.remove("snapshotId");
                session.remove("snapshotDis");
                session.remove("snapshotCreator");
                session.remove("snapshotDate");
                $.startHud();
                this.$store.dispatch("info",{
                    item1:{
                        "_id":this.interfaceEdit.id,
                    },
                    item:{
                        "_id":""
                    }
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("切换成功",1);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            removeSnapshot:function () {
                var _this=this;
                $.confirm("是否删除该快照",function () {
                    $.startHud();
                    net.delete("/interface/snapshot",{
                        id:_this.interfaceEdit._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            session.remove("snapshotId");
                            session.remove("snapshotDis");
                            session.remove("snapshotCreator");
                            session.remove("snapshotDate");
                            _this.$store.dispatch("info",{
                                item1:{
                                    "_id":_this.interfaceEdit.id,
                                },
                                item:{
                                    "_id":""
                                }
                            }).then(function (data) {
                                $.stopHud();
                                if(data.code==200)
                                {
                                    $.notify("切换到主干",1);
                                }
                                else
                                {
                                    $.notify(data.msg,0);
                                }
                            })
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            rollSnapshot:function () {
                var _this=this;
                $.confirm("是否回滚该快照",function () {
                    $.startHud();
                    net.put("/interface/snapshotroll",{
                        id:_this.interfaceEdit._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("回滚成功",1);
                            session.remove("snapshotId");
                            session.remove("snapshotDis");
                            session.remove("snapshotCreator");
                            session.remove("snapshotDate");
                            _this.$store.dispatch("info",{
                                item1:{
                                    "_id":_this.interfaceEdit.id,
                                },
                                item:{
                                    "_id":""
                                }
                            }).then(function (data) {
                                $.stopHud();
                                if(data.code==200)
                                {
                                    $.notify("切换到主干",1);
                                }
                                else
                                {
                                    $.notify(data.msg,0);
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
            editTab:function (target,action) {
                if(action=="add")
                {
                    this.$store.commit("addParam");
                }
                else if(action=="remove")
                {
                    var _this=this;
                    if(this.param.length==1)
                    {
                        $.tip("至少有一个tab",0);
                    }
                    else
                    {
                        $.confirm("是否删除该Tab",function () {
                            _this.$store.commit("removeParam",target);
                        })
                    }
                }
            },
            editParam:function (item) {
                var _this=this;
                $.inputTwo(this,"名称","备注","请输入名称","请输入备注",item.name,item.remark,function (title,content) {
                    if(!title)
                    {
                        $.notify("请输入名称",0);
                        return
                    }
                    item.name=title;
                    item.remark=content;
                    return true;
                })
            },
            cloneParam:function (item) {
                this.$store.commit("addParam",1);
            },
            sendMail:function () {
                var _this=this;
                Promise.all([
                    net.get("/project/users",{
                        id:session.get("projectId")
                    }),
                    net.get("/user/sendinfo")
                ]).then(function (data) {
                    var obj1=data[0];
                    var obj2=data[1];
                    var user;
                    if(obj1.code==200)
                    {
                        user=obj1.data.filter(function (obj) {
                            if(obj._id==session.get("id"))
                            {
                                return false;
                            }
                            else
                            {
                                return true;
                            }
                        });
                    }
                    else
                    {
                        $.notify(obj1.msg,0);
                        return;
                    }
                    if(obj2.code==200)
                    {
                        if(!obj2.data.user)
                        {
                            $.notify("发件账户不存在，请前去个人设置里面设置",0);
                            return;
                        }
                    }
                    else
                    {
                        $.notify(obj2.msg,0);
                        return;
                    }
                    $.showBox(_this,require("./sendMail.vue"),{
                        source:user,
                        id:_this.interfaceEdit._id
                    })
                })
            },
            copyClipboard:function () {
                var ele=document.getElementById("shareUrl");
                ele.disabled=false;
                ele.select();
                document.execCommand("Copy");
                ele.disabled=true;
                $.tip("已复制到剪贴板",1);
            },
            editRemark:function () {
                var _this=this;
                $.inputMul(this,"编辑remark",function (val) {
                    _this.interfaceEdit.remark=val;
                    return true;
                },1,this.interfaceEdit.remark)
            },
            saveTemplate:function () {
                $.showBox(this,saveTemplate);
            },
            initInterface:function (data) {
                this.mailShow=false;
                this.exampleList();
            },
            docRef:function () {
                $.startHud();
                var _this=this;
                net.get("/interface/docref",{
                    id:this.interfaceEdit._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        if(data.data.length==0)
                        {
                            $.tip("该接口没有文档引用",2)
                        }
                        else
                        {
                            $.showBox(_this,require("./docRef.vue"),{
                                arr:data.data,
                                id:_this.interfaceEdit._id
                            })
                        }
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            exampleList:function () {
                var _this=this;
                if(this.interfaceEdit._id)
                {
                    net.get("/example/alllist",{
                        interface:this.interfaceEdit._id,
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            _this.$store.state.example=data.data;
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                }
            },
            run:function (item) {
                session.set("exampleId",item._id);
                this.$store.dispatch('changeType','run');
            }
        },
        created:function () {
            var _this=this;
            this.$store.getters.event.$on("initInterface",this.initInterface)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("initInterface",this.initInterface)
            if(this.timerSave)
            {
                clearTimeout(this.timerSave);
                this.timerSave=null;
            }
        },
        mounted:function () {
            this.exampleList();
        }
    }
</script>