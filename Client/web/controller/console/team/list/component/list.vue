<template>
    <div style="width: 100%;">
        <table style="background-color: transparent;width: 100%;height: 100%" v-if="arr.length>0">
            <tbody>
            <tr v-for="n in arrLength">
                <td v-for="index in 5" style="padding: 10px;width: 20%;height: 120px">
                    <el-row v-if="arr[(n-1)*5+(index-1)]" :style="{borderRadius:'5px',color:'gray'}" style="text-align: center;height: 100%;cursor: pointer;border: 1px #ebebeb solid;" @click.native="info(arr[(n-1)*5+(index-1)])">
                        <el-row class="row" style="height: 65px;">
                            <div type="primary" size="small" style="width: 26px;height: 26px;line-height:26px;border-radius: 13px;display: inline-block;font-size: 14px;color:white;margin-top: 15px " :style="{backgroundColor:color(arr[(n-1)*5+(index-1)])}">
                                团
                            </div>
                            <div style="font-size: 14px;color: black;display: table;table-layout: fixed;width: 100%;margin-top: 5px"><div style="display: table-cell;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">{{arr[(n-1)*5+(index-1)].name}}</div></div>
                        </el-row>
                        <el-row class="row" style="height: 30px;line-height: 30px;font-size: 13px;display: table;table-layout: fixed;">
                            <div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;display: table-cell;height: 25px">
                                {{arr[(n-1)*5+(index-1)].dis?arr[(n-1)*5+(index-1)].dis:"&nbsp;"}}
                            </div>
                        </el-row>
                        <el-row class="row" style="height: 25px;line-height:25px;font-size: 12px;color: #b9b9b9;border-top: 1px lightgray solid;background-color: rgb(245,246,249)">
                            <el-col class="col" :span="12" style="border-right: 1px lightgray solid;">
                                {{"成员:"+arr[(n-1)*5+(index-1)].userCount}}
                            </el-col>
                            <el-col class="col" :span="12">
                                {{"项目:"+(arr[(n-1)*5+(index-1)].projectCount+arr[(n-1)*5+(index-1)].docCount)}}
                            </el-col>
                        </el-row>
                    </el-row>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
    .el-row::after, .el-row::before {
        display: none;
    }
</style>
<script>
    module.exports={
        props:["type"],
        data:function () {
            return {

            }
        },
        computed:{
            arr:function () {
                if(this.type=="create")
                {
                    return this.$store.state.teamCreateList;
                }
                else if(this.type=="join")
                {
                    return this.$store.state.teamJoinList;
                }
            },
            arrLength:function () {
                var val=this.arr.length/5;
                return Math.floor(val)===val?val:(Math.floor(val)+1)
            }
        },
        methods:{
            color:function (item) {
                if(item.own)
                {
                    return "#17b9e6"
                }
                else
                {
                    if(item.role==0)
                    {
                        return "#17b9e6"
                    }
                    else
                    {
                        return "#67C23A";
                    }
                }
            },
            info:function (item) {
                this.$store.dispatch("info",{
                    id:item._id,
                    name:item.name
                })
            },
            changeSort:function () {
                this.$store.commit("changeTeamSort",this.type);
            },
        }
    }
</script>
