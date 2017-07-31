#!/usr/bin/env bash

###  ------------------------------- ###
###  script de partida App NODE  LIN ###
###  ------------------------------- ###
echo "Starting LIN"
export NODE_ENV=testing
echo $NODE_ENV
nohup npm start > /dev/null & 
