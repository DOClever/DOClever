/**
 * Created by sunxin on 2017/2/22.
 */
var CryptoJS=require("crypto-js")
require("./Base64")
var helper={};
helper.methodColor=function (m) {
    var m=m.toLowerCase();
    if(m=="get")
    {
        return "green"
    }
    else if(m=="post")
    {
        return "orange"
    }
    else  if(m=="delete")
    {
        return "red"
    }
    else if(m=="put")
    {
        return "skyblue"
    }
}

helper.initResultShow=function (data) {
    for(var i=0;i<data.length;i++)
    {
        Vue.set(data[i],"show",0);
        Vue.set(data[i],"drag",1);
        if(data[i].mock===undefined)
        {
            Vue.set(data[i],"mock","");
        }
        if(data[i].data)
        {
            arguments.callee(data[i].data);
        }
    }
}

helper.refreshInterface=function (localData,data) {
    for(var i=0;i<data.length;i++)
    {
        var obj=data[i];
        var bFind=false,show=0;
        for(var i1=0;i1<localData.length;i1++)
        {
            if(obj._id==localData[i1]._id)
            {
                bFind=true;
                show=localData[i1].show;
                break;
            }
        }
        if(bFind)
        {
            obj.show=show;
        }
        else
        {
            obj.show=0;
        }
        for(var j=0;j<data[i].data.length;j++)
        {
            data[i].data[j].select=0;
        }
    }
    return data;
}

helper.resultSave=function (data) {
    var arr=[];
    for(var i=0;i<data.length;i++)
    {
        helper.eachResult(data[i],null,arr);
    }
    return arr;
}

helper.eachResult=function (item,pItem,arr) {
    if(item.name || (!item.name && pItem && pItem.type==3))
    {
        var obj={
            name:item.name,
            type:item.type,
            remark:item.remark,
            must:item.must,
            mock:item.mock
        }
        arr.push(obj)
        if(item.type==3 || item.type==4)
        {
            obj.data=[];
            for(var i=0;i<item.data.length;i++)
            {
                arguments.callee(item.data[i],item,obj.data)
            }
        }
    }
}

helper.convertToJSON=function (data,obj) {
    var mock=function (data) {
        if(!data.mock || $.trim(data.mock)[0]!="@")
        {
            if(data.type==0)
            {
                if(data.mock)
                {
                    return $.trim(data.mock)
                }
                else
                {
                    return "mock"
                }
            }
            else if(data.type==1)
            {
                if(data.mock)
                {
                    return parseFloat($.trim(data.mock))
                }
                else
                {
                    return 1
                }
            }
            else if(data.type==2)
            {
                if(data.mock)
                {
                    return Boolean($.trim(data.mock))
                }
                else
                {
                    return true
                }
            }
        }
        else
        {
            var str=$.trim(data.mock).substr(1);
            if(/^date/i.test(str))
            {
                return $.getNowFormatDate("yyyy-MM-dd hh:mm:ss");
            }
            else if(/^img/i.test(str))
            {
                return "https://dummyimage.com/600x400/"+Math.round(Math.random()*999);
            }
            else if(/^num/i.test(str))
            {
                var val=str.substring(4,str.length-1);
                var arr=val.split(",");
                var gap=parseInt(arr[1])-parseInt(arr[0]);
                var temp=Math.round(Math.random()*gap+parseInt(arr[0]));
                if(data.type==1)
                {
                    return temp;
                }
                else
                {
                    return String(temp);
                }
            }
            else if(/^in/i.test(str))
            {
                var val=str.substring(3,str.length-1);
                var arr=val.split(",");
                var temp=Math.round(Math.random()*(arr.length-1));
                temp=arr[temp];
                if(data.type==0)
                {
                    return String(temp);
                }
                else if(data.type==1)
                {
                    return parseFloat(temp);
                }
                else (data.type==2)
                {
                    return Boolean(temp);
                }
            }
        }
        return data.mock?$.trim(data.mock):null;
    }
    var func=function (data,obj) {
        if(data.type==0)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==1)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==2)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==3)
        {
            var objTemp=[];
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(objTemp);
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=objTemp;
            }
            for(var i=0;i<data.data.length;i++)
            {
                func(data.data[i],objTemp);
            }
        }
        else if(data.type==4)
        {
            var objTemp={};
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(objTemp);
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=objTemp;
            }
            for(var i=0;i<data.data.length;i++)
            {
                func(data.data[i],objTemp);
            }
        }
    }
    for(var i=0;i<data.length;i++)
    {
        func(data[i],obj);
    }
}

helper.format=function (txt,mix,outParam) {
    var indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;';
    if(/^\s*$/.test(txt)){
        alert('数据为空,无法格式化! ');
        return;
    }
    try{
        txt=txt.replace(/\<|\>|\s/g,function (str) {
            if(str=="<")
            {
                return "&lt;"
            }
            else if(str==">")
            {
                return "&gt;"
            }
            else
            {
                return "&nbsp;"
            }
        })
        var data=eval('('+txt+')');
    }
    catch(e){
        $.tip("数据源语法错误,格式化失败! ",0);
        return;
    };
    var result=outParam;
    var draw=[],last=false,line='',nodeCount=0,maxDepth=0;
    var notify=function(name,value,isLast,indent,formObj,raw,root){
        nodeCount++;
        for (var i=0,tab='';i<indent;i++ ){
            tab+=indentChar;
        }
        maxDepth=++indent;
        if(value&&value.constructor==Array){
            var remark="";
            if(raw && !root)
            {
                remark=getRemark(name,raw)
            }
            var timestamp=new Date().getTime()+i;
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'"')+' <span style="border: 1px gray solid;cursor: pointer;color: #50a3ff;'+((formObj || root)?"":"margin-left: -17px")+'" jsonflag arrsize="'+value.length+'" timestamp="'+timestamp+'">-</span> '+'<span jsonleft>[</span>'+line+remark);
            for (var i=0;i<value.length;i++){
                var raw1=getData(i,raw)
                notify(i,value[i],i==value.length-1,indent,false,raw1);
            }
            draw.push(tab+'<span timestamp="'+timestamp+'"></span>'+']'+(isLast?line:(','+line)));
        }else   if(value&&typeof value=='object'){
            var remark="";
            if(raw && !root)
            {
                remark=getRemark(name,raw)
            }
            var timestamp=new Date().getTime()+i;
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'')+' <span style="border: 1px gray solid;cursor: pointer;color: #50a3ff;'+((formObj || root)?"":"margin-left: -17px")+'" jsonflag timestamp="'+timestamp+'">-</span> '+'<span jsonleft>{</span>'+line+remark);
            var len=0,i=0;
            for(var key in value){
                len++;
            }
            for(var key in value){
                var raw1=getData(key,raw)
                notify(key,value[key],++i==len,indent,true,raw1);
            }
            draw.push(tab+'<span timestamp="'+timestamp+'"></span>'+'}'+(isLast?line:(','+line)))
        }else{
            if(typeof value=='string'){
                value='"'+"<span style='font-weight: bold'>"+value+"</span>"+'"';
            }
            else if(typeof(value)=="boolean")
            {
                value="<span style='font-weight: bold'>"+(value?"true":"false")+"</span>"
            }
            else
            {
                value="<span style='font-weight: bold'>"+value+"</span>"
            }
            var remark="";
            if(raw && !root)
            {
                remark=getRemark(name,raw)
            }
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'')+"<span style='color: #1daf42'>"+value+"</span>"+(isLast?'':',')+line+remark);
        };
    };
    var getData=function (key,raw) {
        if(!raw)
        {
            return null;
        }
        if(raw instanceof  Array)
        {
            if(typeof(key)=="string")
            {
                for(var i=0;i<raw.length;i++)
                {
                    if(raw[i].name.toLowerCase()==key.toLowerCase())
                    {
                        return raw[i];
                    }
                }
            }
            else if(typeof(key)=="number")
            {
                return raw[key];
            }
        }
        else
        {
            if(typeof(key)=="string")
            {
                if(!raw.data)
                {
                    return null;
                }
                for(var i=0;i<raw.data.length;i++)
                {
                    if(raw.data[i].name.toLowerCase()==key.toLowerCase())
                    {
                        return raw.data[i];
                    }
                }
            }
            else if(typeof(key)=="number")
            {
                return raw.data[key];
            }
        }
        return null;
    }
    var getRemark=function (name,raw) {
        var type=["String","Number","Boolean","Array","Object"];
        if(!raw)
        {
            return "";
        }
        return "<span style='color: gray'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//类型："+type[raw.type]+"&nbsp;&nbsp;"+(raw.must?"必有字段":"可有字段")+"&nbsp;&nbsp;备注："+(raw.remark?raw.remark:"无")+"</span>";
    }
    var isLast=true,indent=0;
    notify('',data,isLast,indent,false,mix?result:null,1);
    setTimeout(function () {
        var arr=document.querySelectorAll("span[jsonflag]");
        for(var i=0;i<arr.length;i++)
        {
            arr[i].onclick=function () {
                var timestamp=this.getAttribute("timestamp");
                var ele=this.parentNode.nextSibling;
                var bExpand;
                var left=this.parentNode.querySelector("span[jsonleft]");
                if(this.innerText=="-")
                {
                    this.innerText="+"
                    bExpand=false;
                    if(left.innerText.indexOf("{")>-1)
                    {
                        left.innerText="{...}"
                    }
                    else
                    {
                        left.innerText="["+this.getAttribute("arrsize")+"]"
                    }
                    while(ele)
                    {
                        ele.style.display="none";
                        var span=ele.querySelector("span[timestamp='"+timestamp+"']")
                        if(span)
                        {
                            return;
                        }
                        ele=ele.nextSibling;
                    }
                }
                else
                {
                    this.innerText="-"
                    bExpand=true;
                    if(left.innerText.indexOf("{")>-1)
                    {
                        left.innerText="{"
                    }
                    else
                    {
                        left.innerText="["
                    }
                    while(ele)
                    {
                        ele.style.display="block";
                        var span=ele.querySelector("span[timestamp]")
                        if(span)
                        {
                            if(span.getAttribute("timestamp")==timestamp)
                            {
                                return;
                            }
                            else
                            {
                                if(span.innerText=="+")
                                {
                                    var timestamp1=span.getAttribute("timestamp");
                                    ele=ele.nextSibling;
                                    while(1)
                                    {
                                        var span1=ele.querySelector("span[timestamp]");
                                        if(span1 && span1.getAttribute("timestamp")==timestamp1)
                                        {
                                            break;
                                        }
                                        ele=ele.nextSibling
                                    }
                                }
                            }
                        }
                        ele=ele.nextSibling;
                    }
                }
            }
        }
    },300);
    return draw;
}

helper.handleResultData=function (name,data,result,originObj,show) {
    if(typeof(data)=="string")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:0,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:data):data
        }
        if(show)
        {
            obj.show=0
        }
        result.push(obj)
    }
    else if(typeof(data)=="number")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:1,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:String(data)):String(data)
        }
        if(show)
        {
            obj.show=0
        }
        result.push(obj)
    }
    else if(typeof(data)=="boolean")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:2,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:String(data)):String(data)
        }
        if(show)
        {
            obj.show=0
        }
        result.push(obj)
    }
    else  if(typeof(data)=="object" && (data instanceof Array))
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:3,
            remark:originObj?originObj.remark:"",
            data:[],
            mock:""
        };
        if(show)
        {
            obj.show=0
        }
        result.push(obj);
        if(data.length>0)
        {
            var resultObj=originObj?((originObj.data && originObj.data.length>0)?originObj.data[0]:null):null;
            arguments.callee(null,data[0],obj.data,resultObj,show)
        }
    }
    else if(typeof(data)=="object" && !(data instanceof Array))
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:4,
            remark:originObj?originObj.remark:"",
            data:[],
            mock:""
        };
        if(show)
        {
            obj.show=0
        }
        result.push(obj);
        for(var key in data)
        {
            var resultObj=helper.findObj(originObj?originObj.data:null,key);
            arguments.callee(key,data[key],obj.data,resultObj,show)
        }
    }
    else
    {
        return;
    }
}
helper.findObj=function (data,key) {
    if(!data || !key)
    {
        return null;
    }
    for(var i=0;i<data.length;i++)
    {
        if(data[i].name==key)
        {
            return data[i];
        }
    }
    return null;
}

helper.findValue=function (data,key) {
    if(!data || !key)
    {
        return null;
    }
    for(var i=0;i<data.length;i++)
    {
        if(data[i].name==key)
        {
            return {
                value:data[i].value,
                index:i,
                must:data[i].must,
                remark:data[i].remark,
                enable:data[i].enable,
                type:data[i].type,
                encrypt:data[i].encrypt?$.clone(data[i].encrypt):null
            };
        }
    }
    return null;
}

helper.mock=function (data) {
    if(!data || $.trim(data)[0]!="@")
    {
        if(data)
        {
            return $.trim(data)
        }
        else
        {
            return "mock"
        }
    }
    else
    {
        var str=$.trim(data).substr(1);
        if(/^date/i.test(str))
        {
            return $.getNowFormatDate("yyyy-MM-dd hh:mm:ss");
        }
        else if(/^img/i.test(str))
        {
            return "https://dummyimage.com/600x400/"+Math.round(Math.random()*999);
        }
        else if(/^num/i.test(str))
        {
            var val=str.substring(4,str.length-1);
            var arr=val.split(",");
            var gap=parseInt(arr[1])-parseInt(arr[0]);
            var temp=Math.round(Math.random()*gap+parseInt(arr[0]));
            return String(temp);
        }
        else if(/^in/i.test(str))
        {
            var val=str.substring(3,str.length-1);
            var arr=val.split(",");
            var temp=Math.round(Math.random()*(arr.length-1));
            temp=arr[temp];
            return String(temp);
        }
    }
    return data?$.trim(data):null;
}

helper.isSalt=function (type) {
    var arr=["AES","TripleDES","DES","Rabbit","RC4","RC4Drop"];
    if(arr.indexOf(type)>-1)
    {
        return true;
    }
    else
    {
        return false;
    }
}

helper.encrypt=function (type,val,salt) {
    if(!val)
    {
        return ""
    }
    var arr=["Base64","MD5","SHA-1","SHA-256","SHA-512","SHA-3","RIPEMD-160"];
    var arrFunc=[BASE64.encoder,CryptoJS.MD5,CryptoJS.SHA1,CryptoJS.SHA256,CryptoJS.SHA512,CryptoJS.SHA3,CryptoJS.RIPEMD160]
    var arrSalt=["AES","TripleDES","DES","Rabbit","RC4","RC4Drop"];
    var arrSaltFunc=[CryptoJS.AES.encrypt,CryptoJS.TripleDES.encrypt,CryptoJS.DES.encrypt,CryptoJS.Rabbit.encrypt,CryptoJS.RC4.encrypt,CryptoJS.RC4Drop.encrypt];
    var index=arr.indexOf(type);
    if(index>-1)
    {
        return arrFunc[index](val).toString();
    }
    index=arrSalt.indexOf(type);
    if(index>-1)
    {
        return arrSaltFunc[index](val,salt).toString();
    }
    return val;
}
module.exports=helper;