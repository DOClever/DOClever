FROM node:boron
MAINTAINER liwei liwei@wayearn.com

# only for Chinese Developers

# RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak

# COPY ./sources.list /etc/apt/

# RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C0B21F32 \
#   && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 437D05B5

RUN apt-get update \
  && apt-get install -yqq supervisor mongodb 

RUN mkdir -p /var/log/supervisor

RUN git clone https://github.com/sx1989827/DOClever.git /root/DOClever

RUN mkdir -p /data/db

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
EXPOSE 10000

COPY ./entrypoint.sh /

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
