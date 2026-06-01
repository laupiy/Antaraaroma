# Antara Aroma — Backend API

REST API untuk website Antara Aroma, dibangun dengan **Express.js**, **MySQL**, **JWT**, dan **bcrypt**.

---

## 📁 Struktur Folder

```
backend/
├── server.js                  # Entry point
├── db.js                      # Koneksi database (MySQL pool)
├── .env.example               # Template variabel lingkungan
├── .gitignore
├── package.json
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   ├── reviews.js
│   ├── homeContent.js
│   └── distribution.js
├── controllers/
│   ├── authController.js
│   ├── productsController.js
│   ├── categoriesController.js
│   ├── reviewsController.js
│   ├── homeContentController.js
│   └── distributionController.js
├── middleware/
│   └── auth.js                # JWT middleware
└── database/
    ├── schema.sql             # Schema + seed SQL
    └── seed.js                # Node seed script
```

---

## 🚀 Cara Install & Menjalankan

### 1. Clone / salin folder backend

```bash
cd backend
npm install
```

### 2. Buat file `.env`

Salin dari template:

```bash
cp .env.example .env
```

Isi nilai sesuai lingkungan kamu:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_database_kamu
DB_NAME=antaraaroma
JWT_SECRET=rahasia_jwt_panjang_dan_acak_isi_bebas
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Jangan pernah commit file `.env` ke Git.

### 3. Import schema database

```bash
mysql -u root -p < database/schema.sql
```

Atau buka MySQL Workbench / phpMyAdmin lalu jalankan isi file `database/schema.sql`.

### 4. (Opsional) Jalankan seed via Node

Jika ingin me-reset seed data (termasuk hash password admin baru):

```bash
node database/seed.js
```

### 5. Jalankan server

```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

Server akan berjalan di `http://localhost:5000`.

---

## 🔑 Kredensial Admin Default

| Field    | Nilai                    |
|----------|--------------------------|
| Email    | admin@antaraaroma.com    |
| Password | admin123                 |

> Password disimpan dalam bentuk hash bcrypt — **bukan plaintext**.

---

## 📡 Endpoint API

### Health Check
| Method | URL          | Auth | Keterangan        |
|--------|--------------|------|-------------------|
| GET    | /api/health  | -    | Status server     |

### Auth
| Method | URL             | Auth | Keterangan            |
|--------|-----------------|------|-----------------------|
| POST   | /api/auth/login | -    | Login, dapat token    |
| GET    | /api/auth/me    | ✅   | Data user yg login    |

### Products
| Method | URL                  | Auth | Keterangan         |
|--------|----------------------|------|--------------------|
| GET    | /api/products        | -    | Semua produk       |
| GET    | /api/products/:id    | -    | Detail produk      |
| POST   | /api/products        | ✅   | Tambah produk      |
| PUT    | /api/products/:id    | ✅   | Edit produk        |
| DELETE | /api/products/:id    | ✅   | Hapus produk       |

### Categories
| Method | URL                    | Auth | Keterangan       |
|--------|------------------------|------|------------------|
| GET    | /api/categories        | -    | Semua kategori   |
| POST   | /api/categories        | ✅   | Tambah kategori  |
| PUT    | /api/categories/:id    | ✅   | Edit kategori    |
| DELETE | /api/categories/:id    | ✅   | Hapus kategori   |

### Reviews
| Method | URL                         | Auth | Keterangan                   |
|--------|-----------------------------|------|------------------------------|
| GET    | /api/reviews                | -    | Review yang sudah diapprove  |
| GET    | /api/reviews?all=true       | ✅   | Semua review (admin)         |
| POST   | /api/reviews                | -    | Kirim review baru            |
| PATCH  | /api/reviews/:id/approve    | ✅   | Approve review               |
| DELETE | /api/reviews/:id            | ✅   | Hapus review                 |

### Home Content
| Method | URL                               | Auth | Keterangan          |
|--------|-----------------------------------|------|---------------------|
| GET    | /api/home-content                 | -    | Semua konten home   |
| PUT    | /api/home-content/:sectionKey     | ✅   | Update konten       |

### Distribution Areas
| Method | URL                      | Auth | Keterangan          |
|--------|--------------------------|------|---------------------|
| GET    | /api/distribution        | -    | Semua area          |
| POST   | /api/distribution        | ✅   | Tambah area         |
| PUT    | /api/distribution/:id    | ✅   | Edit area           |
| DELETE | /api/distribution/:id    | ✅   | Hapus area          |

---

## 🔒 Autentikasi JWT

Endpoint yang membutuhkan Auth (✅) harus menyertakan header:

```
Authorization: Bearer <token>
```

Token didapat dari response `POST /api/auth/login`.

---

## ☁️ Deploy ke Railway

1. Buat akun di [railway.app](https://railway.app)
2. Buat **New Project** → **Deploy from GitHub repo**
3. Tambahkan **MySQL Plugin** di project Railway
4. Set variabel lingkungan di tab **Variables**:
   - `DB_HOST` → dari Railway MySQL (lihat di tab Connect)
   - `DB_USER`, `DB_PASSWORD`, `DB_NAME` → sesuai Railway MySQL
   - `JWT_SECRET` → string acak panjang
   - `FRONTEND_URL` → URL Vercel frontend kamu
5. Railway otomatis mendeteksi `npm start`
6. Setelah deploy, buka Railway shell dan jalankan:
   ```bash
   mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < database/schema.sql
   ```
   Atau import `schema.sql` via Railway GUI.

---

## ☁️ Deploy ke Render

1. Buat akun di [render.com](https://render.com)
2. **New → Web Service** → hubungkan GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Buat **New → PostgreSQL** (atau gunakan PlanetScale/TiDB untuk MySQL)
6. Set Environment Variables sama seperti Railway di atas
7. Setelah deploy, jalankan seed via Render Shell

---

## 🌐 Konfigurasi Frontend (Vite)

Di file `.env` frontend (project React/Vite), tambahkan:

```env
VITE_API_URL=https://url-backend-railway-kamu.up.railway.app
```

Lalu di kode frontend, gunakan:

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## 📝 Catatan Penting

- **Jangan hardcode** password atau secret apapun di kode
- **JWT_SECRET** harus panjang dan benar-benar acak di production
- CORS sudah dikonfigurasi hanya mengizinkan domain dari `FRONTEND_URL`
- Mode production otomatis mengaktifkan SSL untuk koneksi database
