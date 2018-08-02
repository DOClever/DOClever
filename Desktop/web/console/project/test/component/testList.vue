<template>
    <el-tree :data="data" :props="defaultProps" node-key="id"  :render-content="renderContent" highlight-current ref="tree" @current-change="info" style="font-size: 14px" empty-text="暂无模块">
    </el-tree>
</template>

<style>
    .testMenu {

    }
    .testLabel {
        margin-top: 0px;
    }
    .testRightMenu {
        display: none;
    }
    .testMenu:hover .testRightMenu {
        display: inline-block;
    }
</style>

<script type="text/jsx">
    var config=require("common/js/config")
    module.exports={
        data:function () {
            return {
                defaultProps:{
                    children:"data",
                    label:"name"
                }
            }
        },
        computed:{
            data:function () {
                return this.$store.state.data
            },
            editRole:function () {
                return this.$store.getters.editRole;
            },
            copyTestId:function () {
                return window.store.state.copyTestId;
            }
        },
        methods:{
            addModule:function () {
                var _this=this;
                $.input("请输入模块名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入模块名称",0);
                        return false
                    }
                    var query={};
                    query.project=session.get("projectId");
                    query.name=val.value;
                    $.startHud("#body");
                    _this.$store.dispatch("addModule",query).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("新建成功",1)
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                });
            },
            renderContent:function(h, { node, data, store }) {
                return (
                        <span class="testMenu" style="display:inline-block;width:calc(100% - 45px);font-size:15px;height:26px;line-height:26px">
                            <span class="testLabel" style={{
                                height:'26px',
                                lineHeight:'26px',
                                display:'inline-block',
                                fontSize: '14px',
                                color: (node.level < 3) ? '#17B9E6' : (node.data.status == 0 ? 'black' : (node.data.status == 1 ? 'green' : 'red'))
                            }}>
                            {node.level < 3 ? (node.label + "(" + node.childNodes.length + ")") : node.label}
                            </span>
                        <span style="right: 5px;position:absolute;text-align: center;display:inline-block;" onclick="event.stopPropagation()">
                            {
                                node.level == 1 ?
                                        <div class="testRightMenu" style="height:26px;width:auto;line-height: 26px;margin-right: 3px;" v-show={this.editRole}>
                                            <i class="el-icon-plus" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 2px;color:#17B9E6;background-color: white;font-weight: 900;margin-right:3px"  on-click={this.addGroup.bind(this, node)} title="新建业务"></i>
                                            <i class="el-icon-delete" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 2px;color:red;background-color: white;font-weight: 900;margin-right:3px" on-click={this.removeModule.bind(this,node)} title="删除"></i>
                                            <el-dropdown>
                                                <i class="el-icon-edit"
                                                   style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 2px;color:#17B9E6;background-color: white;font-weight: 900"></i>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item><div on-click={this.renameModule.bind(this, node)}>修改名称</div></el-dropdown-item>
                                                    <el-dropdown-item><div on-click={this.importGroup.bind(this, node)}>导入业务</div></el-dropdown-item>
                                                    <el-dropdown-item><div on-click={this.exportModule.bind(this, node)}>导出模块</div></el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>
                                    : (node.level == 2 ?
                                        <div class="testRightMenu" style="height:26px;width;line-height: 26px;margin-right: 3px;" v-show={this.editRole}>
                                            <i class="el-icon-plus" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 2px;color:#17B9E6;background-color: white;font-weight: 900;margin-right:3px"  on-click={this.addTest.bind(this, node)} title="新建用例"></i>
                                            <i class="el-icon-delete" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 2px;color:red;background-color: white;font-weight: 900;margin-right:3px" on-click={this.removeGroup.bind(this, node)} title="删除"></i>
                                            <el-dropdown>
                                                <i class="el-icon-edit"
                                                   style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 2px;color:#17B9E6;background-color: white;font-weight: 900"></i>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item>
                                                        <div on-click={this.addGroup.bind(this, node)}>修改名称</div>
                                                    </el-dropdown-item>
                                                    <el-dropdown-item>
                                                        <div on-click={this.importTest.bind(this, node)}>导入用例</div>
                                                    </el-dropdown-item>
                                                    <el-dropdown-item>
                                                        <div on-click={this.exportGroup.bind(this, node)}>导出业务</div>
                                                    </el-dropdown-item>
                                                    <el-dropdown-item v-show={this.copyTestId}>
                                                        <div on-click={this.pasteTest.bind(this, node)}>粘贴用例</div>
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>
                                    :
                                        <div class="testRightMenu" style="height:26px;width;line-height: 26px;margin-right: 3px;" v-show={this.editRole}>
                                            <i class="el-icon-delete" style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 2px;color:red;background-color: white;font-weight: 900;margin-right:3px" on-click={this.removeTest.bind(this, node)} title="删除"></i>
                                            <el-dropdown>
                                                <i class="el-icon-edit"
                                                   style="border: 1px rgba(226, 226, 226, 0.71) solid;font-size: 12px;padding: 2px;color:#17B9E6;background-color: white;font-weight: 900"></i>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item>
                                                        <div on-click={this.exportTest.bind(this, node)}>导出</div>
                                                    </el-dropdown-item>
                                                    <el-dropdown-item>
                                                        <div on-click={this.copyTest.bind(this, node)}>复制</div>
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>)

                            }
                        </span>
                    </span>
                );
            },
            addGroup:function (item) {
                var _this=this;
                $.input("请输入业务名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入业务名称",0);
                        return false
                    }
                    $.startHud("#body");
                    _this.$store.dispatch("addGroup",{
                        node:item,
                        name:val.value,
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("操作成功",1);
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                });

            },
            renameModule:function (item) {
                var _this=this;
                $.input("请输入模块名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入模块名称",0);
                        return false
                    }
                    $.startHud("#body");
                    _this.$store.dispatch("addModule",{
                        node:item,
                        name:val.value,
                        type:1,
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("修改成功",1)
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                });
            },
            removeModule:function (item) {
                var _this=this;
                $.confirm("是否确认删除，该模块下的所有信息都会被删除!",function () {
                    $.startHud("#body");
                    _this.$store.dispatch("removeModule",item).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("删除成功",1)
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                })
            },
            addTest:function (item) {
                var _this=this;
                $.input("请输入用例名称",function (val) {
                    if(!val.value)
                    {
                        $.tip("请输入用例名称",0);
                        return false
                    }
                    $.startHud("#body");
                    _this.$store.dispatch("addTest",{
                        node:item,
                        name:val.value,
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("新建成功",1)
                            helper.addPoint("addTest","新建测试");
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                });
            },
            removeGroup:function (item) {
                var _this=this;
                $.confirm("是否确认删除，该业务下的所有信息都会被删除!",function () {
                    $.startHud("#body");
                    _this.$store.dispatch("removeGroup",item).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("删除成功",1)
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                })
            },
            removeTest:function (item) {
                var _this=this;
                $.confirm("是否确认删除!",function () {
                    $.startHud("#body");
                    _this.$store.dispatch("removeTest",item).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("删除成功",1)
                        }
                        else
                        {
                            $.tip(data.msg,0)
                        }
                    })
                })
            },
            info:function (data,node) {
                if(node.level<3)
                {
                    return;
                }
                let ele=this.$el.parentNode.parentNode.parentNode;
                while(!ele.getAttribute("role"))
                {
                    ele=ele.parentNode;
                }
                ele=ele.querySelector("div.testInfoContent");
                $.startLoading(ele);
                var _this=this;
                this.$store.dispatch("info",node).then(function (data) {
                    $.stopLoading();
                    if(data.code!=200)
                    {
                        $.tip(data.msg,0);
                    }
                    else
                    {
                        _this.$nextTick(function () {
                            var ele=document.getElementById("testBasicInfo");
                            if(ele)
                            {
                                _this.$store.getters.event.$emit("initTestContent",data.data);
                            }
                            else
                            {
                                _this.$store.state.tempData=data.data;
                            }
                        })
                    }
                });
            },
            exportModule:function (item) {
                var link=document.createElement("a");
                link.href=config.baseUrl+"/test/exportmodule?module="+item.data._id;
                link.download=item.data.name+".json";
                link.click();
            },
            importGroup:function (item) {
                var _this=this;
                $.inputMul(this,"请输入导入的JSON数据",function (val) {
                    if(!val)
                    {
                        $.tip("请输入json数据",0);
                        return false;
                    }
                    $.startHud();
                    _this.$store.dispatch("importGroup",{
                        content:val,
                        module:item.data._id,
                        node:item
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("导入成功",1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            exportGroup:function (item) {
                var link=document.createElement("a");
                link.href=config.baseUrl+"/test/exportgroup?group="+item.data._id;
                link.download=item.data.name+".json";
                link.click();
            },
            exportTest:function (item) {
                var link=document.createElement("a");
                link.href=config.baseUrl+"/test/exporttest?test="+item.data._id;
                link.download=item.data.name+".json";
                link.click();
            },
            importTest:function (item) {
                var _this=this;
                $.inputMul(this,"请输入导入的JSON数据",function (val) {
                    if(!val)
                    {
                        $.tip("请输入json数据",0);
                        return false;
                    }
                    $.startHud();
                    _this.$store.dispatch("importTest",{
                        content:val,
                        group:item.data._id,
                        node:item
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.tip("导入成功",1);
                        }
                        else
                        {
                            $.tip(data.msg,0);
                        }
                    })
                    return true;
                })
            },
            copyTest:function (item) {
                window.store.state.copyTestId=item.data._id;
                $.tip("复制成功",1);
            },
            pasteTest:function (item) {
                var _this=this;
                this.$store.dispatch("pasteTest",{
                    node:item,
                    group:item.data._id
                }).then(function (data) {
                    if(data.code==200)
                    {
                        $.tip("粘贴成功",1);
                    }
                    else
                    {
                        $.tip(data.msg,0);
                    }
                })
            }
        },
        mounted:function () {
            this.$store.state.tree=this.$refs.tree;
        },
        created:function () {
            this.$store.getters.event.$on("addTestModule",this.addModule);
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("addTestModule",this.addModule);
        }
    }
</script>











