#!/usr/bin/env bash

###  ------------------------------- ###
###  script de partida App NODE  SIP ###
###  ------------------------------- ###
echo "Starting SIP"
export NODE_ENV=aws
echo $NODE_ENV
nohup npm start > /dev/null & 
