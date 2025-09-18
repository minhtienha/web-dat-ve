# TODO: Sửa lỗi lưu dữ liệu vé và trạng thái ghế trong thanh toán MoMo

## Các bước đã hoàn thành:

- [x] Phân tích lỗi: Hàm `datVeNhieuGhe` trong `veController.js` được thiết kế để nhận dữ liệu từ `req.body` và gửi response, nhưng khi được gọi từ `handleMoMoCallback` trong `thanhToanController.js`, không có `req` và `res`, dẫn đến lỗi.
- [x] Sửa đổi hàm `datVeNhieuGhe` để nhận các tham số trực tiếp (MASUAT, MAKH, GHE_LIST, GIAVE) và trả về kết quả thay vì gửi response JSON. Nếu thành công, trả về object { success: true, ticket: savedVe, ghe: GHE_LIST }; nếu lỗi, throw error.
- [x] Cập nhật `handleMoMoCallback` để gọi hàm với các tham số trực tiếp và xử lý kết quả (log thành công hoặc lỗi).

## Các bước tiếp theo:

- [ ] Kiểm tra lại code để đảm bảo không có lỗi cú pháp hoặc logic.
- [ ] Chạy server backend và test thanh toán MoMo để xác nhận dữ liệu vé và ghế được lưu thành công.
- [ ] Nếu có lỗi, debug và sửa.
