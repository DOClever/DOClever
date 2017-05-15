FROM node:6.10.3
MAINTAINER pollyduan pollyduan@163.com

RUN apt-get update \
  && apt-get install -yqq supervisor mongodb \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/supervisor

RUN git clone https://github.com/sx1989827/SBDoc.git /root/SBDoc

RUN mkdir -p /data/db

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
EXPOSE 10000

ENTRYPOINT "/usr/bin/supervisord"
