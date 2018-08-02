let url=sessionStorage.getItem("baseUrl")
module.exports={
    baseUrl:(url && url.startsWith("http://"))?url:"http://"+url,
    host:(url && url.startsWith("http://"))?url:"http://"+url,
    online:window.debug?"http://localhost:8090":"http://doclever.cn:8090"
}