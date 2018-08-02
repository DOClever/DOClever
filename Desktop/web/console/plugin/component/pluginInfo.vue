<template>
    <el-dialog title="插件详情" width="80%" ref="box" :visible.sync="showDialog" append-to-body id="pluginInfo">
        <el-row class="row" style="height: 60px;line-height: 60px;">
            <el-col class="col" style="width: 60px;padding: 5px">
                <img v-proxy="obj.logo" style="height: 100%;width: 100%">
            </el-col>
            <el-col class="col" style="width: calc(100% - 140px);padding-left: 20px">
                <el-row class="row" style="height: 30px;line-height: 30px">
                    {{obj.name}}
                </el-row>
                <el-row class="row" style="height: 30px;line-height: 30px;font-size: 13px;color: gray">
                    本插件由用户{{obj.creator.name}}提供
                </el-row>
            </el-col>
            <el-col class="col" style="width: 80px">
                <span v-if="obj.buy">
                    已购买
                </span>
                <el-dropdown v-else>
                    <el-button size="mini" type="primary">
                        购买
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="installWithMoney">价格:<span v-html="price"></span>元</el-dropdown-item>
                        <el-dropdown-item @click.native="installWithPoint">兑换:<span v-html="point"></span>积分</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <el-tabs type="border-card" v-model="type">
            <el-tab-pane label="概述" name="info">
                <span v-html="obj.remark.replace(/\n/g,'<br>')"></span>
            </el-tab-pane>
            <el-tab-pane label="图片" name="img">
                <el-carousel indicator-position="outside">
                    <el-carousel-item v-for="(item,index) in obj.pic" :key="index" style="text-align: center">
                        <img :src="host+item" style="height: 100%">
                    </el-carousel-item>
                </el-carousel>
            </el-tab-pane>
            <el-tab-pane label="最新版本" name="version">
                <el-row class="row">
                    版本号:{{version.version}}<br>
                    兼容最低DOClever版本号:{{version.sysVersion}}<br>
                    版本更新内容:{{version.remark}}
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<style>
    #pluginInfo .el-dialog__body {
        padding-top: 0px;
    }
    #pluginInfo .el-carousel__container{
        height: 500px;
    }
</style>

<script>
    var proxyImg=require("common/director/proxyImg")
    var config=require("common/js/config")
    module.exports={
        props:["propObj"],
        data:function () {
            return {
                showDialog:false,
                type:"info",
                obj:this.propObj
            }
        },
        computed:{
            host:function () {
                return config.onlineHost;
            },
            version:function () {
                return this.obj.version[this.obj.version.length-1];
            },
            level:function () {
                return this.$store.getters.level;
            },
            price:function () {
                var price=parseInt(this.obj.price/100);
                var newPrice=price*this.level.percent;
                if(price==newPrice)
                {
                    return price;
                }
                else
                {
                    return "<span style='text-decoration: line-through'>"+price+"</span>("+newPrice+")"
                }
            },
            point:function () {
                var point=parseInt(this.obj.point);
                var newPoint=point*this.level.percent;
                if(point==newPoint)
                {
                    return point;
                }
                else
                {
                    return "<span style='text-decoration: line-through'>"+point+"</span>("+newPoint+")"
                }
            }
        },
        directives:{
            "proxy":proxyImg
        },
        methods:{
            installWithMoney:function () {
                var _this=this;
                $.confirm("确定购买此插件?",function () {
                    $.startHud();
                    _this.$store.dispatch("createTrade",{
                        type:0,
                        plugin:_this.obj._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            if(data.data=="ok")
                            {
                                $.tip("购买成功",1);
                                _this.$store.dispatch("initMemberInfo",null,{
                                    root:true
                                })
                                _this.$emit("refreshList");
                                _this.showDialog=false;
                            }
                            else
                            {
                                window.open(data.data,"_blank");
                                var child=$.showBox(_this,require("./waitPay.vue"));
                                child.$on("close",function () {
                                    _this.$emit("refreshList");
                                    _this.showDialog=false;
                                })
                            }
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            installWithPoint:function () {
                var _this=this;
                $.confirm("确定兑换此插件?",function () {
                    $.startHud();
                    _this.$store.dispatch("buyWithPoint",_this.obj._id).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("购买成功",1);
                            _this.$store.dispatch("initMemberInfo",null,{
                                root:true
                            })
                            _this.$emit("refreshList");
                            _this.showDialog=false;
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            }
        }
    }
</script>