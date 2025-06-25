# 🧠 Personal-Finance-Tracker

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
- **PostgreSQL** (pgAdmin)
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **Docker** support 
- **Postman** for API testing

---

## 📦 Installation

### Clone the repository

#### 1. GitHub
- `git clone https://github.com/Eyupoztrk/Personal-Finance-Tracker.git`  
- `cd api`

#### 2. Docker
- `docker pull eyupoztrk/finance-tracker`  
- `docker run -d -p 3000:3000 --name finance-tracker eyupoztrk/finance-tracker`



