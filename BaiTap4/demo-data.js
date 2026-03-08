/**
 * Demo data loader for testing the application
 * Open the browser console and run: loadDemoData()
 */

function loadDemoData() {
    // Clear existing data
    localStorage.removeItem('students');

    // Sample students
    const demoStudents = [
        { name: 'Nguyễn Văn An', class: '10A1', grade: 8.5 },
        { name: 'Trần Thị Bình', class: '10A1', grade: 9.0 },
        { name: 'Lê Văn Cường', class: '10A2', grade: 7.5 },
        { name: 'Phạm Thị Dung', class: '10A2', grade: 8.0 },
        { name: 'Hoàng Văn Em', class: '10A3', grade: 9.5 }
    ];

    // Add each student
    demoStudents.forEach(student => {
        addStudent(student);
    });

    // Refresh the table
    renderStudentsTable();

    console.log('✓ Demo data loaded successfully!');
    console.log(`Added ${demoStudents.length} students`);
}

console.log('Demo data script loaded. Run loadDemoData() to populate the table.');
