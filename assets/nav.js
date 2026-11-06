// Phone menu — the button folds the nav links open and shut (styles: .menu-btn in concept.css / styles.css)
(function () {
  var nav = document.querySelector('nav');
  var btn = nav && nav.querySelector('.menu-btn');
  if (!btn) return;
  var set = function (open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a.lnk')) set(false); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); }
  });
})();
