# CR Mart Full Stack E-commerce Project

This is your Amazon clone upgraded with:

- Frontend: HTML, CSS, JavaScript, Bootstrap
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: Register/Login using JWT
- Features: Product API, search, order creation, order removal

## Folder Structure

```txt
CRMart_FullStack/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── models/
│   ├── Product.js
│   ├── User.js
│   └── Order.js
├── routes/
│   ├── productRoutes.js
│   ├── authRoutes.js
│   └── orderRoutes.js
├── data/
│   └── products.json
├── server.js
├── seed.js
├── package.json
└── .env.example
```

## How to Run

### 1. Install Node packages

```bash
npm install
```

### 2. Create `.env` file

Copy `.env.example` and rename it to `.env`.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/crmart
JWT_SECRET=change_this_secret_key
```

### 3. Start MongoDB

Make sure MongoDB is running locally, or use MongoDB Atlas and paste your Atlas URL in `MONGO_URI`.

### 4. Insert products into database

```bash
npm run seed
```

### 5. Start backend server

```bash
npm run dev
```

Open:

```txt
http://localhost:5000
```

## Backend API Routes

### Products

```txt
GET /api/products
GET /api/products/:id
```

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
```

### Orders

```txt
GET /api/orders
POST /api/orders
DELETE /api/orders/:id
```

## Important Note

Your original image files like `banner1.jpg`, `item1.jpg`, `product1.webp`, etc. were not inside the uploaded zip. If images do not show, copy your image files into the `public` folder.
