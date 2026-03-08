/**
 * Bulk Actions Module
 * Handles bulk operations on multiple students
 * Requirements: 9.4
 */

// State for bulk actions
let bulkState = {
    selectedIds: new Set(),
    isSelectAllMode: false
};

/**
 * Initialize bulk actions UI
 * Adds checkboxes to table and bulk action controls
 */
function initBulkActions() {
    // Add select all checkbox to table header
    const tableHeader = document.querySelector('.students-table thead tr');
    if (tableHeader && !document.getElementById('selectAllCheckbox')) {
        const selectAllTh = document.createElement('th');
        selectAllTh.innerHTML = '<input type="checkbox" id="selectAllCheckbox" aria-label="Select all students">';
        tableHeader.insertBefore(selectAllTh, tableHeader.firstChild);
    }

    // Add bulk actions toolbar if not exists
    if (!document.getElementById('bulkActionsToolbar')) {
        const tableSection = document.querySelector('.table-section');
        const tableHeader = document.querySelector('.table-header');

        const toolbar = document.createElement('div');
        toolbar.id = 'bulkActionsToolbar';
        toolbar.className = 'bulk-actions-toolbar hidden';
        toolbar.innerHTML = `
            <div class="bulk-actions-info">
                <span id="selectedCount">0</span> student(s) selected
            </div>
            <div class="bulk-actions-buttons">
                <button class="btn btn-secondary" id="deselectAllBtn">Deselect All</button>
                <button class="btn btn-danger" id="bulkDeleteBtn">Delete Selected</button>
            </div>
        `;

        tableSection.insertBefore(toolbar, tableHeader.nextSibling);
    }

    // Attach event listeners
    attachBulkEventListeners();
}

/**
 * Attach event listeners for bulk actions
 */
function attachBulkEventListeners() {
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAll);
    }

    // Deselect all button
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    if (deselectAllBtn) {
        deselectAllBtn.addEventListener('click', handleDeselectAll);
    }

    // Bulk delete button
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', handleBulkDeleteRequest);
    }
}

/**
 * Add checkboxes to table rows
 * Should be called after table is rendered
 */
function addCheckboxesToRows() {
    const rows = document.querySelectorAll('.students-table tbody tr');

    rows.forEach(row => {
        const studentId = row.dataset.id;

        // Check if checkbox already exists
        if (!row.querySelector('.student-checkbox')) {
            const checkboxTd = document.createElement('td');
            checkboxTd.innerHTML = `<input type="checkbox" class="student-checkbox" data-id="${studentId}" aria-label="Select student">`;
            row.insertBefore(checkboxTd, row.firstChild);

            // Attach event listener
            const checkbox = checkboxTd.querySelector('.student-checkbox');
            checkbox.addEventListener('change', handleStudentCheckboxChange);

            // Restore checked state if previously selected
            if (bulkState.selectedIds.has(studentId)) {
                checkbox.checked = true;
            }
        }
    });
}

/**
 * Handle select all checkbox change
 * @param {Event} e - Change event
 */
function handleSelectAll(e) {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll('.student-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        const studentId = checkbox.dataset.id;

        if (isChecked) {
            bulkState.selectedIds.add(studentId);
        } else {
            bulkState.selectedIds.delete(studentId);
        }
    });

    bulkState.isSelectAllMode = isChecked;
    updateBulkActionsUI();
}

/**
 * Handle individual student checkbox change
 * @param {Event} e - Change event
 */
function handleStudentCheckboxChange(e) {
    const studentId = e.target.dataset.id;
    const isChecked = e.target.checked;

    if (isChecked) {
        bulkState.selectedIds.add(studentId);
    } else {
        bulkState.selectedIds.delete(studentId);
        bulkState.isSelectAllMode = false;

        // Uncheck select all if it was checked
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
        }
    }

    updateBulkActionsUI();
    updateSelectAllCheckboxState();
}

/**
 * Handle deselect all button click
 */
function handleDeselectAll() {
    bulkState.selectedIds.clear();
    bulkState.isSelectAllMode = false;

    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
    }

    updateBulkActionsUI();
}

/**
 * Handle bulk delete request
 * Shows confirmation modal
 */
function handleBulkDeleteRequest() {
    const count = bulkState.selectedIds.size;

    if (count === 0) {
        return;
    }

    // Show confirmation modal
    showBulkConfirmModal(
        `Are you sure you want to delete ${count} student(s)?`,
        'This action cannot be undone.',
        confirmBulkDelete
    );
}

/**
 * Confirm and execute bulk delete
 */
function confirmBulkDelete() {
    const idsToDelete = Array.from(bulkState.selectedIds);
    const students = getStudents();

    // Filter out selected students
    const remainingStudents = students.filter(student => !idsToDelete.includes(student.id));

    // Save updated list
    try {
        localStorage.setItem('students', JSON.stringify(remainingStudents));

        // Clear selection
        bulkState.selectedIds.clear();
        bulkState.isSelectAllMode = false;

        // Re-render table
        if (typeof renderStudentsTable === 'function') {
            renderStudentsTable();
        }

        // Re-initialize bulk actions
        initBulkActions();
        addCheckboxesToRows();
        updateBulkActionsUI();

        // Close modal
        closeBulkConfirmModal();
    } catch (error) {
        console.error('Error deleting students:', error);
        alert('Failed to delete students. Please try again.');
    }
}

/**
 * Update bulk actions UI based on selection state
 */
function updateBulkActionsUI() {
    const toolbar = document.getElementById('bulkActionsToolbar');
    const selectedCountSpan = document.getElementById('selectedCount');
    const count = bulkState.selectedIds.size;

    if (toolbar) {
        if (count > 0) {
            toolbar.classList.remove('hidden');
        } else {
            toolbar.classList.add('hidden');
        }
    }

    if (selectedCountSpan) {
        selectedCountSpan.textContent = count;
    }
}

/**
 * Update select all checkbox state based on individual selections
 */
function updateSelectAllCheckboxState() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const checkboxes = document.querySelectorAll('.student-checkbox');

    if (selectAllCheckbox && checkboxes.length > 0) {
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        const someChecked = Array.from(checkboxes).some(cb => cb.checked);

        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }
}

/**
 * Show bulk confirmation modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {Function} onConfirm - Callback for confirmation
 */
function showBulkConfirmModal(title, message, onConfirm) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('bulkConfirmModal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'bulkConfirmModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3 id="bulkConfirmTitle">Confirm Action</h3>
                <p id="bulkConfirmMessage">Are you sure?</p>
                <div class="modal-actions">
                    <button class="btn btn-danger" id="bulkConfirmBtn">Confirm</button>
                    <button class="btn btn-secondary" id="bulkCancelBtn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Attach event listeners
        document.getElementById('bulkConfirmBtn').addEventListener('click', () => {
            if (modal.dataset.onConfirm) {
                const callback = window[modal.dataset.onConfirm];
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });

        document.getElementById('bulkCancelBtn').addEventListener('click', closeBulkConfirmModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBulkConfirmModal();
            }
        });
    }

    // Update modal content
    document.getElementById('bulkConfirmTitle').textContent = title;
    document.getElementById('bulkConfirmMessage').textContent = message;

    // Store callback
    window.bulkConfirmCallback = onConfirm;
    modal.dataset.onConfirm = 'bulkConfirmCallback';

    // Show modal
    modal.classList.remove('hidden');
}

/**
 * Close bulk confirmation modal
 */
function closeBulkConfirmModal() {
    const modal = document.getElementById('bulkConfirmModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Get count of selected students
 * @returns {number} - Number of selected students
 */
function getSelectedCount() {
    return bulkState.selectedIds.size;
}

/**
 * Get array of selected student IDs
 * @returns {Array<string>} - Array of selected student IDs
 */
function getSelectedIds() {
    return Array.from(bulkState.selectedIds);
}

/**
 * Clear all selections
 */
function clearSelections() {
    handleDeselectAll();
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initBulkActions,
        addCheckboxesToRows,
        getSelectedCount,
        getSelectedIds,
        clearSelections,
        handleBulkDeleteRequest
    };
}
