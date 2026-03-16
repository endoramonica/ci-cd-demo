# Design Document - Hệ thống Bán Vé Tàu Điện

## Overview

Hệ thống bán vé tàu điện là một ứng dụng web full-stack cho phép khách hàng đặt vé trực tuyến, nhân viên soát vé kiểm tra vé điện tử, và quản trị viên quản lý toàn bộ hệ thống. Thiết kế tập trung vào việc đảm bảo tính toàn vẹn dữ liệu, ngăn chặn xung đột đặt chỗ, và cung cấp trải nghiệm người dùng mượt mà.

### Key Design Goals
- Ngăn chặn double booking thông qua cơ chế khóa ghế
- Xử lý thanh toán an toàn với transaction rollback
- Tạo vé điện tử với QR code duy nhất
- Hỗ trợ tính giá động với voucher và round trip discount
- Đảm bảo hiệu suất cao cho tìm kiếm và đặt vé

## Architecture

### System Architecture
Hệ thống sử dụng kiến trúc 3-tier:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React/Vue Frontend + Mobile App)      │
└─────────────────┬───────────────────────┘
                  │ REST API / GraphQL
┌─────────────────▼───────────────────────┐
│         Application Layer               │
│  (Node.js/Express Backend)              │
│  - Authentication & Authorization       │
│  - Business Logic                       │
│  - Payment Processing                   │
│  - QR Code Generation                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Data Layer                      │
│  (PostgreSQL + Redis Cache)             │
│  - Relational Data Storage              │
│  - Session Management                   │
│  - Seat Locking                         │
└─────────────────────────────────────────┘
```

### Technology Stack
- **Frontend**: React/Vue.js với responsive design
- **Backend**: Node.js với Express hoặc NestJS
- **Database**: PostgreSQL (ACID compliance cho transaction)
- **Cache**: Redis (session storage và seat locking)
- **QR Code**: qrcode library hoặc tương đương
- **Authentication**: JWT tokens
- **Payment Gateway**: Integration với VNPay/MoMo/Stripe

## Components and Interfaces

### 1. Authentication Module
**Responsibilities:**
- User registration và login
- Session management với JWT
- Role-based access control (Customer, Inspector, Admin)

**Key Interfaces:**
```typescript
interface AuthService {
  register(email: string, password: string, role: UserRole): Promise<User>
  login(email: string, password: string): Promise<AuthToken>
  logout(token: string): Promise<void>
  validateToken(token: string): Promise<User>
  refreshToken(refreshToken: string): Promise<AuthToken>
}
```

### 2. Trip Search Module
**Responsibilities:**
- Tìm kiếm chuyến tàu theo ga và ngày
- Filter theo loại vé và khung giờ
- Cache kết quả tìm kiếm phổ biến

**Key Interfaces:**
```typescript
interface TripSearchService {
  searchTrips(criteria: SearchCriteria): Promise<Trip[]>
  getTripDetails(tripId: string): Promise<TripDetails>
  getAvailableSeats(tripId: string): Promise<SeatMap>
}

interface SearchCriteria {
  departureStation: string
  arrivalStation: string
  travelDate: Date
  ticketType?: TicketType
  timeRange?: TimeRange
}
```

### 3. Booking Module
**Responsibilities:**
- Quản lý quy trình đặt vé từ chọn ghế đến thanh toán
- Implement seat locking mechanism
- Xử lý concurrent booking requests

**Key Interfaces:**
```typescript
interface BookingService {
  selectSeat(tripId: string, seatId: string, userId: string): Promise<SeatReservation>
  releaseSeat(reservationId: string): Promise<void>
  createBooking(bookingData: BookingData): Promise<Booking>
  calculatePrice(bookingData: BookingData): Promise<PriceBreakdown>
  applyVoucher(bookingId: string, voucherCode: string): Promise<Discount>
}

interface SeatReservation {
  reservationId: string
  seatId: string
  expiresAt: Date
  status: 'HOLD' | 'CONFIRMED'
}
```

### 4. Payment Module
**Responsibilities:**
- Tích hợp payment gateway
- Xử lý transaction với rollback capability
- Tạo vé sau khi thanh toán thành công

**Key Interfaces:**
```typescript
interface PaymentService {
  initiatePayment(bookingId: string, amount: number): Promise<PaymentSession>
  processPayment(paymentData: PaymentData): Promise<PaymentResult>
  handlePaymentCallback(callbackData: any): Promise<void>
  refundPayment(ticketId: string, amount: number): Promise<RefundResult>
}
```

### 5. Ticket Module
**Responsibilities:**
- Tạo vé điện tử với QR code
- Quản lý ticket lifecycle
- Validate và mark ticket as used

**Key Interfaces:**
```typescript
interface TicketService {
  generateTicket(bookingId: string, passengerData: PassengerData): Promise<Ticket>
  generateQRCode(ticketId: string): Promise<string>
  validateTicket(qrCode: string): Promise<TicketValidation>
  markTicketAsUsed(ticketId: string, inspectorId: string): Promise<void>
  cancelTicket(ticketId: string, reason: string): Promise<CancellationResult>
}

interface Ticket {
  ticketId: string
  bookingId: string
  tripId: string
  seatNumber: string
  passengerName: string
  qrCode: string
  status: TicketStatus
  createdAt: Date
}
```

### 6. Admin Module
**Responsibilities:**
- Quản lý routes, trips, và pricing
- Tạo và quản lý vouchers
- Xử lý refund requests
- Generate reports

**Key Interfaces:**
```typescript
interface AdminService {
  createRoute(routeData: RouteData): Promise<Route>
  createTrip(tripData: TripData): Promise<Trip>
  updatePricing(routeId: string, pricing: PricingConfig): Promise<void>
  createVoucher(voucherData: VoucherData): Promise<Voucher>
  approveRefund(ticketId: string): Promise<RefundResult>
  generateReport(criteria: ReportCriteria): Promise<Report>
}
```

## Data Models

### Core Entities

```typescript
// User Management
interface User {
  userId: string
  email: string
  passwordHash: string
  role: 'CUSTOMER' | 'INSPECTOR' | 'ADMIN'
  profile: UserProfile
  createdAt: Date
  updatedAt: Date
}

interface UserProfile {
  fullName: string
  phoneNumber: string
  address?: string
}

// Route and Trip
interface Route {
  routeId: string
  departureStation: string
  arrivalStation: string
  duration: number // minutes
  distance: number // km
  isActive: boolean
}

interface Trip {
  tripId: string
  routeId: string
  trainId: string
  departureTime: Date
  arrivalTime: Date
  basePrice: number
  availableSeats: number
  totalSeats: number
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
}

// Seat Management
interface SeatMap {
  seatMapId: string
  trainId: string
  carriageNumber: number
  seats: Seat[]
}

interface Seat {
  seatId: string
  seatNumber: string
  carriageNumber: number
  seatType: 'STANDARD' | 'PREMIUM'
  position: { row: number; column: string }
}

interface SeatStatus {
  seatId: string
  tripId: string
  status: 'AVAILABLE' | 'HOLD' | 'BOOKED'
  holdExpiresAt?: Date
  reservedBy?: string
}

// Booking and Ticket
interface Booking {
  bookingId: string
  userId: string
  tripIds: string[] // Support round trip
  tickets: Ticket[]
  totalPrice: number
  priceBreakdown: PriceBreakdown
  voucherCode?: string
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  createdAt: Date
  paidAt?: Date
}

interface PriceBreakdown {
  basePrice: number
  timeSurcharge: number
  voucherDiscount: number
  roundTripDiscount: number
  finalPrice: number
}

interface Ticket {
  ticketId: string
  bookingId: string
  tripId: string
  seatId: string
  seatNumber: string
  passengerName: string
  passengerIdNumber?: string
  qrCode: string
  status: 'CREATED' | 'PAID' | 'USED' | 'CANCEL_REQUESTED' | 'REFUNDED' | 'EXPIRED'
  createdAt: Date
  usedAt?: Date
}

// Voucher
interface Voucher {
  voucherId: string
  code: string
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  minOrderValue?: number
  maxDiscount?: number
  validFrom: Date
  validUntil: Date
  usageLimit: number
  usedCount: number
  isActive: boolean
}

interface VoucherUsage {
  usageId: string
  voucherId: string
  userId: string
  bookingId: string
  usedAt: Date
}

// Payment
interface Payment {
  paymentId: string
  bookingId: string
  amount: number
  paymentMethod: string
  transactionId: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  createdAt: Date
  completedAt?: Date
}

// Refund
interface Refund {
  refundId: string
  ticketId: string
  bookingId: string
  requestedBy: string
  approvedBy?: string
  amount: number
  reason: string
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  requestedAt: Date
  processedAt?: Date
}
```

### Database Schema Considerations

**Indexes:**
- `trips(departureStation, arrivalStation, departureTime)` - Optimize search queries
- `seat_status(tripId, status)` - Fast seat availability lookup
- `tickets(qrCode)` - Quick QR validation
- `voucher_usage(userId, voucherId)` - Enforce one-time usage per user

**Constraints:**
- Unique constraint on `voucher_usage(userId, voucherId)` - Prevent duplicate voucher usage
- Check constraint on `seat_status.holdExpiresAt` - Must be future date when status is HOLD
- Foreign key constraints with CASCADE for data integrity


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Authentication and User Management

**Property 1: Account creation with unique identifiers**
*For any* valid email and password combination, creating a new account should result in a user record with a unique userId that differs from all existing user IDs.
**Validates: Requirements 1.1**

**Property 2: Login creates valid session**
*For any* registered user with correct credentials, logging in should create a session with a valid JWT token that can be used for authenticated requests.
**Validates: Requirements 1.3**

**Property 3: Invalid credentials rejection**
*For any* login attempt with incorrect password or non-existent email, the system should reject the authentication and not create a session.
**Validates: Requirements 1.4**

**Property 4: Logout clears session**
*For any* authenticated user session, logging out should invalidate the token such that subsequent requests with that token are rejected.
**Validates: Requirements 1.5**

**Property 5: Profile update round-trip**
*For any* valid profile data, updating a user's profile then retrieving it should return the same profile information.
**Validates: Requirements 1.6**

**Property 6: Password hashing**
*For any* user account, the stored password in the database should never equal the plain text password provided during registration.
**Validates: Requirements 10.1**

**Property 7: Invalid token rejection**
*For any* malformed, expired, or invalid JWT token, the system should reject authenticated requests and require re-authentication.
**Validates: Requirements 10.3**

### Trip Search and Display

**Property 8: Search results match criteria**
*For any* search with departure station, arrival station, and travel date, all returned trips should have matching departure station, arrival station, and departure time on the specified date.
**Validates: Requirements 2.1**

**Property 9: Trip details completeness**
*For any* trip, the trip details display should include departure time, arrival time, available seats count, and ticket price.
**Validates: Requirements 2.2**

**Property 10: Filter consistency**
*For any* applied filter (ticket type or time range), all trips in the filtered results should satisfy the filter criteria.
**Validates: Requirements 2.3**

**Property 11: Active routes only**
*For any* route list query, all returned routes should have isActive status set to true.
**Validates: Requirements 2.5**

### Seat Selection and Booking

**Property 12: Seat map reflects status**
*For any* trip, the displayed seat map should accurately reflect the current status (AVAILABLE, HOLD, BOOKED) of each seat.
**Validates: Requirements 3.1**

**Property 13: Available seat reservation**
*For any* seat with AVAILABLE status, selecting it should change the status to HOLD with an expiry time of exactly 10 minutes from the selection time.
**Validates: Requirements 3.2**

**Property 14: Expired reservation release**
*For any* seat with HOLD status, when the hold expiry time is reached, the seat status should automatically revert to AVAILABLE.
**Validates: Requirements 3.3**

**Property 15: Occupied seat rejection**
*For any* seat with HOLD or BOOKED status, attempts to select that seat should be rejected and the seat status should remain unchanged.
**Validates: Requirements 3.4**

**Property 16: Concurrent booking prevention**
*For any* seat, when two users attempt to select it simultaneously, exactly one request should succeed (seat becomes HOLD) and the other should be rejected.
**Validates: Requirements 3.5, 10.2**

### Payment and Pricing

**Property 17: Price calculation correctness**
*For any* booking, the final price should equal (base_price + time_surcharge) - voucher_discount - round_trip_discount, where time_surcharge is 15% of base_price if departure is after 17:00, otherwise 0.
**Validates: Requirements 4.1**

**Property 18: Valid voucher application**
*For any* valid voucher (within validity period, under usage limit, not previously used by the user), applying it to a booking should reduce the total price by the voucher's discount amount.
**Validates: Requirements 4.2**

**Property 19: QR code uniqueness**
*For any* set of generated tickets, all QR codes should be unique with no duplicates.
**Validates: Requirements 4.4**

**Property 20: Ticket creation updates seat**
*For any* successful ticket creation, the associated seat status should be updated to BOOKED and a booking record should exist in the database.
**Validates: Requirements 4.5**

**Property 21: Email notification on ticket creation**
*For any* created ticket, the email sending function should be invoked with the customer's email address and ticket details.
**Validates: Requirements 4.6**

**Property 22: Payment transaction logging**
*For any* payment transaction (successful or failed), a log entry should be created with transaction details including amount, timestamp, and status.
**Validates: Requirements 10.4**

**Property 23: Transaction rollback on error**
*For any* payment transaction that encounters a database error, all database changes within that transaction should be rolled back, leaving the database in its pre-transaction state.
**Validates: Requirements 10.5**

### Ticket Management

**Property 24: Booking history completeness**
*For any* authenticated user, their booking history should include all bookings they have created, with no missing or extra bookings.
**Validates: Requirements 5.1**

**Property 25: Ticket display completeness**
*For any* ticket, the ticket display should include QR code, trip information, seat number, and booking status.
**Validates: Requirements 5.2**

**Property 26: Cancellation time constraint**
*For any* ticket, cancellation should succeed if requested at least 2 hours before departure (updating status to CANCEL_REQUESTED and releasing the seat), and should be rejected if requested less than 2 hours before departure.
**Validates: Requirements 5.3, 5.4**

**Property 27: Cancellation triggers refund**
*For any* cancelled ticket, the booking status should be updated to cancelled and a refund record should be created with status REQUESTED.
**Validates: Requirements 5.5**

### Ticket Validation (Inspector)

**Property 28: QR validation returns status**
*For any* QR code, scanning it should return the ticket's current status (PAID, USED, EXPIRED, CANCELLED, or INVALID).
**Validates: Requirements 6.1**

**Property 29: Valid ticket marking**
*For any* ticket with PAID status, scanning its QR code should update the ticket status to USED and record the inspector ID and timestamp.
**Validates: Requirements 6.2**

**Property 30: Used ticket idempotency**
*For any* ticket with USED status, scanning its QR code should not change the ticket status and should return a rejection message.
**Validates: Requirements 6.3**

**Property 31: Invalid ticket rejection**
*For any* ticket with EXPIRED or CANCELLED status, scanning its QR code should return a rejection message with the current status.
**Validates: Requirements 6.4**

### Admin - Route and Trip Management

**Property 32: Route creation persistence**
*For any* valid route data (departure station, arrival station, duration), creating a route should result in a saved route record that can be retrieved with matching data.
**Validates: Requirements 7.1**

**Property 33: Trip creation generates seats**
*For any* trip created with a train of capacity N, the system should generate exactly N seat records with AVAILABLE status for that trip.
**Validates: Requirements 7.2**

**Property 34: Trip update persistence**
*For any* trip, updating its information should result in the changes being persisted such that subsequent retrieval returns the updated data.
**Validates: Requirements 7.3**

**Property 35: Trip deletion constraint**
*For any* trip with at least one booking, attempting to delete the trip should be rejected and the trip should remain in the database.
**Validates: Requirements 7.4**

**Property 36: Occupancy rate calculation**
*For any* trip, the displayed occupancy rate should equal (number of BOOKED seats / total seats) × 100.
**Validates: Requirements 7.5**

### Admin - Pricing and Vouchers

**Property 37: Price configuration round-trip**
*For any* route and price configuration, setting the price then retrieving it should return the same price configuration including effective date range.
**Validates: Requirements 8.1**

**Property 38: Voucher creation with unique code**
*For any* voucher data, creating a voucher should generate a unique voucher code that differs from all existing voucher codes.
**Validates: Requirements 8.2**

**Property 39: Usage limit enforcement**
*For any* voucher, when the number of times it has been used equals its usage limit, the voucher should be marked as inactive and subsequent attempts to apply it should be rejected.
**Validates: Requirements 8.3**

**Property 40: Voucher expiry deactivation**
*For any* voucher, when the current date is after the validUntil date, the voucher should be marked as inactive and attempts to apply it should be rejected.
**Validates: Requirements 8.4**

**Property 41: Time-based pricing surcharge**
*For any* trip with departure time after 17:00, the calculated price should include a 15% surcharge on the base price.
**Validates: Requirements 8.5**

### Admin - Reports

**Property 42: Revenue report accuracy**
*For any* date range, the revenue report should show total revenue equal to the sum of all completed payment amounts, tickets sold equal to the count of PAID tickets, and booking count equal to the count of bookings in that date range.
**Validates: Requirements 9.1**

**Property 43: Route performance metrics**
*For any* route, the performance display should show occupancy rate and revenue calculated from all trips on that route.
**Validates: Requirements 9.2**

**Property 44: Report export format**
*For any* report export request, the generated file should be in valid CSV or PDF format and contain all the report data.
**Validates: Requirements 9.3**


## Error Handling

### Error Categories and Handling Strategies

**1. Validation Errors (4xx)**
- Invalid input data (email format, missing required fields)
- Business rule violations (booking expired seats, duplicate email)
- **Strategy**: Return clear error messages to client, log for monitoring
- **Examples**: 
  - 400 Bad Request: Invalid email format
  - 409 Conflict: Email already exists
  - 422 Unprocessable Entity: Seat already booked

**2. Authentication/Authorization Errors (401, 403)**
- Invalid or expired tokens
- Insufficient permissions for role-based actions
- **Strategy**: Reject request, require re-authentication
- **Examples**:
  - 401 Unauthorized: Invalid JWT token
  - 403 Forbidden: Customer attempting admin action

**3. Resource Not Found (404)**
- Trip, booking, or ticket not found
- **Strategy**: Return 404 with descriptive message
- **Examples**: "Trip with ID xyz not found"

**4. Concurrency Errors (409)**
- Double booking attempts
- Seat already held by another user
- **Strategy**: Use database locks, return conflict error with retry suggestion
- **Implementation**: PostgreSQL row-level locking with SELECT FOR UPDATE

**5. Payment Errors (402, 500)**
- Payment gateway failures
- Insufficient funds
- **Strategy**: Rollback transaction, notify user, log for manual review
- **Recovery**: Implement retry mechanism with exponential backoff

**6. System Errors (500)**
- Database connection failures
- Unexpected exceptions
- **Strategy**: Rollback transactions, log error details, return generic error to client
- **Monitoring**: Alert on-call engineer for critical failures

### Transaction Management

**Critical Operations Requiring Transactions:**
1. **Booking Creation**: Reserve seat → Create booking → Process payment → Generate ticket
2. **Ticket Cancellation**: Update ticket status → Release seat → Create refund record
3. **Payment Processing**: Validate payment → Update booking → Generate tickets → Send email

**Rollback Scenarios:**
- Payment gateway returns error → Rollback seat reservation
- Email sending fails → Log error but don't rollback (retry async)
- Database constraint violation → Rollback entire transaction

### Retry and Idempotency

**Idempotent Operations:**
- GET requests (search, view details)
- Ticket validation (scanning same QR multiple times)
- Logout (terminating already-terminated session)

**Non-Idempotent Operations Requiring Safeguards:**
- Payment processing: Use idempotency keys
- Seat selection: Check current status before update
- Voucher application: Verify not already used

## Testing Strategy

### Unit Testing

**Framework**: Jest (Node.js) or equivalent for chosen backend language

**Coverage Areas:**
- **Service Layer**: Business logic for pricing calculation, voucher validation, seat availability
- **Validation Functions**: Input validation, date/time checks, email format
- **Utility Functions**: QR code generation, JWT token creation/validation
- **Data Transformations**: DTO mappings, response formatting

**Example Unit Tests:**
```typescript
describe('PricingService', () => {
  test('calculates time surcharge for trips after 17:00', () => {
    const trip = { departureTime: new Date('2024-01-01T18:00:00'), basePrice: 100 }
    const price = calculatePrice(trip)
    expect(price.timeSurcharge).toBe(15) // 15% of 100
  })
  
  test('applies round trip discount correctly', () => {
    const booking = { trips: [trip1, trip2], isRoundTrip: true, subtotal: 200 }
    const price = calculateFinalPrice(booking)
    expect(price.roundTripDiscount).toBe(20) // 10% of 200
  })
})
```

### Property-Based Testing

**Framework**: fast-check (JavaScript/TypeScript)

**Configuration**: Each property test should run minimum 100 iterations

**Test Annotation Format**: Each property-based test must include a comment:
```typescript
// Feature: train-ticket-system, Property 16: Concurrent booking prevention
```

**Key Properties to Test:**

1. **Seat Booking Concurrency** (Property 16)
   - Generate: Random seat IDs, multiple concurrent user requests
   - Verify: Only one user successfully books the seat

2. **Price Calculation** (Property 17)
   - Generate: Random trips with various departure times, vouchers, round-trip combinations
   - Verify: Final price matches formula

3. **QR Code Uniqueness** (Property 19)
   - Generate: Multiple tickets for same or different trips
   - Verify: All QR codes are unique

4. **Voucher One-Time Usage** (Property 18, 39)
   - Generate: Random users and vouchers
   - Verify: Each user can use each voucher only once

5. **Seat Status Transitions** (Property 13, 14)
   - Generate: Random seat selection and time progression
   - Verify: AVAILABLE → HOLD → AVAILABLE after 10 minutes

6. **Transaction Rollback** (Property 23)
   - Generate: Random booking data with simulated failures
   - Verify: Database state unchanged after rollback

**Example Property Test:**
```typescript
// Feature: train-ticket-system, Property 17: Price calculation correctness
test('price calculation follows formula for all inputs', () => {
  fc.assert(
    fc.property(
      fc.record({
        basePrice: fc.integer({ min: 50000, max: 500000 }),
        departureHour: fc.integer({ min: 0, max: 23 }),
        voucherDiscount: fc.integer({ min: 0, max: 100000 }),
        isRoundTrip: fc.boolean()
      }),
      (data) => {
        const timeSurcharge = data.departureHour >= 17 ? data.basePrice * 0.15 : 0
        const roundTripDiscount = data.isRoundTrip ? (data.basePrice + timeSurcharge) * 0.1 : 0
        const expected = data.basePrice + timeSurcharge - data.voucherDiscount - roundTripDiscount
        
        const result = calculatePrice(data)
        expect(result.finalPrice).toBe(expected)
      }
    ),
    { numRuns: 100 }
  )
})
```

### Integration Testing

**Scope**: Test interactions between components

**Key Integration Tests:**
- Authentication flow: Register → Login → Access protected route
- Booking flow: Search → Select seat → Apply voucher → Payment → Ticket generation
- Cancellation flow: Request cancel → Admin approve → Refund → Seat release
- Inspector flow: Scan QR → Validate → Mark as used

**Tools**: Supertest for API testing, test database with seed data

### End-to-End Testing

**Framework**: Playwright or Cypress for frontend E2E

**Critical User Journeys:**
1. Customer books a ticket successfully
2. Customer cancels a ticket
3. Inspector validates a ticket
4. Admin creates a trip and views reports

**Test Environment**: Staging environment with test payment gateway

### Performance Testing

**Tools**: Artillery or k6 for load testing

**Scenarios:**
- Concurrent seat selection by 100 users for same trip
- Search queries under high load (1000 req/s)
- Payment processing throughput

**Acceptance Criteria:**
- Search response time < 2 seconds (Requirement 2.1)
- QR validation < 1 second (Requirement 6.1)
- 99th percentile response time < 3 seconds for booking creation

## Security Considerations

### Authentication & Authorization

**JWT Token Strategy:**
- Access token: Short-lived (15 minutes), contains user ID and role
- Refresh token: Long-lived (7 days), stored in httpOnly cookie
- Token rotation on refresh

**Role-Based Access Control:**
```typescript
enum Permission {
  // Customer
  SEARCH_TRIPS = 'search:trips',
  CREATE_BOOKING = 'create:booking',
  VIEW_OWN_BOOKINGS = 'view:own_bookings',
  CANCEL_OWN_TICKET = 'cancel:own_ticket',
  
  // Inspector
  VALIDATE_TICKET = 'validate:ticket',
  
  // Admin
  MANAGE_ROUTES = 'manage:routes',
  MANAGE_TRIPS = 'manage:trips',
  MANAGE_PRICING = 'manage:pricing',
  MANAGE_VOUCHERS = 'manage:vouchers',
  APPROVE_REFUNDS = 'approve:refunds',
  VIEW_REPORTS = 'view:reports'
}
```

### Data Protection

**Password Security:**
- Hash algorithm: bcrypt with salt rounds = 12
- Never log or transmit plain text passwords
- Enforce password complexity requirements

**Sensitive Data:**
- Encrypt payment information at rest
- Mask credit card numbers in logs (show only last 4 digits)
- PCI DSS compliance for payment processing

**SQL Injection Prevention:**
- Use parameterized queries exclusively
- ORM with prepared statements (TypeORM, Sequelize)
- Input validation and sanitization

**XSS Prevention:**
- Sanitize user inputs before rendering
- Content Security Policy headers
- HttpOnly and Secure flags on cookies

### API Security

**Rate Limiting:**
- Authentication endpoints: 5 requests per minute per IP
- Search endpoints: 60 requests per minute per user
- Booking endpoints: 10 requests per minute per user

**CORS Configuration:**
- Whitelist allowed origins
- Credentials: true for cookie-based auth

**Request Validation:**
- Validate all inputs against schema (Joi, Zod)
- Reject requests with unexpected fields
- Enforce content-type headers

## Deployment Architecture

### Infrastructure

**Production Environment:**
```
┌─────────────────────────────────────────┐
│         Load Balancer (Nginx)           │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌───────▼────────┐
│  App Server 1  │  │  App Server 2  │
│  (Node.js)     │  │  (Node.js)     │
└───────┬────────┘  └───────┬────────┘
        │                   │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │                   │
┌───────▼────────┐  ┌───────▼────────┐
│  PostgreSQL    │  │  Redis Cache   │
│  (Primary)     │  │  (Session)     │
└───────┬────────┘  └────────────────┘
        │
┌───────▼────────┐
│  PostgreSQL    │
│  (Replica)     │
└────────────────┘
```

**Scaling Strategy:**
- Horizontal scaling: Add more app servers behind load balancer
- Database: Read replicas for reporting queries
- Cache: Redis cluster for high availability

### Monitoring and Observability

**Metrics to Track:**
- Request rate and response times (per endpoint)
- Error rates (4xx, 5xx)
- Database query performance
- Seat booking success/failure rate
- Payment success rate
- Queue depths (if using message queues)

**Logging:**
- Structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG
- Correlation IDs for request tracing
- Centralized logging (ELK stack or CloudWatch)

**Alerting:**
- High error rate (> 5% of requests)
- Slow response times (p99 > 5 seconds)
- Database connection pool exhaustion
- Payment gateway failures

### Backup and Disaster Recovery

**Database Backups:**
- Full backup: Daily at 2 AM
- Incremental backup: Every 6 hours
- Retention: 30 days
- Test restore: Monthly

**Recovery Time Objective (RTO):** 4 hours
**Recovery Point Objective (RPO):** 6 hours

## Future Enhancements

### Phase 2 Features
1. **Mobile App**: Native iOS/Android apps with offline ticket viewing
2. **Multi-language Support**: Vietnamese, English, other languages
3. **Loyalty Program**: Points accumulation and redemption
4. **Dynamic Pricing**: ML-based demand prediction and pricing optimization
5. **Seat Preferences**: Remember user's preferred seat types and positions
6. **Group Booking**: Book multiple seats for groups with single payment
7. **Waiting List**: Auto-notify when seats become available on full trips

### Technical Improvements
1. **Microservices**: Split monolith into services (booking, payment, notification)
2. **Event Sourcing**: Track all state changes for audit and replay
3. **GraphQL API**: More flexible querying for frontend
4. **Real-time Updates**: WebSocket for live seat availability
5. **CDN**: Cache static assets and QR codes
6. **A/B Testing**: Framework for testing pricing strategies and UI changes

## Appendix

### API Endpoint Summary

**Authentication:**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh

**Trips:**
- GET /api/trips/search
- GET /api/trips/:id
- GET /api/trips/:id/seats

**Booking:**
- POST /api/bookings/reserve-seat
- POST /api/bookings
- GET /api/bookings/:id
- GET /api/bookings/history

**Payment:**
- POST /api/payments/initiate
- POST /api/payments/callback
- POST /api/payments/refund

**Tickets:**
- GET /api/tickets/:id
- POST /api/tickets/validate
- POST /api/tickets/:id/cancel

**Admin:**
- POST /api/admin/routes
- POST /api/admin/trips
- PUT /api/admin/trips/:id
- DELETE /api/admin/trips/:id
- POST /api/admin/vouchers
- GET /api/admin/reports/revenue
- GET /api/admin/reports/routes

### Database Indexes

```sql
-- Optimize trip search
CREATE INDEX idx_trips_search ON trips(departure_station, arrival_station, departure_time);

-- Optimize seat availability lookup
CREATE INDEX idx_seat_status_trip ON seat_status(trip_id, status);

-- Fast QR code validation
CREATE UNIQUE INDEX idx_tickets_qr ON tickets(qr_code);

-- Voucher usage enforcement
CREATE UNIQUE INDEX idx_voucher_usage_unique ON voucher_usage(user_id, voucher_id);

-- Booking history queries
CREATE INDEX idx_bookings_user ON bookings(user_id, created_at DESC);

-- Session lookup
CREATE INDEX idx_sessions_token ON sessions(token);
```

### Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.trainticket.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=train_ticket_db
DB_USER=app_user
DB_PASSWORD=secure_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Payment Gateway
PAYMENT_GATEWAY_URL=https://payment.provider.com
PAYMENT_API_KEY=your_api_key
PAYMENT_WEBHOOK_SECRET=webhook_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@trainticket.com
SMTP_PASSWORD=email_password

# Monitoring
SENTRY_DSN=https://sentry.io/project
LOG_LEVEL=info
```
