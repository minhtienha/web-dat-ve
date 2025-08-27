# Hướng dẫn tích hợp MoMo Payment vào hệ thống đặt vé phim

## 📋 Tổng quan

Hệ thống thanh toán MoMo đã được tích hợp vào dự án với các tính năng chính:

- Tạo yêu cầu thanh toán qua MoMo
- Xử lý IPN (Instant Payment Notification)
- Trang xác nhận thanh toán thành công
- API kiểm tra trạng thái thanh toán

## 🚀 Cách sử dụng

### 1. Cấu hình MoMo

Các thông số cấu hình đã được thiết lập trong `BE/controllers/paymentController.js`:

```javascript
const MOMO_CONFIG = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
  redirectUrl: "http://localhost:3000/payment/success",
  ipnUrl: "http://localhost:5000/api/payment/ipn",
  requestType: "captureWallet",
};
```

### 2. API Endpoints

#### Tạo thanh toán

**POST** `/api/payment/create`

```json
{
  "amount": 50000,
  "orderInfo": "Mua vé xem phim",
  "orderId": "ORDER123",
  "extraData": ""
}
```

#### Xử lý IPN

**POST** `/api/payment/ipn`
(MoMo sẽ gọi endpoint này tự động)

#### Kiểm tra trạng thái

**GET** `/api/payment/status?orderId=ORDER123&requestId=REQUEST456`

### 3. Frontend Integration

Sử dụng service `paymentService.js`:

```javascript
import { createPayment, checkPaymentStatus } from "../services/paymentService";

// Tạo thanh toán
const paymentData = {
  amount: 50000,
  orderInfo: "Mua vé xem phim XYZ",
  orderId: "ORDER_" + Date.now(),
  extraData: JSON.stringify({ movieId: "123", seats: ["A1", "A2"] }),
};

const result = await createPayment(paymentData);
if (result.success) {
  window.location.href = result.payUrl; // Chuyển hướng đến MoMo
}
```

### 4. Flow thanh toán

1. User chọn vé và click "Thanh toán"
2. Frontend gọi API `/api/payment/create`
3. Chuyển hướng user đến trang MoMo
4. User thực hiện thanh toán trên MoMo
5. MoMo chuyển hướng về `/payment/success` với thông tin kết quả
6. Backend nhận IPN từ MoMo và cập nhật trạng thái vé

## 🔧 Cài đặt và chạy

### Backend

```bash
cd BE
npm install
npm run dev
```

### Frontend

```bash
cd FE
npm install
npm start
```

## 🧪 Testing

### Test với MoMo Sandbox

1. Sử dụng app MoMo sandbox trên điện thoại
2. Đăng nhập với tài khoản test
3. Thực hiện thanh toán với số tiền test

### Test IPN

Có thể sử dụng webhook.site để test IPN:

```javascript
// Trong paymentController.js
ipnUrl: "https://webhook.site/your-unique-id";
```

## 📝 Lưu ý quan trọng

1. **Environment Variables**: Thêm các biến môi trường cần thiết vào file `.env`
2. **Database Integration**: Cần tích hợp với model Vé để cập nhật trạng thái thanh toán
3. **Security**: Triển khai xác thực chữ ký trong IPN handler
4. **Error Handling**: Thêm xử lý lỗi chi tiết cho từng trường hợp
5. **Logging**: Ghi log đầy đủ cho mục đích debug và audit

## 🔄 Các bước tiếp theo

1. **Tích hợp với database**: Cập nhật trạng thái vé khi thanh toán thành công
2. **Email confirmation**: Gửi email xác nhận vé
3. **QR Code**: Tạo QR code cho vé
4. **Refund handling**: Xử lý hoàn tiền
5. **Multiple payment methods**: Thêm các phương thức thanh toán khác

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình tích hợp:

1. Kiểm tra console log để xem lỗi chi tiết
2. Đảm bảo các service đang chạy đúng port
3. Kiểm tra kết nối internet để gọi API MoMo
4. Xem documentation chính thức của MoMo: https://developers.momo.vn
