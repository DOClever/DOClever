<template>
    <el-dialog title="新建项目"  width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form ref="form" label-width="100px">
            <el-form-item label="名称" style="text-align: center">
                <el-input size="small"  style="width: 80%" name="name" v-model="obj.name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="描述" style="text-align: center">
                <el-input size="small" type="textarea" :rows="3"  style="width: 80%" name="dis" v-model="obj.dis" placeholder="请输入项目描述"></el-input>
            </el-form-item>
            <el-form-item label="公开" style="text-align: center">
                <el-switch v-model="obj.public" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="所有者" style="text-align: center">
                <el-autocomplete size="small" :fetch-suggestions="querySearchAsync.bind(this,0)" style="width: 80%" name="owner" v-model="obj.owner.name" placeholder="请输入所有者名称" @select="sel"></el-autocomplete>
            </el-form-item>
            <el-form-item label="用户" style="text-align: center">
                <template v-for="(item,index) in obj.users">
                    <el-row class="row" style="height: 50px;line-height: 50px;width: 90%;display: inline-block">
                        <el-col :span="12" class="col">
                            <el-autocomplete size="small" :fetch-suggestions="querySearchAsync.bind(this,index)" style="width: 80%" v-model="item.name" @input="index==obj.users.length-1?add():''" placeholder="请输入用户名称" @select="selUser"></el-autocomplete>
                        </el-col>
                        <el-col :span="6" class="col">
                            <el-select size="small" v-model="item.role" style="width: 80%">
                                <el-option label="管理员" :value="0"></el-option>
                                <el-option label="观察者" :value="1"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4" class="col">
                            <el-button size="mini" type="text" v-if="item.role==1" @click="roleOption(item,index)">
                                权限
                            </el-button>
                        </el-col>
                        <el-col :span="2" class="col">
                            <el-button size="mini" type="text" icon="el-icon-close" style="color: red" @click="remove(item,index)">
                            </el-button>
                        </el-col>
                    </el-row>
                </template>
            </el-form-item>
        </el-form>
        <el-row class="dialog-footer" slot="footer">
            <el-button size="mini" type="primary" @click="save" :laoding="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var roleOption=require("component/roleOption.vue");
    module.exports={
        data:function () {
            return {
                savePending:false,
                obj:{
                    name:"",
                    dis:"",
                    public:0,
                    owner:{
                        name:"",
                        id:""
                    },
                    users:[
                        {
                            name:"",
                            id:"",
                            role:0,
                            option:{
                                "ie":0,
                                "te":0,
                                "gb":0,
                                "gs":0,
                                "gi":0,
                                "gt":0,
                                "gd":0,
                                "ve":0,
                                "vr":0
                            }
                        }
                    ]
                },
                showDialog:false
            }
        },
        computed:{

        },
        methods:{
            add:function () {
                this.obj.users.push({
                    name:"",
                    id:"",
                    role:0,
                    option:{}
                })
            },
            querySearchAsync:function (index,str,cb) {
                if(!str)
                {
                    cb([]);
                    return;
                }
                this.$store.dispatch("searchUser",str).then(function (data) {
                    if(data.code==200)
                    {
                        cb(data.data.map(function (obj) {
                            return {
                                value:obj.name,
                                id:obj._id,
                                index:index
                            }
                        }));
                    }
                })
            },
            sel:function (data) {
                this.obj.owner.name=data.value;
                this.obj.owner.id=data.id;
            },
            selUser:function (data) {
                this.obj.users[data.index].name=data.value;
                this.obj.users[data.index].id=data.id;
            },
            save:function () {
                var obj={};
                if(!this.obj.name)
                {
                    $.tip("名称不能为空",0);
                    return;
                }
                else
                {
                    obj.name=this.obj.name;
                }
                if(this.obj.dis)
                {
                    obj.dis=this.obj.dis;
                }
                obj.public=this.obj.public;
                if(!this.obj.owner.id)
                {
                    $.tip("请选择所有者",0);
                    return;
                }
                else
                {
                    obj.owner=this.obj.owner.id
                }
                var arr=[];
                this.obj.users.forEach(function (obj) {
                    if(obj.id)
                    {
                        var o={
                            user:obj.id,
                            role:obj.role
                        };
                        if(obj.role==1)
                        {
                            o.option=obj.option;
                        }
                        arr.push(o);
                    }
                })
                if(arr.length>0)
                {
                    obj.users=JSON.stringify(arr);
                }
                var _this=this;
                this.savePending=true;
                this.$store.dispatch("addProject",obj).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("新建成功",1);
                        _this.showDialog=false;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            remove:function (item,index) {
                if(index==0)
                {
                    this.obj.users[0]={
                        name:"",
                        id:"",
                        role:0,
                        option:{
                            "ie":0,
                            "te":0,
                            "gb":0,
                            "gs":0,
                            "gi":0,
                            "gt":0,
                            "gd":0,
                            "ve":0,
                            "vr":0
                        }
                    }
                }
                else
                {
                    this.obj.users.splice(index,1)
                }
            },
            roleOption:function (item,index) {
                var _this=this;
                var child=$.showBox(this.$root,roleOption,{
                    hudremove:1
                })
                child.$on("save",function (data) {
                    item.option=data;
                })
            }
        }
    }
</script>