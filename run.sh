#!/bin/sh
echo ${@}
npm run build
node --no-warnings dist/app.js ${@}
