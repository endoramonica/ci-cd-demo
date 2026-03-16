# Sơ đồ Luồng Nghiệp vụ - Hệ thống Bán Vé Tàu Điện

## Use Case Diagram - Tổng quan Hệ thống

```mermaid
graph TB
    subgraph "Actors"
        Customer[👤 Khách hàng<br/>Customer]
        Inspector[👮 Nhân viên soát vé<br/>Inspector]
        Admin[👨‍💼 Quản trị viên<br/>Admin]
    end
    
    subgraph "Hệ thống Bán Vé Tàu Điện"
        subgraph "Quản lý Tài khoản"
            UC1[Đăng ký tài khoản]
            UC2[Đăng nhập]
            UC3[Đăng xuất]
            UC4[Cập nhật thông tin]
        end
        
        subgraph "Tìm kiếm & Đặt vé"
            UC5[Tìm kiếm chuyến tàu]
            UC6[Xem chi tiết chuyến]
            UC7[Chọn ghế]
            UC8[Áp dụng voucher]
            UC9[Thanh toán]
            UC10[Nhận vé điện tử]
        end
        
        subgraph "Quản lý Vé"
            UC11[Xem lịch sử đặt vé]
            UC12[Xem chi tiết vé]
            UC13[Hủy vé]
        end
        
        subgraph "Kiểm tra Vé"
            UC14[Quét QR code]
            UC15[Xác thực vé]
            UC16[Đánh dấu vé đã sử dụng]
        end
        
        subgraph "Quản lý Hệ thống"
            UC17[Quản lý tuyến tàu]
            UC18[Quản lý chuyến tàu]
            UC19[Cấu hình giá vé]
            UC20[Quản lý voucher]
            UC21[Duyệt hoàn tiền]
            UC22[Xem báo cáo]
        end
    end
    
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8
    Customer --> UC9
    Customer --> UC10
    Customer --> UC11
    Customer --> UC12
    Customer --> UC13
    
    Inspector --> UC2
    Inspector --> UC3
    Inspector --> UC14
    Inspector --> UC15
    Inspector --> UC16
    
    Admin --> UC2
    Admin --> UC3
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20
    Admin --> UC21
    Admin --> UC22
    
    style Customer fill:#e1f5ff
    style Inspector fill:#fff4e1
    style Admin fill:#ffe1e1
```

## Luồng 1: Đăng ký và Đăng nhập

```mermaid
sequenceDiagram
    actor Customer as 👤 Khách hàng
    participant UI as Giao diện Web
    participant Auth as Authentication Service
    participant DB as Database
    participant Redis as Redis Cache
    
    Note over Customer,Redis: Đăng ký tài khoản
    Customer->>UI: Nhập email, password
    UI->>Auth: POST /api/auth/register
    Auth->>DB: Kiểm tra email tồn tại
    alt Email đã tồn tại
        DB-->>Auth: Email exists
        Auth-->>UI: 409 Conflict
        UI-->>Customer: Hiển thị lỗi
    else Email hợp lệ
        Auth->>Auth: Hash password (bcrypt)
        Auth->>DB: Tạo user mới
        DB-->>Auth: User created
        Auth-->>UI: 201 Created
        UI-->>Customer: Đăng ký thành công
    end
    
    Note over Customer,Redis: Đăng nhập
    Customer->>UI: Nhập email, password
    UI->>Auth: POST /api/auth/login
    Auth->>DB: Tìm user theo email
    DB-->>Auth: User data
    Auth->>Auth: Verify password
    alt Password sai
        Auth-->>UI: 401 Unauthorized
        UI-->>Customer: Sai thông tin đăng nhập
    else Password đúng
        Auth->>Auth: Tạo JWT token
        Auth->>Redis: Lưu session
        Redis-->>Auth: Session saved
        Auth-->>UI: 200 OK + tokens
        UI-->>Customer: Đăng nhập thành công
    end
```

## Luồng 2: Tìm kiếm và Đặt vé

```mermaid
sequenceDiagram
    actor Customer as 👤 Khách hàng
    participant UI as Giao diện Web
    participant Search as Trip Search Service
    participant Booking as Booking Service
    participant Payment as Payment Service
    participant Ticket as Ticket Service
    participant Email as Email Service
    participant DB as Database
    participant Redis as Redis Cache
    
    Note over Customer,Redis: Tìm kiếm chuyến tàu
    Customer->>UI: Chọn ga đi, ga đến, ngày
    UI->>Search: GET /api/trips/search
    Search->>Redis: Kiểm tra cache
    alt Cache hit
        Redis-->>Search: Cached results
    else Cache miss
        Search->>DB: Query trips
        DB-->>Search: Trip list
        Search->>Redis: Cache results (5 min)
    end
    Search-->>UI: Danh sách chuyến
    UI-->>Customer: Hiển thị kết quả
    
    Note over Customer,Redis: Xem chi tiết và chọn ghế
    Customer->>UI: Chọn chuyến tàu
    UI->>Search: GET /api/trips/:id/seats
    Search->>DB: Lấy sơ đồ ghế
    DB-->>Search: Seat map + status
    Search-->>UI: Sơ đồ ghế
    UI-->>Customer: Hiển thị ghế trống/đã đặt
    
    Customer->>UI: Chọn ghế
    UI->>Booking: POST /api/bookings/reserve-seat
    Booking->>DB: SELECT FOR UPDATE (lock ghế)
    alt Ghế đã được đặt
        DB-->>Booking: Seat occupied
        Booking-->>UI: 409 Conflict
        UI-->>Customer: Ghế đã được chọn
    else Ghế còn trống
        Booking->>DB: UPDATE status = HOLD
        Booking->>Redis: Set expiry 10 min
        DB-->>Booking: Seat reserved
        Booking-->>UI: 200 OK + reservation
        UI-->>Customer: Giữ ghế 10 phút
    end
    
    Note over Customer,Redis: Áp dụng voucher (optional)
    Customer->>UI: Nhập mã voucher
    UI->>Booking: POST /api/bookings/apply-voucher
    Booking->>DB: Validate voucher
    alt Voucher hợp lệ
        Booking->>DB: Kiểm tra user đã dùng chưa
        alt Chưa sử dụng
            Booking-->>UI: Discount applied
            UI-->>Customer: Giảm giá thành công
        else Đã sử dụng
            Booking-->>UI: 400 Bad Request
            UI-->>Customer: Voucher đã dùng
        end
    else Voucher không hợp lệ
        Booking-->>UI: 404 Not Found
        UI-->>Customer: Mã không tồn tại
    end
    
    Note over Customer,Redis: Thanh toán
    Customer->>UI: Xác nhận thanh toán
    UI->>Booking: POST /api/bookings
    Booking->>Booking: Tính tổng tiền
    Booking->>DB: BEGIN TRANSACTION
    Booking->>DB: Tạo booking record
    
    Booking->>Payment: POST /api/payments/initiate
    Payment->>Payment: Tích hợp payment gateway
    Payment-->>UI: Payment URL
    UI-->>Customer: Chuyển đến trang thanh toán
    
    Customer->>Payment: Thanh toán qua gateway
    Payment->>Payment: Xử lý callback
    
    alt Thanh toán thành công
        Payment->>DB: Update payment status
        Payment->>DB: Update seat status = BOOKED
        Payment->>Ticket: Generate tickets
        Ticket->>Ticket: Tạo QR code duy nhất
        Ticket->>DB: Save tickets
        Payment->>DB: COMMIT TRANSACTION
        
        Ticket->>Email: Send ticket email
        Email-->>Customer: Email vé điện tử
        
        Payment-->>UI: Payment success
        UI-->>Customer: Đặt vé thành công
    else Thanh toán thất bại
        Payment->>DB: ROLLBACK TRANSACTION
        Payment->>DB: Release seat (AVAILABLE)
        Payment-->>UI: Payment failed
        UI-->>Customer: Thanh toán thất bại
    end
```

## Luồng 3: Quản lý Vé của Khách hàng

```mermaid
sequenceDiagram
    actor Customer as 👤 Khách hàng
    participant UI as Giao diện Web
    participant Ticket as Ticket Service
    participant Booking as Booking Service
    participant Refund as Refund Service
    participant DB as Database
    
    Note over Customer,DB: Xem lịch sử đặt vé
    Customer->>UI: Truy cập lịch sử
    UI->>Booking: GET /api/bookings/history
    Booking->>DB: Query bookings by userId
    DB-->>Booking: Booking list
    Booking-->>UI: Booking history
    UI-->>Customer: Hiển thị danh sách vé
    
    Note over Customer,DB: Xem chi tiết vé
    Customer->>UI: Chọn vé
    UI->>Ticket: GET /api/tickets/:id
    Ticket->>DB: Query ticket details
    DB-->>Ticket: Ticket + QR code
    Ticket-->>UI: Ticket details
    UI-->>Customer: Hiển thị vé + QR
    
    Note over Customer,DB: Hủy vé
    Customer->>UI: Yêu cầu hủy vé
    UI->>Ticket: POST /api/tickets/:id/cancel
    Ticket->>DB: Lấy thông tin chuyến
    Ticket->>Ticket: Kiểm tra thời gian
    
    alt Còn >= 2 giờ trước khởi hành
        Ticket->>DB: BEGIN TRANSACTION
        Ticket->>DB: UPDATE ticket status = CANCEL_REQUESTED
        Ticket->>DB: UPDATE seat status = AVAILABLE
        Ticket->>Refund: Create refund request
        Refund->>DB: Insert refund record
        Ticket->>DB: COMMIT TRANSACTION
        Ticket-->>UI: 200 OK
        UI-->>Customer: Yêu cầu hủy thành công
    else < 2 giờ trước khởi hành
        Ticket-->>UI: 400 Bad Request
        UI-->>Customer: Không thể hủy vé
    end
```

## Luồng 4: Kiểm tra Vé (Inspector)

```mermaid
sequenceDiagram
    actor Inspector as 👮 Nhân viên soát vé
    participant Mobile as Mobile App
    participant Ticket as Ticket Service
    participant DB as Database
    
    Note over Inspector,DB: Quét và xác thực vé
    Inspector->>Mobile: Quét QR code
    Mobile->>Mobile: Decode QR
    Mobile->>Ticket: POST /api/tickets/validate
    Ticket->>DB: Query ticket by QR code
    
    alt QR không tồn tại
        DB-->>Ticket: Not found
        Ticket-->>Mobile: 404 Not Found
        Mobile-->>Inspector: ❌ Vé không hợp lệ
    else QR tồn tại
        DB-->>Ticket: Ticket data
        Ticket->>Ticket: Kiểm tra status
        
        alt Status = PAID (chưa dùng)
            Ticket->>DB: UPDATE status = USED
            Ticket->>DB: Record inspector_id, timestamp
            DB-->>Ticket: Updated
            Ticket-->>Mobile: ✅ Vé hợp lệ + passenger info
            Mobile-->>Inspector: Cho phép lên tàu
        else Status = USED (đã dùng)
            Ticket-->>Mobile: ⚠️ Vé đã sử dụng
            Mobile-->>Inspector: Từ chối - đã quét
        else Status = EXPIRED
            Ticket-->>Mobile: ❌ Vé hết hạn
            Mobile-->>Inspector: Từ chối - hết hạn
        else Status = REFUNDED/CANCELLED
            Ticket-->>Mobile: ❌ Vé đã hủy
            Mobile-->>Inspector: Từ chối - đã hủy
        end
    end
```

## Luồng 5: Quản lý Tuyến và Chuyến (Admin)

```mermaid
sequenceDiagram
    actor Admin as 👨‍💼 Quản trị viên
    participant UI as Admin Dashboard
    participant RouteService as Route Service
    participant TripService as Trip Service
    participant DB as Database
    
    Note over Admin,DB: Tạo tuyến tàu
    Admin->>UI: Nhập thông tin tuyến
    UI->>RouteService: POST /api/admin/routes
    RouteService->>RouteService: Validate data
    RouteService->>DB: Insert route
    DB-->>RouteService: Route created
    RouteService-->>UI: 201 Created
    UI-->>Admin: Tạo tuyến thành công
    
    Note over Admin,DB: Tạo chuyến tàu
    Admin->>UI: Nhập thông tin chuyến
    UI->>TripService: POST /api/admin/trips
    TripService->>DB: Validate route exists
    TripService->>DB: BEGIN TRANSACTION
    TripService->>DB: Insert trip
    TripService->>TripService: Generate seat inventory
    
    loop For each seat in train
        TripService->>DB: Insert seat_status (AVAILABLE)
    end
    
    TripService->>DB: COMMIT TRANSACTION
    TripService-->>UI: 201 Created + seat count
    UI-->>Admin: Tạo chuyến thành công
    
    Note over Admin,DB: Xóa chuyến tàu
    Admin->>UI: Yêu cầu xóa chuyến
    UI->>TripService: DELETE /api/admin/trips/:id
    TripService->>DB: Check existing bookings
    
    alt Có booking
        DB-->>TripService: Bookings exist
        TripService-->>UI: 409 Conflict
        UI-->>Admin: ⚠️ Không thể xóa - có vé đã đặt
    else Không có booking
        TripService->>DB: DELETE trip
        TripService->>DB: DELETE seat_status
        DB-->>TripService: Deleted
        TripService-->>UI: 200 OK
        UI-->>Admin: Xóa thành công
    end
```

## Luồng 6: Quản lý Voucher và Giá (Admin)

```mermaid
sequenceDiagram
    actor Admin as 👨‍💼 Quản trị viên
    participant UI as Admin Dashboard
    participant VoucherService as Voucher Service
    participant PricingService as Pricing Service
    participant DB as Database
    
    Note over Admin,DB: Tạo voucher
    Admin->>UI: Nhập thông tin voucher
    UI->>VoucherService: POST /api/admin/vouchers
    VoucherService->>VoucherService: Generate unique code
    VoucherService->>DB: Check code uniqueness
    
    alt Code đã tồn tại
        VoucherService->>VoucherService: Regenerate code
    end
    
    VoucherService->>DB: Insert voucher
    DB-->>VoucherService: Voucher created
    VoucherService-->>UI: 201 Created + code
    UI-->>Admin: Voucher tạo thành công
    
    Note over Admin,DB: Cấu hình giá vé
    Admin->>UI: Nhập giá cho tuyến
    UI->>PricingService: POST /api/admin/pricing
    PricingService->>DB: Insert/Update pricing
    DB-->>PricingService: Pricing saved
    PricingService-->>UI: 200 OK
    UI-->>Admin: Cập nhật giá thành công
    
    Note over Admin,DB: Duyệt hoàn tiền
    Admin->>UI: Xem danh sách yêu cầu
    UI->>VoucherService: GET /api/admin/refunds
    VoucherService->>DB: Query refunds (status=REQUESTED)
    DB-->>VoucherService: Refund list
    VoucherService-->>UI: Pending refunds
    UI-->>Admin: Hiển thị danh sách
    
    Admin->>UI: Duyệt hoàn tiền
    UI->>VoucherService: POST /api/admin/refunds/:id/approve
    VoucherService->>DB: BEGIN TRANSACTION
    VoucherService->>DB: UPDATE refund status = APPROVED
    VoucherService->>VoucherService: Process payment refund
    VoucherService->>DB: UPDATE ticket status = REFUNDED
    VoucherService->>DB: COMMIT TRANSACTION
    VoucherService-->>UI: 200 OK
    UI-->>Admin: Hoàn tiền thành công
```

## Luồng 7: Báo cáo và Thống kê (Admin)

```mermaid
sequenceDiagram
    actor Admin as 👨‍💼 Quản trị viên
    participant UI as Admin Dashboard
    participant Report as Report Service
    participant DB as Database
    
    Note over Admin,DB: Xem báo cáo doanh thu
    Admin->>UI: Chọn khoảng thời gian
    UI->>Report: GET /api/admin/reports/revenue
    Report->>DB: Query payments (date range)
    Report->>DB: Query bookings count
    Report->>DB: Query tickets sold
    DB-->>Report: Aggregated data
    Report->>Report: Calculate metrics
    Report-->>UI: Revenue report
    UI-->>Admin: Hiển thị biểu đồ + số liệu
    
    Note over Admin,DB: Xem hiệu suất tuyến
    Admin->>UI: Xem báo cáo tuyến
    UI->>Report: GET /api/admin/reports/routes
    Report->>DB: Query trips by route
    Report->>DB: Calculate occupancy rate
    Report->>DB: Calculate revenue per route
    DB-->>Report: Route metrics
    Report-->>UI: Route performance
    UI-->>Admin: Hiển thị bảng thống kê
    
    Note over Admin,DB: Xuất báo cáo
    Admin->>UI: Chọn xuất CSV/PDF
    UI->>Report: GET /api/admin/reports/export
    Report->>Report: Generate file
    Report-->>UI: File download
    UI-->>Admin: Tải file báo cáo
```

## Luồng 8: Xử lý Concurrent Booking

```mermaid
sequenceDiagram
    actor User1 as 👤 User 1
    actor User2 as 👤 User 2
    participant API as API Server
    participant Booking as Booking Service
    participant DB as PostgreSQL
    
    Note over User1,DB: Hai user chọn cùng ghế đồng thời
    
    par User 1 chọn ghế
        User1->>API: POST /reserve-seat (seat_123)
        API->>Booking: Reserve request
        Booking->>DB: BEGIN TRANSACTION
        Booking->>DB: SELECT * FROM seat_status<br/>WHERE seat_id='123'<br/>FOR UPDATE
        Note over DB: 🔒 Lock row
        DB-->>Booking: Seat data (AVAILABLE)
    and User 2 chọn ghế
        User2->>API: POST /reserve-seat (seat_123)
        API->>Booking: Reserve request
        Booking->>DB: BEGIN TRANSACTION
        Booking->>DB: SELECT * FROM seat_status<br/>WHERE seat_id='123'<br/>FOR UPDATE
        Note over DB: ⏳ Wait for lock...
    end
    
    Booking->>DB: UPDATE status = HOLD
    Booking->>DB: COMMIT TRANSACTION
    Note over DB: 🔓 Release lock
    DB-->>Booking: Success
    Booking-->>API: 200 OK
    API-->>User1: ✅ Ghế đã giữ
    
    Note over DB: Lock released, User 2 proceeds
    DB-->>Booking: Seat data (HOLD)
    Booking->>Booking: Check status = HOLD
    Booking->>DB: ROLLBACK TRANSACTION
    Booking-->>API: 409 Conflict
    API-->>User2: ❌ Ghế đã được chọn
```

## Luồng 9: Tự động Hết hạn Giữ Ghế

```mermaid
sequenceDiagram
    participant Scheduler as Background Job
    participant Redis as Redis Cache
    participant DB as Database
    participant Customer as 👤 Khách hàng
    
    Note over Scheduler,Customer: Cron job chạy mỗi phút
    
    loop Every minute
        Scheduler->>Redis: Get expired reservations
        Redis-->>Scheduler: List of expired seat IDs
        
        loop For each expired seat
            Scheduler->>DB: BEGIN TRANSACTION
            Scheduler->>DB: SELECT status FROM seat_status<br/>WHERE seat_id = ?
            
            alt Status = HOLD
                Scheduler->>DB: UPDATE status = AVAILABLE
                Scheduler->>DB: DELETE hold_expires_at
                Scheduler->>DB: COMMIT
                Scheduler->>Redis: Remove from cache
                Note over Scheduler: Ghế được mở lại
            else Status = BOOKED
                Scheduler->>DB: ROLLBACK
                Note over Scheduler: Đã thanh toán, giữ nguyên
            end
        end
    end
    
    Note over Customer: Nếu user quay lại sau 10 phút
    Customer->>DB: Check seat status
    DB-->>Customer: Status = AVAILABLE
    Customer->>Customer: Phải chọn lại ghế
```

## Sơ đồ Trạng thái Vé (Ticket State Machine)

```mermaid
stateDiagram-v2
    [*] --> CREATED: Tạo booking
    CREATED --> PAID: Thanh toán thành công
    CREATED --> [*]: Thanh toán thất bại<br/>(xóa booking)
    
    PAID --> USED: Inspector quét QR
    PAID --> CANCEL_REQUESTED: Customer yêu cầu hủy<br/>(>= 2h trước khởi hành)
    PAID --> EXPIRED: Quá giờ khởi hành<br/>(auto)
    
    CANCEL_REQUESTED --> REFUNDED: Admin duyệt hoàn tiền
    CANCEL_REQUESTED --> PAID: Admin từ chối
    
    USED --> [*]: Hoàn thành chuyến đi
    EXPIRED --> [*]: Vé hết hạn
    REFUNDED --> [*]: Đã hoàn tiền
    
    note right of PAID
        Vé hợp lệ
        Có thể sử dụng
    end note
    
    note right of USED
        Đã lên tàu
        Không thể hủy
    end note
    
    note right of CANCEL_REQUESTED
        Chờ admin duyệt
        Ghế đã được mở lại
    end note
```

## Sơ đồ Trạng thái Ghế (Seat State Machine)

```mermaid
stateDiagram-v2
    [*] --> AVAILABLE: Tạo chuyến tàu
    
    AVAILABLE --> HOLD: User chọn ghế
    HOLD --> AVAILABLE: Hết 10 phút<br/>(auto release)
    HOLD --> BOOKED: Thanh toán thành công
    HOLD --> AVAILABLE: User hủy chọn
    
    BOOKED --> AVAILABLE: Vé bị hủy<br/>(>= 2h trước khởi hành)
    BOOKED --> [*]: Chuyến tàu hoàn thành
    
    note right of AVAILABLE
        Ghế trống
        Có thể đặt
    end note
    
    note right of HOLD
        Đang giữ chỗ
        Timeout: 10 phút
    end note
    
    note right of BOOKED
        Đã xác nhận
        Không thể đặt
    end note
```

## Công thức Tính Giá

```mermaid
graph LR
    A[Base Price] --> B[+ Time Surcharge]
    B --> C[Subtotal]
    C --> D[- Voucher Discount]
    D --> E[- Round Trip Discount]
    E --> F[Final Price]
    
    style A fill:#e1f5ff
    style F fill:#90EE90
    
    Note1[Time Surcharge:<br/>15% nếu khởi hành sau 17:00]
    Note2[Round Trip:<br/>10% nếu đặt cả 2 chiều]
    Note3[Voucher:<br/>Mỗi user dùng 1 lần]
    
    B -.-> Note1
    E -.-> Note2
    D -.-> Note3
```

