#!/usr/bin/env bash

###  ------------------------------- ###
###  script de partida App NODE  SIP ###
###  ------------------------------- ###
echo "Starting SIP"
export NODE_ENV=development
export PORT=3000
echo $NODE_ENV
nohup npm start > /dev/null & 