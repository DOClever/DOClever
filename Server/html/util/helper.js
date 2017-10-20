/**
 * Created by sunxin on 2017/2/22.
 */
var mockjs=require("mockjs");
var helper={};
helper.methodColor=function (m) {
    if(m==1)
    {
        return "rgb(19,206,106)"
    }
    else if(m==2)
    {
        return "gray"
    }
    else
    {
        return "#50bfff";
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

helper.convertToJSON=function (data,obj,info,run) {
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
                    return run?"":"mock"
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
                    return run?null:1
                }
            }
            else if(data.type==2)
            {
                if(data.mock)
                {
                    return Boolean(eval($.trim(data.mock)))
                }
                else
                {
                    return run?null:true
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
                    return run?null:"mixed"
                }
            }
        }
        else
        {
            if(run)
            {
                return data.mock;
            }
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
                    return Boolean(eval(temp));
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
                            return Boolean(eval(ret));
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
            else if(/^mj/i.test(str))
            {
                var val=$.trim(str.substring(3,str.length-1));
                if(val[0]=="@")
                {
                    return mockjs.mock(val);
                }
                else
                {
                    var obj=eval("("+val+")");
                    if(typeof(obj)=="object")
                    {
                        var objNew={};
                        for(var key in obj)
                        {
                            objNew["mock|"+key]=obj[key];
                        }
                        var ret=mockjs.mock(objNew);
                        for(var key in ret)
                        {
                            return ret[key];
                        }

                    }
                    else
                    {
                        return val;
                    }
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

helper.handleResultData=function (name,data,result,originObj,show,bArr) {
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
            if(bArr)
            {
                for(var i=0;i<data.length;i++)
                {
                    var resultObj=originObj?((originObj.data && originObj.data.length>0)?originObj.data[i]:null):null;
                    arguments.callee(null,data[i],obj.data,resultObj,show,input)
                }
            }
            else
            {
                var resultObj=originObj?((originObj.data && originObj.data.length>0)?originObj.data[0]:null):null;
                arguments.callee(null,data[0],obj.data,resultObj,show,input)
            }
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
        else if(/^mj/i.test(str))
        {
            var val=$.trim(str.substring(3,str.length-1));
            if(val[0]=="@")
            {
                return mockjs.mock(val);
            }
            else
            {
                var obj=eval("("+val+")");
                if(typeof(obj)=="object")
                {
                    var objNew={};
                    for(var key in obj)
                    {
                        objNew["mock|"+key]=obj[key];
                    }
                    var ret=mockjs.mock(objNew);
                    for(var key in ret)
                    {
                        return ret[key];
                    }

                }
                else
                {
                    return val;
                }
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



module.exports=helper;












