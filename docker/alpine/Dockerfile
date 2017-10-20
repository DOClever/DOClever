FROM node:6.11-alpine
MAINTAINER liwei liwei@wayearn.com

ENV PYTHON_VERSION=2.7.12-r0
ENV PY_PIP_VERSION=8.1.2-r0
ENV SUPERVISOR_VERSION=3.2.4-r0

# only for Chinese Developers
#RUN cp /etc/apk/repositories /etc/apk/repositories.bak
#
#RUN echo "http://mirrors.aliyun.com/alpine/v3.4/main/" > /etc/apk/repositories

RUN apk update && apk add -u alpine-sdk python=$PYTHON_VERSION supervisor=$SUPERVISOR_VERSION
#py-pip=$PY_PIP_VERSION
#RUN pip install supervisor==$SUPERVISOR_VERSION

RUN apk add git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

# only for local test, copy source code of DOClever to this file, create a fold named "source", and paste codes into it.
#COPY /source /root/DOClever
RUN git clone -b dev https://github.com/kanlidy/DOClever.git /root/DOClever

EXPOSE 10000

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
