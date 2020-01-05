#!bin/bash
tar -cvf build.gz *
scp build.gz root@39.107.82.176:/www/wwwroot/chart-server
ssh root@39.107.82.176
