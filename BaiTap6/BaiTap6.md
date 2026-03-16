# BaiTap6 - Phân tích yêu cầu hệ thống bán vé tàu điện

---

## Yêu cầu chung

### Quy mô nhóm

- Team size:5 người
- Gợi ý vai trò:
  - 1 bạn phụ trách phân tích nghiệp vụ + viết tài liệu
  - 1 bạn phụ trách UI/UX + frontend
  - 1 bạn phụ trách backend API + database
  - 2 bạn phụ trách test + demo + tổng hợp báo cáo

### Đầu ra bắt buộc

- Tài liệu yêu cầu chức năng (file này)
- Product Backlog/User Stories cho sprint đầu tiên
- Sơ đồ use case (mức tổng quan)
- Prototype màn hình chính (wireframe hoặc HTML demo)
- Kịch bản test cho luồng mua vé

### Giả định nghiệp vụ

- Mỗi chuyến tàu có số ghế hữu hạn
- Giá vé thay đổi theo loại vé và khung giờ
- Vé điện tử có mã QR duy nhất
- Hệ thống có 3 nhóm người dùng: Khách hàng, Nhân viên soát vé, Quản trị viên

---

## Danh sách chức năng hệ thống bán vé tàu điện

## Nhóm người dùng (Actors)

- **Khách hàng (Customer)**: tìm chuyến, đặt vé, thanh toán, xem vé
- **Nhân viên soát vé (Inspector)**: quét QR để kiểm tra vé hợp lệ
- **Quản trị viên (Admin)**: quản lý tuyến, chuyến, giá vé, báo cáo

## Danh sách chức năng chi tiết

| ID  | Chức năng                              | Mô tả ngắn                                        | Ưu tiên |
| --- | -------------------------------------- | ------------------------------------------------- | ------- |
| F01 | Đăng ký tài khoản                      | Khách tạo tài khoản bằng email/số điện thoại      | Must    |
| F02 | Đăng nhập/Đăng xuất                    | Xác thực người dùng và quản lý phiên đăng nhập    | Must    |
| F03 | Quản lý hồ sơ cá nhân                  | Cập nhật tên, số điện thoại, mật khẩu             | Should  |
| F04 | Xem danh sách tuyến tàu                | Hiển thị các tuyến, ga đi/ga đến                  | Must    |
| F05 | Tra cứu lịch chạy tàu                  | Xem giờ khởi hành theo ngày và tuyến              | Must    |
| F06 | Tìm chuyến theo điều kiện              | Lọc theo ga, thời gian, loại vé                   | Must    |
| F07 | Xem chi tiết chuyến                    | Thời gian đi, thời gian đến, số ghế còn lại, giá  | Must    |
| F08 | Chọn ghế theo sơ đồ toa                | Hiển thị ghế trống/đã đặt và cho chọn ghế         | Must    |
| F09 | Tạm giữ ghế trong thời gian thanh toán | Giữ ghế 5-10 phút để tránh tranh chấp             | Must    |
| F10 | Tính tiền tự động                      | Tính tổng tiền theo số lượng vé, loại vé, ưu đãi  | Must    |
| F11 | Áp mã giảm giá                         | Nhập voucher hợp lệ để giảm giá                   | Should  |
| F12 | Thanh toán online                      | Hỗ trợ ví điện tử/thẻ ngân hàng (mô phỏng)        | Must    |
| F13 | Tạo vé điện tử QR                      | Sinh mã QR duy nhất sau khi thanh toán thành công | Must    |
| F14 | Gửi vé qua email                       | Gửi thông tin vé cho khách sau khi mua            | Should  |
| F15 | Xem lịch sử đặt vé                     | Danh sách vé đã mua, trạng thái từng vé           | Must    |
| F16 | Hủy vé theo chính sách                 | Cho phép hủy trước giờ tàu chạy theo quy định     | Should  |
| F17 | Quét QR kiểm tra vé                    | Nhân viên soát vé xác nhận vé hợp lệ/hết hạn      | Must    |
| F18 | Quản lý tuyến/chuyến tàu (Admin)       | CRUD tuyến, ga, lịch chạy, toa tàu                | Must    |
| F19 | Quản lý giá vé và khuyến mãi (Admin)   | Cấu hình giá theo tuyến/giờ và mã giảm giá        | Must    |
| F20 | Báo cáo doanh thu (Admin)              | Thống kê vé bán, doanh thu theo ngày/tuyến        | Could   |

---

## User stories mẫu cho sprint đầu tiên

- **US01 - Tìm chuyến**: Là khách hàng, tôi muốn tìm chuyến tàu theo ga đi, ga đến và thời gian để chọn chuyến phù hợp.
- **US02 - Chọn ghế**: Là khách hàng, tôi muốn xem sơ đồ ghế trống để chọn vị trí mong muốn.
- **US03 - Thanh toán**: Là khách hàng, tôi muốn thanh toán online để nhận vé ngay.
- **US04 - Nhận vé QR**: Là khách hàng, tôi muốn nhận vé QR để qua cổng kiểm soát nhanh.
- **US05 - Quét vé**: Là nhân viên soát vé, tôi muốn quét QR để xác thực vé hợp lệ.

---

## Luồng nghiệp vụ chính (Happy Path)

- Khách hàng đăng nhập vào hệ thống
- Chọn ga đi, ga đến, ngày đi
- Hệ thống trả về danh sách chuyến phù hợp
- Khách chọn chuyến và ghế
- Hệ thống giữ ghế tạm thời và tính tiền
- Khách thanh toán online thành công
- Hệ thống tạo vé QR và cập nhật trạng thái đã thanh toán
- Khách nhận vé trong mục "Vé của tôi" và qua email
- Khi lên tàu, nhân viên quét QR để xác nhận vé hợp lệ

---

## Yêu cầu phi chức năng (NFR)

- **Hiệu năng**: tìm chuyến trả kết quả trong <= 2 giây (với dữ liệu mô phỏng)
- **Bảo mật**: không lưu mật khẩu dạng plain text
- **Tin cậy**: không cho phép 2 người cùng mua 1 ghế tại cùng thời điểm
- **Khả dụng**: giao diện dùng tốt trên desktop và mobile cơ bản
- **Dễ dùng**: quy trình mua vé tối đa 5 bước

---

## Gợi ý chia việc cho nhóm 4 người

- **Thành viên A (Business + Docs)**
  
  - Viết use case, user stories, acceptance criteria
  - Vẽ sơ đồ luồng nghiệp vụ

- **Thành viên B (Frontend)**
  
  - Màn hình tìm chuyến, danh sách chuyến, chọn ghế
  - Màn hình thanh toán và vé của tôi

- **Thành viên C (Backend + DB)**
  
  - API tìm chuyến, giữ ghế, đặt vé, tạo QR
  - Thiết kế bảng dữ liệu: users, stations, routes, trips, seats, bookings, tickets

- **Thành viên D (QA + Integration)**
  
  - Viết test cases cho luồng mua vé và hủy vé
  - Kiểm thử lỗi cạnh biên và chuẩn bị kịch bản demo

---

## Tiêu chí hoàn thành bài tập

- Có đầy đủ danh sách chức năng tối thiểu từ F01 đến F19
- Demo được luồng mua vé hoàn chỉnh từ tìm chuyến đến quét QR
- Có ít nhất 10 test cases cho chức năng chính
- Có backlog rõ ràng và phân công công việc cụ thể cho từng thành viên
- Tài liệu và mã nguồn đồng bộ với chức năng đã demo
