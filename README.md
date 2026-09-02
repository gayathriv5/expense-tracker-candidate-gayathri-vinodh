# Expense Tracker

A modern, responsive, and professional **Expense Tracker** web application built with **HTML5, Vanilla CSS, and JavaScript (ES6+)** — zero frameworks or external build dependencies required.

Track your income and expenses, monitor monthly spending trends with a native HTML5 Canvas donut chart, and store all data locally in your browser via **Local Storage**.

---

##  Features & Latest Updates

-  **Expense & Income Tracking** — Quickly log transactions with amount, category, date, and description.
-  **Edit & Delete** — Modify existing transactions in real-time or delete them with confirmation.
-  **Live Financial Summary** — Dynamic top cards displaying Total Income, Total Expenses, and Current Balance.
-  **Multi-Level Filters** — Instantly filter transactions by type (*All / Income / Expense*) and by specific categories.
-  **Monthly Breakdown** — Select any month to view income, expenses, net balance, and top spending category.
-  **Native Canvas Donut Chart** — High-DPI canvas chart depicting category-wise expense breakdown with an interactive legend.
-  **Professional Design System** — Sleek slate & indigo aesthetic, subtle glass gradients, soft depth shadows, crisp typography, and interactive button states.
-  **Universal Responsiveness** — Optimized for desktop frames (2560px, 1920px, 1440px, 1024px) and mobile frames (768px, 425px, 375px, 320px).
-  **Local Storage Persistence** — All data persists across page reloads and browser sessions.
-  **`npm run dev` Support** — Includes `package.json` for one-command local server execution.

---

## 📁 Project Structure

```
expense-tracker/
├── index.html        # Main HTML structure & semantic elements
├── styles.css        # Professional design system & media query breakpoints
├── script.js         # Application logic (CRUD, filters, Canvas chart, storage)
├── package.json      # NPM script configuration for local serving
└── README.md         # Project documentation
```

---

## 🚀 How to Run

### Option 1: Using NPM (Recommended)

Run the included development server script:

```bash
npm run dev
```

Then open **http://localhost:3000** in your web browser.

### Option 2: Double-click (Static File)

1. Double-click **`index.html`** in your file explorer.
2. The application opens directly in your browser.

### Option 3: Command Line Server

```bash
# Using Python 3
python -m http.server 8000
```

Then visit **http://localhost:8000** in your browser.

---

## 🎯 How to Use

1. **Add a Transaction**
   - Toggle between **Expense** or **Income**.
   - Enter the amount (₹), select a category, choose a date, and add an optional description.
   - Click **Add Transaction**.

2. **Edit a Transaction**
   - Click the ✏️ edit icon on any transaction card in the list.
   - Update fields and click **Save Changes** (or press `Esc` / click **Cancel Edit** to abort).

3. **Delete a Transaction**
   - Click the 🗑️ delete icon and confirm the removal dialog.

4. **Filter Transactions**
   - Use the **All / Income / Expense** toggle buttons.
   - Filter by specific categories using the category dropdown selector.

5. **Analyze Monthly Summary & Chart**
   - Select a month using the month picker in the **Monthly Summary** section.
   - Review your monthly income, expenses, net balance, top spending category, and category-wise donut chart.

---

## 🛠️ Data Storage

Transactions are automatically saved to browser **Local Storage** under the key:

```
expense-tracker-transactions
```

---

## 🧰 Tech Stack

- **HTML5** — Semantic page layout & structure
- **CSS3** — Custom properties (design tokens), Flexbox, Grid, layered shadows, media queries
- **Vanilla JavaScript (ES6+)** — DOM manipulation, Local Storage API, native Canvas API
- **Google Fonts** — Inter font family

---

## 📄 License

Free to use for personal and educational purposes.