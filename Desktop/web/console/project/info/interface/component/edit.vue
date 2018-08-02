<template>
    <el-row class="row">
        <el-row class="row" style="overflow-y: auto;height: calc(100vh - 245px);padding-bottom: 50px;background-color: white">
            <el-row class="row" style="height: 40px;line-height: 40px;padding-left: 5px">
                <i :class="showBasicInfo?'el-icon-caret-bottom':'el-icon-caret-right'" style="color:gray;cursor: pointer" @click="showBasicInfo=!showBasicInfo"></i>&nbsp;
                <el-input size="small" style="width: 40%;" class="inputPlain" v-model="interfaceEdit.name"></el-input>
                <el-dropdown split-button type="primary" size="mini" style="float: right;margin-right: 5px;margin-left: 0px;height: 29px;margin-top: -4px" @click="save" v-if="interfaceEditRole" id="btnSave" :loading="savePending" :disabled="savePending" class="btnMini">
                    <span v-if="!savePending">{{curParam.selExample.id?"保存实例":"保存"}}</span>
                    <i class="el-icon-loading" v-else></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="saveTemplate">保存为模板</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button size="mini" style="float: right;margin-top: 7px;margin-right: 5px;margin-left: 0" @click="$store.dispatch('changeType','preview')">
                    预览
                </el-button>
                <el-dropdown type="primary" style="float: right;margin-right: 15px;margin-left: 0px;height: 29px;margin-top: 2px;" @click="save" :loading="savePending" :disabled="savePending" v-if="interfaceEdit._id">
                    <el-button size="mini" class="el-dropdown-link">
                        更多
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="share">分享</el-dropdown-item>
                        <el-tooltip class="item" effect="dark" :content="objSnapshot.id?objSnapshot.dis:'当前为主干'" placement="left">
                            <el-dropdown-item @click.native="snapshotList">快照</el-dropdown-item>
                        </el-tooltip>
                    </el-dropdown-menu>
                </el-dropdown>
                <transition name="el-fade-in-linear">
                    <i class="fa fa-envelope-o" id="mail" v-show="mailShow"  style="float: right;margin-top: 9px;color:#17B9E6;margin-right: 5px;cursor: pointer;width: auto " @click="sendMail"></i>
                </transition>
            </el-row>
            <el-collapse-transition>
                <div v-show="showBasicInfo">
                    <el-form label-width="60px">
                        <el-row class="row">
                            <el-col class="col" :span="12">
                                <el-form-item label="分组" style="margin-bottom:5px">
                                    <el-cascader expand-trigger="hover" :options="arrGroup" :show-all-levels="false" style="width: 78%;text-align: center" v-model="group" :disabled="objSnapshot.id" size="mini"></el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col class="col" :span="12">
                                <el-form-item label="状态" style="margin-bottom:5px">
                                    <el-select style="width: 78%;text-align: center" v-model="interfaceEdit.finish" size="mini">
                                        <el-option  :value="0" label="开发中"></el-option>
                                        <el-option  :value="1" label="开发完成"></el-option>
                                        <el-option  :value="2" label="已废弃"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="row">
                            <el-form-item label="简介" style="margin-bottom:5px">
                                <el-input type="textarea" :rows="3" style="width: 90%" size="mini" v-model="interfaceEdit.remark">
                                </el-input>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
            </el-collapse-transition>
            <el-row class="row baseUrlPrepend" style="padding: 10px">
                <el-input size="small" placeholder="请输入接口路径(不包含BaseUrl)" v-model.trim="interfaceEdit.url" @input="changeUrl" @paste.native="paste">
                    <el-row class="row" slot="prepend">
                        <el-select style="width: 100px" v-model="interfaceEdit.method" @input="changeMethod" size="small">
                            <el-option  value="GET"></el-option>
                            <el-option  value="POST"></el-option>
                            <el-option  value="PUT"></el-option>
                            <el-option  value="DELETE"></el-option>
                            <el-option  value="PATCH"></el-option>
                        </el-select>
                        <el-autocomplete size="mini" style="width: calc(100% - 100px);position: absolute;left: 100px;top:-7px;" class="inline-input" :fetch-suggestions="querySearch"  placeholder="选择或者填入你的BaseUrl" popper-class="my-autocomplete" v-model="baseUrl">
                            <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete"></i>
                            <template slot-scope="props">
                                <div class="value">{{ props.item.value }}</div>
                                <span class="remark">{{ props.item.remark }}</span>
                            </template>
                        </el-autocomplete>
                    </el-row>
                    <el-button type="text" size="mini" @click="run" slot="append" :icon="runPending?'fa fa-spinner fa-spin':'fa fa-play'" style="width: 42px;color: #00adef">
                    </el-button>
                </el-input>
            </el-row>
            <el-row class="row" style="padding: 0 5px 0 5px">
                <el-tabs editable @edit="editTab" style="background-color: white;padding: 0px;" id="mainParam" v-model="tabIndex">
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
                            <div style="position: absolute;top: 5px;right: 20px;z-index: 1000;font-size: 14px" v-if="interfaceEdit._id && !curParam.unSave">
                                Example:&nbsp;
                                <el-autocomplete size="mini"  placeholder="筛选你的运行实例" v-model="curParam.selExample.value" :fetch-suggestions="querySearchExample" @select="changeExample">
                                    <el-dropdown slot="suffix" v-if="interfaceEditRole">
                            <span class="el-dropdown-link">
                                <i class="el-icon-menu el-input__icon"></i>
                            </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native="saveExample" v-if="curParam.selExample.id">保存</el-dropdown-item>
                                            <el-dropdown-item @click.native="renameExample" v-if="curParam.selExample.id">重命名</el-dropdown-item>
                                            <el-dropdown-item @click.native="saveAsExample">另存为</el-dropdown-item>
                                            <el-dropdown-item @click.native="removeExample" v-if="curParam.selExample.id">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-autocomplete>
                            </div>
                        </el-tab-pane>
                    </template>
                </el-tabs>
            </el-row>
        </el-row>
    </el-row>
</template>

<style>
    .interfaceBasicInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    .interfaceBasicInfo .el-form-item {
        margin-bottom: 0;
    }
    .inputPlain input {
        border-right: none;border-left:none;border-top:none;
        border-radius: 0;
        padding-left: 5px;
    }
    .baseUrlPrepend .el-input-group__prepend {
        width: 45%;
        padding: 0;
    }
    .baseUrlPrepend .el-select {
        margin-left:0;
        margin-right: 0;
    }
    .baseUrlPrepend .el-autocomplete.inline-input input {
        height: 30px;
        padding-left: 5px;
        border-top: none;
        border-right: none;
        border-bottom: none;
        font-size: 13px;
    }
    .el-tabs__content {
        width: 100%;
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
                showBasicInfo:false,
                showParam:false,
                runPending:false
            }
        },
        components:{
            "interfaceparam":interfaceParam
        },
        computed:{
            curParam:function () {
                return this.$store.getters.curParam;
            },
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
            baseUrl:{
                get:function () {
                    if(this.$store.getters.lastBaseUrl)
                    {
                        this.$store.state.baseUrl=this.$store.getters.lastBaseUrl;
                        return this.$store.getters.lastBaseUrl
                    }
                    else
                    {
                        return this.$store.state.baseUrl;
                    }
                },
                set:function (val) {
                    this.$store.commit("setBaseUrl",val);
                    this.$store.dispatch("setLastBaseUrl",val)
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
                var arr=this.$store.getters.interfaceList;
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
                    return session.get("baseUrl")+"/html/controller/share/share.html#"+this.interfaceEdit._id;
                }
                else
                {
                    return ""
                }
            },
            interface:function () {

            }
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
        },
        methods: {
            changeMethod:function () {
                this.$store.commit("changeMethod");
            },
            save:function () {
                if(this.curParam.selExample.id)
                {
                    this.saveExample();
                }
                else
                {
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
                    let bNew=false;
                    if(!this.interfaceEdit._id)
                    {
                        bNew=true;
                    }
                    this.savePending=true;
                    var _this=this;
                    this.$store.dispatch("save").then(function (data) {
                        _this.savePending=false;
                        if(data.code==200)
                        {
                            if(data.msg.indexOf("成功")>-1)
                            {
                                $.tip("保存成功",1)
                                if(bNew)
                                {
                                    helper.addPoint("addInterface","新建接口");
                                }
                            }
                            else
                            {
                                $.tip(data.msg,2)
                            }
                            _this.mailShow=true;
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                }
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
                            $.tip("创建成功",1);
                        }
                        else
                        {
                            throw data.msg
                        }
                    }).catch(function (err) {
                        $.stopHud();
                        $.tip(err,0)
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
                            id:_this.interfaceEdit._id,
                            snapshot:_this.objSnapshot
                        });
                        child.$on("create",function () {
                            _this.createSnapshot();
                        })
                        child.$on("return",function () {
                            _this.returnMaster();
                        })
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            returnMaster:function () {
                session.remove("snapshotId");
                session.remove("snapshotDis");
                session.remove("snapshotCreator");
                session.remove("snapshotDate");
                $.startHud();
                this.$store.dispatch("init",{
                    _id:this.interface._id,
                    group:""
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.tip("切换成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0);
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
                            $.tip("删除成功",1);
                            session.remove("snapshotId");
                            session.remove("snapshotDis");
                            session.remove("snapshotCreator");
                            session.remove("snapshotDate");
                            _this.$store.dispatch("init",{
                                _id:_this.interfaceEdit._id,
                                group:""
                            }).then(function (data) {
                                $.stopHud();
                                if(data.code==200)
                                {
                                    $.tip("切换到主干",1);
                                }
                                else
                                {
                                    $.tip(data.msg,0);
                                }
                            })
                        }
                        else
                        {
                            $.tip(data.msg,0)
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
                            $.tip("回滚成功",1);
                            session.remove("snapshotId");
                            session.remove("snapshotDis");
                            session.remove("snapshotCreator");
                            session.remove("snapshotDate");
                            _this.$store.dispatch("init",{
                                _id:_this.interfaceEdit._id,
                                group:""
                            }).then(function (data) {
                                $.stopHud();
                                if(data.code==200)
                                {
                                    $.tip("切换到主干",1);
                                }
                                else
                                {
                                    $.tip(data.msg,0);
                                }
                            })
                        }
                        else
                        {
                            $.tip(data.msg,0);
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
                        $.tip("请输入名称",0);
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
                        $.tip(obj1.msg,0);
                        return;
                    }
                    if(obj2.code==200)
                    {
                        if(!obj2.data.user)
                        {
                            $.tip("发件账户不存在，请前去个人设置里面设置",0);
                            return;
                        }
                    }
                    else
                    {
                        $.tip(obj2.msg,0);
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
                        $.tip(data.msg,0)
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
                            $.tip(data.msg,0);
                        }
                    })
                }
            },
            querySearch:function (queryString,cb) {
                var results=this.baseUrls.map(function (obj) {
                    return {
                        value:obj.url,
                        remark:obj.remark
                    }
                })
                if(this.interfaceEdit._id)
                {
                    results.push({
                        value:"MockServer",
                        remark:""
                    })
                }
                if(queryString)
                {
                    results=results.filter(function (obj) {
                        return obj.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
                    })
                }
                cb(results);
            },
            querySearchExample:function (queryString,cb) {
                net.get("/example/list",{
                    interface:this.interfaceEdit._id,
                    paramid:this.param[this.tabIndex].id
                }).then(function (data) {
                    var results=data.data;
                    results=results.map(function (obj) {
                        return {
                            id:obj._id,
                            value:obj.name
                        }
                    })
                    results.unshift({
                        value:"无运行实例",
                        id:""
                    })
                    cb(results);
                })
            },
            showAutoComplete:function (event) {
                this.baseUrl="";
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
            },
            run:function () {
                var _this=this;
                if(this.runPending)
                {
                    this.runPending=false;
                }
                else
                {
                    this.runPending=true;
                    this.$store.dispatch("run",this.$el).then(function (data) {
                        _this.runPending=false;
                        if(data.code==200)
                        {
                            helper.addPoint("run","运行");
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                }
            },
            querySearchExample:function (queryString,cb) {
                net.get("/example/list",{
                    interface:this.interfaceEdit._id,
                    paramid:this.param[this.tabIndex].id
                }).then(function (data) {
                    var results=data.data;
                    results=results.map(function (obj) {
                        return {
                            id:obj._id,
                            value:obj.name
                        }
                    })
                    results.unshift({
                        value:"无运行实例",
                        id:""
                    })
                    cb(results);
                })
            },
            changeExample:function (item) {
                var _this=this;
                $.startHud();
                this.$store.dispatch("changeExample",item.id).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.tip("切换成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0)
                    }
                });
            },
            renameExample:function () {
                var _this=this;
                $.input("请输入运行实例名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入运行实例名称",0);
                        return false
                    }
                    $.startHud();
                    _this.$store.dispatch("saveExample",{
                        type:"rename",
                        name:val.value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("保存成功",1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                    return true;
                });
            },
            saveExample:function () {
                this.$store.dispatch("saveExample",{
                    type:"save"
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.tip("保存成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            saveAsExample:function () {
                var _this=this;
                $.input("请输入运行实例名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入运行实例名称",0);
                        return false
                    }
                    $.startHud();
                    _this.$store.dispatch("saveExample",{
                        type:"saveAs",
                        name:val.value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("保存成功",1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                    return true;
                });
            },
            removeExample:function () {
                var _this=this;
                $.confirm("是否删除该运行实例?",function () {
                    $.startHud();
                    _this.$store.dispatch("removeExample").then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("删除成功",1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            joinTest:function () {
                var _this=this;
                $.startHud();
                this.$store.dispatch("joinTest").then(function (obj) {
                    $.stopHud();
                    var o={
                        type:"interface",
                        id:0,
                        name:_this.curParam.selExample.id?(obj.name+"("+_this.curParam.selExample.value+")"):obj.name,
                        data:JSON.stringify(obj),
                        argv:{
                            param:{},
                            query:{},
                            header:{},
                            body:{}
                        },
                        status:0,
                        modify:0
                    };
                    $.startHud();
                    net.get("/test/allgrouplist").then(function (data) {
                        $.stopHud();
                        if(data.code!=200)
                        {
                            $.tip(data.msg,0);
                        }
                        $.showBox(_this,require("../test/test.vue"),{
                            testType:1,
                            propTestGroupList:data.data,
                            propJoin:o
                        });
                    })
                })
            },
            moveInterface:function (obj) {
                if(obj.id==this.interfaceEdit._id)
                {
                    this.interfaceEdit.group._id=obj.group;
                }
            },
            autoSave:function () {
                if(session.get("snapshotId") || this.snapshot.id)
                {
                    return;
                }
                if(this.interfaceEdit._id)
                {
                    this.$store.dispatch("save")
                }
            },
            share:function () {
                if(this.interfaceEdit._id)
                {
                    this.$api.clipboard.copyText(this.shareUrl);
                    $.tip("已复制到剪切板！",1);
                }
                else
                {
                    $.tip("请先保存接口!",0);
                }
            },
        },
        created:function () {
            var _this=this;
            this.$store.getters.event.$on("initInterface",this.initInterface)
            this.$store.getters.event.$on("moveInterface",this.moveInterface)
            this.$store.getters.event.$on("saveInterface",this.autoSave)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("initInterface",this.initInterface)
            this.$store.getters.event.$off("moveInterface",this.moveInterface)
            this.$store.getters.event.$off("saveInterface",this.autoSave)
        },
        mounted:function () {
            this.exampleList();
        }
    }
</script>