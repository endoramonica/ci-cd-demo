# Requirements Document

## Introduction

Dự án này nhằm thực hành Advanced Git Flow trong môi trường làm việc nhóm, bao gồm xử lý xung đột merge, các tình huống Git quan trọng (hotfix, rollback, rebase, cherry-pick, revert, stash), và tạo minh chứng use case thông qua lịch sử commit/MR/review/tag/release. Dự án mở rộng từ BaiTap3 với 2 môi trường: develop (tích hợp tính năng) và main (production ổn định).

## Glossary

- **System**: Hệ thống quản lý sinh viên được phát triển theo Advanced Git Flow
- **MR (Merge Request)**: Yêu cầu merge code từ nhánh này sang nhánh khác
- **Conflict**: Xung đột khi hai nhánh sửa cùng một đoạn code
- **Hotfix**: Sửa lỗi khẩn cấp trên production
- **Release Branch**: Nhánh chuẩn bị cho việc phát hành phiên bản mới
- **Feature Branch**: Nhánh phát triển tính năng mới
- **Protected Branch**: Nhánh được bảo vệ, không cho phép push trực tiếp
- **Back-merge**: Merge ngược từ main về develop sau hotfix/release
- **Cherry-pick**: Chọn một commit cụ thể từ nhánh này sang nhánh khác
- **Revert**: Hoàn tác một commit bằng cách tạo commit mới đảo ngược thay đổi
- **Stash**: Lưu tạm thay đổi chưa commit để chuyển ngữ cảnh

## Requirements

### Requirement 1

**User Story:** Là một thành viên team, tôi muốn thiết lập cấu trúc nhánh Git chuẩn, để đảm bảo quy trình phát triển có tổ chức và an toàn.

#### Acceptance Criteria

1. THE System SHALL maintain a protected main branch for production code
2. THE System SHALL maintain a develop branch for feature integration
3. WHEN creating a new feature THEN THE System SHALL create a feature branch with naming convention `feature/<ten-tinh-nang>`
4. WHEN preparing a release THEN THE System SHALL create a release branch with naming convention `release/<version>`
5. WHEN fixing production bugs THEN THE System SHALL create a hotfix branch with naming convention `hotfix/<ten-loi-khan-cap>`

### Requirement 2

**User Story:** Là một developer, tôi muốn phát triển các tính năng mới theo quy trình chuẩn, để đảm bảo code được review và tích hợp đúng cách.

#### Acceptance Criteria

1. WHEN a developer creates a feature THEN THE System SHALL require the feature to be developed on a separate feature branch
2. WHEN a feature is complete THEN THE System SHALL require a merge request to develop branch
3. WHEN a merge request is created THEN THE System SHALL require at least one code review before merging
4. WHEN merging to develop THEN THE System SHALL prevent direct push to develop branch
5. THE System SHALL enforce commit message convention with prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

### Requirement 3

**User Story:** Là một team member, tôi muốn xử lý xung đột merge một cách an toàn, để không làm mất code của các thành viên khác.

#### Acceptance Criteria

1. WHEN two feature branches modify the same code section THEN THE System SHALL detect and report merge conflicts
2. WHEN a conflict occurs THEN THE System SHALL require manual resolution before allowing merge
3. WHEN resolving conflicts THEN THE System SHALL preserve functionality from both branches
4. WHEN conflicts are resolved THEN THE System SHALL require a commit with clear conflict resolution message
5. WHEN a conflict resolution is complete THEN THE System SHALL allow the merge request to proceed

### Requirement 4

**User Story:** Là một release coordinator, tôi muốn tạo và quản lý release branch, để chuẩn bị phiên bản mới một cách có kiểm soát.

#### Acceptance Criteria

1. WHEN creating a release THEN THE System SHALL create a release branch from develop branch
2. WHEN a bug is found during release testing THEN THE System SHALL allow fixes directly on the release branch
3. WHEN the release is ready THEN THE System SHALL require a merge request from release branch to main branch
4. WHEN release is merged to main THEN THE System SHALL create a version tag following semantic versioning
5. WHEN release is complete THEN THE System SHALL back-merge changes from main to develop branch

### Requirement 5

**User Story:** Là một hotfix owner, tôi muốn sửa lỗi production khẩn cấp, để khôi phục dịch vụ nhanh chóng mà không ảnh hưởng đến develop branch.

#### Acceptance Criteria

1. WHEN a critical production bug is found THEN THE System SHALL create a hotfix branch from main branch
2. WHEN hotfix is complete THEN THE System SHALL require a merge request to main branch
3. WHEN hotfix is merged to main THEN THE System SHALL create a patch version tag
4. WHEN hotfix is merged to main THEN THE System SHALL back-merge the hotfix to develop branch
5. THE System SHALL prioritize hotfix merge requests over feature merge requests

### Requirement 6

**User Story:** Là một developer, tôi muốn sử dụng cherry-pick để di chuyển commit nhầm nhánh, để đảm bảo commit ở đúng vị trí mà không làm rối lịch sử.

#### Acceptance Criteria

1. WHEN a commit is made to wrong branch THEN THE System SHALL allow cherry-picking the commit to correct branch
2. WHEN cherry-picking a commit THEN THE System SHALL preserve the original commit message and changes
3. WHEN cherry-pick is complete THEN THE System SHALL allow reverting the commit from wrong branch
4. THE System SHALL record both original and cherry-picked commit hashes for tracking
5. WHEN cherry-picking THEN THE System SHALL handle conflicts if the target branch has diverged

### Requirement 7

**User Story:** Là một team member, tôi muốn revert commit lỗi một cách an toàn, để hoàn tác thay đổi mà không rewrite history trên shared branch.

#### Acceptance Criteria

1. WHEN a merged feature causes regression THEN THE System SHALL allow creating a revert commit
2. WHEN reverting a commit THEN THE System SHALL create a new commit that undoes the changes
3. WHEN a revert is created THEN THE System SHALL require a merge request and review
4. WHEN reverting THEN THE System SHALL maintain linear history without force push
5. THE System SHALL clearly identify revert commits in commit messages

### Requirement 8

**User Story:** Là một developer, tôi muốn sử dụng stash để lưu tạm thay đổi, để chuyển ngữ cảnh làm việc khẩn cấp mà không mất code đang viết.

#### Acceptance Criteria

1. WHEN switching context urgently THEN THE System SHALL allow stashing uncommitted changes
2. WHEN changes are stashed THEN THE System SHALL preserve all modifications including staged and unstaged files
3. WHEN returning to original context THEN THE System SHALL allow applying stashed changes
4. THE System SHALL maintain a list of all stashed changes with descriptions
5. WHEN applying stash THEN THE System SHALL handle conflicts if the working directory has changed

### Requirement 9

**User Story:** Là một developer, tôi muốn thực hiện các tính năng cụ thể cho ứng dụng quản lý sinh viên, để mở rộng chức năng của hệ thống.

#### Acceptance Criteria

1. WHEN implementing student CRUD THEN THE System SHALL validate input data and update table in realtime
2. WHEN implementing filter and sort THEN THE System SHALL support filtering by class and grade with ascending and descending sort
3. WHEN implementing import/export THEN THE System SHALL validate imported JSON data and export with timestamp
4. WHEN implementing bulk actions THEN THE System SHALL allow selecting multiple students with confirmation dialog
5. WHEN implementing UX polish THEN THE System SHALL display toast notifications and loading states

### Requirement 10

**User Story:** Là một team, chúng tôi muốn tạo báo cáo minh chứng đầy đủ, để chứng minh đã thực hiện đúng quy trình và xử lý các tình huống Git quan trọng.

#### Acceptance Criteria

1. THE System SHALL document all merge requests with links and descriptions
2. THE System SHALL capture screenshots of conflicts and their resolutions
3. THE System SHALL record commit hashes for important operations like cherry-pick and revert
4. THE System SHALL document all version tags and release notes
5. THE System SHALL provide evidence for at least four critical Git use cases: conflict resolution, release management, hotfix workflow, and one advanced operation
