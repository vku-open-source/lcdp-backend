# 🚀 Emergix - Unified Emergency Operations and Planning Platform Backend Services

Welcome to Emergix, the backend service platform for emergency operations and planning. Below is a guide on requirements, installation, and the main APIs of the project.

## I. Requirements

- [Node.js](https://nodejs.org/) (>= 18.0.0)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/download/) (database)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## II. Installation and Running Applications

### 1. Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vku-open-source/lcdp-backend.git
   cd lcdp-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   - Copy the `.env.example` file to `.env` and edit the values as needed.

4. Start the application:

   ```bash
   npm run develop
   # or
   yarn develop
   ```

### 2. Running in Docker

To run the application using Docker, you can use the provided `docker-compose.yml` file:

```bash
docker-compose up
```

## III. API Documentation

### Warning Module

#### 1. Provincial Warning

- **Endpoint**: `GET /api/nchmf-warnings`
- **Description**: Retrieve warning information from the National Center for Hydro-Meteorological Forecasting.
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

| Params | Description            | Default |
| ------ | ---------------------- | ------- |
| N/A    | No required parameters | N/A     |

#### 2. Real-time warning by Coordinates

- **Endpoint**: `GET /api/warning`
- **Description**: Retrieve warning information by coordinates from the Vietnam Disaster Monitoring System
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

| Params | Description            | Default |
| ------ | ---------------------- | ------- |
| N/A    | No required parameters | N/A     |

#### 3. Saved warning by Coordinates

- **Endpoint**: `GET /api/vndms-warnings`
- **Description**: Retrieve saved warning information by coordinates from the Vietnam Disaster Monitoring System.
- **Response**:

```json
{
  "data": [
    {
      "id": 96,
      "documentId": "xo2mrek3adv02a8xsn7y0vm9",
      "datetime": "2024-12-07T20:00:05.661Z",
      "data": [
        {
          "lat": 12.991999626159668,
          "long": 107.69200134277344,
          "label": "Đắk Nông",
          "popupInfo": "<div class=\"station-popup-info\"><div class=\"row-popup\"><div class=\"col-popup-left\"><li>Tên trạm: <b>Đắk Nông</b> </li><li>Mã trạm: <b>71720</b></li><li>Địa điểm: <b>Đắk Nông</b></li><li>   Sông: <b>Đắk Nông</b></li><li>Nguồn: <b>KTTV</b></li><li><b>Mực nước (589.4(m) 1-08/12)</b> </li><li class='detalRain' data-id='71720' onclick='detailrain(`71720`,`Water`,1)' ><a class=\"description-class\">Chi tiết <i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i> </a></b></li></div><li><img class='agri-chart-img'  src=\"https://quickchart.io/chart?height=175&c={ type: 'bar', data: { 'labels': ['1h \n7/12','7h \n7/12','13h \n7/12','19h \n7/12','1h \n8/12'], datasets: [{ type: 'line', label: 'Dataset 1', borderColor: 'green', borderWidth: 2, fill: false, data: [589.39,589.31,589.39,589.35,589.4 ] } ] }, options: { responsive: true, maintainAspectRatio:false,layout:{padding:{bottom:10,top:20,right:10}}, scales:{yAxes:[{display: false}]},legend:{ display: false},plugins:{datalabels:{display:true,borderRadius:3,align:'top',font: {weight: 'bold'}}}}}\" /></li></div></div>",
          "water_level": "589.4",
          "warning_type": "water_level",
          "warning_level": 1
        },
        {
          "lat": 21.85,
          "long": 106.95,
          "label": "Mẫu Sơn",
          "popupInfo": "<ul class=\"station-popup-info\"><li>Tên trạm: <b>Mẫu Sơn</b></li><li>Địa điểm: <b>Lạng Sơn</b></li><li>Nguồn: <b>KTTV</b></li><li><b><li><b>Gió (46.8(km/h) 01-08/12)</b></li></b></li><li class='detalRain' data-id='Mẫu Sơn' onclick='detailrain(`109`,`Wind`,1)' ><a class=\"description-class\">Chi tiết <i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i> </a></b></li><li><img class='agri-chart-img'  src=\"https://quickchart.io/chart?height=175&c={ type: 'bar', data: { 'labels': ['1h \n8/12'], datasets: [{ type: 'line', label: 'Dataset 1', borderColor: 'green', borderWidth: 2, fill: false, data: [46.8 ] } ] }, options: { responsive: true, maintainAspectRatio:false,layout:{padding:{bottom:10,top:20,right:10}}, scales:{yAxes:[{display: false}]},legend:{ display: false},plugins:{datalabels:{formatter: function(values) {var+val+%3d+%5b%7b%27index%27%3a46.8%2c%27value%27%3a%276%27%7d%5d%3breturn    values %2b '(' %2b val.filter(item => item.index == values)[0].value %2b ')';},display:true,borderRadius:3,align:'top'} }} }\" /></li></ul>",
          "wind_level": "46.8",
          "warning_type": "warning_wind"
        },
        {
          "lat": 20.13333,
          "long": 107.7167,
          "label": "Bạch Long Vĩ",
          "popupInfo": "<ul class=\"station-popup-info\"><li>Tên trạm: <b>Bạch Long Vĩ</b></li><li>Địa điểm: <b>TP. Hải Phòng</b></li><li>Nguồn: <b>KTTV</b></li><li><b><li><b>Gió (50.4(km/h) 01-08/12)</b></li></b></li><li class='detalRain' data-id='Bạch Long Vĩ' onclick='detailrain(`18`,`Wind`,1)' ><a class=\"description-class\">Chi tiết <i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i> </a></b></li><li><img class='agri-chart-img'  src=\"https://quickchart.io/chart?height=175&c={ type: 'bar', data: { 'labels': ['1h \n8/12'], datasets: [{ type: 'line', label: 'Dataset 1', borderColor: 'green', borderWidth: 2, fill: false, data: [50.4 ] } ] }, options: { responsive: true, maintainAspectRatio:false,layout:{padding:{bottom:10,top:20,right:10}}, scales:{yAxes:[{display: false}]},legend:{ display: false},plugins:{datalabels:{formatter: function(values) {var+val+%3d+%5b%7b%27index%27%3a50.4%2c%27value%27%3a%277%27%7d%5d%3breturn    values %2b '(' %2b val.filter(item => item.index == values)[0].value %2b ')';},display:true,borderRadius:3,align:'top'} }} }\" /></li></ul>",
          "wind_level": "50.4",
          "warning_type": "warning_wind"
        }
      ],
      "createdAt": "2024-12-07T20:00:05.667Z",
      "updatedAt": "2024-12-07T20:00:05.667Z",
      "publishedAt": "2024-12-07T20:00:05.675Z"
    }
  ],
  "meta": {
    "pagination": {
      "start": 0,
      "limit": 1,
      "total": 48
    }
  }
}
```

| Params            | Description            | Default |
| ----------------- | ---------------------- | ------- |
| sort              | sort fields            | N/A     |
| pagination[limit] | Number of hours needed | N/A     |

#### 4. Chatbot

- **Endpoint**: `POST /api/chatbots`
- **Description**: Respond with relevant warning information or other data based on the input question.
- **Response**:

```json
{
  "data": {
    "answer": "Hôm nay (07/12), thời tiết ở Huế có khả năng chịu ảnh hưởng của không khí lạnh đang tăng cường. Dự báo khu vực này sẽ có mưa rải rác và trời chuyển rét. Nhiệt độ thấp nhất dự kiến trong khoảng từ 15-18 độ C. Do đó, người dân nên chuẩn bị cho thời tiết lạnh và có thể có mưa trong ngày."
  },
  "meta": {}
}
```

| Body     | Description       | Required |
| -------- | ----------------- | -------- |
| question | The prompt to ask | true     |

### Resource Module

#### 1. Create EOP

- **Endpoint**: `POST /eop/generate-eop`
- **Description**: Create EOP based on input data (flood, resources).
- **Body**:

```json
{
  "floodData": "",
  "resourceData": ""
}
```

| Body         | Description   | Required |
| ------------ | ------------- | -------- |
| floodData    | Flood data    | true     |
| resourceData | Resource data | true     |

#### 2. Confirmed EOP

- **Endpoint**: `POST /eop/confirm-eop`
- **Description**: Users edit and confirm the new EOP, then create a task list.
- **Body**:

```json
{
  "eopId": "fume1l0bgng65vori8mff6s8",
  "content": ""
}
```

| Body    | Description    | Required |
| ------- | -------------- | -------- |
| eopId   | EOP ID         | true     |
| content | Edited content | true     |

### Community API

#### 1. Get Emergency Alerts

- **Endpoint**: `GET /api/communities?filters[type][$eq]=emergency_alert`
- **Description**: Retrieve a list of emergency alerts from the community.

```json
{
`  "data": [
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

| Params             | Description                           | Default |
| ------------------ | ------------------------------------- | ------- |
| filters            | Object containing filter conditions   | N/A     |
| filters[type]      | Type of alert (e.g., emergency_alert) | N/A     |
| filters[type][$eq] | Comparison operator (equal)           | N/A     |
| value              | Value to compare (emergency_alert)    | N/A     |

#### 2. Create a New Emergency Alert

- **Endpoint**: `POST /api/communities`
- **Description**: Create new emergency alerts from the community.
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

| Body                 | Description                         | Required |
| -------------------- | ----------------------------------- | -------- |
| title                | Title of the alert                  | true     |
| type                 | Type of alert (emergency_alert)     | true     |
| content              | Content of the alert                | true     |
| priority             | Priority level (urgent, normal)     | true     |
| notificationChannels | Notification channels (sms, email)  | true     |
| location             | Alert location (lat, long, address) | true     |

#### 3. Get All Document Guides

- **Endpoint**: `GET /api/communities`
- **Description**: Retrieve all document guides such as safety guide, evacuation guide, and first aid guide.

| Params                              | Description                       | Default |
| ----------------------------------- | --------------------------------- | ------- |
| filters[type][$eq]=safety_guide     | Get All Safety Guide document     | Null    |
| filters[type][$eq]=evacuation_guide | Get All Evacuation Guide document | Null    |
| filters[type][$eq]=first_aid_guide  | Get All First Aid Guide document  | Null    |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
