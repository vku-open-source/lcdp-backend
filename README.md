# 🚀 Emergix - Unified Emergency Operations and Planning Platform Backend Services

Chào mừng bạn đến với Emergix, nền tảng dịch vụ backend cho các hoạt động và lập kế hoạch khẩn cấp. Dưới đây là hướng dẫn về yêu cầu, cài đặt và các API chính của dự án.

## I. Requirements

- [Node.js](https://nodejs.org/) (>= 18.0.0)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/download/) (cho cơ sở dữ liệu)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## II. Installation and Running Applications

### 1. Cài đặt

1. Clone kho lưu trữ:

   ```bash
   git clone https://github.com/vku-open-source/lcdp-backend.git
   cd lcdp-backend
   ```

2. Cài đặt các phụ thuộc:

   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. Thiết lập biến môi trường:

   - Sao chép tệp `.env.example` thành `.env` và chỉnh sửa các giá trị theo nhu cầu.

4. Khởi động ứng dụng:

   ```bash
   npm run develop
   # hoặc
   yarn develop
   ```

### 2. Chạy trong Docker

Để chạy ứng dụng bằng Docker, bạn có thể sử dụng tệp `docker-compose.yml` đã cung cấp:

```bash
docker-compose up
```

## III. API Documentation

### Warning Module

#### 1. Tỉnh cấp cảnh báo

- **Endpoint**: `GET /api/nchmf-warnings`
- **Mô tả**: Lấy thông tin cảnh báo từ Trung tâm Khí tượng Thủy văn Quốc gia.
- **Response**:

```json
{
  "data": [
    {
      "id": 2,
      "documentId": "oth0x2s3esof1bnnod79s9io",
      "date": "2024-11-30",
      "data": {
        "data": [
          {
            "date": "2024-11-30",
            "link": "https://nchmf.gov.vn/Kttv/vi-VN/1/tin-du-bao-gio-manh-song-lon-va-mua-dong-tren-bien-post1287.html",
            "time": "16:01:00",
            "type": ["dự báo"],
            "title": "TIN DỰ BÁO GIÓ MẠNH, SÓNG LỚN VÀ MƯA DÔNG TRÊN BIỂN",
            "region": []
          },
          {
            "date": "2024-11-28",
            "link": "https://nchmf.gov.vn/Kttv/vi-VN/1/tin-canh-bao-lu-quet-sat-lo-dat-sut-lun-dat-do-mua-lu-hoac-dong-chay-tren-khu-vuc-cac-tinh-ha-tinh-khanh-hoa-va-tu-thua-thien-hue-den-quang-ngai-post1321.html",
            "time": "13:30:49",
            "type": ["cảnh báo", "lũ quét", "sạt lở đất", "sụt lún đất"],
            "title": "TIN CẢNH BÁO LŨ QUÉT, SẠT LỞ ĐẤT, SỤT LÚN ĐẤT DO MƯA LŨ HOẶC DÒNG CHẢY TRÊN KHU VỰC CÁC TỈNH HÀ TĨNH, KHÁNH HÒA VÀ TỪ THỪA THIÊN HUẾ ĐẾN QUẢNG NGÃI",
            "region": ["Hà Tĩnh", "Khánh Hòa", "Thừa Thiên Huế", "Quảng Ngãi"]
          }
        ]
      }
    }
  ]
}
```

| Params | Description              | Default |
| ------ | ------------------------ | ------- |
| N/A    | Không có tham số yêu cầu | N/A     |

#### 2. Cảnh báo theo tọa độ

- **Endpoint**: `GET /api/warning`
- **Mô tả**: Lấy thông tin cảnh báo theo tọa độ từ hệ thống Hệ thống giám sát thiên tai Việt Nam.
- **Response**:

```json
{
  "data": [
    {
      "lat": 12.991999626159668,
      "long": 107.69200134277344,
      "label": "Đắk Nông",
      "warning_level": 1,
      "warning_type": "water_level",
      "water_level": "589.34"
    },
    {
      "lat": 20.933000564575195,
      "long": 106.76699829101562,
      "label": "Đồ Nghi",
      "warning_level": 1,
      "warning_type": "water_level",
      "water_level": "2"
    }
  ]
}
```

| Params | Description              | Default |
| ------ | ------------------------ | ------- |
| N/A    | Không có tham số yêu cầu | N/A     |

### Resource Module

#### 1. Tạo EOP

- **Endpoint**: `POST /eop/generate-eop`
- **Mô tả**: Tạo EOP dựa trên dữ liệu đầu vào (lũ, tài nguyên).
- **Body**:

```json
{
  "floodData": "",
  "resourceData": ""
}
```

| Body         | Description           | Required |
| ------------ | --------------------- | -------- |
| floodData    | Dữ liệu về lũ         | true     |
| resourceData | Dữ liệu về tài nguyên | true     |

#### 2. Xác nhận EOP

- **Endpoint**: `POST /eop/confirm-eop`
- **Mô tả**: Người dùng chỉnh sửa và xác nhận EOP mới, sau đó tạo danh sách nhiệm vụ.
- **Body**:

```json
{
  "eopId": "fume1l0bgng65vori8mff6s8",
  "content": ""
}
```

| Body    | Description        | Required |
| ------- | ------------------ | -------- |
| eopId   | ID của EOP         | true     |
| content | Nội dung chỉnh sửa | true     |

### Community API

#### 1. Lấy các thông báo khẩn cấp

- **Endpoint**: `GET /api/communities?filters[type][$eq]=emergency_alert`
- **Mô tả**: Lấy danh sách các thông báo khẩn cấp từ cộng đồng.
- **Response**:

```json
{
  "data": [
    {
      "id": "1",
      "title": "Trường vku bị ngập lụt",
      "type": "emergency_alert",
      "content": "Thông báo đến các sinh viên trường vku bị ngập lụt, các phương tiện di chuyển có thể bị dán đoạn.",
      "priority": "urgent",
      "notificationChannels": {
        "sms": false,
        "email": true
      },
      "location": {
        "lat": 16.059835720164806,
        "long": 108.2189091559153,
        "address": "Phường Phước Ninh, Hải Châu District, Đà Nẵng, Vietnam"
      }
    }
  ]
}
```

| Params             | Description                             | Default |
| ------------------ | --------------------------------------- | ------- |
| filters            | Đối tượng chứa các điều kiện lọc        | N/A     |
| filters[type]      | Loại thông báo (ví dụ: emergency_alert) | N/A     |
| filters[type][$eq] | Toán tử so sánh (bằng)                  | N/A     |
| value              | Giá trị cần so sánh (emergency_alert)   | N/A     |

#### 2. Tạo thông báo khẩn cấp mới

- **Endpoint**: `POST /api/communities`
- **Mô tả**: Tạo một thông báo khẩn cấp mới.
- **Body**:

```json
{
  "data": {
    "title": "Trường vku bị ngập lụt",
    "type": "emergency_alert",
    "content": "Thông báo đến các sinh viên trường vku bị ngập lụt, các phương tiện di chuyển có thể bị dán đoạn.",
    "priority": "urgent",
    "notificationChannels": {
      "sms": false,
      "email": true
    },
    "location": {
      "lat": 16.059835720164806,
      "long": 108.2189091559153,
      "address": "Phường Phước Ninh, Hải Châu District, Đà Nẵng, Vietnam"
    }
  }
}
```

| Body                 | Description                           | Required |
| -------------------- | ------------------------------------- | -------- |
| title                | Tiêu đề của thông báo                 | true     |
| type                 | Loại thông báo (emergency_alert)      | true     |
| content              | Nội dung thông báo                    | true     |
| priority             | Độ ưu tiên (urgent, normal)           | true     |
| notificationChannels | Kênh thông báo (sms, email)           | true     |
| location             | Vị trí thông báo (lat, long, address) | true     |

## 🤝 Contributing

Chúng tôi hoan nghênh các đóng góp! Vui lòng làm theo các bước sau:

1. Fork kho lưu trữ.
2. Tạo một nhánh mới (`git checkout -b feature/YourFeature`).
3. Thực hiện các thay đổi và commit (`git commit -m 'Add some feature'`).
4. Đẩy lên nhánh (`git push origin feature/YourFeature`).
5. Mở một pull request.

## 📝 License

Dự án này được cấp phép theo Giấy phép MIT. Xem tệp [LICENSE](LICENSE) để biết chi tiết.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
