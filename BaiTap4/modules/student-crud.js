/**
 * Student CRUD Module
 * Handles Create, Read, Update, Delete operations for students
 * Requirements: 9.1
 */

const STORAGE_KEY = 'students';

/**
 * Validate student data
 * @param {Object} student - Student object to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validateStudent(student) {
    const errors = [];

    // Check required fields
    if (!student.name || typeof student.name !== 'string' || student.name.trim() === '') {
        errors.push('Name is required and must be non-empty');
    }

    if (!student.class || typeof student.class !== 'string' || student.class.trim() === '') {
        errors.push('Class is required');
    }

    if (student.grade === undefined || student.grade === null) {
        errors.push('Grade is required');
    } else {
        const grade = Number(student.grade);
        if (isNaN(grade) || grade < 0 || grade > 10) {
            errors.push('Grade must be a number between 0 and 10');
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Get all students from localStorage
 * @returns {Array} - Array of student objects
 */
function getStudents() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading students from localStorage:', error);
        return [];
    }
}

/**
 * Save students to localStorage
 * @param {Array} students - Array of student objects
 */
function saveStudents(students) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
        console.error('Error saving students to localStorage:', error);
        throw new Error('Failed to save students. Storage quota may be exceeded.');
    }
}

/**
 * Generate unique ID for student
 * @returns {string} - Unique identifier
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Add a new student
 * @param {Object} studentData - Student data { name, class, grade }
 * @returns {Object} - { success: boolean, student?: Object, errors?: string[] }
 */
function addStudent(studentData) {
    // Validate input
    const validation = validateStudent(studentData);
    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors
        };
    }

    // Create student object
    const student = {
        id: generateId(),
        name: studentData.name.trim(),
        class: studentData.class.trim(),
        grade: Number(studentData.grade),
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    // Get existing students
    const students = getStudents();

    // Add new student
    students.push(student);

    // Save to localStorage
    try {
        saveStudents(students);
        return {
            success: true,
            student
        };
    } catch (error) {
        return {
            success: false,
            errors: [error.message]
        };
    }
}

/**
 * Edit an existing student
 * @param {string} id - Student ID
 * @param {Object} studentData - Updated student data { name, class, grade }
 * @returns {Object} - { success: boolean, student?: Object, errors?: string[] }
 */
function editStudent(id, studentData) {
    // Validate input
    const validation = validateStudent(studentData);
    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors
        };
    }

    // Get existing students
    const students = getStudents();

    // Find student by ID
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
        return {
            success: false,
            errors: ['Student not found']
        };
    }

    // Update student
    students[index] = {
        ...students[index],
        name: studentData.name.trim(),
        class: studentData.class.trim(),
        grade: Number(studentData.grade),
        updatedAt: Date.now()
    };

    // Save to localStorage
    try {
        saveStudents(students);
        return {
            success: true,
            student: students[index]
        };
    } catch (error) {
        return {
            success: false,
            errors: [error.message]
        };
    }
}

/**
 * Delete a student with confirmation
 * @param {string} id - Student ID
 * @param {boolean} confirmed - Whether deletion is confirmed
 * @returns {Object} - { success: boolean, needsConfirmation?: boolean, errors?: string[] }
 */
function deleteStudent(id, confirmed = false) {
    // Check if confirmation is needed
    if (!confirmed) {
        return {
            success: false,
            needsConfirmation: true
        };
    }

    // Get existing students
    const students = getStudents();

    // Find student by ID
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
        return {
            success: false,
            errors: ['Student not found']
        };
    }

    // Remove student
    students.splice(index, 1);

    // Save to localStorage
    try {
        saveStudents(students);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            errors: [error.message]
        };
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateStudent,
        addStudent,
        editStudent,
        deleteStudent,
        getStudents
    };
}
