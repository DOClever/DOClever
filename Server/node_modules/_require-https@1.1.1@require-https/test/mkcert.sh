#!/bin/sh

openssl req -nodes -new -x509 -days 3650 -keyout server.key -out server.crt -subj "/CN=localhost"
