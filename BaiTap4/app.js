/**
 * Main Application File
 * Integrates Student CRUD module with UI
 */

// State
let state = {
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    editingStudentId: null,
    deleteStudentId: null
};

// DOM Elements
const app = document.getElementById('app');
const themeToggle = document.getElementById('themeToggle');
const studentForm = document.getElementById('studentForm');
const formTitle = document.getElementById('formTitle');
const studentIdInput = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const studentClassInput = document.getElementById('studentClass');
const studentGradeInput = document.getElementById('studentGrade');
const formErrors = document.getElementById('formErrors');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const studentsTableBody = document.getElementById('studentsTableBody');
const studentCount = document.getElementById('studentCount');
const emptyState = document.getElementById('emptyState');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

// Initialize
function init() {
    applyTheme();
    initBulkActions(); // Initialize bulk actions UI
    renderStudentsTable();
    attachEventListeners();
}

// Theme Management
function applyTheme() {
    if (state.isDarkMode) {
        app.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        app.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    localStorage.setItem('darkMode', state.isDarkMode);
    applyTheme();
}

// Form Management
function showFormErrors(errors) {
    formErrors.innerHTML = '<ul>' + errors.map(err => `<li>${err}</li>`).join('') + '</ul>';
    formErrors.classList.add('show');
}

function hideFormErrors() {
    formErrors.innerHTML = '';
    formErrors.classList.remove('show');
}

function resetForm() {
    studentForm.reset();
    studentIdInput.value = '';
    state.editingStudentId = null;
    formTitle.textContent = 'Add New Student';
    submitBtn.textContent = 'Add Student';
    hideFormErrors();
}

function populateFormForEdit(student) {
    studentIdInput.value = student.id;
    studentNameInput.value = student.name;
    studentClassInput.value = student.class;
    studentGradeInput.value = student.grade;
    state.editingStudentId = student.id;
    formTitle.textContent = 'Edit Student';
    submitBtn.textContent = 'Update Student';
    hideFormErrors();

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Table Rendering
function renderStudentsTable() {
    const students = getStudents();

    // Update count
    studentCount.textContent = `Total: ${students.length}`;

    // Show/hide empty state
    if (students.length === 0) {
        emptyState.classList.add('show');
        studentsTableBody.innerHTML = '';

        // Hide bulk actions toolbar when no students
        const toolbar = document.getElementById('bulkActionsToolbar');
        if (toolbar) {
            toolbar.classList.add('hidden');
        }

        return;
    } else {
        emptyState.classList.remove('show');
    }

    // Render table rows
    studentsTableBody.innerHTML = students.map(student => `
        <tr data-id="${student.id}">
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.class)}</td>
            <td>${student.grade.toFixed(1)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-success edit-btn" data-id="${student.id}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${student.id}">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    // Attach event listeners to action buttons
    attachTableEventListeners();

    // Add checkboxes for bulk actions
    addCheckboxesToRows();
}

function attachTableEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteRequest);
    });
}

// Event Handlers
function handleSubmit(e) {
    e.preventDefault();
    hideFormErrors();

    const studentData = {
        name: studentNameInput.value,
        class: studentClassInput.value,
        grade: studentGradeInput.value
    };

    let result;

    if (state.editingStudentId) {
        // Edit existing student
        result = editStudent(state.editingStudentId, studentData);
    } else {
        // Add new student
        result = addStudent(studentData);
    }

    if (result.success) {
        resetForm();
        renderStudentsTable();
    } else {
        showFormErrors(result.errors);
    }
}

function handleCancel() {
    resetForm();
}

function handleEdit(e) {
    const studentId = e.target.dataset.id;
    const students = getStudents();
    const student = students.find(s => s.id === studentId);

    if (student) {
        populateFormForEdit(student);
    }
}

function handleDeleteRequest(e) {
    const studentId = e.target.dataset.id;
    const students = getStudents();
    const student = students.find(s => s.id === studentId);

    if (student) {
        state.deleteStudentId = studentId;
        confirmMessage.textContent = `Are you sure you want to delete ${student.name}?`;
        confirmModal.classList.remove('hidden');
    }
}

function handleConfirmDelete() {
    if (state.deleteStudentId) {
        const result = deleteStudent(state.deleteStudentId, true);

        if (result.success) {
            renderStudentsTable();
            closeConfirmModal();
        }
    }
}

function handleCancelDelete() {
    closeConfirmModal();
}

function closeConfirmModal() {
    state.deleteStudentId = null;
    confirmModal.classList.add('hidden');
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
function attachEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Form submit
    studentForm.addEventListener('submit', handleSubmit);

    // Cancel button
    cancelBtn.addEventListener('click', handleCancel);

    // Confirm modal
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    cancelDeleteBtn.addEventListener('click', handleCancelDelete);

    // Close modal on outside click
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !confirmModal.classList.contains('hidden')) {
            closeConfirmModal();
        }
    });
}

// Start app
init();
