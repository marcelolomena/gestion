#!/bin/bash
TODAY=`date +%d`
TOMORROW=`date +%d -d "1 day"`

if [ $TOMORROW -lt $TODAY ]; then
	sh /home/art/sip/job.sh
fi
