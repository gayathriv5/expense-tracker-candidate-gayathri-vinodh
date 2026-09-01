# 💸 Expense Tracker

A simple, responsive **Expense Tracker** web application built with **HTML, CSS, and Vanilla JavaScript** — no frameworks or build tools required.

Track your income and expenses, visualize monthly spending, and keep everything saved in your browser via **Local Storage**.

---

## ✨ Features

- ➕ **Add transactions** — Record income or expenses with amount, category, date, and optional description
- ✏️ **Edit transactions** — Click the ✏️ icon to load any transaction back into the form and update it
- 🗑️ **Delete transactions** — Click the 🗑️ icon (with a confirmation prompt) to remove a transaction
- 📊 **Summary cards** — Total income, total expenses, and current balance update live
- 🔍 **Filters** — Filter by type (All / Income / Expense) and by category
- 📅 **Monthly summary** — Pick any month to see its income, expenses, net result, and top spending category
- 🍩 **Category-wise chart** — A canvas-rendered donut chart showing the selected month's expenses by category, with a legend and amount breakdown
- 💾 **Local Storage** — All data persists after refreshing or closing the browser
- ✅ **Validation** — Inline error messages with helpful hints (positive amount, valid date, required fields, description length)
- 📱 **Fully responsive** — Optimized layouts for desktop and mobile screens

---

## 📁 Project Structure

```
expense-tracker/
├── index.html        # Page structure & markup
├── styles.css        # Styling & responsive layout
├── script.js         # Application logic (CRUD, filters, chart, storage)
└── README.md         # This file
```

---

## 🚀 How to Run

This is a static web app — no server or dependencies needed. Pick any option below.

### Option 1: Double-click (easiest)

1. Download / extract the project files.
2. Double-click **`index.html`**.
3. The app opens in your default browser. ✅

### Option 2: Command line (Windows)

Open a terminal (PowerShell or CMD) in the project folder and run:

```powershell
start index.html
```

### Option 3: Local server (recommended for best experience)

Running a tiny local server avoids any file:// restrictions and is great if you plan to develop further.

**Using Python:**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then visit **http://localhost:8000** in your browser.

**Using Node.js**

```bash
npx serve .
```

Then visit **http://localhost:3000** in your browser.

> 💡 Any static file server works — you can also use VS Code's **Live Server** extension: right-click `index.html` → **Open with Live Server**.

---

## 🎯 How to Use

1. **Add a transaction**
   - Choose **Expense** or **Income**.
   - Enter the amount (₹), pick a category, choose a date, and optionally add a description.
   - Click **Add Transaction**.

2. **Edit a transaction**
   - Click the ✏️ icon on any item.
   - The form switches to edit mode — change the fields and click **Save Changes** (or **Cancel Edit** / press `Esc` to abort).

3. **Delete a transaction**
   - Click the 🗑️ icon and confirm the dialog.

4. **Filter**
   - Use the **All / Income / Expense** buttons.
   - Use the **category dropdown** to narrow down further.

5. **View monthly summary & chart**
   - Use the month picker in the **Monthly Summary** panel to select a month.
   - See income, expenses, net, top category, and the category-wise expense donut chart.

6. **Persistence**
   - Everything is automatically saved to **Local Storage** — just refresh the page and your data is still there.

---

## 🛠️ Data Storage

Transactions are stored in your browser's **Local Storage** under the key:

```
expense-tracker-transactions
```

- Data is per-browser and per-device.
- Clearing browser data / site data will erase your transactions — use the **Export** feature (if added) or keep a backup.

---

## 🧩 Categories

| Expense | Income |
|---------|--------|
| 🍔 Food | 💰 Salary |
| 🛒 Groceries | 💻 Freelance |
| 🚗 Transport | 📈 Investment |
| 🏠 Rent | 🏪 Business |
| 💡 Utilities | 🎁 Gift |
| 🎬 Entertainment | 📦 Other |
| 🛍️ Shopping | |
| 🏥 Health | |
| 📚 Education | |
| ✈️ Travel | |
| 📦 Other | |

---

## 🧰 Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Flexbox, Grid, custom properties, media queries
- **Vanilla JavaScript (ES6+)** — DOM manipulation, Canvas API for the chart, Local Storage API
- **No external dependencies** — Zero installs, zero build step

---

## 📝 Notes

- Currency is formatted in **Indian Rupees (₹, en-IN locale)**.
- The donut chart is drawn with the native **Canvas API** — no chart library needed.
- Fonts load from **Google Fonts** (Inter). An internet connection is used only for the font; the app itself works fully offline.

---

## 🔜 Possible Enhancements

- Export / import data as JSON or CSV
- Search transactions by description
- Recurring transactions
- Budget limits per category
- Dark mode toggle
- PWA support for installable app

---

## 📄 License

Free to use for personal and educational purposes.