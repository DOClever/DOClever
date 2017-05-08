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

helper.resultSave=function (data,json) {
    var arr=[];
    for(var i=0;i<data.length;i++)
    {
        helper.eachResult(data[i],data[i].name===null?{type:3}:null,arr,json);
    }
    return arr;
}

helper.eachResult=function (item,pItem,arr,json) {
    if(item.name || (!item.name && pItem && pItem.type==3))
    {
        var obj={
            name:item.name,
            type:item.type,
            remark:item.remark,
            must:item.must,
            mock:item.mock
        }
        if(json)
        {
            if(item.value)
            {
                if(item.value.type==0)
                {
                    var v=item.mock,bFind=false;
                    item.value.data.forEach(function (o) {
                        if(o.value==v)
                        {
                            bFind=true;
                        }
                    })
                    if(!bFind)
                    {
                        item.value.data.push({
                            value:v,
                            remark:""
                        });
                    }
                }
            }
            else
            {
                obj.value={
                    type:0,
                    status:"",
                    data:[{
                        value:item.mock,
                        remark:""
                    }]
                }
            }
        }
        if(item.status)
        {
            obj.status=item.status;
        }
        arr.push(obj)
        if(item.type==3 || item.type==4)
        {
            obj.data=[];
            for(var i=0;i<item.data.length;i++)
            {
                arguments.callee(item.data[i],item,obj.data,json)
            }
        }
    }
}

helper.convertToJSON=function (data,obj,info) {
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
            else if(data.type==5)
            {
                if(data.mock)
                {
                    return $.trim(data.mock)
                }
                else
                {
                    return "mixed"
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
                var val=str.length==3?"":str.substring(4,str.length-1),arr;
                if(val)
                {
                    arr=val.split(",");
                }
                return "https://dummyimage.com/"+(arr?(arr[0]+"x"+arr[1]+"/"):"600x400/")+Math.round(Math.random()*999);
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
                if(data.type==0 || data.type==5)
                {
                    return String(temp);
                }
                else if(data.type==1)
                {
                    return parseFloat(temp);
                }
                else if(data.type==2)
                {
                    return Boolean(temp);
                }
            }
            else if(/^arr/i.test(str))
            {
                var val=$.trim(str.substring(4,str.length-1));
                if(data.type==5)
                {
                    if(val.length>0)
                    {
                        var arr;
                        try
                        {
                            arr=eval(val);
                        }
                        catch (err)
                        {
                            arr=[];
                        }
                        if(!(arr instanceof  Array))
                        {
                            arr=[];
                        }
                        return arr;
                    }
                    else
                    {
                        return [];
                    }
                }
                else
                {
                    return null;
                }
            }
            else if(/^obj/i.test(str))
            {
                var val=$.trim(str.substring(4,str.length-1));
                if(data.type==5)
                {
                    if(val.length>0)
                    {
                        var obj;
                        try
                        {
                            obj=eval("("+val+")");
                        }
                        catch (err)
                        {
                            obj={};
                        }
                        if(!(obj instanceof  Object))
                        {
                            obj={};
                        }
                        return obj;
                    }
                    else
                    {
                        return {};
                    }
                }
                else
                {
                    return null;
                }
            }
            else if(/^null/i.test(str))
            {
                return null;
            }
            else if(/^code/i.test(str))
            {
                var val=$.trim(str.substring(5,str.length-1));
                if(info)
                {
                    try
                    {
                        var ret=(function (param,query,header,body,global) {
                            return eval("("+val+")");
                        })(info.param,info.query,info.header,info.body,info.global)
                        if(data.type==0)
                        {
                            return String(ret);
                        }
                        else if(data.type==1)
                        {
                            return parseFloat(ret);
                        }
                        else if(data.type==2)
                        {
                            return Boolean(ret);
                        }
                        else if(data.type==5)
                        {
                            return ret;
                        }
                    }
                    catch (err)
                    {
                        console.log("execute err:"+err);
                        return null;
                    }
                }
                else
                {
                    return null;
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
            var str=$.trim(data.mock).substr(1),count=1;
            if(/^count/i.test(str))
            {
                var val=str.substring(6,str.length-1);
                var arr=val.split(",");
                var gap=parseInt(arr[1])-parseInt(arr[0]);
                var temp=Math.round(Math.random()*gap+parseInt(arr[0]));
                count=temp;
            }
            for(var j=0;j<count;j++)
            {
                for(var i=0;i<data.data.length;i++)
                {
                    func(data.data[i],objTemp);
                }
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
        else if(data.type==5)
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
    }
    for(var i=0;i<data.length;i++)
    {
        func(data[i],obj);
    }
}

helper.format=function (txt,mix,outParam,status) {
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
    var draw=[],last=false,line='',nodeCount=0,maxDepth=0,errorCount=0;
    var checkType=function (value,raw,obj) {
        if(value===null || value==undefined || raw.type==5)
        {
            return;
        }
        else if(typeof(value)=="string" && raw.type==0)
        {
            return;
        }
        else if(typeof(value)=="number" && raw.type==1)
        {
            return;
        }
        else if(typeof(value)=="boolean" && raw.type==2)
        {
            return;
        }
        else if((typeof(value)=="object" && (value instanceof Array)) && raw.type==3)
        {
            return;
        }
        else if((typeof(value)=="object" && !(value instanceof Array)) && raw.type==4)
        {
            return;
        }
        errorCount++;
        obj.title+="返回数据类型和文档模型不匹配。 "
    }
    var checkExist=function (value,raw,obj) {
        if(typeof(raw)=="object" && !(raw instanceof Array) && raw.type!=5)
        {
            for(var i=0;i<raw.data.length;i++)
            {
                if(raw.data[i].must)
                {
                    var bFind=false;
                    for(var key in value)
                    {
                        if(key==raw.data[i].name)
                        {
                            bFind=true;
                        }
                    }
                    if(!bFind && raw.data[i].name)
                    {
                        errorCount++;
                        obj.title+="必有字段"+raw.data[i].name+"在返回数据里不存在。 ";
                    }
                }
            }
        }
        else if(typeof(raw)=="object" && (raw instanceof Array))
        {
            for(var i=0;i<raw.length;i++)
            {
                if(raw[i].must)
                {
                    var bFind=false;
                    for(var key in value)
                    {
                        if(key==raw[i].name)
                        {
                            bFind=true;
                        }
                    }
                    if(!bFind && raw[i].name)
                    {
                        errorCount++;
                        obj.title+="必有字段"+raw[i].name+"在返回数据里不存在。 ";
                    }
                }
            }
        }
    }
    var notify=function(name,value,isLast,indent,formObj,raw,match,root){
        nodeCount++;
        for (var i=0,tab='';i<indent;i++ ){
            tab+=indentChar;
        }
        maxDepth=++indent;
        if(value&&value.constructor==Array){
            var remark="",errObj={title:""};
            if(raw && !root && match)
            {
                remark=getRemark(name,raw);
                checkType(value,raw,errObj);
            }
            var timestamp=new Date().getTime()+i;
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'')+' <span style="border: 1px gray solid;cursor: pointer;color: #50a3ff;'+((formObj || root)?"":"margin-left: -22px")+'" jsonflag arrsize="'+value.length+'" timestamp="'+timestamp+'" '+(errObj.title?('err="'+errObj.title+'"'):'')+'>-</span> '+'<span jsonleft>[</span>'+line+remark);
            for (var i=0;i<value.length;i++){
                var raw1=getData(i,raw)
                notify(i,value[i],i==value.length-1,indent,false,raw1,errObj.title?0:1,false,status);
            }
            draw.push(tab+'<span timestamp="'+timestamp+'"></span>'+']'+(isLast?line:(','+line)));
        }else   if(value&&typeof value=='object'){
            var remark="",errObj={title:""},bMatch=true;
            if(raw && !root && match)
            {
                remark=getRemark(name,raw)
                checkType(value,raw,errObj);
                if(!errObj.title)
                {
                    checkExist(value,raw,errObj)
                }
                else
                {
                    bMatch=false;
                }
            }
            else if(raw && root && match)
            {
                checkExist(value,raw,errObj)
            }
            var timestamp=new Date().getTime()+i;
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'')+' <span style="border: 1px gray solid;cursor: pointer;color: #50a3ff;'+((formObj || root)?"":"margin-left: -22px")+'" jsonflag timestamp="'+timestamp+'" '+(errObj.title?('err="'+errObj.title+'"'):'')+'>-</span> '+'<span jsonleft>{</span>'+line+remark);
            var len=0,i=0;
            for(var key in value){
                len++;
            }
            for(var key in value){
                var raw1=getData(key,raw)
                notify(key,value[key],++i==len,indent,true,raw1,bMatch?1:0,false,status);
            }
            draw.push(tab+'<span timestamp="'+timestamp+'"></span>'+'}'+(isLast?line:(','+line)))
        }else{
            var remark="",errObj={title:""},statusInfo=null;
            if(raw && !root && match)
            {
                remark=getRemark(name,raw);
                checkType(value,raw,errObj);
            }
            if(typeof value=='string'){
                statusInfo=getStatus(raw,value,status);
                value='"'+"<span style='font-weight: bold'>"+value+"</span>"+'"';
            }
            else if(typeof(value)=="boolean")
            {
                value="<span style='font-weight: bold'>"+(value?"true":"false")+"</span>"
            }
            else
            {
                statusInfo=getStatus(raw,value,status);
                value="<span style='font-weight: bold'>"+value+"</span>"
            }
            draw.push(tab+(formObj?('"'+"<span style='font-weight: bold'>"+name+"</span>"+'":'):'')+"<span style='color: #1daf42' "+(errObj.title?('err="'+errObj.title+'"'):'')+">"+value+"</span>"+(isLast?'':',')+line+remark+(statusInfo?("<span style='color: green;'>(状态码:"+statusInfo.remark+")</span>"):""));
        };
    };
    var getStatus=function (raw,value,status) {
        if(!raw || !status || !raw.status)
        {
            return null;
        }
        var objStatus=null;
        status.forEach(function (obj) {
            if(obj.id==raw.status)
            {
                objStatus=obj;
            }
        })
        if(objStatus)
        {
            var remark="";
            objStatus.data.forEach(function (obj) {
                if(obj.key==value)
                {
                    remark=obj.remark;
                }
            })
            if(!remark)
            {
                return null
            }
            else
            {
                return {
                    id:objStatus.id,
                    remark:remark,
                    value:value
                }
            }
        }
        else
        {
            return null;
        }
    }
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
                    if(raw[i].name && raw[i].name.toLowerCase()==key.toLowerCase())
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
            if(!raw.data)
            {
                return null;
            }
            if(typeof(key)=="string")
            {
                for(var i=0;i<raw.data.length;i++)
                {
                    if(raw.data[i].name && raw.data[i].name.toLowerCase()==key.toLowerCase())
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
        var type=["String","Number","Boolean","Array","Object","Mixed"];
        if(!raw)
        {
            return "";
        }
        return "<span style='color: gray'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//类型："+type[raw.type]+"&nbsp;&nbsp;"+(raw.must?"必有字段":"可有字段")+"&nbsp;&nbsp;备注："+(raw.remark?raw.remark:"无")+"</span>";
    }
    var isLast=true,indent=0;
    notify('',data,isLast,indent,false,mix?result:null,1,1,status);
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
    return {
        draw:draw,
        error:errorCount
    };
}

helper.handleResultData=function (name,data,result,originObj,show) {
    name=typeof(name)=="string"?name:null;
    if(typeof(data)=="string")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:0,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:data):data,
            drag:1
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
            mock:originObj?(originObj.mock?originObj.mock:String(data)):String(data),
            drag:1
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
            mock:originObj?(originObj.mock?originObj.mock:String(data)):String(data),
            drag:1
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
            mock:"",
            drag:1
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
            mock:"",
            drag:1
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

helper.mock=function (data,info) {
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
            var val=str.length==3?"":str.substring(4,str.length-1),arr;
            if(val)
            {
                arr=val.split(",");
            }
            return "https://dummyimage.com/"+(arr?(arr[0]+"x"+arr[1]+"/"):"600x400/")+Math.round(Math.random()*999);
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
        else if(/^arr/i.test(str))
        {
            var val=$.trim(str.substring(4,str.length-1));
            if(val.length>0)
            {
                return val;
            }
            else
            {
                return "[]";
            }
        }
        else if(/^obj/i.test(str))
        {
            var val=$.trim(str.substring(4,str.length-1));
            if(val.length>0)
            {
                return val;
            }
            else
            {
                return "{}";
            }
        }
        else if(/^null/i.test(str))
        {
            return "null";
        }
        else if(/^code/i.test(str))
        {
            var val=$.trim(str.substring(5,str.length-1));
            if(info)
            {
                try
                {
                    return (function (param,query,header,body,global) {
                        return eval("("+val+")");
                    })(info.param,info.query,info.header,info.body,info.global)
                }
                catch (err)
                {
                    console.log("execute err:"+err);
                    return null;
                }
            }
            else
            {
                return null;
            }
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

helper.runBefore=function (code,url,path,method,query,header,body) {
    var Base64=BASE64.encoder,MD5=CryptoJS.MD5,SHA1=CryptoJS.SHA1,SHA256=CryptoJS.SHA256,SHA512=CryptoJS.SHA512,SHA3=CryptoJS.SHA3,RIPEMD160=CryptoJS.RIPEMD160,AES=CryptoJS.AES.encrypt,TripleDES=CryptoJS.TripleDES.encrypt,DES=CryptoJS.DES.encrypt,Rabbit=CryptoJS.Rabbit.encrypt,RC4=CryptoJS.RC4.encrypt,RC4Drop=CryptoJS.RC4Drop.encrypt;
    try
    {
        eval(code);
    }
    catch (err)
    {
        console.log("Before Error:"+err);
    }
}

helper.runAfter=function (code,status,header,data) {
    try
    {
        eval(code);
    }
    catch (err)
    {
        console.log("After Error:"+err);
    }
}

helper.handleValue=function (obj) {
    var value=obj.value;
    if(obj.selValue)
    {
        if(value)
        {
            if(value.type==0)
            {
                var v=obj.selValue,bFind=false;
                value.data.forEach(function (o) {
                    if(o.value==v)
                    {
                        bFind=true;
                    }
                })
                if(!bFind)
                {
                    value.data.push({
                        value:v,
                        remark:""
                    });
                }
            }
        }
        else
        {
            value={
                type:0,
                status:"",
                data:[{
                    value:obj.selValue,
                    remark:""
                }]
            }
        }
    }
    else
    {
        if(!value)
        {
            value={
                type:0,
                status:"",
                data:[]
            }
        }
    }
    return value;
}

helper.handleMockInfo=function (type,param,query,header,body,state) {
    var info={
        param:{},
        query:{},
        header:{},
        body:{},
        global:{}
    };
    param.forEach(function (obj) {
        if(obj.name)
        {
            if(type==0)
            {
                info.param[obj.name]="";
            }
            else
            {
                info.param[obj.name]=obj.selValue;
            }
        }
    })
    query.forEach(function (obj) {
        if(obj.name)
        {
            if(type==0)
            {
                info.query[obj.name]="";
            }
            else
            {
                info.query[obj.name]=obj.selValue;
            }
        }
    })
    header.forEach(function (obj) {
        if(obj.name)
        {
            info.header[obj.name]=obj.value;
        }
    })
    if(body && (body instanceof Array))
    {
        body.forEach(function (obj) {
            if(obj.name)
            {
                if(type==0)
                {
                    info.body[obj.name]="";
                }
                else
                {
                    info.body[obj.name]=obj.selValue;
                }
            }
        })
    }
    else
    {
        info.body=body;
    }
    if(state.interfaceEdit || state.interface)
    {
        info.global={
            name:type==0?state.interfaceEdit.name:state.interface.name,
            baseurl:type==0?"":state.baseurl,
            path:type==0?state.interfaceEdit.url:state.interface.url,
            method:type==0?state.interfaceEdit.method:state.interface.method
        }
    }
    else
    {
        info.global={};
    }
    return info;
}

helper.getSelection=function () {
    var node=document.getElementById("testContent");
    var oRange = window.getSelection().rangeCount>0?window.getSelection().getRangeAt(0):null;
    if(!oRange)
    {
        return null;
    }
    var ele=oRange.startContainer,bMatch=false;
    while(ele && ele.tagName!="body")
    {
        if(ele==node)
        {
            bMatch=true;
            break;
        }
        else
        {
            ele=ele.parentNode;
        }
    }
    if(!bMatch)
    {
        return null;
    }
    ele=oRange.endContainer,bMatch=false;
    while(ele && ele.tagName!="body")
    {
        if(ele==node)
        {
            bMatch=true;
            break;
        }
        else
        {
            ele=ele.parentNode;
        }
    }
    if(!bMatch)
    {
        return null;
    }
    return oRange;
}

helper.handleTestInterface=function (inter,data,status) {
    inter.url=data.url;
    inter.method=data.method;
    inter.finish=data.finish;
    inter.remark=data.remark;
    inter.before=data.before;
    inter.after=data.after;
    inter.updatedAt=data.updatedAt;
    data.restParam.forEach(function (item) {
        var obj;
        inter.restParam.forEach(function (item1) {
            if(item.name==item1.name)
            {
                obj=item1;
            }
        })
        if(obj)
        {
            for(var key in obj)
            {
                item[key]=obj[key];
            }
        }
        else
        {
            Vue.set(item,"selValue","");
            if(item.value && item.value.type==0 && item.value.data.length>0)
            {
                item.selValue=item.value.data[0].value;
            }
            else if(item.value && item.value.type==1 && item.value.status)
            {
                var objStatus=null;
                status.forEach(function (obj) {
                    if(obj.id==item.value.status)
                    {
                        objStatus=obj;
                    }
                })
                if(objStatus && objStatus.data.length>0)
                {
                    item.selValue=objStatus.data[0].key;
                }
                else
                {
                    item.selValue="";
                }
            }
            else
            {
                item.selValue="";
            }
        }
    });
    inter.restParam=data.restParam;
    data.queryParam.forEach(function (item) {
        var obj;
        inter.queryParam.forEach(function (item1) {
            if(item.name==item1.name)
            {
                obj=item1;
            }
        })
        if(obj)
        {
            for(var key in obj)
            {
                item[key]=obj[key];
            }
        }
        else
        {
            Vue.set(item,"enable",1);
            Vue.set(item,"selValue","");
            if(item.value && item.value.type==0 && item.value.data.length>0)
            {
                item.selValue=item.value.data[0].value;
            }
            else if(item.value && item.value.type==1 && item.value.status)
            {
                var objStatus=null;
                status.forEach(function (obj) {
                    if(obj.id==item.value.status)
                    {
                        objStatus=obj;
                    }
                })
                if(objStatus && objStatus.data.length>0)
                {
                    item.selValue=objStatus.data[0].key;
                }
                else
                {
                    item.selValue="";
                }
            }
            else
            {
                item.selValue="";
            }
        }
    });
    inter.queryParam=data.queryParam
    data.header.forEach(function (item) {
        var obj;
        inter.header.forEach(function (item1) {
            if(item.name==item1.name)
            {
                obj=item1;
            }
        })
        if(obj)
        {
            for(var key in obj)
            {
                item[key]=obj[key];
            }
        }
        else
        {
            Vue.set(item,"enable",1);
        }
    });
    inter.header=data.header;
    data.bodyParam.forEach(function (item) {
        var obj;
        inter.bodyParam.forEach(function (item1) {
            if(item.name==item1.name)
            {
                obj=item1;
            }
        })
        if(obj)
        {
            for(var key in obj)
            {
                item[key]=obj[key];
            }
        }
        else
        {
            Vue.set(item,"enable",1);
            Vue.set(item,"selValue","");
            if(item.value && item.value.type==0 && item.value.data.length>0)
            {
                item.selValue=item.value.data[0].value;
            }
            else if(item.value && item.value.type==1 && item.value.status)
            {
                var objStatus=null;
                status.forEach(function (obj) {
                    if(obj.id==item.value.status)
                    {
                        objStatus=obj;
                    }
                })
                if(objStatus && objStatus.data.length>0)
                {
                    item.selValue=objStatus.data[0].key;
                }
                else
                {
                    item.selValue="";
                }
            }
            else
            {
                item.selValue="";
            }
        }
    });
    inter.bodyParam=data.bodyParam;
    if(data.method=="GET" || data.method=="DELETE")
    {
        delete inter.bodyInfo;
    }
    else
    {
        if(!inter.bodyInfo)
        {
            inter.bodyInfo={};
        }
        if(data.bodyInfo.rawText===undefined)
        {
            Vue.set(data.bodyInfo,"rawText","");
        }
        if(data.bodyInfo.rawTextRemark===undefined)
        {
            Vue.set(data.bodyInfo,"rawTextRemark","");
        }
        if(data.bodyInfo.rawFileRemark===undefined)
        {
            Vue.set(data.bodyInfo,"rawFileRemark","");
        }
        if(data.bodyInfo.rawJSON==undefined)
        {
            Vue.set(data.bodyInfo,"rawJSON",[]);
        }
        var bFind=false;
        for(var i=0;i<data.header.length;i++)
        {
            var obj1=data.header[i];
            if(obj1.name.toLowerCase()=="content-type" && obj1.value.toLowerCase()=="application/json")
            {
                bFind=true;
                break;
            }
        }
        if(bFind && data.bodyInfo.rawText)
        {
            var obj;
            try
            {
                obj=JSON.parse(data.bodyInfo.rawText);
            }
            catch (e)
            {

            }
            if(obj)
            {
                var result=[];
                for(var key in obj)
                {
                    helper.handleResultData(key,obj[key],result,null,1)
                }
                data.bodyInfo.rawJSON=result;
                data.rawText="";
                data.rawType=2;
            }
        }
        for(var key in data.bodyInfo)
        {
            if(key!="rawJSON")
            {
                inter.bodyInfo[key]=data.bodyInfo[key];
            }
        }
        if(data.bodyInfo.type==1 && data.bodyInfo.rawType==2)
        {
            if(inter.bodyInfo.rawJSON)
            {
                mapJSON(inter.bodyInfo.rawJSON,data.bodyInfo.rawJSON)
                inter.bodyInfo.rawJSON=data.bodyInfo.rawJSON;
            }
            else
            {
                inter.bodyInfo.rawJSON=data.bodyInfo.rawJSON
            }
        }
    }
    function mapJSON(originData,data) {
        for (var i = 0; i < data.length; i++) {
            _mapJSON(originData, data[i]);
        }
    }
    function _mapJSON(originObj,obj) {
        var objFind;
        originObj.forEach(function (item) {
            if(item.type==obj.type && item.name==obj.name)
            {
                objFind=item;
            }
        })
        if(objFind)
        {
            if((obj.type==3 || obj.type==4))
            {
                for(var i=0;i<obj.data.length;i++)
                {
                    arguments.callee(objFind.data?objFind.data:[],obj.data[i])
                }
            }
            else
            {
                for(var key in objFind)
                {
                    obj[key]=objFind[key];
                }
            }
        }
    }
}

helper.runTest=async function (obj,baseUrl,global,test,root,opt) {
    root.output+="开始运行接口："+obj.name+"<br>"
    var name=obj.name
    var method=obj.method;
    var baseUrl=obj.baseUrl=="defaultUrl"?baseUrl:obj.baseUrl;
    if(!baseUrl)
    {
        root.output+="baseUrl为空，请设置baseUrl<br>"
        return {};
    }
    var path=obj.url;
    var indexHttp=baseUrl.indexOf("://"),indexSlash;
    if(indexHttp==-1)
    {
        indexSlash=baseUrl.indexOf("/")
    }
    else
    {
        indexSlash=baseUrl.indexOf("/",indexHttp+3);
    }
    if(indexSlash>-1)
    {
        var baseUrlTemp=baseUrl.substring(0,indexSlash);
        var pathTemp=baseUrl.substr(indexSlash);
        if(pathTemp[pathTemp.length-1]=="/" && path[0]=="/")
        {
            pathTemp=pathTemp.substr(0,pathTemp.length-1);
        }
        else if(pathTemp[pathTemp.length-1]!="/" && path[0]!="/" && pathTemp.indexOf("?")==-1 && pathTemp.indexOf("#")==-1)
        {
            pathTemp+="/"
        }
        baseUrl=baseUrlTemp;
        path=pathTemp+path;
    }
    else
    {
        if(path[0]!="/")
        {
            path="/"+path;
        }
    }
    var objParam=$.clone(obj.restParam);
    if(opt && opt.param)
    {
        var arr=[];
        for(var key in opt.param)
        {
            var val=opt.param[key];
            var objItem;
            objParam.forEach(function (obj) {
                if(obj.name==key)
                {
                    objItem=obj;
                }
            })
            if(objItem)
            {
                objItem.selValue=val;
            }
            else
            {
                arr.push({
                    name:key,
                    remark:"",
                    selValue:val
                })
            }
        }
        objParam=objParam.concat(arr);
    }
    objParam.forEach(function (obj) {
        if(obj.name)
        {
            path=path.replace("{"+obj.name+"}",obj.selValue)
        }
    })
    var query={};
    obj.queryParam.forEach(function (obj) {
        if(!obj.name || !obj.enable)
        {
            return;
        }
        if(obj.encrypt && obj.encrypt.type)
        {
            var value=helper.encrypt(obj.encrypt.type,obj.selValue,obj.encrypt.salt);
            var key=obj.name;
            if(obj.encrypt.key)
            {
                key=helper.encrypt(obj.encrypt.type,key,obj.encrypt.salt);
            }
            query[key]=value;
        }
        else
        {
            query[obj.name]=obj.selValue;
        }
    })
    if(opt && opt.query)
    {
        Object.assign(query,opt.query);
    }
    var header={},arrHeaders=["host","connection","origin","referer","user-agent"],objHeaders={};
    obj.header.forEach(function (obj) {
        if(!obj.name || !obj.enable)
        {
            return;
        }
        if(obj.encrypt && obj.encrypt.type)
        {
            var value=helper.encrypt(obj.encrypt.type,obj.value,obj.encrypt.salt);
            var key=obj.name;
            if($.inArr(key,arrHeaders))
            {
                objHeaders[key]=value;
            }
            else
            {
                header[key]=value;
            }

        }
        else
        {
            if($.inArr(obj.name,arrHeaders))
            {
                objHeaders[obj.name]=obj.value;
            }
            else
            {
                header[obj.name]=obj.value;
            }

        }
    })
    if(opt && opt.header)
    {
        Object.assign(header,opt.header);
    }
    var body={},bUpload=false;
    if(method=="POST" || method=="PUT")
    {
        if(obj.bodyInfo.type==0)
        {
            for(var i=0;i<obj.bodyParam.length;i++)
            {
                var obj1=obj.bodyParam[i];
                if(!obj1.name || !obj1.enable)
                {
                    return;
                }
                if(obj1.type==0)
                {
                    if(obj1.encrypt && obj1.encrypt.type)
                    {
                        var value=helper.encrypt(obj1.encrypt.type,obj1.selValue,obj1.encrypt.salt);
                        var key=obj1.name;
                        if(obj1.encrypt.key)
                        {
                            key=helper.encrypt(obj1.encrypt.type,key,obj1.encrypt.salt);
                        }
                        body[key]=value;
                    }
                    else
                    {
                        body[obj1.name]=obj1.selValue;
                    }
                }
                else if(obj1.type==1)
                {
                    var startDate=new Date();
                    var file=await (new Promise(function (resolve,reject) {
                        var child=$.showBox(window.vueObj,"testUploadFile",{
                            name:name,
                            url:path,
                            keyName:obj1.name,
                            remark:obj1.remark
                        });
                        child.$on("save",function (obj) {
                            resolve(obj);
                        })
                    }))
                    if(file.files.length>0)
                    {
                        body[obj1.name]=file.files[0];
                        bUpload=true;
                    }
                    else
                    {
                        body[obj1.name]="";
                    }
                }
            }
            if(opt && opt.body)
            {
                Object.assign(body,opt.body);
            }
        }
        else
        {
            if(obj.bodyInfo.rawType==0)
            {
                var encryptType=obj.encrypt.type;
                if(encryptType)
                {
                    body=helper.encrypt(encryptType,obj.bodyInfo.rawText,obj.encrypt.salt)
                }
                else
                {
                    body=obj.bodyInfo.rawText;
                }
                if(opt && opt.body!==undefined)
                {
                    body=opt.body;
                }
            }
            else if(obj.bodyInfo.rawType==2)
            {
                var obj1={};
                var result=helper.resultSave(obj.bodyInfo.rawJSON);
                helper.convertToJSON(result,obj1);
                body=obj1;
                if(opt && opt.body)
                {
                    for(var key in opt.body)
                    {
                        var val=opt.body[key];
                        var arr=key.split(".");
                        if(arr.length>1)
                        {
                            var obj1=body;
                            for(var i=0;i<arr.length;i++)
                            {
                                var key1=arr[i];
                                if(i!=arr.length-1)
                                {
                                    if(obj1[key1]!==undefined)
                                    {
                                        obj1=obj1[key1];
                                    }
                                    else
                                    {
                                        obj1=obj1[key1]={};
                                    }
                                }
                                else
                                {
                                    obj1[key1]=val;
                                }
                            }
                        }
                        else
                        {
                            body[key]=val;
                        }
                    }
                }
            }
            else
            {
                var startDate=new Date();
                var file=await (new Promise(function (resolve,reject) {
                    var child=$.showBox(window.vueObj,"testUploadFile",{
                        name:name,
                        url:path,
                        keyName:obj.name,
                        remark:obj.remark
                    });
                    child.$on("save",function (obj) {
                        if(obj.files.length==0)
                        {
                            resolve("");
                            return;
                        }
                        var file=obj.files[0];
                        var read=new FileReader();
                        var loading;
                        read.onloadstart=function () {
                            loading=window.vueObj.$loading({fullscreen:true});
                        }
                        read.onload=function () {
                            loading.close();
                            resolve(read.result);
                        }
                        read.onerror=function () {
                            loading.close();
                            reject({
                                code:0,
                                msg:"文件读取错误"
                            })
                        }
                        read.readAsArrayBuffer(file);
                    })
                }))
                body=file;
            }
        }
    }
    if(obj.before.mode==0)
    {
        if(global.before)
        {
            helper.runBefore(global.before,baseUrl,path,method,query,header,body)
        }
        helper.runBefore(obj.before.code,baseUrl,path,method,query,header,body)
    }
    else
    {
        helper.runBefore(obj.before.code,baseUrl,path,method,query,header,body)
    }
    if((method=="POST" || method=="PUT") && obj.bodyInfo.type==1 && obj.bodyInfo.rawType==2)
    {
        body=JSON.stringify(body);
    }
    query=$.param(query);
    if(query.length>0)
    {
        path=path+"?"+query;
    }
    header["__url"]=baseUrl;
    header["__path"]=path;
    header["__method"]=method;
    header["__user"]=session.get("id");
    header["__headers"]=JSON.stringify(objHeaders);
    var proxyUrl="/proxy";
    var bNet=false;
    if(/10\./i.test(baseUrl) || /192\.168\./i.test(baseUrl) || /127\.0\.0\.1/i.test(baseUrl) || /172\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)\./.test(baseUrl) || /localhost/i.test(baseUrl))
    {
        bNet=true;
        proxyUrl="http://127.0.0.1:36742";
    }
    var startDate=new Date();
    var bContent=false,contentKey;
    for(var key in header)
    {
        if(key.toLowerCase()=="content-type")
        {
            bContent=true;
            contentKey=key;
            if(/multipart\/form-data/i.test(header[contentKey]))
            {
                bUpload=true;
            }
            break
        }
    }
    var func;
    if(bUpload || (obj.bodyInfo && obj.bodyInfo.type==1))
    {
        if(bContent && obj.bodyInfo.type==0)
        {
            delete header[contentKey];
        }
        func=net.upload("POST",proxyUrl,body,header,null,1,bNet)
    }
    else
    {
        func=net.post(proxyUrl,body,header,null,1,bNet)
    }
    return func.then(function (result) {
        var res={}
        res.header=result.header;
        res.status=String(result.status);
        res.second=(((new Date())-startDate)/1000).toFixed(3);
        res.type=typeof (result.data);
        res.data=result.data;
        if(obj.after.mode==0)
        {
            if(global.after)
            {
                helper.runBefore(global.after,baseUrl,path,method,query,header,body)
            }
            helper.runBefore(obj.after.code,baseUrl,path,method,query,header,body)
        }
        else
        {
            helper.runBefore(obj.after.code,baseUrl,path,method,query,header,body)
        }
        root.output+="结束运行接口："+obj.name+"(耗时：<span style='color: green'>"+res.second+"秒</span>)<br>"
        return res;
    })
}

helper.runTestCode=async function (code,test,global,opt,root) {
    var Base64=BASE64.encoder,MD5=CryptoJS.MD5,SHA1=CryptoJS.SHA1,SHA256=CryptoJS.SHA256,SHA512=CryptoJS.SHA512,SHA3=CryptoJS.SHA3,RIPEMD160=CryptoJS.RIPEMD160,AES=CryptoJS.AES.encrypt,TripleDES=CryptoJS.TripleDES.encrypt,DES=CryptoJS.DES.encrypt,Rabbit=CryptoJS.Rabbit.encrypt,RC4=CryptoJS.RC4.encrypt,RC4Drop=CryptoJS.RC4Drop.encrypt;
    if(!global)
    {
        global={};
    }
    function log(text) {
        root.output+=text+"<br>";
    }
    var ele=document.createElement("div");
    ele.innerHTML=code;
    var arr=ele.getElementsByTagName("a");
    var arrNode=[];
    for(var i=0;i<arr.length;i++)
    {
        var obj=arr[i].getAttribute("data");
        var type=arr[i].getAttribute("type");
        var text;
        if(type=="1")
        {
            text="function (opt) {return helper.runTest("+obj+",'"+opt.baseUrl+"',"+"{before:'"+opt.before+"',after:'"+opt.after+"'}"+",test,root,opt)}"
        }
        else if(type=="2")
        {
            var testObj;
            try
            {
                testObj=await net.get("/test/info",{
                id:obj
            }).then(function (data) {
                if(data.code==200)
                {
                    return data.data
                }
                else
                {
                    $.notify(data.msg,0);
                    throw "error";
                }
            })
            }
            catch (err)
            {
                return;
            }
            text="function () {return helper.runTestCode('"+testObj.code.replace(/\\\&quot\;/g,"\\\\&quot;")+"',"+JSON.stringify(testObj)+",global,"+JSON.stringify(opt)+",root)}"
        }
        else
        {
            continue;
        }
        var node=document.createTextNode(text);
        arrNode.push({
            oldNode:arr[i],
            newNode:node
        });
    }
    arrNode.forEach(function (obj) {
        obj.oldNode.parentNode.replaceChild(obj.newNode,obj.oldNode);
    })
    root.output+="<br><div style='background-color: #ececec'>开始执行用例："+test.name+"<br>";
    var ret=eval("(async function () {"+ele.innerText+"})()").then(function (ret) {
        if(ret===undefined)
        {
            test.status=0;
            root.output+="用例执行结束："+test.name+"(未判定)";
        }
        else if(Boolean(ret)==true)
        {
            test.status=1;
            root.output+="用例执行结束："+test.name+"(<span style='color:green'>已通过</span>)";
        }
        else
        {
            test.status=2;
            root.output+="用例执行结束："+test.name+"(<span style='color:red'>未通过</span>)";
        }
        root.output+="</div><br>"
        return ret;
    });
    return ret;
}

module.exports=helper;












