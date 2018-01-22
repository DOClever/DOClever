<template>
    <el-dialog title="编辑协助者"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-row class="row" style="height: 50px;line-height: 50px;text-align: center" v-for="item in arr">
                <el-col class="col" :span="4">
                    <img v-proxy="item.photo" style="border-radius: 20px;margin-top: 5px;"  width="40" height="40">
                </el-col>
                <el-col class="col" :span="12">
                    {{item.name}}
                </el-col>
                <el-col class="col" :span="6">
                    <el-select size="mini" v-model="item.access" style="width: 90%">
                        <el-option :value="0" label="只读"></el-option>
                        <el-option :value="1" label="可写"></el-option>
                    </el-select>
                </el-col>
            </el-row>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" :loading="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var proxyImg=require("common/director/proxyImg")
    module.exports={
        props:["arrUser","arrCooperation"],
        data:function () {
            return {
                showDialog:false,
                savePending:false,
                arr:function () {
                    var arr=[];
                    var _this=this;
                    this.arrUser.forEach(function (obj) {
                        if(obj._id==session.get("id"))
                        {
                            return;
                        }
                        var o={
                            name:obj.name,
                            photo:obj.photo,
                            _id:obj._id
                        }
                        if(_this.arrCooperation.indexOf(o._id)>-1)
                        {
                            o.access=1;
                        }
                        else
                        {
                            o.access=0
                        }
                        arr.push(o);
                    })
                    return arr;
                }.call(this)
            }
        },
        directives:{
            proxy:proxyImg
        },
        computed:{

        },
        methods:{
            save:function () {
                var arr=[];
                this.arr.forEach(function (obj) {
                    if(obj.access)
                    {
                        arr.push(obj._id)
                    }
                })
                this.savePending=true;
                var _this=this;
                net.post("/test/cooperation",{
                    project:session.get("projectId"),
                    users:JSON.stringify(arr)
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                        _this.showDialog=false;
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