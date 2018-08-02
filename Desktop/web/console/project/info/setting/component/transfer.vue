<template>
    <el-dialog title="项目转让" :visible.sync="showDialog"  width="50%" ref="box" :close-on-click-modal="false" append-to-body>
        <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
            <el-col class="col" :span="4">
                筛选
            </el-col>
            <el-col class="col" :span="20">
                <el-input size="small" style="width: 90%" placeholder="请输入你要筛选的用户" v-model="filter"></el-input>
            </el-col>
        </el-row>
        <table style="width: 100%;" class="table-hover">
            <tbody style="max-height: 300px;overflow: auto;">
            <template v-for="item in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 30%">
                        <img v-proxy="item.photo" style="border-radius: 30px" width="50" height="50">
                    </td>
                    <td style="width: 45%">
                        {{item.name}}
                    </td>
                    <td style="width: 25%">
                        <el-button  style="font-size: 15px" size="mini" @click="transfer(item)" type="text">转让</el-button>
                    </td>
                </tr>
            </template>
            </tbody>
        </table>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    module.exports={
        props:["source","type"],
        data:function () {
            return {
                filter:"",
                savePending:false,
                arrMember:function () {
                    return this.source.filter(function (obj) {
                        if(obj._id==session.get("id"))
                        {
                            return false
                        }
                        else
                        {
                            return true;
                        }
                    })
                }.call(this),
                showDialog:false
            }
        },
        directives:{
            proxy:proxyImg
        },
        computed:{
            arr:function () {
                var _this=this;
                return this.arrMember.filter(function (obj) {
                    if(obj.name.toLowerCase().indexOf(_this.filter.toLowerCase())>-1)
                    {
                        return true
                    }
                    else
                    {
                        return false;
                    }
                })

            }
        },
        methods:{
            transfer:function (item) {
                var _this=this;
                $.confirm("是否确认将该项目转让给用户"+item.name,function () {
                    $.startHud();
                    var pro;
                    if(_this.type=="interface")
                    {
                        pro=net.put("/project/owner",{
                            id:session.get("projectId"),
                            user:item._id
                        })
                    }
                    else if(_this.type=="doc")
                    {
                        pro=net.put("/doc/owner",{
                            project:session.get("projectId"),
                            user:item._id
                        })
                    }
                    else if(_this.type=="test")
                    {
                        pro=net.put("/test/owner",{
                            project:session.get("projectId"),
                            user:item._id
                        })
                    }
                    pro.then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            _this.showDialog=false;
                            $.tip("转让成功",1);
                            _this.$store.dispatch("changeToList",null,{
                                root:true
                            })
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                })
            }
        }
    }
</script>
