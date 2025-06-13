# 📚 BookWorm Library Management System

**DilibraryDashboard Librario** adalah aplikasi web berbasis Node.js dan Express yang dirancang untuk membantu pengelolaan perpustakaan secara digital oleh administrator. Sistem ini dilengkapi dengan fitur autentikasi JWT, manajemen data buku, pengguna, dan cabang, serta antarmuka dashboard yang modular, dinamis, dan mudah diperluas.

Dibangun dengan pendekatan Clean Code, aplikasi ini menerapkan Table-Driven Design, Runtime Configuration, dan Parameterization untuk memastikan kode mudah diuji, dirawat, dan dikembangkan dalam jangka panjang.

---

## ✨ Fitur Unggulan

### 🔐 Autentikasi JWT
- Form login/signup dengan enkripsi password (bcrypt)
- Penyimpanan token JWT via otomatis
- Middleware otorisasi di backend (`auth.authenticate`)
- Redirect otomatis jika token tidak valid

### 📊 Dashboard Admin
- Tampilkan waktu & tanggal secara real-time
- Navigasi antar modul: Buku, Pengguna, dan Cabang

### 📚 Modul Manajemen Data
Setiap modul memiliki kemampuan:
- **CRUD** (Create, Read, Update, Delete)
- Form dinamis untuk tambah/edit
- Tabel interaktif 

---

## 🧼 Penerapan Clean Code

### ✅ Table-Driven Construction
Mengurangi logika if/else dan switch dengan mapping objek:
Kelebihan:
- Menghindari pengulangan kode (DRY)
- Mudah menambahkan/mengubah jenis error baru
- Pola konsisten yang mudah di-debug

### ✅ Parameterization/Generics
Untuk menghindari duplikasi fungsi getAll pada seluruh manajemen:
Kelebihan:
- Satu fungsi untuk banyak entitas
- Mengurangi panjang file controller
- Konsistensi logika across multiple resources

### ✅ Runtime Configuration
Proyek ini tidak mengandalkan nilai hardcoded untuk pengaturan penting 
seperti JWT_SECRET dan JWT_EXPIRES_IN. Sebaliknya, 
menggunakan pendekatan runtime getter property yang membaca dari process.env secara dinamis:
Kelebihan:
- Mudah dikonfigurasi tanpa ubah kode
- Memisahkan konfigurasi dari logika bisnis
- Cocok untuk berbagai lingkungan: development, staging, production

✨ Hasil dari Clean Code Ini:

💡 Kode lebih eksplisit dan mudah dibaca
🚀 Performa development & debugging lebih cepat
🔧 Siap di-scale ke fitur dan entitas lainnya dengan minimal refactor
