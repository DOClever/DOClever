<template>
    <el-dialog title="上传"  width="50%" ref="box" :modal="hud" :visible.sync="showDialog" append-to-body :close-on-press-escape="false" :close-on-click-modal="false" :show-close="!uploadPending">
        <el-row class="row" style="height: 200px;border: 1px lightgray dashed;text-align: center" draggable="true" id="dragFile" @dragenter.native.self="dragEnter($event)" @dragleave.native.self="dragLeave($event)" @dragover.native.self="dragOver($event)" @drop.native="drop($event)">
            <i class="el-icon-upload" style="font-size: 60px;color: darkgray;margin-top: 30px"></i>
            <div>
                拖动文件到这里
            </div>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="per" status="success" style="width: 80%;margin:20px auto 0 auto"></el-progress>
        </el-row>
    </el-dialog>
</template>

<style>

</style>

<script>
    module.exports = {
        props:["type","socket","doc"],
        data: function () {
            return {
                showDialog:false,
                per:0,
                uploadPending:false,
                file:null
            }
        },
        methods: {
            dragEnter:function (event) {
                event.target.style.backgroundColor = 'rgba(88,183,255,0.6)';
                event.stopPropagation();
                event.preventDefault();
            },
            dragLeave:function (event) {
                event.target.style.backgroundColor = 'white';
            },
            dragOver:function (event) {
                event.stopPropagation();
                event.preventDefault();
            },
            drop:function (event) {
                var _this=this;
                event.target.style.backgroundColor = 'white';
                event.stopPropagation();
                event.preventDefault();
                var file=event.dataTransfer.files[0];
                this.file=file;
                this.socket.emit("data",JSON.stringify({
                    project:session.get("projectId"),
                    user:session.get("id"),
                    type:"size",
                    flag:"upload"
                }))
            },
            size:function (obj) {
                if(sessionStorage.getItem("env")=="doclever.cn" && obj.use+this.file.size>obj.total)
                {
                    $.tip("上传文件大小超过可用空间大小",0);
                    return;
                }
                this.uploadPending=true;
                var stream = window.ss.createStream();
                window.ss(this.socket).emit('upload', stream, {
                    doc:this.doc,
                    user:session.get("id"),
                    name:this.file.name.replace(/\s+/g,""),
                    type:this.type,
                    size:this.file.size
                });
                var blobStream=window.ss.createBlobReadStream(this.file);
                var size = 0;
                var _this=this;
                blobStream.on('data', function(chunk) {
                    size += chunk.length;
                    _this.per=Math.floor(size / _this.file.size * 100);
                });
                blobStream.pipe(stream);
            },
            close:function () {
                this.showDialog=false;
            }
        },
        created:function () {
            this.$store.getters.event.$on("docSocketSize",this.size);
            this.$store.getters.event.$on("docSocketUrl",this.close);
        },
        beforeDestroy:function () {
            this.$store.getters.event.$off("docSocketSize",this.size);
            this.$store.getters.event.$off("docSocketUrl",this.close);
        }
    }
</script>