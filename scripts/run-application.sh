#!/bin/bash

fuser -k -n tcp 3000
rm -rf ~/log/eatsroad.log && rm -rf ~/log/eatsroad-error.log
cd /home/ec2-user/eatsroad
node ./dist/main.js
# >> /home/ec2-user/log/eatsroad.log 2>> /home/ec2-user/log/eatsroad-error.log &