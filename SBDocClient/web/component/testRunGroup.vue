<template>
    <el-dialog title="输出"  size="small" ref="box" :modal="false" :close-on-click-modal="false">
        <el-row class="row" style="height: 300px;overflow: auto" v-html="obj.output">

        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save" :disable="!finish">
                确定
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["source","opt"],
        data:function () {
            return {
                obj:{
                    output:""
                },
                finish:false,
            }
        },
        computed:{

        },
        methods:{
            save:function () {
                this.$refs.box.close();
            },
            run:async function(){
                var index=0;
                for(var i=0;i<this.source.length;i++)
                {
                    var ret=await helper.runTestCode(this.source[i].code,this.source[i],{},this.opt,this.obj);
                    var val;
                    if(ret===undefined)
                    {
                        val=0;
                    }
                    else if(Boolean(ret)==true)
                    {
                        val=1
                    }
                    else
                    {
                        val=2
                    }
                    var output=this.obj.output.substr(index);
                    index=this.obj.output.length;
                    await net.put("/test/status",{
                        id:this.source[i]._id,
                        status:val,
                        output:output
                    })
                    var node=this.$parent.$refs.tree.$refs.tree.store.getNode(this.source[i].id);
                    node.data.status=val;
                }

                this.obj.output+="全部运行完成<br>"
                this.finish=true;
            },
        },
        created:function () {
            this.run();
        }
    }
</script>
