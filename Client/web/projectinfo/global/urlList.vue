<template>
    <div style="width: 100%">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 50%">
                        <el-input style="width: 90%;margin: 0 auto" placeholder="请填写BaseUrl地址" v-model="item.url"></el-input>
                    </td>
                    <td style="width: 30%">
                        <el-input style="width: 90%;margin: 0 auto" placeholder="请填写环境变量备注" v-model="item.remark"></el-input>
                    </td>
                    <td style="width: 10%">
                        <el-button type="text" size="small" style="font-size: 15px;" @click="edit(item)" icon="edit" title="修改变量"></el-button>
                    </td>
                    <td style="width: 10%">
                        <el-button type="text" size="small" style="color: red;font-size: 15px;" @click="remove(index)" icon="close" v-if="globalBaseUrlRole"></el-button>
                    </td>
                </tr>
            </template>
            <tfoot v-if="globalBaseUrlRole">
            <tr>
                <td style="text-align: center;vertical-align: middle;width: 100%;padding: 20px" colspan="4">
                    <el-col class="el-col" :span="12">
                        <el-button type="primary" style="width: 60%" @click="arr.push({url:'',remark:'',env:[]})" :loading="addPending">
                            新增
                        </el-button>
                    </el-col>
                    <el-col class="el-col" :span="12">
                        <el-button type="primary" style="width: 60%" @click="save" :loading="savePending">
                            保存
                        </el-button>
                    </el-col>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
    var sessionChange=require("../../mixins/session");
    var env=require("./env.vue");
    module.exports={
        data:function () {
            return {
                arr:[],
                savePending:false,
                addPending:false
            }
        },
        computed:{
            globalBaseUrlRole:function () {
                return this.$store.getters.globalBaseUrlRole;
            },
        },
        mixins:[sessionChange],
        methods:{
            remove:function (index) {
                if(this.arr.length>1)
                {
                    this.arr.splice(index,1)
                }
                else
                {
                    this.arr[0].url="";
                    this.arr[0].remark="";
                }
            },
            save:function () {
                var arr=[];
                this.arr.forEach(function (obj) {
                    if(obj.url)
                    {
                        arr.push(obj);
                    }
                })
                var _this=this;
                this.savePending=true;
                net.put("/project/url",{
                    id:session.get("projectId"),
                    urls:JSON.stringify(arr)
                }).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        _this.$store.dispatch("setBaseUrls",data.data);
                    }
                })
            },
            edit:function (item) {
                if(!item.env)
                {
                    Vue.set(item,"env",[]);
                }
                $.showBox(this,env,{
                    propObj:item.env
                });
            }
        },
        created:function () {
            var _this=this;
            this.$store.getters.event.$on("init",function () {
                if(_this.$store.getters.baseUrls.length>0)
                {
                    _this.arr=$.clone(_this.$store.getters.baseUrls)
                }
                else
                {
                    _this.arr=[{
                        url:"",
                        remark:""
                    }]
                }
            })
        }
    }
</script>
