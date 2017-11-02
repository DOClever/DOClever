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

如果你有一个mongodb在跑：

那么直接只需要运行DOClever容器就行了:

```$xslt
docker run -it -d --name doclever -p 10000:10000 \
-e DB_HOST=mongodb://localhost:27017/DOClever \
-e PORT=10000 \
-e DB_FILE=/root/DOClever/data/file \
-e DB_IMG=/root/DOClever/data/img \
-e DB_TEMP=/root/DOClever/data/tmp \
-v /本地路径/file:/root/DOClever/data/file \
-v /本地路径/img:/root/DOClever/data/img \
-v /本地路径/tmp:/root/DOClever/data/tmp \
lw96/doclever:latest-ubuntu
```
这里的DB_FILE，DB_IMG，DB_TEMP为容器内的路径，可以不设置，默认为上面路径。
下面`-v`是设置本地路径挂载的。


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
    - /本地路径/file:/root/DOClever/data/file
    - /本地路径/img:/root/DOClever/data/img
    - /本地路径/tmp:/root/DOClever/data/tmp
    environment:
    - DB_HOST=mongodb://mongo:27017/DOClever
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

1. volumes：代表着把容器中的数据挂载到你本地路径，本地路径

2. environment: 环境变量。
(1)DB_HOST：可以使用自定义数据库地址，或者使用容器中的mongodb
(2)PORT：中设置的端口号10000为容器中的端口（尽量不变，只修改容器暴露的端口号，即ports下面的端口），而外部的端口可以自定义。

3. ports:容器暴露的实际端口
比如：
```
ports:
- 自己想设置的端口:10000
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

稍等片刻，系统需要加载配置。

可以通过：

```
docker logs -f DOClever
```

来查看容器打印的日志信息。

## 更新DOClever版本

### 备份数据

**重要：在升级之前，请备份所有数据**

备份数据：

1. 镜像备份： docker commit <镜像id> <取个名字>
2. Mongodb备份，[请参考](https://segmentfault.com/a/1190000006236494)；
3. DOClever备份：在项目设置中，导出项目（这个就比较麻烦了，需要一个个项目导出，如果小团队少项目可以这样做）


### 从3.x升级到4.x

之前的版本Mongo与DOClever合在一个容器中，那么需要先把mongo中的数据导出来。

	docker exec -it DOClever /bin/bash
	
1. 进入到DOClever容器，导出数据库`/data/db`相关的文件到宿主机，然后使用`volume`参数，挂载到宿主机。
	
2. 然后使用`mongo`命令连接到数据库，导出数据库数据；

3. 使用最新的`docker-compoes.yml`文件启新的容器，使用`docker compose up -d`重新启动容器。	

### 使用`docker-compose`更新

直接升级的前提：

1. mongodb的数据进行了本地化（使用了`volume`参数进行了本地化）； 
2. 使用的是4.x以上的版本镜像（DOClever与mongo已经分离的版本）
	
		version: "2"
		services:
		  DOClever:
		    image: lw96/doclever:latest-ubuntu
		    restart: always
		    container_name: "DOClever"
		    ports:
		    - 10000:10000
		    volumes:
		    - /hostdir/file:/root/DOClever/data/file
		    - /hostdir/img:/root/DOClever/data/img
		    - /hostdir/tmp:/root/DOClever/data/tmp
		    environment:
		    # - DB_HOST=mongodb://localhost:27017/DOClever
		    - PORT=10000
		    links:
		    - mongo:mongo
			
		  mongo:
		    image: mymongo
		    restart: always
		    container_name: "mongodb"
		    volumes:
		    - /data/db:/data/db 

		 
 修改`image: lw96/doclever:latest-ubuntu` 这个地方的版本号，版本号请参考：[https://hub.docker.com/r/lw96/doclever/tags/](https://hub.docker.com/r/lw96/doclever/tags/)   
    

然后使用`docker-compose up -d`进行更新。

### mongodb没有本地化数据的更新方法

如果你之前使用的是默认的`docker-compose.yml`起的docker容器，那么mongo默认是没有进行`volume`本地化的，那么备份mongo镜像：
 
	docker commit <mongodb-id> mymongo
 
修改`docker-compose.yml`文件如下：

	version: "2"
	services:
	  DOClever:
	    image: lw96/doclever:latest-ubuntu
	    restart: always
	    container_name: "DOClever"
	    ports:
	    - 10000:10000
	    volumes:
	    - /hostdir/file:/root/DOClever/data/file
	    - /hostdir/img:/root/DOClever/data/img
	    - /hostdir/tmp:/root/DOClever/data/tmp
	    environment:
	    # - DB_HOST=mongodb://localhost:27017/DOClever
	    - PORT=10000
	    links:
	    - mongo:mongo
	
	  mongo:
	    image: mymongo
	    restart: always
	    container_name: "mongodb"
	    volumes:
	    - /data/db:/data/db 

### 如果使用的数据库为非本地mongodb

修改`docker-compose.yml`文件如下：

	version: "2"
	services:
	  DOClever:
	    image: lw96/doclever:latest
	    restart: always
	    container_name: "DOClever"
	    ports:
	    - 10000:10000
	    volumes:
	    - /hostdir/file:/root/DOClever/data/file
	    - /hostdir/img:/root/DOClever/data/img
	    - /hostdir/tmp:/root/DOClever/data/tmp
	    environment:
	    - DB_HOST=mongodb://remoteIP:remotePort/DOClever
	    - PORT=10000

然后使用`docker-compose up -d`进行更新。
