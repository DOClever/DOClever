/**
 * Created by sunxin on 2016/12/22.
 */
var mainNav=require("../component/mainNav.vue")
var interfaceList=require("../component/interfaceList.vue")
var inParamQuery=require("../component/inparamQuery.vue")
var inParamHeader=require("../component/inparamHeader.vue")
var inParamBody=require("../component/inparamBody.vue")
var outParam=require("../component/outParam.vue")
var valueList=require("../component/valueList.vue")
var restParam=require("../component/restParam.vue")
var rawText=require("../component/rawText.vue")
var inParamInject=require("../component/inparamInject.vue")
var run=require("../component/run.vue")
var encrypt=require("../component/encrypt.vue")
var store=require("./store")
var config=require("../util/config")
if(!session.get("id"))
{
    location.href="../login/login.html"
}
else if(!session.get("projectId"))
{
    location.href="../project/project.html"
}
var vue=new Vue({
    el: "#app",
    data: {
        session:$.clone(session.raw()),
        savePending:false,
        mockUrl:config.baseUrl+"/mock/"+session.get("projectId")
    },
    store:store,
    components:{
        "mainnav":mainNav,
        "interfacelist":interfaceList,
        "inparamquery":inParamQuery,
        "inparamheader":inParamHeader,
        "inparambody":inParamBody,
        "outparam":outParam,
        "valuelist":valueList,
        "restparam":restParam,
        "rawtext":rawText,
        "inparaminject":inParamInject,
        "encrypt":encrypt,
        "run":run
    },
    watch:{
        preview:function (val) {
            store.commit("changePreview",val);
        },
        "interfaceEdit.url":function (val) {
            if(/http\:\/\/|https\:\/\//i.test(val))
            {
                $.tip("请不要在路径里面包含baseUrl",0);
            }
        }
    },
    computed:{
        preview:function () {
            return store.state.preview
        },
        drawMix:function () {
            return store.state.drawMix
        },
        interfaceEdit:function () {
            return store.state.interfaceEdit
        },
        interfaceList:function () {
            return store.state.interfaceList
        },
        outInfo:function () {
            return store.state.outInfo
        },
        bodyInfo:function () {
            return store.state.bodyInfo
        },
        param:function () {
            return store.state.param
        },
        querySave:function () {
            return store.getters.querySave
        },
        headerSave:function () {
            return store.getters.headerSave
        },
        bodySave:function () {
            return store.getters.bodySave
        },
        paramTab:function () {
            return "Param ("+store.getters.paramCount+")";
        },
        queryTab:function () {
            return "Query ("+store.getters.queryCount+")";
        },
        headerTab:function () {
            return "Header ("+store.getters.headerCount+")";
        },
        bodyTab:function () {
            return "Body ("+(store.state.bodyInfo.type==0?store.getters.bodyCount:"Raw")+")";
        },
        editInfo:function () {
            return this.interfaceEdit?(this.interfaceEdit.createdAt?((this.interfaceEdit.owner?this.interfaceEdit.owner.name:"")+"在"+this.interfaceEdit.createdAt+"创建，最近修改被"+(this.interfaceEdit.editor?this.interfaceEdit.editor.name:"")+"在"+this.interfaceEdit.updatedAt+"改动"):"接口尚未保存"):"";
        },
        rawMock:function () {
            return store.getters.rawMock;
        }
    },
    methods:{
        addGroup:function () {
            $.input("请输入分组名称",function (val) {
                if(!val.value)
                {
                    $.tip("请输入分组名称",0);
                    return false
                }
                var query={};
                query.id=session.get("projectId");
                query.name=val.value;
                $.startHud("#body");
                store.dispatch("addGroup",query).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("新建成功",1)
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            });
        },
        importJSON:function () {
            var _this=this;
            $.inputMul(this,"请输入JSON",function (val) {
                if(!val)
                {
                    $.tip("请输入JSON",0);
                    return false
                }
                var obj;
                try
                {
                    obj=JSON.parse(val)
                }
                catch (err)
                {
                    $.tip("JSON不符合格式",0);
                    return false
                }
                store.commit("importResult",obj);
                return true;
            });
        },
        importQuery:function () {
            var _this=this;
            $.inputMul(this,"请输入Query字符串，比如:name=sx&pwd=111",function (val) {
                if(!val)
                {
                    $.tip("请输入Query字符串",0);
                    return false
                }
                store.commit("importQuery",val);
                return true;
            });
        },
        importHeader:function () {
            var _this=this;
            $.inputMul(this,"请输入HTTP Header字符串，以回车分割，比如:\nRequest Method:GET\nStatus Code:200",function (val) {
                if(!val)
                {
                    $.tip("请输入HTTP Header字符串",0);
                    return false
                }
                store.commit("importHeader",val);
                return true;
            });
        },
        importBody:function () {
            var _this=this;
            $.inputMul(this,"请输入Body Key-Value字符串,文件类型的值用[FILE]代替,比如:name=sx&pwd=111&file=[FILE]",function (val) {
                if(!val)
                {
                    $.tip("请输入Body Key-Value字符串",0);
                    return false
                }
                store.commit("importBody",val);
                return true;
            });
        },
        changeMethod:function () {
            store.commit("changeMethod");
        },
        save:function () {
            if(!this.interfaceEdit.name)
            {
                $.tip("请填入接口名称",0);
                return;
            }
            else if(!this.interfaceEdit.url)
            {
                $.tip("请填入接口地址",0);
                return;
            }
            this.savePending=true;
            var _this=this;
            store.dispatch("save").then(function (data) {
                _this.savePending=false;
                if(data.code==200)
                {
                    $.notify("保存成功",1)
                }
                else
                {
                    $.notify(data.msg,0)
                }
            })
        },
        changeUrl:function (val) {
            store.commit("changeUrl",val);
        },
        changePreview:function (val) {
            store.commit("setPreview",val);
        },
        run:function () {
            session.set("interfaceId",this.interfaceEdit._id);
            session.set("groupId",this.interfaceEdit.group._id);
            var child=$.showBox(this,"run",{
                "interfaceEdit":$.clone(this.interfaceEdit),
                "baseUrls":$.clone(store.state.baseUrls)
            });
            child.$on("save",function () {
                store.dispatch("newInterface");
            });
        },
        methodColor:function (val) {
            return helper.methodColor(val);
        },
        paste:function () {
            setTimeout(function () {
                var path=store.state.interfaceEdit.url;
                var arrStoreQuery=store.state.query;
                arrStoreQuery.splice(0,arrStoreQuery.length);
                var index=path.indexOf("?");
                if(index>-1)
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
                                    value:arrQuery1[1]?[decodeURIComponent(arrQuery1[1])]:[],
                                    must:1,
                                    remark:""
                                })
                            }
                        }
                    }
                    store.state.interfaceEdit.url=store.state.interfaceEdit.url.substring(0,index);
                }
                else
                {
                    arrStoreQuery.push({
                        name:"",
                        must:0,
                        remark:""
                    })
                }
            },100)
        }
    },
    created:function () {
        store.dispatch("getAllInterface").then(function () {
            $.stopLoading();
        })
    },
})

$.ready(function () {
    $.startLoading();
})