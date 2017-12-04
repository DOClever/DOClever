<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;padding-bottom: 20px">
                <el-button size="mini" type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    每日数据列表
                </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-show="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;">
                            每日数据列表
                        </h4>
                    </el-row>
                    <el-row class="row" style="text-align: center">
                        <el-col class="col" :span="10">
                            <el-date-picker v-model="start" placeholder="起始日期"></el-date-picker>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-date-picker v-model="end" placeholder="结束日期"></el-date-picker>
                        </el-col>
                        <el-col class="col" :span="4">
                            <el-button size="mini" type="primary" @click="scan" :loading="scanPending">查询</el-button>
                        </el-col>
                    </el-row>
                    <el-row class="row" style="padding-bottom: 20px;margin-top: 20px">
                        <table class="table-hover" style="width: 100%">
                            <thead>
                            <th>
                                日期
                            </th>
                            <th>
                                用户数
                            </th>
                            <th>
                                注册用户
                            </th>
                            <th>
                                登录用户
                            </th>
                            <th>
                                新增项目
                            </th>
                            <th>
                                新增团队
                            </th>
                            <th>
                                新增接口
                            </th>
                            </thead>
                            <template v-for="item in arr">
                                <tr style="height: 50px;text-align: center;vertical-align: middle">
                                    <td style="width: 30%">
                                        {{item.date}}
                                    </td>
                                    <td style="width: 10%">
                                        {{item.user}}
                                    </td>
                                    <td style="width: 10%">
                                        {{item.userRegister}}
                                    </td>
                                    <td style="width: 10%">
                                        {{item.userLogin}}
                                    </td>
                                    <td style="width: 10%">
                                        {{item.project}}
                                    </td>
                                    <td style="width: 10%">
                                        {{item.team}}
                                    </td>
                                    <td style="width: 10%">
                                        {{item.interface}}
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </el-row>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    module.exports={
        data:function () {
            return {
                type:0,
                start:function () {
                    var date=new Date();
                    date.setDate(date.getDate()-1);
                    return date;
                }.call(this),
                end:function () {
                    var date=new Date();
                    date.setDate(date.getDate()-1);
                    return date;
                }.call(this),
                arr:[],
                scanPending:false
            }
        },
        computed:{

        },
        components:{

        },
        methods: {
            scan:function () {
                var _this=this;
                this.scanPending=true;
                net.get("/admin/statisticlist",{
                    start:$.getNowFormatDate("yyyy-MM-dd",this.start),
                    end:$.getNowFormatDate("yyyy-MM-dd",this.end)
                }).then(function (data) {
                    _this.scanPending=false;
                    if(data.code==200)
                    {
                        _this.arr=data.data;
                    }
                    else
                    {
                        $.notify(data.msg,0)
                    }
                })
            }
        }
    }
</script>
