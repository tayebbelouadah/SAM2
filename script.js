// Database Simulation using LocalStorage
let db = {
    absences: []
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    // Load data from localStorage safely
    try {
        const savedData = localStorage.getItem('absencesDB');
        if (savedData) {
            db = JSON.parse(savedData);
        }
    } catch(e) {
        console.warn("LocalStorage is not available. Data will not be saved after reload.");
    }
    
    updateDashboard();
    populateTable();
    updateStudentSelect();
    
    // Set current date in print area
    const today = new Date();
    document.getElementById('current-print-date').innerText = today.toLocaleDateString('ar-DZ');
});

// Login Logic
function handleLogin(e) {
    if (e) e.preventDefault();
    
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();
    
    // Simple authentication
    if(user === 'admin' && pass === 'admin') {
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('main-app').classList.add('active');
        generateSerialNumber();
    } else {
        document.getElementById('login-error').innerText = "اسم المستخدم أو كلمة المرور غير صحيحة. (تأكد من كتابة admin في كلا الحقلين)";
    }
    return false;
}

function logout() {
    document.getElementById('main-app').classList.remove('active');
    document.getElementById('login-page').classList.add('active');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').innerText = '';
}

// Navigation Logic
function showView(viewId) {
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
    
    if (viewId === 'dashboard-view') {
        updateDashboard();
    }
    if (viewId === 'employee-view') {
        generateSerialNumber();
    }
}

// Absences Logic
function generateSerialNumber() {
    const currentYear = new Date().getFullYear();
    const count = db.absences.length + 1;
    document.getElementById('serial-number').value = `ABS-${currentYear}-${("0000" + count).slice(-4)}`;
}

function handleAddAbsence(e) {
    if (e) e.preventDefault();
    
    const newAbsence = {
        serialNumber: document.getElementById('serial-number').value,
        regNumber: document.getElementById('reg-number').value,
        lastName: document.getElementById('last-name').value,
        firstName: document.getElementById('first-name').value,
        bacYear: document.getElementById('bac-year').value,
        level: document.getElementById('level').value,
        academicYear: document.getElementById('academic-year').value,
        duration: document.getElementById('absence-duration').value,
        issuer: document.getElementById('certificate-issuer').value,
        dateAdded: new Date().toISOString()
    };
    
    db.absences.push(newAbsence);
    saveData();
    
    alert('تم حفظ بيانات الغياب بنجاح');
    document.getElementById('absence-form').reset();
    generateSerialNumber();
    populateTable();
    updateDashboard();
    updateStudentSelect();
    return false;
}

function saveData() {
    try {
        localStorage.setItem('absencesDB', JSON.stringify(db));
    } catch(e) {
        console.warn("Could not save to LocalStorage.");
    }
}

function updateDashboard() {
    document.getElementById('total-absences').innerText = db.absences.length;
}

function populateTable() {
    const tbody = document.querySelector('#absences-table tbody');
    tbody.innerHTML = '';
    
    db.absences.forEach((abs, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${abs.serialNumber}</td>
            <td>${abs.regNumber}</td>
            <td>${abs.lastName} ${abs.firstName}</td>
            <td>${abs.level}</td>
            <td>${abs.duration}</td>
            <td>
                <button onclick="deleteAbsence(${index})" style="color:#dc2626; cursor:pointer; border:none; background:none; font-weight:bold; font-family:inherit;">حذف</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteAbsence(index) {
    if(confirm('هل أنت متأكد من حذف هذا السجل نهائياً؟')) {
        db.absences.splice(index, 1);
        saveData();
        populateTable();
        updateDashboard();
        updateStudentSelect();
        generateSerialNumber();
    }
}

// Justification Form Logic
function updateStudentSelect() {
    const select = document.getElementById('student-select');
    select.innerHTML = '<option value="">-- إدخال يدوي --</option>';
    
    db.absences.forEach((abs, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = `${abs.lastName} ${abs.firstName} - رقم: ${abs.regNumber}`;
        select.appendChild(option);
    });
}

function fillJustificationForm() {
    const index = document.getElementById('student-select').value;
    if (index !== "") {
        const student = db.absences[index];
        document.getElementById('just-student-name').value = `${student.lastName} ${student.firstName}`;
        document.getElementById('just-level').value = student.level;
    } else {
        document.getElementById('just-student-name').value = '';
        document.getElementById('just-level').value = '';
    }
}
