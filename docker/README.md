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

```
docker run -d --name doclever -p 10000:10000 lw96/doclever
```

稍等片刻，系统需要加载配置。

使用浏览器打开：

```
http://127.0.0.1:10000/
```


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
