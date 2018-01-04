<template>
    <el-dialog title="文档引用"  :fullscreen="true" ref="box" :visible.sync="showDialog" append-to-body id="docRef">
        <el-row class="row" style="height: 100%;border-top: 1px lightgray solid;">
            <el-col class="col" :span="5" style="overflow-y: auto;border-right: 1px lightgray solid;" id="docRefList">
                <template v-for="item in arrList">
                    <el-row class="row docRefListHover" style="height: 35px;line-height: 35px;text-align: center;cursor: pointer;border-bottom: 1px solid lightgray" :style="{backgroundColor:item.select?'#f3f3f3':'white'}" @click.native="info(item)">
                        {{item.name}}
                    </el-row>
                </template>
            </el-col>
            <el-col class="col docPreview" :span="19" v-if="obj._id">
                <el-row class="row" style="height: 30px;line-height: 30px;padding-left: 10px;font-size: 16px">
                    {{obj.name}}({{obj.project.team?obj.project.team.name:"无团队"}}->{{obj.project.name}})
                </el-row>
                <el-row class="row" style="height: 30px;line-height: 30px;border-bottom: 1px lightgray solid;padding-left: 10px">
                    创建者:{{obj.owner.name}}&nbsp;&nbsp;创建时间:{{obj.createdAt}}
                </el-row>
                <el-row class="row" style="height: calc(100% - 60px);overflow-y: auto;word-break: break-all;padding: 0 10px 0 10px;line-height: 1.5" v-html="preview" id="preview">

                </el-row>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<style>
    #docRef .el-dialog__body {
        height: calc(100vh - 49px);
        padding: 0;
    }
    #docRef .el-dialog.is-fullscreen{
        overflow-y: hidden;
    }
</style>

<script>
    var showInterface=require("../../../doc/component/interface.vue");
    module.exports = {
        props:["arr","id"],
        data: function () {
            return {
                showDialog:false,
                selItem:null,
                arrList:function () {
                    this.arr.forEach(function (obj) {
                        obj.select=0;
                    })
                    return this.arr;
                }.call(this),
                obj:{},
                md:null
            }
        },
        computed:{
            preview:function () {
                if(!this.obj._id)
                {
                    return "";
                }
                this.$nextTick(function () {
                    var ele=document.getElementById("preview");
                    var arrLink=ele.querySelectorAll("a");
                    var ele=null;
                    for(var i=0;i<arrLink.length;i++)
                    {
                        arrLink[i].target="_blank";
                        if(/^interface\:\/\//.test(arrLink[i].href))
                        {
                            arrLink[i].style.textDecoration="none";
                            arrLink[i].style.color="#67C23A";
                            var href=arrLink[i].href;
                            var maoIndex=href.indexOf("/");
                            var wenIndex=href.indexOf("?");
                            var id=href.substring(maoIndex+2,wenIndex);
                            if(!ele && id==this.id)
                            {
                                var topPos = arrLink[i].offsetTop;
                                document.getElementById('preview').scrollTop = topPos;
                            }
                            var str=href.substr(wenIndex+1);
                            var option={};
                            var arr=str.split("&");
                            arr.forEach(function (obj) {
                                var arr=obj.split("=");
                                option[arr[0]]=arr[1]?arr[1]:"";
                            })
                            arrLink[i].href="javascript:void(0)";
                            arrLink[i].onclick=function (id,run) {
                                var _this=this;
                                $.startHud();
                                Promise.all([
                                    net.get("/doc/interface",{
                                        id:id,
                                    }),
                                    net.get("/doc/interfaceInfo",{
                                        id:id,
                                    })
                                ]).then(function (values) {
                                    var data1=values[0];
                                    var data2=values[1];
                                    $.stopHud();
                                    if(data1.code!=200)
                                    {
                                        $.notify(data1.msg,0);
                                        return;
                                    }
                                    if(data2.code!=200)
                                    {
                                        $.notify(data2.msg,0);
                                        return;
                                    }
                                    $.showBox(_this,showInterface,{
                                        run:run,
                                        source:data1.data,
                                        baseUrls:data2.data.baseUrls,
                                        status:data2.data.status,
                                        before:data2.data.before,
                                        after:data2.data.after
                                    })
                                })
                            }.bind(this,id,option["run"]?Number(option["run"]):0)
                        }
                    }
                })
                return this.md.render(this.obj.content);
            }
        },
        methods: {
            info:function (item) {
                if(this.selItem && this.selItem._id!=item._id)
                {
                    this.selItem.select=0;
                }
                else if(this.selItem &&this.selItem._id==item._id)
                {
                    return;
                }
                item.select=1;
                this.selItem=item;
                $.startHud();
                var _this=this;
                net.get("/doc/doc",{
                    id:item._id
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        _this.obj=data.data;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            }
        },
        created:function () {
            var _this=this;
            this.md = window.markdownit({
                highlight: function (str, lang) {
                    if (lang && window.hljs.getLanguage(lang)) {
                        try {
                            return '<pre class="hljs"><code>' +
                                window.hljs.highlight(lang, str, true).value +
                                '</code></pre>';
                        } catch (__) {}
                    }
                    return '<pre class="hljs"><code>' + _this.md.utils.escapeHtml(str) + '</code></pre>';
                }
            });
        }
    }
</script>