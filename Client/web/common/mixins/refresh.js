module.exports={
    created:function () {
        var init=this.$store.getters.rootInit;
        if((init!==undefined && init) || init===undefined)
        {
            $.startLoading(1);
            this.$store.dispatch("init").then(function () {
                $.stopLoading()
            })
        }
    }
}