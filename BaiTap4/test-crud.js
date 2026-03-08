/**
 * Simple test file for Student CRUD module
 * Run with: node test-crud.js
 */

// Mock localStorage for Node.js environment
global.localStorage = {
    data: {},
    getItem(key) {
        return this.data[key] || null;
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    removeItem(key) {
        delete this.data[key];
    },
    clear() {
        this.data = {};
    }
};

// Load the CRUD module
const { validateStudent, addStudent, editStudent, deleteStudent, getStudents } = require('./modules/student-crud.js');

// Test counter
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        console.log('✓', message);
        testsPassed++;
    } else {
        console.error('✗', message);
        testsFailed++;
    }
}

function assertEquals(actual, expected, message) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log('✓', message);
        testsPassed++;
    } else {
        console.error('✗', message);
        console.error('  Expected:', expected);
        console.error('  Actual:', actual);
        testsFailed++;
    }
}

console.log('Running Student CRUD Tests...\n');

// Test 1: Validate Student - Valid Data
console.log('Test 1: Validate Student - Valid Data');
const validStudent = { name: 'John Doe', class: '10A1', grade: 8.5 };
const validation1 = validateStudent(validStudent);
assert(validation1.valid === true, 'Valid student should pass validation');
assert(validation1.errors.length === 0, 'Valid student should have no errors');

// Test 2: Validate Student - Empty Name
console.log('\nTest 2: Validate Student - Empty Name');
const invalidStudent1 = { name: '', class: '10A1', grade: 8.5 };
const validation2 = validateStudent(invalidStudent1);
assert(validation2.valid === false, 'Empty name should fail validation');
assert(validation2.errors.length > 0, 'Empty name should have errors');

// Test 3: Validate Student - Invalid Grade
console.log('\nTest 3: Validate Student - Invalid Grade');
const invalidStudent2 = { name: 'Jane Doe', class: '10A1', grade: 11 };
const validation3 = validateStudent(invalidStudent2);
assert(validation3.valid === false, 'Grade > 10 should fail validation');

const invalidStudent3 = { name: 'Jane Doe', class: '10A1', grade: -1 };
const validation4 = validateStudent(invalidStudent3);
assert(validation4.valid === false, 'Grade < 0 should fail validation');

// Test 4: Add Student - Valid Data
console.log('\nTest 4: Add Student - Valid Data');
localStorage.clear();
const addResult1 = addStudent({ name: 'Alice Smith', class: '10A2', grade: 9.0 });
assert(addResult1.success === true, 'Adding valid student should succeed');
assert(addResult1.student !== undefined, 'Should return student object');
assert(addResult1.student.name === 'Alice Smith', 'Student name should match');

// Test 5: Add Student - Invalid Data
console.log('\nTest 5: Add Student - Invalid Data');
const addResult2 = addStudent({ name: '', class: '10A2', grade: 9.0 });
assert(addResult2.success === false, 'Adding invalid student should fail');
assert(addResult2.errors.length > 0, 'Should return errors');

// Test 6: Get Students
console.log('\nTest 6: Get Students');
const students = getStudents();
assert(students.length === 1, 'Should have 1 student');
assert(students[0].name === 'Alice Smith', 'Student name should match');

// Test 7: Edit Student - Valid Data
console.log('\nTest 7: Edit Student - Valid Data');
const studentId = students[0].id;
const editResult1 = editStudent(studentId, { name: 'Alice Johnson', class: '10A3', grade: 9.5 });
assert(editResult1.success === true, 'Editing valid student should succeed');
assert(editResult1.student.name === 'Alice Johnson', 'Updated name should match');
assert(editResult1.student.grade === 9.5, 'Updated grade should match');

// Test 8: Edit Student - Invalid ID
console.log('\nTest 8: Edit Student - Invalid ID');
const editResult2 = editStudent('invalid-id', { name: 'Bob', class: '10A1', grade: 8.0 });
assert(editResult2.success === false, 'Editing non-existent student should fail');
assert(editResult2.errors.includes('Student not found'), 'Should return "Student not found" error');

// Test 9: Delete Student - Without Confirmation
console.log('\nTest 9: Delete Student - Without Confirmation');
const deleteResult1 = deleteStudent(studentId, false);
assert(deleteResult1.success === false, 'Delete without confirmation should fail');
assert(deleteResult1.needsConfirmation === true, 'Should indicate confirmation needed');

// Test 10: Delete Student - With Confirmation
console.log('\nTest 10: Delete Student - With Confirmation');
const deleteResult2 = deleteStudent(studentId, true);
assert(deleteResult2.success === true, 'Delete with confirmation should succeed');

const studentsAfterDelete = getStudents();
assert(studentsAfterDelete.length === 0, 'Should have 0 students after deletion');

// Test 11: Multiple Students
console.log('\nTest 11: Multiple Students');
localStorage.clear();
addStudent({ name: 'Student 1', class: '10A1', grade: 7.0 });
addStudent({ name: 'Student 2', class: '10A2', grade: 8.0 });
addStudent({ name: 'Student 3', class: '10A3', grade: 9.0 });
const multipleStudents = getStudents();
assert(multipleStudents.length === 3, 'Should have 3 students');

// Test 12: Validate Student - Missing Required Fields
console.log('\nTest 12: Validate Student - Missing Required Fields');
const invalidStudent4 = { name: 'Test', class: '', grade: 8.0 };
const validation5 = validateStudent(invalidStudent4);
assert(validation5.valid === false, 'Missing class should fail validation');

const invalidStudent5 = { name: 'Test', class: '10A1' };
const validation6 = validateStudent(invalidStudent5);
assert(validation6.valid === false, 'Missing grade should fail validation');

// Summary
console.log('\n' + '='.repeat(50));
console.log('Test Summary:');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);
console.log('='.repeat(50));

if (testsFailed === 0) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
} else {
    console.log('\n✗ Some tests failed!');
    process.exit(1);
}
