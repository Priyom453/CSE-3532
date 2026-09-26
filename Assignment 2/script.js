const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('studentName');
const idInput = document.getElementById('studentId');
const deptInput = document.getElementById('department');
const statusSelect = document.getElementById('status');

const studentList = document.getElementById('studentList');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');

const totalCountEl = document.getElementById('totalCount');
const activeCountEl = document.getElementById('activeCount');
const inactiveCountEl = document.getElementById('inactiveCount');

const darkModeToggle = document.getElementById('darkModeToggle');

const filterButtons = document.querySelectorAll('.filter-btn');

let students = [];
let currentFilter = 'all';
let searchTerm = '';

function renderStudents() {
  while (studentList.firstChild) {
    studentList.firstChild.remove();
  }

  const visible = students.filter(student => {
    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'active' && student.status === 'Active') ||
      (currentFilter === 'inactive' && student.status === 'Inactive');

    const haystack = (student.name + ' ' + student.studentId).toLowerCase();
    const matchesSearch = haystack.includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  if (visible.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  visible.forEach(student => {
    const card = document.createElement('div');
    card.classList.add('student-card');

    card.setAttribute('data-id', student.id);

    const info = document.createElement('div');
    info.classList.add('student-info');

    const nameEl = document.createElement('strong');
    nameEl.textContent = student.name;

    const metaEl = document.createElement('span');
    metaEl.textContent = `${student.studentId} • ${student.department}`;

    info.appendChild(nameEl);
    info.appendChild(metaEl);

    const actions = document.createElement('div');
    actions.classList.add('student-actions');

    const badge = document.createElement('button');
    badge.classList.add('badge');

    badge.classList.add(student.status === 'Active' ? 'active' : 'inactive');
    badge.textContent = student.status;
    badge.addEventListener('click', () => toggleStatus(student.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-delete');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => deleteStudent(student.id));

    actions.appendChild(badge);
    actions.appendChild(deleteBtn);

    card.appendChild(info);
    card.appendChild(actions);

    studentList.appendChild(card);
  });

  updateStats();
}

function updateStats() {
  const total = students.length;
  const active = students.filter(s => s.status === 'Active').length;
  const inactive = total - active;

  totalCountEl.textContent = total;
  activeCountEl.textContent = active;
  inactiveCountEl.textContent = inactive;
}

studentForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const studentId = idInput.value.trim();
  const department = deptInput.value.trim();
  const status = statusSelect.value;

  if (!name || !studentId || !department) {
    return;
  }

  students.push({
    id: Date.now().toString(),
    name,
    studentId,
    department,
    status
  });

  renderStudents();

  studentForm.reset();
  nameInput.focus();
});

function toggleStatus(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  student.status = student.status === 'Active' ? 'Inactive' : 'Active';
  renderStudents();
}

function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  renderStudents();
}

searchInput.addEventListener('input', function (event) {
  searchTerm = event.target.value.trim().toLowerCase();
  renderStudents();
});

filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    currentFilter = button.getAttribute('data-filter');
    renderStudents();
  });
});

darkModeToggle.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');

  const isDark = document.body.classList.contains('dark-mode');
  darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

renderStudents();