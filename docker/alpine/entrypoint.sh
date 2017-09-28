#!bin/sh

DB_FILE='/doclever/file'
DB_IMG='/doclever/img'
DB_TEMP='/doclever/tmp'

if [ ! $DB_HOST ]; then
  DB_HOST='mongodb://mongo:27017/DOClever'
fi
COMMAND_HOST=" --db "$DB_HOST

if [ -n $DB_FILE ]; then
  COMMAND_FILE=" --file "$DB_FILE
fi

if [ -n $DB_IMG ]; then
  COMMAND_IMG=" --img "$DB_IMG
fi

if [ -n $DB_TEMP ]; then
  COMMAND_TMP=" --temp "$DB_TEMP
fi  

if [ ! -n $PORT ]; then
  COMMAND_PORT=" --port "$PORT
fi

BASH_COMMAND=${COMMAND_HOST}${COMMAND_FILE}${COMMAND_IMG}${COMMAND_TMP}${COMMAND_PORT}

echo 'BASH_COMMAND is:'$BASH_COMMAND

rm -rf /root/DOClever/Server/node_modules

# Chinese Developers

npm install -g cnpm --registry=https://registry.npm.taobao.org

cd /root/DOClever/Server

cnpm install

echo_supervisord_conf > /etc/supervisord.conf

export BASH_COMMAND=$BASH_COMMAND

cat >>/etc/supervisord.conf<<-EOF
[supervisord]
nodaemon=true
[program:DOClever]
autorestart = true
autostart = true
stdout_logfile_maxbytes=100MB
stdout_logfile=/tmp/debug.log
stderr_logfile=/tmp/error.log
command=node /root/DOClever/Server/bin/www $BASH_COMMAND
EOF

# run supervisord
/usr/bin/supervisord -c /etc/supervisord.conf
