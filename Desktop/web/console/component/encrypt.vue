<template>
    <el-dialog title="编辑值"  size="small" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form ref="form" label-width="100px">
            <el-form-item label="加密类型" style="text-align: center">
                <el-select style="width: 80%" v-model="val.type">
                    <el-option value="" label="无"></el-option>
                    <el-option value="Base64"></el-option>
                    <el-option value="MD5"></el-option>
                    <el-option value="SHA-1"></el-option>
                    <el-option value="SHA-256"></el-option>
                    <el-option value="SHA-512"></el-option>
                    <el-option value="SHA-3"></el-option>
                    <el-option value="RIPEMD-160"></el-option>
                    <el-option value="AES"></el-option>
                    <el-option value="DES"></el-option>
                    <el-option value="TripleDES"></el-option>
                    <el-option value="Rabbit"></el-option>
                    <el-option value="RC4"></el-option>
                    <el-option value="RC4Drop"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 50px">
                <el-checkbox id="encryptKey" v-model="val.key" :true-label="1" :false-label="0" :disabled="notKey==1">是否加密字段的Key</el-checkbox>
            </el-form-item>
            <el-form-item label="Salt" style="text-align: center" v-if="saltShow">
                <el-input placeholder="请填入salt的值" style="width: 80%" v-model="val.salt"></el-input>
            </el-form-item>
        </el-form>
        <el-row class="dialog-footer" slot="footer">
            <el-button type="primary" @click="save">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    module.exports={
        props:["source","notKey"],
        data:function () {
            return {
                val:$.clone(this.source),
                showDialog:false
            }
        },
        computed:{
            saltShow:function () {
                return helper.isSalt(this.val.type);
            }
        },
        methods:{
            save:function () {
                for(var key in this.val)
                {
                    if(this.val.hasOwnProperty(key))
                    {
                        this.source[key]=this.val[key];
                    }
                }
                this.showDialog=false;
            }
        }
    }
</script>
