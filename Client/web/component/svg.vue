<template>
    <object :data="src" type="image/svg+xml"/>
</template>

<style scoped>

</style>

<script>
    module.exports={
        props:["src","color"],
        data:function () {
            return {
                color1:""
            }
        },
        watch:{
            color:function (val) {
                var arr=this.$el.contentDocument.getElementsByTagName("path");
                for(var i=0;i<arr.length;i++)
                {
                    if(val)
                    {
                        arr[i].setAttribute("fill",val);
                    }
                    else
                    {
                        arr[i].setAttribute("fill",this.color1);
                    }
                }
            }
        },
        mounted:function () {
            var _this=this;
            this.$el.addEventListener("load", function() {
                var arr=_this.$el.contentDocument.getElementsByTagName("path");
                for(var i=0;i<arr.length;i++)
                {
                    _this.color1=arr[i].getAttribute("fill");
                    if(_this.color)
                    {
                        arr[i].setAttribute("fill",_this.color);
                    }
                }
                var style=_this.$el.contentDocument.querySelector("style");
                style.textContent+="svg { cursor: pointer; }";
                var svg=_this.$el.contentDocument.querySelector("svg");
                svg.addEventListener("click",function (e) {
                    _this.$emit("click",e);
                })
            });
        }
    }
</script>