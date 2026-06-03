# Productr - Workspace & Product Management System

Productr is a modern MERN stack application designed to manage workspace products. It includes secure OTP email authentication and a fully responsive dashboard for product CRUD operations.

---

## 🚀 Features

- **OTP Email Authentication**: Real-time OTP dispatch via `nodemailer`, database-backed verification, and resend code capabilities.
- **Product Management Dashboard**: Create, Read, Update, and Delete (CRUD) products.
- **Responsive Layout**: Designed to adapt seamlessly across mobile, tablet, and desktop screens with a slide-out navigation drawer.
- **Toggle Publishing**: Instantly publish/unpublish products to filter active inventories.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Mailing**: Nodemailer (SMTP configuration)

---

## 📂 Project Structure

```text
├── client/          # Frontend React Application
├── server/          # Backend Express REST API
├── package.json     # Root configuration with concurrent scripts
```

---

## ⚙️ Setup & Running Instructions

Follow these step-by-step instructions to get the application running locally:

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI connection)

### 2. Install Dependencies
Run the command below in the project root to install dependencies for the root, server, and client:
```bash
# Install root, client, and server dependencies
npm install && npm install --prefix server && npm install --prefix client
```

### 3. Backend Environment Setup
Create a `.env` configuration file inside the `server/` directory:
1. Copy the template:
   ```bash
   cp server/example.env server/.env
   ```
2. Open `server/.env` and update the database and SMTP mailing configurations:
   ```env
   PORT=5000
   MONGODB_URI="your_mongodb_connection_string"
   
   # SMTP Email Configuration (e.g. Gmail App Passwords)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_USER="your_email@gmail.com"
   EMAIL_PASS="your_email_app_password"
   ```

### 4. Start the Application
From the **root** folder, start both the frontend and backend servers concurrently:
```bash
npm run dev
```

- **Frontend Application**: Running on [http://localhost:5173/](http://localhost:5173/)
- **Backend REST API**: Running on [http://localhost:5000/](http://localhost:5000/)

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/send-otp` | Generates & sends secure 6-digit OTP code |
| `POST` | `/api/auth/verify-otp` | Verifies submitted OTP against MongoDB record |
| `GET` | `/api/products` | Retrieves all product items |
| `POST` | `/api/products` | Creates a new product item |
| `PUT` | `/api/products/:id` | Updates details of an existing product |
| `PATCH` | `/api/products/:id/toggle-publish` | Toggles the publish visibility status of a product |
| `DELETE` | `/api/products/:id` | Deletes a product item |
