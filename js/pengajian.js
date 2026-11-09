/**
 * ============================================================================
 * PENGAJIAN JAVASCRIPT - LOGIKA UNDANGAN WALIMATUL URSY / PENGAJIAN
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
        backLabel: 'Sisi Belakang - Detail Pengajian (2/2)',
        frontHint: 'Ketuk kartu untuk melihat detail pengajian',
        backHint: 'Ketuk kartu untuk kembali ke depan'
    });

    // 2. Inisialisasi Musik Latar (BGM)
    const bgm = initBGM({
        btnId: 'bgmToggleBtn',
        audioSrc: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-112191.mp3'
    });

    // 3. Inisialisasi Countdown Timer (Target Awal: 13 Mei 2027, 09:30 WIB)
    let currentPengajianDate = '2027-05-13';
    let pengajianDateISO = `${currentPengajianDate}T09:30:00+07:00`;
    const countdown = initCountdown({
        targetDateStr: pengajianDateISO,
        daysId: 'cdDays',
        hoursId: 'cdHours',
        minutesId: 'cdMinutes',
        secondsId: 'cdSeconds',
        containerId: 'countdownContainer'
    });

    // 4. Inisialisasi Modals
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

    const customizeModal = setupModal({
        modalId: 'customizeModal',
        openBtnId: 'openCustomizeBtn',
        closeBtnId: 'closeCustomizeBtn'
    });

    // 5. Inisialisasi Tombol Simpan ke Google Calendar
    const btnCalendar = document.getElementById('btnCalendar');
    function updateCalendarLink(dateStr = currentPengajianDate) {
        const title = `Pengajian / Walimatul Ursy ${document.getElementById('displayNames').textContent.trim()}`;
        const venue = document.getElementById('displayVenueName').textContent.trim();
        const address = document.getElementById('displayVenueAddress').textContent.trim();
        const time = document.getElementById('displayTime').textContent.trim();

        // Konversi format tanggal YYYY-MM-DD -> YYYYMMDDTHHmmssZ (09:30 - 13:00 WIB = 02:30 - 06:00 UTC)
        const dateCompact = dateStr.replace(/[^0-9]/g, '');
        const startIso = (dateCompact.length === 8 ? dateCompact : '20270513') + 'T023000Z';
        const endIso = (dateCompact.length === 8 ? dateCompact : '20270513') + 'T060000Z';

        const gcalUrl = generateGoogleCalendarUrl({
            title: title,
            startDateStr: startIso,
            endDateStr: endIso,
            location: `${venue}, ${address}`,
            details: `Walimatul Ursy (Pengajian & Doa Bersama) ${title}.\nWaktu: ${time}\nLokasi: ${venue}, ${address}`
        });

        if (btnCalendar) {
            btnCalendar.href = gcalUrl;
        }
    }
    updateCalendarLink();

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
            rsvpSuccessMsg.textContent = `Terima kasih ${name}, konfirmasi "${status}" telah tercatat. Jazakumullahu khairan katsiran.`;

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

    // 7. Handle Live Customizer & Illustration Switching
    const customizeForm = document.getElementById('customizeForm');
    const inputAvatarStyle = document.getElementById('inputAvatarStyle');
    const inputAvatarFile = document.getElementById('inputAvatarFile');
    const customAvatarImg = document.getElementById('customAvatarImg');
    const svgMuslimCouple = document.getElementById('svgMuslimCouple');
    const svgFrameCouple = document.getElementById('svgFrameCouple');

    let hasUploadedCustomImage = false;

    if (inputAvatarFile) {
        inputAvatarFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    customAvatarImg.src = event.target.result;
                    customAvatarImg.classList.remove('hidden');
                    if (svgMuslimCouple) svgMuslimCouple.classList.add('hidden');
                    if (svgFrameCouple) svgFrameCouple.classList.add('hidden');
                    hasUploadedCustomImage = true;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (inputAvatarStyle) {
        inputAvatarStyle.addEventListener('change', () => {
            hasUploadedCustomImage = false;
            if (customAvatarImg) customAvatarImg.classList.add('hidden');
            if (inputAvatarStyle.value === 'muslim') {
                if (svgMuslimCouple) svgMuslimCouple.classList.remove('hidden');
                if (svgFrameCouple) svgFrameCouple.classList.add('hidden');
            } else {
                if (svgMuslimCouple) svgMuslimCouple.classList.add('hidden');
                if (svgFrameCouple) svgFrameCouple.classList.remove('hidden');
            }
        });
    }

    if (customizeForm) {
        customizeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            document.getElementById('displayHeader').textContent = document.getElementById('inputHeader').value;
            document.getElementById('displaySubtitle').textContent = document.getElementById('inputSubtitle').value;
            document.getElementById('displayNames').textContent = document.getElementById('inputNames').value;

            const rawDateFront = document.getElementById('inputDateFront').value;
            document.getElementById('displayDateFront').textContent = rawDateFront;
            document.getElementById('displayFullDate').textContent = document.getElementById('inputFullDate').value;
            document.getElementById('displayTime').textContent = document.getElementById('inputTime').value;

            const venueName = document.getElementById('inputVenueName').value;
            const venueAddr = document.getElementById('inputVenueAddress').value;

            document.getElementById('displayVenueName').textContent = venueName;
            document.getElementById('displayVenueAddress').textContent = venueAddr;
            document.getElementById('modalVenueTitle').textContent = venueName;
            document.getElementById('modalVenueSub').textContent = venueAddr;
            document.getElementById('googleMapsLink').href = `https://maps.google.com/?q=${encodeURIComponent(venueName + ' ' + venueAddr)}`;

            // Auto-update countdown & calendar jika format tanggal angka dikenali
            const cleanDate = rawDateFront.replace(/\s+/g, '').replace(/\./g, '-');
            if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
                currentPengajianDate = cleanDate;
                countdown.setTargetDate(`${cleanDate}T09:30:00+07:00`);
            }

            updateCalendarLink(currentPengajianDate);
            customizeModal.close();
        });
    }
});
