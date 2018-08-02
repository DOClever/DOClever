<template>
    <el-row class="row" style="height: 35px;line-height: 35px">
        <el-cascader size="mini" expand-trigger="hover" :options="arrProjectUrl" v-model="arrSelBaseUrl" style="width: 90%" filterable clearable placeholder="请选择BaseUrl" :props="props" @change="change" @focus="focus">
        </el-cascader>
    </el-row>
</template>

<script>
    module.exports={
        data:function () {
            return {
                props:{
                    value:"_id",
                    label:"name",
                    children:"data"
                }
            }
        },
        computed:{
            arrProjectUrl:function () {
                return this.$store.state.baseUrls;
            },
            arrSelBaseUrl:{
                get:function () {
                    return this.$store.state.arrSelBaseUrl
                },
                set:function (val) {
                    this.$store.state.arrSelBaseUrl=val;
                }
            }
        },
        watch:{
            "$store.state.baseUrls"  :{
                handler:function () {
                    if(this.arrSelBaseUrl.length!=2)
                    {
                        return;
                    }
                    var arr=[];
                    loop:
                    for(var i=0;i<this.$store.state.baseUrls.length;i++)
                    {
                        if(this.$store.state.baseUrls[i]._id==this.arrSelBaseUrl[0])
                        {
                            arr.push(this.$store.state.baseUrls[i]._id)
                            for(var j=0;j<this.$store.state.baseUrls[i].data.length;j++)
                            {
                                if(this.$store.state.baseUrls[i].data[j].name==this.arrSelBaseUrl[1])
                                {
                                    arr.push(this.$store.state.baseUrls[i].data[j].name);
                                    break loop;
                                }
                            }
                            arr.pop();
                        }

                    }
                    if(arr.length!=2)
                    {
                        $.tip("用例发生变化，请重新设置BaseUrl！");
                        this.arrSelBaseUrl=[];
                        this.$store.state.baseUrl="";
                        this.$store.state.env=[];
                        return;
                    }
                    this.arrSelBaseUrl=arr;
                },
                immediate:true
            }
        },
        methods:{
            change:function () {
                var env=[];
                for(var i=0;i<this.arrProjectUrl.length;i++)
                {
                    if(this.arrProjectUrl[i]._id==this.arrSelBaseUrl[0])
                    {
                        var bFind=false;
                        for(var j=0;j<this.arrProjectUrl[i].data.length;j++)
                        {
                            if(this.arrProjectUrl[i].data[j].name==this.arrSelBaseUrl[1])
                            {
                                env=this.arrProjectUrl[i].data[j].env?this.arrProjectUrl[i].data[j].env:[];
                                bFind=true;
                                break;
                            }
                        }
                        if(bFind)
                        {
                            break;
                        }
                    }
                }
                this.$store.state.baseUrl=this.arrSelBaseUrl[1];
                this.$store.state.env=env;
            },
            focus:function () {
                this.$store.dispatch("baseUrl");
            }
        },
    }
</script>
