<template>
    <el-dialog title="团队转让" width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-input size="small" style="width: 100%" placeholder="请输入你要筛选的用户名" v-model="searchName"></el-input>
        </el-row>
        <el-row class="row" style="height: 300px;overflow-y: auto">
            <el-collapse>
                <template v-for="(item,index) in arrFilter">
                    <el-collapse-item :title="item.name" class="hover">
                        <template v-for="(item1,index1) in item.users">
                            <el-row class="row" style="height: 40px;line-height: 40px;text-align: center">
                                <el-col class="col" :span="3">
                                    <img v-proxy="item1.user.photo" style="width: 30px;height: 30px; border-radius:50%;vertical-align: middle">
                                </el-col>
                                <el-col class="col" :span="9">
                                    {{item1.user.name}}
                                </el-col>
                                <el-col class="col" :span="6">
                                    <span v-if="item1.role==0">
                                            团队管理员
                                        </span>
                                    <span v-else-if="item1.role==1">
                                            团队观察者
                                        </span>
                                    <span v-else>
                                            团队所有者
                                    </span>
                                </el-col>
                                <el-col class="col" :span="3">
                                    <el-button  style="font-size: 15px" size="mini" @click="transfer(item1)" type="text" v-if="item1.role==0 || item1.role==1">转让</el-button>
                                </el-col>
                            </el-row>
                        </template>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    module.exports={
        props:["arr"],
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
            transfer:function (item) {
                var _this=this;
                $.confirm("是否确认将该团队转让给用户"+item.user.name,function () {
                    $.startHud();
                    net.put("/team/transfer",{
                        id:session.get("teamId"),
                        user:item.user._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            _this.showDialog=false;
                            $.notify("转让成功",1);
                            _this.$store.dispatch("team/changeToList",null,{
                                root:true
                            })
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            }
        }
    }
</script>