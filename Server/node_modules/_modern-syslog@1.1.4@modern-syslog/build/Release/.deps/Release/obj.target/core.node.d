cmd_Release/obj.target/core.node := g++ -shared -pthread -rdynamic -m64  -Wl,-soname=core.node -o Release/obj.target/core.node -Wl,--start-group Release/obj.target/core/core.o -Wl,--end-group 
