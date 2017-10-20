#!bin/sh

# default settings
if [ ! $DB_HOST ]; then
  DB_HOST='mongodb://mongo:27017/DOClever'
fi
COMMAND_HOST=" --db "$DB_HOST

if [ ! $DB_FILE ]; then
  DB_FILE="/root/DOClever/data/file"
fi
COMMAND_FILE=" --file "$DB_FILE

if [ ! $DB_IMG ]; then
  DB_IMG="/root/DOClever/data/img"
fi
COMMAND_IMG=" --img "$DB_IMG

if [ ! $DB_TEMP ]; then
  DB_TEMP="/root/DOClever/data/tmp"
fi
COMMAND_TMP=" --temp "$DB_TEMP

if [ ! $PORT ]; then
  PORT="10000"
fi
COMMAND_PORT=" --port "$PORT
BASH_COMMAND=${COMMAND_HOST}${COMMAND_FILE}${COMMAND_IMG}${COMMAND_TMP}${COMMAND_PORT}
echo 'BASH_COMMAND is:'$BASH_COMMAND

export BASH_COMMAND="${BASH_COMMAND}"

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
