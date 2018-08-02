<template>
    <el-dialog title="编辑模板"  width="80%" ref="box" id="templateEdit" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="margin-top: 5px;overflow-y: auto;background-color: rgb(244,241,244)">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)">
                <el-row class="row" style="height:40px;line-height: 40px;padding-left: 10px;font-size: 14px;color: #17B9E6">
                    基本信息
                </el-row>
                <el-row class="row" style="height: 1px;background-color: lightgray"></el-row>
                <el-form label-position="top" label-width="80px" style="padding: 10px 100px 20px 10px" id="templateBasicInfo">
                    <el-row class="row">
                        <el-col class="col" :span="12">
                            <el-form-item label="名称">
                                <el-input style="width: 90%" size="small" v-model="interfaceEdit.name" placeholder="请输入接口名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="col" :span="12">
                            <el-form-item label="简介">
                                <el-tooltip class="item" effect="dark" :content="interfaceEdit.remark" placement="bottom" :disabled="!interfaceEdit.remark">
                                    <el-input style="width: 90%" size="small" v-model="interfaceEdit.remark">
                                        <i slot="suffix" class="el-input__icon el-icon-edit" @click="editRemark" style="cursor: pointer"></i>
                                    </el-input>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="row">
                        <el-form-item label="路径">
                            <el-select style="width: 20%;text-align: center" v-model="interfaceEdit.method" @input="changeMethod" size="small">
                                <el-option  value="GET"></el-option>
                                <el-option  value="POST"></el-option>
                                <el-option  value="PUT"></el-option>
                                <el-option  value="DELETE"></el-option>
                                <el-option  value="PATCH"></el-option>
                            </el-select>
                            <el-input size="small" style="width: calc(75% - 14px);margin-left: 10px" placeholder="请输入接口路径(不包含BaseUrl)" v-model.trim="interfaceEdit.url" @input="changeUrl" @paste.native="paste"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-tabs type="border-card" editable @edit="editTab" style="background-color: white;padding: 0px;margin-top: 15px;border-radius: 5px;" id="templateParam" v-model="tabIndex">
                <template v-for="(item, index) in param">
                    <el-tab-pane :key="item.id" :name="index">
                    <span slot="label">
                        <el-tooltip class="item" effect="dark" placement="bottom" width="200" :content="item.remark" v-if="item.remark">
                            <span>{{item.name}}</span>
                        </el-tooltip>
                        <span v-else>{{item.name}}</span>&nbsp
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <i class="el-icon-caret-bottom" style="color:rgb(80, 191, 255) ;"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="editParam(item)">编辑</el-dropdown-item>
                                <el-dropdown-item @click.native="cloneParam(item)">克隆</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                        <interfaceparam :index="index" :item="item" :source="interfaceEdit"></interfaceparam>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" size="small" :loading="savePending" v-if="globalTemplateRole">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>
    #templateBasicInfo .el-form-item__label {
        padding-bottom: 0px;
        height: 30px;
    }
    #templateBasicInfo .el-form-item {
        margin-bottom: 0;
    }
    #templateParam .el-tabs__new-tab
    {
        color: rgb(80, 191, 255);
        border: 1px rgb(80, 191, 255) solid;
        margin-right: 5px;
    }
    #templateParam .el-tabs__nav-wrap
    {
        border-radius: 5px;
    }
    #templateParam .el-tabs__header {
        border-radius: 5px;
    }
    #templateParam .el-tabs__nav-scroll {
        padding-left: 0px;
        padding-right: 0px;
    }
    #templateParam.el-tabs--border-card {
        border: none
    }
    #templateParam .el-tabs__content {
        padding: 0 5px 20px 10px;
    }
    #templateEdit .el-dialog__body {
        background-color: rgb(244,241,244);
    }
</style>

<script>
    var interfaceParam=require("../../interface/component/interfaceParam.vue");
    var uuid=require("uuid");
    module.exports = {
        props:["source"],
        data: function () {
            return {
                showDialog:false,
                savePending:false,
                interfaceEdit:this.source?this.source:{
                    "name": "",
                    "url": "",
                    "remark": "",
                    "method": "GET",
                    param:[
                        {
                            name:"参数",
                            remark:"",
                            id:uuid(),
                            "outParam": [{
                                name:"",
                                must:0,
                                type:0,
                                remark:"",
                                show:0,
                                mock:"",
                                drag:1
                            }],
                            "bodyParam": [],
                            "queryParam": [],
                            "header": [],
                            "bodyInfo":{
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
                                }],
                                rawJSONType:0
                            },
                            outInfo:{
                                type:0,
                                rawRemark:"",
                                rawMock:"",
                                jsonType:0
                            },
                            restParam:[],
                            before:{
                                mode:0,
                                code:""
                            },
                            after:{
                                mode:0,
                                code:""
                            }
                        }
                    ],
                },
                tabIndex:0,
                param:[{
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
                }],
            }
        },
        components:{
            "interfaceparam":interfaceParam
        },
        watch:{
            "interfaceEdit.url":function (val) {
                if(/http\:\/\/|https\:\/\//i.test(val))
                {
                    $.tip("请不要在路径里面包含baseUrl",0);
                }
            },
        },
        computed:{
            globalTemplateRole:function () {
                return this.$store.getters.globalTemplateRole;
            },
            curParam:function () {
                return  this.param[this.tabIndex];
            },
            paramSave:function () {
                return this.curParam.param;
            },
            querySave:function () {
                return this.curParam.query.filter(function (obj) {
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
                return this.curParam.header.filter(function (obj) {
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
                return this.curParam.body.filter(function (obj) {
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
                return this.paramSave.length;
            },
            rawMock:function () {
                var bJSON=false,obj={};
                if(this.curParam.bodyInfo.type==1 && this.curParam.bodyInfo.rawType==2 && this.curParam.bodyInfo.rawJSON)
                {
                    obj=this.curParam.bodyInfo.rawJSONType==0?{}:[];
                    bJSON=true;
                    var result=helper.resultSave(this.curParam.bodyInfo.rawJSON);
                    helper.convertToJSON(result,obj);
                }
                var info=helper.handleMockInfo(0,this.curParam.param,this.curParam.query,this.curParam.header,bJSON?obj:this.curParam.body,this);
                return helper.mock(this.curParam.outInfo.rawMock,info);
            },
            rawJSON:function () {
                var obj=this.curParam.bodyInfo.rawJSONType==0?{}:[];
                var result=helper.resultSave(this.curParam.bodyInfo.rawJSON);
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
            bodyInfo:function () {
                return this.curParam.bodyInfo;
            },
            outInfo:function () {
                return this.curParam.outInfo;
            },
        },
        methods: {
            changeMethod:function () {
                this.$store.commit("changeMethod");
            },
            save:function () {
                if(!this.interfaceEdit.name)
                {
                    $.tip("请填入模板名称",0);
                    return;
                }
                this.savePending=true;
                var _this=this;
                var obj={
                    name:this.interfaceEdit.name,
                    url:this.interfaceEdit.url,
                    remark:this.interfaceEdit.remark,
                    project:session.get("projectId"),
                    method:this.interfaceEdit.method,
                    param:[]
                }
                if(this.interfaceEdit._id)
                {
                    obj.id=this.interfaceEdit._id;
                }
                var originIndex=this.tabIndex;
                for(var index=0;index<this.param.length;index++)
                {
                    this.tabIndex=index;
                    var obj1={
                        before:this.param[index].before,
                        after:this.param[index].after,
                        name:this.param[index].name,
                        id:this.param[index].id,
                        remark:this.param[index].remark,
                    }
                    obj1.header=this.headerSave;
                    obj1.queryParam=this.querySave;
                    if(this.interfaceEdit.method=="POST" || this.interfaceEdit.method=="PUT" || this.interfaceEdit.method=="PATCH")
                    {
                        if(this.bodyInfo.type==0)
                        {
                            obj1.bodyParam=this.bodySave;
                        }
                        else
                        {
                            obj1.bodyParam=[];
                        }
                        var bodyInfo=$.clone(this.bodyInfo);
                        if(bodyInfo.type==1)
                        {
                            if(bodyInfo.rawType==0)
                            {
                                bodyInfo.rawFileRemark="";
                                delete bodyInfo.rawJSON;
                                delete bodyInfo.rawJSONType;
                            }
                            else if(bodyInfo.rawType==1)
                            {
                                bodyInfo.rawText="";
                                bodyInfo.rawTextRemark="";
                                delete bodyInfo.rawJSON;
                                delete bodyInfo.rawJSONType;
                            }
                            else
                            {
                                bodyInfo.rawFileRemark="";
                                bodyInfo.rawText="";
                                bodyInfo.rawTextRemark="";
                            }
                        }
                        else
                        {
                            bodyInfo.rawType=0;
                            bodyInfo.rawFileRemark="";
                            bodyInfo.rawText="";
                            bodyInfo.rawTextRemark="";
                            delete bodyInfo.rawJSON;
                            delete bodyInfo.rawJSONType;
                        }
                        obj1.bodyInfo=bodyInfo
                    }
                    if(this.outInfo.type==0)
                    {
                        obj1.outParam=helper.resultSave(this.param[this.tabIndex].result);
                        var outInfo=$.clone(this.outInfo);
                        outInfo.rawRemark="";
                        outInfo.rawMock="";
                        obj1.outInfo=outInfo
                    }
                    else
                    {
                        obj1.outParam=[];
                        obj1.outInfo=this.outInfo
                    }
                    obj1.restParam=this.param[this.tabIndex].param;
                    obj.param.push(obj1);
                }
                obj.param=JSON.stringify(obj.param);
                this.tabIndex=originIndex;
                net.post("/template/item",obj).then(function (data) {
                    if(data.code==200)
                    {
                        $.tip("修改成功",1);
                        _this.$emit("save",data.data);
                        _this.showDialog=false;
                    }
                    else
                    {
                        $.tip(data.msg,0)
                    }
                })
            },
            changeUrl:function (val) {
                var _this=this;
                if(val)
                {
                    var arrParam=[];
                    var arr=val.match(/\{([^\s|\}|\{]+?)\}(?!\})/g);
                    if(arr)
                    {
                        for(var i=0;i<arr.length;i++)
                        {
                            var str=arr[i].substr(1,arr[i].length-2);
                            var bFind=false;
                            for(var j=0;j<this.param[this.tabIndex].param.length;j++)
                            {
                                if(str==this.param[this.tabIndex].param[j].name)
                                {
                                    bFind=true;
                                    arrParam.push(this.param[this.tabIndex].param[j]);
                                    break;
                                }
                            }
                            if(!bFind)
                            {
                                arrParam.push({
                                    name:str,
                                    remark:"",
                                    value:{
                                        type:0,
                                        status:"",
                                        data:[]
                                    }
                                })
                            }
                        }
                    }
                    this.param.forEach(function (obj,index) {
                        obj.param=arrParam;
                        _this.interfaceEdit.param[index].restParam=obj.param;
                    })
                }
            },
            paste:function () {
                var _this=this;
                setTimeout(function () {
                    var path=_this.interfaceEdit.url;
                    var bMark=false;
                    var index=path.indexOf("?");
                    if(index>-1)
                    {
                        bMark=true;
                        _this.interfaceEdit.url=_this.interfaceEdit.url.substring(0,index);
                    }
                    else
                    {
                        return;
                    }
                    for(var i=0;i<_this.param.length;i++)
                    {
                        var arrStoreQuery=_this.param[i].query;
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
                        _this.param[i].queryParam=arrStoreQuery;
                    }
                },100)
            },
            editTab:function (target,action) {
                if(action=="add")
                {
                    var obj;
                    obj={
                        name:"参数",
                        remark:"",
                        id:uuid(),
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
                            rawJSON:[],
                            rawJSONType:0
                        },
                        rawJSONObject:[{
                            name:"",
                            must:1,
                            type:0,
                            remark:"",
                            show:1,
                            mock:"",
                            drag:1
                        }],
                        rawJSONArray:[{
                            name:null,
                            must:1,
                            type:0,
                            remark:"",
                            show:1,
                            mock:"",
                            drag:1
                        }],
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
                        before:{
                            mode:0,
                            code:""
                        },
                        after:{
                            mode:0,
                            code:""
                        }
                    };
                    obj.bodyInfo.rawJSON=obj.rawJSONObject;
                    obj.result=obj.resultObject;
                    this.param.push(obj);
                    this.tabIndex=this.param.length-1;
                }
                else if(action=="remove")
                {
                    var _this=this;
                    if(this.param.length==1)
                    {
                        $.tip("至少有一个tab",0);
                    }
                    else
                    {
                        $.confirm("是否删除该Tab",function () {
                            _this.param.splice(target,1);
                            _this.tabIndex=0;
                        })
                    }
                }
            },
            editParam:function (item) {
                var _this=this;
                $.inputTwo(this,"名称","备注","请输入名称","请输入备注",item.name,item.remark,function (title,content) {
                    if(!title)
                    {
                        $.tip("请输入名称",0);
                        return
                    }
                    item.name=title;
                    item.remark=content;
                    return true;
                })
            },
            cloneParam:function (item) {
                var obj;
                obj=$.clone(this.param[this.tabIndex]);
                obj.name=obj.name+"(副本)";
                obj.id=uuid();
                obj.bodyInfo.rawJSON=obj.rawJSONObject;
                obj.result=obj.resultObject;
                this.param.push(obj);
                this.tabIndex=this.param.length-1;
            },
            editRemark:function () {
                var _this=this;
                $.inputMul(this,"编辑remark",function (val) {
                    _this.interfaceEdit.remark=val;
                    return true;
                },1,this.interfaceEdit.remark)
            },
        },
        created:function () {
            var _this=this;
            for(var i=1;i<_this.interfaceEdit.param.length;i++)
            {
                _this.param.push($.clone(_this.param[0]));
            }
            _this.interfaceEdit.param.forEach(function (objInter,index) {
                _this.param[index].name=objInter.name;
                _this.param[index].id=objInter.id;
                _this.param[index].remark=objInter.remark;
                if(objInter.queryParam && objInter.queryParam.length>0)
                {
                    _this.param[index].query=objInter.queryParam;
                    _this.param[index].query.forEach(function (item) {
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
                    _this.param[index].query.push({
                        name:"",
                        must:0,
                        remark:""
                    });
                }
                else
                {
                    objInter.queryParam=_this.param[index].query;
                }
                if(objInter.bodyParam && objInter.bodyParam.length>0)
                {
                    _this.param[index].body=objInter.bodyParam;
                    _this.param[index].body.forEach(function (item) {
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
                    _this.param[index].body.push({
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                    });
                }
                else
                {
                    objInter.bodyParam=_this.param[index].body;
                }
                if(objInter.header && objInter.header.length>0)
                {
                    _this.param[index].header=objInter.header;
                    _this.param[index].header.push({
                        name:"",
                        value:"",
                        remark:""
                    });
                }
                else
                {
                    objInter.header=_this.param[index].header;
                }
                if(objInter.outParam && objInter.outParam.length>0)
                {
                    helper.initResultShow(objInter.outParam);
                    _this.param[index].result=objInter.outParam;
                }
                else
                {
                    objInter.outParam=_this.param[index].result;
                }
                if(objInter.restParam && objInter.restParam.length>0)
                {
                    _this.param[index].param=objInter.restParam;
                    _this.param[index].param.forEach(function (item) {
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
                    objInter.restParam=_this.param[index].param;
                }
                if(objInter.bodyInfo)
                {
                    _this.param[index].bodyInfo=objInter.bodyInfo;
                    if(_this.param[index].bodyInfo.rawText===undefined)
                    {
                        Vue.set(_this.param[index].bodyInfo,"rawText","");
                    }
                    if(_this.param[index].bodyInfo.rawTextRemark===undefined)
                    {
                        Vue.set(_this.param[index].bodyInfo,"rawTextRemark","");
                    }
                    if(_this.param[index].bodyInfo.rawFileRemark===undefined)
                    {
                        Vue.set(_this.param[index].bodyInfo,"rawFileRemark","");
                    }
                    if(_this.param[index].bodyInfo.rawJSONType===undefined)
                    {
                        Vue.set(_this.param[index].bodyInfo,"rawJSONType",0);
                    }
                    if(_this.param[index].bodyInfo.rawJSON==undefined)
                    {
                        Vue.set(_this.param[index].bodyInfo,"rawJSON",_this.param[index].rawJSONObject);
                    }
                    else
                    {
                        helper.initResultShow(_this.param[index].bodyInfo.rawJSON);
                        if(_this.param[index].bodyInfo.rawJSONType==0)
                        {
                            _this.param[index].rawJSONObject=_this.param[index].bodyInfo.rawJSON;
                        }
                        else
                        {
                            _this.param[index].rawJSONArray=_this.param[index].bodyInfo.rawJSON;
                        }
                    }
                    var bFind=false;
                    for(var i=0;i<_this.param[index].header.length;i++)
                    {
                        var obj=_this.param[index].header[i];
                        if(obj.name.toLowerCase()=="content-type" && obj.value.toLowerCase().indexOf("application/json")>-1)
                        {
                            bFind=true;
                            break;
                        }
                    }
                    if(bFind && _this.param[index].bodyInfo.rawText)
                    {
                        var obj;
                        try
                        {
                            obj=JSON.parse(_this.param[index].bodyInfo.rawText);
                        }
                        catch (e)
                        {

                        }
                        if(obj)
                        {
                            var result=[];
                            for(var key in obj)
                            {
                                helper.handleResultData(key,obj[key],result,null,1,null,1)
                            }
                            _this.param[index].bodyInfo.rawJSON=result;
                            _this.param[index].bodyInfo.rawJSONType=(obj instanceof Array)?1:0;
                            _this.param[index].bodyInfo.rawText="";
                            _this.param[index].bodyInfo.rawType=2;
                        }
                    }
                }
                else
                {
                    objInter.bodyInfo=_this.param[index].bodyInfo;
                }
                if(objInter.outInfo)
                {
                    _this.param[index].outInfo=objInter.outInfo;
                    if(_this.param[index].outInfo.jsonType===undefined)
                    {
                        Vue.set(_this.param[index].outInfo,"jsonType",0);
                    }
                    else if(_this.param[index].outInfo.jsonType==0)
                    {
                        _this.param[index].resultObject=_this.param[index].result;
                    }
                    else
                    {
                        _this.param[index].resultArray=_this.param[index].result;
                    }
                }
                else
                {
                    objInter.outInfo=_this.param[index].outInfo;
                }
                if(!objInter.before)
                {
                    Vue.set(objInter,"before",{
                        mode:0,
                        code:""
                    })
                }
                else
                {
                    if(typeof(objInter.before)=="string")
                    {
                        objInter.before={
                            mode:0,
                            code:objInter.before
                        }
                    }
                }
                _this.param[index].before=objInter.before;
                if(!objInter.after)
                {
                    Vue.set(objInter,"after",{
                        mode:0,
                        code:""
                    })
                }
                else
                {
                    if(typeof(objInter.after)=="string")
                    {
                        objInter.after={
                            mode:0,
                            code:objInter.after
                        }
                    }
                }
                _this.param[index].after=objInter.after;
            })
        }
    }
</script>