<template>
    <div style="width: 100%;">
        <table style="background-color: transparent;width: 100%;height: 100%">
            <template v-for="n in arrLength">
                <tr>
                    <template v-for="index in 4">
                        <td  style="padding: 10px;height: 150px;width: 25%">
                            <div v-if="arr[(n-1)*4+(index-1)]" class="item" :style="{backgroundImage: 'url(\'../pic/back'+index+'.jpg\')',borderRadius:'5px',color:'gray',fontSize:'25px'}" @click="info(arr[(n-1)*4+(index-1)])" @mouseenter="up($event)" @mouseleave="down($event)">
                                {{arr[(n-1)*4+(index-1)].name}}
                                <el-row class="row" style="height: 30px;line-height:30px;font-size: 15px;color: gray;position: absolute;left: 0;bottom: 0;text-align: left;background-color: rgba(215,215,215,0.51)">
                                    &nbsp;{{"成员:"+arr[(n-1)*4+(index-1)].userCount}}&nbsp;
                                        {{"接口:"+arr[(n-1)*4+(index-1)].interfaceCount}}
                                </el-row>
                            </div>
                        </td>
                    </template>
                </tr>

            </template>
        </table>
    </div>
</template>
<style>
    .item{
        text-align: center;font-size:20px;color: #50a3ff;width: 100%;height: 100%;cursor: pointer;position: relative;box-shadow: 2px 2px 2px #888888;line-height: 150px;
    }
    @keyframes up {
        from {top:0px}
        to {top:-20px}
    }
    @keyframes down {
        from {top:-20px}
        to {top:0px}
    }
</style>
<script>
    module.exports={
        props:["arr"],
        data:function () {
            return {

            }
        },
        computed:{
          arrLength:function () {
              return Math.floor(this.arr.length/4)+1
          }
        },
        methods:{
            info:function (item) {
                session.set("projectId",item._id);
                session.set("projectName",item.name);
                session.set("role",item.role);
                session.set("own",item.own);
                location.href="/html/web/projectinfo/projectinfo.html";
            },
            setting:function (item) {
                session.set("projectId",item._id);
                session.set("projectName",item.name);
                session.set("role",item.role);
                session.set("own",item.own);
            },
            up:function (event) {
                event.target.style.animation="up 0.2s ease-out forwards"
            },
            down:function (event) {
                event.target.style.animation="down 0.2s ease-out forwards"
            }
        },
        events:{

        }
    }
</script>
