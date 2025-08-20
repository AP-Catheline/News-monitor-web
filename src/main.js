// --- Voice Command Support (Web Speech API) ---
function setupVoiceCommands(newsMonitorInstance) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('SpeechRecognition API not supported in this browser.');
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    // Alternate between English and Dutch to effectively support both
    const langs = ['en-US', 'nl-NL'];
    let langIndex = 0;
    function startRecognition() {
        recognition.lang = langs[langIndex];
        console.log('Starting SpeechRecognition with lang:', recognition.lang);
        try {
            recognition.start();
        } catch (e) {
            // start() can throw if already started; ignore
        }
    }

    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                const transcript = event.results[i][0].transcript.trim().toLowerCase();
                console.log('SpeechRecognition final transcript:', transcript);
                // More robust matching (English + Dutch)
                if (
                    transcript.includes('next') ||
                    transcript.includes('go to next') ||
                    transcript.includes('next video') ||
                    transcript.includes('volgende')
                ) {
                    console.log('Voice command detected: next');
                    newsMonitorInstance.handleVoiceCommand('next');
                } else if (
                    transcript.includes('previous') ||
                    transcript.includes('back') ||
                    transcript.includes('ga terug') ||
                    transcript.includes('vorige') ||
                    transcript.includes('terug')
                ) {
                    console.log('Voice command detected: back');
                    newsMonitorInstance.handleVoiceCommand('back');
                } else {
                    console.log('Voice detected, but no recognized command:', transcript);
                    const errorDiv = document.getElementById('voice-error');
                    if (errorDiv) {
                        const prompts = ['Try again', 'Say that again', 'Say next or go back'];
                        errorDiv.textContent = prompts[Math.floor(Math.random() * prompts.length)];
                        errorDiv.style.opacity = '1';
                        errorDiv.classList.remove('voice-glow');
                        void errorDiv.offsetWidth; // reflow to restart
                        errorDiv.classList.add('voice-glow');
                        clearTimeout(errorDiv._vgTimer);
                        errorDiv._vgTimer = setTimeout(() => {
                            errorDiv.classList.remove('voice-glow');
                        }, 1900);
                    }
                }
            }
        }
    };
    recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        const errorDiv = document.getElementById('voice-error');
        if (errorDiv) {
            errorDiv.textContent = 'Voice error: ' + event.error;
        }
    };
    recognition.onend = () => {
        // Toggle language and auto-restart for continuous listening
        langIndex = (langIndex + 1) % langs.length;
        startRecognition();
    };
    startRecognition();
    // Show initial instruction
    const errorDiv = document.getElementById('voice-error');
    if (errorDiv) {
        errorDiv.textContent = 'Say next or go back';
    }
}

// Background video handled in HTML/CSS; removed canvas animation

// Shorts list (moved from index.html)
window.SHORTS_LIST = [
    // Only Shorts and known embeddable videos
    'https://www.youtube.com/embed/M7gZNglmX4A',
    'https://www.youtube.com/embed/4RqgDwntRxo',
    'https://www.youtube.com/embed/MDxVChp_nIg',
    'https://www.youtube.com/embed/G6VWsywRpdw',
    'https://www.youtube.com/embed/8DR-Wz0A7J8',
    'https://www.youtube.com/embed/EWNTPoU7KAY',
    'https://www.youtube.com/embed/5BgjDkYoxto',
    'https://www.youtube.com/embed/uyLAq-rORyo',
    'https://www.youtube.com/embed/V_dIPKjsSUQ',
    'https://www.youtube.com/embed/kdfO3V6dC44',
    'https://www.youtube.com/embed/f1H1NyClOc0',
    'https://www.youtube.com/embed/7wIufwPMZ7w',
    'https://www.youtube.com/embed/PgGmpJbZjjk',
    'https://www.youtube.com/embed/LYdu922BaaM',
    'https://www.youtube.com/embed/dyG_pdg0uuQ',
    'https://www.youtube.com/embed/F7xjD00Rwy8',
    'https://www.youtube.com/embed/ei8s8jjl94Q',
    'https://www.youtube.com/embed/SDQYlG8JJfA',
    'https://www.youtube.com/embed/7uQyE1Ll0Mo',
    'https://www.youtube.com/embed/kQyLbzfADPU',
    'https://www.youtube.com/embed/Jxavzfnq0LE',
    'https://www.youtube.com/embed/kRbLhwHYOPc',
    'https://www.youtube.com/embed/ysNv46MjCR8',
    'https://www.youtube.com/embed/_ESfan-DvSQ',
    'https://www.youtube.com/embed/pWzMm96CTQU',
    'https://www.youtube.com/embed/mUrOy2D7ck4',
    'https://www.youtube.com/embed/_FVTYsE1rGg',
    'https://www.youtube.com/embed/lkW3cPSXr4Q',
    'https://www.youtube.com/embed/NXHIpeO4ON0',
    'https://www.youtube.com/embed/zaV9La9gpU0',
    'https://www.youtube.com/embed/hQt2NyEqJZc',
    'https://www.youtube.com/embed/v4sjYx9oI3E',
    'https://www.youtube.com/embed/hZQVkg-B3Js',
    'https://www.youtube.com/embed/L8d7uJSegCE',
    'https://www.youtube.com/embed/uyPkUi_fsYs',
    'https://www.youtube.com/embed/obO9Aw5jSkQ',
    'https://www.youtube.com/embed/p7R30sF9W0g',
    'https://www.youtube.com/embed/7m3AdUxYdYc',
    'https://www.youtube.com/embed/rvOpkUMChto',
    'https://www.youtube.com/embed/bFx8e_HzR6U',
    'https://www.youtube.com/embed/8K2O8HZ2CMM',
];
class NewsMonitor {
    constructor() {
        this.shorts = this.shuffleArray([...(window.SHORTS_LIST || [])]); // shuffled order
        this.currentIndex = 0;
        this.videoPlayer = document.getElementById('news-iframe');
        this.loadCurrentVideo();
        this.bindEvents();
        // Removed timer auto-advance; videos loop until user switches
        setupVoiceCommands(this);
        this.updateSideButtonsPosition();
    }
    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    // Handle recognized voice commands
    handleVoiceCommand(command) {
        if (command === 'next') {
            this.nextVideo();
        } else if (command === 'back') {
            this.previousVideo();
        }
    }

    // setupAutoAdvance removed (looping handled via embed params)

    // MediaPipe removed

    bindEvents() {
        // Keyboard navigation (Left/Right)
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.previousVideo();
                    break;
                case 'ArrowRight':
                    this.nextVideo();
                    break;
            }
        });

        // Button clicks
        const btnNext = document.getElementById('btn-next');
        const btnBack = document.getElementById('btn-go-back');
        if (btnNext) btnNext.addEventListener('click', () => this.nextVideo());
        if (btnBack) btnBack.addEventListener('click', () => this.previousVideo());

        // Fancy hover effects: track cursor within each command button
        const buttons = document.querySelectorAll('.command-btn');
        buttons.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const nx = x / rect.width; // 0..1
                const ny = y / rect.height; // 0..1
                // Set CSS vars for glow position
                btn.style.setProperty('--x', (nx * 100).toFixed(2) + '%');
                btn.style.setProperty('--y', (ny * 100).toFixed(2) + '%');
                // Center-normalized (-0.5..0.5)
                btn.style.setProperty('--dx', (nx - 0.5).toFixed(3));
                btn.style.setProperty('--dy', (ny - 0.5).toFixed(3));
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.setProperty('--dx', '0');
                btn.style.setProperty('--dy', '0');
            });
        });
        window.addEventListener('resize', () => this.updateSideButtonsPosition());
    }

    // Camera removed

    // onResults removed

    // Gesture detection removed

    // Gesture handlers removed
    // Volume indicators removed

    nextVideo() {
        this.currentIndex = (this.currentIndex + 1) % this.shorts.length;
        this.loadCurrentVideo();
        this.flashNavButton('next');
    }

    previousVideo() {
        this.currentIndex = (this.currentIndex - 1 + this.shorts.length) % this.shorts.length;
        this.loadCurrentVideo();
        this.flashNavButton('back');
    }

    loadCurrentVideo() {
        if (this.shorts.length > 0) {
            // Add autoplay param for first load
            let url = this.shorts[this.currentIndex];
            if (url.includes('youtube.com/embed/')) {
                // Ensure autoplay + loop (loop requires playlist=VIDEO_ID)
                const videoIdMatch = url.match(/embed\/([^?&]+)/);
                const videoId = videoIdMatch ? videoIdMatch[1] : '';
                const sep = url.includes('?') ? '&' : '?';
                url += `${sep}autoplay=1&loop=1${videoId ? `&playlist=${videoId}` : ''}`;
            }
            this.videoPlayer.src = url;
            // Reset overlay when switching
            const overlay = document.getElementById('bg-overlay');
            if (overlay) {
                overlay.classList.remove('overlay-active');
            }
            clearTimeout(this._overlayTimer);
            // Trigger glow effect around video player
            const wrapper = this.videoPlayer.closest('.video-player');
            if (wrapper) {
                wrapper.classList.remove('video-glow'); // restart animation
                // Force reflow to allow retrigger
                void wrapper.offsetWidth;
                wrapper.classList.add('video-glow');
                // Optional: remove class after animation ends to keep DOM clean
                clearTimeout(this._glowCleanupTimer);
                this._glowCleanupTimer = setTimeout(() => {
                    wrapper.classList.remove('video-glow');
                }, 1900);
            }
            requestAnimationFrame(() => this.updateSideButtonsPosition());
            // Schedule overlay activation after idle period (e.g., 8s on same video)
            if (overlay) {
                this._overlayTimer = setTimeout(() => {
                    overlay.classList.add('overlay-active');
                }, 8000);
            }
        } else {
            this.videoPlayer.src = '';
        }
    }
    updateSideButtonsPosition() {
        const videoWrapper = document.querySelector('.video-player');
        const leftWrapper = document.querySelector('.side-button-wrapper.left');
        const rightWrapper = document.querySelector('.side-button-wrapper.right');
        if (!videoWrapper || !leftWrapper || !rightWrapper) return;
        const rect = videoWrapper.getBoundingClientRect();
        const vw = window.innerWidth;
        if (vw <= 680) {
            // Mobile layout:
            // 1. Back button centered ABOVE the video (fully clear of message)
            // 2. Next button centered BELOW the video
            const backBtn = leftWrapper.querySelector('.command-btn');
            leftWrapper.style.left = '50%';
            // Top handled by CSS media query (fixed 36px)
            // Center NEXT button below video with existing spacing
            const GAP_BELOW = 40; // increased gap below video
            rightWrapper.style.left = '50%';
            // Provide bottom position via CSS variable for styling control
            document.documentElement.style.setProperty('--video-bottom', rect.bottom + 'px');
            return;
        }
        // Desktop / larger: keep side positioning at midpoint between edge and video
        const leftTarget = rect.left / 2;
        const rightTarget = rect.right + (vw - rect.right) / 2;
        const minPad = 40;
        const finalLeft = Math.max(minPad, leftTarget);
        const finalRight = Math.min(vw - minPad, rightTarget);
        leftWrapper.style.left = finalLeft + 'px';
        rightWrapper.style.left = finalRight + 'px';
        const vCenter = rect.top + rect.height / 2;
        leftWrapper.style.top = vCenter + 'px';
        rightWrapper.style.top = vCenter + 'px';
    }
    flashNavButton(direction) {
        const id = direction === 'next' ? 'btn-next' : 'btn-go-back';
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.classList.remove('nav-glow');
        void btn.offsetWidth; // reflow to restart animation
        btn.classList.add('nav-glow');
        clearTimeout(btn._navGlowTimer);
        btn._navGlowTimer = setTimeout(() => btn.classList.remove('nav-glow'), 1300);
    }
} // <-- Properly close NewsMonitor class
// Removed unused dynamic fadeInOut animation injection

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing News Monitor...');
    try {
        window.newsMonitor = new NewsMonitor();
        console.log('News Monitor initialized successfully');
        console.log('Voice controls: say "next" or "back".');
        console.log('Keyboard: ArrowLeft = previous, ArrowRight = next.');
    } catch (error) {
        console.error('Error initializing News Monitor:', error);
        const errEl = document.getElementById('voice-error');
        if (errEl) {
            errEl.textContent = '❌ Initialization error - Use keyboard/voice';
            errEl.style.display = 'block';
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        console.log('Tab hidden');
    } else {
        console.log('Tab visible');
    }
});
