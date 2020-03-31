#!/bin/sh
echo ${@}
npm run build
node --no-warnings dist/app.js catch_mops -t performance -c 0 -y 2019 -s 01
node --no-warnings dist/app.js catch_mops -t performance -c 0 -y 2019 -s 02
node --no-warnings dist/app.js catch_mops -t performance -c 0 -y 2019 -s 03
node --no-warnings dist/app.js catch_mops -t performance -c 1 -y 2019 -s 01
node --no-warnings dist/app.js catch_mops -t performance -c 1 -y 2019 -s 02
node --no-warnings dist/app.js catch_mops -t performance -c 1 -y 2019 -s 03

