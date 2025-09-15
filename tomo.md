# Hướng Dẫn Tích Hợp Thanh Toán MoMo Chi Tiết

## Tổng Quan

Tích hợp thanh toán MoMo cho phép người dùng thanh toán vé phim qua ví điện tử MoMo. Quy trình bao gồm:

1. Frontend gửi request tạo payment đến backend.
2. Backend tạo signature và gửi đến MoMo API.
3. MoMo trả về payUrl, frontend redirect người dùng đến đó.
4. Người dùng thanh toán trên giao diện MoMo.
5. MoMo callback về backend và redirect về frontend với kết quả.

## 1. Backend - Controller (BE/controllers/thanhToanController.js)

### Tham số MoMo (dòng 4-9)

```javascript
const partnerCode = "MOMO"; // Mã đối tác MoMo cung cấp
const accessKey = "F8BBA842ECF85"; // Access key từ MoMo
const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"; // Secret key để tạo signature
const requestType = "captureWallet"; // Loại request: captureWallet để thanh toán ví
const extraData = ""; // Dữ liệu thêm (rỗng nếu không dùng)
```

### Hàm createMoMoPayment (dòng 12-67)

**Input từ Frontend:**

- `amount`: Số tiền thanh toán (string, ví dụ: "120000")
- `orderId`: Mã đơn hàng (tự tạo nếu không có)
- `orderInfo`: Thông tin đơn hàng (ví dụ: "Thanh toán vé phim Avengers")
- `redirectUrl`: URL redirect sau khi thanh toán (mặc định: "http://localhost:3000/booking-success")
- `ipnUrl`: URL callback từ MoMo (mặc định: "http://localhost:5000/api/thanh-toan/momo/callback")

**Quy trình tạo signature (dòng 22-26):**

```javascript
const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${finalIpnUrl}&orderId=${finalOrderId}&orderInfo=${finalOrderInfo}&partnerCode=${partnerCode}&redirectUrl=${finalRedirectUrl}&requestId=${requestId}&requestType=${requestType}`;

const signature = crypto
  .createHmac("sha256", secretkey)
  .update(rawSignature)
  .digest("hex");
```

- Tạo chuỗi rawSignature theo thứ tự chính xác (quan trọng!)
- Sử dụng HMAC SHA256 với secretkey để tạo signature

**Request body gửi đến MoMo (dòng 29-42):**

```javascript
const requestBody = {
  partnerCode,
  accessKey,
  requestId, // Mã request duy nhất
  amount, // Số tiền
  orderId: finalOrderId,
  orderInfo: finalOrderInfo,
  redirectUrl: finalRedirectUrl, // URL MoMo redirect sau thanh toán
  ipnUrl: finalIpnUrl, // URL MoMo gửi callback
  extraData,
  requestType,
  signature, // Chữ ký bảo mật
  lang: "vi", // Ngôn ngữ tiếng Việt
};
```

**Gửi request đến MoMo API (dòng 45-55):**

```javascript
const response = await axios.post(
  "https://test-payment.momo.vn/v2/gateway/api/create", // URL test MoMo
  requestBody,
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);
```

- Sử dụng axios POST đến endpoint tạo payment của MoMo
- Nhận response chứa payUrl để redirect

### Hàm handleMoMoCallback (dòng 70-91)

**Input từ MoMo:**

- `orderId`: Mã đơn hàng
- `resultCode`: Mã kết quả (0 = thành công, khác = thất bại)
- `message`: Thông báo kết quả

**Xử lý callback:**

```javascript
if (resultCode === 0) {
  // Thanh toán thành công - xử lý đặt vé thực tế
  console.log("Payment successful for order:", orderId);
} else {
  // Thanh toán thất bại/huỷ
  console.log("Payment failed for order:", orderId, message);
}
```

## 2. Backend - Routes (BE/routes/thanh_toan.js)

```javascript
router.post("/momo", thanhToanController.createMoMoPayment); // Tạo payment
router.post("/momo/callback", thanhToanController.handleMoMoCallback); // Nhận callback
```

## 3. Frontend - BookingPage (FE/src/pages/BookingPage.js)

### Thêm lựa chọn thanh toán (dòng ~200)

```javascript
<option value="momo">Ví MoMo</option>
```

### Hàm handleConfirmPayment - Phần MoMo (dòng ~250-280)

```javascript
if (paymentMethod === "momo") {
  // Tính tổng tiền
  const amountStr = (ticketPrice * selectedSeats.length).toString();

  // Tạo orderId duy nhất
  const orderId = "order_" + new Date().getTime();

  // Thông tin đơn hàng
  const orderInfo = `Thanh toán vé phim ${movie.title}`;

  // URL redirect sau thanh toán
  const redirectUrl = "http://localhost:3000/booking-success";

  // URL callback
  const ipnUrl = "http://localhost:5000/api/thanh-toan/momo/callback";

  // Gọi API backend tạo payment
  const res = await axios.post("http://localhost:5000/api/thanh-toan/momo", {
    amount: amountStr,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
  });

  // Redirect sang MoMo nếu có payUrl
  if (res.data && res.data.payUrl) {
    window.location.href = res.data.payUrl; // Mở giao diện thanh toán MoMo
  } else {
    alert("Không nhận được đường dẫn thanh toán MoMo");
  }
}
```

## 4. Frontend - Trang Kết Quả (FE/src/pages/BookingSuccess.js)

### Nhận kết quả từ MoMo

```javascript
const resultCode = searchParams.get("resultCode"); // 0 = thành công
const message = searchParams.get("message"); // Thông báo
```

### Hiển thị kết quả

- Nếu resultCode === "0": Hiển thị thành công, nút về trang chủ
- Nếu khác: Hiển thị thất bại, tự động redirect về trang chủ sau 3 giây

## 5. Quy Trình Hoạt Động

1. **Người dùng chọn ghế và chọn "Ví MoMo"**
2. **Frontend gọi API `/api/thanh-toan/momo`** với thông tin thanh toán
3. **Backend tạo signature và gửi đến MoMo API**
4. **MoMo trả về payUrl**
5. **Frontend redirect đến payUrl** - mở giao diện thanh toán MoMo
6. **Người dùng thanh toán trên app/website MoMo**
7. **MoMo gửi callback đến `/api/thanh-toan/momo/callback`** (backend xử lý)
8. **MoMo redirect về `redirectUrl`** với params resultCode và message
9. **Trang BookingSuccess hiển thị kết quả**

## 6. Các URL Quan Trọng

- **MoMo API tạo payment**: `https://test-payment.momo.vn/v2/gateway/api/create`
- **Frontend redirect URL**: `http://localhost:3000/booking-success`
- **Backend callback URL**: `http://localhost:5000/api/thanh-toan/momo/callback`

## 7. Lưu Ý Bảo Mật

- **Signature**: Phải tạo chính xác theo thứ tự parameters
- **Secret Key**: Không được expose ra frontend
- **Callback Verification**: Trong production, cần verify signature của callback
- **Environment**: Hiện tại dùng test environment, production khác

## 8. Cách Test

1. Chạy backend: `cd BE && node server.js`
2. Chạy frontend: `cd FE && npm start`
3. Đặt vé, chọn MoMo, sẽ redirect đến MoMo test
4. Sử dụng tài khoản test MoMo để thanh toán
5. Kiểm tra callback trong console backend
6. Xem kết quả trên trang booking-success

## 9. Troubleshooting

- **Lỗi signature**: Kiểm tra thứ tự parameters trong rawSignature
- **Không redirect**: Kiểm tra payUrl từ response MoMo
- **Callback không nhận**: Kiểm tra URL ipnUrl có public access không
- **Trang trắng**: Đảm bảo route /booking-success đã được thêm vào App.js
