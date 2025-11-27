// ajax.js – JSON betöltés + táblázat/kártya kirajzolás + szűrés/rendezés

$(document).ready(function () {
  const $kaveListaTbody   = $('#kaveLista tbody');
  const $searchInput      = $('#kaveKereses');
  const $tipusFilter      = $('#tipusFilter');
  const $rendezesNevBtn   = $('#rendezesNev');
  const $rendezesErossegBtn = $('#rendezesErosseg');
  const $viewToggleBtn    = $('#viewToggle');
  const $kartyaContainer  = $('#kaveKartyaContainer');
  const $tabla            = $('#kaveLista');

  // csak akkor fusson ez a kód, ha tényleg a kávéfajták oldalon vagyunk
  if (!$kaveListaTbody.length) return;

  // --- ÁLLAPOTVÁLTOZÓK ---
  let kaveAdatok = [];
  window.kaveAdatok = kaveAdatok;  // globális ref, hogy add-kave.js is lássa

  let searchText    = '';
  let tipusSzuro    = '';
  let rendezesiMezo = null;    // 'nev' vagy 'erosseg'
  let nevIrany      = 1;       // 1 = A→Z, -1 = Z→A
  let erossegIrany  = 1;       // 1 = gyenge→erős, -1 = erős→gyenge
  let kartyaNezet   = false;   // false = táblázat, true = kártya

  // --- JSON BETÖLTÉS ---
  $.getJSON('data/kavek.json')
    .done(function (data) {
      if (data && data.kavek) {
        // tömb feltöltése úgy, hogy a ref megmaradjon
        kaveAdatok.splice(0, kaveAdatok.length, ...data.kavek);
        applyFiltersAndRender();
      } else {
        $kaveListaTbody.html('<tr><td colspan="3">Nincsenek adatok.</td></tr>');
      }
    })
    .fail(function () {
      $kaveListaTbody.html('<tr><td colspan="3">Nem sikerült betölteni az adatokat.</td></tr>');
    });

  // --- SZŰRÉS + RENDEZÉS ALKALMAZÁSA ---
  function getSzurtRendezettLista() {
    let lista = kaveAdatok.slice();

    // keresés név szerint
    if (searchText) {
      const lower = searchText.toLowerCase();
      lista = lista.filter(k => (k.nev || '').toLowerCase().includes(lower));
    }

    // típus szűrő
    if (tipusSzuro) {
      lista = lista.filter(k => (k.tipus || '') === tipusSzuro);
    }

    // rendezés
    if (rendezesiMezo === 'nev') {
      lista.sort(function (a, b) {
        const an = (a.nev || '').toLowerCase();
        const bn = (b.nev || '').toLowerCase();
        if (an < bn) return -1 * nevIrany;
        if (an > bn) return  1 * nevIrany;
        return 0;
      });
    } else if (rendezesiMezo === 'erosseg') {
      lista.sort(function (a, b) {
        const ae = erossegErtek(a.erosseg);
        const be = erossegErtek(b.erosseg);
        if (ae < be) return -1 * erossegIrany;
        if (ae > be) return  1 * erossegIrany;
        return 0;
      });
    }

    return lista;
  }

  function applyFiltersAndRender() {
    const lista = getSzurtRendezettLista();

    if (kartyaNezet) {
      renderKaveKartyak(lista, $kartyaContainer);
      $tabla.hide();
      $kartyaContainer.show();
    } else {
      renderKaveTabla(lista, $kaveListaTbody);
      $kartyaContainer.hide();
      $tabla.show();
    }
  }

  // globálisan is elérhető, hogy add-kave.js újrarenderelhessen
  window.frissitKaveNezet = applyFiltersAndRender;

  // --- ESEMÉNYKEZELŐK ---

  // KERESÉS
  $searchInput.on('keyup', function () {
    searchText = $(this).val() || '';
    applyFiltersAndRender();
  });

  // TÍPUS SZŰRŐ
  $tipusFilter.on('change', function () {
    tipusSzuro = $(this).val() || '';
    applyFiltersAndRender();
  });

  // RENDEZÉS NÉV SZERINT
  $rendezesNevBtn.on('click', function () {
    rendezesiMezo = 'nev';
    nevIrany *= -1;  // kattintásra vált az irány
    applyFiltersAndRender();
  });

  // RENDEZÉS ERŐSSÉG SZERINT
  $rendezesErossegBtn.on('click', function () {
    rendezesiMezo = 'erosseg';
    erossegIrany *= -1;
    applyFiltersAndRender();
  });

  // NÉZET VÁLTÁSA – táblázat <-> kártyák
  $viewToggleBtn.on('click', function () {
    kartyaNezet = !kartyaNezet;
    applyFiltersAndRender();

    if (kartyaNezet) {
      $viewToggleBtn.text('🔄 Táblázat nézet');
    } else {
      $viewToggleBtn.text('🔄 Kártya nézet');
    }
  });
});

// --- SEGÉDFÜGGVÉNYEK ---

// TÁBLÁZAT KIÍRÁSA
function renderKaveTabla(lista, $tbody) {
  if (!$tbody.length) return;

  let html = '';
  lista.forEach(function (k) {
    html += `
      <tr class="kave-sor">
        <td>${escapeHtml(k.nev)}</td>
        <td>${escapeHtml(k.tipus)}</td>
        <td>${escapeHtml(k.erosseg)}</td>
      </tr>`;
  });

  $tbody.html(html);

  // Sorok finom beúsztatása
  $tbody.find('tr')
    .hide()
    .each(function (i) {
      $(this).delay(i * 80).fadeIn(200);
    });
}

// KÁRTYANEZET KIÍRÁSA
function renderKaveKartyak(lista, $container) {
  if (!$container.length) return;

  let html = '';
  lista.forEach(function (k) {
    html += `
      <div class="kave-kartya">
        <h3>${escapeHtml(k.nev)}</h3>
        <p><strong>Típus:</strong> ${escapeHtml(k.tipus)}</p>
        <p><strong>Erősség:</strong> ${escapeHtml(k.erosseg)}</p>
      </div>
    `;
  });

  $container.html(html);
}

// ERŐSSÉG SÚLYOZÁS A RENDEZÉSHEZ
function erossegErtek(szoveg) {
  const map = {
    'Lágy': 1,
    'Közepes': 2,
    'Erős': 3,
    'Nagyon erős': 4
  };
  return map[szoveg] || 99;
}

// HTML escaping (XSS védelem)
function escapeHtml(text) {
  return String(text).replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[s];
  });
}
