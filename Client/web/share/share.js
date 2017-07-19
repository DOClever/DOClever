/**
 * Created by sunxin on 2017/5/26.
 */
if(location.hash.length<=1)
{
    alert("分享链接不正确");
    window.close();
}
var id=location.hash.substr(1);
var vue=new Vue({
    el: "#app",
    data: {
        interface:{},
        query:[{
            name:"",
            must:0,
            remark:""
        }],
        header:[{
            name:"",
            value:"",
            remark:""
        }],
        body:[{
            name:"",
            type:0,
            must:0,
            remark:"",
        }],
        param:[
        ],
        bodyInfo:{
            type:0,
            rawType:0,
            rawTextRemark:"",
            rawFileRemark:"",
            rawText:"",
            rawJSON:[{
                name:"",
                must:1,
                type:0,
                remark:"",
                show:1,
                mock:"",
                drag:1
            }]
        },
        outInfo:{
            type:0,
            rawRemark:"",
            rawMock:"",
            jsonType:0
        },
        result:[],
        resultObject:[
            {
                name:"",
                must:0,
                type:0,
                remark:"",
                show:0,
                mock:"",
                drag:1
            }
        ],
        resultArray:[
            {
                name:null,
                must:0,
                type:0,
                remark:"",
                show:0,
                mock:"",
                drag:1
            }
        ],
        drawMix:[],
    },
    computed:{
        querySave:function () {
            return this.query.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            })
        },
        headerSave:function () {
            return this.header.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            });
        },
        bodySave:function () {
            return this.body.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            })
        },
        queryCount:function () {
            return this.querySave.length
        },
        headerCount:function () {
            return this.headerSave.length
        },
        bodyCount:function () {
            return this.bodySave.length
        },
        paramCount:function () {
            return this.param.length;
        },
        rawMock:function () {
            var bJSON=false,obj={};
            if(this.bodyInfo.type==1 && this.bodyInfo.rawType==2 && this.bodyInfo.rawJSON)
            {
                obj=this.bodyInfo.rawJSONType==0?{}:[];
                bJSON=true;
                var result=helper.resultSave(this.bodyInfo.rawJSON);
                helper.convertToJSON(result,obj);
            }
            var info=helper.handleMockInfo(0,this.param,this.query,this.header,bJSON?obj:this.body,this);
            return helper.mock(this.outInfo.rawMock,info);
        },
        rawJSON:function () {
            var obj=this.bodyInfo.rawJSONType==0?{}:[];
            var result=helper.resultSave(this.bodyInfo.rawJSON);
            helper.convertToJSON(result,obj);
            return helper.format(JSON.stringify(obj),1,result,this.status).draw;
        },
        paramTab:function () {
            return "Param ("+this.paramCount+")";
        },
        queryTab:function () {
            return "Query ("+this.queryCount+")";
        },
        headerTab:function () {
            return "Header ("+this.headerCount+")";
        },
        bodyTab:function () {
            return "Body ("+(this.bodyInfo.type==0?this.bodyCount:"Raw")+")";
        },
        editInfo:function () {
            return this.interface?(this.interface.createdAt?((this.interface.owner?this.interface.owner.name:"")+"在"+this.interface.createdAt+"创建，最近修改被"+(this.interface.editor?this.interface.editor.name:"")+"在"+this.interface.updatedAt+"改动"):"接口尚未保存"):"";
        },
    },
    methods:{
        showInfo:function (data) {
            this.interface=data;
            if(this.interface.queryParam.length>0)
            {
                var obj=this.query[0];
                this.query=this.interface.queryParam;
                this.query.forEach(function (item) {
                    if(item.value && typeof(item.value)=="object" && (item.value instanceof Array))
                    {
                        item.value={
                            type:0,
                            status:"",
                            data:item.value.map(function (obj) {
                                return {
                                    value:obj,
                                    remark:""
                                }
                            })
                        }
                    }
                })
                this.query.push(obj);
            }
            else
            {
                this.interface.queryParam=this.query;
            }
            if(this.interface.bodyParam.length>0)
            {
                var obj=this.body[0];
                this.body=this.interface.bodyParam;
                this.body.forEach(function (item) {
                    if(item.value && typeof(item.value)=="object" && (item.value instanceof Array))
                    {
                        item.value={
                            type:0,
                            status:"",
                            data:item.value.map(function (obj) {
                                return {
                                    value:obj,
                                    remark:""
                                }
                            })
                        }
                    }
                })
                this.body.push(obj);
            }
            else
            {
                this.interface.bodyParam=this.body;
            }
            if(this.interface.header.length>0)
            {
                var obj=this.header[0];
                this.header=this.interface.header;
                this.header.push(obj);
            }
            else
            {
                this.interface.header=this.header;
            }
            if(this.interface.outParam.length>0)
            {
                helper.initResultShow(this.interface.outParam);
                this.result=this.interface.outParam;
            }
            else
            {
                this.interface.outParam=this.result;
            }
            if(this.interface.restParam.length>0)
            {
                this.param=this.interface.restParam;
                this.param.forEach(function (item) {
                    if(item.value && typeof(item.value)=="object" && (item.value instanceof Array))
                    {
                        item.value={
                            type:0,
                            status:"",
                            data:item.value.map(function (obj) {
                                return {
                                    value:obj,
                                    remark:""
                                }
                            })
                        }
                    }
                })
            }
            else
            {
                this.interface.restParam=this.param;
            }
            if(this.interface.bodyInfo)
            {
                this.bodyInfo=this.interface.bodyInfo;
                if(this.bodyInfo.rawText===undefined)
                {
                    Vue.set(this.bodyInfo,"rawText","");
                }
                if(this.bodyInfo.rawTextRemark===undefined)
                {
                    Vue.set(this.bodyInfo,"rawTextRemark","");
                }
                if(this.bodyInfo.rawFileRemark===undefined)
                {
                    Vue.set(this.bodyInfo,"rawFileRemark","");
                }
                if(this.bodyInfo.rawJSON==undefined)
                {
                    Vue.set(this.bodyInfo,"rawJSON",[{
                        name:"",
                        must:1,
                        type:0,
                        remark:"",
                        show:1,
                        mock:"",
                        drag:1
                    }]);
                }
                else
                {
                    helper.initResultShow(this.bodyInfo.rawJSON);
                }
                var bFind=false;
                for(var i=0;i<this.header.length;i++)
                {
                    var obj=this.header[i];
                    if(obj.name.toLowerCase()=="content-type" && obj.value.toLowerCase()=="application/json")
                    {
                        bFind=true;
                        break;
                    }
                }
                if(bFind && this.bodyInfo.rawText)
                {
                    var obj;
                    try
                    {
                        obj=JSON.parse(this.bodyInfo.rawText);
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
                        this.bodyInfo.rawJSON=result;
                        this.bodyInfo.rawText="";
                        this.bodyInfo.rawType=2;
                    }
                }
            }
            else
            {
                this.interface.bodyInfo=this.bodyInfo;
            }
            if(this.interface.outInfo)
            {
                this.outInfo=this.interface.outInfo;
                if(this.outInfo.jsonType===undefined)
                {
                    Vue.set(this.outInfo,"jsonType",0);
                }
                else if(this.outInfo.jsonType==0)
                {
                    this.resultObject=this.result;
                }
                else
                {
                    this.resultArray=this.result;
                }
            }
            else
            {
                this.interface.outInfo=this.outInfo;
            }
            if(!this.interface.before)
            {
                Vue.set(this.interface,"before",{
                    mode:0,
                    code:""
                })
            }
            else
            {
                if(typeof(this.interface.before)=="string")
                {
                    this.interface.before={
                        mode:0,
                        code:this.interface.before
                    }
                }
            }
            if(!this.interface.after)
            {
                Vue.set(this.interface,"after",{
                    mode:0,
                    code:""
                })
            }
            else
            {
                if(typeof(this.interface.after)=="string")
                {
                    this.interface.after={
                        mode:0,
                        code:this.interface.after
                    }
                }
            }
            var obj=this.outInfo.jsonType==1?[]:{};
            var result=helper.resultSave(this.result);
            var bJSON=false,objJSON={};
            if(this.bodyInfo.type==1 && this.bodyInfo.rawType==2 && this.bodyInfo.rawJSON)
            {
                objJSON=this.bodyInfo.rawJSONType==0?{}:[];
                bJSON=true;
                var result1=helper.resultSave(this.bodyInfo.rawJSON);
                helper.convertToJSON(result1,objJSON);
            }
            var info=helper.handleMockInfo(0,this.param,this.query,this.header,bJSON?objJSON:this.body);
            helper.convertToJSON(result,obj,info);
            this.drawMix=helper.format(JSON.stringify(obj),1,result,this.status).draw;
        },
        methodColor:function (val) {
            return helper.methodColor(val);
        },
    },
    created:function () {
        var _this=this;
        net.get("/interface/share",{
            id:id,
        }).then(function (data) {
            if(data.code==200)
            {
                $.stopLoading();
                _this.showInfo(data.data);
            }
            else
            {
                alert("接口不存在!");
                window.close();
            }
        })
    }
})
$.ready(function () {
    $.startLoading();
})