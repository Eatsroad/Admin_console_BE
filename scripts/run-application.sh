#!/bin/bash

kill -9 5906
cd /home/ec2-user/eatsroad
touch testFile
rm -rf ~/log/eatsroad.log &&
rm -rf ~/log/eatsroad-error.log &&
yarn build &&
node ./dist/main.js >> /home/ec2-user/log/eatsroad.log 2>> /home/ec2-user/log/eatsroad-error.log &