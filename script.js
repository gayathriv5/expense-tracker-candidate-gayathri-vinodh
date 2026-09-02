

"use strict";



const STORAGE_KEY = "expense-tracker-transactions";

const CATEGORIES = {
  expense: {
    Food: "",
    Groceries: "",
    Transport: "",
    Rent: "",
    Utilities: "",
    Entertainment: "",
    Shopping: "",
    Health: "",
    Education: "",
    Travel: "",
    Other: "",
  },
  income: {
    Salary: "",
    Freelance: "",
    Investment: "",
    Business: "",
    Gift: "",
    Other: "",
  },
};

const CHART_COLORS = [
  "#6366f1",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#84cc16",
  "#06b6d4",
  "#a855f7",
];

let transactions = loadTransactions();
let currentFilter = "all";
let categoryFilter = "all";
let editingId = null;



const $ = (selector) => document.querySelector(selector);

const form = $("#transaction-form");
const formTitle = $("#form-title");
const submitBtn = $("#submit-btn");
const cancelEditBtn = $("#cancel-edit");

const amountInput = $("#amount");
const categorySelect = $("#category");
const dateInput = $("#date");
const descriptionInput = $("#description");

const typeRadios = document.querySelectorAll('input[name="type"]');

const totalIncomeEl = $("#total-income");
const totalExpenseEl = $("#total-expense");
const totalBalanceEl = $("#total-balance");

const transactionList = $("#transaction-list");
const transactionCount = $("#transaction-count");
const emptyState = $("#empty-state");
const emptyMessage = $("#empty-message");

const filterBtns = document.querySelectorAll(".filter-btn");
const categoryFilterSelect = $("#category-filter");

const monthSelect = $("#month-select");
const monthIncomeEl = $("#month-income");
const monthExpenseEl = $("#month-expense");
const monthNetEl = $("#month-net");
const monthTopCategoryEl = $("#month-top-category");
const monthTopCategoryAmountEl = $("#month-top-category-amount");

const chartCanvas = $("#category-chart");
const chartEmpty = $("#chart-empty");
const chartLegend = $("#chart-legend");



function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getTodayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function getCurrentMonth() {
  return getTodayISO().slice(0, 7);
}

function formatDateDisplay(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}



function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    return data
      .filter(
        (t) =>
          t &&
          typeof t.id === "string" &&
          typeof t.amount === "number" &&
          (t.type === "income" || t.type === "expense") &&
          typeof t.category === "string" &&
          typeof t.date === "string"
      )
      .map((t) => ({
        ...t,
        description: typeof t.description === "string" ? t.description : "",
      }));
  } catch (err) {
    console.warn("Failed to load transactions from local storage:", err);
    return [];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error("Failed to save transactions to local storage:", err);
    showToast("⚠️ Could not save data. Storage may be full or unavailable.", "error");
  }
}



function getCategoryEmoji(category, type) {
  const catMap = CATEGORIES[type] || CATEGORIES.expense;
  return catMap[category] || "";
}

function populateCategorySelect(selectedType = "expense", selectedCategory = "") {
  const cats = CATEGORIES[selectedType] || CATEGORIES.expense;
  categorySelect.innerHTML = "";
  Object.entries(cats).forEach(([name, emoji]) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = `${emoji} ${name}`;
    if (name === selectedCategory) option.selected = true;
    categorySelect.appendChild(option);
  });
}

function populateCategoryFilter() {

  const used = new Set();
  transactions.forEach((t) => used.add(t.category));

  const currentValue = categoryFilterSelect.value;

  categoryFilterSelect.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilterSelect.appendChild(allOption);

  const ordered = Object.keys(CATEGORIES.expense)
    .concat(Object.keys(CATEGORIES.income))
    .filter((c) => used.has(c));

  ordered.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = `${getCategoryEmoji(category, expenseTypeOf(category))} ${category}`;
    categoryFilterSelect.appendChild(option);
  });


  if (Array.from(categoryFilterSelect.options).some((o) => o.value === currentValue)) {
    categoryFilterSelect.value = currentValue;
  } else {
    categoryFilterSelect.value = "all";
    categoryFilter = "all";
  }
}

function expenseTypeOf(category) {
  if (CATEGORIES.expense[category]) return "expense";
  if (CATEGORIES.income[category]) return "income";
  return "other";
}



function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}



function setError(field, message) {
  const errorEl = document.getElementById(`${field}-error`);
  const inputEl = document.getElementById(field);
  if (errorEl) errorEl.textContent = message;
  if (inputEl && inputEl.tagName !== "SELECT") {
    inputEl.classList.toggle("invalid", Boolean(message));
  }
  if (inputEl && inputEl.tagName === "SELECT" && message) {
    inputEl.classList.add("invalid");
  }
}

function clearError(field) {
  setError(field, "");
}

function validateForm() {
  let isValid = true;

  const amount = parseFloat(amountInput.value);
  if (!amountInput.value.trim()) {
    setError("amount", "Please enter an amount.");
    isValid = false;
  } else if (isNaN(amount) || amount <= 0) {
    setError("amount", "Amount must be a positive number (e.g. 250.50).");
    isValid = false;
  } else if (amount > 999999999) {
    setError("amount", "Amount is too large.");
    isValid = false;
  } else {
    clearError("amount");
  }


  if (!categorySelect.value) {
    setError("category", "Please choose a category.");
    isValid = false;
  } else {
    clearError("category");
  }


  if (!dateInput.value) {
    setError("date", "Please pick a date.");
    isValid = false;
  } else if (!isValidDate(dateInput.value)) {
    setError("date", "Please enter a valid date.");
    isValid = false;
  } else {
    clearError("date");
  }


  const description = descriptionInput.value.trim();
  if (description.length > 60) {
    setError("description", "Description must be 60 characters or fewer.");
    isValid = false;
  } else {
    clearError("description");
  }

  return isValid;
}

function isValidDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}



function handleSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    showToast("Please fix the highlighted errors.", "error");
    return;
  }

  const type = document.querySelector('input[name="type"]:checked').value;
  const amount = Math.round(parseFloat(amountInput.value) * 100) / 100;
  const category = categorySelect.value;
  const date = dateInput.value;
  const description = descriptionInput.value.trim();

  if (editingId) {

    const index = transactions.findIndex((t) => t.id === editingId);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        type,
        amount,
        category,
        date,
        description,
      };
      showToast("✅ Transaction updated successfully.");
    } else {
      showToast("⚠️ Transaction not found. It may have been deleted.", "error");
      resetForm();
      renderAll();
      return;
    }
  } else {

    transactions.push({
      id: createId(),
      type,
      amount,
      category,
      date,
      description,
    });
    showToast("✅ Transaction added successfully.");
  }

  saveTransactions();
  resetForm();
  renderAll();
}

function startEdit(id) {
  const txn = transactions.find((t) => t.id === id);
  if (!txn) return;

  editingId = id;
  document.querySelector(`input[name="type"][value="${txn.type}"]`).checked = true;

  populateCategorySelect(txn.type, txn.category);
  amountInput.value = txn.amount;
  dateInput.value = txn.date;
  descriptionInput.value = txn.description;

  clearAllErrors();

  formTitle.textContent = " Edit Transaction";
  submitBtn.textContent = "Save Changes";
  cancelEditBtn.hidden = false;

  form.scrollIntoView({ behavior: "smooth", block: "start" });
  amountInput.focus();
}

function deleteTransaction(id) {
  const txn = transactions.find((t) => t.id === id);
  if (!txn) return;

  const prettyAmount = formatCurrency(txn.amount);
  const confirmed = window.confirm(
    `Delete this ${txn.type} of ${prettyAmount} (${txn.category})?`
  );
  if (!confirmed) return;

  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions();


  if (editingId === id) {
    resetForm();
  }

  renderAll();
  showToast("🗑️ Transaction deleted.");
}

function resetForm() {
  editingId = null;
  form.reset();
  document.querySelector('input[name="type"][value="expense"]').checked = true;
  populateCategorySelect("expense");
  dateInput.value = getTodayISO();
  clearAllErrors();

  formTitle.textContent = "➕ Add Transaction";
  submitBtn.textContent = "Add Transaction";
  cancelEditBtn.hidden = true;
}

function clearAllErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
  });
  document.querySelectorAll(".invalid").forEach((el) => {
    el.classList.remove("invalid");
  });
}



function getFilteredTransactions() {
  return transactions
    .filter((t) => {
      const typeMatch = currentFilter === "all" || t.type === currentFilter;
      const categoryMatch =
        categoryFilter === "all" || t.category === categoryFilter;
      return typeMatch && categoryMatch;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function handleFilterButton(e) {
  const btn = e.currentTarget;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.type;
  renderTransactions();
}



function renderAll() {
  renderTotals();
  renderTransactions();
  populateCategoryFilter();
  renderMonthlySummary();
}

function renderTotals() {
  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  totalIncomeEl.textContent = formatCurrency(incomeTotal);
  totalExpenseEl.textContent = formatCurrency(expenseTotal);
  totalBalanceEl.textContent = formatCurrency(incomeTotal - expenseTotal);


  const balance = incomeTotal - expenseTotal;
  totalBalanceEl.style.color =
    balance < 0 ? "var(--expense)" : balance > 0 ? "var(--income)" : "";
}

function renderTransactions() {
  const filtered = getFilteredTransactions();

  transactionCount.textContent = filtered.length;

  if (filtered.length === 0) {
    transactionList.innerHTML = "";
    emptyState.hidden = false;

    if (transactions.length === 0) {
      emptyMessage.textContent = "No transactions yet. Add your first one!";
    } else if (categoryFilter !== "all") {
      emptyMessage.textContent = "No transactions match this category filter.";
    } else {
      emptyMessage.textContent = "No transactions found for this filter.";
    }
    return;
  }

  emptyState.hidden = true;

  const items = filtered.map((txn) => {
    const isIncome = txn.type === "income";
    const emoji = getCategoryEmoji(txn.category, txn.type);
    const display =
      txn.description ||
      `${txn.category} ${isIncome ? "(income)" : "(expense)"}`;
    const sign = isIncome ? "+" : "−";

    const li = document.createElement("li");
    li.className = "transaction-item";
    li.dataset.id = txn.id;
    li.innerHTML = `
      <div class="tx-content">
        <p class="tx-description" title="${escapeHtml(display)}">${escapeHtml(display)}</p>
        <p class="tx-meta">
          <span class="tx-category">${escapeHtml(txn.category)}</span>
          <span> • </span>
          <span class="tx-date">${formatDateDisplay(txn.date)}</span>
        </p>
      </div>
      <span class="tx-amount ${isIncome ? "income" : "expense"}">${sign}${formatCurrency(txn.amount)}</span>
      <div class="tx-actions">
        <button class="icon-btn edit" title="Edit transaction" aria-label="Edit transaction">✏️</button>
        <button class="icon-btn delete" title="Delete transaction" aria-label="Delete transaction">🗑️</button>
      </div>
    `;

    return li;
  });

  transactionList.innerHTML = "";
  items.forEach((item) => transactionList.appendChild(item));
}



function renderMonthlySummary() {
  const month = monthSelect.value || getCurrentMonth();
  const [year, mon] = month.split("-").map(Number);

  const monthTxns = transactions.filter((t) => {
    const [ty, tm] = t.date.split("-").map(Number);
    return ty === year && tm === mon;
  });

  if (monthTxns.length === 0) {
    monthIncomeEl.textContent = formatCurrency(0);
    monthExpenseEl.textContent = formatCurrency(0);
    monthNetEl.textContent = formatCurrency(0);
    monthNetEl.style.color = "";
    monthTopCategoryEl.textContent = "—";
    monthTopCategoryAmountEl.textContent = "";
    renderChart([]);
    return;
  }

  const income = monthTxns
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = monthTxns
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const net = income - expense;


  const expenseByCat = {};
  monthTxns
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseByCat[t.category] = (expenseByCat[t.category] || 0) + t.amount;
    });

  let topCategory = null;
  let topAmount = 0;
  Object.entries(expenseByCat).forEach(([cat, amt]) => {
    if (amt > topAmount) {
      topAmount = amt;
      topCategory = cat;
    }
  });

  monthIncomeEl.textContent = formatCurrency(income);
  monthExpenseEl.textContent = formatCurrency(expense);

  monthNetEl.textContent = formatCurrency(net);
  monthNetEl.style.color =
    net < 0 ? "var(--expense)" : net > 0 ? "var(--income)" : "";

  if (topCategory) {
    monthTopCategoryEl.textContent = `${getCategoryEmoji(topCategory, "expense")} ${topCategory}`;
    monthTopCategoryAmountEl.textContent = formatCurrency(topAmount);
  } else {
    monthTopCategoryEl.textContent = "—";
    monthTopCategoryAmountEl.textContent = "";
  }

  const chartData = Object.entries(expenseByCat)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  renderChart(chartData);
}



function renderChart(data) {
  const ctx = chartCanvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = 240;

  chartCanvas.width = size * dpr;
  chartCanvas.height = size * dpr;
  chartCanvas.style.width = "200px";
  chartCanvas.style.height = "200px";
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, size, size);

  chartLegend.innerHTML = "";

  if (!data || data.length === 0) {
    chartEmpty.hidden = false;
    chartEmpty.style.display = "flex";
    chartCanvas.style.display = "none";
    return;
  }

  chartEmpty.hidden = true;
  chartEmpty.style.display = "none";
  chartCanvas.style.display = "block";

  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 10;
  const innerRadius = radius * 0.62;
  const startAngle = -Math.PI / 2;

  let currentAngle = startAngle;

  data.forEach((entry, i) => {
    const sliceAngle = (entry.amount / total) * 2 * Math.PI;
    const endAngle = currentAngle + sliceAngle;
    const color = CHART_COLORS[i % CHART_COLORS.length];


    ctx.beginPath();
    ctx.arc(cx, cy, radius, currentAngle, endAngle);
    ctx.arc(cx, cy, innerRadius, endAngle, currentAngle, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();


    ctx.beginPath();
    ctx.moveTo(
      cx + innerRadius * Math.cos(endAngle),
      cy + innerRadius * Math.sin(endAngle)
    );
    ctx.lineTo(
      cx + radius * Math.cos(endAngle),
      cy + radius * Math.sin(endAngle)
    );
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();


    const li = document.createElement("li");
    li.className = "legend-item";
    li.innerHTML = `
      <span class="legend-color" style="background:${color}"></span>
      <span class="legend-name" title="${escapeHtml(entry.category)}">${escapeHtml(entry.category)}</span>
      <span class="legend-amount">${formatCurrency(entry.amount)}</span>
    `;
    chartLegend.appendChild(li);

    currentAngle = endAngle;
  });


  ctx.fillStyle = "#0f172a";
  ctx.font = "700 19px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Total", cx, cy - 12);

  ctx.fillStyle = "#64748b";
  ctx.font = "600 13px Inter, sans-serif";
  ctx.fillText(formatCurrency(total), cx, cy + 12);
}


form.addEventListener("submit", handleSubmit);


cancelEditBtn.addEventListener("click", () => {
  resetForm();
  showToast("Edit cancelled.");
});


typeRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.checked) {
      const selectedType = e.target.value;
      if (!editingId) {

        populateCategorySelect(selectedType);
      } else {
        const current = categorySelect.value;
        populateCategorySelect(selectedType, current);
      }
      clearError("category");
    }
  });
});


amountInput.addEventListener("input", () => {
  if (amountInput.value.trim()) clearError("amount");
});
dateInput.addEventListener("change", () => {
  if (dateInput.value) clearError("date");
});
categorySelect.addEventListener("change", () => {
  if (categorySelect.value) clearError("category");
});


filterBtns.forEach((btn) => {
  btn.addEventListener("click", handleFilterButton);
});


categoryFilterSelect.addEventListener("change", (e) => {
  categoryFilter = e.target.value;
  renderTransactions();
});


monthSelect.addEventListener("change", renderMonthlySummary);


transactionList.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".icon-btn.edit");
  const deleteBtn = e.target.closest(".icon-btn.delete");

  if (editBtn) {
    const item = editBtn.closest(".transaction-item");
    startEdit(item.dataset.id);
  } else if (deleteBtn) {
    const item = deleteBtn.closest(".transaction-item");
    deleteTransaction(item.dataset.id);
  }
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && editingId) {
    resetForm();
    showToast("Edit cancelled.");
  }
});



function init() {

  dateInput.value = getTodayISO();
  monthSelect.value = getCurrentMonth();
  populateCategorySelect("expense");
  populateCategoryFilter();
  clearAllErrors();


  renderTotals();
  renderTransactions();
  renderMonthlySummary();

  console.log(`Expense Tracker loaded — ${transactions.length} transaction(s) found.`);
}

init();