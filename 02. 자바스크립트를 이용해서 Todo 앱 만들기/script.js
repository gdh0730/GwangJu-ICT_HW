// ——————————————————————————————————————————
// 전역 상태
// ——————————————————————————————————————————
let editingTodoId = null;    // 현재 인라인 편집 중인 Todo의 ID
let editingText   = "";      // 편집 중인 텍스트 값

// ——————————————————————————————————————————
// 1) localStorage 처리
// ——————————————————————————————————————————
function loadTodos() {
  const raw = localStorage.getItem("todos");
  return raw ? JSON.parse(raw) : [];
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ——————————————————————————————————————————
// 2) DOM 요소 참조
// ——————————————————————————————————————————
const todoListEl        = document.getElementById("todo-list");
const toggleAddFormBtn  = document.getElementById("toggle-add-form");
const newTodoForm       = document.getElementById("new-todo-form");
const newTodoInput      = document.getElementById("new-todo-input");

// ——————————————————————————————————————————
// 3) 렌더링
// ——————————————————————————————————————————
function createTodoItemElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " completed" : "");

  // ─ 체크박스 + 텍스트 or 인라인 입력창 ─
  const contentDiv = document.createElement("div");
  contentDiv.className = "todo-content";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => toggleCompletion(todo.id));

  contentDiv.append(checkbox);

  if (todo.id === editingTodoId) {
    // 인라인 편집 모드
    const input = document.createElement("input");
    input.type = "text";
    input.value = editingText;
    input.className = "todo-text";
    input.style.flex = "1";
    input.addEventListener("input", e => editingText = e.target.value);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") commitEdit();
      if (e.key === "Escape") cancelEdit();
    });
    input.addEventListener("blur", cancelEdit);
    contentDiv.append(input);
  } else {
    // 일반 표시 모드
    const span = document.createElement("span");
    span.className = "todo-text" + (todo.completed ? " completed" : "");
    span.textContent = todo.text;
    contentDiv.append(span);
  }

  // ─ 버튼 그룹 ─
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  if (todo.id === editingTodoId) {
    // 편집 중: 저장, 취소 버튼
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "✔️";
    saveBtn.addEventListener("click", commitEdit);
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "❌";
    cancelBtn.addEventListener("click", cancelEdit);
    buttonGroup.append(saveBtn, cancelBtn);

  } else {
    // 기본: 편집, 삭제 버튼
    const editBtn = document.createElement("button");
    editBtn.className = "edit-button";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => startEdit(todo.id, todo.text));

    const delBtn = document.createElement("button");
    delBtn.className = "delete-button";
    delBtn.textContent = "➖";
    delBtn.addEventListener("click", () => deleteTodo(todo.id));

    buttonGroup.append(editBtn, delBtn);
  }

  li.append(contentDiv, buttonGroup);
  return li;
}

function renderTodoList() {
  todoListEl.innerHTML = "";
  const todos = loadTodos();
  todos.forEach(todo => {
    todoListEl.appendChild(createTodoItemElement(todo));
  });
}

// ——————————————————————————————————————————
// 4) CRUD 함수
// ——————————————————————————————————————————
function toggleCompletion(id) {
  const todos = loadTodos().map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos(todos);
  renderTodoList();
}

function startEdit(id, currentText) {
  editingTodoId = id;
  editingText = currentText;
  renderTodoList();
}

function commitEdit() {
  if (editingTodoId == null) return;
  const trimmed = editingText.trim();
  if (trimmed !== "") {
    const todos = loadTodos().map(t =>
      t.id === editingTodoId ? { ...t, text: trimmed } : t
    );
    saveTodos(todos);
  }
  editingTodoId = null;
  editingText = "";
  renderTodoList();
}

function cancelEdit() {
  editingTodoId = null;
  editingText = "";
  renderTodoList();
}

function deleteTodo(id) {
  const todos = loadTodos().filter(t => t.id !== id);
  saveTodos(todos);
  // 편집 중이었으면 취소
  if (editingTodoId === id) cancelEdit();
  renderTodoList();
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({
    id: Date.now(),
    text: text.trim(),
    completed: false
  });
  saveTodos(todos);
  renderTodoList();
}

// ——————————————————————————————————————————
// 5) 이벤트 바인딩
// ——————————————————————————————————————————
toggleAddFormBtn.addEventListener("click", () => {
  newTodoForm.classList.toggle("hidden");
  if (!newTodoForm.classList.contains("hidden")) {
    newTodoInput.focus();
  }
});

newTodoForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = newTodoInput.value;
  if (text.trim() !== "") {
    addTodo(text);
    newTodoInput.value = "";
  }
});

// ——————————————————————————————————————————
// 6) 초기 렌더링
// ——————————————————————————————————————————
document.addEventListener("DOMContentLoaded", renderTodoList);
