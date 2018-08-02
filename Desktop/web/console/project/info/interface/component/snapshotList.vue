<template>
    <el-dialog title="快照列表"  width="80%" ref="box" :visible="showDialog" append-to-body>
        <el-row class="row" style="height: 300px;overflow-y: auto">
            <table style="width: 100%" class="table-hover">
                <thead>
                    <th>
                        日期
                    </th>
                    <th>
                        创建者
                    </th>
                    <th>
                        描述
                    </th>
                    <th>
                        操作
                    </th>
                </thead>
                <tbody>
                    <template v-for="item in arrSnapshot">
                        <tr style="text-align: center;vertical-align: middle;height: 50px">
                            <td style="width: 20%">
                                {{item.createdAt}}
                            </td>
                            <td style="width: 20%">
                                {{item.snapshotCreator.name}}
                            </td>
                            <td style="width: 30%">
                                {{item.snapshot}}
                            </td>
                            <td style="width: 30%">
                                <el-button type="primary" size="mini" @click="switchSnapshot(item,index)">
                                    切换
                                </el-button>&nbsp;&nbsp;<el-button type="danger" size="mini" @click="roll(item,index)">
                                回滚
                            </el-button>&nbsp;&nbsp;<el-button type="danger" size="mini" @click="remove(item,index)">
                                删除
                            </el-button>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tfoot>
                <tr style="text-align: center;vertical-align: middle">
                    <td colspan="4">
                        <page @change="changePage"></page>
                    </td>
                </tr>
                </tfoot>
            </table>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="create" v-if="!snapshot.id">
                创建新快照
            </el-button>
            <el-button type="primary" @click="returnToMaster" v-else>
                返回主干
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var page=require("component/page.vue")
    module.exports={
        props:["arr","id","snapshot"],
        data:function () {
            return {
                arrSnapshot:this.arr,
                showDialog:false
            }
        },
        components:{
            "page":page
        },
        methods:{
            switchSnapshot:function (item,index) {
                var _this=this;
                $.confirm("是否切换到该快照?",function () {
                    $.startHud("#body");
                    session.set("snapshotId",item._id);
                    session.set("snapshotDis",item.snapshot);
                    session.set("snapshotCreator",item.snapshotCreator._id);
                    session.set("snapshotDate",item.createdAt);
                    _this.$store.dispatch("init",{
                        _id:item._id,
                        group:item.group._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("切换成功",1);
                            _this.showDialog=false;
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            roll:function (item,index) {
                var _this=this;
                $.confirm("是否回滚该快照",function () {
                    $.startHud();
                    net.put("/interface/snapshotroll",{
                        id:item._id
                    },{
                        "docleversnapshot":item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("回滚成功",1);
                            session.remove("snapshotId");
                            session.remove("snapshotDis");
                            session.remove("snapshotCreator");
                            session.remove("snapshotDate");
                            _this.$store.dispatch("info",{
                                _id:item._id,
                                group:""
                            }).then(function (data) {
                                $.stopHud();
                                if(data.code==200)
                                {
                                    $.tip("回滚成功",1);
                                }
                                else
                                {
                                    $.tip(data.msg,0);
                                }
                            })
                            _this.showDialog=false;
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                })
            },
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否删除该快照",function () {
                    $.startHud();
                    net.delete("/interface/snapshot",{
                        id:item._id
                    },{
                        "docleversnapshot":item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("删除成功",1);
                            if(session.get("snapshotId")==item._id)
                            {
                                session.remove("snapshotId");
                                session.remove("snapshotDis");
                                session.remove("snapshotCreator");
                                session.remove("snapshotDate");
                                _this.$store.dispatch("init",{
                                    _id:item._id,
                                    group:""
                                }).then(function (data) {
                                    $.stopHud();
                                    if(data.code==200)
                                    {
                                        $.tip("切换到主干",1);
                                    }
                                    else
                                    {
                                        $.tip(data.msg,0);
                                    }
                                })
                            }
                            _this.showDialog=false;
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                })
            },
            changePage:function (page) {
                var _this=this;
                $.startHud();
                net.get("/interface/snapshotlist",{
                    id:this.id,
                    page:page
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        _this.arrSnapshot=data.data
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            },
            create:function () {
                this.$emit("create");
                this.showDialog=false;
            },
            returnToMaster:function () {
                this.$emit("return");
                this.showDialog=false;
            }
        }
    }
</script>