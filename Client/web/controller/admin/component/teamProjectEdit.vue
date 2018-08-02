<template>
    <el-dialog title="管理项目" width="80%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-tabs v-model="category" type="card">
            <el-tab-pane label="接口" :name="0">
                <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                    <el-col class="col" :span="4">
                        项目ID
                    </el-col>
                    <el-col class="col" :span="16">
                        <el-input size="small" style="width: 90%" placeholder="请输入项目ID" v-model="newId"></el-input>
                    </el-col>
                    <el-col class="col" :span="4">
                        <el-button size="mini" type="primary" @click="add" :loading="pullPending">
                            拉入
                        </el-button>
                    </el-col>
                </el-row>
                <el-row class="row" style="height: 300px;overflow-y: auto">
                    <table class="table-hover" style="width: 100%">
                        <thead>
                        <th>
                            名称
                        </th>
                        <th>
                            创建时间
                        </th>
                        <th>
                            创建者
                        </th>
                        <th>
                            接口数
                        </th>
                        <th>
                            用户数
                        </th>
                        <th>
                            公开
                        </th>
                        <th>
                            操作
                        </th>
                        </thead>
                        <template v-for="(item,index) in arr">
                            <tr style="height: 50px;text-align: center;vertical-align: middle">
                                <td style="width: 20%">
                                    {{item.name}}
                                </td>
                                <td style="width: 20%">
                                    {{item.createdAt}}
                                </td>
                                <td style="width: 20%">
                                    {{item.owner.name}}
                                </td>
                                <td style="width: 10%">
                                    {{item.interfaceCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.userCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.public?"公开":"不公开"}}
                                </td>
                                <td style="width: 10%">
                                    <el-button size="mini" type="text" title="踢出" icon="el-icon-close" style="color: red" @click="quit(item,index)"></el-button>
                                </td>
                            </tr>
                        </template>
                    </table>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="文档" :name="1">
                <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                    <el-col class="col" :span="4">
                        项目ID
                    </el-col>
                    <el-col class="col" :span="16">
                        <el-input size="small" style="width: 90%" placeholder="请输入项目ID" v-model="newId"></el-input>
                    </el-col>
                    <el-col class="col" :span="4">
                        <el-button size="mini" type="primary" @click="add" :loading="pullPending">
                            拉入
                        </el-button>
                    </el-col>
                </el-row>
                <el-row class="row" style="height: 300px;overflow-y: auto">
                    <table class="table-hover" style="width: 100%">
                        <thead>
                        <th>
                            名称
                        </th>
                        <th>
                            创建时间
                        </th>
                        <th>
                            创建者
                        </th>
                        <th>
                            文档数
                        </th>
                        <th>
                            用户数
                        </th>
                        <th>
                            公开
                        </th>
                        <th>
                            操作
                        </th>
                        </thead>
                        <template v-for="(item,index) in arr">
                            <tr style="height: 50px;text-align: center;vertical-align: middle">
                                <td style="width: 20%">
                                    {{item.name}}
                                </td>
                                <td style="width: 20%">
                                    {{item.createdAt}}
                                </td>
                                <td style="width: 20%">
                                    {{item.owner.name}}
                                </td>
                                <td style="width: 10%">
                                    {{item.docCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.userCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.public?"公开":"不公开"}}
                                </td>
                                <td style="width: 10%">
                                    <el-button size="mini" type="text" title="踢出" icon="el-icon-close" style="color: red" @click="quit(item,index)"></el-button>
                                </td>
                            </tr>
                        </template>
                    </table>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="测试" :name="2">
                <el-row class="row" style="height: 50px;line-height: 50px;text-align: center">
                    <el-col class="col" :span="4">
                        项目ID
                    </el-col>
                    <el-col class="col" :span="16">
                        <el-input size="small" style="width: 90%" placeholder="请输入项目ID" v-model="newId"></el-input>
                    </el-col>
                    <el-col class="col" :span="4">
                        <el-button size="mini" type="primary" @click="add" :loading="pullPending">
                            拉入
                        </el-button>
                    </el-col>
                </el-row>
                <el-row class="row" style="height: 300px;overflow-y: auto">
                    <table class="table-hover" style="width: 100%">
                        <thead>
                        <th>
                            名称
                        </th>
                        <th>
                            创建时间
                        </th>
                        <th>
                            创建者
                        </th>
                        <th>
                            测试数
                        </th>
                        <th>
                            用户数
                        </th>
                        <th>
                            公开
                        </th>
                        <th>
                            操作
                        </th>
                        </thead>
                        <template v-for="(item,index) in arr">
                            <tr style="height: 50px;text-align: center;vertical-align: middle">
                                <td style="width: 20%">
                                    {{item.name}}
                                </td>
                                <td style="width: 20%">
                                    {{item.createdAt}}
                                </td>
                                <td style="width: 20%">
                                    {{item.owner.name}}
                                </td>
                                <td style="width: 10%">
                                    {{item.testCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.userCount}}
                                </td>
                                <td style="width: 10%">
                                    {{item.public?"公开":"不公开"}}
                                </td>
                                <td style="width: 10%">
                                    <el-button size="mini" type="text" title="踢出" icon="el-icon-close" style="color: red" @click="quit(item,index)"></el-button>
                                </td>
                            </tr>
                        </template>
                    </table>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["propObj","teamId"],
        data:function () {
            return {
                showDialog:false,
                newId:"",
                arr:this.propObj,
                pullPending:false,
                category:0
            }
        },
        computed:{

        },
        methods:{
            add:function () {
                if(!this.newId)
                {
                    $.tip("请输入项目的ID",0);
                    return;
                }
                var _this=this;
                this.pullPending=true;
                this.$store.dispatch("pullTeamProject",{
                    id:this.teamId,
                    project:this.newId,
                    category:this.category
                }).then(function (data) {
                    _this.pullPending=false;
                    if(data.code==200)
                    {
                        $.notify("拉入成功",1);
                        _this.arr.push(data.data);
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            },
            quit:function (item,index) {
                var _this=this;
                $.confirm("是否确认移除该项目",function () {
                    $.startHud();
                    _this.$store.dispatch("pushTeamProject",{
                        id:_this.teamId,
                        project:item._id,
                        category:_this.category
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("移除成功",1);
                            _this.arr.splice(index,1);
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