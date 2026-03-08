# BaiTap4 - Student Management System

## Overview

A student management system with full CRUD (Create, Read, Update, Delete) functionality, built with vanilla JavaScript and localStorage persistence.

## Features Implemented

### Task 3: Student CRUD Module with Validation ✓

- **Create**: Add new students with validation
- **Read**: Display all students in a table
- **Update**: Edit existing student information
- **Delete**: Remove students with confirmation dialog
- **Validation**: Comprehensive input validation for all fields
- **Real-time Updates**: Table updates immediately after operations
- **localStorage Integration**: Data persists across browser sessions

## File Structure

```
BaiTap4/
├── index.html              # Main HTML structure
├── styles.css              # Styling with dark/light theme support
├── app.js                  # Main application logic and UI integration
├── modules/
│   └── student-crud.js     # CRUD operations module
├── test-crud.js            # Test suite for CRUD module
└── README.md               # This file
```

## Student Data Model

```javascript
{
  id: string,           // Unique identifier (auto-generated)
  name: string,         // Student name (required, non-empty)
  class: string,        // Class name (required)
  grade: number,        // Grade 0-10 (required)
  createdAt: timestamp, // Creation timestamp
  updatedAt: timestamp  // Last update timestamp
}
```

## Validation Rules

1. **Name**: Required, must be non-empty string
2. **Class**: Required, must be non-empty string
3. **Grade**: Required, must be a number between 0 and 10

## Usage

### Opening the Application

1. Open `index.html` in a web browser
2. The application will load with an empty student list

### Adding a Student

1. Fill in the form fields (Name, Class, Grade)
2. Click "Add Student" button
3. Student will appear in the table below

### Editing a Student

1. Click "Edit" button next to a student in the table
2. Form will populate with student data
3. Modify the fields as needed
4. Click "Update Student" button

### Deleting a Student

1. Click "Delete" button next to a student
2. Confirm deletion in the modal dialog
3. Student will be removed from the table

### Theme Toggle

- Click the theme toggle button (🌙/☀️) in the header to switch between light and dark modes
- Theme preference is saved to localStorage

## Testing

Run the test suite to verify CRUD functionality:

```bash
node test-crud.js
```

All 25 tests should pass, covering:
- Input validation (valid and invalid cases)
- Add student operations
- Edit student operations
- Delete student operations
- Multiple student management

## Requirements Validated

This implementation satisfies **Requirement 9.1**:

> WHEN implementing student CRUD THEN THE System SHALL validate input data and update table in realtime

### Acceptance Criteria Met:

✓ Input validation for all required fields
✓ Real-time table updates after operations
✓ localStorage integration for data persistence
✓ Confirmation dialog for delete operations
✓ Error handling and user feedback

## Technical Details

- **No external dependencies**: Pure vanilla JavaScript
- **localStorage**: Data persists across browser sessions
- **Responsive design**: Works on desktop and mobile devices
- **Accessibility**: Proper form labels and semantic HTML
- **Error handling**: Comprehensive validation and error messages
- **XSS Protection**: HTML escaping for user input

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Next Steps

According to the implementation plan, the next features to implement are:
- Filter and Sort module (Task 4)
- Import/Export JSON module (Task 5)
- Bulk Actions module (Task 6)
- UX polish module (Task 7)
