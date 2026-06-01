require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../db");

async function seed() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE password = VALUES(password)`,
    ["Admin", "admin@antaraaroma.com", hashedPassword]
  );
  console.log("✅ Admin user — email: admin@antaraaroma.com | password: admin123");

  await db.query(
    `INSERT IGNORE INTO categories (name, icon, description, is_active, sort_order) VALUES
     ('Perfume Bottles',    '🧴', 'Botol parfum kaca premium berbagai ukuran dan desain', 1, 1),
     ('Spray Bottles',      '💨', 'Botol semprot atomizer dengan mekanisme pompa presisi', 1, 2),
     ('Skincare Jars',      '✨', 'Toples dan botol untuk produk perawatan kulit',         1, 3),
     ('Roll-On Bottles',    '🔮', 'Botol roll-on kaca dan logam untuk parfum minyak',      1, 4),
     ('Cosmetic Packaging', '💄', 'Kemasan kosmetik kustom dan set kemasan lengkap',        1, 5)`
  );
  console.log("✅ Default categories seeded");

  await db.query(
    `INSERT IGNORE INTO catalog_filter_options (type, value, sort_order) VALUES
     ('material','Borosilicate Glass',1),('material','Crystal Glass',2),
     ('material','Frosted Glass',3),('material','Tinted Glass',4),
     ('material','Amber Glass',5),('material','Acrylic',6),
     ('material','Aluminum',7),('material','Glass + Aluminum',8),
     ('material','Glass + Stainless Steel',9),('material','Amber Glass + SS Ball',10),
     ('material','Glass + SS Ball',11),('material','PP Plastic + Aluminum',12),
     ('material','Aluminum + PE Plastic',13),('material','Mixed (Glass + Acrylic)',14),
     ('material','Mixed Materials',15),
     ('minimum_order','100 sets',1),('minimum_order','200 sets',2),
     ('minimum_order','300 pcs',3),('minimum_order','500 pcs',4),
     ('minimum_order','1000 pcs',5)`
  );
  console.log("✅ Catalog filter options seeded");

  await db.query(
    `INSERT IGNORE INTO site_contacts (key_name, label, value) VALUES
     ('address',  'Alamat Kantor',      'Jl. Industri Raya No. 45, Tangerang, Banten 15820'),
     ('whatsapp', 'Telepon / WhatsApp', '+62 812-3456-7890'),
     ('email',    'Email',              'info@antaraaroma.com'),
     ('hours',    'Jam Operasional',    'Mon–Fri: 08:00–17:00 WIB'),
     ('instagram','Instagram',          '@antaraaroma'),
     ('nib',      'NIB',                '1234567890123')`
  );
  console.log("✅ Site contacts seeded");

  await db.query(
    `INSERT IGNORE INTO home_contents (section_key, content_json) VALUES
     ('hero', '{"title":"Supplier Kemasan Parfum & Kosmetik Premium","subtitle":"Solusi kemasan berkualitas tinggi untuk merek wewangian dan kecantikan Anda.","cta_primary":"Lihat Katalog","cta_secondary":"Hubungi Kami"}'),
     ('about', '{"title":"Tentang Antara Aroma","description":"ANTARA AROMA adalah supplier kemasan premium yang telah melayani 1.000+ merek di Indonesia."}'),
     ('whatsapp_cta', '{"number":"628123456789","message":"Halo, saya tertarik dengan produk kemasan Antara Aroma"}')`
  );
  console.log("✅ Home contents seeded");

  await db.query(
    `INSERT IGNORE INTO distribution_areas (city, province, product_category, total_orders, latitude, longitude, status) VALUES
     ('Jakarta',    'DKI Jakarta',      '["Botol Parfum","Kemasan Kosmetik","Kemasan Premium"]', '320+ Klien', -6.2088, 106.8456, 'Aktif'),
     ('Bandung',    'Jawa Barat',       '["Botol Parfum","Kemasan Skincare"]',                  '180+ Klien', -6.9175, 107.6191, 'Aktif'),
     ('Semarang',   'Jawa Tengah',      '["Kemasan Kosmetik","Vial & Ampul"]',                  '140+ Klien', -6.9932, 110.4203, 'Aktif'),
     ('Yogyakarta', 'DIY',              '["Botol Parfum","Kemasan Artisanal"]',                   '95+ Klien', -7.7956, 110.3695, 'Aktif'),
     ('Surabaya',   'Jawa Timur',       '["Botol Parfum","Kemasan Kosmetik","Kemasan Industri"]','210+ Klien', -7.2575, 112.7521, 'Aktif'),
     ('Bali',       'Bali',             '["Kemasan Premium","Botol Parfum","Kemasan Spa"]',     '120+ Klien', -8.3405, 115.0920, 'Aktif'),
     ('Medan',      'Sumatera Utara',   '["Botol Parfum","Kemasan Kosmetik"]',                  '160+ Klien',  3.5952,  98.6722, 'Aktif'),
     ('Makassar',   'Sulawesi Selatan', '["Kemasan Kosmetik","Botol Parfum"]',                  '110+ Klien', -5.1477, 119.4327, 'Aktif')`
  );
  console.log("✅ Distribution areas seeded");

  console.log("\n🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
