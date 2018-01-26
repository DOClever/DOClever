<template>
    <div>
        项目：&nbsp;
        <el-cascader size="mini" expand-trigger="hover" :options="arrProject" v-model="arrSelProject" @change="changeProject" placeholder="请切换项目">
        </el-cascader>
    </div>
</template>

<style>

</style>

<script>
    var sessionChange=require("common/mixins/session");
    module.exports = {
        data: function () {
            return {
                arrSelProject:[session.get("projectType"),session.get("projectId")],
                arrProject:[
                    {
                        value:"interface",
                        label:"接口",
                        children:[]
                    },
                    {
                        value:"doc",
                        label:"文档",
                        children:[]
                    },
                    {
                        value:"test",
                        label:"测试",
                        children:[]
                    }
                ]
            }
        },
        mixins:[sessionChange],
        methods: {
            changeProject:function (val) {
                var id=val[val.length-1];
                var arr=this.arrProject[0].children.concat(this.arrProject[1].children).concat(this.arrProject[2].children);
                var obj;
                for(var i=0;i<arr.length;i++)
                {
                    if(arr[i].value==id)
                    {
                        obj=arr[i];
                        break;
                    }
                }
                if(obj.type=="doc" &&  obj.open)
                {
                    this.arrSelProject=[session.get("projectType"),session.get("projectId")]
                    window.open($.basePath()+"read/read.html#"+obj.value,"_blank");
                    return;
                }
                if(this.session.projectType!=obj.type)
                {
                    this.$store.dispatch("project/changeToInfo",{
                        id:obj.value,
                        name:obj.label,
                        type:obj.type
                    },{
                        root:true
                    })
                }
                else
                {
                    if(obj.type=="interface")
                    {
                        session.set("projectId",obj.value);
                        session.set("projectName",obj.label);
                        session.remove("versionId");
                        session.remove("versionName");
                        session.remove("versionDis");
                        session.remove("versionId");
                        session.remove("snapshotId");
                        session.remove("snapshotDis");
                        session.remove("snapshotCreator");
                        session.remove("snapshotDate");
                        this.$store.commit("setLastBaseUrl","");
                        $.startLoading(1);
                        this.$store.dispatch("init").then(function () {
                            $.stopLoading(1);
                        });
                    }
                    else if(obj.type=="doc")
                    {
                        session.set("projectId",obj.value);
                        session.set("projectName",obj.label);
                        $.startLoading(1);
                        this.$store.dispatch("init").then(function () {
                            $.stopLoading(1);
                        });
                    }
                    else if(obj.type=="test")
                    {
                        session.set("projectId",obj.value);
                        session.set("projectName",obj.label);
                        $.startLoading(1);
                        this.$store.dispatch("init").then(function () {
                            $.stopLoading(1);
                        });
                    }
                }
            },
        },
        created:function () {
            var _this=this;
            var query={
                name:""
            }
            if(this.session.teamId)
            {
                query.team=this.session.teamId
            }
            Promise.all([
                net.get("/project/filterlist",query),
                net.get("/doc/filterlist",query),
                net.get("/test/filterlist",query)
            ]).then(function (values) {
                var data1=values[0];
                var data2=values[1];
                var data3=values[2];
                if(data1.code==200)
                {
                    _this.arrProject[0].children=data1.data.map(function (obj) {
                        return {
                            label:obj.name,
                            value:obj._id,
                            type:"interface"
                        }
                    });
                }
                if(data2.code==200)
                {
                    _this.arrProject[1].children=data2.data.map(function (obj) {
                        return {
                            label:obj.name,
                            value:obj._id,
                            type:"doc",
                            open:obj.open
                        }
                    });
                }
                if(data3.code==200)
                {
                    _this.arrProject[2].children=data3.data.map(function (obj) {
                        return {
                            label:obj.name,
                            value:obj._id,
                            type:"test",
                        }
                    });
                }
            })
        }
    }
</script>









