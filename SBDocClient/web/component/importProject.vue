<template>
    <el-dialog title="导入"  size="small" ref="box">
        <el-row class="row" style="height: 30px;line-height: 30px">
            <el-radio class="radio" :label="0" v-model="type" :checked="type==0" id="bodyKey">PostMan V2 JSON</el-radio>&nbsp;&nbsp;
            <el-radio class="radio" :label="1" v-model="type" :checked="type==1" id="bodyRaw">SBDoc JSON</el-radio>&nbsp;&nbsp;
        </el-row>
        <el-row class="row" v-if="type==0">
            <el-input type="textarea" :rows="10" placeholder="请输入JSON" v-model="text" style="margin-bottom: 10px">
            </el-input>
            请编辑BaseUrl：
            <el-checkbox v-model="ignore" :true-label="1" :false-label="0" style="float: right;margin-right: 20px">
                忽略大小写
            </el-checkbox>
            <template v-for="(item,index) in arr">
                <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                    <el-col class="col" :span="20">
                        <el-input style="width: 100%" placeholder="请填写baseurl地址" v-model="item.title"></el-input>
                    </el-col>
                    <el-col class="col" :span="2">
                        <el-button type="text" size="small" style="color: red;font-size: 15px;" @click="remove(index)" icon="close"></el-button>
                    </el-col>
                    <el-col class="col" :span="2">
                        <el-button style="font-size: 15px" v-if="index==arr.length-1" @click="arr.push({title:''})" size="small" type="text" icon="plus"></el-button>
                    </el-col>
                </el-row>
            </template>
        </el-row>
        <el-row class="row" v-else>
            <el-input type="textarea" :rows="10" placeholder="请输入JSON" v-model="textMy">
            </el-input>
        </el-row>
        <el-row class="row">{{status}}</el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" :loading="savePending" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        data:function () {
            return {
                type:0,
                text:"",
                textMy:"",
                arr:[{
                    title:""
                }],
                savePending:false,
                status:"",
                ignore:0
            }
        },
        computed:{

        },
        methods:{
            remove:function (index) {
                if(this.arr.length>1)
                {
                    this.arr.splice(index,1)
                }
                else
                {
                    this.arr[0].title="";
                }
            },
            save:function () {
                var _this=this;
                function postman(obj,arr)
                {
                    if(!obj.info.name)
                    {
                        $.tip("项目名称为空",0);
                        return;
                    }
                    _this.savePending=true;
                    _this.status="正在创建项目"+obj.info.name;
                    var projectID,groupID;
                    var pro=net.post("/project/create",{
                        name:obj.info.name,
                        dis:obj.info.description,
                        import:1
                    }).then(function (data) {
                        if(data.code==200)
                        {
                            _this.$parent.projectList.unshift(data.data);
                            projectID=data.data._id;
                        }
                        else
                        {
                            throw data.msg;
                        }
                    });
                    var count=0,indexInterface=0,bDefaultGroup=false,bDefaultGroupId;
                    obj.item.forEach(function (o) {
                        if(o.item)
                        {
                            count+=o.item.length;
                        }
                        else
                        {
                            count++;
                        }
                    })
                    obj.item.forEach(function (group) {
                        pro=pro.then(function () {
                            var groupName,bDefault=false;
                            if(group.item)
                            {
                                groupName=group.name;
                            }
                            else
                            {
                                bDefault=true;
                                if(!bDefaultGroup)
                                {
                                    groupName="未命名";
                                    bDefaultGroup=true;
                                }
                                else
                                {
                                    groupID=bDefaultGroupId;
                                    return;
                                }
                            }
                            _this.status="正在创建分组"+groupName;
                            var query={};
                            query.id=projectID;
                            query.name=groupName;
                            query.import=1;
                            return net.post("/group/create",query).then(function (data) {
                                if(data.code!=200)
                                {
                                    throw data.msg;
                                }
                                else
                                {
                                    groupID=data.data._id;
                                    if(bDefault)
                                    {
                                        bDefaultGroupId=groupID;
                                    }
                                }
                            })
                        })
                        if(!group.item)
                        {
                            group.item=[group];
                        }
                        group.item.forEach(function (item) {
                            pro=pro.then(function () {
                                indexInterface++;
                                _this.$parent.projectList[0].interfaceCount=indexInterface;
                                _this.status="正在导入第"+indexInterface+"个接口"+item.name+"，一共"+count+"个接口";
                                var objUrl=$.parseURL(item.request.url);
                                var url=objUrl.source,index=url.indexOf("?");
                                if(index>-1)
                                {
                                    url=url.substr(0,index);
                                }
                                for(var i=0;i<arr.length;i++)
                                {
                                    if(_this.ignore)
                                    {
                                        index=url.toLowerCase().indexOf(arr[i].toLowerCase());
                                    }
                                    else
                                    {
                                        index=url.indexOf(arr[i]);
                                    }
                                    if(index>-1)
                                    {
                                        url=url.substr(index+arr[i].length);
                                        break;
                                    }
                                }
                                var obj={
                                    name:item.name,
                                    url:url,
                                    group:groupID,
                                    remark:item.request.description,
                                    project:projectID,
                                    method:item.request.method,
                                    finish:1,
                                    before:"",
                                    after:"",
                                };
                                var param=[];
                                for(var key in objUrl.params)
                                {
                                    var v={
                                        name:key,
                                        must:1,
                                        remark:""
                                    };
                                    if(objUrl.params[key]!=="" && objUrl.params[key]!==undefined)
                                    {
                                        v.value=[objUrl.params[key]];
                                    }
                                    param.push(v);
                                }
                                obj.queryparam=JSON.stringify(param);
                                var bJSON=false;
                                obj.header=JSON.stringify(item.request.header.map(function (obj) {
                                    if(obj.key.toLowerCase()=="content-type" && obj.value.toLowerCase()=="application/json")
                                    {
                                        bJSON=true;
                                    }
                                    return {
                                        name:obj.key,
                                        value:obj.value,
                                        remark:""
                                    }
                                }));
                                if(obj.method.toLowerCase()=="post" || obj.method.toLowerCase()=="put")
                                {
                                    var body,bodyInfo;
                                    if(item.request.body.mode=="urlencoded" || item.request.body.mode=="formdata")
                                    {
                                        bodyInfo={
                                            type:0,
                                            rawType:0,
                                            rawTextRemark:"",
                                            rawFileRemark:"",
                                            rawText:"",
                                        };
                                        body=item.request.body[item.request.body.mode].map(function (obj)
                                        {
                                            var o={
                                                name:obj.key,
                                                type:obj.type=="text"?0:1,
                                                must:1,
                                                remark:"",
                                            }
                                            if(o.type==0 && obj.value!=="" && obj.value!==undefined)
                                            {
                                                o.value=[obj.value];
                                            }
                                            return o;
                                        })
                                    }
                                    else if(item.request.body.mode=="raw")
                                    {
                                        body=[];
                                        if(bJSON)
                                        {
                                            var objJSON;
                                            try
                                            {
                                                objJSON=JSON.parse(item.request.body.raw);
                                            }
                                            catch (err)
                                            {

                                            }
                                            if(objJSON)
                                            {
                                                var result=[];
                                                for(var key in objJSON)
                                                {
                                                    helper.handleResultData(key,objJSON[key],result,null,1)
                                                }
                                                bodyInfo={
                                                    type:1,
                                                    rawType:2,
                                                    rawTextRemark:"",
                                                    rawFileRemark:"",
                                                    rawText:"",
                                                    rawJSON:result
                                                };
                                            }
                                            else
                                            {
                                                bodyInfo={
                                                    type:1,
                                                    rawType:0,
                                                    rawTextRemark:"",
                                                    rawFileRemark:"",
                                                    rawText:item.request.body.raw,
                                                };
                                            }
                                        }
                                        else
                                        {
                                            bodyInfo={
                                                type:1,
                                                rawType:0,
                                                rawTextRemark:"",
                                                rawFileRemark:"",
                                                rawText:item.request.body.raw,
                                            };
                                        }
                                    }
                                    else
                                    {
                                        body="[]";
                                        bodyInfo={
                                            type:0,
                                            rawType:0,
                                            rawTextRemark:"",
                                            rawFileRemark:"",
                                            rawText:"",
                                        };
                                    }
                                    obj.bodyparam=JSON.stringify(body);
                                    obj.bodyinfo=JSON.stringify(bodyInfo)
                                }
                                obj.outparam="[]";
                                obj.outinfo=JSON.stringify({
                                    type:0,
                                    rawRemark:"",
                                    rawMock:"",
                                });
                                obj.restparam="[]";
                                return net.post("/interface/create",obj).then(function (data) {
                                    if(data.code!=200)
                                    {
                                        throw data.msg
                                    }
                                });
                            })
                        })
                        if(group.item && group.item[0]==group)
                        {
                            group.item=null;
                        }
                    })
                    pro=pro.then(function () {
                        return net.put("/project/url",{
                            id:projectID,
                            urls:arr.join(",")
                        }).then(function (data) {
                            if(data.code!=200)
                            {
                                throw data.msg
                            }
                        })
                    }).then(function () {
                        _this.savePending=false;
                        _this.$refs.box.close();
                        $.notify("导入成功",1)
                    }).catch(function (err) {
                        _this.savePending=false;
                        $.tip(err,0);
                    })
                }
                if(this.type==0)
                {
                    if(!this.text)
                    {
                        $.tip("请输入JSON",0);
                        return;
                    }
                    var obj;
                    try
                    {
                        obj=JSON.parse(this.text)
                    }
                    catch(e)
                    {
                        $.tip("JSON格式有错误",0);
                        return;
                    }
                    if(!obj.info._postman_id)
                    {
                        $.tip("不是可识别的JSON格式",0);
                        return;
                    }
                    var arr=[];
                    this.arr.forEach(function (obj) {
                        if(obj.title)
                        {
                            arr.push(obj.title);
                        }
                    })
                    if(arr.length==0)
                    {
                        $.tip("请输入BaseUrl",0);
                        return;
                    }
                    postman(obj,arr)
                }
                else
                {
                    if(!this.textMy)
                    {
                        $.tip("请输入JSON",0);
                        return;
                    }
                    var obj;
                    try
                    {
                        obj=JSON.parse(this.textMy);
                    }
                    catch (err)
                    {
                        $.tip("json解析错误",0);
                        return;
                    }
                    if(obj.flag!="SBDoc")
                    {
                        $.tip("不是SBDoc的导出格式",0);
                        return;
                    }
                    var _this=this;
                    this.savePending=true;
                    net.post("/project/importjson",{
                        json:this.textMy
                    }).then(function (data) {
                        _this.savePending=false;
                        if(data.code==200)
                        {
                            $.notify("导入成功",1);
                            _this.$parent.projectList.unshift(data.data);
                            _this.$refs.box.close();
                        }
                        else
                        {
                            $.notify(data.msg,0);
                        }
                    })
                }
            }
        }
    }
</script>
