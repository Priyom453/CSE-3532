/* =========================================================
   STUDENT ACTIVITY DASHBOARD — script.js
   Every section below is labelled with the DOM concept(s)
   it demonstrates, so you can trace the concept -> the code.
   ========================================================= */

/* ---------- FINDING ELEMENTS: getElementById() ---------- */
const studentForm   = document.getElementById('studentForm');
const nameInput      = document.getElementById('studentName');
const idInput         = document.getElementById('studentId');
const deptInput      = document.getElementById('department');
const statusSelect  = document.getElementById('status');

const studentList    = document.getElementById('studentList');
const emptyState     = document.getElementById('emptyState');
const searchInput    = document.getElementById('searchInput');

const totalCountEl   = document.getElementById('totalCount');
const activeCountEl  = document.getElementById('activeCount');
const inactiveCountEl = document.getElementById('inactiveCount');

const darkModeToggle = document.getElementById('darkModeToggle');

/* ---------- FINDING ELEMENTS: querySelectorAll() ---------- */
const filterButtons = document.querySelectorAll('.filter-btn');

/* ---------- APP STATE (plain JS, not the DOM) ---------- */
let students = [];          // { id, name, studentId, department, status }
let currentFilter = 'all';  // 'all' | 'active' | 'inactive'
let searchTerm = '';

/* =========================================================
   RENDERING — clears the list and rebuilds it from `students`
   Demonstrates: createElement(), appendChild(), textContent,
   classList.add(), setAttribute(), remove()
   ========================================================= */
function renderStudents() {

  // --- Removing elements: clear old cards before re-drawing ---
  // (childNodes are removed one by one with .remove())
  while (studentList.firstChild) {
    studentList.firstChild.remove();
  }

  // Apply the current search + filter to the state array
  const visible = students.filter(student => {
    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'active' && student.status === 'Active') ||
      (currentFilter === 'inactive' && student.status === 'Inactive');

    const haystack = (student.name + ' ' + student.studentId).toLowerCase();
    const matchesSearch = haystack.includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  // --- Show/hide elements using a `hidden` class ---
  if (visible.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  visible.forEach(student => {
    // createElement(): build a new <div> for this student
    const card = document.createElement('div');
    card.classList.add('student-card');

    // Storing & reading data: setAttribute() / getAttribute()
    // We stamp the student's id onto the element itself so
    // click handlers can look it up later without a closure.
    card.setAttribute('data-id', student.id);

    // --- Info block ---
    const info = document.createElement('div');
    info.classList.add('student-info');

    const nameEl = document.createElement('strong');
    nameEl.textContent = student.name; // Reading & changing content

    const metaEl = document.createElement('span');
    metaEl.textContent = `${student.studentId} • ${student.department}`;

    info.appendChild(nameEl); // appendChild(): attach child to parent
    info.appendChild(metaEl);

    // --- Actions block: status badge + delete button ---
    const actions = document.createElement('div');
    actions.classList.add('student-actions');

    const badge = document.createElement('button');
    badge.classList.add('badge');
    // classList.toggle() usage lives in toggleStatus(); here we just
    // set the correct starting class based on current status.
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

/* =========================================================
   REAL-TIME STATISTICS — just counts + textContent updates
   ========================================================= */
function updateStats() {
  const total = students.length;
  const active = students.filter(s => s.status === 'Active').length;
  const inactive = total - active;

  totalCountEl.textContent = total;
  activeCountEl.textContent = active;
  inactiveCountEl.textContent = inactive;
}

/* =========================================================
   ADDING A STUDENT
   Demonstrates: addEventListener('submit'), event.preventDefault(),
   input.value, form.reset()
   ========================================================= */
studentForm.addEventListener('submit', function (event) {
  // Stop the browser's default "reload the page" behaviour
  event.preventDefault();

  const name = nameInput.value.trim();
  const studentId = idInput.value.trim();
  const department = deptInput.value.trim();
  const status = statusSelect.value;

  if (!name || !studentId || !department) {
    return; // required attributes already guard this, but double check
  }

  students.push({
    id: Date.now().toString(), // simple unique id
    name,
    studentId,
    department,
    status
  });

  renderStudents();

  // Clear all fields in the form back to their defaults
  studentForm.reset();
  nameInput.focus();
});

/* =========================================================
   TOGGLING STATUS — classList.toggle(), classList.contains()
   ========================================================= */
function toggleStatus(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  student.status = student.status === 'Active' ? 'Inactive' : 'Active';
  renderStudents();
}

/* =========================================================
   DELETING A STUDENT — remove() (via re-render / filter)
   ========================================================= */
function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  renderStudents();
}

/* =========================================================
   LIVE SEARCH — addEventListener('input')
   ========================================================= */
searchInput.addEventListener('input', function (event) {
  searchTerm = event.target.value.trim().toLowerCase();
  renderStudents();
});

/* =========================================================
   ACTIVE / INACTIVE FILTER TABS
   Demonstrates: querySelectorAll(), classList.remove(),
   classList.add(), getAttribute()
   ========================================================= */
filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    // Un-highlight every tab...
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // ...then highlight only the one that was clicked
    button.classList.add('active');

    currentFilter = button.getAttribute('data-filter');
    renderStudents();
  });
});

/* =========================================================
   DARK MODE TOGGLE
   Demonstrates: classList.toggle(), classList.contains()
   ========================================================= */
darkModeToggle.addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');

  const isDark = document.body.classList.contains('dark-mode');
  darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

/* ---------- Initial render on page load ---------- */
renderStudents();