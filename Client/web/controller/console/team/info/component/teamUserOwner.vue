<template>
    <el-dialog title="设置项目所有者" width="50%" ref="box" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="height: 50px;line-height: 50px">
            请设置以下项目的新的所有者
        </el-row>
        <el-row class="row" style="text-align: center;height: 300px;overflow-y: auto">
            <template v-for="item in arrProject">
                <el-row class="row" style="height: 40px;line-height: 40px" :key="item._id">
                    <el-col class="col" :span="18">
                        {{item.name}}
                    </el-col>
                    <el-col class="col" :span="6">
                        <el-button size="mini" type="primary" v-if="item.handle==0" @click="setOwner(item)">
                            设置所有者
                        </el-button>
                        <span v-else>
                            已设置
                        </span>
                    </el-col>
                </el-row>
            </template>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" :loading="savePending">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["arr","user","self"],
        data:function () {
            return {
                savePending:false,
                arrProject:function () {
                    return this.arr.map(function (obj) {
                        obj.handle=0;
                        return obj;
                    })
                }.call(this),
                showDialog:false
            }
        },
        methods:{
            save:function () {
                var bHandle=true;
                this.arrProject.forEach(function (obj) {
                    if(obj.handle==0)
                    {
                        bHandle=false;
                    }
                })
                if(!bHandle)
                {
                    $.tip("请将所有的项目设置新的管理员",0);
                    return;
                }
                var _this=this;
                this.savePending=true;
                var query={
                    id:session.get("teamId"),
                    user:this.user
                };
                if(this.self)
                {
                    query.self=1;
                }
                net.delete("/team/user",query).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("删除成功",1);
                        _this.$emit("remove");
                        _this.showDialog=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            },
            setOwner:function (item) {
                var _this=this;
                net.get("/team/projectuser",{
                    id:session.get("teamId"),
                    project:item._id
                }).then(function (data) {
                    var child=$.showBox(_this,require("./teamUserOwnerSelect.vue"),{
                        arr:data.data,
                        id:item._id
                    })
                    child.$on("save",function () {
                        item.handle=1;
                    })
                });
            }
        }
    }
</script>