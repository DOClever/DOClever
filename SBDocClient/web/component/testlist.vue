<template>
    <el-tree :data="data" :props="defaultProps" show-checkbox node-key="id"  :render-content="renderContent" highlight-current ref="tree" @current-change="info">
    </el-tree>
</template>


<script type="text/jsx">
    var bus=require("../bus/projectInfoBus")
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
            }
        },
        methods:{
            renderContent:function(h, { node, data, store }) {
                return (
                    <span>
                        <span style="float:right;margin-right: 20px;white-space: nowrap;text-align: center" onclick="event.stopPropagation()">
                            <el-dropdown trigger="click" style="cursor: pointer">
                                <div class="el-dropdown-link">
                                    <i class="el-icon-more"></i>
                                </div>
                                {
                                    node.level==1?
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item>
                                                    <div on-click={this.addGroup.bind(this,node)}>
                                                        新建业务
                                                    </div>
                                                </el-dropdown-item>
                                                <el-dropdown-item>
                                                    <div on-click={this.renameModule.bind(this,node)}>
                                                        修改名称
                                                    </div>
                                                </el-dropdown-item>
                                                <el-dropdown-item>
                                                    <div on-click={this.removeModule.bind(this,node)}>
                                                        删除
                                                    </div>
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        :(node.level==2?
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item>
                                                    <div on-click={this.addTest.bind(this,node)}>
                                                        新建用例
                                                    </div>
                                                </el-dropdown-item>
                                                <el-dropdown-item>
                                                    <div on-click={this.addGroup.bind(this,node)}>
                                                        修改名称
                                                    </div>
                                                </el-dropdown-item>
                                                <el-dropdown-item>
                                                    <div on-click={this.removeGroup.bind(this,node)}>
                                                        删除
                                                    </div>
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        :
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item>
                                                    <div on-click={this.removeTest.bind(this,node)}>
                                                        删除
                                                    </div>
                                                </el-dropdown-item>
                                            </el-dropdown-menu>)

                                }
                            </el-dropdown>
                        </span>
                        <span style={{fontSize:node.level==1?'20px':(node.level==2?'18px':'16px'),color:(node.level<3)?'#20A0FF':(node.data.status==0?'black':(node.data.status==1?'green':'red'))}}>
                            {node.level<3?(node.label+"("+node.childNodes.length+")"):node.label}
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
                        name:val.value
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("添加成功",1);
                        }
                        else
                        {
                            $.notify(data.msg,0)
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
                        type:1
                    }).then(function (data) {
                        $.stopHud();
                        if(data.code==200)
                        {
                            $.notify("修改成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
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
                            $.notify("删除成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
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
                            $.notify("新建成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
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
                            $.notify("删除成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
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
                            $.notify("删除成功",1)
                        }
                        else
                        {
                            $.notify(data.msg,0)
                        }
                    })
                })
            },
            info:function (data,node) {
                if(node.level<3)
                {
                    return;
                }
                $.startHud("#body");
                var _this=this;
                this.$store.dispatch("info",node).then(function (data) {
                    $.stopHud();
                    if(data.code!=200)
                    {
                        $.notify(data.msg,0);
                    }
                    else
                    {
                        _this.$nextTick(function () {
                            document.getElementById("testContent").innerHTML=data.data.code;
                            bus.$emit("initTestContent");
                        })
                    }
                });
            }
        }
    }
</script>











