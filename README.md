# LNG275 Midterm Reviewer

เว็บทบทวนภาษาจีนสำหรับบทที่ 1–8 จากไฟล์สรุป LNG275 ใช้งานแบบ static และบันทึกความคืบหน้าในเบราว์เซอร์ของอุปกรณ์นี้

## เริ่มใช้งาน

ต้องมี Node.js 20 ขึ้นไป

```sh
npm install
npm run fetch:hanzi
npm run verify:data
npm run dev
```

เปิดที่ `http://localhost:3000` จากมือถือหรือคอมพิวเตอร์ในเครือข่ายเดียวกันได้

## ข้อมูลและการแก้ไข

- ไฟล์ต้นทางที่ใช้สร้างชุดข้อมูลคือ `source/lng275-summary.md` ซึ่งคัดลอกจาก `LNG275_midterm_ch1-8_notes.txt` ใน workspace
- คำศัพท์หลัก 204 รายการอยู่ใน `src/data/vocab.json`; แก้รายการในไฟล์นี้ และปรับ `lessons.json` หากเปลี่ยนบทที่พบ จากนั้นรัน `npm run verify:data`
- บทสนทนาและไวยากรณ์อ้างอิง lesson seeds ที่ตรวจทานแล้วในโปรเจกต์ iOS; สัทศาสตร์อ้างอิง `phonetics.json` เดิม
- คำศัพท์จากภาพอยู่แยกใน `src/data/extra.json` และไม่รวมในยอด 204
- English gloss ที่จับคู่จาก seed มีความหมายตามชุดข้อมูลเดิม; รายการที่ควรตรวจต่อบันทึกใน `source/EN_REVIEW.md`
- ความคืบหน้าเก็บใน localStorage key `lng275:v1`; ล้างได้จากหน้าเตรียมสอบ

## ข้อมูลลำดับขีดและเครดิต

ดึงข้อมูลตัวอักษรจากแพ็กเกจเปิด `hanzi-writer-data` รุ่น 2.0 บน jsDelivr และเก็บเป็นไฟล์ใน `public/hanzi-data/` เพื่อเรียกใช้ในเครื่องหลังดาวน์โหลดแล้ว สคริปต์จำกัดการดาวน์โหลดพร้อมกัน 5 รายการ ลองซ้ำสูงสุด 3 ครั้ง และเขียนอักษรที่หาไม่พบใน `_missing.json` ข้อมูลของ Hanzi Writer เป็นข้อมูลจาก Make Me a Hanzi; ข้อมูลลำดับขีดเผยแพร่ตาม Arphic Public License; สำเนาเงื่อนไขอยู่ที่ `source/ARPHICPL.TXT`. Hanzi Writer JavaScript เผยแพร่ภายใต้ MIT

## Build และ deploy บน Vercel

```sh
npm run build
```

โปรเจกต์ตั้ง `output: 'export'`; นำโฟลเดอร์นี้เข้า Vercel โดยเลือก Next.js และไม่ต้องกำหนด environment variables Vercel จะเสิร์ฟ static output จาก `out/`. การ build เรียก `prebuild` เพื่อดึง stroke data; หาก build ในสภาพแวดล้อมไม่มีอินเทอร์เน็ต ให้เรียก `npm run fetch:hanzi` ในเครื่องที่เชื่อมต่อได้ก่อน แล้วจึง build

## ข้อจำกัดจากไฟล์ที่มี

ไฟล์ `source/lng275-summary.md` ในงานนี้มาจากสรุปใน workspace เพราะไม่มีไฟล์ชื่อนี้ให้มาโดยตรง สรุปมีข้อมูลสอบ บทเรียน คำศัพท์ สัทศาสตร์ และคำจากภาพ แต่ไม่ได้ระบุเลขหน้ารายคำครบทั้งหมด จึงใส่เลขหน้าเฉพาะรายการที่ seed ต้นทางมีข้อมูลอ้างอิงกำกับ
