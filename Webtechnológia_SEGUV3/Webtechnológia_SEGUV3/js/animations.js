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

  /* ===== KERESŐ MEZŐ MIATTI UGRÁLÁS  ===== */

    let scrollLocked = false;

    $(document).on("input", "#kaveKereses", function () {

        scrollLocked = true;

        // Jelezzük látványosan
        $("#topBtn")
            .css({
                background: "red",
                opacity: "0.4"
            })
            .text("🔒");

        setTimeout(() => {
            scrollLocked = false;

            // Visszaáll az eredetibe
            $("#topBtn")
                .css({
                    background: "",
                    opacity: "1"
                })
                .text("⬆");
        }, 1000);
    });

    /* ===== TOP GOMB — csak akkor jelenjen meg, ha nem gépelünk ===== */

    window.addEventListener("scroll", function () {

        const topBtn = document.getElementById("topBtn");

        if (scrollLocked) {
            topBtn.style.display = "none";
            return;
        }

        if (document.documentElement.scrollTop > 300) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    });

});
