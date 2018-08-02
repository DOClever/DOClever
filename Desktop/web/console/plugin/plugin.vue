<template>
    <el-row class="row">
        <el-row class="row" style="height: 30px;line-height: 30px;border-bottom: 1px solid lightgray;padding-left: 10px">
            已购买插件:
            <el-button type="text" size="mini" style="float: right;margin-right: 10px" @click="recharge">
                充值
            </el-button>
            <el-button type="text" size="mini" style="float: right;margin-right: 10px" @click="buy">
                购买插件
            </el-button>
        </el-row>
        <el-row class="row" style="text-align: center">
            <el-col class="col" :span="9">
                名称
            </el-col>
            <el-col class="col" :span="9">
                可升级版本
            </el-col>
            <el-col class="col" :span="6">
                操作
            </el-col>
        </el-row>
        <el-row class="row pluginRow" v-for="(item,index) in arr" style="height: 40px;line-height: 40px;text-align: center">
            <el-col class="col" :span="9">
                {{item.name}}
            </el-col>
            <el-col class="col" :span="9">
                {{item.version}}
            </el-col>
            <el-col class="col" :span="6">
                <el-button type="text" size="mini" v-if="item.install==0" @click="install(item,index)">
                    安装
                </el-button>
                <el-button type="text" size="mini" v-else-if="item.update" @click="update(item,index)">
                    升级
                </el-button>
                <el-button type="text" size="mini" v-else-if="item.install" @click="uninstall(item,index)">
                    卸载
                </el-button>
            </el-col>
        </el-row>
    </el-row>
</template>

<style>
    .pluginRow:hover {
        background-color: #f3f3f3;
    }
</style>
<script>
    var config=require("common/js/config");
    var store=require("../store")._modulesNamespaceMap["plugin/"].context;
    module.exports={
        data:function () {
            return {
                modify:0,
                arr:[]
            }
        },
        store:store,
        methods:{
            install:async function (item,index) {
                let ret=await $.confirm("是否确认安装此插件");
                if(ret)
                {
                    this.modify=1;
                    item.loading=1;
                    await this.$api.plugin.downloadPlugin(sessionStorage.getItem("env"),item.id,config.onlineHost+item.file);
                    item.loading=0;
                    item.install=1;
                }
            },
            update:async function (item,index) {
                let ret=await $.confirm("是否确认升级此插件");
                if(ret)
                {
                    this.modify=1;
                    item.loading=1;
                    await this.$api.plugin.downloadPlugin(sessionStorage.getItem("env"),item.id,config.onlineHost+item.file);
                    item.loading=0;
                    item.update=0;
                }
            },
            uninstall:async function (item,index) {
                let ret=await $.confirm("是否确认卸载此插件");
                if(ret)
                {
                    this.modify=1;
                    item.loading=1;
                    await this.$api.plugin.removePlugin(sessionStorage.getItem("env"),item.id);
                    item.loading=0;
                    item.install=0;
                }
            },
            recharge:function () {
                var _this=this;
                $.input("充值金额(元)，1元可兑换100积分",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入金额",0);
                        return false
                    }
                    var value=parseInt(val.value);
                    if(!Number.isInteger(value))
                    {
                        $.tip("请输入整数",0);
                        return false
                    }
                    else if(value==0)
                    {
                        $.tip("不可以为0",0);
                        return false
                    }
                    $.startHud();
                    _this.$store.dispatch("createTrade",{
                        type:1,
                        money:value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            window.open(data.data,"_blank");
                            $.showBox(_this,require("./component/waitPay.vue"));
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            buy:function () {
                var _this=this;
                this.$store.dispatch("pluginList").then(function (data) {
                    if(data.code==200)
                    {
                        if(data.data.length==0)
                        {
                            $.tip("暂无可用插件",1);
                            return;
                        }
                        $.showBox(_this,require("./component/pluginList.vue"),{
                            propList:data.data
                        })
                    }
                })
            },
            init:async function () {
                let obj={};
                let arr=JSON.parse(session.get("plugin"));
                arr.forEach(function (o) {
                    obj[o.id]=o.version;
                })
                $.startHud();
                let data=await net.post(config.online+"/member/clientpluginlist",{
                    content:JSON.stringify(obj),
                    version:session.get("version"),
                    member:session.get("member")
                },{
                    desktop:"1"
                },null,0,0,1)
                $.stopHud();
                if(data.code==200)
                {
                    this.arr=data.data.map(function (obj) {
                        obj.loading=0;
                        return obj;
                    })
                }
                else
                {
                    $.tip(data.msg,0);
                }
            }
        },
        created:async function () {
            await this.init();
            this.$store.getters.event.$on("refreshPluginList",this.init);
        },
        beforeDestroy:async function () {
            this.$store.getters.event.$off("refreshPluginList",this.init);
            if(this.modify)
            {
                let objPlugin=await this.$api.plugin.handlePluginInfo(sessionStorage.getItem("env"),sessionStorage.getItem("member"));
                let data=await net.get(config.online+"/member/validplugin",{
                    content:JSON.stringify(objPlugin),
                    version:sessionStorage.getItem("version")
                },{
                    desktop:"1"
                },null,1);
                if(data.code!=200)
                {
                    $.tip(data.msg,0);
                    return;
                }
                let arr=[];
                for(let o of data.data)
                {
                    if(o.compatible)
                    {
                        arr.push({
                            id:o.id,
                            version:o.version
                        })
                    }
                }
                sessionStorage.setItem("plugin",JSON.stringify(arr));
                location.reload();
            }
        }
    }
</script>