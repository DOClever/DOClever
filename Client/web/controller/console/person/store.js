module.exports={
    namespaced:true,
    state:{
        sendInfo:{}
    },
    getters:{

    },
    mutations:{

    },
    actions:{
        init:function (context) {
            context.state.sendInfo={};
            return net.get("/user/sendinfo").then(function (data) {
                if(data.code==200)
                {
                    context.state.sendInfo=data.data;
                }
            })
        }
    },
    modules:{

    }
}