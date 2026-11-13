# PAYAPkuytok

เว็บอ่านสรุปและฝึกทำข้อสอบ 3 วิชา ในที่เดียว (static site สำหรับ GitHub Pages)

- `/` หน้าหลัก: แดชบอร์ด ชั้นหนังสือ คลังสรุป ข้อสอบ บุ๊กมาร์ก ความก้าวหน้า (`index.html`, `app/main.js`, `app/shelf.js`, `ui/base.css`)
- `/anatomy/` กายวิภาคศาสตร์ BI112 บทที่ 1 ถึง 7
- `/calc/` การคำนวณทางเภสัชกรรม PHT111 บทที่ 1
- ปริมาณสารสัมพันธ์ PHB102 บทที่ 1 อยู่ในหน้าหลัก (`app/chem-data.js`, `chem/book`, `chem/pdf`)
- `/ui/` ธีมกลาง ฟอนต์ ไอคอน และรูปปก

แอพรายวิชา (`anatomy`, `calc`) เป็นไฟล์ build สำเร็จ แล้วโหลด `../ui/theme.css` ทับเพื่อให้หน้าตาเข้าชุดกัน
ธีมสว่าง/มืดใช้ร่วมกันผ่าน `localStorage['payap.theme']` ความคืบหน้าของหน้าหลักเก็บใน `localStorage['payap.v1']`

ภาพปกเป็นภาพถ่ายจริงจาก Wikimedia Commons ดูที่มาและสัญญาอนุญาตใน `ui/credits.js`
