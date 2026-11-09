/**
 * ============================================================================
 * COMMON JAVASCRIPT - UNDANGAN DIGITAL (FLIP CARD AESTHETIC)
 * Handles: 3D Flip Card, Background Music (BGM), Countdown Timer,
 * Google Calendar Helper, and Modal Interactions.
 * ============================================================================
 */

// 1. FLIP CARD CONTROLLER
function initFlipCard({
    sceneId = 'cardScene',
    cardId = 'postcard',
    triggerBtnId = 'flipTriggerBtn',
    pageIndicatorId = 'pageIndicator',
    flipHintTextId = 'flipHintText',
    frontLabel = 'Sisi Depan (1/2)',
    backLabel = 'Sisi Belakang (2/2)',
    frontHint = 'Ketuk kartu untuk membalik halaman',
    backHint = 'Ketuk untuk kembali ke depan'
}) {
    const cardScene = document.getElementById(sceneId);
    const postcard = document.getElementById(cardId);
    const flipTriggerBtn = document.getElementById(triggerBtnId);
    const pageIndicator = document.getElementById(pageIndicatorId);
    const flipHintText = document.getElementById(flipHintTextId);

    if (!postcard || !cardScene) return { isFlipped: () => false, toggleFlip: () => {} };

    let isFlipped = false;

    function toggleFlip() {
        isFlipped = !isFlipped;
        postcard.classList.toggle('is-flipped', isFlipped);
        postcard.setAttribute('aria-expanded', isFlipped);

        if (pageIndicator) {
            pageIndicator.textContent = isFlipped ? backLabel : frontLabel;
        }
        if (flipHintText) {
            flipHintText.textContent = isFlipped ? backHint : frontHint;
        }

        // Trigger audio playback on first interaction if paused
        if (window.bgmController && !window.bgmController.hasStarted) {
            window.bgmController.play();
        }
    }

    cardScene.addEventListener('click', (e) => {
        // Prevent flip if clicking an interactive element (buttons, links, inputs)
        if (e.target.closest('button, a, input, select, textarea')) return;
        toggleFlip();
    });

    if (flipTriggerBtn) {
        flipTriggerBtn.addEventListener('click', () => {
            toggleFlip();
        });
    }

    // Keyboard support for accessibility
    cardScene.setAttribute('tabindex', '0');
    cardScene.setAttribute('role', 'button');
    cardScene.setAttribute('aria-label', 'Kartu Undangan Digital 3D');
    cardScene.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFlip();
        }
    });

    return {
        isFlipped: () => isFlipped,
        toggleFlip
    };
}

// 2. BACKGROUND MUSIC (BGM) MANAGER
function initBGM({
    btnId = 'bgmToggleBtn',
    audioSrc = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-112191.mp3'
} = {}) {
    const btn = document.getElementById(btnId);
    let audio = null;
    let isPlaying = false;
    let hasStarted = false;
    let synthFallbackActive = false;
    let synthInterval = null;
    let audioCtx = null;

    // Create audio element
    try {
        audio = new Audio();
        audio.src = audioSrc;
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0.5;

        // In case audio source fails (e.g. offline), enable ambient synth fallback
        audio.addEventListener('error', () => {
            console.info('Audio network load issue; preparing soft synth fallback.');
        });
    } catch (err) {
        console.warn('Audio tag creation warning:', err);
    }

    // Soft Ambient Melodic Synth Fallback (Offline / Fail-safe)
    function playAmbientChime() {
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            // Gentle acoustic pentatonic notes: E4, G#4, B4, C#5, E5
            const notes = [329.63, 415.30, 493.88, 554.37, 659.25];
            const note = notes[Math.floor(Math.random() * notes.length)];
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 2.6);
        } catch (e) {
            // Silence if audio context not permitted
        }
    }

    function startSynthFallback() {
        synthFallbackActive = true;
        playAmbientChime();
        if (!synthInterval) {
            synthInterval = setInterval(playAmbientChime, 2200);
        }
    }

    function stopSynthFallback() {
        synthFallbackActive = false;
        if (synthInterval) {
            clearInterval(synthInterval);
            synthInterval = null;
        }
    }

    function updateBtnState() {
        if (!btn) return;
        if (isPlaying) {
            btn.classList.add('is-playing');
            btn.setAttribute('title', 'Jeda Musik Latar');
            btn.setAttribute('aria-label', 'Jeda Musik Latar');
        } else {
            btn.classList.remove('is-playing');
            btn.setAttribute('title', 'Putar Musik Latar');
            btn.setAttribute('aria-label', 'Putar Musik Latar');
        }
    }

    function play() {
        hasStarted = true;
        if (audio && audio.src) {
            audio.play().then(() => {
                isPlaying = true;
                updateBtnState();
            }).catch(() => {
                // If autoplay blocked or file unavailable, start gentle synth
                startSynthFallback();
                isPlaying = true;
                updateBtnState();
            });
        } else {
            startSynthFallback();
            isPlaying = true;
            updateBtnState();
        }
    }

    function pause() {
        if (audio) {
            audio.pause();
        }
        stopSynthFallback();
        isPlaying = false;
        updateBtnState();
    }

    function toggle() {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }

    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
        });
    }

    // Auto-listen to first user click on document to unlock audio if permitted
    const unlockAudio = () => {
        if (!hasStarted) {
            play();
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    const controller = {
        play,
        pause,
        toggle,
        isPlaying: () => isPlaying,
        get hasStarted() { return hasStarted; }
    };

    window.bgmController = controller;
    return controller;
}

// 3. COUNTDOWN TIMER ENGINE
function initCountdown({
    targetDateStr,
    daysId = 'cdDays',
    hoursId = 'cdHours',
    minutesId = 'cdMinutes',
    secondsId = 'cdSeconds',
    containerId = 'countdownContainer'
}) {
    let targetTime = new Date(targetDateStr).getTime();
    let timerInterval = null;

    const daysEl = document.getElementById(daysId);
    const hoursEl = document.getElementById(hoursId);
    const minutesEl = document.getElementById(minutesId);
    const secondsEl = document.getElementById(secondsId);
    const container = document.getElementById(containerId);

    function update() {
        const now = new Date().getTime();
        const diff = targetTime - now;

        if (diff <= 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            if (container) {
                container.setAttribute('title', 'Hari bahagia telah tiba!');
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    timerInterval = setInterval(update, 1000);

    return {
        setTargetDate: (newDateStr) => {
            const parsed = new Date(newDateStr).getTime();
            if (!isNaN(parsed)) {
                targetTime = parsed;
                update();
            }
        },
        destroy: () => {
            if (timerInterval) clearInterval(timerInterval);
        }
    };
}

// 4. GOOGLE CALENDAR LINK GENERATOR
function generateGoogleCalendarUrl({
    title,
    startDateStr, // Format: YYYYMMDDTHHmmssZ
    endDateStr,
    location,
    details
}) {
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title || 'Undangan Acara',
        dates: `${startDateStr}/${endDateStr}`,
        details: details || '',
        location: location || ''
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// 5. ACCESSIBLE MODAL CONTROLLERS
function setupModal({
    modalId,
    openBtnId,
    closeBtnId,
    onOpen,
    onClose
}) {
    const modal = document.getElementById(modalId);
    const openBtn = openBtnId ? document.getElementById(openBtnId) : null;
    const closeBtn = closeBtnId ? document.getElementById(closeBtnId) : null;

    if (!modal) return;

    function open() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        if (onOpen) onOpen();
    }

    function close() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
        if (onClose) onClose();
    }

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            open();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            close();
        });
    }

    // Backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            close();
        }
    });

    // ESC key close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            close();
        }
    });

    return { open, close, el: modal };
}
