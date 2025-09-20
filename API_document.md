# Tài Liệu API - Hệ Thống Đặt Vé Phim

## URL Cơ Sở

```
http://localhost:5000/api
```

## Các Endpoint

### 1. Phim (Movies)

#### GET /phim/danh-sach

- Mô tả: Lấy danh sách tất cả phim
- Phản hồi: Mảng các object phim

#### GET /phim/chi-tiet/:maphim

- Mô tả: Lấy chi tiết phim theo mã
- Tham số: maphim (string)
- Phản hồi: Object phim

#### POST /phim/them-phim

- Mô tả: Thêm phim mới
- Body: Dữ liệu phim
- Phản hồi: Thông báo thành công

#### PUT /phim/cap-nhat/:maphim

- Mô tả: Cập nhật thông tin phim
- Tham số: maphim (string)
- Body: Dữ liệu phim đã cập nhật
- Phản hồi: Thông báo thành công

#### DELETE /phim/xoa-phim/:maphim

- Mô tả: Xóa phim
- Tham số: maphim (string)
- Phản hồi: Thông báo thành công

#### GET /phim/tim-kiem

- Mô tả: Tìm kiếm phim
- Query: các tham số tìm kiếm
- Phản hồi: Mảng các phim phù hợp

#### GET /phim/danh-sach-dang-chieu

- Mô tả: Lấy danh sách phim đang chiếu
- Phản hồi: Mảng các phim đang chiếu

#### GET /phim/danh-sach-sap-chieu

- Mô tả: Lấy danh sách phim sắp chiếu
- Phản hồi: Mảng các phim sắp chiếu

### 2. Người Dùng (Users)

#### POST /nguoidung/dang-ky

- Mô tả: Đăng ký tài khoản mới
- Body: { email, password, hoTen, soDt, ... }
- Phản hồi: Dữ liệu người dùng với token

#### POST /nguoidung/dang-nhap

- Mô tả: Đăng nhập
- Body: { email, password }
- Phản hồi: Dữ liệu người dùng với token

#### GET /nguoidung/chi-tiet/:makh

- Mô tả: Lấy thông tin chi tiết người dùng
- Tham số: makh (string)
- Phản hồi: Object người dùng

#### PUT /nguoidung/cap-nhat/:makh

- Mô tả: Cập nhật thông tin người dùng
- Tham số: makh (string)
- Body: Dữ liệu người dùng đã cập nhật
- Phản hồi: Thông báo thành công

#### PUT /nguoidung/cap-nhat-mat-khau

- Mô tả: Đổi mật khẩu
- Body: { oldPassword, newPassword }
- Phản hồi: Thông báo thành công

### 3. Vé (Tickets)

#### GET /ve/danh-sach

- Mô tả: Lấy danh sách tất cả vé
- Phản hồi: Mảng các object vé

#### GET /ve/chi-tiet/:mave

- Mô tả: Lấy chi tiết vé theo mã
- Tham số: mave (string)
- Phản hồi: Object vé

#### POST /ve/them-ve

- Mô tả: Thêm vé mới
- Body: Dữ liệu vé
- Phản hồi: Thông báo thành công

#### GET /ve/lay-ve-theo-makh/:makh

- Mô tả: Lấy danh sách vé theo mã khách hàng
- Tham số: makh (string)
- Phản hồi: Mảng vé của người dùng

#### POST /ve/dat-ve

- Mô tả: Đặt vé cho nhiều ghế
- Body: { danhSachGhe: [...], maLichChieu, ... }
- Phản hồi: Xác nhận đặt vé

### 4. Ghế (Seats)

#### GET /ghe/danh-sach

- Mô tả: Lấy danh sách tất cả ghế
- Phản hồi: Mảng các object ghế

#### GET /ghe/chi-tiet/:maghe

- Mô tả: Lấy chi tiết ghế theo mã
- Tham số: maghe (string)
- Phản hồi: Object ghế

### 5. Rạp Chiếu (Theaters)

#### GET /rapchieu/danh-sach

- Mô tả: Lấy danh sách tất cả rạp chiếu
- Phản hồi: Mảng các object rạp chiếu

#### GET /rapchieu/chi-tiet/:marap

- Mô tả: Lấy chi tiết rạp theo mã
- Tham số: marap (string)
- Phản hồi: Object rạp chiếu

### 6. Thanh Toán (Payment)

#### POST /payment/create-payment-url

- Mô tả: Tạo URL thanh toán MoMo
- Body: Dữ liệu thanh toán
- Phản hồi: URL thanh toán

## Phản Hồi Lỗi

```json
{
  "message": "Mô tả lỗi",
  "error": "Lỗi chi tiết"
}
```

## Mã Trạng Thái

- 200: Thành công
- 201: Đã tạo
- 400: Yêu cầu không hợp lệ
- 401: Chưa xác thực
- 404: Không tìm thấy
- 500: Lỗi máy chủ nội bộ

## Lưu Ý

- Tất cả các yêu cầu POST/PUT nên có Content-Type: application/json
- Một số endpoint có thể yêu cầu quyền admin/manager
- Cập nhật thời gian thực có sẵn qua Socket.IO cho việc đặt ghế
