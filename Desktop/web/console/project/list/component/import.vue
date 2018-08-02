<template>
    <el-dialog title="导入项目"  width="50%" ref="box" :visible.sync="showDialog" center append-to-body>
        <el-tabs v-model="type">
            <el-tab-pane name="doclever" label="DOClever">
                <el-input size="small" v-drag="'textMy'" type="textarea" :rows="5" placeholder="请输入JSON" v-model="textMy">
                </el-input>
            </el-tab-pane>
            <el-tab-pane name="postman" label="Postman">
                <el-input size="small"  v-drag="'text'" type="textarea" :rows="5" placeholder="请输入JSON" v-model="text" style="margin-bottom: 10px">
                </el-input>
                请编辑BaseUrl：
                <el-checkbox v-model="ignore" :true-label="1" :false-label="0" style="float: right;margin-right: 20px">
                    忽略大小写
                </el-checkbox>
                <template v-for="(item,index) in arr">
                    <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                        <el-col class="col" :span="20">
                            <el-input size="small"  style="width: 100%" placeholder="请填写baseurl地址" v-model="item.title"></el-input>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button type="text" size="small" style="color: red;font-size: 15px;" @click="remove(index)" icon="el-icon-close"></el-button>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button style="font-size: 15px" v-if="index==arr.length-1" @click="arr.push({title:''})" size="small" type="text" icon="el-icon-plus"></el-button>
                        </el-col>
                    </el-row>
                </template>
            </el-tab-pane>
            <el-tab-pane name="swagger" label="Swagger">
                Swagger类型:&nbsp;&nbsp;&nbsp;
                <el-select size="small"  v-model="swaggerType">
                    <el-option :value="0" label="URL"></el-option>
                    <el-option :value="1" label="JSON"></el-option>
                </el-select><br><br>
                <el-input size="small"  placeholder="请输入Swagger URL" v-model="textSwaggerURL" v-show="swaggerType==0"></el-input>
                <el-input size="small"  v-drag="'textSwaggerJSON'" type="textarea" :rows="5" placeholder="请输入Swagger Url" v-model="textSwaggerJSON" v-show="swaggerType==1"></el-input>
            </el-tab-pane>
            <el-tab-pane name="rap" label="Rap">
                <el-row class="row">
                    Body Type:&nbsp;&nbsp;&nbsp;
                    <el-select size="small"  v-model="rapBodyType">
                        <el-option :value="0" label="x-www-form-urlencoded"></el-option>
                        <el-option :value="1" label="application/json"></el-option>
                    </el-select>
                </el-row>
                <el-row class="row" style="height:20px">
                </el-row>
                <el-input size="small"  v-drag="'textRap'" type="textarea" :rows="5" placeholder="请输入JSON" v-model="textRap">
                </el-input>
            </el-tab-pane>
        </el-tabs>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" :loading="savePending"  @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var dragFile=require("common/director/dragFile");
    module.exports={
        data:function () {
            return {
                text:"",
                textMy:"",
                arr:[{
                    title:""
                }],
                savePending:false,
                status:"",
                ignore:0,
                textRap:"",
                rapBodyType:0,
                swaggerType:0,
                textSwaggerJSON:"",
                textSwaggerURL:"",
                type:"doclever",
                showDialog:false
            }
        },
        directives:{
            drag:dragFile
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
                if(this.type=="postman")
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
                    else if(!obj.info.name)
                    {
                        $.tip("项目名称为空",0);
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
                    var _this=this;
                    this.savePending=true;
                    var update={
                        json:this.text,
                        baseurl:arr.join(","),
                        ignore:this.ignore
                    };
                    if(session.get("teamId"))
                    {
                        update.team=session.get("teamId")
                    }
                    net.post("/project/importpostman",update).then(function (data) {
                        _this.savePending=false;
                        if(data.code==200)
                        {
                            _this.savePending=false;
                            _this.showDialog=false;
                            $.tip("导入成功",1);
                            _this.$store.commit("addProject",{
                                data:data.data,
                                type:"interface"
                            });
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                }
                else if(this.type=="doclever")
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
                        $.tip("不是DOClever的导出格式",0);
                        return;
                    }
                    var _this=this;
                    this.savePending=true;
                    var update={
                        json:this.textMy
                    };
                    if(session.get("teamId"))
                    {
                        update.team=session.get("teamId")
                    }
                    net.post("/project/importjson",update).then(function (data) {
                        _this.savePending=false;
                        if(data.code==200)
                        {
                            $.tip("导入成功",1);
                            _this.$store.commit("addProject",{
                                data:data.data,
                                type:"interface"
                            });
                            _this.showDialog=false;
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                }
                else if(this.type=="rap")
                {
                    if(!this.textRap)
                    {
                        $.tip("请输入JSON",0);
                        return;
                    }
                    var obj;
                    try
                    {
                        obj=JSON.parse(this.textRap);
                        obj=eval("("+obj.modelJSON+")");
                    }
                    catch(e)
                    {
                        $.tip("JSON格式有错误",0);
                        return;
                    }
                    var _this=this;
                    this.savePending=true;
                    var update={
                        json:JSON.stringify(obj),
                        bodytype:this.rapBodyType
                    };
                    if(session.get("teamId"))
                    {
                        update.team=session.get("teamId")
                    }
                    net.post("/project/importrap",update).then(function (data) {
                        _this.savePending=false;
                        if(data.code==200)
                        {
                            $.tip("导入成功",1);
                            _this.$store.commit("addProject",{
                                data:data.data,
                                type:"interface"
                            });
                            _this.showDialog=false;
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                }
                else if(this.type=="swagger")
                {
                    if(this.swaggerType==0)
                    {
                        if(!this.textSwaggerURL)
                        {
                            $.tip("请输入url地址",0);
                            return;
                        }
                    }
                    else if(this.swaggerType==1)
                    {
                        if(!this.textSwaggerJSON)
                        {
                            $.tip("请输入JSON",0);
                            return;
                        }
                    }
                    var obj;
                    if(this.swaggerType==1)
                    {
                        try
                        {
                            obj=JSON.parse(this.textSwaggerJSON);
                        }
                        catch(e)
                        {
                            $.tip("JSON格式有错误",0);
                            return;
                        }
                    }
                    var _this=this;
                    this.savePending=true;
                    var update={};
                    if(this.swaggerType==0)
                    {
                        update.url=this.textSwaggerURL;
                    }
                    else
                    {
                        update.json=this.textSwaggerJSON;
                    }
                    if(session.get("teamId"))
                    {
                        update.team=session.get("teamId")
                    }
                    net.post("/project/importswagger",update).then(function (data) {
                        _this.savePending=false;
                        if(data.code==200)
                        {
                            $.tip("导入成功",1);
                            _this.$store.commit("addProject",{
                                data:data.data,
                                type:"interface"
                            });
                            _this.showDialog=false;
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                }
            }
        }
    }
</script>