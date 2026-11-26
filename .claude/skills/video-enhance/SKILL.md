---
name: video-enhance
description: ปรับคุณภาพวิดีโอให้คมชัดขึ้นแบบแอพ enhancer (Remini/CapCut HD/Topaz-style) ด้วย ffmpeg — ลด noise, ลบบล็อกบีบอัด, upscale เป็น 1080p/4K, sharpen แบบ CAS, ปรับคอนทราสต์/สี และเพิ่มเฟรมเรตให้ลื่น (60fps). ใช้เมื่อผู้ใช้ขอ "ทำวิดีโอให้ชัด", "ปรับคุณภาพคลิป", "upscale", "HD", "4K", "แก้ภาพแตก/เบลอ/noise", "ทำให้ลื่น 60fps" หรือส่งไฟล์วิดีโอมาให้ปรับให้ดีขึ้น
---

# Video Enhance

Pipeline (ลำดับสำคัญ — ลด noise ก่อน upscale/sharpen ไม่งั้น noise ถูกขยาย):
1. `deblock` (ถ้าเลือก) — ลบ block artifact จากคลิปบีบอัดหนัก (LINE/FB/TikTok ซ้ำหลายรอบ)
2. Denoise — `hqdn3d` (เร็ว, temporal) หรือ `nlmeans` (ช้า แต่เก็บรายละเอียดดีกว่า)
3. Upscale — `lanczos` + full chroma; อัตโนมัติ: <720p → x2, 720–1079p → 1080p, สูงสุด 2160p
4. Sharpen — `cas` (Contrast Adaptive Sharpening, AMD FidelityFX) + `unsharp` เบาๆ
5. Color — `eq` เพิ่ม contrast/saturation เล็กน้อย
6. `minterpolate` (ถ้าใส่ `--fps`) — motion-compensated interpolation ให้ลื่นแบบ 60fps
7. Encode x264 CRF 18 (visually near-lossless), `-tune film`, faststart

## วิธีใช้

```bash
S=.claude/skills/video-enhance/scripts/enhance.sh
$S input.mp4                                  # standard, auto-upscale
$S input.mp4 out.mp4 --preset strong --deblock  # คลิปแตก/มืด noise เยอะ
$S input.mp4 --height 2160 --fps 60          # 4K + 60fps (ช้ามาก)
$S input.mp4 --preset light --fast           # เร็ว ปรับนิดหน่อย
```

ขั้นตอนที่ควรทำ:
1. `ffprobe` ดูความละเอียด/fps/bitrate ก่อน แล้วเลือก preset: คลิปดีอยู่แล้ว → `light`; ทั่วไป → `standard`; มืด/แตก/เก่า → `strong --deblock`
2. คลิปยาว: ทดสอบ 5 วินาทีก่อน (`ffmpeg -ss 10 -t 5 -i in.mp4 -c copy sample.mp4`) แล้วทำภาพเทียบ before/after:
   `ffmpeg -i sample.mp4 -i sample_enhanced.mp4 -filter_complex "[0]scale=-2:720[a];[1]scale=-2:720[b];[a][b]hstack" -frames:v 1 -ss 2 compare.png`
3. รันทั้งไฟล์ แล้วส่งไฟล์ผลลัพธ์ + ภาพเทียบให้ผู้ใช้

## ข้อจำกัด / AI upscale
- ffmpeg filters เป็น classical — ไม่ "สร้าง" รายละเอียดใหม่ (หน้าคน/ตัวหนังสือ) แบบ AI
- ถ้าต้องการระดับ Remini/Topaz: ใช้ Real-ESRGAN (`realesrgan-ncnn-vulkan -n realesr-animevideov3` หรือ `realesrgan-x4plus`) ต่อเฟรม หรือ GFPGAN/CodeFormer สำหรับหน้าคน — ต้องมี GPU; ถ้ามี binary อยู่ในเครื่องให้ใช้แทนขั้น 3
- `minterpolate` ช้าและอาจเกิด artifact กับฉากเคลื่อนไหวเร็ว — ใช้เมื่อผู้ใช้ขอความลื่นเท่านั้น
- oversharpen ทำให้เกิด halo: ถ้าเห็นขอบขาว ลด preset ลง
