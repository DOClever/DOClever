<template>
    <el-dialog title="复制节点"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row" style="text-align: center;height: 50px;line-height: 50px">
            <el-checkbox v-model="remark" :true-label="1" :false-label="0">包含备注</el-checkbox>
            <el-checkbox v-model="mock" :true-label="1" :false-label="0">包含{{type=="body"?"参考值":"mock"}}</el-checkbox>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" size="small">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["source","type"],
        data:function () {
            return {
                showDialog:false,
                remark:1,
                mock:1
            }
        },
        computed:{

        },
        methods:{
            save:function () {
                var _this=this;
                var obj=$.clone(this.source);
                if(this.remark==0 || this.mock==0)
                {
                    (function (item) {
                        if(_this.remark==0)
                        {
                            item.remark=""
                        }
                        if(_this.mock==0)
                        {
                            if(_this.type=="body")
                            {
                                _this.mock="";
                                _this.value={
                                    type:0,
                                    status:"",
                                    data:[]
                                }
                            }
                            else if(_this.type=="result")
                            {
                                _this.mock=""
                            }
                        }
                        if(item.data)
                        {
                            for(var i=0;i<item.data.length;i++)
                            {
                                arguments.callee(item.data[i]);
                            }
                        }
                    })(obj);
                }
                this.$store.commit("setObjCopyJSON",{
                    src:this.type,
                    obj:obj
                },{
                    root:true
                })
                $.tip("复制成功",1);
                this.showDialog=false;
            }
        }
    }
</script>
