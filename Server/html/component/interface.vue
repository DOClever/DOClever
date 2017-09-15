<template>
    <el-row class="row" style="margin:0 0 0 5px" id="body" :gutter="20">
        <el-col class="col" :span="6" style="min-height: 600px;background-color: white;box-shadow: 2px 2px 2px #888888;border-radius: 5px;margin: 0;padding: 0">
            <el-row class="row" style="height: 50px;background-color: #20A0FF;color: white;margin: 0;padding: 0" id="group" v-if="!search">
                <el-col class="col" :span="6" style="line-height: 50px;text-align: center;font-weight: bold;font-size: 15px;padding: 0">
                    分组
                </el-col>
                <el-col class="col" :span="15">

                </el-col>
                <el-col class="col" :span="3" style="cursor: pointer;text-align: center;line-height: 50px;" title="搜索" @click.native="search=true">
                    <i class="el-icon-search"></i>
                </el-col>
            </el-row>
            <el-row class="row" style="height: 50px;background-color: transparent;color: white;margin: 0;line-height: 50px" v-else>
                <el-input placeholder="请输入查找的接口" @change="searchInterface" v-model="searchText">
                    <template slot="append">
                        <el-button type="text" style="font-size: 14px;width: 50px;color: #20a0ff" @click="cancelSearch">取消</el-button>
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
        <el-col class="col" :span="18" id="info">
            <el-row class="row" v-if="preview==0 && interfaceEdit">
                <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;padding: 15px 0" >
                    <el-row class="row" style="height: 50px;line-height: 50px">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            名称
                        </el-col>
                        <el-col class="col" :span="10" style="height: 50px;line-height: 50px;text-align: left">
                            <el-input style="width: 90%" placeholder="请输入接口名称" v-model="interfaceEdit.name" :disabled="true"></el-input>
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

                        </el-col>
                        <el-col class="col" :span="3" style="height: 50px;line-height: 50px;text-align: left" id="editRun">

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
                            <el-input style="width: 90%" placeholder="请输入接口路径(不包含BaseUrl)" v-model="interfaceEdit.url" @change="changeUrl" :disabled="true"></el-input>
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
                            <el-select style="width: 90%;text-align: center" v-model="interfaceEdit.group._id">
                                <el-option v-for="item in interfaceList" :value="item._id" :label="item.name" :key="item._id"></el-option>
                            </el-select>
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
                    <el-row class="row" style="height: 90px;line-height: 90px;text-align: center">
                        <el-col class="col" :span="2" style="text-align: center;color: gray">
                            简介
                        </el-col>
                        <el-col class="col" :span="22" style="text-align: left">
                            <el-input type="textarea" :rows="3" style="width: 95%;vertical-align: middle" placeholder="请输入关于该接口的简介" v-model="interfaceEdit.remark" :disabled="true"></el-input>
                        </el-col>
                    </el-row>
                </el-row>
                <el-tabs type="card" style="background-color: white;padding: 20px;margin-top: 15px;border-radius: 5px;box-shadow: 0px 2px 2px #888888;" id="mainParam" v-model="tabIndex">
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
    var store=require("../projectinfo/storeInterface");
    var bus=require("../bus/projectInfoBus")
    module.exports={
        data:function () {
          return {
              savePending:false,
          }
        },
        store:store,
        components:{
            "interfacelist":interfaceList,
            "interfaceparam":interfaceParam,
            "interfacepreview":interfacePreview
        },
        watch:{
            preview:function (val) {
                store.commit("changePreview",val);
            },
            "interfaceEdit.url":function (val) {
                if(/http\:\/\/|https\:\/\//i.test(val))
                {
                    $.tip("请不要在路径里面包含baseUrl",0);
                }
            }
        },
        computed:{
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
            preview:function () {
                return store.state.preview
            },
            drawMix:function () {
                return store.state.drawMix
            },
            interfaceEdit:function () {
                return store.state.interfaceEdit
            },
            interfaceList:function () {
                return store.state.interfaceList
            },
            editInfo:function () {
                return this.interfaceEdit ? (this.interfaceEdit.createdAt ? ((this.interfaceEdit.owner ? this.interfaceEdit.owner.name : "") + "在" + this.interfaceEdit.createdAt + "创建，最近修改被" + (this.interfaceEdit.editor ? this.interfaceEdit.editor.name : "") + "在" + this.interfaceEdit.updatedAt + "改动") : "接口尚未保存") : "";
            },
            rawMock:function () {
                return store.getters.rawMock;
            },
            param:function () {
                return this.$store.state.param
            }
        },
        methods:{
            changeMethod:function () {
                store.commit("changeMethod");
            },
            changeUrl:function (val) {
                store.commit("changeUrl",val);
            },
            changePreview:function (val) {
                store.commit("setPreview",val);
            },
            methodColor:function (val) {
                return helper.methodColor(val);
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
            changeJSONType:function () {
                store.commit("toggleResultType");
            }
        },
        created:function () {
            bus.$on("initInterface",function (data) {
                store.dispatch("getAllInterface",data)
            })
            bus.$on("baseUrl",function (data) {
                store.commit("setBaseUrls",data);
            })
            bus.$on("initStatus",function (data) {
                store.commit("setStatus",data);
            })
            bus.$on("initInfo",function (data) {
                store.commit("setGlobalBefore",data.before);
                store.commit("setGlobalAfter",data.after);
            })
        },
    }
</script>