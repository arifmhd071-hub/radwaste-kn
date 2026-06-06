# ☢ RadWaste KN

**Dokumentasi & Monitoring Limbah Cair Radioaktif**  
Aplikasi PWA untuk fasilitas kedokteran nuklir — dapat diinstal sebagai APK Android via PWABuilder.

---

## 🗂 Struktur Proyek

```
radwaste-kn/
├── public/
│   ├── index.html        ← App utama (Firebase + PWA)
│   ├── manifest.json     ← PWA manifest
│   ├── sw.js             ← Service Worker (offline support)
│   └── icons/            ← Icon semua ukuran
├── scripts/
│   └── generate_icons.py ← Script regenerasi ikon
├── netlify.toml          ← Konfigurasi deploy Netlify
├── .gitignore
└── README.md
```

---

## ⚙️ Langkah 1 — Konfigurasi Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"** → beri nama (mis. `radwaste-kn`)
3. Setelah project dibuat, klik ikon **`</>`** (Web app) → daftarkan app
4. Salin `firebaseConfig` yang diberikan
5. Buka `public/index.html`, cari blok:

```javascript
const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_ANDA",
  authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
  ...
};
```

6. Tempelkan nilai dari Firebase Console

### Aktifkan Firestore
- Di Firebase Console → **Firestore Database** → **Create database**
- Pilih mode **Production** → pilih region (mis. `asia-southeast1`)

### Aktifkan Authentication
- **Authentication** → **Sign-in method** → aktifkan **Email/Password**

### Firestore Security Rules
Tempel rules ini di **Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🐙 Langkah 2 — Upload ke GitHub

```bash
# Di terminal lokal, masuk ke folder proyek
cd radwaste-kn

# Inisialisasi git
git init
git add .
git commit -m "feat: RadWaste KN PWA with Firebase"

# Buat repo baru di github.com lalu:
git remote add origin https://github.com/USERNAME/radwaste-kn.git
git branch -M main
git push -u origin main
```

---

## 🌐 Langkah 3 — Deploy ke Netlify

1. Buka [app.netlify.com](https://app.netlify.com/)
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub** → pilih repo `radwaste-kn`
4. Isi konfigurasi:
   - **Base directory**: *(kosongkan)*
   - **Build command**: *(kosongkan)*
   - **Publish directory**: `public`
5. Klik **Deploy site**
6. Tunggu deploy selesai → salin URL (mis. `https://radwaste-kn.netlify.app`)

> `netlify.toml` sudah dikonfigurasi otomatis — tidak perlu setting manual.

---

## 📱 Langkah 4 — Konversi ke APK dengan PWABuilder

1. Buka [pwabuilder.com](https://www.pwabuilder.com/)
2. Masukkan URL Netlify Anda (mis. `https://radwaste-kn.netlify.app`)
3. Klik **"Start"** — PWABuilder akan menganalisis PWA Anda
4. Pastikan semua skor **hijau** (Manifest ✓, SW ✓, HTTPS ✓)
5. Klik **"Package for stores"**
6. Pilih **Android** → klik **"Generate"**
7. Isi form:
   - **Package ID**: `com.namars.radwaste_kn`
   - **App name**: `RadWaste KN`
   - **Version**: `1.0.0`
8. Klik **"Download"** → dapatkan file `.apk` / `.aab`

### Install APK ke Android
```bash
# Via ADB (USB debugging aktif)
adb install radwaste-kn.apk

# Atau: kirim file ke HP → buka file manager → install
```

---

## 🔧 Tips Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Firebase error `permission-denied` | Pastikan Firestore Rules sudah di-deploy |
| PWABuilder skor rendah | Pastikan HTTPS aktif & manifest valid |
| Icon tidak muncul | Jalankan ulang `generate_icons.py` |
| SW tidak update | Ganti string `CACHE_NAME` di `sw.js` |
| Offline tidak berfungsi | Buka app sekali saat online dulu |

---

## 📋 Fitur Aplikasi

- ☢ Rekam harian limbah cair radioaktif per prosedur
- 🧪 Dukungan 7 radionuklida: ¹⁸F, ⁹⁹ᵐTc, ⁶⁸Ga, ¹³¹I, ¹⁷⁷Lu, ¹⁵³Sm, ¹⁸⁶Re
- 📊 Dashboard mingguan & bulanan dengan Chart.js
- 🛡 Status klirens otomatis (10 × T½)
- 🔥 Sinkronisasi realtime via Firebase Firestore
- 📴 Mode offline penuh dengan Service Worker
- 📥 Export CSV
- 📱 Installable sebagai PWA / APK

---

*RadWaste KN — dikembangkan untuk mendukung keselamatan radiasi di fasilitas kedokteran nuklir Indonesia*
