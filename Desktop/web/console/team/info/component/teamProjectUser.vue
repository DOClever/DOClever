<template>
    <el-dialog title="项目用户管理" width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-input size="small" style="width: 100%" placeholder="请输入你要筛选的用户名" v-model="searchName"></el-input>
        </el-row>
        <el-row class="row" style="height: 300px;overflow-y: auto">
            <el-collapse>
                <template v-for="(item,index) in arrFilter">
                    <el-collapse-item :title="item.name" class="hover">
                        <template v-for="(item1,index1) in item.users">
                            <el-row class="row" style="height: 40px;line-height: 40px;text-align: center" v-if="type=='interface'">
                                <el-col class="col" :span="2">
                                    <el-checkbox v-model="item1.select" :true-label="1" :false-label="0"  v-if="item1.role!=2">
                                    </el-checkbox>
                                </el-col>
                                <el-col class="col" :span="3">
                                    <img v-proxy="item1.user.photo" style="width: 30px;height: 30px; border-radius:50%;vertical-align: middle">
                                </el-col>
                                <el-col class="col" :span="9">
                                    {{item1.user.name}}
                                </el-col>
                                <el-col class="col" :span="7">
                                    <el-select v-if="item1.role!=2" v-model="item1.role" @input="changeRole(item1)">
                                        <el-option :value="0" label="项目管理员"></el-option>
                                        <el-option :value="1" label="项目观察者"></el-option>
                                    </el-select>
                                    <span v-else>
                                    项目所有者
                                </span>
                                </el-col>
                                <el-col class="col" :span="3">
                                    <el-button  style="font-size: 15px" size="mini" @click="editRoleOption(item1)" type="text" v-if="item1.role==1">权限</el-button>
                                </el-col>
                            </el-row>
                            <el-row class="row" style="height: 40px;line-height: 40px;text-align: center" v-if="type=='doc' || type=='test'">
                                <el-col class="col" :span="2">
                                    <el-checkbox v-model="item1.select" :true-label="1" :false-label="0"  v-if="item1.role!=2">
                                    </el-checkbox>
                                </el-col>
                                <el-col class="col" :span="6">
                                    <img v-proxy="item1.user.photo" style="width: 30px;height: 30px; border-radius:50%;vertical-align: middle">
                                </el-col>
                                <el-col class="col" :span="10">
                                    {{item1.user.name}}
                                </el-col>
                                <el-col class="col" :span="6">
                                    {{item1.role==2?"项目所有者":"项目成员"}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" :loading="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    module.exports={
        props:["arr","id","type"],
        data:function () {
            return {
                searchName:"",
                arrUser:this.arr,
                savePending:false,
                arrUserSearch:[],
                showDialog:false
            }
        },
        computed:{
            arrFilter:function () {
                if(!this.searchName)
                {
                    return this.arrUser;
                }
                this.arrUserSearch=[];
                var _this=this;
                this.arrUser.forEach(function (obj) {
                    var objCopy=$.clone(obj);
                    objCopy.users=objCopy.users.filter(function (obj) {
                        if(obj.user.name.toLowerCase().indexOf(_this.searchName.toLowerCase())>-1)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    })
                    if(objCopy.users.length>0)
                    {
                        _this.arrUserSearch.push(objCopy);
                    }
                })
                return this.arrUserSearch;
            }
        },
        directives:{
            proxy:proxyImg
        },
        methods:{
            save:function () {
                var arr=[];
                this.savePending=true;
                var _this=this;
                var pro;
                if(this.type=="interface")
                {
                    this.arrFilter.forEach(function (obj) {
                        obj.users.forEach(function (obj) {
                            if(obj.select==1 && obj.role!=2)
                            {
                                var obj1={
                                    user:obj.user._id,
                                    role:obj.role
                                };
                                if(obj.role==1)
                                {
                                    obj1.option=obj.option
                                }
                                arr.push(obj1)
                            }
                        })
                    })
                    pro=net.put("/project/user",{
                        id:this.id,
                        user:JSON.stringify(arr)
                    })
                }
                else if(this.type=="doc")
                {
                    this.arrFilter.forEach(function (obj) {
                        obj.users.forEach(function (obj) {
                            if(obj.select==1 && obj.role!=2)
                            {
                                arr.push(obj.user._id)
                            }
                        })
                    })
                    pro=net.put("/doc/user",{
                        project:this.id,
                        user:JSON.stringify(arr)
                    })
                }
                else if(this.type=="test")
                {
                    this.arrFilter.forEach(function (obj) {
                        obj.users.forEach(function (obj) {
                            if(obj.select==1 && obj.role!=2)
                            {
                                arr.push(obj.user._id)
                            }
                        })
                    })
                    pro=net.put("/test/user",{
                        project:this.id,
                        user:JSON.stringify(arr)
                    })
                }
                pro.then(function (d) {
                    _this.savePending=false;
                    if(d.code==200)
                    {
                        $.tip("设置成功",1);
                        _this.$emit("update",arr);
                    }
                    else
                    {
                        $.tip(d.msg,0);
                    }
                })
            },
            changeRole:function (item) {
                if(item.role==1)
                {
                    Vue.set(item,"option",{
                        "ie":0,
                        "te":0,
                        "gb":0,
                        "gs":0,
                        "gi":0,
                        "gt":0,
                        "gd":0,
                        "ve":0,
                        "vr":0
                    });
                }
                else
                {
                    delete item.option
                }
            },
            editRoleOption:function (item) {
                var _this=this;
                var child=$.showBox(this,require("component/roleOption.vue"),{
                    hudremove:true,
                    data:item.option
                });
                child.$on("save",function (val) {
                    item.option=val;
                })
            }
        }
    }
</script>