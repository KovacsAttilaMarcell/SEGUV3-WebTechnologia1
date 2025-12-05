// js/form-validation.js

$(document).ready(function () {

    const form = $('#kapcsolatForm');
    const inputs = form.find('input, textarea');

    $('#kuldGomb').on('click', function (e) {
        e.preventDefault();

        $('.hiba').remove();
        inputs.css('border', '1px solid #ccc');
        let errors = [];

        // ------- NÉV -------
        const nev = $('#nev').val().trim();
        if (!nev) {
            showError('#nev', 'Kérlek add meg a neved!', errors, false);
        } else if (nev.length < 3) {
            showError('#nev', 'A név túl rövid! Minimum 3 karakter legyen.', errors, true);
        }

        // ------- EMAIL -------
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showError('#email', 'Kérlek add meg az email címed!', errors, false);
        } else if (!emailRegex.test(email)) {
            showError('#email', 'Adj meg érvényes email címet!', errors, true);
        }

        // ------- DÁTUM -------
        const datum = $('#datum').val();
        if (!datum) {
            showError('#datum', 'Válassz egy dátumot!', errors, false);
        } else {
            const d = new Date(datum);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (d < today) {
                showError('#datum', 'A dátum nem lehet múltbeli!', errors, true);
            }
        }

        // ------- DATALIST - KÁVÉFAJTA -------
        const kave = $('#kavetipus').val().trim();
        if (!kave) {
            showError('#kavetipus', 'Válassz vagy írj be egy kávéfajtát!', errors, false);
        }

        // ------- RÁDIÓ -------
        const fogyasztas = $('input[name="fogyasztas"]:checked').val();
        if (!fogyasztas) {
            const msg = 'Válaszd ki, milyen típusú kávét iszol leggyakrabban!';
            $('fieldset').eq(0).after(`<span class="hiba">${msg}</span>`).hide().fadeIn(500);
            // Üres választás → alap hiba → nincs alert
            errors.push('#radio');
        }

        // ------- CHECKBOX -------
        const hozzavalok = $('input[name="hozzavalo"]:checked');
        if (hozzavalok.length === 0) {
            const msg = 'Legalább egy hozzávalót válassz!';
            $('fieldset').eq(1).after(`<span class="hiba">${msg}</span>`).hide().fadeIn(500);
            // Üres → nincs alert
            errors.push('#checkbox');
        }

        // ------- SZÍNVÁLASZTÓ -------
        const szin = $('#szin').val();
        if (!szin) {
            showError('#szin', 'Kérlek válassz egy színt!', errors, false);
        }

        // ------- MEGJEGYZÉS -------
        const megj = $('#megjegyzes').val().trim();
        if (!megj) {
            showError('#megjegyzes', 'A megjegyzés mező nem maradhat üresen!', errors, false);
        } else if (megj.length < 10) {
            showError('#megjegyzes', 'Legalább 10 karaktert írj!', errors, true);
        }

        // Ha hiba van → álljunk le
        if (errors.length > 0) {
            return;
        }

        // ------- BEÁGYAZOTT JSON -------
        const formData = {
            kapcsolat: {
                nev: nev,
                email: email,
                datum: datum,
                kedvenc_kave: kave,
                fogyasztas: fogyasztas,
                hozzavalok: hozzavalok.map(function () { 
                    return $(this).val(); 
                }).get(),
                szin: szin,
                megjegyzes: megj
            }
        };

        const blob = new Blob([JSON.stringify(formData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);

        const link = $('<a>')
            .attr('href', url)
            .attr('download', 'kapcsolat.json')
            .text('JSON letöltése')
            .hide()
            .fadeIn(800);

        $('#kuldGomb').after(link);

        alert("Köszönjük az üzenetet! Az adatok JSON formában is letölthetők.");

        form[0].reset();
    });

    // ------- HIBA FÜGGVÉNY -------
    function showError(selector, msg, arr, showAlert) {

        $(selector).css('border', '2px solid red');
        $(selector).after(`<span class="hiba">${msg}</span>`).hide().fadeIn(500);

        // showAlert = true → csak ezek kapnak felugró ablakot
        if (showAlert === true) {
            alert(msg);
        }

        arr.push(selector);
    }
});
