# DOClever Docker 镜像
---


## 安装docker
---

### 1.使用daocloud加速：

```
curl -sSL https://get.daocloud.io/docker | sh
```

如果安装不成功，可以选择使用二进制包安装方式。 [下载二进制包](https://get.daocloud.io/docker/builds)

### 2.构建镜像（可以使用线上版本，跳过此步骤）

线上docker镜像：[https://hub.docker.com/r/lw96/doclever/](https://hub.docker.com/r/lw96/doclever/)

使用docker命令构建

```
docker build -t lw96/doclever .
```

### 3.启动容器

建议使用docker-compose进行容器的管理

```
version: "2"
services:
  DOClever:
    image: lw96/doclever
    restart: always
    container_name: "DOClever"
    ports:
    - 10000:10000
    volumes:
    - /本地路径/file:/doclever/file
    - /本地路径/img:/doclever/img
    - /本地路径/tmp:/doclever/tmp
    environment:
    # - DB_HOST=mongodb://localhost:27017/DOClever
    - PORT=10000
    links:
    - mongo:mongo

  mongo:
    image: mongo:latest
    restart: always
    container_name: "mongodb"
    volumes:
    - /my/own/datadir:/data/db

```

对上面代码的说明：

volumes：代表着把容器中的数据挂载到你本地路径，本地路径
environment: 环境变量。
- DB_HOST：可以使用自定义数据库地址，或者使用容器中的mongodb
- PORT：中设置的端口号10000为容器中的端口（尽量不变，只修改容器暴露的端口号，即ports下面的端口），而外部的端口可以自定义。
ports:容器暴露的实际端口
- 自己想设置的端口:10000


## 使用自动化docker-compose
---

### 1.docker-compose 安装方法

```
curl -L https://get.daocloud.io/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

如果你安装了docker-compose：

### 2.构建镜像(使用线上跳过此步骤)

线上docker镜像：[https://hub.docker.com/r/lw96/doclever/](https://hub.docker.com/r/lw96/doclever/)

```
docker-compose build
```

### 3.启动容器

```
docker-compose up -d
```

稍等片刻，系统需要加载配置。

可以通过：

```
docker logs -f DOClever
```

来查看容器打印的日志信息。
