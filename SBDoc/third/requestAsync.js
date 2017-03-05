/**
 * Created by sunxin on 16/6/8.
 */
var request=require("request");
var blue=require("bluebird");
var requestAsync=blue.promisify(request);

module.exports=requestAsync;