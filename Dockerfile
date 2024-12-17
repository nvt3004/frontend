FROM node:21.6.2-alpine

# Cài đặt các công cụ cần thiết cho QZ Tray (ví dụ: wget)
RUN apk add --no-cache wget openjdk11 ca-certificates

# Cài đặt QZ Tray
RUN wget https://github.com/qzind/tray/releases/download/v2.1.0/qz-tray-2.1.0.jar -O /opt/qz-tray.jar

# # Cài đặt chứng chỉ SSL cho QZ Tray (nếu cần)
# COPY ./path_to_your_ssl_certificates/ /opt/qz-tray/

# Cài đặt thư mục làm việc cho ứng dụng Node.js
WORKDIR /app

# Sao chép package.json và cài đặt dependencies cho Node.js
COPY package.json ./
RUN NODE_OPTIONS=--max-old-space-size=4096 npm install

# Sao chép phần còn lại của ứng dụng Node.js
COPY . .

# Expose cổng 3000 cho ứng dụng Node.js
EXPOSE 3000

# Chạy QZ Tray và ứng dụng Node.js
ENTRYPOINT ["sh", "-c", "java -jar /opt/qz-tray.jar & NODE_OPTIONS=--max-old-space-size=4096 npm start"]
