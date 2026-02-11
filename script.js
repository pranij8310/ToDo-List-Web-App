/* ===============================
   ELEMENTS
================================= */
const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");

const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const sidebarName = document.getElementById("sidebarName");
const welcomeName = document.getElementById("welcomeName");

/* ===============================
   LOGIN SYSTEM
================================= */

// check saved user
function checkLogin() {
  const savedUser = localStorage.getItem("dashboard_user");

  if (savedUser) {
    showDashboard(savedUser);
  } else {
    showLogin();
  }
}

// show login page
function showLogin() {
  loginPage.style.display = "flex";
  dashboardPage.style.display = "none";
}

// show dashboard
function showDashboard(username) {
  loginPage.style.display = "none";
  dashboardPage.style.display = "flex";

  // set name everywhere
  sidebarName.textContent = username;
  welcomeName.textContent = username;
}

// login button
loginBtn.onclick = () => {
  const username = usernameInput.value.trim();

  if (!username) {
    alert("Please enter your name");
    return;
  }

  localStorage.setItem("dashboard_user", username);
  showDashboard(username);
};

// logout
logoutBtn.onclick = () => {
  localStorage.removeItem("dashboard_user");
  location.reload();
};

/* ===============================
   TASK SYSTEM
================================= */

const todoCard = document.querySelector(".todo-card");
const statusCard = document.querySelector(".status");
const completedCard = document.querySelector(".completed-card");

let tasks = JSON.parse(localStorage.getItem("dashboard_tasks")) || [];

// save tasks
function saveTasks() {
  localStorage.setItem("dashboard_tasks", JSON.stringify(tasks));
}

// render tasks
function renderTasks() {
  const todoHTML = [];
  const completedHTML = [];

  tasks.forEach((task, index) => {
    const taskHTML = `
      <div class="task ${task.status === "completed" ? "done" : ""}">
        <h4>${task.title}</h4>
        <p>${task.desc}</p>
        <span>Status: ${task.status}</span>
        <div style="margin-top:6px;">
          ${
            task.status !== "completed"
              ? `<button onclick="markComplete(${index})">✔</button>`
              : ""
          }
          <button onclick="deleteTask(${index})">✕</button>
        </div>
      </div>
    `;

    if (task.status === "completed") completedHTML.push(taskHTML);
    else todoHTML.push(taskHTML);
  });

  todoCard.innerHTML =
    `<h3>To-Do</h3>
     <button onclick="addTask()" style="margin-bottom:10px;">+ Add Task</button>` +
    todoHTML.join("");

  completedCard.innerHTML =
    `<h3>Completed Task</h3>` + completedHTML.join("");

  updateStatus();
}

// add task
function addTask() {
  const title = prompt("Task title:");
  if (!title) return;

  const desc = prompt("Task description:") || "";

  tasks.push({
    title,
    desc,
    status: "not-started"
  });

  saveTasks();
  renderTasks();
}

// mark complete
function markComplete(index) {
  tasks[index].status = "completed";
  saveTasks();
  renderTasks();
}

// delete task
function deleteTask(index) {
  if (!confirm("Delete this task?")) return;

  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// update status %
function updateStatus() {
  const total = tasks.length;

  const completed = tasks.filter(t => t.status === "completed").length;
  const inProgress = tasks.filter(t => t.status === "in-progress").length;
  const notStarted = tasks.filter(t => t.status === "not-started").length;

  const percent = n => (total ? Math.round((n / total) * 100) : 0);

  statusCard.innerHTML = `
    <div>Completed: ${percent(completed)}%</div>
    <div>In Progress: ${percent(inProgress)}%</div>
    <div>Not Started: ${percent(notStarted)}%</div>
  `;
}

/* ===============================
   INIT
================================= */
checkLogin();
renderTasks();
const today = new Date();

const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
const fullDate = today.toLocaleDateString("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

document.getElementById("dayName").textContent = dayName;
document.getElementById("fullDate").textContent = fullDate;
