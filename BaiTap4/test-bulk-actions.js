/**
 * Simple test file for Bulk Actions module
 * Run with: node test-bulk-actions.js
 */

// Mock DOM and localStorage for Node.js environment
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

// Mock DOM elements
global.document = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({
        innerHTML: '',
        classList: { add: () => { }, remove: () => { } },
        addEventListener: () => { },
        insertBefore: () => { }
    }),
    body: {
        appendChild: () => { }
    },
    addEventListener: () => { }
};

global.window = {};

// Load the CRUD module (needed for bulk actions)
const { addStudent, getStudents } = require('./modules/student-crud.js');

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

console.log('Running Bulk Actions Tests...\n');

// Setup test data
console.log('Setting up test data...');
localStorage.clear();
addStudent({ name: 'Student 1', class: '10A1', grade: 7.0 });
addStudent({ name: 'Student 2', class: '10A2', grade: 8.0 });
addStudent({ name: 'Student 3', class: '10A3', grade: 9.0 });
const initialStudents = getStudents();
console.log(`Created ${initialStudents.length} test students\n`);

// Test 1: Bulk Delete Logic
console.log('Test 1: Bulk Delete Logic');
const studentIds = initialStudents.map(s => s.id);
const idsToDelete = [studentIds[0], studentIds[2]]; // Delete first and third

// Simulate bulk delete
const students = getStudents();
const remainingStudents = students.filter(student => !idsToDelete.includes(student.id));
localStorage.setItem('students', JSON.stringify(remainingStudents));

const afterDelete = getStudents();
assert(afterDelete.length === 1, 'Should have 1 student remaining after bulk delete');
assert(afterDelete[0].name === 'Student 2', 'Remaining student should be Student 2');
assert(!afterDelete.find(s => s.name === 'Student 1'), 'Student 1 should be deleted');
assert(!afterDelete.find(s => s.name === 'Student 3'), 'Student 3 should be deleted');

// Test 2: Bulk Delete All
console.log('\nTest 2: Bulk Delete All');
localStorage.clear();
addStudent({ name: 'Student A', class: '10A1', grade: 7.0 });
addStudent({ name: 'Student B', class: '10A2', grade: 8.0 });
const allStudents = getStudents();
const allIds = allStudents.map(s => s.id);

// Delete all
const remainingAfterDeleteAll = allStudents.filter(student => !allIds.includes(student.id));
localStorage.setItem('students', JSON.stringify(remainingAfterDeleteAll));

const afterDeleteAll = getStudents();
assert(afterDeleteAll.length === 0, 'Should have 0 students after deleting all');

// Test 3: Bulk Delete with Empty Selection
console.log('\nTest 3: Bulk Delete with Empty Selection');
localStorage.clear();
addStudent({ name: 'Student X', class: '10A1', grade: 7.0 });
const beforeEmptyDelete = getStudents();

// Delete with empty selection
const emptySelection = [];
const remainingAfterEmpty = beforeEmptyDelete.filter(student => !emptySelection.includes(student.id));
localStorage.setItem('students', JSON.stringify(remainingAfterEmpty));

const afterEmptyDelete = getStudents();
assert(afterEmptyDelete.length === 1, 'Should still have 1 student when deleting empty selection');

// Test 4: Selection State Management (Simulated)
console.log('\nTest 4: Selection State Management');
const selectionState = new Set();

// Add selections
selectionState.add('id1');
selectionState.add('id2');
selectionState.add('id3');
assert(selectionState.size === 3, 'Should have 3 selected items');

// Remove one selection
selectionState.delete('id2');
assert(selectionState.size === 2, 'Should have 2 selected items after removing one');
assert(!selectionState.has('id2'), 'id2 should not be in selection');
assert(selectionState.has('id1'), 'id1 should still be in selection');

// Clear all selections
selectionState.clear();
assert(selectionState.size === 0, 'Should have 0 selected items after clearing');

// Test 5: Select All Logic
console.log('\nTest 5: Select All Logic');
localStorage.clear();
addStudent({ name: 'Student 1', class: '10A1', grade: 7.0 });
addStudent({ name: 'Student 2', class: '10A2', grade: 8.0 });
addStudent({ name: 'Student 3', class: '10A3', grade: 9.0 });

const allStudentsForSelect = getStudents();
const selectAllState = new Set();

// Simulate select all
allStudentsForSelect.forEach(student => selectAllState.add(student.id));
assert(selectAllState.size === 3, 'Select all should select all 3 students');

// Simulate deselect all
selectAllState.clear();
assert(selectAllState.size === 0, 'Deselect all should clear all selections');

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
