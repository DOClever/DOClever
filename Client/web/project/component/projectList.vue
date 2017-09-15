<template>
    <div style="width: 100%;">
        <table style="background-color: transparent;width: 100%;height: 100%" v-if="arrCreate.length>0">
            <thead>
                <th style="text-align: left;font-size: 20px">
                    我创建的:
                </th>
                <th>
                    &nbsp;
                </th>
                <th>
                    &nbsp;
                </th>
                <th style="text-align: right;font-size: 15px">
                    排序：
                    <el-select v-model="$store.state.projectCreateSort" @input="changeSortCreate" style="width: 120px">
                        <el-option label="创建时间" :value="0"></el-option>
                        <el-option label="名称" :value="1"></el-option>
                    </el-select>
                </th>
            </thead>
            <tbody>
            <template v-for="n in arrCreateLength">
                <tr>
                    <template v-for="index in 4">
                        <td  style="padding: 10px;height: 150px;width: 25%">
                            <div v-if="arrCreate[(n-1)*4+(index-1)]" class="item" :style="{backgroundImage: 'url(\'../pic/back'+index+'.jpg\')',borderRadius:'5px',color:'gray',fontSize:'25px',wordBreak: 'break-all',display:'table'}" @click="info(arrCreate[(n-1)*4+(index-1)])" @mouseenter="up($event)" @mouseleave="down($event)">
                                <div style="display: table-cell;vertical-align: middle">
                                    {{arrCreate[(n-1)*4+(index-1)].name}}
                                </div>
                                <el-row class="row" style="height: 30px;line-height:30px;font-size: 15px;color: gray;position: absolute;left: 0;bottom: 0;text-align: left;background-color: rgba(215,215,215,0.51)">
                                    &nbsp;{{"成员:"+arrCreate[(n-1)*4+(index-1)].userCount}}&nbsp;
                                    {{"接口:"+arrCreate[(n-1)*4+(index-1)].interfaceCount}}
                                </el-row>
                            </div>
                        </td>
                    </template>
                </tr>
            </template>
            </tbody>
        </table>
        <table style="background-color: transparent;width: 100%;height: 100%" v-if="arrJoin.length>0">
            <thead>
                <th style="text-align: left;font-size: 20px">
                    我加入的:
                </th>
                <th>
                    &nbsp;
                </th>
                <th>
                    &nbsp;
                </th>
                <th style="text-align: right;font-size: 15px">
                    排序：
                    <el-select v-model="$store.state.projectJoinSort" @input="changeSortJoin" style="width: 120px">
                        <el-option label="创建时间" :value="0"></el-option>
                        <el-option label="名称" :value="1"></el-option>
                    </el-select>
                </th>
            </thead>
            <tbody>
            <template v-for="n in arrJoinLength">
                <tr>
                    <template v-for="index in 4">
                        <td  style="padding: 10px;height: 150px;width: 25%">
                            <div v-if="arrJoin[(n-1)*4+(index-1)]" class="item" :style="{backgroundImage: 'url(\'../pic/back'+index+'.jpg\')',borderRadius:'5px',color:'gray',fontSize:'25px',wordBreak: 'break-all',display:'table'}" @click="info(arrJoin[(n-1)*4+(index-1)])" @mouseenter="up($event)" @mouseleave="down($event)">
                                <div style="display: table-cell;vertical-align: middle">
                                    {{arrJoin[(n-1)*4+(index-1)].name}}
                                </div>
                                <el-row class="row" style="height: 30px;line-height:30px;font-size: 15px;color: gray;position: absolute;left: 0;bottom: 0;text-align: left;background-color: rgba(215,215,215,0.51)">
                                    &nbsp;{{"成员:"+arrJoin[(n-1)*4+(index-1)].userCount}}&nbsp;
                                    {{"接口:"+arrJoin[(n-1)*4+(index-1)].interfaceCount}}
                                </el-row>
                            </div>
                        </td>
                    </template>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>
<style>
    .item{
        text-align: center;font-size:20px;color: #50a3ff;width: 100%;height: 100%;cursor: pointer;position: relative;box-shadow: 2px 2px 2px #888888;
    }
    @keyframes up {
        from {top:0px}
        to {top:-10px}
    }
    @keyframes down {
        from {top:-10px}
        to {top:0px}
    }
</style>
<script>
    module.exports={
        data:function () {
            return {

            }
        },
        computed:{
            arrCreate:function () {
                return this.$store.state.projectCreateList;
            },
            arrJoin:function () {
                return this.$store.state.projectJoinList;
            },
            arrCreateLength:function () {
                return Math.floor(this.arrCreate.length/4)+1
            },
            arrJoinLength:function () {
                return Math.floor(this.arrJoin.length/4)+1
            }
        },
        methods:{
            info:function (item) {
                session.set("projectId",item._id);
                session.set("projectName",item.name);
                location.href="/html/web/projectinfo/projectinfo.html";
            },
            up:function (event) {
                event.target.style.animation="up 0.2s ease-out forwards"
            },
            down:function (event) {
                event.target.style.animation="down 0.2s ease-out forwards"
            },
            changeSortCreate:function () {
                this.$store.commit("changeProjectSortCreate");
            },
            changeSortJoin:function () {
                this.$store.commit("changeProjectSortJoin");
            }
        }
    }
</script>
