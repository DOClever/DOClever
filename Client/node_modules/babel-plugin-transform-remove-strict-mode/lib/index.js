exports["default"] = function () {
    return {
        visitor: {
            Program: {
                exit: function exit(path) {
                    var list = path.node.directives;
                    for(var i=list.length-1, it; i>=0 ; i--){
                        it = list[i];
                        if (it.value.value==='use strict'){
                            list.splice(i,1);
                        }
                    }
                }

            }
        }
    };
};

module.exports = exports["default"];