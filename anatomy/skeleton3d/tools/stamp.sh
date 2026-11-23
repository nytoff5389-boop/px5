#!/bin/sh
# ใส่เลขเวอร์ชันใหม่ทุกครั้งก่อน deploy: sh tools/stamp.sh
cd "$(dirname "$0")/.." && V=$(date +%s)
sed -i -E "s/\?v=[0-9]+/?v=$V/g; s/HN_BUILD='[0-9]+'/HN_BUILD='$V'/" index.html app.js && echo "$V" > build.txt && echo "build $V"
