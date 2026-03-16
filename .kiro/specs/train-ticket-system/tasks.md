# Implementation Plan - Hệ thống Bán Vé Tàu Điện

- [ ] 1. Vẽ sơ đồ luồng nghiệp vụ





         - Viết use case bằng code mermaid

- [ ] 2.2 Set up project structure and core infrastructure
  - [ ] 1.2.1 Initialize Node.js project with TypeScript configuration
    - Create package.json with dependencies (Express/NestJS, TypeORM, PostgreSQL driver, Redis client, JWT, bcrypt, qrcode)
    - Configure TypeScript with strict mode
    - Set up ESLint and Prettier
    - _Requirements: All_
  
  - [ ] 2.3 Configure database connection and migrations
    - Set up PostgreSQL connection with TypeORM
    - Create initial migration structure
    - Configure Redis connection for caching and session management
    - _Requirements: 10.2, 10.5_
  
  - [ ] 2.4 Set up testing framework
    - Install Jest and fast-check for property-based testing
    - Configure test environment with test database
    - Create test utilities and helpers
    - _Requirements: All_

- [ ] 2. Implement authentication and user management
  - [ ] 2.1 Create User entity and database schema
    - Define User, UserProfile entities with TypeORM
    - Create migration for users table
    - Add indexes for email lookup
    - _Requirements: 1.1, 1.6_
  
  - [ ]* 2.2 Write property test for password hashing
    - **Property 6: Password hashing**
    - **Validates: Requirements 10.1**
  
  - [ ] 2.3 Implement registration service
    - Create AuthService with register method
    - Hash passwords using bcrypt
    - Validate email uniqueness
    - Generate unique user IDs
    - _Requirements: 1.1, 1.2_
  
  - [ ]* 2.4 Write property test for account creation
    - **Property 1: Account creation with unique identifiers**
    - **Validates: Requirements 1.1**
  
  - [ ] 2.5 Implement login and JWT token generation
    - Create login method with credential validation
    - Generate JWT access and refresh tokens
    - Store session in Redis
    - _Requirements: 1.3, 1.4_
  
  - [ ]* 2.6 Write property tests for authentication
    - **Property 2: Login creates valid session**
    - **Validates: Requirements 1.3**
    - **Property 3: Invalid credentials rejection**
    - **Validates: Requirements 1.4**
  
  - [ ] 2.7 Implement logout and token validation
    - Create logout method to invalidate tokens
    - Implement JWT validation middleware
    - Handle expired and invalid tokens
    - _Requirements: 1.5, 10.3_
  
  - [ ]* 2.8 Write property tests for session management
    - **Property 4: Logout clears session**
    - **Validates: Requirements 1.5**
    - **Property 7: Invalid token rejection**
    - **Validates: Requirements 10.3**
  
  - [ ] 2.9 Implement profile management
    - Create update profile endpoint
    - Validate and persist profile changes
    - _Requirements: 1.6_
  
  - [ ]* 2.10 Write property test for profile updates
    - **Property 5: Profile update round-trip**
    - **Validates: Requirements 1.6**
  
  - [ ] 2.11 Implement role-based access control middleware
    - Create RBAC middleware for Customer, Inspector, Admin roles
    - Define permission checks for each role
    - _Requirements: All admin and inspector features_

- [ ] 3. Implement route and trip management
  - [ ] 3.1 Create Route and Trip entities
    - Define Route entity with stations and duration
    - Define Trip entity with schedule and pricing
    - Create database migrations
    - Add indexes for search optimization
    - _Requirements: 7.1, 7.2_
  
  - [ ] 3.2 Implement route creation (Admin)
    - Create AdminService with createRoute method
    - Validate route data
    - Persist route to database
    - _Requirements: 7.1_
  
  - [ ]* 3.3 Write property test for route creation
    - **Property 32: Route creation persistence**
    - **Validates: Requirements 7.1**
  
  - [ ] 3.4 Implement trip creation with seat generation (Admin)
    - Create trip with validation
    - Generate seat inventory based on train capacity
    - Initialize all seats with AVAILABLE status
    - _Requirements: 7.2_
  
  - [ ]* 3.5 Write property test for trip creation
    - **Property 33: Trip creation generates seats**
    - **Validates: Requirements 7.2**
  
  - [ ] 3.6 Implement trip update and deletion (Admin)
    - Create update trip method
    - Implement deletion with booking constraint check
    - _Requirements: 7.3, 7.4_
  
  - [ ]* 3.7 Write property tests for trip management
    - **Property 34: Trip update persistence**
    - **Validates: Requirements 7.3**
    - **Property 35: Trip deletion constraint**
    - **Validates: Requirements 7.4**

- [ ] 4. Implement trip search functionality
  - [ ] 4.1 Create TripSearchService
    - Implement search by departure/arrival stations and date
    - Add filtering by ticket type and time range
    - Optimize with database indexes
    - Implement Redis caching for popular searches
    - _Requirements: 2.1, 2.3_
  
  - [ ]* 4.2 Write property tests for search
    - **Property 8: Search results match criteria**
    - **Validates: Requirements 2.1**
    - **Property 10: Filter consistency**
    - **Validates: Requirements 2.3**
  
  - [ ] 4.3 Implement trip details and route listing
    - Create getTripDetails method with seat availability
    - Implement getActiveRoutes method
    - Calculate occupancy rate
    - _Requirements: 2.2, 2.5, 7.5_
  
  - [ ]* 4.4 Write property tests for trip display
    - **Property 9: Trip details completeness**
    - **Validates: Requirements 2.2**
    - **Property 11: Active routes only**
    - **Validates: Requirements 2.5**
    - **Property 36: Occupancy rate calculation**
    - **Validates: Requirements 7.5**

- [ ] 5. Implement seat management and booking
  - [ ] 5.1 Create Seat and SeatStatus entities
    - Define SeatMap and Seat entities
    - Define SeatStatus entity with trip association
    - Create migrations with proper indexes
    - _Requirements: 3.1_
  
  - [ ] 5.2 Implement seat map display
    - Create method to get seat map for a trip
    - Show seat status (AVAILABLE, HOLD, BOOKED)
    - _Requirements: 3.1_
  
  - [ ]* 5.3 Write property test for seat map
    - **Property 12: Seat map reflects status**
    - **Validates: Requirements 3.1**
  
  - [ ] 5.4 Implement seat reservation with locking
    - Create selectSeat method with database row-level locking (SELECT FOR UPDATE)
    - Set seat status to HOLD with 10-minute expiry
    - Prevent concurrent booking of same seat
    - _Requirements: 3.2, 3.5, 10.2_
  
  - [ ]* 5.5 Write property tests for seat reservation
    - **Property 13: Available seat reservation**
    - **Validates: Requirements 3.2**
    - **Property 16: Concurrent booking prevention**
    - **Validates: Requirements 3.5, 10.2**
  
  - [ ] 5.6 Implement seat hold expiration mechanism
    - Create background job to release expired holds
    - Update seat status from HOLD to AVAILABLE after 10 minutes
    - _Requirements: 3.3_
  
  - [ ]* 5.7 Write property test for hold expiration
    - **Property 14: Expired reservation release**
    - **Validates: Requirements 3.3**
  
  - [ ] 5.8 Implement occupied seat rejection
    - Validate seat status before selection
    - Return error for HOLD or BOOKED seats
    - _Requirements: 3.4_
  
  - [ ]* 5.9 Write property test for seat rejection
    - **Property 15: Occupied seat rejection**
    - **Validates: Requirements 3.4**

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement pricing and voucher system
  - [ ] 7.1 Create Voucher and VoucherUsage entities
    - Define Voucher entity with discount configuration
    - Define VoucherUsage entity with unique constraint
    - Create migrations
    - _Requirements: 8.2_
  
  - [ ] 7.2 Implement pricing calculation service
    - Create calculatePrice method with formula: (base_price + time_surcharge) - voucher_discount - round_trip_discount
    - Implement time surcharge for trips after 17:00 (15% increase)
    - Implement round trip discount (10% off)
    - _Requirements: 4.1, 8.5_
  
  - [ ]* 7.3 Write property tests for pricing
    - **Property 17: Price calculation correctness**
    - **Validates: Requirements 4.1**
    - **Property 41: Time-based pricing surcharge**
    - **Validates: Requirements 8.5**
  
  - [ ] 7.4 Implement voucher creation (Admin)
    - Create voucher with unique code generation
    - Set discount value, validity period, usage limit
    - _Requirements: 8.2_
  
  - [ ]* 7.5 Write property test for voucher creation
    - **Property 38: Voucher creation with unique code**
    - **Validates: Requirements 8.2**
  
  - [ ] 7.6 Implement voucher application
    - Validate voucher code, expiry, and usage limit
    - Check user hasn't used voucher before
    - Apply discount to booking
    - Record voucher usage
    - _Requirements: 4.2, 4.3_
  
  - [ ]* 7.7 Write property tests for voucher usage
    - **Property 18: Valid voucher application**
    - **Validates: Requirements 4.2**
    - **Property 39: Usage limit enforcement**
    - **Validates: Requirements 8.3**
    - **Property 40: Voucher expiry deactivation**
    - **Validates: Requirements 8.4**
  
  - [ ] 7.8 Implement price configuration (Admin)
    - Create method to set base prices for routes
    - Store price with effective date range
    - _Requirements: 8.1_
  
  - [ ]* 7.9 Write property test for price configuration
    - **Property 37: Price configuration round-trip**
    - **Validates: Requirements 8.1**

- [ ] 8. Implement booking and payment
  - [ ] 8.1 Create Booking and Payment entities
    - Define Booking entity with price breakdown
    - Define Payment entity with transaction details
    - Create migrations
    - _Requirements: 4.1, 4.5_
  
  - [ ] 8.2 Implement booking creation service
    - Create booking with selected seats
    - Calculate total price with all discounts
    - Support round trip bookings
    - _Requirements: 4.1_
  
  - [ ] 8.3 Integrate payment gateway
    - Implement PaymentService with gateway integration
    - Create payment initiation method
    - Handle payment callbacks
    - Implement transaction logging
    - _Requirements: 10.4_
  
  - [ ]* 8.4 Write property test for payment logging
    - **Property 22: Payment transaction logging**
    - **Validates: Requirements 10.4**
  
  - [ ] 8.5 Implement payment processing with transaction management
    - Process payment within database transaction
    - Update booking status on success
    - Rollback on failure
    - Update seat status to BOOKED
    - _Requirements: 4.5, 10.5_
  
  - [ ]* 8.6 Write property tests for booking
    - **Property 20: Ticket creation updates seat**
    - **Validates: Requirements 4.5**
    - **Property 23: Transaction rollback on error**
    - **Validates: Requirements 10.5**

- [ ] 9. Implement ticket generation and management
  - [ ] 9.1 Create Ticket entity
    - Define Ticket entity with QR code and status
    - Create migration with QR code unique index
    - _Requirements: 4.4_
  
  - [ ] 9.2 Implement ticket generation service
    - Generate unique QR code for each ticket
    - Create ticket records with passenger information
    - Link tickets to booking
    - _Requirements: 4.4_
  
  - [ ]* 9.3 Write property test for QR uniqueness
    - **Property 19: QR code uniqueness**
    - **Validates: Requirements 4.4**
  
  - [ ] 9.4 Implement email notification service
    - Create email service with SMTP configuration
    - Send ticket details to customer email
    - Include QR code in email
    - _Requirements: 4.6_
  
  - [ ]* 9.5 Write property test for email notification
    - **Property 21: Email notification on ticket creation**
    - **Validates: Requirements 4.6**
  
  - [ ] 9.6 Implement booking history
    - Create method to get user's booking history
    - Include ticket status and trip details
    - _Requirements: 5.1_
  
  - [ ]* 9.7 Write property test for booking history
    - **Property 24: Booking history completeness**
    - **Validates: Requirements 5.1**
  
  - [ ] 9.8 Implement ticket display
    - Create method to get ticket details
    - Include QR code, trip info, seat number, status
    - _Requirements: 5.2_
  
  - [ ]* 9.9 Write property test for ticket display
    - **Property 25: Ticket display completeness**
    - **Validates: Requirements 5.2**

- [ ] 10. Implement ticket cancellation and refund
  - [ ] 10.1 Create Refund entity
    - Define Refund entity with approval workflow
    - Create migration
    - _Requirements: 5.5_
  
  - [ ] 10.2 Implement ticket cancellation service
    - Validate cancellation time (at least 2 hours before departure)
    - Update ticket status to CANCEL_REQUESTED
    - Release seat back to AVAILABLE
    - Create refund request
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [ ]* 10.3 Write property tests for cancellation
    - **Property 26: Cancellation time constraint**
    - **Validates: Requirements 5.3, 5.4**
    - **Property 27: Cancellation triggers refund**
    - **Validates: Requirements 5.5**
  
  - [ ] 10.4 Implement refund approval (Admin)
    - Create method for admin to approve/reject refunds
    - Process refund through payment gateway
    - Update ticket status to REFUNDED
    - _Requirements: 5.5_

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement ticket validation (Inspector)
  - [ ] 12.1 Implement QR code validation service
    - Create validateTicket method
    - Decode QR code and lookup ticket
    - Return ticket status and details
    - _Requirements: 6.1_
  
  - [ ]* 12.2 Write property test for QR validation
    - **Property 28: QR validation returns status**
    - **Validates: Requirements 6.1**
  
  - [ ] 12.3 Implement ticket usage marking
    - Mark valid unused ticket as USED
    - Record inspector ID and timestamp
    - Display passenger information
    - _Requirements: 6.2_
  
  - [ ]* 12.4 Write property test for ticket marking
    - **Property 29: Valid ticket marking**
    - **Validates: Requirements 6.2**
  
  - [ ] 12.5 Implement used ticket rejection
    - Detect already-used tickets
    - Return rejection message
    - Ensure idempotency (no state change)
    - _Requirements: 6.3_
  
  - [ ]* 12.6 Write property test for used ticket idempotency
    - **Property 30: Used ticket idempotency**
    - **Validates: Requirements 6.3**
  
  - [ ] 12.7 Implement invalid ticket rejection
    - Handle expired and cancelled tickets
    - Handle invalid QR codes
    - Return appropriate error messages
    - _Requirements: 6.4, 6.5_
  
  - [ ]* 12.8 Write property test for invalid ticket rejection
    - **Property 31: Invalid ticket rejection**
    - **Validates: Requirements 6.4**

- [ ] 13. Implement admin reporting
  - [ ] 13.1 Implement revenue report service
    - Calculate total revenue for date range
    - Count tickets sold and bookings
    - _Requirements: 9.1_
  
  - [ ]* 13.2 Write property test for revenue report
    - **Property 42: Revenue report accuracy**
    - **Validates: Requirements 9.1**
  
  - [ ] 13.3 Implement route performance metrics
    - Calculate occupancy rate per route
    - Calculate revenue per route
    - _Requirements: 9.2_
  
  - [ ]* 13.4 Write property test for route performance
    - **Property 43: Route performance metrics**
    - **Validates: Requirements 9.2**
  
  - [ ] 13.5 Implement report export
    - Generate CSV format reports
    - Generate PDF format reports
    - _Requirements: 9.3_
  
  - [ ]* 13.6 Write property test for report export
    - **Property 44: Report export format**
    - **Validates: Requirements 9.3**

- [ ] 14. Implement API endpoints and controllers
  - [ ] 14.1 Create authentication endpoints
    - POST /api/auth/register
    - POST /api/auth/login
    - POST /api/auth/logout
    - POST /api/auth/refresh
    - _Requirements: 1.1, 1.3, 1.5_
  
  - [ ] 14.2 Create trip search endpoints
    - GET /api/trips/search
    - GET /api/trips/:id
    - GET /api/trips/:id/seats
    - GET /api/routes
    - _Requirements: 2.1, 2.2, 2.5_
  
  - [ ] 14.3 Create booking endpoints
    - POST /api/bookings/reserve-seat
    - POST /api/bookings
    - GET /api/bookings/:id
    - GET /api/bookings/history
    - _Requirements: 3.2, 4.1, 5.1_
  
  - [ ] 14.4 Create payment endpoints
    - POST /api/payments/initiate
    - POST /api/payments/callback
    - _Requirements: 4.1, 4.5_
  
  - [ ] 14.5 Create ticket endpoints
    - GET /api/tickets/:id
    - POST /api/tickets/validate (Inspector)
    - POST /api/tickets/:id/cancel
    - _Requirements: 5.2, 5.3, 6.1, 6.2_
  
  - [ ] 14.6 Create admin endpoints
    - POST /api/admin/routes
    - POST /api/admin/trips
    - PUT /api/admin/trips/:id
    - DELETE /api/admin/trips/:id
    - POST /api/admin/vouchers
    - POST /api/admin/pricing
    - POST /api/admin/refunds/:id/approve
    - GET /api/admin/reports/revenue
    - GET /api/admin/reports/routes
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 9.1, 9.2_
  
  - [ ] 14.7 Add request validation middleware
    - Validate request bodies with Joi or Zod
    - Sanitize inputs to prevent injection
    - _Requirements: 10.1, 10.3_
  
  - [ ] 14.8 Add error handling middleware
    - Catch and format errors
    - Return appropriate HTTP status codes
    - Log errors for monitoring
    - _Requirements: All_

- [ ] 15. Implement security features
  - [ ] 15.1 Add rate limiting
    - Configure rate limits per endpoint type
    - Use Redis for distributed rate limiting
    - _Requirements: 10.3_
  
  - [ ] 15.2 Configure CORS
    - Set allowed origins
    - Enable credentials for cookies
    - _Requirements: 10.3_
  
  - [ ] 15.3 Add security headers
    - Implement helmet.js for security headers
    - Configure Content Security Policy
    - Set HttpOnly and Secure flags on cookies
    - _Requirements: 10.1, 10.3_

- [ ] 16. Create frontend application
  - [ ] 16.1 Set up React/Vue project
    - Initialize frontend project with TypeScript
    - Configure routing
    - Set up state management (Redux/Vuex/Pinia)
    - _Requirements: All_
  
  - [ ] 16.2 Implement authentication UI
    - Create registration form
    - Create login form
    - Implement token storage and refresh
    - _Requirements: 1.1, 1.3, 1.5_
  
  - [ ] 16.3 Implement trip search UI
    - Create search form with station and date pickers
    - Display search results with filters
    - Show trip details
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 16.4 Implement seat selection UI
    - Display interactive seat map
    - Show seat status with color coding
    - Handle seat selection and hold timer
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 16.5 Implement booking and payment UI
    - Create booking summary with price breakdown
    - Add voucher input field
    - Integrate payment gateway UI
    - _Requirements: 4.1, 4.2_
  
  - [ ] 16.6 Implement ticket display UI
    - Show ticket details with QR code
    - Display booking history
    - Add cancel ticket functionality
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 16.7 Implement Inspector UI
    - Create QR code scanner interface
    - Display validation results
    - Show passenger information
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ] 16.8 Implement Admin UI
    - Create route and trip management forms
    - Create voucher management interface
    - Create pricing configuration UI
    - Display reports and analytics
    - _Requirements: 7.1, 7.2, 8.1, 8.2, 9.1, 9.2_

- [ ] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Documentation and deployment preparation
  - [ ] 18.1 Write API documentation
    - Document all endpoints with request/response examples
    - Create Swagger/OpenAPI specification
    - _Requirements: All_
  
  - [ ] 18.2 Create deployment configuration
    - Write Dockerfile for containerization
    - Create docker-compose for local development
    - Configure environment variables
    - _Requirements: All_
  
  - [ ] 18.3 Set up database migrations
    - Ensure all migrations are production-ready
    - Create seed data for testing
    - _Requirements: All_
  
  - [ ] 18.4 Configure monitoring and logging
    - Set up structured logging
    - Configure error tracking (Sentry or similar)
    - Add performance monitoring
    - _Requirements: 10.4_
