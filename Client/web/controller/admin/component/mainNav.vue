<template>
    <el-row id="navBar" class="row" :style="{height:'50px','backgroundColor':'white'}" style="box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15)">
        <slot name="other"></slot>
        <el-col class="col" :span="3" style="text-align: left;line-height: 50px;color:#50bfff ;font-size: 25px;padding-left: 20px">
            <a style="text-decoration: none;cursor: pointer;color: inherit" href="/">DOClever</a>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px;">
            <slot name="slot3">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px;">
            <slot name="slot4">
            </slot>
        </el-col>
        <el-col class="col" :span="1" style="text-align: center;line-height: 50px;">

        </el-col>
        <el-col class="col" :span="8" style="text-align: center;line-height: 50px;font-size: 25px;color: #50bfff;white-space: nowrap;text-overflow:ellipsis">
            <slot name="title">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px;">
            <slot name="slot1">
            </slot>
        </el-col>
        <el-col class="col" :span="2" style="text-align: center;line-height: 50px;">
            <slot name="slot2">
            </slot>
        </el-col>
        <el-col class="col" :span="4" style="white-space: nowrap;text-align: center;line-height: 50px">
            <img :src="adminPhoto" style="width: 40px;height: 40px; border-radius:50%;margin-top: 5px">&nbsp;
            <el-dropdown @command="handleCommand" style="top: -15px;">
                <span class="el-dropdown-link" style="color: #50bfff;cursor: pointer">
                    <span>
                        {{admin}}
                    </span>
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="quit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-row>
</template>
<script>
    var proxyImg=require("director/proxyImg");
    var sessionChange=require("mixins/session");
    module.exports={
        mixins:[sessionChange],
        data:function () {
            return {
                bShowApply:document.title.indexOf("DOClever")>-1?false:true,
                admin:sessionStorage.getItem("admin"),
                adminPhoto:require("pic/admin.jpeg"),
            }
        },
        directives:{
            proxy:proxyImg
        },
        watch:{

        },
        methods:{
            handleCommand:function (command) {
                if(command=="quit")
                {
                    var _this=this;
                    net.post("/admin/logout",{}).then(function (data) {
                        if(data.code==200)
                        {
                            _this.$notify({
                                title: '退出成功',
                                type: 'success'
                            });
                            sessionStorage.removeItem("admin");
                            setTimeout(function () {
                                location.href="/";
                            },1000)

                        }
                    })
                }
            },
        },
        created:function () {

        }
    }
</script>
