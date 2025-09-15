# TODO List for Footer Mobile Layout Change

## Completed Tasks

- [x] Analyze current footer layout (1 column 4 rows on mobile)
- [x] Identify CSS media query causing the layout issue
- [x] Modify CSS to change footer to 2 columns 2 rows on mobile
- [x] Update FE/src/assets/styles/home_clean.css with new grid layout

## Pending Tasks

- [ ] Test the footer layout on mobile devices or browser dev tools
- [ ] Verify responsiveness across different screen sizes (768px, 480px, etc.)
- [ ] Ensure no visual regressions in other footer elements

## Notes

- Changed .footer-container from flex-direction: column to display: grid with 2 columns and 2 rows at max-width: 900px
- Grid layout: grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, auto)
- Maintained gap: 24px and align-items: flex-start for consistency

---

# TODO - Tích hợp thanh toán MoMo vào BookingPage

## Các bước đã thực hiện:

1. **Phân tích mã test MoMo**: Đọc file `BE/controllers/thanhToanController.js` từ GitHub MoMo, hiểu cấu trúc requestBody, signature, và các tham số cần thiết.

2. **Chuyển đổi controller**: Biến script test thành hàm `createMoMoPayment` nhận req.body (amount, orderId, orderInfo, redirectUrl, ipnUrl), tạo signature HMAC SHA256, gửi POST request đến MoMo API (https://test-payment.momo.vn/v2/gateway/api/create), trả về payUrl.

3. **Thêm hàm callback**: Tạo hàm `handleMoMoCallback` để xử lý kết quả thanh toán từ MoMo, kiểm tra resultCode, log thành công/thất bại.

4. **Tạo routes**: Trong `BE/routes/thanh_toan.js`, thêm route POST `/momo` cho tạo payment và POST `/momo/callback` cho callback.

5. **Đăng ký routes**: Cập nhật `BE/server.js` để sử dụng route `/api/thanh-toan`.

6. **Sửa frontend BookingPage**:

   - Thêm option "Ví MoMo" trong select paymentMethod.
   - Trong `handleConfirmPayment`, nếu paymentMethod === "momo", gọi axios.post đến `/api/thanh-toan/momo` với payload (amount, orderId, orderInfo, redirectUrl, ipnUrl), nhận payUrl, redirect window.location.href = payUrl.
   - Xử lý lỗi nếu không nhận được payUrl.

7. **Cấu hình tham số MoMo**: Sử dụng partnerCode, accessKey, secretkey từ test, requestType = "captureWallet", lang = "vi".

8. **Sửa lỗi thiếu module**: Tạo file `BE/routes/payment.js` để fix lỗi "Cannot find module './routes/payment'" khi chạy server.

## Các bước kiểm thử đề xuất:

- **Giao diện**: Kiểm tra BookingPage step 2, chọn MoMo, đặt vé, redirect sang MoMo.
- **API backend**: Test endpoint `/api/thanh-toan/momo` với Postman, đảm bảo trả về payUrl.
- **Callback**: Test `/api/thanh-toan/momo/callback` với mock data, log kết quả.
- **Trường hợp lỗi**: Không chọn ghế, không đăng nhập, thanh toán thất bại, API lỗi.
- **Tương thích**: Đảm bảo các phương thức thanh toán khác (card, zalopay) vẫn hoạt động.

## Ghi chú kỹ thuật:

- Sử dụng axios để gửi request đến MoMo API.
- Signature được tạo từ rawSignature với HMAC SHA256.
- RedirectUrl mặc định: "http://localhost:3000/booking-success".
- IpnUrl mặc định: "http://localhost:5000/api/thanh-toan/momo/callback".
- Cần cài đặt axios nếu chưa có (npm install axios) - đã có trong package.json.
- Trong thực tế, cần xác thực chữ ký callback MoMo để bảo mật.
- Môi trường test MoMo, không dùng cho production.

---

# TODO - Dependency Management

## Pending Tasks

- [ ] Check for package-lock.json (or equivalent) to understand locked dependencies. If absent, generate it via npm install to ensure reproducible builds. Note: No Cargo.lock found (this is a Rust file; for Node.js, check package-lock.json in BE/ and FE/ directories).
