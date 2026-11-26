---
name: claude-image
description: Claude สร้างรูปภาพเองโดยไม่ต้องใช้ API ภายนอก — เขียนภาพเป็น SVG/HTML+CSS/Canvas แล้ว render เป็น PNG ความละเอียดสูงด้วย Chromium. เหมาะกับโลโก้, ไอคอน, ภาพประกอบ flat/vector, โปสเตอร์, อินโฟกราฟิก, ไดอะแกรม, การ์ด, ปก, mascot, pattern, ภาพตัวอักษรไทย/อังกฤษคมชัด. ใช้เมื่อผู้ใช้ขอ "สร้างรูป", "วาดรูป", "ทำโลโก้", "ทำโปสเตอร์", "ทำภาพประกอบ", "ทำปก", "ทำไอคอน", "ทำอินโฟกราฟิก" หรือ "ให้ Claude วาดเอง"
---

# Claude Image — วาดเองด้วยโค้ด

Claude ไม่มีโมเดล diffusion จึง "วาด" ด้วยโค้ดเวกเตอร์ แล้ว render เป็นภาพ. จุดแข็งเหนือ AI image ทั่วไป: ตัวอักษรถูกต้อง 100% (รวมภาษาไทย), รูปทรงแม่นยำ, แก้ไขทีละส่วนได้, ได้ทั้ง SVG (ขยายไม่แตก) และ PNG. จุดอ่อน: ภาพถ่ายเหมือนจริง (photorealism) ทำไม่ได้ — ถ้าผู้ใช้ต้องการภาพถ่ายจริง ให้บอกตรงๆ และเสนอเขียน prompt ไปใช้กับ ChatGPT/Gemini แทน

## Workflow
1. **Brief** — สรุป: เนื้อหา, สไตล์, ขนาด/อัตราส่วน (โพสต์ 1080×1080, สตอรี่ 1080×1920, ปก 1920×1080, A4 2480×3508), สี, ข้อความในภาพ. ถ้าข้อมูลพอให้เริ่มเลย ไม่ต้องถาม
2. **Composition** — วาง grid/จุดโฟกัส/ลำดับสายตาก่อนเขียน (rule of thirds, safe margin ≥ 6%)
3. **เขียนโค้ด** ลง `output/<slug>.svg` (หรือ `.html` เมื่อต้องใช้ CSS ขั้นสูง/ฟอนต์เว็บ/Canvas)
4. **Render** `node .claude/skills/claude-image/scripts/render.js output/<slug>.svg` → PNG @2x
5. **ตรวจด้วยตา** — Read PNG ที่ได้ แล้ววิจารณ์ตัวเอง: สัดส่วน, ข้อความล้น/ทับ, contrast, ความสมดุล, จุดที่ดูแข็ง/ว่าง. แก้แล้ว render ซ้ำ ≥ 1 รอบ ก่อนส่ง
6. **ส่งงาน** — ส่ง PNG (และ SVG ถ้าเป็นโลโก้/ไอคอน) ให้ผู้ใช้ด้วย SendUserFile

## Render options
```bash
R=.claude/skills/claude-image/scripts/render.js
node $R logo.svg                          # ขนาดจาก viewBox, scale 2x
node $R poster.html out.png --width 1080 --height 1350 --scale 2
node $R icon.svg icon.png --transparent   # พื้นหลังโปร่งใส
node $R anim.html --wait 1500             # รอ animation/ฟอนต์โหลด
```

## เทคนิคให้ภาพดูมืออาชีพ (ไม่ดู clip-art)
- **สี**: palette 3–5 สี (1 dominant 60%, 1 secondary 30%, 1 accent 10%). หลีกเลี่ยงสีอิ่มตัวสุด (#ff0000); ใช้ HSL ปรับความสว่าง/ความอิ่มตัวไล่โทน
- **มิติ/แสง**: `linearGradient`/`radialGradient` แทนสีแบน, เงาด้วย `filter: feGaussianBlur + feOffset` (opacity 0.15–0.3), highlight ขอบบนวัตถุ, ambient occlusion ใต้วัตถุ
- **Texture**: grain ด้วย `feTurbulence` (baseFrequency 0.8–0.9, opacity 0.05–0.1) ทำให้ดูเป็นงานพิมพ์/วาดมือ; ลวดลายด้วย `<pattern>`
- **รูปทรงอินทรีย์**: ใช้ cubic Bézier (`C`/`S`) แทนเส้นตรง, หลีกเลี่ยงสมมาตรสมบูรณ์, ใส่ `feTurbulence + feDisplacementMap` เบาๆ ให้ขอบดูวาดมือ
- **Depth**: 3 ชั้น foreground/midground/background — ชั้นไกลสีอ่อน/ฟ้าขึ้น contrast ต่ำ (atmospheric perspective)
- **Typography**: ฟอนต์ไทย — ใช้ HTML + Google Fonts (`Noto Sans Thai`, `Prompt`, `Kanit`, `IBM Plex Sans Thai`) แล้ว `--wait 1000`; ใน SVG ล้วนใช้ `font-family="Noto Sans Thai, sans-serif"`. หัวเรื่องใหญ่ ≥ 3× body, letter-spacing ติดลบเล็กน้อยกับหัวเรื่องอังกฤษ
- **ตัวละคร/สัตว์**: สร้างจากรูปทรงพื้นฐาน (วงกลม/วงรี) ก่อน แล้วค่อยรวมด้วย path; หัวใหญ่ ตาโต = น่ารัก; ใส่ highlight ในตา
- **ฉากธรรมชาติ**: ท้องฟ้า gradient + ภูเขาเป็น path หลายชั้น + `feTurbulence` ทำเมฆ/หมอก
- **ซับซ้อนมาก/ซ้ำๆ** (ดาว, ใบไม้, particle, generative art): เขียน HTML + `<canvas>` JS วนลูปพร้อม seeded random แทนการเขียน SVG ด้วยมือ

## Style presets (บอกชื่อได้เลย)
| Preset | สูตร |
|---|---|
| flat-modern | สีแบน 4 สี, มุมโค้ง, ไม่มีเส้นขอบ, เงายาว 45° |
| isometric | grid 30°, 3 หน้าใช้สีเดียวกันต่างความสว่าง (100/80/60%) |
| glassmorphism | พื้นหลัง gradient blob + การ์ด `backdrop-filter: blur` (ต้อง HTML) |
| line-art | stroke 2–3px `stroke-linecap=round`, สีเดียว, ไม่มี fill |
| retro-poster | palette ซีด, grain แรง, halftone `<pattern>` จุด, ตัวหนังสือหนา |
| neon | พื้นมืด #0b0b1a, stroke สว่าง + `feGaussianBlur` ซ้อน 2 ชั้นเป็น glow |
| watercolor | `feTurbulence` + `feDisplacementMap` บนรูปทรง opacity 0.6 ซ้อนกัน |
| infographic | grid 12 คอลัมน์, ไอคอนเส้น, ตัวเลขใหญ่, สีหลัก 1 + เทา |

## ข้อควรระวัง
- เก็บไฟล์งานที่ `output/` (สร้างถ้ายังไม่มี) ไม่ปนกับโค้ดโปรเจกต์
- ไม่ทำซ้ำโลโก้/ตัวละครที่มีลิขสิทธิ์ของแบรนด์จริง
- ตรวจ PNG ทุกครั้งก่อนอ้างว่าเสร็จ — อย่าส่งงานที่ยังไม่ได้เห็นผล render
