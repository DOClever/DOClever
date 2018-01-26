<template>
    <el-dialog title="编辑接口入参"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-tabs v-model="type">
                <el-tab-pane name="param" label="Param">
                    <el-row class="row" v-for="(item,index) in param" style="text-align: center;height: 50px;line-height: 50px">
                        <el-col class="col" :span="10">
                            <el-input size="small" v-model="item.key" style="width: 90%" placeholder="请输入key">
                            </el-input>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-tooltip class="item" effect="dark" content='value会以javascript语句的方式运行，如果你需要字符串，请加上双引号，比如"aaa"' placement="bottom" >
                                <el-input size="small" v-model="item.value" style="width: 90%" placeholder="请输入value">
                                </el-input>
                            </el-tooltip>
                        </el-col>
                        <el-col class="col" :span="2" @click="param.splice(index+1,0,{key:'',value:''})">
                            <el-button size="mini" type="text" style="font-weight: 900;font-size: 16px;" icon="el-icon-plus"></el-button>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;color:red;font-size: 16px;" icon="el-icon-close" @click="index>0?param.splice(index,1):(item.key='',item.value='')"></el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane name="query" label="Query">
                    <el-row class="row" v-for="(item,index) in query" style="text-align: center;height: 50px;line-height: 50px">
                        <el-col class="col" :span="10">
                            <el-input size="small" v-model="item.key" style="width: 90%" placeholder="请输入key">
                            </el-input>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-tooltip class="item" effect="dark" content='value会以javascript语句的方式运行，如果你需要字符串，请加上双引号，比如"aaa"' placement="bottom" >
                                <el-input size="small" v-model="item.value" style="width: 90%" placeholder="请输入value">
                                </el-input>
                            </el-tooltip>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;font-size: 16px;" icon="el-icon-plus" @click="query.splice(index+1,0,{key:'',value:''})"></el-button>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;color:red;font-size: 16px;" icon="el-icon-close" @click="index>0?query.splice(index,1):(item.key='',item.value='')"></el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane name="header" label="Header">
                    <el-row class="row" v-for="(item,index) in header" style="text-align: center;height: 50px;line-height: 50px">
                        <el-col class="col" :span="10">
                            <el-input size="small" v-model="item.key" style="width: 90%" placeholder="请输入key">
                            </el-input>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-tooltip class="item" effect="dark" content='value会以javascript语句的方式运行，如果你需要字符串，请加上双引号，比如"aaa"' placement="bottom" >
                                <el-input size="small" v-model="item.value" style="width: 90%" placeholder="请输入value">
                                </el-input>
                            </el-tooltip>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;font-size: 16px;" icon="el-icon-plus" @click="header.splice(index+1,0,{key:'',value:''})"></el-button>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;color:red;font-size: 16px;" icon="el-icon-close" @click="index>0?header.splice(index,1):(item.key='',item.value='')"></el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane name="body" label="Body">
                    <el-row class="row" v-for="(item,index) in body" style="text-align: center;height: 50px;line-height: 50px">
                        <el-col class="col" :span="10">
                            <el-input size="small" v-model="item.key" style="width: 90%" placeholder="请输入key">
                            </el-input>
                        </el-col>
                        <el-col class="col" :span="10">
                            <el-tooltip class="item" effect="dark" content='value会以javascript语句的方式运行，如果你需要字符串，请加上双引号，比如"aaa"' placement="bottom" >
                                <el-input size="small" v-model="item.value" style="width: 90%" placeholder="请输入value">
                                </el-input>
                            </el-tooltip>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;font-size: 16px;" icon="el-icon-plus" @click="body.splice(index+1,0,{key:'',value:''})"></el-button>
                        </el-col>
                        <el-col class="col" :span="2">
                            <el-button size="mini" type="text" style="font-weight: 900;color:red;font-size: 16px;" icon="el-icon-close" @click="index>0?body.splice(index,1):(item.key='',item.value='')"></el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-row>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<style>

</style>

<script>
    module.exports = {
        props:["argv"],
        data: function () {
            return {
                showDialog:false,
                type:"param",
                param:function (data) {
                    var arr=[];
                    for(var key in data)
                    {
                        arr.push({
                            key:key,
                            value:data[key]
                        })
                    }
                    if(arr.length==0)
                    {
                        arr.push({
                            key:"",
                            value:""
                        })
                    }
                    return arr;
                }.call(this,this.argv.param),
                query:function (data) {
                    var arr=[];
                    for(var key in data)
                    {
                        arr.push({
                            key:key,
                            value:data[key]
                        })
                    }
                    if(arr.length==0)
                    {
                        arr.push({
                            key:"",
                            value:""
                        })
                    }
                    return arr;
                }.call(this,this.argv.query),
                header:function (data) {
                    var arr=[];
                    for(var key in data)
                    {
                        arr.push({
                            key:key,
                            value:data[key]
                        })
                    }
                    if(arr.length==0)
                    {
                        arr.push({
                            key:"",
                            value:""
                        })
                    }
                    return arr;
                }.call(this,this.argv.header),
                body:function (data) {
                    var arr=[];
                    for(var key in data)
                    {
                        arr.push({
                            key:key,
                            value:data[key]
                        })
                    }
                    if(arr.length==0)
                    {
                        arr.push({
                            key:"",
                            value:""
                        })
                    }
                    return arr;
                }.call(this,this.argv.body),
            }
        },
        methods: {
            save:function () {
                var temp={};
                this.param.forEach(function (obj) {
                    if(obj.key)
                    {
                        temp[obj.key]=obj.value
                    }
                })
                this.argv.param=temp;
                temp={}
                this.query.forEach(function (obj) {
                    if(obj.key)
                    {
                        temp[obj.key]=obj.value
                    }
                })
                this.argv.query=temp;
                temp={}
                this.header.forEach(function (obj) {
                    if(obj.key)
                    {
                        temp[obj.key]=obj.value
                    }
                })
                this.argv.header=temp;
                temp={}
                this.body.forEach(function (obj) {
                    if(obj.key)
                    {
                        temp[obj.key]=obj.value
                    }
                })
                this.argv.body=temp;
                this.showDialog=false;
            }
        }
    }
</script>