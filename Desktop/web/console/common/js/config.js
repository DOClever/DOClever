var o={
    online:window.debug?"http://localhost:8090":"http://doclever.cn:8090",
    onlineHost:window.debug?"http://localhost":"http://doclever.cn"
}
Object.defineProperty(o,"baseUrl",{
    get:function () {
        let url=sessionStorage.getItem("baseUrl")
        return (url && url.startsWith("http://"))?url:"http://"+url;
    },
    enumerable : true,
    configurable : true
})
Object.defineProperty(o,"host",{
    get:function () {
        let url=sessionStorage.getItem("baseUrl")
        return (url && url.startsWith("http://"))?url:"http://"+url;
    },
    enumerable : true,
    configurable : true
})
module.exports=o;