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

# Sử dụng một image node chính thức để chạy ứng dụng
FROM node:16-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy build từ giai đoạn trước vào thư mục làm việc
COPY --from=build /app/build /app/build

# Cài đặt serve để phục vụ build
RUN npm install -g serve

# Expose cổng 3000 để có thể truy cập vào container
EXPOSE 3000

# Lệnh chạy serve để phục vụ build
CMD ["serve", "-s", "build", "-l", "3000"]
