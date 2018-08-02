module.exports={
    data:function () {
        return {
            loading:false
        }
    },
    created:async function () {
        try
        {
            var init=this.$store.getters.rootInit;
            if((init!==undefined && init) || init===undefined)
            {
                this.loading=true;
                await this.$store.dispatch("init")
                this.loading=false;
            }
        }
        catch (err)
        {
            $.err(err);
        }
    }
}