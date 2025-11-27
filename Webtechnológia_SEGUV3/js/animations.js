// js/animations.js
$(document).ready(function () {

  $('#animacioGomb').on('click', function () {
    $('#rejtettSzoveg').slideToggle(400, function () {
      $(this)
        .animate({ backgroundColor: "#fff7e6" }, 200)
        .delay(400)
        .animate({ backgroundColor: "#ffffff" }, 200);
    });
  });

  /* ===== KERESŐ MEZŐ MIATTI UGRÁLÁS JAVÍTÁSA ===== */

let scrollLocked = false;

// ha gépel a keresőbe → lezárjuk a scroll figyelést
$(document).on("input", "#kaveKereses", function () {
    scrollLocked = true;

    // fél másodpercig nem enged scroll eseményt
    setTimeout(() => {
        scrollLocked = false;
    }, 500);
});

/* ===== TOP GOMB — csak akkor jelenik meg, ha nem gépelünk ===== */

window.addEventListener("scroll", function () {

    if (scrollLocked) return; // keresés közben nem történik semmi

    const topBtn = document.getElementById("topBtn");

    if (document.documentElement.scrollTop > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
});

});
