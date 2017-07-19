<template>
    <el-dialog title="消息中心"  size="small" ref="box" >
        <el-row class="row" v-scroll="loadMore" style="height: 300px;overflow-y: auto">
            <template v-for="item in arr">
                <el-row class="row" style="font-size: 17px;height: 30px;line-height: 30px">
                    {{item.name}}
                </el-row>
                <el-row class="row" style="font-size: 15px">
                    {{item.dis}}
                </el-row>
                <el-row class="row" style="color: gray;height: 30px;line-height: 30px">
                    {{item.createdAt}}&nbsp;&nbsp;&nbsp;
                    <el-button type="text" size="small" style="color:#FF4949" icon="delete2" @click="remove(item,index)" titile="删除">
                    </el-button>
                </el-row>
            </template>
            <el-row class="row" :loading="loading" style="height: 30px" v-if="!finish">

            </el-row>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="danger" @click="clear" :loading="clearPending">
                清空消息
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var scroll=require("../director/scroll")
    module.exports={
        props:["propArr"],
        data:function () {
            return {
                arr:this.propArr,
                page:0,
                clearPending:false,
                loading:false,
                finish:false
            }
        },
        directives:{
            scroll:scroll
        },
        methods:{
            remove:function (item,index) {
                var _this=this;
                $.confirm("是否删除该消息",function () {
                    $.startHud()
                    net.delete("/message/item",{
                        id:item._id
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("删除成功",1);
                            _this.arr.splice(index,1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            clear:function () {
                var _this=this;
                $.confirm("是否清空所有消息",function () {
                    _this.clearPending=true;
                    net.delete("/message/clear").then(function (data) {
                        _this.clearPending=false;
                        if(data.code==200)
                        {
                            $.notify("清空成功",1);
                            _this.$refs.box.close();
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            loadMore:function (finish) {
                var _this=this;
                this.loading=true;
                net.get("/message/list",{
                    page:++this.page
                }).then(function (data) {
                    if(data.code==200)
                    {
                        _this.loading=false;
                        if(data.data.length>0)
                        {
                            _this.arr=_this.arr.concat(data.data);
                            finish()
                        }
                        else
                        {
                            finish(1);
                            _this.finish=true;
                        }
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