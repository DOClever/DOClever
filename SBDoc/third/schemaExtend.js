/**
 * Created by sunxin on 16/6/15.
 */
var mongoose = require('mongoose');
var moment=require("moment");
mongoose.Schema.prototype.configOutputField=function (arr,arrTransformField) {
    this.set('toJSON', {
        transform: function (doc, ret, options) {
            if(arrTransformField && (arrTransformField instanceof Array) && arrTransformField.length>0)
            {
                arrTransformField.forEach(function (item) {
                    if(ret[item])
                    {
                        ret[item]=moment(ret[item]).format("YYYY-MM-DD HH:mm:ss");
                    }
                })
            }
            for(var key in arr)
            {
                var dic=arr[key];
                if(dic.old!=undefined && dic["new"]!=undefined && ret[dic.old]!=undefined)
                {
                    ret[dic["new"]] = ret[dic.old];
                    delete ret[dic.old];
                }
            }
        }
    });
}