# Undangan Digital (Digital Invitation)

Proyek undangan digital modern berbasis **HTML, CSS, dan JavaScript murni** dengan desain estetika kartu pos Jepang 3D Flip Card (*hand-drawn ink & minimalist paper*).

Terdiri dari dua halaman undangan terpisah yang siap digunakan:
1. **Undangan Pernikahan** (`pernikahan.html`): Dilengkapi ilustrasi doodle pasangan romantis dengan bingkai foto, detail akad & resepsi, RSVP, peta lokasi, countdown timer, musik latar, dan simpan ke Google Calendar.
2. **Undangan Pengajian / Walimatul Ursy** (`pengajian.html`): Dilengkapi ornamen lengkung kubah Islami, ilustrasi busana muslim (peci & hijab), detail doa bersama, RSVP doa restu, countdown timer, musik latar, dan simpan ke Google Calendar.

---

## 📁 Struktur Direktori

```text
Undangan Digital/
├── pernikahan.html              # Halaman Undangan Pernikahan
├── pengajian.html               # Halaman Undangan Pengajian / Walimatul Ursy
├── css/
│   ├── common.css               # Gaya bersama (3D flip card, doodle button, BGM, countdown, modal)
│   ├── pernikahan.css           # Variabel & sentuhan spesifik pernikahan
│   └── pengajian.css            # Variabel & sentuhan spesifik pengajian
├── js/
│   ├── common.js                # Core controller: 3D Flip, BGM Audio, Countdown Timer, Google Calendar URL
│   ├── pernikahan.js            # Interaksi halaman pernikahan (RSVP, Maps, Live Customizer)
│   └── pengajian.js             # Interaksi halaman pengajian (Gaya Ilustrasi, RSVP, Maps, Customizer)
└── README.md                    # Dokumentasi penggunaan
```

---

## ✨ Fitur Unggulan

- **Efek 3D Flip Card Realistis**: Kartu dapat dibalik dengan mengetuk/mengklik kartu atau menekan tombol bantu di bawah. Dilengkapi bayangan realistis dan tekstur serat kertas (*paper grain noise*).
- **Background Music (BGM)**: Tombol piringan hitam mengambang di pojok kanan bawah yang berputar saat musik diputar, dilengkapi visualisasi gelombang suara (*music waves*). Musik otomatis dimulai pada interaksi pertama tamu, dan dilengkapi fallback melodi akustik ramah peramban.
- **Hitung Mundur (Countdown Timer)**: Widget hitung mundur interaktif (Hari, Jam, Menit, Detik) menuju hari H acara di sisi belakang kartu.
- **Simpan ke Google Calendar**: Tombol yang secara otomatis membuat tautan Google Calendar dengan judul acara, tanggal/waktu yang tepat, dan lokasi acara.
- **RSVP Interaktif**: Formulir konfirmasi kehadiran dan ucapan/doa dengan umpan balik langsung (*feedback alert*).
- **Petunjuk Peta & Google Maps**: Modal pratinjau sketsa denah minimalis dengan tombol langsung membuka rute di Google Maps.
- **Live Text & Illustration Customizer**: Tombol "Edit Teks" di bagian atas untuk menguji atau mengubah nama mempelai, tanggal, waktu, gedung, serta mengunggah foto kustom secara langsung tanpa menyentuh kode.

---

## 🚀 Cara Menjalankan

Anda dapat langsung membuka file:
1. Klik ganda file `pernikahan.html` atau `pengajian.html` di File Explorer untuk membukanya di browser apa pun (Chrome, Edge, Firefox, Safari).
2. Atau gunakan ekstensi **Live Server** di VS Code / Antigravity untuk pengalaman pengujian yang optimal.
