<template>
    <el-row class="row">
        <el-row class="row" style="padding:0 0 0 20px;height: 50px;line-height: 50px">
            <el-radio class="radio" :label="0" v-model="info.type" :checked="info.type==0" id="bodyKey">Key-Value</el-radio>&nbsp;&nbsp;
            <el-radio class="radio" :label="1" v-model="info.type" :checked="info.type==1" id="bodyRaw">Raw</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-select v-model="rawType" v-if="info.type==1 && info.rawType==0">
                <el-option value="" label="Text"></el-option>
                <el-option value="text/plain" label="Text(text/plain)"></el-option>
                <el-option value="application/json" label="JSON"></el-option>
                <el-option value="text/html" label="HTML"></el-option>
                <el-option value="application/xml" label="XML(application/xml)"></el-option>
                <el-option value="text/xml" label="XML(text/xml)"></el-option>
                <el-option value="application/javascript" label="JAVASCRIPT"></el-option>
            </el-select>
        </el-row>
        <table width="100%" v-if="info.type==0">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 20%;text-align: center;vertical-align: middle;height: 50px">
                        <el-input style="width: 90%" placeholder="请填写参数名称" v-model="item.name"></el-input>
                    </td>
                    <td style="width: 10%;text-align: center;vertical-align: middle;height: 50px">
                        <el-select v-model="item.type" style="width: 90%">
                            <el-option :value="0" label="文本"></el-option>
                            <el-option :value="1" label="文件"></el-option>
                        </el-select>
                    </td>
                    <td style="width: 10%;" >
                        <span style="display: inline-block;">
                            <el-checkbox v-model="item.must" :true-label="1" :false-label="0">必选</el-checkbox>
                        </span>
                    </td>
                    <td style="width: 45%">
                        <el-input style="width: 90%;" placeholder="请填写备注" v-model="item.remark"></el-input>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="small" @click="configValue(item)" v-if="item.type==0" style="font-size: 15px">填值</el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" style="color: red;font-size: 15px" size="small" icon="close" @click="remove(index)"></el-button>
                    </td>
                    <td style="width: 5%">
                        <el-button type="text" size="small" v-if="index==arr.length-1" icon="plus" @click="arr.push({name:'',type:0,must:0,remark:''})" style="font-size: 15px"></el-button>
                    </td>
                </tr>
            </template>
        </table>
        <el-row class="row" style="height: 50px;line-height: 50px" v-else>
            <el-col class="col" :span="3">
                Raw的类型：
            </el-col>
            <el-col class="col" :span="5">
                <el-select v-model="info.rawType">
                    <el-option :value="0" label="文本"></el-option>
                    <el-option :value="1" label="文件"></el-option>
                </el-select>
            </el-col>
            <el-col class="col" :span="12" style="text-align: center">
                <el-input style="width: 90%;" placeholder="请填写备注" v-model="info.rawTextRemark" v-if="info.rawType==0"></el-input>
                <el-input style="width: 90%;" placeholder="请填写备注" v-model="info.rawFileRemark" v-else></el-input>
            </el-col>
            <el-col class="col" :span="4" style="text-align: center">
                <el-button type="text" size="small" @click="configRawValue"  v-if="info.rawType==0" style="font-size: 15px">填值</el-button>
            </el-col>
        </el-row>
    </el-row>
</template>
<script>
    module.exports={
        data:function () {
            return {

            }
        },
        computed:{
            arr:function () {
                return this.$store.state.body
            },
            info:function () {
                return this.$store.state.bodyInfo
            },
            rawType:{
                get:function () {
                    var type="";
                    this.$store.getters.headerSave.forEach(function (obj) {
                        if(obj.name.toLowerCase()=="content-type")
                        {
                            var value=obj.value.toLowerCase();
                            var arr=["text/plain","application/json","text/html","application/xml","text/xml","application/javascript"];
                            var index=arr.indexOf(value);
                            if(index>-1)
                            {
                                type=arr[index];
                            }
                        }
                    })
                    return type;
                },
                set:function (value) {
                    var bFind=false;
                    this.$store.getters.headerSave.forEach(function (obj) {
                        if(obj.name.toLowerCase()=="content-type")
                        {
                            obj.value=value;
                            bFind=true;
                        }
                    })
                    if(!bFind)
                    {
                        this.$store.state.header.push({
                            name:'Content-Type',
                            value:value,
                            remark:''
                        })
                    }
                }
            }
        },
        methods:{
            remove:function (index) {
                if(this.arr.length>1)
                {
                    this.arr.splice(index,1)
                }
                else
                {
                    this.arr[0].name="";
                    this.arr[0].must=0;
                    this.arr[0].type=0;
                    this.arr[0].remark="";
                }
            },
            configValue:function (item) {
                if(!item.value)
                {
                    Vue.set(item,"value",[]);
                }
                var child=$.showBox(this.$parent,"valueList",{
                    "source":item.value
                });
                child.$on("save",function (value) {
                    item.value=value;
                });
            },
            configRawValue:function () {
                if(this.info.rawText===undefined)
                {
                    Vue.set(this.info,"rawText","");
                }
                var child=$.showBox(this.$parent,"rawText",{
                    "source":this.info.rawText
                });
                var _this=this;
                child.$on("save",function (value) {
                    _this.info.rawText=value;
                });
            }
        }
    }
</script>
