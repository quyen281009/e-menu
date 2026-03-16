## QR Restaurant E-Menu (MERN)

Fullstack QR restaurant e-menu with customer view and admin dashboard.

### Project structure

- **server**: Node.js + Express + MongoDB (Mongoose)
- **client**: React + Vite + TailwindCSS

### Backend (`server`)

1. Install dependencies:

```bash
cd server
npm install
```

2. Create `.env` in the project root (next to `.env.example`) and set:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/qr_e_menu
PORT=5000
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH= # optional, or leave empty to use default password admin123
```

If `ADMIN_PASSWORD_HASH` is empty, the default admin password is `admin123`.  
To set your own password, generate a bcrypt hash (Node REPL):

```bash
node
> const bcrypt = require('bcryptjs'); bcrypt.hash('yourPassword', 10).then(console.log);
```

3. Run the API server:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

### Frontend (`client`)

1. Install dependencies:

```bash
cd client
npm install
```

2. Run the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` with `/api` requests proxied to `http://localhost:5000`.

### Usage

- **Customer (no login)**:
  - Open `http://localhost:5173/` (this is the URL you encode as a QR code).
  - Browse categories, add items to cart, enter table number, and place order.
  - After ordering, the page shows **"Order sent to kitchen"**.

- **Admin**:
  - Go to `http://localhost:5173/admin/login`.
  - Log in with the configured admin credentials.
  - Manage menu items (create/update/delete, manage categories, image URLs).
  - View all orders, with table number and ordered items, and update status (`pending`, `preparing`, `completed`).

