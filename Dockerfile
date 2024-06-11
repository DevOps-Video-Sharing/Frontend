# Sử dụng một image node chính thức làm base image
FROM node:16-alpine as build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn ứng dụng
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng một image nginx chính thức để phục vụ build
FROM nginx:alpine

# Copy build từ giai đoạn trước vào thư mục phục vụ của nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy file cấu hình nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose cổng 80 để có thể truy cập vào container
EXPOSE 80

# Lệnh chạy nginx
CMD ["nginx", "-g", "daemon off;"]