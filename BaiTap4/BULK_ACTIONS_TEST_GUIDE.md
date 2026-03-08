# Bulk Actions Manual Testing Guide

This guide provides step-by-step instructions to manually test the Bulk Actions feature.

## Prerequisites
- Open `BaiTap4/index.html` in a web browser
- Add at least 3-5 students to the system

## Test Cases

### Test Case 1: Select All Functionality
**Steps:**
1. Open the application with multiple students in the table
2. Locate the checkbox in the table header (first column)
3. Click the "Select All" checkbox

**Expected Results:**
- All student checkboxes should be checked
- Bulk actions toolbar should appear below the table header
- Selected count should show the total number of students
- Toolbar should display: "X student(s) selected"

### Test Case 2: Individual Selection
**Steps:**
1. Uncheck all students (if any are selected)
2. Click individual checkboxes for 2-3 students

**Expected Results:**
- Only the clicked checkboxes should be checked
- Bulk actions toolbar should appear
- Selected count should match the number of checked students
- Select All checkbox should show indeterminate state (if not all selected)

### Test Case 3: Deselect All Button
**Steps:**
1. Select multiple students (using Select All or individual selection)
2. Click the "Deselect All" button in the bulk actions toolbar

**Expected Results:**
- All checkboxes should be unchecked
- Bulk actions toolbar should disappear
- Select All checkbox should be unchecked

### Test Case 4: Bulk Delete with Confirmation
**Steps:**
1. Select 2-3 students using checkboxes
2. Click the "Delete Selected" button in the bulk actions toolbar
3. Observe the confirmation modal

**Expected Results:**
- Confirmation modal should appear
- Modal should display: "Are you sure you want to delete X student(s)?"
- Modal should have "Confirm" and "Cancel" buttons

### Test Case 5: Confirm Bulk Delete
**Steps:**
1. Select 2-3 students
2. Click "Delete Selected"
3. Click "Confirm" in the modal

**Expected Results:**
- Selected students should be removed from the table
- Table should update to show remaining students
- Bulk actions toolbar should disappear
- Student count should be updated
- Checkboxes should be cleared

### Test Case 6: Cancel Bulk Delete
**Steps:**
1. Select 2-3 students
2. Click "Delete Selected"
3. Click "Cancel" in the modal

**Expected Results:**
- Modal should close
- No students should be deleted
- Selected students should remain checked
- Bulk actions toolbar should still be visible

### Test Case 7: Delete All Students
**Steps:**
1. Click "Select All" checkbox
2. Click "Delete Selected"
3. Click "Confirm"

**Expected Results:**
- All students should be deleted
- Empty state message should appear: "No students found. Add your first student!"
- Bulk actions toolbar should disappear
- Student count should show "Total: 0"

### Test Case 8: Uncheck Select All
**Steps:**
1. Click "Select All" to select all students
2. Click "Select All" again to uncheck

**Expected Results:**
- All student checkboxes should be unchecked
- Bulk actions toolbar should disappear
- Selected count should be 0

### Test Case 9: Partial Selection and Select All
**Steps:**
1. Manually select 2 out of 5 students
2. Click "Select All" checkbox

**Expected Results:**
- All students should now be selected
- Bulk actions toolbar should update to show total count

### Test Case 10: Uncheck One After Select All
**Steps:**
1. Click "Select All" to select all students
2. Uncheck one individual student checkbox

**Expected Results:**
- Select All checkbox should become unchecked or show indeterminate state
- Bulk actions toolbar should remain visible
- Selected count should decrease by 1

### Test Case 11: Responsive Design (Mobile)
**Steps:**
1. Resize browser window to mobile size (< 768px width)
2. Select multiple students
3. Observe bulk actions toolbar

**Expected Results:**
- Bulk actions toolbar should stack vertically
- Buttons should be full width
- All functionality should work correctly

### Test Case 12: Keyboard Accessibility
**Steps:**
1. Use Tab key to navigate to checkboxes
2. Use Space key to toggle checkboxes
3. Tab to "Delete Selected" button
4. Press Enter to activate

**Expected Results:**
- All checkboxes should be keyboard accessible
- Focus indicators should be visible
- Space key should toggle checkboxes
- Enter key should activate buttons

### Test Case 13: Empty Selection Delete Attempt
**Steps:**
1. Ensure no students are selected
2. Try to click "Delete Selected" button (if visible)

**Expected Results:**
- If no students are selected, toolbar should be hidden
- Delete button should not be accessible

### Test Case 14: Persistence After Add/Edit
**Steps:**
1. Select 2 students
2. Add a new student
3. Observe the table

**Expected Results:**
- Previously selected students should remain selected
- New student should not be selected
- Bulk actions toolbar should still show correct count

## Validation Checklist

- [ ] Select All checkbox works correctly
- [ ] Individual checkboxes work correctly
- [ ] Bulk actions toolbar appears/disappears appropriately
- [ ] Selected count is accurate
- [ ] Deselect All button works
- [ ] Delete Selected button shows confirmation modal
- [ ] Confirmation modal has correct message
- [ ] Confirm button deletes selected students
- [ ] Cancel button closes modal without deleting
- [ ] Table updates correctly after bulk delete
- [ ] Empty state appears when all students deleted
- [ ] Checkboxes are keyboard accessible
- [ ] Responsive design works on mobile
- [ ] ARIA labels are present for accessibility

## Known Limitations

- Bulk actions toolbar is hidden when there are no students
- Selection state is cleared after bulk delete operation
- Indeterminate checkbox state may not be visible in all browsers

## Requirements Validated

This feature validates **Requirement 9.4**:
- ✓ Selecting multiple students with checkbox UI
- ✓ Bulk delete with confirmation dialog
- ✓ Confirmation modal implementation
- ✓ Select all / deselect all functionality
- ✓ UI shows selected count
