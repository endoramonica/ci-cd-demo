const STORAGE_KEY = "students_v1";
const THEME_KEY = "theme_v1";

const $ = (id) => document.getElementById(id);

let students = loadStudents();

function loadStudents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

function validateStudent(st) {
  if (!st.id || !st.name || !st.className) return "Vui lòng nhập đủ Mã SV, Họ tên, Lớp.";
  if (Number.isNaN(st.score) || st.score < 0 || st.score > 10) return "Điểm phải nằm trong [0, 10].";
  if (students.some((x) => x.id === st.id)) return "Mã SV đã tồn tại.";
  return "";
}

function render(list = students) {
  const tbody = $("studentTbody");
  tbody.innerHTML = "";
  for (const st of list) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${st.id}</td>
      <td>${st.name}</td>
      <td>${st.className}</td>
      <td>${st.score.toFixed(1)}</td>
    `;
    tbody.appendChild(tr);
  }
}

function setupAddForm() {
  const form = $("studentForm");
  const errorEl = $("formError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const st = {
      id: normalize($("studentId").value).toUpperCase(),
      name: $("studentName").value.trim(),
      className: $("studentClass").value.trim(),
      score: Number($("studentScore").value),
      createdAt: Date.now(),
    };

    const err = validateStudent(st);
    if (err) {
      errorEl.textContent = err;
      return;
    }

    students.push(st);
    saveStudents();
    form.reset();
    render();
  });
}

function setupSearch() {
  const input = $("searchInput");
  const clear = $("clearSearch");

  function apply() {
    const q = normalize(input.value);
    if (!q) return render(students);
    const filtered = students.filter((s) => {
      return (
        normalize(s.id).includes(q) ||
        normalize(s.name).includes(q) ||
        normalize(s.className).includes(q)
      );
    });
    render(filtered);
  }

  input.addEventListener("input", apply);
  clear.addEventListener("click", () => {
    input.value = "";
    render(students);
  });
}

function applyTheme(theme) {
  if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
}

function setupTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);

  $("themeToggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}


setupAddForm();
setupSearch();
setupTheme();
render();
