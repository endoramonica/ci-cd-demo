# Design Document

## Overview

Dự án này thực hiện Advanced Git Flow cho ứng dụng quản lý sinh viên, bao gồm:
- Cấu trúc nhánh chuẩn (main, develop, feature, release, hotfix)
- Quy trình xử lý xung đột merge
- Các thao tác Git nâng cao (cherry-pick, revert, stash)
- Phát triển 8 tính năng mới cho ứng dụng
- Tạo báo cáo minh chứng đầy đủ

Dự án được thiết kế để team 4 người thực hành quy trình làm việc nhóm chuyên nghiệp với Git.

## Architecture

### Branch Structure

```
main (protected)
├── hotfix/fix-critical-validation
└── release/1.1.0
    └── develop
        ├── feature/student-crud
        ├── feature/filter-sort
        ├── feature/import-export
        ├── feature/bulk-actions
        ├── feature/ux-polish
        ├── feature/keyboard-shortcuts
        ├── feature/a11y-pass
        └── feature/smoke-test
```

### Workflow Flow

1. **Feature Development**: feature/* → develop (via MR + review)
2. **Release Preparation**: develop → release/* → main (via MR + tag)
3. **Hotfix**: main → hotfix/* → main → develop (via MR + tag + back-merge)
4. **Conflict Resolution**: Rebase feature branch with develop, resolve conflicts, continue MR

### Technology Stack

- **Version Control**: Git
- **Repository Hosting**: GitLab/GitHub (with MR/PR support)
- **Frontend**: HTML, CSS, JavaScript (từ BaiTap3)
- **Storage**: localStorage
- **Testing**: Manual testing + validation scripts

## Components and Interfaces

### 1. Git Workflow Scripts

**Branch Validation Script** (`scripts/validate-branch.sh`)
- Input: Branch name
- Output: Boolean (valid/invalid)
- Purpose: Kiểm tra tên nhánh có đúng convention không

**Commit Message Validator** (`scripts/validate-commit.sh`)
- Input: Commit message
- Output: Boolean (valid/invalid)
- Purpose: Kiểm tra commit message có đúng format không

**Tag Validator** (`scripts/validate-tag.sh`)
- Input: Tag name
- Output: Boolean (valid/invalid)
- Purpose: Kiểm tra tag có đúng semantic versioning không

### 2. Student Management Features

**Student CRUD Module** (`BaiTap4/modules/student-crud.js`)
- Functions: `addStudent()`, `editStudent()`, `deleteStudent()`, `validateStudent()`
- Purpose: Quản lý CRUD operations với validation

**Filter and Sort Module** (`BaiTap4/modules/filter-sort.js`)
- Functions: `filterByClass()`, `filterByGrade()`, `sortByName()`, `sortByGrade()`
- Purpose: Lọc và sắp xếp danh sách sinh viên

**Import/Export Module** (`BaiTap4/modules/import-export.js`)
- Functions: `importJSON()`, `exportJSON()`, `validateImportData()`
- Purpose: Import/export dữ liệu JSON

**Bulk Actions Module** (`BaiTap4/modules/bulk-actions.js`)
- Functions: `selectMultiple()`, `bulkDelete()`, `confirmAction()`
- Purpose: Thao tác hàng loạt trên nhiều sinh viên

**UX Module** (`BaiTap4/modules/ux.js`)
- Functions: `showToast()`, `showLoading()`, `hideLoading()`
- Purpose: Cải thiện trải nghiệm người dùng

### 3. Documentation Components

**Report Generator** (`BaiTap4/REPORT.md`)
- Sections: Team members, MR list, Use case evidence, Lessons learned
- Purpose: Tạo báo cáo minh chứng

**Guide Documents**
- `CONFLICT_GUIDE.md`: Hướng dẫn xử lý conflict
- `REBASE_GUIDE.md`: Hướng dẫn sử dụng rebase
- `CRITICAL_GIT_CASES.md`: Hướng dẫn các tình huống Git quan trọng

## Data Models

### Student Model

```javascript
{
  id: string,           // Unique identifier
  name: string,         // Student name (required, non-empty)
  class: string,        // Class name (required)
  grade: number,        // Grade (0-10, required)
  createdAt: timestamp, // Creation timestamp
  updatedAt: timestamp  // Last update timestamp
}
```

### Git Operation Record

```javascript
{
  type: string,         // 'merge', 'cherry-pick', 'revert', 'hotfix', 'release'
  commitHash: string,   // Commit hash
  sourceBranch: string, // Source branch
  targetBranch: string, // Target branch
  timestamp: timestamp, // Operation timestamp
  description: string,  // Operation description
  evidence: {           // Evidence for report
    mrLink: string,
    screenshot: string,
    result: string
  }
}
```

### Merge Request Model

```javascript
{
  id: string,           // MR identifier
  title: string,        // MR title
  sourceBranch: string, // Source branch
  targetBranch: string, // Target branch
  author: string,       // Author name
  reviewer: string,     // Reviewer name
  status: string,       // 'open', 'merged', 'closed'
  hasConflict: boolean, // Conflict status
  commits: string[],    // List of commit hashes
  createdAt: timestamp,
  mergedAt: timestamp
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Commit message convention compliance

*For any* commit in the repository, the commit message should start with one of the valid prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, or `chore:`

**Validates: Requirements 2.5**

### Property 2: Semantic versioning compliance

*For any* version tag created in the repository, the tag name should follow semantic versioning format `vMAJOR.MINOR.PATCH` where MAJOR, MINOR, and PATCH are non-negative integers

**Validates: Requirements 4.4**

### Property 3: Stash preservation round-trip

*For any* set of uncommitted changes, stashing and then applying the stash should restore all modifications to their original state

**Validates: Requirements 8.2**

### Property 4: Student data validation

*For any* student data input, the validation function should reject invalid data (empty name, invalid grade range, missing required fields) and accept valid data

**Validates: Requirements 9.1**

### Property 5: Filter and sort correctness

*For any* list of students and filter criteria (class or grade), all returned students should match the filter criteria, and when sorted, the list should be in the specified order (ascending or descending)

**Validates: Requirements 9.2**

### Property 6: Import/Export round-trip

*For any* valid student data array, exporting to JSON and then importing should preserve all student data, and the exported JSON should contain a timestamp field

**Validates: Requirements 9.3**

### Property 7: Bulk action selection consistency

*For any* set of selected students, performing a bulk action should affect exactly those students and no others, and should display a confirmation dialog before execution

**Validates: Requirements 9.4**

### Property 8: UX feedback visibility

*For any* user action that triggers a state change, the system should display appropriate feedback (toast notification for completion, loading state during processing)

**Validates: Requirements 9.5**

## Error Handling

### Git Operation Errors

1. **Merge Conflicts**
   - Detection: Git automatically detects conflicts
   - Resolution: Manual resolution required with clear commit message
   - Validation: Run tests after resolution to ensure no functionality lost

2. **Invalid Branch Names**
   - Detection: Validation script checks naming convention
   - Response: Reject branch creation with error message
   - Recovery: Provide correct naming format example

3. **Failed Cherry-pick**
   - Detection: Git reports cherry-pick conflict
   - Resolution: Manual conflict resolution
   - Fallback: Abort cherry-pick and try alternative approach

4. **Revert Conflicts**
   - Detection: Git reports revert conflict
   - Resolution: Manual conflict resolution
   - Validation: Ensure reverted changes are properly undone

### Application Errors

1. **Invalid Student Data**
   - Detection: Validation function checks all required fields
   - Response: Display error toast with specific validation message
   - Recovery: Keep form data, highlight invalid fields

2. **Import Data Validation Failure**
   - Detection: JSON parsing or schema validation fails
   - Response: Display error toast with line number and issue
   - Recovery: Allow user to fix JSON and retry

3. **localStorage Quota Exceeded**
   - Detection: Catch QuotaExceededError
   - Response: Display warning toast
   - Recovery: Suggest exporting data and clearing old entries

4. **Bulk Action Cancellation**
   - Detection: User clicks "Cancel" in confirmation dialog
   - Response: Abort operation, no changes made
   - Recovery: Return to normal state

## Testing Strategy

### Unit Testing

Unit tests verify specific examples and edge cases:

1. **Validation Functions**
   - Test valid student data is accepted
   - Test invalid data (empty name, grade out of range) is rejected
   - Test edge cases (boundary values, special characters)

2. **Filter and Sort Functions**
   - Test filtering with specific class returns correct students
   - Test sorting produces correct order
   - Test empty list handling

3. **Import/Export Functions**
   - Test valid JSON import succeeds
   - Test invalid JSON import fails gracefully
   - Test export includes timestamp

4. **UX Functions**
   - Test toast displays with correct message
   - Test loading state shows and hides correctly

### Property-Based Testing

Property-based tests verify universal properties across all inputs. We will use **fast-check** library for JavaScript property-based testing.

Configuration: Each property test should run minimum 100 iterations.

Tagging format: Each test must include comment: `**Feature: advanced-git-flow-practice, Property {number}: {property_text}**`

1. **Property 1: Commit message convention**
   - Generate random commit messages
   - Validate each against convention
   - Ensure only valid prefixes pass

2. **Property 2: Semantic versioning**
   - Generate random version tags
   - Validate format vX.Y.Z
   - Ensure non-negative integers

3. **Property 3: Stash round-trip**
   - Generate random file changes
   - Stash and apply
   - Verify all changes preserved

4. **Property 4: Student validation**
   - Generate random student data (valid and invalid)
   - Run validation
   - Ensure correct accept/reject decisions

5. **Property 5: Filter and sort**
   - Generate random student lists
   - Apply random filter and sort
   - Verify all results match criteria and order

6. **Property 6: Import/Export round-trip**
   - Generate random student arrays
   - Export then import
   - Verify data preservation and timestamp presence

7. **Property 7: Bulk action consistency**
   - Generate random student selections
   - Perform bulk action
   - Verify only selected students affected

8. **Property 8: UX feedback**
   - Generate random user actions
   - Trigger state changes
   - Verify toast/loading appears

### Integration Testing

1. **Complete Feature Workflow**
   - Test full CRUD cycle: add → edit → delete
   - Test filter → sort → export workflow
   - Test import → validate → display workflow

2. **Git Workflow Validation**
   - Test feature branch → MR → merge to develop
   - Test release branch → tag → merge to main
   - Test hotfix → main → back-merge to develop

### Manual Testing Checklist

1. **Conflict Resolution**
   - Create intentional conflict
   - Resolve manually
   - Verify both features work

2. **Release Process**
   - Create release branch
   - Fix bug on release
   - Merge to main with tag
   - Back-merge to develop

3. **Hotfix Process**
   - Create hotfix from main
   - Fix critical bug
   - Merge to main with patch tag
   - Back-merge to develop

4. **Cherry-pick Operation**
   - Commit to wrong branch
   - Cherry-pick to correct branch
   - Verify commit in both places

5. **Revert Operation**
   - Merge feature causing regression
   - Create revert commit
   - Verify changes undone

6. **Stash Operation**
   - Make uncommitted changes
   - Stash changes
   - Switch context
   - Apply stash
   - Verify changes restored

## Implementation Phases

### Phase 1: Setup and Infrastructure
- Initialize branch structure
- Configure branch protection
- Create validation scripts
- Set up documentation templates

### Phase 2: Core Features Development
- Implement Student CRUD with validation
- Implement Filter and Sort
- Implement Import/Export
- Implement Bulk Actions

### Phase 3: UX Enhancements
- Implement toast notifications
- Implement loading states
- Implement keyboard shortcuts
- Implement accessibility improvements

### Phase 4: Git Workflow Practice
- Execute feature development with MRs
- Practice conflict resolution
- Execute release process
- Execute hotfix process
- Practice advanced Git operations

### Phase 5: Documentation and Evidence
- Capture screenshots and logs
- Document all MRs and operations
- Create comprehensive report
- Review and finalize documentation

## Security Considerations

1. **Input Validation**: All user input must be validated before processing
2. **XSS Prevention**: Sanitize all data before rendering to DOM
3. **localStorage Security**: Don't store sensitive information
4. **Git Credentials**: Never commit credentials or API keys

## Performance Considerations

1. **localStorage Limits**: Monitor storage usage, implement cleanup
2. **Large Dataset Handling**: Implement pagination for large student lists
3. **Filter Performance**: Use efficient algorithms for filtering and sorting
4. **DOM Updates**: Batch DOM updates to minimize reflows

## Accessibility Considerations

1. **Keyboard Navigation**: All features accessible via keyboard
2. **Screen Reader Support**: Proper ARIA labels and roles
3. **Color Contrast**: Meet WCAG AA standards
4. **Focus Management**: Clear focus indicators and logical tab order
