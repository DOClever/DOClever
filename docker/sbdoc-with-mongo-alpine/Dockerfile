FROM mvertes/alpine-mongo:3.4.4-0
MAINTAINER pollyduan pollyduan@163.com

RUN echo '@edge http://nl.alpinelinux.org/alpine/edge/main' >> /etc/apk/repositories
RUN echo '@edge http://dl-3.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories

RUN apk update && apk upgrade \
  && apk add --no-cache nodejs-lts@edge supervisor git\
  && rm -rf /tmp/* && rm -rf /root/.npm/*

RUN mkdir -p /var/log/supervisor

RUN git clone https://github.com/sx1989827/SBDoc.git /root/SBDoc

RUN mkdir -p /data/db

COPY supervisord.conf /etc/supervisor.d/supervisord.ini
EXPOSE 10000

ENTRYPOINT "/usr/bin/supervisord"
