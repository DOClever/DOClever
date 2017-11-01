<template>
    <el-row class="row" style="margin:0 0 0 5px" id="body" :gutter="20">
        <el-col class="col" :span="bMax?0:6" style="min-height: 600px;background-color: white;box-shadow: 2px 2px 2px #888888;border-radius: 5px;margin: 0;padding: 0" v-show="!bMax">
            <el-row class="row" style="height: 50px;background-color: #50bfff;color: white;margin: 0;padding: 0" id="group" v-if="!search">
                <el-col class="col" :span="6" style="line-height: 50px;text-align: center;font-weight: bold;font-size: 15px;padding: 0">
                    分组
                </el-col>
                <el-col class="col" :span="interfaceEditRole?6:12"></el-col>
                <el-col class="col" :span="3" style="cursor: pointer;text-align: center;line-height: 50px;" title="导入分组" v-if="interfaceEditRole" @click.native="importGroup">
                    <i class="fa fa-download"></i>
                </el-col>
                <el-col class="col" :span="3" style="cursor: pointer;text-align: center;line-height: 50px;" title="添加分组" v-if="interfaceEditRole" @click.native="addGroup">
                    <i class="el-icon-plus"></i>
                </el-col>
                <el-col class="col" :span="3" style="cursor: pointer;text-align: center;line-height: 50px;" title="排序">
                    <el-dropdown trigger="hover" style="width: 100%;height: 100%;cursor: pointer">
                        <div class="el-dropdown-link">
                            <i class="fa fa-sort-amount-desc" style="color: white"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><div @click="sortType=0"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==0"></i>&nbsp;名称</div></el-dropdown-item>
                            <el-dropdown-item><div @click="sortType=1"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==1"></i>&nbsp;修改时间</div></el-dropdown-item>
                            <el-dropdown-item><el-tooltip class="item" effect="dark" content="自定义排序下可以拖动接口或分组来排序" placement="right"><div @click="sortType=2"><i class="el-icon-check" style="color: #11b95c" v-if="sortType==2"></i>&nbsp;自定义</div></el-tooltip></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col class="col" :span="3" style="cursor: pointer;text-align: center;line-height: 50px;" title="搜索" @click.native="search=true">
                    <i class="el-icon-search"></i>
                </el-col>
            </el-row>
            <el-row class="row" style="height: 50px;background-color: transparent;color: white;margin: 0;line-height: 50px" v-else>
                <el-input placeholder="请输入查找的接口" @change="searchInterface" v-model="searchText">
                    <template slot="append">
                        <el-button type="text" style="font-size: 14px;width: 50px;color: #50bfff" @click="cancelSearch">取消</el-button>
                    </template>
                    <template slot="prepend">
                        <el-select v-model="searchType" @input="searchInterface" style="width: 75px">
                            <el-option :value="0" label="名称"></el-option>
                            <el-option :value="1" label="路径"></el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-row>
            <interfacelist></interfacelist>
        </el-col>
        <el-col class="col" :span="bMax?24:18" id="info">
            <el-row class="row" v-if="preview==0 && interfaceEdit">
                <span :class="bMax?'fa fa-compress':'fa fa-expand'" style="position: absolute;left: 5px;top: 5px;z-index: 1000;cursor: pointer;color:#50bfff " :title="bMax?'缩小':'放大'" @click="bMax=!bMax"></span>
                <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;padding: 15px 0" >
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            名称
                        </el-col>
                        <el-col class="col" :span="10" style="height: 50px;line-height: 50px;text-align: left">
                            <el-input style="width: 90%" placeholder="请输入接口名称" v-model.trim="interfaceEdit.name"></el-input>
                        </el-col>
                        <el-col class="col" :span="2" style="text-align: center">
                            <el-popover ref="popover1" placement="bottom" title="修改信息" width="400" trigger="hover" :content="editInfo">
                            </el-popover>
                            <el-button type="text" v-popover:popover1 style="font-size: 20px">
                                <span class="fa fa-user"></span>
                            </el-button>
                        </el-col>
                        <el-col class="col" :span="1" style="text-align: left">
                        </el-col>
                        <el-col class="col" :span="3" style="height: 50px;line-height: 50px;text-align: left" id="editSave">
                            <el-button :loading="savePending" type="primary" style="width: 65%" @click="save" v-if="interfaceEditRole" id="btnSave">
                                保存
                            </el-button>
                            <transition name="el-fade-in-linear">
                                <el-button id="mail" v-show="mailShow" type="text" style="position: absolute" @click="sendMail">
                                    <i class="fa fa-envelope-o"></i>
                                </el-button>
                            </transition>
                        </el-col>
                        <el-col class="col" :span="3" style="height: 50px;line-height: 50px;text-align: left" id="editRun">
                            <el-button type="primary" style="width: 65%" @click="run">
                                运行
                            </el-button>
                        </el-col>
                        <el-col class="col" :span="3" style="height: 50px;line-height: 50px;text-align: left" id="preview">
                            <el-button type="primary" style="width: 65%" @click="changePreview(1)">
                                预览
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            路径
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-popover placement="bottom" title="路径信息" width="500" trigger="focus" content="路径不包含baseUrl，baseUrl请前往左边全局标签页里面设置。例如http://abc.com/login,http://abc.com是baseUrl,这里输入/login即可,支持restful url形式，例如：/info/{name} 支持路径参数的粘贴，系统会自动识别路径和query参数">
                                <el-input style="width: 90%" placeholder="请输入接口路径(不包含BaseUrl)" v-model.trim="interfaceEdit.url" slot="reference" @change="changeUrl" @paste.native="paste"></el-input>
                            </el-popover>
                        </el-col>
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            方法
                        </el-col>
                        <el-col class="col" :span="10" style="text-align: center">
                            <el-select style="width: 80%;text-align: center" v-model="interfaceEdit.method" @input="changeMethod">
                                <el-option  value="GET"></el-option>
                                <el-option  value="POST"></el-option>
                                <el-option  value="PUT"></el-option>
                                <el-option  value="DELETE"></el-option>
                                <el-option  value="PATCH"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            分组
                        </el-col>
                        <el-col class="col" :span="10" style="text-align: left">
                            <el-cascader expand-trigger="hover" :options="arrGroup" :show-all-levels="false" style="width: 90%;text-align: center" v-model="group" :disabled="objSnapshot.id" change-on-select></el-cascader>
                        </el-col>
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            状态
                        </el-col>
                        <el-col class="col" :span="10" style="text-align: center">
                            <el-select style="width: 80%;text-align: center" v-model="interfaceEdit.finish">
                                <el-option  :value="0" label="开发中"></el-option>
                                <el-option  :value="1" label="开发完成"></el-option>
                                <el-option  :value="2" label="已废弃"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 50px;line-height: 50px;text-align: center" v-if="interfaceEdit.id">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            分享
                        </el-col>
                        <el-col class="col" :span="22" style="text-align: left">
                            <el-input style="width: 95%" v-model="shareUrl" id="shareUrl" disabled>
                                <template slot="append">
                                    <el-button type="primary" style="font-size: 14px;width: 60px;color: #20a0ff" @click="copyClipboard">复制</el-button>
                                </template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="height: 90px;line-height: 90px;text-align: center">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            简介
                        </el-col>
                        <el-col class="col" :span="22" style="text-align: left">
                            <el-input type="textarea" :rows="3" style="width: 95%;vertical-align: middle" placeholder="请输入关于该接口的简介" v-model="interfaceEdit.remark"></el-input>
                        </el-col>
                    </el-row>
                </el-row>
                <el-row class="row" style="background-color: white;padding: 10px 20px 10px 20px;margin-top: 15px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;" v-if="interfaceEdit._id">
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            快照
                        </el-col>
                        <el-col class="col" :span="19" style="padding-left: 30px">
                            <span v-if="!objSnapshot.id">
                                当前为主干
                            </span>
                            <span v-else>
                                {{objSnapshot.date}}
                            </span>
                        </el-col>
                        <el-col class="col" :span="3" style="text-align: center">
                            <el-dropdown>
                                <el-button type="primary" class="el-dropdown-link" size="small">
                                    操作<i class="el-icon-caret-bottom el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <template v-if="objSnapshot.id">
                                        <el-dropdown-item @click.native="returnMaster">返回主干</el-dropdown-item>
                                        <el-dropdown-item @click.native="snapshotList">列表</el-dropdown-item>
                                        <el-dropdown-item @click.native="rollSnapshot" style="color: red">回滚</el-dropdown-item>
                                        <el-dropdown-item @click.native="removeSnapshot" style="color: red">删除</el-dropdown-item>
                                    </template>
                                    <template v-else>
                                        <el-dropdown-item @click.native="snapshotList">列表</el-dropdown-item>
                                        <el-dropdown-item @click.native="createSnapshot">创建</el-dropdown-item>
                                    </template>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>
                    <el-row class="row" v-if="objSnapshot.id">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            描述
                        </el-col>
                        <el-col class="col" :span="22" style="text-align: center;color: gray">
                            <el-input type="textarea" :rows="2" style="width: 90%" v-model="objSnapshot.dis"></el-input>
                        </el-col>
                    </el-row>
                </el-row>
                <el-tabs type="card" editable @edit="editTab" style="background-color: white;padding: 20px;margin-top: 15px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;" id="mainParam" v-model="tabIndex">
                    <template v-for="(item, index) in param">
                        <el-tab-pane :key="item.id" :name="index">
                            <span slot="label">
                                <el-popover placement="bottom" width="200" trigger="hover" :content="item.remark" v-if="item.remark">
                                    <span slot="reference">{{item.name}}</span>
                                </el-popover>
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
                <el-row class="row" style="height: 100px">

                </el-row>
            </el-row>
            <interfacepreview v-else-if="preview==1 && interfaceEdit"></interfacepreview>
        </el-col>
    </el-row>
</template>

<style>
    #mainParam>.el-tabs__content
    {
        padding: 0 10px 10px 10px;
        border-left: 1px lightgray solid;
        border-right: 1px lightgray solid;
        border-bottom: 1px lightgray solid;
    }
    .el-tabs__new-tab
    {
        color: rgb(80, 191, 255);
        border: 1px rgb(80, 191, 255) solid;
    }
</style>

<script>
    var interfaceList=require("./interfaceList.vue")
    var interfaceParam=require("./interfaceParam.vue")
    var interfacePreview=require("./interfacePreview.vue")
    var run=require("./run/run.vue")
    var store=require("../store")._modulesNamespaceMap["interface/"].context;
    var con=require("../../util/config");
    var sessionChange=require("../../mixins/session");
    module.exports={
        data:function () {
          return {
              savePending:false,
              snapshot:{},
              bMax:false,
              mailShow:false,
              sortType:session.get("sort")?session.get("sort"):0
          }
        },
        mixins:[sessionChange],
        store:store,
        components:{
            "interfacelist":interfaceList,
            "run":run,
            "interfaceparam":interfaceParam,
            "interfacepreview":interfacePreview
        },
        watch:{
            sortType:function (val) {
                session.set("sort",val);
                $.startHud("#body");
                this.$store.dispatch("refresh").then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            mailShow:function (val) {
                if(val)
                {
                    var save=document.getElementById("btnSave");
                    var mail=document.getElementById("mail");
                    mail.style.left=save.offsetLeft+save.offsetWidth/4+"px";
                    mail.style.top="-20px";
                    mail.style.width=save.offsetWidth/2+"px";
                    mail.style.marginLeft=0;
                    var _this=this;
                    setTimeout(function () {
                        _this.mailShow=false;
                    },2000);
                }
            },
            preview:function (val) {
                store.dispatch("changePreview",val);
            },
            "interfaceEdit.url":function (val) {
                if(/http\:\/\/|https\:\/\//i.test(val))
                {
                    $.tip("请不要在路径里面包含baseUrl",0);
                }
            },
            "objSnapshot.dis":function (val) {
                session.set("snapshotDis",val);
            }
        },
        computed:{
            interfaceEditRole:function () {
                return this.$store.getters.interfaceEditRole
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
            baseUrls:function(){
                return store.getters.baseUrls;
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
            shareUrl:function () {
                if(this.interfaceEdit)
                {
                    return con.baseUrl+"/html/web/share/share.html#"+this.interfaceEdit._id;
                }
                else
                {
                    return ""
                }
            },
            searchText:{
                get:function () {
                    return store.state.searchText;
                },
                set:function (val) {
                    store.commit("setSearchText",val)
                }
            },
            search:{
                get:function () {
                    return store.state.search;
                },
                set:function (val) {
                    store.commit("setSearch",val)
                }
            },
            searchType:{
                get:function () {
                    return store.state.searchType;
                },
                set:function (val) {
                    store.commit("setSearchType",val)
                }
            },
            interfaceEdit:function () {
                return store.state.interfaceEdit
            },
            interfaceList:function () {
                return store.state.interfaceList
            },
            preview:function () {
                return store.state.preview
            },
            editInfo:function () {
                return this.interfaceEdit?(this.interfaceEdit.createdAt?((this.interfaceEdit.owner?this.interfaceEdit.owner.name:"")+"在"+this.interfaceEdit.createdAt+"创建，最近修改被"+(this.interfaceEdit.editor?this.interfaceEdit.editor.name:"")+"在"+this.interfaceEdit.updatedAt+"改动"):"接口尚未保存"):"";
            },
            param:function () {
                return this.$store.state.param
            },
            index:function () {
                return this.$store.state.index
            }
        },
        methods:{
            addGroup:function () {
                $.input("请输入分组名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入分组名称",0);
                        return false
                    }
                    var query={};
                    query.id=session.get("projectId");
                    query.name=val.value;
                    $.startHud("#body");
                    store.dispatch("addGroup",{
                        query:query
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("新建成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                });
            },
            changeMethod:function () {
                store.commit("changeMethod");
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
                store.dispatch("save").then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1)
                        _this.mailShow=true;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            changeUrl:function (val) {
                store.commit("changeUrl",val);
            },
            changePreview:function (val) {
                store.commit("setPreview",val);
            },
            run:function () {
                var _this=this;
                var obj=$.clone(this.interfaceEdit);
                obj.param=$.clone(this.param);
                var child=$.showBox(this,require("./run/run.vue"),{
                    "interfaceEdit":obj,
                    "index":this.index
                });
                child.$on("save",function () {
                    store.dispatch("newInterface");
                });
            },
            methodColor:function (val) {
                return helper.methodColor(val);
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
            searchInterface:function () {
                store.commit("searchInterface");
            },
            cancelSearch:function () {
                store.commit("setSearch",false);
                store.commit("setSearchText","");
                store.commit("setSearchType",0);
                store.commit("setInterfaceSearchList",[]);
            },
            importGroup:function () {
                $.inputMul(this,"请输入DOClever导出分组的JSON",function (val) {
                    if(!val)
                    {
                        $.tip("请输入JSON",0);
                        return false;
                    }
                    $.startHud();
                    net.post("/group/importjson",{
                        id:session.get("projectId"),
                        json:val
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("导入成功",1);
                            store.commit("initInterfaceList",data.data);
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                    return true;
                })
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
                    store.dispatch("save").then(function (data) {
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
                var ele=document.getElementById("shareUrl").getElementsByTagName("input")[0];
                ele.disabled=false;
                ele.select();
                document.execCommand("Copy");
                ele.disabled=true;
                $.tip("已复制到剪贴板",1);
            }
        },
        created:function () {
            var _this=this;
            store.getters.event.$on("initStatus",function (data) {
                store.commit("setStatus",data);
            })
            store.getters.event.$on("initInterface",function (data) {
                _this.mailShow=false;
            })
        },
    }
</script>