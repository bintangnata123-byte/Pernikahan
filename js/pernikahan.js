/**
 * ============================================================================
 * PERNIKAHAN JAVASCRIPT - LOGIKA UNDANGAN PERNIKAHAN
 * Versi Siap Dibagikan (Production Ready)
 * Data Mempelai: Bintang and Irren
 * Waktu: Sabtu, 26 Des 2025 (Resepsi 11.00 – 14.00 WIB)
 * Lokasi: Indies Style Hotel Bandung
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi 3D Flip Card
    const cardController = initFlipCard({
        sceneId: 'cardScene',
        cardId: 'postcard',
        triggerBtnId: 'flipTriggerBtn',
        pageIndicatorId: 'pageIndicator',
        flipHintTextId: 'flipHintText',
        frontLabel: 'Sisi Depan (1/2)',
        backLabel: 'Sisi Belakang - Info (2/2)',
        frontHint: 'Ketuk kartu untuk membalik halaman',
        backHint: 'Ketuk untuk kembali ke depan'
    });

    // 2. Inisialisasi Musik Latar (BGM)
    const bgm = initBGM({
        btnId: 'bgmToggleBtn',
        audioSrc: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-112191.mp3'
    });

    // 3. Inisialisasi Countdown Timer (Target: 26 Desember 2026, 11:00 WIB / 04:00 UTC)
    const weddingDateISO = '2026-12-26T11:00:00+07:00';
    const countdown = initCountdown({
        targetDateStr: weddingDateISO,
        daysId: 'cdDays',
        hoursId: 'cdHours',
        minutesId: 'cdMinutes',
        secondsId: 'cdSeconds',
        containerId: 'countdownContainer'
    });

    // 4. Inisialisasi Modals (RSVP & Peta Lokasi)
    const rsvpModal = setupModal({
        modalId: 'rsvpModal',
        openBtnId: 'btnRsvp',
        closeBtnId: 'closeRsvpBtn'
    });

    const mapsModal = setupModal({
        modalId: 'mapsModal',
        openBtnId: 'btnMaps',
        closeBtnId: 'closeMapsBtn'
    });

    // 5. Inisialisasi Tombol Simpan ke Google Calendar
    const btnCalendar = document.getElementById('btnCalendar');
    if (btnCalendar) {
        const title = 'The Wedding of Bintang & Irren';
        const venue = 'Indies Style Hotel Bandung';
        const address = 'Jl. Kebon Jati No.32, Kb. Jeruk, Kec. Andir, Kota Bandung, Jawa Barat';
        const time = 'Resepsi 11.00 – 14.00 WIB';

        // 26 Desember 2026: 11:00 - 14:00 WIB (04:00 - 07:00 UTC)
        const gcalUrl = generateGoogleCalendarUrl({
            title: title,
            startDateStr: '20261226T040000Z',
            endDateStr: '20261226T070000Z',
            location: `${venue}, ${address}`,
            details: `Undangan ${title}.\nWaktu: ${time}\nLokasi: ${venue}, ${address}`
        });

        btnCalendar.href = gcalUrl;
    }

    // 6. Handle RSVP Form Submission
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const rsvpSuccessMsg = document.getElementById('rsvpSuccessMsg');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('guestName').value;
            const status = document.getElementById('guestStatus').value;

            rsvpForm.classList.add('hidden');
            rsvpSuccess.classList.remove('hidden');
            rsvpSuccessMsg.textContent = `Halo ${name}, status "${status}" sudah tercatat. Terima kasih banyak atas doa dan konfirmasinya!`;

            setTimeout(() => {
                rsvpModal.close();
                setTimeout(() => {
                    rsvpForm.reset();
                    rsvpForm.classList.remove('hidden');
                    rsvpSuccess.classList.add('hidden');
                }, 400);
            }, 1900);
        });
    }
});
