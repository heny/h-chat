#!/bin/bash
npm run build
cd ./build
tar -cvf build.gz *
scp build.gz root@39.107.82.176:/data/html/chat
echo 'success' > SUCCESS
scp SUCCESS root@39.107.82.176:/data/html/chat
