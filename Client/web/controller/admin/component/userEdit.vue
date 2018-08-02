<template>
    <el-dialog :title="propObj?'编辑用户':'新建用户'"  width="50%" ref="box" :visible.sync="showDialog" append-to-body>
        <el-form ref="form" label-width="100px">
            <el-form-item label="头像" style="text-align: center;vertical-align: middle">
                <img width="60" height="60" :src="obj.photo?obj.photo:''" id="showimg">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a  href="javascript:void(0)" class="file" style="display: inline-block;top: -15px">
                    选择文件<input type="file"  v-imgfile="'showimg'" id="file">
                </a>
            </el-form-item>
            <el-form-item label="用户名" style="text-align: center">
                <el-input size="small"  style="width: 80%" name="name" v-model="obj.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" style="text-align: center">
                <el-input size="small"  style="width: 80%" name="password" v-model="obj.password"></el-input>
            </el-form-item>
            <el-form-item label="年龄" style="text-align: center">
                <el-input size="small"  style="width: 80%" name="age" v-model="obj.age"></el-input>
            </el-form-item>
            <el-form-item label="性别" style="text-align: center">
                <el-select size="small" v-model="obj.sex" style="width: 80%" name="sex">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公司" style="text-align: center">
                <el-input size="small"  style="width: 80%" name="company" v-model="obj.company"></el-input>
            </el-form-item>
            <el-form-item label="qq" style="text-align: center">
                <el-input size="small" style="width: 80%" name="qq" v-model="obj.qq"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" style="text-align: center">
                <el-input size="small" style="width: 80%" name="email" v-model="obj.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" style="text-align: center">
                <el-input size="small" style="width: 80%" name="phone" v-model="obj.phone"></el-input>
            </el-form-item>
            <el-form-item label="状态" style="text-align: center">
                <el-switch v-model="obj.state" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="提示问题" style="text-align: center">
                <el-input size="small" style="width: 80%" name="question" v-model="obj.question"></el-input>
            </el-form-item>
            <el-form-item label="答案" style="text-align: center">
                <el-input size="small" style="width: 80%" name="answer" v-model="obj.answer"></el-input>
            </el-form-item>
        </el-form>
        <el-row class="dialog-footer" slot="footer">
            <el-button size="mini" type="primary" @click="save" :laoding="savePending">
                保存
            </el-button>
        </el-row>
    </el-dialog>
</template>

<script>
    var imgFile=require("director/imgFile.js")
    module.exports={
        props:["propObj"],
        data:function () {
            return {
                obj:this.propObj?(function() {
                    if(this.propObj.sex!="男" && this.propObj.sex!="女")
                    {
                        this.propObj.sex="男";
                    }
                    return this.propObj
                }).call(this):{
                    name:"",
                    password:"",
                    photo:"",
                    age:"",
                    sex:"男",
                    qq:"",
                    email:"",
                    phone:"",
                    company:"",
                    state:1,
                    question:"",
                    answer:""
                },
                savePending:false,
                showDialog:false
            }
        },
        directives:{
            "imgfile":imgFile,
        },
        computed:{

        },
        methods:{
            save:function () {
                var _this=this;
                var obj={};
                if(this.propObj)
                {
                    obj.id=this.propObj._id;
                }
                if($.query("#file").value)
                {
                    obj.photo=$.query("#file").files[0];
                }
                obj.age=(this.obj.age!==undefined && this.obj.age!==null)?this.obj.age:"";
                obj.sex=(this.obj.sex!==undefined && this.obj.sex!==null)?this.obj.sex:""
                obj.company=(this.obj.company!==undefined && this.obj.company!==null)?this.obj.company:""
                obj.qq=(this.obj.qq!=undefined && this.obj.qq!==null)?this.obj.qq:""
                obj.email=(this.obj.email!==undefined && this.obj.email!==null)?this.obj.email:""
                obj.phone=(this.obj.phone!==undefined && this.obj.phone!==null)?this.obj.phone:""
                if(this.obj.question)
                {
                    obj.question=this.obj.question
                }
                else
                {
                    $.tip("请输入答案",0);
                    return;
                }
                if(this.obj.answer)
                {
                    obj.answer=this.obj.answer
                }
                else
                {
                    $.tip("请输入提示问题",0);
                    return;
                }
                if(this.obj.name)
                {
                    obj.name=this.obj.name
                }
                else
                {
                    $.tip("请输入用户名",0);
                    return;
                }
                if(this.obj.password)
                {
                    obj.password=this.obj.password
                }
                else
                {
                    $.tip("请输入密码",0);
                    return;
                }
                obj.state=Number(this.obj.state);
                this.savePending=true;
                this.$store.dispatch("saveUser",obj).then(function (data) {
                    _this.savePending=false;
                    if(data.code==200)
                    {
                        $.notify("保存成功",1);
                        _this.showDialog=false;
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
