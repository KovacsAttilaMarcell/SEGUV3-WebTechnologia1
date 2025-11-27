// js/video-control.js

$(document).ready(function () {

    const video = $('#coffeeVideo')[0];
    if (!video) return;   // ha ezen az oldalon nincs videó, lépjen ki

    const $play    = $('#playBtn');
    const $pause   = $('#pauseBtn');
    const $restart = $('#restartBtn');
    const $mute    = $('#muteBtn');
    const $progressWrap = $('.video-progress');
    const $progressBar  = $('.video-progress-bar');
    const $speedBtns    = $('.speed-btn');
    const $stateLabel   = $('#videoState');
    const $timeLabel    = $('#videoTime');

    let wasPlayingBeforeHide = false;

    // ---- Segédfüggvény: idő formázás (mm:ss) ----
    function formatTime(sec) {
        if (isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' + s : s);
    }

    // ---- Lejátszás, szünet, újra, némítás ----
    $play.on('click', function () {
        if (video.paused) video.play();
    });

    $pause.on('click', function () {
        if (!video.paused) video.pause();
    });

    $restart.on('click', function () {
        video.currentTime = 0;
        video.play();
    });

    $mute.on('click', function () {
        video.muted = !video.muted;
        $mute.text(video.muted ? '🔊 Hang vissza' : '🔇 Némítás');
    });

    // ---- Sebesség gombok ----
    $speedBtns.on('click', function () {
        const rate = parseFloat($(this).data('rate'));
        video.playbackRate = rate;
        $speedBtns.removeClass('active');
        $(this).addClass('active');
    });

    // alap sebesség gomb kijelölés (1x)
    $speedBtns.filter('[data-rate="1"]').addClass('active');

    // ---- Progress bar frissítése ----
    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        $progressBar.css('width', (percent || 0) + '%');
        $timeLabel.text(
            formatTime(video.currentTime) + ' / ' + formatTime(video.duration)
        );
    }

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);

    // Progress bar-ra kattintva tekerés
    $progressWrap.on('click', function (e) {
        if (!video.duration) return;

        const offset = $(this).offset();
        const clickX = e.pageX - offset.left;
        const width  = $(this).width();
        const ratio  = clickX / width;

        video.currentTime = ratio * video.duration;
    });

    // ---- Állapot kijelző ----
    function setState(text) {
        $stateLabel.text(text);
    }

    video.addEventListener('play',   () => setState('▶ Lejátszás alatt…'));
    video.addEventListener('pause',  () => setState('⏸ Szünetelve'));
    video.addEventListener('ended',  () => {
        setState('✔ A videó véget ért');
        alert('A videó lejátszása befejeződött!');
    });

    // ---- Automatikus szünet, ha az oldal elhagyásra kerül ----
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            if (!video.paused) {
                wasPlayingBeforeHide = true;
                video.pause();
            }
        } else {
            if (wasPlayingBeforeHide) {
                video.play();
                wasPlayingBeforeHide = false;
            }
        }
    });
});
