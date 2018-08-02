<template>
    <div style="width: 100%">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="vertical-align: middle;height: 40px">
                    <td style="width: 50%">
                        <el-input size="small" style="width: 90%;margin: 0 auto" placeholder="请填写BaseUrl地址" v-model="item.url"></el-input>
                    </td>
                    <td style="width: 30%">
                        <el-input size="small" style="width: 90%;margin: 0 auto" placeholder="请填写环境变量备注" v-model="item.remark"></el-input>
                    </td>
                    <td style="width: 10%">
                        <el-button type="text" size="mini" style="font-size: 15px;" @click="edit(item)" icon="el-icon-edit" title="修改变量"></el-button>
                    </td>
                    <td style="width: 10%">
                        <el-button type="text" size="mini" style="color: red;font-size: 15px;" @click="remove(index)" icon="el-icon-close" v-if="globalBaseUrlRole"></el-button>
                    </td>
                </tr>
            </template>
            <tfoot v-if="globalBaseUrlRole">
            <tr>
                <td style="vertical-align: middle;padding-top: 10px" colspan="4">
                    <el-button size="mini" type="primary" @click="arr.push({url:'',remark:'',env:[]})" :loading="addPending">
                        新增
                    </el-button>&nbsp;&nbsp;
                    <el-button size="mini" type="primary" @click="save" :loading="savePending">
                        保存
                    </el-button>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
    var sessionChange=require("common/mixins/session");
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
                        $.tip("修改成功",1);
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
            },
            init:function () {
                if(this.$store.getters.baseUrls.length>0)
                {
                    this.arr=$.clone(this.$store.getters.baseUrls)
                }
                else
                {
                    this.arr=[{
                        url:"",
                        remark:""
                    }]
                }
            },
            addBaseUrl:function (obj) {
                this.arr.push($.clone(obj));
            }
        },
        created:function () {
            this.$store.getters.event.$on("init",this.init)
            this.$store.getters.event.$on("addBaseUrl",this.addBaseUrl)
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("init",this.init)
            this.$store.getters.event.$off("addBaseUrl",this.addBaseUrl)
        }
    }
</script>
