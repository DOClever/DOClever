# DOClever 启用HTTPS协议
---

主要使用acme来申请证书

**acme.sh** 实现了 `acme` 协议, 可以从 letsencrypt 生成免费的证书.

主要步骤:

1. 安装 **acme.sh**
1. 生成证书
1. copy 证书到 nginx/apache 或者其他服务
1. 更新证书
1. 更新 **acme.sh**
1. 出错怎么办, 如何调试

下面详细介绍.

# 1. 安装 **acme.sh**

安装很简单, 一个命令:
```
curl  https://get.acme.sh | sh
```

普通用户和 root 用户都可以安装使用.
安装过程进行了以下几步:

1) 把 acme.sh 安装到你的 **home** 目录下:

```
~/.acme.sh/
```
并创建 一个 bash 的 alias, 方便你的使用:  `acme.sh=~/.acme.sh/acme.sh`

2). 自动为你创建 cronjob,  每天 0:00 点自动检测所有的证书, 如果快过期了, 需要更新, 则会自动更新证书.

更高级的安装选项请参考: https://github.com/Neilpang/acme.sh/wiki/How-to-install

**安装过程不会污染已有的系统任何功能和文件**, 所有的修改都限制在安装目录中: `~/.acme.sh/`

# 2. 生成证书

**acme.sh** 实现了 **acme** 协议支持的所有验证协议.
一般有两种方式验证: http 和 dns 验证.

### 1. http 方式需要在你的网站根目录下放置一个文件, 来验证你的域名所有权,完成验证. 然后就可以生成证书了.

```
acme.sh  --issue  -d mydomain.com -d www.mydomain.com  --webroot  /home/wwwroot/mydomain.com/
```

只需要指定域名, 并指定域名所在的网站根目录. **acme.sh** 会全自动的生成验证文件, 并放到网站的根目录, 然后自动完成验证. 最后会聪明的删除验证文件. 整个过程没有任何副作用. 

如果你用的 **apache**服务器, **acme.sh** 还可以智能的从 **apache**的配置中自动完成验证, 你不需要指定网站根目录:
```
acme.sh --issue  -d mydomain.com   --apache
```

如果你用的 **nginx**服务器, 或者反代, **acme.sh** 还可以智能的从 **nginx**的配置中自动完成验证, 你不需要指定网站根目录:
```
acme.sh --issue  -d mydomain.com   --nginx
```

**注意, 无论是 apache 还是 nginx 模式, acme.sh在完成验证之后, 会恢复到之前的状态, 都不会私自更改你本身的配置. 好处是你不用担心配置被搞坏, 也有一个缺点, 你需要自己配置 ssl 的配置, 否则只能成功生成证书, 你的网站还是无法访问https. 但是为了安全, 你还是自己手动改配置吧.**

如果你还没有运行任何 web 服务, **80** 端口是空闲的, 那么 **acme.sh** 还能假装自己是一个webserver, 临时听在**80** 端口, 完成验证:

```
acme.sh  --issue -d mydomain.com   --standalone
```

更高级的用法请参考: https://github.com/Neilpang/acme.sh/wiki/How-to-issue-a-cert


### 2. dns 方式, 在域名上添加一条 txt 解析记录, 验证域名所有权.

这种方式的好处是, 你不需要任何服务器, 不需要任何公网 ip, 只需要 dns 的解析记录即可完成验证.
坏处是，如果不同时配置 Automatic DNS API，使用这种方式 acme.sh 将无法自动更新证书，每次都需要手动再次重新解析验证域名所有权。

```
acme.sh  --issue  --dns   -d mydomain.com
```

然后, **acme.sh** 会生成相应的解析记录显示出来, 你只需要在你的域名管理面板中添加这条 txt 记录即可.

等待解析完成之后, 重新生成证书:
```
acme.sh  --renew   -d mydomain.com
```
注意第二次这里用的是 `--renew`


dns 方式的真正强大之处在于可以使用域名解析商提供的 api 自动添加 txt 记录完成验证.

**acme.sh** 目前支持 cloudflare, dnspod, cloudxns, godaddy 以及 ovh 等数十种解析商的自动集成. 

以 dnspod 为例, 你需要先登录到 dnspod 账号, 生成你的 api id 和 api key, 都是免费的. 
然后:
```
export DP_Id="1234"

export DP_Key="sADDsdasdgdsf"

acme.sh   --issue   --dns dns_dp   -d aa.com  -d www.aa.com

```

证书就会自动生成了. 这里给出的 api id 和 api key 会被自动记录下来, 将来你在使用 dnspod api 的时候, 就不需要再次指定了.
直接生成就好了:

```
acme.sh  --issue   -d  mydomain2.com   --dns  dns_dp
```

更详细的 api 用法: https://github.com/Neilpang/acme.sh/blob/master/dnsapi/README.md


# 3. copy/安装 证书

前面证书生成以后, 接下来需要把证书 copy 到真正需要用它的地方.

注意, 默认生成的证书都放在安装目录下: `~/.acme.sh/`,  请不要直接使用此目录下的文件, 例如: 不要直接让 nginx/apache 的配置文件使用这下面的文件. 这里面的文件都是内部使用, 而且目录结构可能会变化.

正确的使用方法是使用 `--installcert` 命令,并指定目标位置, 然后证书文件会被copy到相应的位置,
例如:
```
acme.sh  --installcert  -d  <domain>.com   \
        --key-file   /etc/nginx/ssl/<domain>.key \
        --fullchain-file /etc/nginx/ssl/fullchain.cer \
        --reloadcmd  "service nginx force-reload"
```

(一个小提醒, 这里用的是 `service nginx force-reload`, 不是 `service nginx reload`, 据测试, `reload` 并不会重新加载证书, 所以用的 `force-reload`)

Nginx 的配置 `ssl_certificate` 使用 `/etc/nginx/ssl/fullchain.cer` ，而非 `/etc/nginx/ssl/<domain>.cer` ，否则 [SSL Labs](https://www.ssllabs.com/ssltest/) 的测试会报 `Chain issues Incomplete` 错误。

`--installcert`命令可以携带很多参数, 来指定目标文件.  并且可以指定 reloadcmd, 当证书更新以后, reloadcmd会被自动调用,让服务器生效.

详细参数请参考: https://github.com/Neilpang/acme.sh#3-install-the-issued-cert-to-apachenginx-etc

值得注意的是, 这里指定的所有参数都会被自动记录下来, 并在将来证书自动更新以后, 被再次自动调用.


# 4. 更新证书

目前证书在 60 天以后会自动更新, 你无需任何操作. 今后有可能会缩短这个时间, 不过都是自动的, 你不用关心.




# 5. 更新 acme.sh

目前由于 acme 协议和 letsencrypt CA 都在频繁的更新, 因此 acme.sh 也经常更新以保持同步. 

升级 acme.sh 到最新版 :
```
acme.sh --upgrade
```

如果你不想手动升级, 可以开启自动升级:

```
acme.sh  --upgrade  --auto-upgrade
```
之后, acme.sh 就会自动保持更新了.

你也可以随时关闭自动更新:

```
acme.sh --upgrade  --auto-upgrade  0
```


# 6. 出错怎么办：
如果出错, 请添加 debug log：

```
acme.sh  --issue  .....  --debug 
```
或者：
```
acme.sh  --issue  .....  --debug  2
```

请参考： https://github.com/Neilpang/acme.sh/wiki/How-to-debug-acme.sh



最后, 本文并非完全的使用说明, 还有很多高级的功能, 更高级的用法请参看其他 wiki 页面.

https://github.com/Neilpang/acme.sh/wiki

# 7. 配置nginx

注意两个目录，把上面生成的SSL证书放到`/home/ssl`目录下，使用下面的配置文件。

PS: 不建议直接使用`/root/.acme/`目录下的证书（官方这样建议）。


下面是Nginx.conf的配置：

```
upstream restserver{
  server       127.0.0.1:10000 fail_timeout=0;
}
 
# listen on HTTP2/SSL
server {
  listen       443 ssl http2;
  server_name  yourdomain.com
 
  # ssl certs from letsencrypt
  ssl on;
  ssl_certificate /home/ssh/fullchain.cer;
  ssl_certificate_key /home/ssh/yourdomain.com.key;
  # dhparam.pem
  ssl_dhparam /home/ssh/dhparam.pem;

  ssl_session_timeout 5m;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
  ssl_prefer_server_ciphers on;
 
  location / {
    # set proxy headers for cloudflare/jira
    proxy_set_header  Host $host:$server_port;
    proxy_set_header  X-Real-IP $remote_addr;
    proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header  X-Forwarded-Proto $scheme;
    # hand the request off to jira on non-ssl
    proxy_pass        http://restserver;
  }
}
 
# redirect HTTP and handle let's encrypt requests
server {
  listen       80;
  server_name  yourdomain.com
  root         /var/lib/jira;
   
  # handle letsencrypt domain validation
  location ~ /.well-known {
    allow all;
  }
 
  # send everything else to HTTPS
  location / {
    return 302 https://yourdomain.com:portofdocker
  }
}
```

然后配置`docker-compose.yml`文件中的nginx：

```
  nginx:
    container_name: 'nginx'
    restart: always
    image: nginx
    ports:
    - "80:80"
    - "443:443"
    volumes:
    - /home/nginx/:/etc/nginx/conf.d:ro
    - /home/ssh:/home/ssh
    links:
    - doclever:doclever
```

最后就是：

```
docker-compose up -d
```

# 8. 自动运维

这里可以写一个简单的shell脚本`ssl.sh`：

```
#!/bin/sh
"/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null

cp ssl目录/* /home/ssl

cd 到docker-compose.yml目录

docker-compose up --force-recreate -d

```
给予这个脚本执行权限
`chmod +x ssl.sh`

修改`crontab -e`里面的定时任务。

```
3 0 * * * "/home/"ssl.sh > /dev/null
```