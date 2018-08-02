<template>
    <el-dialog title="项目用户管理" width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-input size="small" style="width: 100%" placeholder="请输入你要筛选的用户名" v-model="searchName"></el-input>
        </el-row>
        <el-row class="row" style="height: 300px;overflow-y: auto">
            <el-collapse>
                <template v-for="(item,index) in arrFilter">
                    <el-collapse-item :title="item.name" class="hover" :key="item._id">
                        <template v-for="(item1,index1) in item.users">
                            <el-row class="row" style="height: 40px;line-height: 40px;text-align: center;cursor: pointer" @click.native="select(item1)" :style="{'backgroundColor':selectUser==item1.user._id?'lightblue':'white'}" :key="item1._id">
                                <el-col class="col" :span="4">
                                    <img v-proxy="item1.user.photo" style="width: 30px;height: 30px; border-radius:50%;vertical-align: middle">
                                </el-col>
                                <el-col class="col" :span="13">
                                    {{item1.user.name}}
                                </el-col>
                                <el-col class="col" :span="7">
                                    <span v-if="item1.select==0">
                                        非项目成员
                                    </span>
                                    <template v-else>
                                        <span v-if="item1.role==0">
                                            项目管理员
                                        </span>
                                        <span v-else-if="item1.role==1">
                                            项目观察者
                                        </span>
                                        <span v-else-if="item1.role==2">
                                            项目所有者
                                        </span>
                                    </template>
                                </el-col>
                            </el-row>
                        </template>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" :loading="savePending">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    module.exports={
        props:["arr","id"],
        data:function () {
            return {
                savePending:false,
                selectUser:"",
                searchName:"",
                arrUser:this.arr,
                showDialog:false
            }
        },
        directives:{
            proxy:proxyImg
        },
        computed:{
            arrFilter:function () {
                if(!this.searchName)
                {
                    return this.arrUser;
                }
                var arr=[];
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
                        arr.push(objCopy);
                    }
                })
                return arr;
            }
        },
        methods:{
            save:function () {
                if(!this.selectUser)
                {
                    $.tip("请选择项目所有者",0);
                    return;
                }
                var _this=this;
                this.savePending=true;
                net.put("/project/owner",{
                    id:this.id,
                    user:this.selectUser
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.tip("设置成功",1);
                        _this.$emit("save");
                        _this.showDialog=false;
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            select:function (item) {
                if(item.role==2)
                {
                    $.tip("不能选择原来的项目所有者",0);
                    return;
                }
                else
                {
                    this.selectUser=item.user._id;
                }

            }
        }
    }
</script>