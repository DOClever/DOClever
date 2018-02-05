importScripts("jshint-min.js");
onmessage=function (e) {
    var vars=["window","document","location","setTimeout","setInterval","input","global","argv","env","console","log","opt","parseInt","parseFloat","Math","Date","Array","Object","Function","Number","String","Boolean","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","eval","null","undefined","arguments","Base64","MD5","SHA1","SHA256","SHA512","SHA3","RIPEMD160","AES","TripleDES","DES","Rabbit","RC4","RC4Drop","navigator","screen","history","clearTimeout","clearInterval","alert","confirm","prompt","RegExp","Form","function","__assert"];
    var source = e.data;
    var options = {
        undef: true,
        esversion: 6,
        sub:true
    };
    var predef = {
    };
    vars.forEach(function (obj) {
        predef[obj]=true;
    })
    JSHINT(source, options, predef);
    var obj=JSHINT.data();
    var err=[];
    if(obj.errors)
    {
        obj.errors.forEach(function (obj) {
            if(err.indexOf(obj.line)==-1)
            {
                err.push(obj.line);
            }
        })
    }
    if(obj.globals)
    {
        vars=vars.concat(obj.globals);
    }
    if(obj.functions)
    {
        vars=vars.concat(obj.functions.map(function (obj) {
            return obj.name
        }))
    }
    if(obj.member)
    {
        for(var key in obj.member)
        {
            vars.push(key);
        }
    }
    if(obj.unused)
    {
        vars=vars.concat(obj.unused.map(function (obj) {
            return obj.name
        }))
    }
    vars=vars.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
    postMessage({
        var:vars,
        err:err
    })
}








