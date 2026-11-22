#!/bin/sh
# อัปเวอร์ชันไฟล์ทั้งหมด และ version.json ให้เบราว์เซอร์รู้ว่ามีหน้าใหม่
cd "$(dirname "$0")" && V=$(date +%s) && sed -i -E "s/\?v=[0-9]+/?v=$V/g" index.html anatomy/index.html calc/index.html bio/index.html && printf %s "{\"v\":$V}" > version.json && echo $V
