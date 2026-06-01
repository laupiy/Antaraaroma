-- ============================================================
-- Antara Aroma — Database Schema (v2)
-- Disesuaikan dengan struktur frontend React/Vite
-- ============================================================

CREATE DATABASE IF NOT EXISTS antaraaroma
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE antaraaroma;

-- ─── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)         NOT NULL,
  email      VARCHAR(150)         NOT NULL UNIQUE,
  password   VARCHAR(255)         NOT NULL,
  role       ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Categories ───────────────────────────────────────────────
-- Frontend memakai: name, icon (string/emoji), description, is_active, sort_order
CREATE TABLE IF NOT EXISTS categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL UNIQUE,
  icon        VARCHAR(100)  DEFAULT NULL,          -- emoji atau nama ikon
  description TEXT          DEFAULT NULL,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Products ─────────────────────────────────────────────────
-- Sesuai Product interface frontend:
--   name, category (→ category_id), sku (product_code), material,
--   capacity[] (→ JSON), finish, moq (minimum_order), badge, badge_color,
--   is_new, is_popular, image_url, description, tags[] (→ JSON), date_added
CREATE TABLE IF NOT EXISTS products (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(150)   NOT NULL,
  category_id    INT            DEFAULT NULL,
  product_code   VARCHAR(50)    DEFAULT NULL UNIQUE,   -- SKU
  material       VARCHAR(150)   DEFAULT NULL,
  capacity       JSON           DEFAULT NULL,           -- ["30ml","50ml","100ml"]
  finish         VARCHAR(150)   DEFAULT NULL,
  minimum_order  VARCHAR(50)    DEFAULT NULL,           -- "500 pcs" / "300 pcs"
  badge          VARCHAR(50)    DEFAULT NULL,           -- "Terlaris", "Baru", dsb.
  badge_color    VARCHAR(20)    DEFAULT NULL,           -- hex color "#27C7C3"
  is_new         TINYINT(1)     NOT NULL DEFAULT 0,
  is_popular     TINYINT(1)     NOT NULL DEFAULT 0,
  description    TEXT           DEFAULT NULL,
  image_url      VARCHAR(500)   DEFAULT NULL,
  tags           JSON           DEFAULT NULL,           -- ["glass","luxury"]
  is_active      TINYINT(1)     NOT NULL DEFAULT 1,
  date_added     DATE           DEFAULT (CURRENT_DATE),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ─── Reviews ──────────────────────────────────────────────────
-- Sesuai Review interface frontend:
--   productId, productName (denormalized), customerName, rating, comment,
--   status (pending/approved/rejected), dateAdded
CREATE TABLE IF NOT EXISTS reviews (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  product_id    INT          DEFAULT NULL,
  customer_name VARCHAR(100) NOT NULL,
  rating        TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT         NOT NULL,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ─── Catalog Filter Options ───────────────────────────────────
-- Admin bisa kelola opsi filter (material & minimum_order) secara dinamis
CREATE TABLE IF NOT EXISTS catalog_filter_options (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  type       ENUM('material','minimum_order') NOT NULL,
  value      VARCHAR(100) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  UNIQUE KEY uq_type_value (type, value)
);

-- ─── Home Contents ────────────────────────────────────────────
-- Menyimpan konten per section homepage dalam bentuk JSON string
CREATE TABLE IF NOT EXISTS home_contents (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  section_key  VARCHAR(100) NOT NULL UNIQUE,
  content_json TEXT         NOT NULL,              -- JSON string
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Site Contacts ────────────────────────────────────────────
-- Data kontak tetap website (alamat, email, WA, Instagram, NIB)
CREATE TABLE IF NOT EXISTS site_contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  key_name   VARCHAR(100) NOT NULL UNIQUE,         -- "whatsapp", "email", "address", dsb.
  label      VARCHAR(100) NOT NULL,
  value      TEXT         NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Contact Messages ─────────────────────────────────────────
-- Pesan masuk dari form Contact di frontend
-- Field sesuai form frontend: name, email, company, message
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  company    VARCHAR(150) DEFAULT NULL,
  message    TEXT         NOT NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Distribution Areas ───────────────────────────────────────
-- Sesuai distributionData di DistributionArea.tsx:
--   city, province, categories[] (→ JSON), status, totalOrders, lat, lng
CREATE TABLE IF NOT EXISTS distribution_areas (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  city             VARCHAR(100)  NOT NULL,
  province         VARCHAR(100)  NOT NULL,
  product_category JSON          DEFAULT NULL,     -- ["Botol Parfum","Kemasan Kosmetik"]
  total_orders     VARCHAR(50)   DEFAULT NULL,     -- "320+ Klien"
  latitude         DECIMAL(10,7) DEFAULT NULL,
  longitude        DECIMAL(10,7) DEFAULT NULL,
  status           ENUM('Aktif','Tidak Aktif') NOT NULL DEFAULT 'Aktif',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin user  (password: admin123, bcrypt hash)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@antaraaroma.com',
        '$2a$10$v2CVAiZGZCbSF/nXIy7HtOpuwv2nWIv9yX7R4b6/GBMYnZdslvlg.', 'admin')
ON DUPLICATE KEY UPDATE id = id;

-- Default categories (sesuai Category type di frontend)
INSERT IGNORE INTO categories (name, icon, description, is_active, sort_order) VALUES
  ('Perfume Bottles',    '🧴', 'Botol parfum kaca premium berbagai ukuran dan desain', 1, 1),
  ('Spray Bottles',      '💨', 'Botol semprot atomizer dengan mekanisme pompa presisi', 1, 2),
  ('Skincare Jars',      '✨', 'Toples dan botol untuk produk perawatan kulit',         1, 3),
  ('Roll-On Bottles',    '🔮', 'Botol roll-on kaca dan logam untuk parfum minyak',      1, 4),
  ('Cosmetic Packaging', '💄', 'Kemasan kosmetik kustom dan set kemasan lengkap',        1, 5);

-- Default catalog filter options
INSERT IGNORE INTO catalog_filter_options (type, value, sort_order) VALUES
  ('material', 'Borosilicate Glass',       1),
  ('material', 'Crystal Glass',            2),
  ('material', 'Frosted Glass',            3),
  ('material', 'Tinted Glass',             4),
  ('material', 'Amber Glass',              5),
  ('material', 'Acrylic',                  6),
  ('material', 'Aluminum',                 7),
  ('material', 'Glass + Aluminum',         8),
  ('material', 'Glass + Stainless Steel',  9),
  ('material', 'Amber Glass + SS Ball',   10),
  ('material', 'Glass + SS Ball',         11),
  ('material', 'PP Plastic + Aluminum',   12),
  ('material', 'Aluminum + PE Plastic',   13),
  ('material', 'Mixed (Glass + Acrylic)', 14),
  ('material', 'Mixed Materials',         15),
  ('minimum_order', '100 sets',  1),
  ('minimum_order', '200 sets',  2),
  ('minimum_order', '300 pcs',   3),
  ('minimum_order', '500 pcs',   4),
  ('minimum_order', '1000 pcs',  5);

-- Default site contacts
INSERT IGNORE INTO site_contacts (key_name, label, value) VALUES
  ('address',         'Alamat Kantor',      'Jl. Industri Raya No. 45, Tangerang, Banten 15820, Indonesia'),
  ('whatsapp',        'Telepon / WhatsApp', '+62 812-3456-7890'),
  ('email',           'Email',              'info@antaraaroma.com'),
  ('hours',           'Jam Operasional',    'Mon–Fri: 08:00–17:00 WIB'),
  ('instagram',       'Instagram',          '@antaraaroma'),
  ('nib',             'NIB',                '1234567890123');

-- Default home contents (JSON string per section)
INSERT IGNORE INTO home_contents (section_key, content_json) VALUES
  ('hero', '{"title":"Supplier Kemasan Parfum & Kosmetik Premium","subtitle":"Solusi kemasan berkualitas tinggi untuk merek wewangian dan kecantikan Anda. MOQ rendah, kualitas dunia.","cta_primary":"Lihat Katalog","cta_secondary":"Hubungi Kami"}'),
  ('about', '{"title":"Tentang Antara Aroma","description":"ANTARA AROMA adalah supplier kemasan parfum dan kosmetik premium yang telah melayani lebih dari 1.000 merek di Indonesia selama 10+ tahun.","stats":[{"value":"500+","label":"Produk"},{"value":"1000+","label":"Klien"},{"value":"10+","label":"Tahun"}]}'),
  ('whatsapp_cta', '{"number":"628123456789","message":"Halo, saya tertarik dengan produk kemasan Antara Aroma"}');

-- Default distribution areas (sesuai distributionData frontend)
INSERT IGNORE INTO distribution_areas (city, province, product_category, total_orders, latitude, longitude, status) VALUES
  ('Jakarta',    'DKI Jakarta',        '["Botol Parfum","Kemasan Kosmetik","Kemasan Premium"]', '320+ Klien', -6.2088000, 106.8456000, 'Aktif'),
  ('Bandung',    'Jawa Barat',         '["Botol Parfum","Kemasan Skincare"]',                  '180+ Klien', -6.9175000, 107.6191000, 'Aktif'),
  ('Semarang',   'Jawa Tengah',        '["Kemasan Kosmetik","Vial & Ampul"]',                  '140+ Klien', -6.9932000, 110.4203000, 'Aktif'),
  ('Yogyakarta', 'DIY',                '["Botol Parfum","Kemasan Artisanal"]',                  '95+ Klien', -7.7956000, 110.3695000, 'Aktif'),
  ('Surabaya',   'Jawa Timur',         '["Botol Parfum","Kemasan Kosmetik","Kemasan Industri"]','210+ Klien', -7.2575000, 112.7521000, 'Aktif'),
  ('Bali',       'Bali',               '["Kemasan Premium","Botol Parfum","Kemasan Spa"]',     '120+ Klien', -8.3405000, 115.0920000, 'Aktif'),
  ('Medan',      'Sumatera Utara',     '["Botol Parfum","Kemasan Kosmetik"]',                  '160+ Klien',  3.5952000,  98.6722000, 'Aktif'),
  ('Makassar',   'Sulawesi Selatan',   '["Kemasan Kosmetik","Botol Parfum"]',                  '110+ Klien', -5.1477000, 119.4327000, 'Aktif');
