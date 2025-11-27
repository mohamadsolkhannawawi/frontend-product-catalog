# Product Catalog - Frontend

Frontend aplikasi Platform Marketplace Product Catalog yang dibangun dengan React + Vite.

## 📋 Daftar Isi

-   [Prasyarat](#prasyarat)
-   [Instalasi](#instalasi)
-   [Konfigurasi](#konfigurasi)
-   [Menjalankan Aplikasi](#menjalankan-aplikasi)
-   [Struktur Project](#struktur-project)
-   [Fitur Utama](#fitur-utama)
-   [Development](#development)
-   [Troubleshooting](#troubleshooting)

## 🛠️ Prasyarat

Pastikan komputer Anda memiliki tools berikut dengan versi minimal yang ditentukan:

### 1. Node.js

```bash
node --version
```

**Versi yang diperlukan: Node.js 16.0 atau lebih tinggi**

Download dari: https://nodejs.org/

### 2. NPM (Node Package Manager)

```bash
npm --version
```

**Versi yang diperlukan: npm 7.0 atau lebih tinggi**

NPM biasanya sudah ter-install bersama Node.js

### 3. Git

```bash
git --version
```

**Versi yang diperlukan: Git 2.20 atau lebih tinggi**

Download dari: https://git-scm.com/downloads

### 4. Code Editor (Optional tapi disarankan)

-   **VS Code**: https://code.visualstudio.com/
-   **WebStorm**: https://www.jetbrains.com/webstorm/
-   **Sublime Text**: https://www.sublimetext.com/

## 📥 Instalasi

### Step 1: Clone Repository

```bash
git clone https://github.com/mohamadsolkhannawawi/frontend-product-catalog.git
cd frontend-product-catalog
```

### Step 2: Install Dependencies

```bash
npm install
```

Proses ini akan mengunduh semua package yang diperlukan (bisa memakan waktu beberapa menit pada kali pertama)

### Step 3: Verifikasi Instalasi

```bash
npm --version
node --version
```

## ⚙️ Konfigurasi

### 1. Setup Environment File

Copy file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Jika menggunakan Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### 2. Edit `.env.local`

Buka file `.env.local` dan pastikan konfigurasi sebagai berikut:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Product Catalog
```

**Penjelasan:**

-   `VITE_API_URL`: URL backend API (sesuaikan dengan server backend Anda)
-   `VITE_APP_NAME`: Nama aplikasi

### 3. Verifikasi Backend URL

Pastikan backend sudah berjalan di `http://localhost:8000` atau ubah di `.env.local` sesuai dengan port backend Anda.

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

Jika ingin menggunakan port berbeda:

```bash
npm run dev -- --port 3000
```

### Production Build

```bash
npm run build
```

File hasil build akan tersimpan di folder `dist/`

### Preview Production Build

```bash
npm run preview
```

## 📁 Struktur Project

```
frontend/
├── src/
│   ├── assets/                 # Static files (images, fonts, etc)
│   ├── components/             # Reusable React components
│   │   ├── features/          # Feature components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI components
│   ├── context/               # React Context (Auth, etc)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities & helpers
│   │   ├── axios.js           # Axios configuration
│   │   ├── constants.js       # API endpoints
│   │   └── utils.js           # Helper functions
│   ├── pages/                 # Page components (full pages)
│   │   ├── admin/            # Admin pages
│   │   ├── public/           # Public pages
│   │   └── seller/           # Seller pages
│   ├── routes/               # Routing configuration
│   ├── App.jsx               # Main App component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Public assets
├── .env.example              # Environment template
├── .env.local                # Environment variables (gitignored)
├── vite.config.js            # Vite configuration
├── package.json              # Project dependencies
├── package-lock.json         # Lock file for dependencies
└── index.html                # HTML template
```

## ✨ Fitur Utama

### Public Features

-   **Katalog Produk**: Browse semua produk dengan filter
-   **Search & Filter**: Cari produk berdasarkan kategori, lokasi, harga, rating
-   **Product Detail**: Lihat detail lengkap produk dan reviews
-   **User Review**: Berikan rating dan review untuk produk

### Seller Features

-   **Manage Products**: Create, edit, delete produk
-   **Product Status**: Activate/deactivate produk
-   **Dashboard**: Lihat overview penjualan
-   **Analytics**: Grafik stok, rating, dan lokasi pemberi rating
-   **Reports**: Generate PDF laporan stok, rating, dan restock

### Admin Features

-   **Platform Dashboard**: Lihat overview platform
-   **Seller Management**: Manage status seller (active/inactive)
-   **Analytics**: Grafik produk, toko, dan statistik seller
-   **Reports**: Generate PDF laporan seller, lokasi, dan top rated products

## 💻 Development

### Available Scripts

```bash
# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview

# Run tests (jika ada)
npm run test

# Format code dengan Prettier (jika configured)
npm run format

# Lint code dengan ESLint (jika configured)
npm run lint
```

### Debugging

#### Browser DevTools

1. Buka browser (Chrome/Firefox/Safari)
2. Tekan `F12` atau `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
3. Tab `Console` untuk melihat error
4. Tab `Network` untuk melihat API calls
5. Tab `Application/Storage` untuk melihat localStorage

#### React DevTools (Chrome Extension)

Install dari: https://chrome.google.com/webstore

-   Lihat component hierarchy
-   Debug state dan props
-   Performance profiling

#### VS Code Extensions (Recommended)

-   ES7+ React/Redux/React-Native snippets
-   Prettier - Code formatter
-   ESLint
-   Thunder Client (untuk testing API)

## 🐛 Troubleshooting

### Error: "npm: command not found"

-   Node.js belum terinstall dengan benar
-   Reinstall dari https://nodejs.org/
-   Restart terminal/computer

### Error: "Cannot find module"

```bash
# Clear node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

Di Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Error: "EADDRINUSE: address already in use :::5173"

Port 5173 sudah terpakai:

```bash
# Gunakan port berbeda
npm run dev -- --port 3000
```

### Error: "API call 404 Not Found"

-   Pastikan backend sudah berjalan di `http://localhost:8000`
-   Check `VITE_API_URL` di `.env.local`
-   Restart backend jika perlu

### Error: "Network error / Cannot connect to backend"

```bash
# Backend tidak berjalan, jalankan di terminal lain:
cd ../backend
php artisan serve
```

### Build gagal / Error saat npm run build

```bash
# Clear cache dan try again
npm run build -- --force

# Atau clear node_modules
rm -rf node_modules package-lock.json
npm install
npm run build
```

Di Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

### Blank page / Aplikasi tidak load

-   Clear browser cache: `Ctrl+Shift+Delete`
-   Check browser console untuk error: `F12`
-   Cek network tab untuk failed requests

## 🤝 Kolaborasi

### Langkah-langkah Kolaborasi

1. **Clone Repository Utama** (bukan fork):

    ```bash
    git clone https://github.com/mohamadsolkhannawawi/frontend-product-catalog.git
    cd frontend-product-catalog
    ```

2. **Create Branch Baru untuk fitur/fix**:

    ```bash
    git checkout -b feature/nama-fitur
    ```

    **Naming convention:**

    - `feature/nama-fitur` - untuk fitur baru
    - `fix/deskripsi-bug` - untuk bug fixes
    - `docs/deskripsi-doc` - untuk dokumentasi
    - `refactor/deskripsi` - untuk refactoring

3. **Develop dan Commit Changes**:

    ```bash
    # Check status
    git status

    # Stage changes
    git add .

    # Commit dengan format yang benar
    git commit -m "feat(scope): description"
    ```

4. **Push ke Repository**:

    ```bash
    git push origin feature/nama-fitur
    ```

5. **Create Pull Request**:
    - Go to: https://github.com/mohamadsolkhannawawi/frontend-product-catalog/pulls
    - Click "New Pull Request"
    - Select branch Anda sebagai source
    - Add deskripsi lengkap
    - Submit dan tunggu review dari tim

### Git Commit Format

**Format**: `type(scope): message`

**Type:**

-   `feat` - feature baru
-   `fix` - bug fix
-   `docs` - dokumentasi
-   `style` - formatting, tidak ada logic change
-   `refactor` - refactor code
-   `perf` - performance improvement
-   `test` - test related
-   `chore` - build process, dependencies

**Scope** (opsional): area yang di-affect

-   `auth` - authentication
-   `product` - product related
-   `dashboard` - dashboard related
-   `admin` - admin features
-   `filter` - filtering features

**Message**: Deskripsi singkat dalam bahasa Inggris

**Contoh:**

```
feat(product): add product filter by category
fix(dashboard): fix chart rendering error
docs(readme): update setup instructions
refactor(auth): simplify token handling
chore(deps): upgrade react to v18
```

### Workflow Tim

```bash
# 1. Update dari main branch sebelum develop
git fetch origin
git pull origin main

# 2. Buat branch fitur
git checkout -b feature/xyz

# 3. Develop dan test
npm run dev
# ... buat perubahan ...

# 4. Commit reguler dengan format yang benar
git add .
git commit -m "feat(xyz): add xyz feature"

# 5. Push ke origin
git push origin feature/xyz

# 6. Create PR dan minta review dari tim
```

### Best Practices

-   Selalu pull dari `main` sebelum membuat branch baru
-   1 branch = 1 fitur/fix
-   Commit messages harus jelas dan deskriptif
-   Push changes secara regular
-   Jangan langsung merge ke main, selalu via PR dengan review
-   Test fitur sebelum push ke repository

## 📄 Lisensi

Project ini dilindungi oleh lisensi MIT.

---

**Happy Coding! 🚀**
