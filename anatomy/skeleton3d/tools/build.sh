#!/bin/sh
# สร้าง skeleton.glb + landmarks.json ใหม่จาก BodyParts3D (ต้องมีโฟลเดอร์ raw/ ที่แตกไฟล์แล้ว)
# ใช้: sh tools/build.sh <raw_dir> <work_dir>
set -e
python3 "$(dirname "$0")/build_glb.py" "$1" "$2/skeleton_raw.glb"
python3 "$(dirname "$0")/landmarks.py" "$2/skeleton_raw.glb" "$2"
npx @gltf-transform/cli@4.1.1 optimize "$2/skeleton_lm_raw.glb" skeleton.glb --compress meshopt --simplify true --simplify-ratio 0.4 --simplify-error 0.001 --join false --instance false --flatten false
cp "$2/landmarks.json" "$2/bones_map.json" .
# กล้ามเนื้อ: ต้องมี skeleton_raw.glb จากขั้นบน (ใช้จัดตำแหน่งและหาจุดเกาะ)
python3 "$(dirname "$0")/build_muscles.py" "$1" "$2/skeleton_raw.glb" "$2"
npx @gltf-transform/cli@4.1.1 optimize "$2/muscles_raw.glb" muscles.glb --compress meshopt --simplify true --simplify-ratio 0.045 --simplify-error 0.003 --join false --instance false --flatten false
cp "$2/m_landmarks.json" .
