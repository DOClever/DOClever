<template>
    <el-dialog  ref="box" :fullscreen="true" :visible.sync="showDialog" append-to-body id="editDoc" :before-close="close" @click.native="menu=0">
        <span slot="title" style="color:#50bfff;font-size: 18px">{{session.projectName}}</span>
        <el-row style="background-color: white;height: 100%;border-top: 1px lightgray solid;font-size: 14px" class="row">
            <el-col class="col" :span="4" style="border-right: 1px lightgray solid">
                <el-row class="row" style="height: 30px;line-height: 30px;background-color: rgb(244,241,244);text-align: left;padding-left: 5px">
                    目录
                    <el-button type="text" size="mini" style="float: right;margin-right: 10px;" title="新建分组" @click="addGroup">
                        <i class="el-icon-plus" style="font-weight: 900"></i>
                    </el-button>
                    <el-button type="text" size="mini" style="float: right;margin-right: 10px;" title="预览" @click="read">
                        <i class="fa fa-book" style="font-weight: 900"></i>
                    </el-button>
                </el-row>
                <el-row class="row" style="height: calc(100% - 60px);overflow-y: auto">
                    <list :group="$store.state.list"></list>
                </el-row>
                <el-row class="row" style="height: 30px;line-height: 30px;background-color: rgb(244,241,244);text-align: center">
                    <template v-if="interfaceListPending">
                        <i class="fa fa-circle-o-notch fa-spin"></i>&nbsp;初始化接口列表
                    </template>
                    <template v-else>
                        <i class="fa fa-check" style="color: green"></i>&nbsp;初始化完成
                    </template>
                </el-row>
            </el-col>
            <el-col class="col" :span="10" style="border-right: 1px lightgray solid">
                <textarea style="width: 100%;height: calc(100% - 1px);resize: none;box-sizing: border-box;padding: 10px 10px calc(100vh - 18px * 1.5) 10px;margin: 0px;border: 0px;outline: none;font-size: 18px;line-height: 1.5;" placeholder="请填入文档内容，支持markdown语法，编辑框内右键弹出菜单，可直接粘贴截图！" @contextmenu="contextMenu($event)" @mouseup="recordStart($event)" v-show="selDoc" v-model="content" @scroll.stop.prevent="scroll($event)" id="inputContent" @input="input=1" spellcheck="false" @paste="paste($event)"></textarea>
            </el-col>
            <el-col class="col docPreview" :span="10" v-html="preview" style="overflow-y: auto;word-break: break-all;padding: 0 10px 0 10px;line-height: 1.5" id="preview">

            </el-col>
        </el-row>
        <el-row class="row" style="width: 100px;height: 90px;position: absolute;top:0;left:0;border: 1px lightgray solid;background-color: white;text-align: center;cursor: pointer" v-show="menu" id="menu">
            <el-row class="row menuHover" style="height: 30px;line-height:30px;border-bottom: 1px lightgray solid" @click.native="insertImg">
                <i class="el-icon-picture"></i>&nbsp;上传图片
            </el-row>
            <el-row class="row menuHover" style="height: 30px;line-height:30px;border-bottom: 1px lightgray solid" @click.native="insertFile">
                <i class="el-icon-document"></i>&nbsp;上传附件
            </el-row>
            <el-row class="row menuHover" style="height: 30px;line-height:30px;" @click.native="insetInterface">
                <i class="fa fa-link"></i>&nbsp;插入接口
            </el-row>
        </el-row>
    </el-dialog>
</template>

<style>
#editDoc .el-dialog__body {
    height: calc(100vh - 49px);
    padding: 0;
}
#editDoc .el-dialog.is-fullscreen{
    overflow-y: hidden;
}
.menuHover:hover {
    background-color: #f3f3f3;
}

</style>

<script>
    var sessionChange=require("common/mixins/session");
    var list=require("./list.vue");
    var upload=require("component/upload.vue")
    var selectInterface=require("./selectInterface.vue");
    var showInterface=require("./interface.vue");
    var config=require("common/js/config.js")
    module.exports={
        props:["id","source"],
        data:function () {
            return {
                showDialog:false,
                arr:this.source,
                socket:null,
                md:null,
                content:"",
                startDate:0,
                timerScroll:null,
                lastTop:0,
                startInputTime:0,
                timerSave:null,
                input:0,
                menu:0,
                selectStart:0,
                file:null,
                interfaceListPending:true,
                arrInterface:[]
            }
        },
        mixins:[sessionChange],
        components:{
            "list":list
        },
        computed:{
            selDoc:function () {
                return this.$store.state.selDoc;
            },
            preview:function () {
                if(!this.selDoc)
                {
                    return "";
                }
                if(this.input)
                {
                    var date=(new Date()).getTime();
                    if(date-this.startInputTime<=500)
                    {
                        clearTimeout(this.timerSave);
                        this.timerSave=null;
                    }
                    this.startInputTime=date;
                    var _this=this;
                    this.timerSave=setTimeout((function (id,content) {
                        this.socket.emit("data",JSON.stringify({
                            user:session.get("id"),
                            doc:id,
                            type:"putDoc",
                            content:content
                        }))
                        this.timerSave=null;
                    }).bind(this,this.selDoc._id,this.content),500);
                }
                this.$nextTick(function () {
                    var ele=document.getElementById("preview");
                    var arrImg=ele.querySelectorAll("img");
                    for(let i=0;i<arrImg.length;i++)
                    {
                        if(/^http:\/\/localhost\:8081/.test(arrImg[i].src))
                        {
                            let src=arrImg[i].src.substr(21);
                            arrImg[i].src=(sessionStorage.getItem("env")=="doclever.cn"?config.onlineHost:sessionStorage.getItem("baseUrl"))+src;
                        }
                        else if(/^file:\/\//.test(arrImg[i].src))
                        {
                            let index=arrImg[i].src.lastIndexOf(":");
                            let src=arrImg[i].src.substr(index+1);
                            arrImg[i].src=(sessionStorage.getItem("env")=="doclever.cn"?config.onlineHost:sessionStorage.getItem("baseUrl"))+src;
                        }
                    }
                    var arrLink=ele.querySelectorAll("a");
                    for(var i=0;i<arrLink.length;i++)
                    {
                        if(/^interface\:\/\//.test(arrLink[i].href))
                        {
                            arrLink[i].style.textDecoration="none";
                            arrLink[i].style.color="#67C23A";
                            var href=arrLink[i].href;
                            var maoIndex=href.indexOf("/");
                            var wenIndex=href.indexOf("?");
                            var id=href.substring(maoIndex+2,wenIndex);
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
                                        $.tip(data1.msg,0);
                                        return;
                                    }
                                    if(data2.code!=200)
                                    {
                                        $.tip(data2.msg,0);
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
                        else if(/^http:\/\/localhost\:8081/.test(arrLink[i].href))
                        {
                            let href=arrLink[i].href.substr(21);
                            arrLink[i].href=(sessionStorage.getItem("env")=="doclever.cn"?config.onlineHost:sessionStorage.getItem("baseUrl"))+href;
                        }
                        else if(/^file:\/\//.test(arrLink[i].href))
                        {
                            arrLink[i].download=arrLink[i].innerText;
                            let index=arrLink[i].href.lastIndexOf(":");
                            let href=arrLink[i].href.substr(index+1);
                            arrLink[i].href=(sessionStorage.getItem("env")=="doclever.cn"?config.onlineHost:sessionStorage.getItem("baseUrl"))+href;
                        }
                        else
                        {
                            arrLink[i].target="_blank";
                        }
                    }
                })
                return this.md.render(this.content);
            }
        },
        watch:{
            selDoc:function (obj,oldObj) {
                if(obj && oldObj && obj._id!=oldObj._id && this.input)
                {
                    if(this.timerSave)
                    {
                        clearTimeout(this.timerSave);
                        this.timerSave=null;
                    }
                    this.socket.emit("data",JSON.stringify({
                        user:session.get("id"),
                        doc:oldObj._id,
                        type:"putDoc",
                        flag:"end",
                        content:this.content
                    }))
                }
                document.getElementById("inputContent").scrollTop=0;
                this.input=0;
                this.content=obj?obj.content:"";
            },
        },
        methods:{
            addGroup:function () {
                var _this=this;
                $.input("请输入分组名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入分组名称",0);
                        return false
                    }
                    var query={
                        name:val.value,
                    }
                    $.startHud();
                    _this.$store.dispatch("addGroup",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("新建成功",1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                });
            },
            contextMenu:function (event) {
                event.stopPropagation();
                event.preventDefault();
                if (document.selection) {
                    document.selection.empty();
                } else if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
                this.menu=1;
                this.$nextTick(function () {
                    var menu=document.getElementById("menu");
                    menu.focus();
                    menu.style.left=event.clientX+"px";
                    menu.style.top=event.clientY+"px";
                });
                return false;
            },
            recordStart:function (event) {
                if(event.button==0)
                {
                    this.selectStart=event.target.selectionStart;
                }
            },
            scroll:function (event) {
                var date=(new Date()).getTime();
                if(this.timerScroll && date-this.startDate<=300)
                {
                    clearTimeout(this.timerScroll);
                    this.timerScroll=null;
                }
                this.startDate=(new Date()).getTime();
                var _this=this;
                this.timerScroll=setTimeout(function () {
                    window.requestAnimationFrame(function () {
                        var ele=event.target;
                        var start=0,end,val=ele.scrollTop,ret,gap=400;
                        if(val==_this.lastTop)
                        {
                            return;
                        }
                        else
                        {
                            _this.lastTop=val;
                        }
                        var div=document.createElement("textarea");
                        div.style.width=document.getElementById("inputContent").offsetWidth+"px";
                        div.style.display="hidden";
                        div.style.position="absolute";
                        div.style.fontSize="18px";
                        div.style.lineHeight="1.5";
                        div.style.left="100px";
                        div.style.top="100px";
                        div.style.height="1px";
                        div.style.padding="10px 10px 0px 10px"
                        document.body.appendChild(div);
                        while(1)
                        {
                            end=start+gap;
                            div.value=_this.content.substring(0,end);
                            if(end>=_this.content.length-1)
                            {
                                ret=_this.content.length;
                                break;
                            }
                            else if(div.scrollHeight==0)
                            {
                                ret=0;
                                break;
                            }
                            if(div.scrollHeight<val)
                            {
                                start=end;
                                continue;
                            }
                            else if(div.scrollHeight==val)
                            {
                                ret=end;
                                break;
                            }
                            else
                            {
                                gap=parseInt(gap/2);
                                div.value=_this.content.substring(0,start+gap);
                                if(gap<5)
                                {
                                    ret=start;
                                    break;
                                }
                                else if(div.scrollHeight<val)
                                {
                                    start+=gap;
                                }
                            }
                        }
                        var html=_this.md.render(_this.content.substring(0,ret))
                        var temp=document.createElement("div");
                        temp.style.width=document.getElementById("preview").offsetWidth+"px";
                        temp.style.display="hidden";
                        temp.style.position="absolute";
                        temp.style.left="100px";
                        temp.style.top="100px";
                        temp.style.wordBreak="break-all";
                        temp.style.padding="0 10px 0 10px";
                        temp.style.lineHeight="1.5";
                        temp.style.fontSize="14px";
                        temp.style.boxSizing="border-box";
                        temp.className="docPreview";
                        temp.innerHTML=html;
                        document.body.appendChild(temp);
                        var preview=document.getElementById("preview");
                        if(preview.hasAttribute("timer1"))
                        {
                            clearInterval(parseInt(preview.getAttribute("timer1")));
                            preview.removeAttribute("timer1")
                        }
                        if(preview.hasAttribute("timer2"))
                        {
                            clearInterval(parseInt(preview.getAttribute("timer2")));
                            preview.removeAttribute("timer2")
                        }
                        var height=temp.offsetHeight;
                        if(preview.scrollTop<height)
                        {
                            var step=(height-preview.scrollTop)/16;
                            var timer1=setInterval(function(){
                                if(preview.scrollTop+preview.clientHeight>=preview.scrollHeight || preview.scrollTop>=height)
                                {
                                    preview.scrollTop=height;
                                    clearInterval(timer1);
                                    timer1=null;
                                }
                                else

                                { preview.scrollTop+=step; }

                            },30);
                            preview.setAttribute("timer1",String(timer1));
                        }
                        else
                        {
                            var step=(preview.scrollTop-height)/16;
                            var timer2=setInterval(function(){
                                if(preview.scrollTop<=0 || preview.scrollTop<=height)
                                {
                                    preview.scrollTop=height;
                                    clearInterval(timer2);
                                    timer2=null;
                                }
                                else

                                { preview.scrollTop-=step; }

                            },30);
                            preview.setAttribute("timer2",String(timer2));
                        }
                        temp.parentNode.removeChild(temp);
                        div.parentNode.removeChild(div);
                    })
                },300)
                event.stopPropagation();
                return true;
            },
            close:function (done) {
                if(this.selDoc && this.input)
                {
                    if(this.timerSave)
                    {
                        clearTimeout(this.timerSave);
                        this.timerSave=null;
                    }
                    this.socket.emit("data",JSON.stringify({
                        user:session.get("id"),
                        doc:this.selDoc._id,
                        type:"putDoc",
                        flag:"end",
                        content:this.content
                    }))
                }
                else
                {
                    this.socket.emit("data",JSON.stringify({
                        user:session.get("id"),
                        project:session.get("projectId"),
                        type:"close",
                    }))
                }
                this.$store.commit("clear");
                done();
            },
            insertImg:function () {
                $.showBox(this,upload,{
                    type:"img",
                    socket:this.socket,
                    doc:this.selDoc._id
                });
            },
            insertFile:function () {
                $.showBox(this,upload,{
                    type:"file",
                    socket:this.socket,
                    doc:this.selDoc._id
                });
            },
            paste:function (event) {
                var clipboardData=(event.clipboardData || event.originalEvent.clipboardData);
                if(clipboardData && clipboardData.items && clipboardData.items.length>0)
                {
                    var obj=clipboardData.items[0];
                    if(obj.type.indexOf("image/")>-1)
                    {
                        event.stopPropagation();
                        event.preventDefault();
                        var file=obj.getAsFile();
                        this.file=file;
                        this.socket.emit("data",JSON.stringify({
                            project:session.get("projectId"),
                            user:session.get("id"),
                            type:"size",
                            flag:"paste"
                        }))
                    }
                }
            },
            insetInterface:function () {
                var _this=this;
                var child=$.showBox(this,selectInterface,{
                    arr:this.arrInterface
                })
                child.$on("save",function (obj) {
                    _this.input=true;
                    var left=_this.content.substr(0,_this.selectStart);
                    var right=_this.content.substr(_this.selectStart);
                    _this.content=left+"["+obj.name+"](interface://"+obj.interface+"?run="+obj.run+")"+right;
                })
            },
            read:function () {
                window.open($.basePath()+"read/read.html#"+session.get("projectId")+encodeURIComponent(sessionStorage.getItem("baseUrl")),"_blank");
            }
        },
        created:function () {
            var _this=this;
            this.socket=window.io.connect(config.host);
            window.ss.forceBase64 = true
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
            this.socket.on("connect",function () {
                if(_this.socket.connected)
                {
                    _this.socket.emit("data",JSON.stringify({
                        project:session.get("projectId"),
                        user:session.get("id"),
                        type:"open",
                    }))
                }
            })
            this.socket.on("size",function (data) {
                var obj=JSON.parse(data);
                if(obj.code!=200)
                {
                    $.tip(obj.msg,0);
                    return;
                }
                if(obj.data.type=="upload")
                {
                    _this.$store.getters.event.$emit("docSocketSize",obj.data);
                }
                else if(obj.data.type=="paste")
                {
                    if(sessionStorage.getItem("env")=="doclever.cn" && obj.data.use+_this.file.size>obj.data.total)
                    {
                        $.tip("上传文件大小超过可用空间大小",0);
                        return;
                    }
                    $.startHud();
                    var stream = window.ss.createStream();
                    window.ss(_this.socket).emit('upload', stream, {
                        doc:_this.selDoc._id,
                        user:session.get("id"),
                        name:_this.file.name.replace(/\s+/g,""),
                        type:"img",
                        size:_this.file.size
                    });
                    var blobStream=window.ss.createBlobReadStream(_this.file);
                    blobStream.pipe(stream);
                }
            })
            this.socket.on("upload",function (data) {
                $.stopHud();
                var obj=JSON.parse(data);
                _this.$store.getters.event.$emit("docSocketUrl",obj);
                _this.input=true;
                var left=_this.content.substr(0,_this.selectStart);
                var right=_this.content.substr(_this.selectStart);
                if(obj.data.type=="img")
                {
                    _this.content=left+"![]("+obj.data.url+")"+right;
                }
                else if(obj.data.type=="file")
                {
                    _this.content=left+"["+obj.data.name+"]("+obj.data.url+")"+right;
                }
            })
            this.socket.on("useSize",function (data) {
                var obj=JSON.parse(data);
                _this.$store.state.doc.useSize=obj.data;
                if(!_this.showDialog)
                {
                    _this.socket.close();
                    _this.socket=null;
                }
            })
            this.socket.on("interfaceList",function (data) {
                _this.interfaceListPending=false;
                var obj=JSON.parse(data);
                _this.arrInterface=obj.data;
            })
        },
        mounted:function () {
            setTimeout(function () {
                if(window.navigator.userAgent.indexOf("Firefox")>-1)
                {
                    document.getElementById("inputContent").style.paddingBottom="0px";
                }
            },200)
        }
    }
</script>