# ใช้ Node.js เวอร์ชันล่าสุดที่เสถียร
FROM node:20

# กำหนด working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json เข้า container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์โค้ดทั้งหมดเข้า container
COPY . .

# กำหนดพอร์ตที่ต้องการให้ container เปิด
EXPOSE 4000

# รัน migration ก่อนเริ่มแอป
CMD ["npm", "start"]
