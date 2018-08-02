<template>
    <el-row class="row" id="run">
        <el-row class="row" style="height: 35px;line-height: 35px;border-bottom: 1px lightgray solid">
            <span style="color: #00adef;font-size: 16px">{{interface.name}}</span>
            <el-button type="primary" size="mini" style="float: right;margin-top: 4px;margin-right: 5px;margin-left: 0px" @click="run" title="运行" id="run" :loading="runPending">
                运行
            </el-button>
        </el-row>
        <el-row class="row" style="margin-top: 5px;border-radius: 5px;font-size: 14px;background-color: white">
            <el-row class="row" style="padding-left: 10px;margin-top: 20px">
                接口路径:
            </el-row>
            <el-row class="row" style="height: 40px;line-height: 40px;padding-left: 10px;padding-right: 10px">
                <el-col class="col" :span="5">
                    <el-select size="small" v-model="interface.method" @input="changeMethod" id="method" style="width: 90%">
                        <el-option  value="GET" label="GET"></el-option>
                        <el-option  value="POST" label="POST"></el-option>
                        <el-option  value="PUT" label="PUT"></el-option>
                        <el-option  value="DELETE" label="DELETE"></el-option>
                        <el-option  value="PATCH" label="PATCH"></el-option>
                    </el-select>
                </el-col>
                <el-col class="col" :span="8">
                    <el-autocomplete size="small" style="width: 95%" class="inline-input" v-model="baseUrl" :fetch-suggestions="querySearch" placeholder="选择或者填入你的BaseUrl" popper-class="my-autocomplete">
                        <i class="el-icon-caret-bottom el-input__icon" slot="suffix" @click="showAutoComplete"></i>
                        <template slot-scope="props">
                            <div class="value">{{ props.item.value }}</div>
                            <span class="remark">{{ props.item.remark }}</span>
                        </template>
                    </el-autocomplete>
                </el-col>
                <el-col class="col" :span="11">
                    <el-input size="small" style="width: 100%" placeholder="请填入你请求的路由地址" v-model="interface.url" @input="changeUrl" @paste.native="paste"></el-input>
                </el-col>
            </el-row>
            <div style="position: absolute;top: 105px;right: 10px;z-index: 1000;font-size: 14px">
                切换:&nbsp;
                <el-autocomplete size="mini" v-model="curParam.selExample.value" :fetch-suggestions="querySearchExample" placeholder="筛选你的运行实例" @select="changeExample">
                </el-autocomplete>
            </div>
            <el-tabs style="margin-top: 20px" v-model="tabIndex" id="mainRun">
                <template v-for="(item, index) in param">
                    <el-tab-pane :key="item.id"  :label="item.name" :name="index">
                        <span slot="label">
                            <el-tooltip class="item" effect="dark" placement="bottom" :content="item.remark" v-if="item.remark">
                                <span>{{item.name}}</span>
                            </el-tooltip>
                            <span v-else>{{item.name}}</span>
                        </span>
                        <runparam :index="index" :item="item" ref="runParam"></runparam>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </el-row>
    </el-row>
</template>

<style>

</style>

<script>
    var runParam=require("../../info/interface/run/component/runParam.vue");
    var store=require("./storeRun");
    var sessionChange=require("common/mixins/session");
    module.exports={
        props:["interfaceEdit","index","baseUrls","status"],
        data:function () {
            return {
                runPending:false,
                tabType:"query",
                showDialog:false,
            }
        },
        mixins:[sessionChange],
        store:store,
        components:{
            "runparam":runParam
        },
        computed:{
            curParam:function () {
                return this.$store.getters.curParam;
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
            param:function () {
                return this.$store.state.interface.param;
            },
            interface:function () {
                return this.$store.state.interface;
            },
            baseUrl:{
                get:function () {
                    return this.$store.state.baseUrl;
                },
                set:function (val) {
                    this.$store.commit("setBaseUrl",val);
                }
            },
            arrBaseUrl:function () {
                return this.$store.state.baseUrls;
            },
        },
        methods:{
            run:function () {
                var _this=this;
                this.runPending=true;
                this.$store.dispatch("run").then(function (data) {
                    _this.runPending=false;
                    if(data.code==200)
                    {
                        _this.$refs.runParam[parseInt(_this.tabIndex)].resultType=1;
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            changeMethod:function () {
                this.$store.commit("changeMethod")
            },
            paste:function () {
                var _this=this;
                setTimeout(function () {
                    var path=_this.interface.url;
                    var bMark=false;
                    var index=path.indexOf("?");
                    if(index>-1)
                    {
                        bMark=true;
                        _this.interface.url=_this.interface.url.substring(0,index);
                    }
                    else
                    {
                        return;
                    }
                    for(var i=0;i<_this.$store.state.interface.param.length;i++)
                    {
                        var arrStoreQuery=_this.$store.state.interface.param[i].query;
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
                        _this.$store.state.interface.param[i].query=arrStoreQuery;
                    }
                },100)
            },
            querySearch:function (queryString,cb) {
                var results=this.arrBaseUrl.map(function (obj) {
                    return {
                        value:obj.url,
                        remark:obj.remark
                    }
                })
                if(this.interface._id)
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
            showAutoComplete:function (event) {
                this.baseUrl="";
                setTimeout(function(){
                    event.target.parentNode.parentNode.parentNode.querySelector("input").focus();
                },100)
            },
            changeUrl:function (val) {
                this.$store.commit("changeUrl",val);
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
            querySearchExample:function (queryString,cb) {
                net.get("/example/list",{
                    interface:this.interface._id,
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
        },
        created:function () {
            this.$store.dispatch("initData",$.clone(this.interfaceEdit));
            this.$store.commit("setIndex",this.index);
            this.$store.commit("setBaseUrls",this.$props.baseUrls);
            this.$store.commit("setStatus",this.status);
            this.$store.commit("setBefore",this.before);
            this.$store.commit("setAfter",this.after);
        },
    }
</script>