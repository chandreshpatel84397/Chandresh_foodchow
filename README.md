# 🍔 Food Chow – Full Stack Food Ordering System

## 📌 Overview

Food Chow is a full-stack food ordering web application where users can browse food items, add them to cart, and place orders.

This project includes:

* 🌐 Frontend (Next.js)
* 🔗 Backend (ASP.NET Core Web API)
* 🗄️ Database (SQL Server / your DB)

---

## 🛠️ Tech Stack

### Frontend:

* Next.js
* React.js
* CSS / Tailwind

### Backend:

* ASP.NET Core Web API
* C#
* Entity Framework Core

---

## 📁 Project Structure

foodchow/
├── app/ → Next.js application
├── backend/ → ASP.NET Core API

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally 👇

---

## 🚀 1. Clone Repository

```bash
git clone https://github.com/chandreshpatel84397/Chandresh_foodchow.git
cd Chandresh_foodchow
```

---

## 🌐 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

👉 Frontend will run on:
http://localhost:3000

---

## 🔗 3. Backend Setup (ASP.NET Core)

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

👉 Backend will run on:
http://localhost:5000 or https://localhost:5001

---

## 🔌 4. API Integration

Make sure frontend API calls point to backend URL:

Example:

```js
http://localhost:5000/api/
```

---

## 🗄️ 5. Database Setup

* Configure connection string in:
  appsettings.json

Example:

```json
"ConnectionStrings": {
  "DefaultConnection": "your_database_connection_string"
}
```

* Run migrations:

```bash
dotnet ef database update
```

---

## ✨ Features

* 🔐 User Authentication (Login/Signup)
* 🍽️ Browse Food Items
* 🛒 Add to Cart
* 📦 Order Placement
* 🧾 Admin Panel (Add/Edit/Delete Items)

---

## 📸 Screenshots

(Add your project screenshots here)

---

## 🤝 Contribution

Feel free to fork and improve this project.

---

## 📧 Contact

Developer: Chandresh
For any queries, feel free to reach out.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
