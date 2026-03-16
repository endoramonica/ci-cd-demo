# Requirements Document - Hệ thống Bán Vé Tàu Điện

## Introduction

Hệ thống bán vé tàu điện là một nền tảng trực tuyến cho phép khách hàng tìm kiếm, đặt mua và quản lý vé tàu điện một cách thuận tiện. Hệ thống hỗ trợ ba nhóm người dùng chính: Khách hàng (Customer), Nhân viên soát vé (Inspector), và Quản trị viên (Admin). Mục tiêu là cung cấp trải nghiệm mua vé nhanh chóng, an toàn với vé điện tử QR code, đồng thời đảm bảo tính toàn vẹn dữ liệu và ngăn chặn xung đột đặt chỗ.

## System Scope

Hệ thống bán vé tàu điện bao gồm các chức năng chính:
- Khách hàng: tìm chuyến tàu, chọn ghế, đặt vé, thanh toán, nhận vé điện tử QR
- Nhân viên soát vé: kiểm tra vé bằng cách quét QR code
- Quản trị viên: quản lý tuyến, chuyến, giá vé, voucher, duyệt hoàn tiền và xem báo cáo

Hệ thống hỗ trợ cả vé điện tử và vé vật lý, với khả năng xử lý đặt vé khứ hồi và áp dụng các chương trình khuyến mãi.

## Glossary

- **System**: Hệ thống bán vé tàu điện
- **Customer**: Khách hàng sử dụng hệ thống để tìm kiếm và mua vé
- **Inspector**: Nhân viên soát vé có nhiệm vụ kiểm tra tính hợp lệ của vé
- **Admin**: Quản trị viên quản lý toàn bộ hệ thống
- **Route**: Tuyến tàu bao gồm ga đi và ga đến
- **Trip**: Chuyến tàu cụ thể với thời gian khởi hành và kết thúc
- **Seat**: Ghế ngồi trên tàu với trạng thái AVAILABLE, HOLD, hoặc BOOKED
- **Seat Map**: Sơ đồ ghế cố định gắn với toa tàu
- **Booking**: Đơn đặt vé có thể chứa nhiều vé
- **Ticket**: Vé điện tử với mã QR, mỗi vé tương ứng với một ghế và một hành khách
- **Passenger**: Hành khách đi tàu, có thể khác với người đặt vé
- **QR Code**: Mã vạch hai chiều duy nhất để xác thực vé
- **Voucher**: Mã giảm giá áp dụng cho đơn hàng, mỗi tài khoản chỉ sử dụng một lần
- **Session**: Phiên đăng nhập của người dùng
- **Base Price**: Giá vé cơ bản theo tuyến và loại vé
- **Time Surcharge**: Phụ phí thời gian cao điểm (sau 17:00 tăng 15%)
- **Round Trip**: Vé khứ hồi giảm 10% khi đặt cả chiều đi và chiều về
- **Refund**: Hoàn tiền được xử lý bởi Admin trong vòng 7 ngày
- **Ticket Status**: Trạng thái vé bao gồm CREATED, PAID, USED, CANCEL_REQUESTED, REFUNDED, EXPIRED

## Business Rules

### BR1 - Quy tắc Vé và Hành khách
- Một vé tương ứng với một ghế
- Một vé tương ứng với một hành khách
- Một booking có thể chứa nhiều vé
- Người đặt vé không nhất thiết là người đi tàu
- Mỗi ticket phải có passenger_name, seat, và trip

### BR2 - Quy tắc Sơ đồ Ghế
- Seat map là cố định và gắn với toa tàu
- Seat status bao gồm: AVAILABLE, HOLD, BOOKED
- Ghế chỉ có thể được đặt khi ở trạng thái AVAILABLE

### BR3 - Quy tắc Giữ Ghế
- Khi khách hàng chọn ghế, seat_status chuyển sang HOLD
- Thời gian giữ ghế là 10 phút
- Nếu không thanh toán trong thời gian giữ, seat_status trở về AVAILABLE
- Ghế ở trạng thái HOLD không thể được chọn bởi khách hàng khác

### BR4 - Quy tắc Phân loại Vé
- Hệ thống hỗ trợ hai loại vé: Phổ thông và Vé tốt
- Giá vé khác nhau theo loại vé

### BR5 - Quy tắc Tính Giá
- Công thức tính giá: final_price = (base_price + time_surcharge) - voucher_discount - round_trip_discount
- Thứ tự áp dụng: Base price → Phụ phí thời gian → Voucher → Round trip discount

### BR6 - Quy tắc Khung Giờ Cao Điểm
- Chuyến tàu khởi hành sau 17:00 áp dụng phụ phí 15% trên base price

### BR7 - Quy tắc Voucher
- Voucher áp dụng theo ngày có hiệu lực
- Mỗi tài khoản chỉ được sử dụng một voucher một lần
- Mỗi booking chỉ được áp dụng một voucher
- Voucher có giới hạn số lần sử dụng và ngày hết hạn

### BR8 - Quy tắc Vé Khứ Hồi
- Round trip áp dụng khi: Trip 1 từ A → B và Trip 2 từ B → A
- Điều kiện: Khách hàng đã có vé A → B và đặt vé B → A
- Giảm giá: 10% tổng giá trị booking
- Chỉ áp dụng một lần cho một cặp vé

### BR9 - Quy tắc Hủy Vé
- Cho phép hủy vé khi còn ít nhất 24 giờ trước giờ khởi hành
- Workflow: Customer yêu cầu hủy → Admin duyệt → Hoàn tiền → Mở lại ghế
- Vé đã hủy không thể được kích hoạt lại

### BR10 - Quy tắc Hoàn Tiền
- Hoàn tiền được xử lý bởi Admin
- Thời gian hoàn tiền tối đa 7 ngày kể từ khi duyệt
- Số tiền hoàn phụ thuộc vào chính sách hủy vé

### BR11 - Quy tắc Vé Điện tử
- Sau khi thanh toán thành công, hệ thống tạo ticket với QR code duy nhất
- Mỗi QR code chỉ có thể được sử dụng một lần
- QR code chứa thông tin ticket_id, trip_id, seat_number, passenger_name

### BR12 - Quy tắc Trạng thái Vé
- Ticket status bao gồm: CREATED, PAID, USED, CANCEL_REQUESTED, REFUNDED, EXPIRED
- Chuyển đổi trạng thái: CREATED → PAID → USED hoặc PAID → CANCEL_REQUESTED → REFUNDED
- Vé hết hạn tự động chuyển sang EXPIRED sau giờ khởi hành

## Requirements

### Requirement 1: Quản lý Tài khoản Khách hàng

**User Story:** Là một khách hàng, tôi muốn tạo và quản lý tài khoản cá nhân, để có thể đặt vé và theo dõi lịch sử giao dịch của mình.

#### Acceptance Criteria

1. WHEN a user provides valid email address and password THEN the System SHALL create a new customer account with unique identifier
2. WHEN a user provides an email address that already exists THEN the System SHALL reject the registration and display an error message
3. WHEN a registered user provides correct credentials THEN the System SHALL authenticate the user and create a session
4. WHEN a user provides incorrect credentials THEN the System SHALL reject the login attempt and display an error message
5. WHEN an authenticated user requests logout THEN the System SHALL terminate the session and clear authentication tokens
6. WHEN an authenticated user updates profile information THEN the System SHALL validate and save the changes to the user profile

### Requirement 2: Tìm kiếm và Tra cứu Chuyến tàu

**User Story:** Là một khách hàng, tôi muốn tìm kiếm chuyến tàu theo ga đi, ga đến và thời gian, để chọn chuyến phù hợp với lịch trình của mình.

#### Acceptance Criteria

1. WHEN a user selects departure station, arrival station, and travel date THEN the System SHALL return all available trips matching the criteria within 2 seconds
2. WHEN a user views trip details THEN the System SHALL display departure time, arrival time, available seats count, and ticket price
3. WHEN a user applies filters for ticket type or time range THEN the System SHALL update the trip list to show only matching results
4. WHEN no trips match the search criteria THEN the System SHALL display a message indicating no results found
5. WHEN a user views the route list THEN the System SHALL display all active routes with station names

### Requirement 3: Chọn Ghế và Đặt Vé

**User Story:** Là một khách hàng, tôi muốn chọn ghế cụ thể trên sơ đồ toa tàu, để có vị trí ngồi mong muốn trong chuyến đi.

#### Acceptance Criteria

1. WHEN a user selects a trip THEN the System SHALL display a seat map showing available and occupied seats
2. WHEN a user selects an available seat THEN the System SHALL reserve the seat temporarily for 10 minutes
3. WHEN the temporary reservation expires THEN the System SHALL release the seat and make it available for other users
4. WHEN a user attempts to select an occupied seat THEN the System SHALL prevent the selection and display a notification
5. WHEN two users attempt to select the same seat simultaneously THEN the System SHALL assign the seat to the first request and reject the second request

### Requirement 4: Thanh toán và Tạo Vé

**User Story:** Là một khách hàng, tôi muốn thanh toán online và nhận vé điện tử ngay lập tức, để tiết kiệm thời gian và thuận tiện khi lên tàu.

#### Acceptance Criteria

1. WHEN a user completes seat selection THEN the System SHALL calculate the total price based on ticket type, quantity, and applied discounts
2. WHEN a user enters a valid voucher code THEN the System SHALL apply the discount to the total price
3. WHEN a user enters an invalid or expired voucher code THEN the System SHALL reject the voucher and display an error message
4. WHEN a user completes payment successfully THEN the System SHALL generate a unique QR code for each ticket
5. WHEN a ticket is created THEN the System SHALL update the seat status to confirmed and create a booking record
6. WHEN a ticket is created THEN the System SHALL send the ticket details to the customer email address within 1 minute

### Requirement 5: Quản lý Vé của Khách hàng

**User Story:** Là một khách hàng, tôi muốn xem lịch sử đặt vé và quản lý các vé đã mua, để theo dõi và hủy vé khi cần thiết.

#### Acceptance Criteria

1. WHEN an authenticated user accesses booking history THEN the System SHALL display all bookings with ticket status and trip details
2. WHEN a user views a ticket THEN the System SHALL display the QR code, trip information, seat number, and booking status
3. WHEN a user requests to cancel a ticket at least 2 hours before departure THEN the System SHALL cancel the ticket and release the seat
4. WHEN a user requests to cancel a ticket less than 2 hours before departure THEN the System SHALL reject the cancellation request
5. WHEN a ticket is cancelled THEN the System SHALL update the booking status to cancelled and process refund according to policy

### Requirement 6: Kiểm tra Vé bởi Nhân viên Soát vé

**User Story:** Là một nhân viên soát vé, tôi muốn quét mã QR để xác thực vé, để đảm bảo chỉ hành khách có vé hợp lệ được lên tàu.

#### Acceptance Criteria

1. WHEN an Inspector scans a QR code THEN the System SHALL validate the ticket and display ticket status within 1 second
2. WHEN a scanned ticket is valid and unused THEN the System SHALL mark the ticket as used and display passenger information
3. WHEN a scanned ticket has already been used THEN the System SHALL reject the ticket and display a warning message
4. WHEN a scanned ticket is expired or cancelled THEN the System SHALL reject the ticket and display the ticket status
5. WHEN a scanned QR code is invalid or not found THEN the System SHALL display an error message

### Requirement 7: Quản lý Tuyến và Chuyến tàu bởi Admin

**User Story:** Là một quản trị viên, tôi muốn quản lý tuyến tàu, ga, và lịch chạy tàu, để đảm bảo thông tin chuyến tàu luôn chính xác và cập nhật.

#### Acceptance Criteria

1. WHEN an Admin creates a new route THEN the System SHALL save the route with departure station, arrival station, and duration
2. WHEN an Admin creates a new trip THEN the System SHALL validate the trip schedule and create seat inventory based on train capacity
3. WHEN an Admin updates trip information THEN the System SHALL apply changes and notify affected bookings if necessary
4. WHEN an Admin deletes a trip with existing bookings THEN the System SHALL prevent deletion and display a warning message
5. WHEN an Admin views trip details THEN the System SHALL display booking statistics and seat occupancy rate

### Requirement 8: Quản lý Giá vé và Khuyến mãi bởi Admin

**User Story:** Là một quản trị viên, tôi muốn cấu hình giá vé và tạo mã giảm giá, để linh hoạt điều chỉnh giá theo thời gian và chạy các chương trình khuyến mãi.

#### Acceptance Criteria

1. WHEN an Admin sets ticket price for a route THEN the System SHALL save the price configuration with effective date range
2. WHEN an Admin creates a voucher THEN the System SHALL generate a unique voucher code with discount value, validity period, and usage limit
3. WHEN a voucher reaches its usage limit THEN the System SHALL mark the voucher as inactive and reject new applications
4. WHEN a voucher expires THEN the System SHALL automatically deactivate the voucher
5. WHERE dynamic pricing is enabled THEN the System SHALL adjust ticket prices based on time slots and demand

### Requirement 9: Báo cáo và Thống kê bởi Admin

**User Story:** Là một quản trị viên, tôi muốn xem báo cáo doanh thu và thống kê bán vé, để đánh giá hiệu quả kinh doanh và đưa ra quyết định quản lý.

#### Acceptance Criteria

1. WHEN an Admin requests revenue report for a date range THEN the System SHALL calculate and display total revenue, tickets sold, and booking count
2. WHEN an Admin views route performance THEN the System SHALL display occupancy rate and revenue for each route
3. WHEN an Admin exports report data THEN the System SHALL generate a downloadable file in CSV or PDF format
4. WHEN an Admin views real-time dashboard THEN the System SHALL display current booking statistics updated within 5 minutes

### Requirement 10: Bảo mật và Toàn vẹn Dữ liệu

**User Story:** Là một quản trị viên hệ thống, tôi muốn đảm bảo dữ liệu người dùng được bảo mật và hệ thống hoạt động tin cậy, để bảo vệ thông tin khách hàng và tránh lỗi nghiệp vụ.

#### Acceptance Criteria

1. WHEN the System stores user passwords THEN the System SHALL hash passwords using a secure algorithm before storage
2. WHEN the System processes concurrent booking requests for the same seat THEN the System SHALL use locking mechanism to prevent double booking
3. WHEN the System detects invalid session tokens THEN the System SHALL reject the request and require re-authentication
4. WHEN the System processes payment transactions THEN the System SHALL log all transaction details for audit purposes
5. WHEN the System experiences database errors THEN the System SHALL rollback incomplete transactions to maintain data consistency
