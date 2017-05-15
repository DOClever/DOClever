SBDoc Docker 镜像
===

构建镜像
---

使用docker命令构建

```
docker build -t sx1989827/sbdoc-alpine .
```

启动容器
---

```
docker run -d --name sbdoc -p 10000:10000 sx1989827/sbdoc-alpine
```

稍等片刻，系统需要加载配置。

```
http://127.0.0.1:10000/
```

docker-compose用户
---

如果你安装了docker-compose：

### 构建镜像

```
docker-compose build
```

### 启动容器

```
docker-compose up -d
```
