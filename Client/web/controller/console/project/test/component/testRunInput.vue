<template>
    <el-dialog title="输入窗口" :visible.sync="showDialog" width="50%" ref="box" :close-on-click-modal="false" append-to-body>
        <el-row class="row" style="height: 30px;line-height: 30px;font-size: 20px">
            {{title+"(用例："+name+")"}}
        </el-row>
        <el-row class="row" style="height: 200px;overflow: auto;margin-top: 20px">
            <template v-if="type==0">
                <el-row class="row" style="font-size: 15px;min-height: 25px;line-height: 25px;word-break: break-all" v-html="item" v-for="item in obj">
                </el-row>
            </template>
            <img :src="obj" v-else-if="type==1">
            <pre v-else>{{obj}}</pre>
        </el-row>
        <el-row class="row" style="height: 1px;background-color: gray;margin-top: 20px;margin-bottom: 20px"></el-row>
        <el-row class="row" style="text-align: center">
            <el-input size="small" type="textarea" v-model="val" :rows="5" placeholder="请输入您需要返回的值"></el-input>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["data","name","title"],
        data:function () {
            return {
                val:"",
                showDialog:false
            }
        },
        computed:{
            type:function () {
                if(typeof(this.data)=="object" && !(this.data instanceof Blob))
                {
                    return 0;
                }
                else if(typeof(this.data)=="object" && (this.data instanceof Blob))
                {
                    return 1;
                }
                else
                {
                    return 2;
                }
            },
            obj:function () {
                if(this.type==0)
                {
                    var data=JSON.stringify(this.data);
                    return helper.format(data,0,[],[]).draw;
                }
                else if(this.type==1)
                {
                    return $.createUrlObject(this.data);
                }
                else
                {
                    return this.data;
                }
            }
        },
        methods:{
            save:function () {
                if(this.type==1)
                {
                    $.revokeUrlObject(this.obj);
                }
                this.$emit("save",$.trim(this.val));
                this.showDialog=false;
            }
        },
        mounted:function () {
            var _this=this;
            this.$refs.box.$on("close",function () {
                if(_this.type==1)
                {
                    $.revokeUrlObject(_this.obj);
                }
            })
        }
    }
</script>
