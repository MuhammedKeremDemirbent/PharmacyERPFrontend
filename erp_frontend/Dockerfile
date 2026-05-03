# React/Vite için standart Node.js imajı
FROM node:22-alpine

# Çalışma klasörünü ayarla
WORKDIR /app

# Paketleri kopyala ve kur
COPY package*.json ./
RUN npm install

# Tüm kodları içeri kopyala
COPY . .

# Vite'ı dışarıya 8080 portundan çalıştır
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
EXPOSE 8080

