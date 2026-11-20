/* Lógica del menú de navegación responsive (mobile-first).
   El botón hamburguesa solo es visible por CSS por debajo de 768px. */

(function () {
  'use strict';

  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  if (!toggle || !menu) return;

  var mqDesktop = window.matchMedia('(min-width: 768px)');

  function isOpen() {
    return menu.classList.contains('is-open');
  }

  function setMenu(open, focusToggle) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute(
      'aria-label',
      open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
    if (!open && focusToggle) toggle.focus();
  }

  // Abrir / cerrar con el botón hamburguesa
  toggle.addEventListener('click', function () {
    setMenu(!isOpen(), false);
  });

  // Cerrar al elegir una sección
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false, false);
    });
  });

  // Cerrar con Escape y devolver el foco al botón
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      setMenu(false, true);
    }
  });

  // Cerrar al hacer clic fuera de la navegación
  document.addEventListener('click', function (event) {
    if (!isOpen()) return;
    if (event.target instanceof Element && event.target.closest('.nav')) return;
    setMenu(false, false);
  });

  // Al pasar a escritorio el menú queda siempre visible: reinicia el estado
  function onBreakpointChange(event) {
    if (event.matches) setMenu(false, false);
  }

  if (typeof mqDesktop.addEventListener === 'function') {
    mqDesktop.addEventListener('change', onBreakpointChange);
  } else if (typeof mqDesktop.addListener === 'function') {
    mqDesktop.addListener(onBreakpointChange);
  }
})();
