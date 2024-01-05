console.log(localStorage.getItem('students'));

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateFullName(fullname) {
    if (_.isEmpty(fullname)) {
        return 'Vui lòng nhập họ và tên!';
    } else if (fullname.trim().length <= 2) {
        return 'Họ và tên không được nhỏ hơn 2 ký tự!';
    } else if (fullname.trim().length >= 50) {
        return 'Họ và tên không được lớn hơn 50 ký tự!';
    }
    return '';
}

function validateEmail(email) {
    if (_.isEmpty(email)) {
        return 'Vui lòng nhập email của bạn!';
    } else if (!emailIsValid(email)) {
        return 'Email không đúng định dạng';
    }
    return '';
}

function validatePhone(phone) {
    if (_.isEmpty(phone)) {
        return 'Vui lòng nhập số điện thoại';
    } else if (phone.trim().length > 10) {
        return 'Số điện thoại không đúng';
    }
    return '';
}

function validateAddress(address) {
    return _.isEmpty(address) ? 'Vui lòng nhập địa chỉ' : '';
}

function validateGender(gender) {
    return _.isEmpty(gender) ? 'Vui lòng chọn giới tính' : '';
}

document.addEventListener('DOMContentLoaded', function () {
    renderListStudent();
});

function save() {
    let fullname = document.getElementById('fullname').value.trim();
    let email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let address = document.getElementById('address').value.trim();
    let gender = '';

    if (document.getElementById('male').checked) {
        gender = document.getElementById('male').value;
    } else if (document.getElementById('female').checked) {
        gender = document.getElementById('female').value;
    }

    const fullnameError = validateFullName(fullname);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const addressError = validateAddress(address);
    const genderError = validateGender(gender);

    document.getElementById('fullname-error').innerHTML = fullnameError;
    document.getElementById('email-error').innerHTML = emailError;
    document.getElementById('phone-error').innerHTML = phoneError;
    document.getElementById('address-error').innerHTML = addressError;
    document.getElementById('gender-error').innerHTML = genderError;

    if (fullnameError || emailError || phoneError || addressError || genderError) {
        return; // Dừng lại nếu có lỗi
    }

    // Tiếp tục xử lý khi không có lỗi
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    students.push({
        fullname: fullname,
        email: email,
        phone: phone,
        address: address,
        gender: gender,
    });

    localStorage.setItem('students', JSON.stringify(students));

    renderListStudent(students);
}

document.addEventListener('DOMContentLoaded', function () {
    renderListStudent();
});

function renderListStudent(filteredStudents) {
    let students = filteredStudents || (localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : []);

    if (students.length === 0) {
        document.getElementById('list-student').style.display = 'none';
        return false;
    }

    document.getElementById('list-student').style.display = 'block';

    let tableContent = `<tr>
        <td width='20'>#</td>
        <td>Họ và tên</td>
        <td>Email</td>
        <td>Điện thoại</td> 
        <td>Giới tính</td>
        <td>Địa chỉ</td>
        <td>Hành động</td>
    </tr>`;

    students.forEach((student, index) => {
        let rowIndex = index + 1;

        if (!document.getElementById('row-' + rowIndex)) {
            const newRow = document.createElement('tr');
            newRow.id = 'row-' + rowIndex;
            document.getElementById('grid-students').appendChild(newRow);
        }

        document.getElementById('row-' + rowIndex).classList.add('highlighted');

        let studentId = index;
        let genderLabel = parseInt(student.gender) === 1 ? 'Nam' : 'Nữ';
        index++;

        tableContent += `<tr>
            <td>${index}</td>
            <td>${student.fullname}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${genderLabel}</td>
            <td>${student.address}</td>
            <td>
                <a href='#' onclick='editStudent(${studentId})'>Edit</a> | <a href='#' onclick='deleteStudent(${studentId})'>Delete</a>
            </td>
            </tr>`;
    });

    document.getElementById('grid-students').innerHTML = tableContent;
}

function deleteStudent(id) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    let confirmation = confirm("Bạn có chắc chắn muốn xoá sinh viên này?");
    if (confirmation) {
        students.splice(id, 1);
        localStorage.setItem('students', JSON.stringify(students));
        renderListStudent();
    }
}

function editStudent(id) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
    
    let studentToEdit = students[id];

    let formStudent = document.getElementById('form-student');
    if (formStudent) {
        formStudent.style.display = 'none';
    } else {
        console.error("Không tìm thấy phần tử có ID là 'form-student'");
    }

    document.getElementById('edit-fullname').value = studentToEdit.fullname;
    document.getElementById('edit-email').value = studentToEdit.email;
    document.getElementById('edit-phone').value = studentToEdit.phone;
    document.getElementById('edit-address').value = studentToEdit.address;

    if (studentToEdit.gender === '1') {
        document.getElementById('edit-male').checked = true;
    } else if (studentToEdit.gender === '2') {
        document.getElementById('edit-female').checked = true;
    }

    document.getElementById('form-student').style.display = 'none';
    document.getElementById('form-edit-student').style.display = 'block';

    document.getElementById('edit-student-index').value = id;
}

function updateStudent() {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
    let index = document.getElementById('edit-student-index').value;

    students[index].fullname = document.getElementById('edit-fullname').value.trim();
    students[index].email = document.getElementById('edit-email').value.trim();
    students[index].phone = document.getElementById('edit-phone').value.trim();
    students[index].address = document.getElementById('edit-address').value.trim();

    if (document.getElementById('edit-male').checked) {
        students[index].gender = document.getElementById('edit-male').value;
    } else if (document.getElementById('edit-female').checked) {
        students[index].gender = document.getElementById('edit-female').value;
    }

    localStorage.setItem('students', JSON.stringify(students));

    console.log("Đã vào hàm updateStudent");
    document.getElementById('form-edit-student').style.display = 'none';
    document.getElementById('form-student').style.display = 'block';

    renderListStudent();
}

function deleteStudent(id) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    let confirmation = confirm("Bạn có chắc chắn muốn xoá sinh viên này?");
    if (confirmation) {
        students.splice(id, 1);
        localStorage.setItem('students', JSON.stringify(students));
        renderListStudent();
    }
}

document.getElementById('search-term').addEventListener('input', searchStudents);

// Thêm vào hàm searchStudents()
function searchStudents() {
    let searchTerm = document.getElementById('search-term').value.trim().toLowerCase();
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    let filteredStudents = students.filter(student => {
        return (
            student.fullname.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.phone.toLowerCase().includes(searchTerm) ||
            student.address.toLowerCase().includes(searchTerm)
        );
    });

    renderListStudent(filteredStudents);
}

// Thêm vào hàm sortStudents()
function sortStudents(order) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    students.sort((a, b) => {
        const nameA = a.fullname.toUpperCase();
        const nameB = b.fullname.toUpperCase();
        
        if (order === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    renderListStudent(students);
}

// Thêm vào hàm filterStudents()
// function filterStudents() {
//     let filterProperty = document.getElementById('filter-property').value;
//     let filterValue = document.getElementById('filter-value').value;

//     let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

//     let filteredStudents = students.filter(student => {
//         return String(student[filterProperty]) === filterValue;
//     });

//     renderListStudent(filteredStudents);
// }
// Thêm vào hàm filterStudents()
function filterStudents() {
    let filterGender = document.getElementById('filter-gender').value;
    let filterLocation = document.getElementById('filter-location').value;
    // Thêm các biến để lọc theo các thuộc tính khác

    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    let filteredStudents = students.filter(student => {
        return (
            (filterGender === 'all' || String(student.gender) === filterGender) &&
            (filterLocation === 'all' || student.address.toLowerCase().includes(filterLocation.toLowerCase()))
            // Thêm điều kiện lọc cho các thuộc tính khác nếu cần
        );
    });

    renderListStudent(filteredStudents);
}
// Thêm vào hàm filterStudents()
function filterStudents() {
    let filterGender = document.getElementById('filter-gender').value;
    let filterLocation = document.getElementById('filter-location').value.toLowerCase();
    let filterName = document.getElementById('filter-name').value.toLowerCase();

    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    let filteredStudents = students.filter(student => {
        return (
            (filterGender === 'all' || String(student.gender) === filterGender) &&
            (filterLocation === '' || student.address.toLowerCase().includes(filterLocation)) &&
            (filterName === '' || student.fullname.toLowerCase().includes(filterName))
            // Thêm điều kiện lọc cho các thuộc tính khác nếu cần
        );
    });

    renderListStudent(filteredStudents);
}




function exportToExcel() {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    const header = Object.keys(students[0]).join('\t');
    const data = students.map(student => Object.values(student).join('\t')).join('\n');

    const blob = new Blob([header, '\n', data], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
