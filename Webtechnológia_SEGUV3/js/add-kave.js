// add-kave.js
// Új kávé hozzáadása a listához (táblázathoz és kártyákhoz is)

$(document).ready(function () {

  const $kaveTablaBody  = $('#kaveLista tbody');
  const $kartyaContainer = $('#kaveKartyaContainer');
  const $ujKaveGomb     = $('#ujKave');

  // Biztonság kedvéért csak a kávéfajták oldalon fusson
  if (!$kaveTablaBody.length || !$ujKaveGomb.length) return;

  $ujKaveGomb.on('click', function (e) {
    e.preventDefault();

    // Globális tömb biztosítása
    if (!window.kaveAdatok) {
      window.kaveAdatok = [];
    }

    // Létrehozzuk az új kávé objektumot
    const ujKave = {
      nev: 'Mocha Special',
      tipus: 'Tejeskávé',
      erosseg: 'Közepes'
    };

    // Hozzáadás a tömbhöz
    window.kaveAdatok.push(ujKave);

    // Ha van globális frissítő függvény, hívjuk meg
    if (typeof window.frissitKaveNezet === 'function') {
      window.frissitKaveNezet();
    }

    // Animáció: az utolsó sor vagy kártya kiemelése
    const $tabla = $('#kaveLista');
    if ($tabla.is(':visible')) {
      const $utolsoSor = $kaveTablaBody.find('tr').last();
      $utolsoSor
        .css({ backgroundColor: '#fff2cc' })
        .animate({ backgroundColor: '#ffffff' }, 800);
    } else if ($kartyaContainer.is(':visible')) {
      const $utolsoKartya = $kartyaContainer.children().last();
      $utolsoKartya
        .css({ backgroundColor: '#fff2cc' })
        .animate({ backgroundColor: '#fffef5' }, 800);
    }
  });

});
