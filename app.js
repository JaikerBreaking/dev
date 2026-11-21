/* Lógica del portafolio: menú responsive, sección activa, formulario de
   contacto, mapa bajo demanda y pausa de la lluvia al ocultar la pestaña. */

(function () {
  'use strict';

  /* ---------- Menú de navegación (móvil) ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  if (toggle && menu) {
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

      // Al abrir, el foco entra al primer enlace; al cerrar, vuelve al botón.
      if (open && focusToggle) {
        var firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
      if (!open && focusToggle) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      setMenu(!isOpen(), true);
    });

    // Cerrar al elegir una sección
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false, false);
      });
    });

    // Escape cierra y devuelve el foco; Tab queda confinado dentro del menú
    document.addEventListener('keydown', function (event) {
      if (!isOpen()) return;

      if (event.key === 'Escape') {
        setMenu(false, true);
        return;
      }

      if (event.key !== 'Tab') return;

      var focusables = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
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
  }

  /* ---------- Enlace activo según la sección visible ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- Formulario: abre el correo del visitante ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var emailLink = document.querySelector('.contact__list a[href^="mailto:"]');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!emailLink) {
        status.textContent = 'Falta configurar el correo de contacto.';
        return;
      }

      var data = new FormData(form);
      var nombre = String(data.get('nombre') || '').trim();
      var correo = String(data.get('email') || '').trim();
      var mensaje = String(data.get('mensaje') || '').trim();

      if (!nombre || !correo || !mensaje) {
        status.textContent = 'Completa todos los campos antes de enviar.';
        return;
      }

      var destinatario = emailLink.getAttribute('href').replace(/^mailto:/, '');
      var asunto = encodeURIComponent('Contacto desde el portafolio: ' + nombre);
      var cuerpo = encodeURIComponent(
        'Nombre: ' + nombre + '\nCorreo: ' + correo + '\n\n' + mensaje
      );

      status.textContent = 'Tu aplicación de correo se abrirá con el mensaje listo. ' +
        'Si no se abre, escríbeme directamente a jaikerbreaking@gmail.com.';
      window.location.href = 'mailto:' + destinatario + '?subject=' + asunto + '&body=' + cuerpo;
    });
  }

  /* ---------- Mapa bajo demanda ---------- */
  var mapButton = document.getElementById('map-button');
  var mapContainer = document.getElementById('contact-map');

  if (mapButton && mapContainer) {
    mapButton.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.title = 'Mapa de la ubicación aproximada de Jaiker Aponte en Barinas, Venezuela';
      iframe.src = mapButton.getAttribute('data-map-src');
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      mapContainer.textContent = '';
      mapContainer.appendChild(iframe);
    });
  }

  /* ---------- Botón flotante de WhatsApp ---------- */
  /* El número se lee del enlace tel: de Contacto para no duplicarlo.
     wa.me exige solo dígitos (sin +, espacios ni guiones). */
  var whatsapp = document.getElementById('whatsapp-float');
  var phoneLink = document.querySelector('.contact__list a[href^="tel:"]');

  if (whatsapp && phoneLink) {
    var digits = phoneLink.getAttribute('href').replace(/^tel:/, '').replace(/\D/g, '');
    if (digits) {
      var mensaje = encodeURIComponent('Hola Jaiker, vine desde tu portafolio.');
      whatsapp.href = 'https://wa.me/' + digits + '?text=' + mensaje;
    }
  }

  /* ---------- Pausar la lluvia binaria si la pestaña no está visible ---------- */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('is-idle', document.hidden);
  });
})();
