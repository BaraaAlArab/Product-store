# Product Store

A full-stack product store: Express + MongoDB backend, React (Vite) + Chakra UI frontend.

## Prerequisites

- Node.js 18+
- MongoDB running locally on the default port (`27017`)

## Setup

1. Install dependencies

   ```bash
   npm install
   cd frontend && npm install
   ```

2. Configure the environment

   Copy `backend/.env.example` to `backend/.env` and fill in a real `JWT_SECRET`:

   ```bash
   cp backend/.env.example backend/.env
   ```

   The `.env` file is gitignored — never commit real secrets.

3. Create the first admin (optional, do it once)

   ```bash
   node backend/scripts/seedAdmin.js
   ```

## Run

Start MongoDB, then in two terminals:

```bash
# Backend (http://localhost:5000)
npm run dev
```

```bash
# Frontend (http://localhost:5173)
cd frontend && npm run dev
```

The Vite dev server proxies `/api` requests to the backend.

## API

| Method | Route                          | Access   | Description          |
| ------ | ------------------------------ | -------- | -------------------- |
| POST   | `/api/users/register`          | public   | Register a client    |
| POST   | `/api/users/login`             | public   | Login, returns JWT   |
| GET    | `/api/users/me`                | any user | Current user         |
| POST   | `/api/users/changePassword`    | any user | Change password      |
| GET    | `/api/products`                | public   | List products        |
| POST   | `/api/products`                | admin    | Create product       |
| PUT    | `/api/products/:id`            | admin    | Update product       |
| DELETE | `/api/products/:id`            | admin    | Delete product       |
| GET    | `/api/users/admin/users`       | admin    | List all users       |
| PUT    | `/api/users/admin/users/:id`   | admin    | Update a user        |
| DELETE | `/api/users/admin/users/:id`   | admin    | Delete a user        |