<template>
    <el-row class="row">
        <el-col class="col" :span="6" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;text-align: center;border-radius: 5px;box-shadow: 0px 2px 2px #888888;padding-bottom: 20px">
                <el-button size="mini" type="primary" style="margin: 20px 0 0 0;width: 80%;" @click="type=0">
                    修改管理密码
                </el-button>
            </el-row>
        </el-col>
        <el-col class="col" :span="18" style="padding: 0 10px 0 10px">
            <el-row class="row" style="background-color: white;border-radius: 5px;box-shadow: 0px 2px 2px #888888;">
                <el-row v-show="type==0" class="row">
                    <el-row class="row" style="height: 60px;">
                        <h4 style="margin-left: 10px;color: gray;">
                            修改管理密码
                        </h4>
                    </el-row>
                    <el-form ref="form" label-width="100px">
                        <el-form-item label="原密码" style="text-align: center">
                            <el-input size="small" style="margin-top: 8px;width: 80%" v-model="oldPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" style="text-align: center">
                            <el-input size="small" style="margin-top: 8px;width: 80%" v-model="newPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="重复新密码" style="text-align: center">
                            <el-input size="small" style="margin-top: 8px;width: 80%" v-model="newPassword1"></el-input>
                        </el-form-item>
                        <el-row class="row" style="text-align: center">
                            <el-button size="mini" type="primary" style="width: 60%;margin-top: 20px;margin-bottom: 20px" @click.prevent="editPassword" :loading="passwordPending">
                                保存
                            </el-button>
                        </el-row>
                    </el-form>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
    module.exports={
        data:function () {
            return {
                type:0,
                passwordPending:false,
                oldPassword:"",
                newPassword:"",
                newPassword1:""
            }
        },
        computed:{

        },
        components:{

        },
        methods: {
            editPassword:function () {
                if(!this.oldPassword)
                {
                    $.tip("原密码不能为空",0);
                    return;
                }
                else if(!this.newPassword)
                {
                    $.tip("新密码不能为空",0);
                    return;
                }
                else if(!this.newPassword1)
                {
                    $.tip("重复新密码不能为空",0);
                    return;
                }
                else if(this.newPassword!=this.newPassword1)
                {
                    $.tip("两次输入新密码不一致",0);
                    return;
                }
                this.editPending=true;
                var _this=this;
                this.$store.dispatch("editPassword",{
                    old:this.oldPassword,
                    password:this.newPassword
                }).then(function (data) {
                    _this.editPending=false;
                    if(data.code==200)
                    {
                        $.notify("修改成功",1);
                        _this.oldPassword="";
                        _this.newPassword="";
                        _this.newPassword1="";
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        }
    }
</script>
