<template>
    <el-dialog title="编辑接口入参"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-row class="row">
            <el-row class="row" style="height: 50px;line-height: 50px;text-align: center" v-for="(item,index) in arr">
                <el-col class="col" :span="4">
                    <el-select size="small" v-model="item.type">
                        <el-option label="Number" value="number"></el-option>
                        <el-option label="String" value="string"></el-option>
                        <el-option label="Boolean" value="boolean"></el-option>
                        <el-option label="Code" value="code"></el-option>
                    </el-select>
                </el-col>
                <el-col class="col" :span="16">
                    <el-input size="small" v-model="item.value" style="width: 90%" :placeholder="'请输入第'+index+'个参数'" @keypress.native="keyPress($event,item)"></el-input>
                </el-col>
                <el-col class="col" :span="2">
                    <el-button size="mini" type="text" style="font-weight: 900;font-size: 16px;" icon="el-icon-plus" @click="arr.splice(index+1,0,{value:'',type:'string'})"></el-button>
                </el-col>
                <el-col class="col" :span="2">
                    <el-button size="mini" type="text" style="font-weight: 900;color:red;font-size: 16px;" icon="el-icon-close" @click="index>0?arr.splice(index,1):(item.value='')"></el-button>
                </el-col>
            </el-row>
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
        props:["argv","index"],
        data: function () {
            return {
                showDialog:false,
                arr:function (data) {
                    var arr=[];
                    data.forEach(function (obj) {
                        var o=helper.handleArgvData(undefined,obj);
                        arr.push(o)
                    })
                    if(arr.length==0)
                    {
                        arr.push({
                            value:"",
                            type:"string"
                        })
                    }
                    return arr;
                }.call(this,this.argv)
            }
        },
        methods: {
            save:function () {
                var arr=[];
                this.arr.forEach(function (obj) {
                    if(obj.value)
                    {
                        arr.push(helper.setArgvValue(obj.value,obj.type));
                    }
                })
                this.argv.splice(0,this.argv.length);
                for(var i=0;i<arr.length;i++)
                {
                    this.argv[i]=arr[i];
                }
                this.showDialog=false;
            },
            keyPress:function (event,item) {
                if(event.key=="$" && item.type=="code")
                {
                    var child=$.showMenu(this.$root,event.target,helper.getTestUIArgvList(this.$store.state.selTest.ui,this.index));
                    child.$on("click",function (arr) {
                        event.target.focus();
                        $.insertTextAtCursor(event.target,arr.join(".").replace(/\.0/g,"[0]"));
                        item.value=event.target.value;
                    })
                }
                else if(event.key=="#" && item.type=="code")
                {
                    var child=$.showMenu(this.$root,event.target,helper.getTestBaseUrlList(this.$store.state.baseUrls));
                    child.$on("click",function (arr) {
                        event.target.focus();
                        event.target.selectionStart-=1;
                        event.target.selectionEnd=event.target.selectionStart+1;
                        $.insertTextAtCursor(event.target,arr[arr.length-1]);
                        item.value=event.target.value;
                    })
                }
            }
        }
    }
</script>