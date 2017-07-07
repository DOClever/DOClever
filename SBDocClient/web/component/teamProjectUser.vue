<template>
    <el-dialog title="项目用户管理"  size="small" ref="box" >
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-input style="width: 100%" placeholder="请输入你要筛选的用户名" v-model="searchName"></el-input>
        </el-row>
        <el-row class="row" style="height: 300px;overflow-y: auto">
            <el-collapse>
                <template v-for="(item,index) in arrFilter">
                    <el-collapse-item :title="item.name" class="hover">
                        <template v-for="(item1,index1) in item.users">
                            <el-row class="row" style="height: 40px;line-height: 40px;text-align: center">
                                <el-col class="col" :span="2">
                                    <el-checkbox v-model="item1.select" :true-label="1" :false-label="0"  v-if="item1.role!=2">
                                    </el-checkbox>
                                </el-col>
                                <el-col class="col" :span="4">
                                    <img v-proxy="item1.user.photo" style="width: 30px;height: 30px; border-radius:50%;vertical-align: middle">
                                </el-col>
                                <el-col class="col" :span="11">
                                    {{item1.user.name}}
                                </el-col>
                                <el-col class="col" :span="7">
                                    <el-select v-if="item1.role!=2" v-model="item1.role">
                                        <el-option :value="0" label="项目管理员"></el-option>
                                        <el-option :value="1" label="项目观察者"></el-option>
                                    </el-select>
                                    <span v-else>
                                    项目所有者
                                </span>
                                </el-col>
                            </el-row>
                        </template>
                        <el-row class="row" style="height: 30px;line-height: 30px;text-align: center;color: gray;border-top: 1px lightgray solid;cursor:pointer" v-if="more && obj.notice.length>0" @click.native="moreNotice">
                            获取更多
                        </el-row>
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
    var proxyImg=require("../director/proxyImg")
    module.exports={
        props:["arr","id"],
        data:function () {
            return {
                searchName:"",
                arrUser:this.arr,
                savePending:false
            }
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
        directives:{
            proxy:proxyImg
        },
        methods:{
            save:function () {
                var arr=[];
                this.arrFilter.forEach(function (obj) {
                    obj.users.forEach(function (obj) {
                        if(obj.select==1 && obj.role!=2)
                        {
                            arr.push({
                                user:obj.user._id,
                                role:obj.role
                            })
                        }
                    })
                })
                this.savePending=true;
                var _this=this;
                net.put("/project/user",{
                    id:this.id,
                    user:JSON.stringify(arr)
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("设置成功",1);
                        _this.$emit("update",arr);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        }
    }
</script>