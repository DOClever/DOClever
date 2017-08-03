#!bin/sh

# create a DB named DOClever
mongo --eval "db.getSiblingDB('DOClever')"

# run supervisord
/usr/bin/supervisord