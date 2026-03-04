/* ===== Mobile Menu ===== */
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        nav.classList.remove('open');
      });
    });
  }
});

/* ===== Collection Filter & Search ===== */
(function() {
  var grid = document.getElementById('collectionGrid');
  if (!grid) return;

  var cards = Array.from(grid.querySelectorAll('.card'));
  var tabs = document.querySelectorAll('.category-tab');
  var searchBox = document.getElementById('searchBox');
  var countEl = document.getElementById('collectionCount');
  var noResults = document.getElementById('noResults');
  var currentCat = 'all';
  var currentSearch = '';
  var itemsSuffix = grid.dataset.suffix || '';

  function filter() {
    var visible = 0;
    cards.forEach(function(card) {
      var catMatch = currentCat === 'all' || card.dataset.category === currentCat;
      var searchMatch = true;
      if (currentSearch) {
        var text = (card.dataset.search || '').toLowerCase();
        searchMatch = text.indexOf(currentSearch) !== -1;
      }
      if (catMatch && searchMatch) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });
    if (countEl) countEl.textContent = visible + itemsSuffix;
    if (noResults) noResults.style.display = visible === 0 ? '' : 'none';
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentCat = tab.dataset.cat;
      filter();
    });
  });

  if (searchBox) {
    var timer;
    searchBox.addEventListener('input', function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        currentSearch = searchBox.value.trim().toLowerCase();
        filter();
      }, 150);
    });
  }
})();

/* ===== Lightbox ===== */
(function() {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var photos = [];
  var index = 0;

  function open(srcs, startIdx) {
    photos = srcs;
    index = startIdx || 0;
    lbImg.src = photos[index];
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    lbPrev.style.display = photos.length > 1 ? '' : 'none';
    lbNext.style.display = photos.length > 1 ? '' : 'none';
  }

  function close() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function prev(e) { if (e) e.stopPropagation(); index = (index - 1 + photos.length) % photos.length; lbImg.src = photos[index]; }
  function next(e) { if (e) e.stopPropagation(); index = (index + 1) % photos.length; lbImg.src = photos[index]; }

  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', function(e) { if (e.target === lightbox || e.target === lbImg) close(); });
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Expose globally for item pages
  window.openLightbox = open;

  // Auto-bind clickable photos
  document.querySelectorAll('[data-lightbox]').forEach(function(img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      var container = img.closest('[data-lightbox-group]');
      if (container) {
        var imgs = Array.from(container.querySelectorAll('[data-lightbox]'));
        var srcs = imgs.map(function(i) { return i.dataset.lightbox; });
        open(srcs, imgs.indexOf(img));
      } else {
        open([img.dataset.lightbox], 0);
      }
    });
  });
})();
