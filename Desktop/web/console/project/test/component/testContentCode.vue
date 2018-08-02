<template>
    <el-row class="row" id="testContentCode">
        <el-row class="row" style="height: 50px;line-height: 50px">
            <el-button size="mini" type="primary" style="margin-left: 20px" @click="insertInterface">插入接口</el-button>&nbsp;&nbsp;&nbsp;
            <el-button size="mini" type="primary" @click="insertTest" v-if="type!=1">插入用例</el-button>
            <el-button size="mini" type="primary" @click="copyCode" v-if="!type">复制</el-button>
            <el-button size="mini" type="primary" @click="pasteCode" v-if="$store.state.objCopy && !type">粘贴</el-button>
            <a href="http://doclever.cn/resource/other/test.html" style="float: right;margin-right: 20px;color: #17b9e6" target="_blank">如何编写</a>
        </el-row>
        <el-row class="row" style="height: 300px;border: 1px solid lightgray;margin-left: 10px;width: calc(100% - 20px)">
            <el-col class="col" style="width: 40px;background-color: lightgray;padding-top: 5px;overflow-y: hidden;" :style="{paddingBottom:5+scrollHeight+'px'}" id="testScroll">
                <el-row class="row" style="text-align: right;padding-right: 5px;line-height: 1.5;font-size: 15px" v-for="n in line">
                    {{n}}
                    <span style="position: absolute;left: 0px;top: 0px;color: red;width: 26px;height: 26px;text-align: left" v-if="objAnalyse.err.indexOf(n)>-1">
                        X
                    </span>
                </el-row>
            </el-col>
            <el-col class="col" style="width:calc(100% - 40px);box-sizing:padding-box;background-color: rgba(255,255,224,0.5)">
                <div class="row" style="margin: 0;width: 100%;height:100%;box-sizing:border-box;padding: 5px;overflow-y: auto;word-break: keep-all;outline: none;line-height: 1.5;font-size: 15px;white-space: pre" contenteditable="true" id="testContent" spellcheck="false" @input="changeContent($event)" @keydown="keyDown($event)" @scroll="scroll($event)" @keyup="keyUp($event)">

                </div>
            </el-col>
        </el-row>
        <el-row class="row" style="position: absolute;width: 150px;overflow-x:hidden;max-height: 200px;overflow-y: auto;background-color: white;border: 1px solid #f3f3f3;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);z-index: 1000" v-if="menu && vars.length>0" id="autoMenu">
            <el-row class="row autoMenu" v-for="(item,index) in vars" style="width: 100%;height: 30px;line-height:30px;text-align:left;padding-left: 5px;cursor: default" :style="{backgroundColor:selMenuIndex==index?'#22B5F3':'white',color:selMenuIndex==index?'white':'gray'}" @click.native="selectMenu(item)">
                {{item}}
            </el-row>
        </el-row>
    </el-row>
</template>

<style>
    .testCodeLine:hover {
        background-color: #f3f3f3;
    }
    .autoMenu{

    }
</style>

<script>
    module.exports = {
        props:["type"],
        data: function () {
            return {
                timer:null,
                line:1,
                objAnalyse:{
                    err:[],
                    var:[]
                },
                timerAuto:null,
                menu:0,
                vars:[],
                selMenuIndex:0,
                start:0,
                end:0,
                stopKeyUp:0,
                scrollHeight:0
            }
        },
        computed:{
            test:function () {
                return this.$store.state.selTest
            },
        },
        watch:{
            line:{
                handler:function (val) {
                    if(this.vars)
                    {
                        var ele=document.getElementById("testContent");
                        if(ele)
                        {
                            this.scrollHeight=ele.offsetHeight-ele.clientHeight;
                        }
                    }
                },
                immediate:true
            }
        },
        methods: {
            init:function () {
                if(this.timer)
                {
                    clearTimeout(this.timer);
                    this.timer=null;
                }
                this.line=1;
                this.objAnalyse={
                    err:[],
                    var:[]
                };
                if(this.timerAuto)
                {
                    clearTimeout(this.timerAuto);
                    this.timerAuto=null;
                }
                this.menu=0;
                this.vars=[];
                this.selMenuIndex=0;
                this.start=0;
                this.end=0;
                this.stopKeyUp=0;
            },
            insertInterface:function () {
                var selection=helper.getSelection();
                if(!selection)
                {
                    var ele=document.getElementById("testContent");
                    ele.focus();
                    var range = document.createRange();
                    range.selectNodeContents(ele);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    selection=helper.getSelection();
                }
                var _this=this;
                var child=$.showBox(_this,require("./testInterfaceRun.vue"),{
                    url:[],
                    status:[],
                    index:0,
                });
                child.$on("save",function (obj,example) {
                    var a=document.createElement("a");
                    a.setAttribute("type","1");
                    a.setAttribute("data",JSON.stringify(obj));
                    a.href="javascript:void(0)";
                    a.style.cursor="pointer";
                    a.style.textDecoration="none";
                    a.innerText=example?(obj.name+"("+example+")"):obj.name;
                    a.onclick=function () {
                        _this.editInterface(a);
                    }
                    selection.deleteContents();
                    selection.insertNode(a);
                })
            },
            editInterface:function (ele) {
                var objInterface=JSON.parse(ele.getAttribute("data"));
                $.startHud();
                var _this=this;
                var arrPromise=[
                    net.get("/project/interface",{
                        id:objInterface.project._id
                    }),
                    net.get("/status/list",{
                        id:objInterface.project._id
                    }),
                    net.get("/test/interface",{
                        interface:objInterface._id,
                        only:1
                    })
                ];
                Promise.all(arrPromise).then(function (values) {
                    $.stopHud();
                    var obj1=values[0];
                    var obj2=values[1];
                    var obj3=values[2];
                    var obj4=values[3];
                    if(obj1.code==200 && obj2.code==200)
                    {
                        if(obj3.code==200)
                        {
                            if(obj4 && obj4.code==200)
                            {
                                helper.updateTestInterfaceWithExample(objInterface,obj4.data);
                            }
                            var index=helper.handleTestInterface(objInterface,obj3.data,obj2.data,_this.type?1:0);
                            var child=$.showBox(_this,require("./testInterfaceRun.vue"),{
                                url:obj1.data.baseUrl,
                                status:obj2.data,
                                interface:objInterface,
                                index:index,
                                netInterface:obj3.data
                            });
                            child.$on("save",function (obj,example) {
                                ele.setAttribute("data",JSON.stringify(obj));
                                ele.innerText=example?(obj.name+"("+example+")"):obj.name;
                                ele.style.textDecoration="none";
                            })
                        }
                        else
                        {
                            $.tip(obj3.msg,0);
                            ele.parentNode.removeChild(ele);
                        }

                    }
                    else
                    {
                        $.tip(obj1.code!=200?obj1.msg:obj2.msg,0);
                    }
                })
            },
            insertTest:function () {
                var selection=helper.getSelection();
                if(!selection)
                {
                    var ele=document.getElementById("testContent");
                    ele.focus();
                    var range = document.createRange();
                    range.selectNodeContents(ele);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    selection=helper.getSelection();
                }
                $.startHud();
                var _this=this;
                net.get("/test/list",{
                    project:this.type==2?this.$store.state.selTest.project:session.get("projectId")
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        var child=$.showBox(_this,require("./testTestRun.vue"),{
                            source:data.data,
                            self:_this.test.id,
                            mode:"code"
                        });
                        child.$on("save",function (obj) {
                            var a=document.createElement("a");
                            a.setAttribute("type","2");
                            a.setAttribute("data",obj.id);
                            a.setAttribute("mode",obj.mode);
                            a.href="javascript:void(0)";
                            a.style.cursor="pointer";
                            a.style.textDecoration="none";
                            a.style.color="orange"
                            a.innerText=obj.name;
                            a.onclick=function () {
                                _this.editTest(a);
                            }
                            selection.deleteContents();
                            selection.insertNode(a);
                        })
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            editTest:function (ele) {
                var id=ele.getAttribute("data");
                var mode=ele.hasAttribute("mode")?ele.getAttribute("mode"):"code"
                $.startHud();
                var _this=this;
                Promise.all([
                    net.get("/test/list",{
                        project:this.type==2?this.$store.state.selTest.project:session.get("projectId")
                    }),
                    net.get("/test/test",{
                        id:id,
                        project:this.type==2?this.$store.state.selTest.project:session.get("projectId")
                    })
                ]).then(function (values) {
                    $.stopHud();
                    var obj1=values[0];
                    var obj2=values[1];
                    if(obj1.code==200)
                    {
                        if(obj2.code==200)
                        {
                            var child=$.showBox(_this,require("./testTestRun.vue"),{
                                source:obj1.data,
                                test:obj2.data,
                                self:_this.test.id,
                                mode:mode
                            });
                            child.$on("save",function (obj) {
                                ele.setAttribute("data",obj.id);
                                ele.setAttribute("mode",obj.mode);
                                ele.innerText=obj.name;
                                ele.style.textDecoration="none";
                            })
                        }
                        else
                        {
                            $.tip(obj2.msg,0);
                            ele.parentNode.removeChild(ele);
                        }
                    }
                    else
                    {
                        $.tip(obj1.msg,0);
                    }
                })
            },
            initTestContent:function (data) {
                this.init();
                var ele=document.getElementById("testContent");
                var tempEle=document.createElement("div");
                tempEle.innerHTML=data;
                var arrLink=tempEle.querySelectorAll("a[data]");
                var arrLinkOuter=[];
                arrLink.forEach(function (obj) {
                    var str=obj.getAttribute("data");
                    var type=obj.getAttribute("type");
                    var id=Date.now()+$.rand(1,10000);
                    var objPush={
                        text:id,
                        html:obj.outerHTML
                    }
                    arrLinkOuter.push(objPush);
                    var parentNode=obj.parentNode;
                    parentNode.replaceChild(document.createTextNode(objPush.text),obj);
                    parentNode.normalize();
                })
                var arrChild=tempEle.childNodes;
                for(var i=0;i<arrChild.length;i++)
                {
                    var objDiv=arrChild[i];
                    if(objDiv.textContent)
                    {
                        var html=window.Prism.highlight(objDiv.textContent,window.Prism.languages.javascript);
                        if(objDiv.nodeType==3)
                        {
                            var span=document.createElement("div");
                            span.innerHTML=html;
                            objDiv.parentNode.replaceChild(span,objDiv);
                        }
                        else
                        {
                            objDiv.outerHTML="<div>"+html+"</div>";
                        }
                    }
                }
                arrLinkOuter.forEach(function (obj) {
                    tempEle.innerHTML=tempEle.innerHTML.replace(obj.text,obj.html);
                })
                ele.innerHTML=tempEle.innerHTML;
                if(ele.innerHTML=="")
                {
                    var div=document.createElement("div");
                    div.className="testCodeLine";
                    div.style.height="22px";
                    ele.appendChild(div);
                }
                this.$nextTick(function () {
                    this.line=Math.round(ele.scrollHeight/(1.5*15));
                })
                var arrDiv=ele.childNodes;
                for(var i=0;i<arrDiv.length;i++)
                {
                    var objDiv = arrDiv[i];
                    if(objDiv.nodeType==1)
                    {
                        objDiv.className="testCodeLine"
                    }
                }
                var arr=ele.getElementsByTagName("a");
                var arrPromise=[];
                $.startHud();
                var _this=this;
                Array.prototype.slice.call(arr).forEach(function (obj) {
                    if(obj.getAttribute("type")=="1")
                    {
                        obj.onclick=function () {
                            _this.editInterface(obj);
                        }
                        var inter=JSON.parse(obj.getAttribute("data"));
                        arrPromise.push(net.get("/test/interface",{
                            interface:inter._id,
                            only:1
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                var date=inter.updatedAt;
                                if(date==data.data.updatedAt)
                                {
                                    obj.style.textDecoration="none"
                                }
                                else
                                {
                                    obj.style.textDecoration="underline"
                                    obj.style.textDecorationColor="red"
                                }
                            }
                            else
                            {
                                obj.style.textDecoration="line-through"
                                obj.style.textDecorationColor="black"
                            }
                        }));
                    }
                    else
                    {
                        obj.onclick=function () {
                            _this.editTest(obj);
                        }
                        var id=obj.getAttribute("data");
                        arrPromise.push(net.get("/test/test",{
                            id:id,
                            project:this.type==2?this.$store.state.selTest.project:session.get("projectId")
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                obj.style.textDecoration="none"
                                obj.style.color="orange"
                            }
                            else
                            {
                                obj.style.textDecoration="line-through"
                                obj.style.textDecorationColor="black"
                            }
                        }));
                    }
                })
                Promise.all(arrPromise).then(function (data) {
                    $.stopHud();
                })
            },
            changeContent:function (e) {
                if(this.timer)
                {
                    clearTimeout(this.timer);
                    this.timer=null;
                }
                var ele=document.getElementById("testContent");
                this.line=Math.round(ele.scrollHeight/(1.5*15));
                var _this=this;
                this.timer=setTimeout(function (type) {
                    var tempEle=document.createElement("div");
                    tempEle.innerHTML=ele.innerHTML;
                    var arrTempLink=tempEle.querySelectorAll("a[data]");
                    arrTempLink.forEach(function (obj) {
                        obj.parentNode.replaceChild(document.createTextNode("function (){}"),obj);
                    })
                    var arrTempDiv=tempEle.querySelectorAll("div.testCodeLine");
                    var arrCode=Array.prototype.slice.call(arrTempDiv).map(function (obj) {
                        return obj.textContent.replace(/async\s|await\s/g,"");
                    })
                    window.worker.postMessage(arrCode);
                    if(type=="insertParagraph")
                    {
                        return;
                    }
                    var start=_this.getCaretCharacterOffsetWithin(ele);
                    if(/\s|\t|;|\{|\}|\(|\)|\[|\]|\*|\//.test(ele.textContent[start-1]) && type!="insertFromPaste")
                    {
                        return;
                    }
                    tempEle.innerHTML=ele.innerHTML;
                    var arrLink=tempEle.querySelectorAll("a[data]");
                    var arrLinkOuter=[];
                    arrLink.forEach(function (obj) {
                        var str=obj.getAttribute("data");
                        var type=obj.getAttribute("type");
                        var id=Date.now()+$.rand(1,10000);
                        var objPush={
                            text:id,
                            html:obj.outerHTML
                        }
                        arrLinkOuter.push(objPush);
                        var parentNode=obj.parentNode;
                        parentNode.replaceChild(document.createTextNode(objPush.text),obj);
                        parentNode.normalize();
                    })
                    var arrChild=tempEle.childNodes;
                    for(var i=0;i<arrChild.length;i++)
                    {
                        var objDiv=arrChild[i];
                        if(objDiv.textContent)
                        {
                            var html=window.Prism.highlight(objDiv.textContent,window.Prism.languages.javascript);
                            if(objDiv.nodeType==3)
                            {
                                var span=document.createElement("div");
                                span.innerHTML=html;
                                objDiv.parentNode.replaceChild(span,objDiv);
                            }
                            else
                            {
                                objDiv.innerHTML=html;
                            }
                        }
                    }
                    arrLinkOuter.forEach(function (obj) {
                        tempEle.innerHTML=tempEle.innerHTML.replace(obj.text,obj.html);
                    })
                    ele.innerHTML=tempEle.innerHTML;
                    if(ele.innerHTML=="")
                    {
                        var div=document.createElement("div");
                        div.className="testCodeLine";
                        div.style.height="22px";
                        ele.appendChild(div);
                    }
                    var arrDiv=ele.childNodes;
                    for(var i=0;i<arrDiv.length;i++)
                    {
                        var objDiv = arrDiv[i];
                        if(objDiv.nodeType==1)
                        {
                            objDiv.className="testCodeLine"
                        }
                    }
                    var arr=ele.querySelectorAll("a");
                    arr.forEach(function (obj) {
                        if(obj.getAttribute("type")=="1")
                        {
                            obj.onclick=function () {
                                _this.editInterface(obj);
                            }
                        }
                        else
                        {
                            obj.onclick=function () {
                                _this.editTest(obj);
                            }
                        }
                    })
                    _this.setSelectionRange(ele,start,start);
                    _this.timer=null;
                },100,e?e.inputType:"");
            },
            getCaretCharacterOffsetWithin:function (element) {
                var caretOffset = 0;
                var doc = element.ownerDocument || element.document;
                var win = doc.defaultView || doc.parentWindow;
                var sel;
                if (typeof win.getSelection != "undefined") {
                    sel = win.getSelection();
                    if (sel.rangeCount > 0) {
                        var range = win.getSelection().getRangeAt(0);
                        var preCaretRange = range.cloneRange();
                        preCaretRange.selectNodeContents(element);
                        preCaretRange.setEnd(range.endContainer, range.endOffset);
                        caretOffset = preCaretRange.toString().length;
                    }
                } else if ( (sel = doc.selection) && sel.type != "Control") {
                    var textRange = sel.createRange();
                    var preCaretTextRange = doc.body.createTextRange();
                    preCaretTextRange.moveToElementText(element);
                    preCaretTextRange.setEndPoint("EndToEnd", textRange);
                    caretOffset = preCaretTextRange.text.length;
                }
                return caretOffset;
            },
            getTextNodesIn:function (node) {
                var textNodes = [];
                if (node.nodeType == 3) {
                    textNodes.push(node);
                } else {
                    var children = node.childNodes;
                    for (var i = 0, len = children.length; i < len; ++i) {
                        textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]));
                    }
                }
                return textNodes;
            },
            setSelectionRange:function (el, start, end,offset) {
                if (document.createRange && window.getSelection) {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    var textNodes = this.getTextNodesIn(el);
                    var foundStart = false;
                    var charCount = 0, endCharCount;

                    for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                        endCharCount = charCount + textNode.length;
                        if (!foundStart && start >= charCount
                            && (start < endCharCount ||
                                (start == endCharCount && i <= textNodes.length))) {
                            range.setStart(textNode,offset!==undefined?offset:(end - charCount));
                            foundStart = true;
                        }
                        if (foundStart && end <= endCharCount) {
                            range.setEnd(textNode, end - charCount);
                            break;
                        }
                        charCount = endCharCount;
                    }

                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && document.body.createTextRange) {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(true);
                    textRange.moveEnd("character", end);
                    textRange.moveStart("character", start);
                    textRange.select();
                }
            },
            keyDown:function (e) {
                if(e.ctrlKey || e.keyCode==91)
                {
                    this.stopKeyUp=1;
                }
                else if (e.keyCode === 9) {
                    e.preventDefault();
                    var editor = document.getElementById("testContent");
                    var doc = editor.ownerDocument.defaultView;
                    var sel = doc.getSelection();
                    var range = sel.getRangeAt(0);
                    var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
                    range.insertNode(tabNode);
                    range.setStartAfter(tabNode);
                    range.setEndAfter(tabNode);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                else if(e.code=="ArrowDown" || e.code=="ArrowUp")
                {
                    if(!this.menu)
                    {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    if(e.code=="ArrowDown")
                    {
                        if(this.selMenuIndex==this.vars.length-1)
                        {
                            this.selMenuIndex=0
                        }
                        else
                        {
                            this.selMenuIndex++
                        }
                    }
                    else
                    {
                        if(this.selMenuIndex==0)
                        {
                            this.selMenuIndex=this.vars.length-1
                        }
                        else
                        {
                            this.selMenuIndex--
                        }
                    }
                    this.$nextTick(function () {
                        var menu=document.getElementById("autoMenu");
                        var ele=menu.querySelectorAll("div.autoMenu")[this.selMenuIndex];
                        menu.scrollTop=ele.offsetTop;
                    })
                }
                else if(e.keyCode==13)
                {
                    if (!this.menu) {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    var ele=document.getElementById("testContent");
                    var value=this.vars[this.selMenuIndex];
                    this.setSelectionRange(ele,this.start+1,this.end,0);
                    this.replaceSelectedText(value);
                }
            },
            keyUp:function (e) {
                if(this.stopKeyUp)
                {
                    this.stopKeyUp=0;
                    if(this.timerAuto)
                    {
                        clearTimeout(this.timerAuto);
                        this.timerAuto=null;
                    }
                    return;
                }
                else if((this.menu && (e.code=="ArrowDown" || e.code=="ArrowUp")))
                {
                    if(this.timerAuto)
                    {
                        clearTimeout(this.timerAuto);
                        this.timerAuto=null;
                    }
                    return;
                }
                else if(!((e.keyCode>=65 && e.keyCode<=90) || (e.keyCode>=97 && e.keyCode<=122) || (e.keyCode>=48 && e.keyCode<=57)))
                {
                    this.menu=0;
                    this.vars=[];
                    if(this.timerAuto)
                    {
                        clearTimeout(this.timerAuto);
                        this.timerAuto=null;
                    }
                    return;
                }
                if(this.timerAuto)
                {
                    clearTimeout(this.timerAuto);
                    this.timerAuto=null;
                }
                var _this=this;
                var ele=document.getElementById("testContent");
                var eleContent=document.getElementById("testContentCode");
                var arr=["\r","\n"," ","\t",";",",",".","{","}","(",")","[","]","=",">","<","+","-","!","%","&","*","-",":","\"","'","?","\\","/","`","~","@","#","^","|"];
                this.timerAuto=setTimeout(function () {
                    var end=_this.getCaretCharacterOffsetWithin(ele);
                    var start=end-1;
                    if(!_this.outside(ele.textContent.substr(0,start)))
                    {
                        _this.timerAuto=null;
                        return;
                    }
                    while(start>=0 && arr.indexOf(ele.textContent[start])==-1)
                    {
                        start--;
                    }
                    start++;
                    _this.start=start;
                    _this.end=end;
                    var str=ele.textContent.substring(start,end);
                    var xy=_this.getSelectionCoords(eleContent);
                    var rect=eleContent.getBoundingClientRect();
                    _this.menu=1;
                    _this.vars=[];
                    _this.selMenuIndex=0;
                    if(_this.objAnalyse.var.indexOf(str)>-1)
                    {
                        _this.vars.push(str);
                    }
                    _this.vars=_this.vars.concat(_this.objAnalyse.var.filter(function (obj) {
                        return (obj!=str && obj.toLowerCase().indexOf(str.toLowerCase())>-1)
                    }));
                    _this.$nextTick(function () {
                        var menu=document.getElementById("autoMenu");
                        if(menu)
                        {
                            menu.style.top=(xy.y-rect.top+25)+"px";
                            menu.style.left=(xy.x-rect.left)+"px";
                        }
                    })
                    _this.timerAuto=null;
                },300);
            },
            scroll:function (e) {
                var scroll=document.getElementById("testScroll");
                var content=document.getElementById("testContent");
                scroll.scrollTop=content.scrollTop;
                e.stopPropagation();
            },
            getSelectionCoords:function () {
                var sel = document.selection, range, rect;
                var x = 0, y = 0;
                if (sel) {
                    if (sel.type != "Control") {
                        range = sel.createRange();
                        range.collapse(true);
                        x = range.boundingLeft;
                        y = range.boundingTop;
                    }
                } else if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.rangeCount) {
                        range = sel.getRangeAt(0).cloneRange();
                        if (range.getClientRects) {
                            range.collapse(true);
                            if (range.getClientRects().length>0){
                                rect = range.getClientRects()[0];
                                x = rect.left;
                                y = rect.top;
                            }
                        }
                        if (x == 0 && y == 0) {
                            var span = document.createElement("span");
                            if (span.getClientRects) {
                                span.appendChild( document.createTextNode("\u200b") );
                                range.insertNode(span);
                                rect = span.getClientRects()[0];
                                x = rect.left;
                                y = rect.top;
                                var spanParent = span.parentNode;
                                spanParent.removeChild(span);
                                spanParent.normalize();
                            }
                        }
                    }
                }
                return { x: x, y: y };
            },
            outside:function (str) {
                var a1=0,a2=0;
                for(var i=0;i<str.length;i++)
                {
                    if(str[i]=="\"" && (i==0 || str[i-1]!="\\"))
                    {
                        a1++
                    }
                    else if(str[i]=="'" && (i==0 || str[i-1]!="\\"))
                    {
                        a2++
                    }
                }
                if(a1%2==0 && a2%2==0)
                {
                    return true;
                }
                else
                {
                    return false
                }
            },
            replaceSelectedText:function (replacementText) {
                var sel, range;
                var node=document.createTextNode(replacementText)
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(node);
                        range.setStartAfter(node);
                        range.setEndAfter(node);
                    }
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    range.text = replacementText;
                    range.setStartAfter(node);
                    range.setEndAfter(node);
                }
            },
            selectMenu:function (item) {
                this.menu=0;
                var ele=document.getElementById("testContent");
                this.setSelectionRange(ele,this.start+1,this.end,0);
                this.replaceSelectedText(item);
            },
            copyCode:function () {
                var bRange=helper.getSelection();
                if(!bRange)
                {
                    $.tip("请选中代码再点击复制",0);
                    return;
                }
                var arr = [];
                var doc=document.createDocumentFragment();
                var sel = window.getSelection();
                for(var i = 0; i < sel.rangeCount; i++) {
                    doc.appendChild(sel.getRangeAt(i).cloneContents());
                }
                this.$store.state.objCopy=doc;
                $.tip("复制成功",1);
            },
            pasteCode:function () {
                var selection=helper.getSelection();
                if(!selection)
                {
                    $.tip("请点击代码编辑框再粘贴",0);
                    return;
                }
                selection.deleteContents();
                var obj=this.$store.state.objCopy;
                if(obj.childNodes.length>0 && obj.firstChild.nodeType==1 && obj.firstChild.className=="testCodeLine")
                {
                    var parent=selection.startContainer.parentNode;
                    parent.replaceChild(obj.cloneNode(true),selection.startContainer);
                }
                else
                {
                    selection.insertNode(obj.cloneNode(true));
                }
                this.changeContent({
                    inputType:"insertFromPaste"
                });
                $.tip("粘贴成功",1);
            },
            convertToCode:function (data) {
                var _this=this;
                var str=helper.convertToCode(data);
                var ele=document.getElementById("testContent");
                ele.innerHTML=str;
                _this.changeContent({
                    inputType:"insertFromPaste"
                });
                $.tip("转换成功",1);
            }
        },
        created:function () {
            var _this=this;
            window.worker.onmessage=function (e) {
                _this.objAnalyse=e.data;
            }
            document.addEventListener("click",function () {
                _this.menu=0;
                _this.var=[];
            },false);
        },
    }
</script>