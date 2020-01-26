#!bin/bash
npm run build
cd ./build
tar -cvf build.gz *
scp build.gz root@39.107.82.176:/www/wwwroot/chat
ssh root@39.107.82.176
