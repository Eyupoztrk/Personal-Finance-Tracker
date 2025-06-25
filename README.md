# 💸 Personal-Finance-Tracker

**Personal-Finance-Tracker** is a RESTful API for managing personal finances. Users can track their income and expenses, set up budgets, manage savings goals, and categorize their financial activities with precision. This backend service is designed with scalability and modularity in mind, perfect for both personal use and financial planning applications.

---

## 🚀 Features

- 🔐 JWT-based user authentication system
- 🧾 Full transaction management (income & expense)
- 🏷️ Category support with type-based filtering
- 📊 Budget management with alert threshold settings
- 🔄 Many-to-many relationship between budgets and transactions
- 🧠 Savings goals with target dates and priorities
- 🔁 Recurring transaction tracking
- 🧩 RESTful modular API with PostgreSQL database

---

## 🛠️ Tech Stack

- **Node.js** v20 with **Express.js**
- **PostgreSQL** (via Knex.js or raw SQL)
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **Docker** support (optional)
- **Postman** for API testing

---

## 📁 Project Structure

personal-finance-tracker/
├── controllers/ # Business logic
├── routes/ # API endpoints
├── models/ # DB access and queries
├── middlewares/ # Auth & error handling
├── database/
│ ├── migrations/ # Schema files
│ └── seeds/ # Sample data
├── .env # Environment variables
├── server.js # Application entry point
└── README.md

yaml
Kopyala
Düzenle

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
npm install
2. Environment Setup
Create a .env file in the root:

env
Kopyala
Düzenle
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=finance_tracker
JWT_SECRET=your_secret_key
3. Run the Server
bash
Kopyala
Düzenle
npm run dev
⚠️ Make sure PostgreSQL is running and the database is created.

🧪 API Endpoints Overview
Method	Endpoint	Description
POST	/auth/register	Create a new user
POST	/auth/login	Login and receive a JWT
GET	/transactions	Get all transactions for user
POST	/transactions	Add a new transaction
GET	/categories	Retrieve available categories
POST	/categories	Create a custom category
GET	/budgets	List user budgets
POST	/budgets	Create a new budget
POST	/budget-transactions	Link a transaction to a budget
GET	/savings-goals	View savings goals
POST	/savings-goals	Create a new savings goal

📊 Key Entities
User: Authenticated entity with own financial data

Transaction: Income/expense with amount, date, type

Category: Classifies transactions by type (expense/income)

Budget: Monthly/periodic plans linked to categories

BudgetTransaction: Join table for many-to-many relation

SavingsGoal: Tracks progress toward financial targets

📈 Sample Use Cases
Track all credit card expenses for the month

Alert users when 80% of a budget is spent

Monitor spending by custom categories (e.g., Travel, Food)

Link a salary transaction to multiple budgets

Plan and follow up on saving goals like “New Car” or “Vacation”

🧰 Postman Testing
Import the provided Postman collection

Add your JWT_TOKEN in the Authorization tab

Test endpoints using valid payloads

Example POST request for a transaction:

json
Kopyala
Düzenle
{
  "amount": 200.00,
  "type": "expense",
  "description": "Groceries",
  "transaction_date": "2025-06-24",
  "categoryId": "b5fe96d9-931c-452a-b8db-ae718bf98fbc",
  "payment_method": "credit_card",
  "tags": ["market", "food"],
  "is_recurring": false
}
