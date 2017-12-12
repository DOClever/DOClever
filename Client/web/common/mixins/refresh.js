module.exports={
    created:function () {
        var init=this.$store.getters.rootInit;
        if((init!==undefined && init) || init===undefined)
        {
            if(!/\/public\/public\.html/i.test(location.href))
            {
                $.startLoading(1);
            }
            this.$store.dispatch("init").then(function () {
                if(!/\/public\/public\.html/i.test(location.href))
                {
                    $.stopLoading()
                }
            })
        }
    }
}