// js/selectors.js

$(document).ready(function () {

    // TAG alapján – első <p> kiemelése
    $('p').first().addClass('first-paragraph');

    // ASIDE animáció (történet oldalon)
    $('aside').hide().fadeIn(800);

    // ID alapján — csak akkor fut, ha a mező létezik (kapcsolat oldal)
    if ($('#nev').length) {
        $('#nev').attr('placeholder', 'Írd be a teljes neved');
    }

    // Gomb megjelenítése amikor legörgetünk
    window.onscroll = function () {
    let btn = document.getElementById("topBtn");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

// Görgetés tetejére animálva
document.getElementById("topBtn").onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};
});

