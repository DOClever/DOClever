<template>
    <div style="width: 100%">
        <table width="100%">
            <template v-for="(item,index) in arr">
                <tr style="text-align: center;vertical-align: middle">
                    <td style="width: 100%">
                        <el-input style="width: 80%;margin: 0 auto" placeholder="请填写baseurl地址" v-model="item.title" :disabled="true"></el-input>
                    </td>
                </tr>
            </template>
            <tfoot>
            </tfoot>
        </table>
    </div>
</template>

<script>
    module.exports={
        props:["source"],
        data:function () {
            return {
                arr:function () {
                    if(this.source && this.source.length>0)
                    {
                        return this.source.map(function (obj) {
                            return {
                                title:obj
                            }
                        })
                    }
                    else
                    {
                        return [{
                            title:""
                        }]
                    }
                }.call(this),
                savePending:false
            }
        },
        watch:{
          source:function (val) {
              if(val && val.length>0)
              {
                  this.arr= val.map(function (obj) {
                      return {
                          title:obj
                      }
                  })
              }
              else
              {
                  this.arr= [{
                      title:""
                  }]
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
                    this.arr[0].title="";
                }
            },
        },
    }
</script>
