/* Lógica del portafolio: menú responsive, sección activa, formulario de
   contacto, mapa bajo demanda y pausa de la lluvia al ocultar la pestaña. */

(function () {
  'use strict';

  /* ---------- Pasa el foco al título de una sección ---------- */
  /* Los títulos de las secciones llevan tabindex="-1": al navegar desde un
     enlace el foco queda en el título destino en lugar de perderse en un
     elemento que acaba de ocultarse. preventScroll deja el desplazamiento
     suave al propio ancla. */
  function enfocarSeccion(hash) {
    if (!hash || hash.length < 2) return;

    const destino = document.querySelector(hash);
    if (!destino) return;

    const tituloId = destino.getAttribute('aria-labelledby');
    const titulo = tituloId ? document.getElementById(tituloId) : destino;
    if (titulo) titulo.focus({ preventScroll: true });
  }

  /* ---------- Menú de navegación (móvil) ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    const mqDesktop = window.matchMedia('(min-width: 768px)');

    const isOpen = () => menu.classList.contains('is-open');

    const setMenu = (open, focusToggle) => {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute(
        'aria-label',
        open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );

      // Al abrir, el foco entra al primer enlace; al cerrar, vuelve al botón.
      if (open && focusToggle) {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
      if (!open && focusToggle) toggle.focus();
    };

    toggle.addEventListener('click', () => setMenu(!isOpen(), true));

    // Cerrar al elegir una sección y dejar el foco en su título
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMenu(false, false);
        enfocarSeccion(link.hash);
      });
    });

    // Escape cierra y devuelve el foco; Tab queda confinado dentro del menú
    document.addEventListener('keydown', (event) => {
      if (!isOpen()) return;

      if (event.key === 'Escape') {
        setMenu(false, true);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = [toggle, ...menu.querySelectorAll('a')];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    // Cerrar al hacer clic fuera de la navegación
    document.addEventListener('click', (event) => {
      if (!isOpen()) return;
      if (event.target instanceof Element && event.target.closest('.nav')) return;
      setMenu(false, false);
    });

    // Al pasar a escritorio el menú queda siempre visible: reinicia el estado
    const onBreakpointChange = (event) => {
      if (event.matches) setMenu(false, false);
    };

    if (typeof mqDesktop.addEventListener === 'function') {
      mqDesktop.addEventListener('change', onBreakpointChange);
    } else if (typeof mqDesktop.addListener === 'function') {
      mqDesktop.addListener(onBreakpointChange);
    }
  }

  /* ---------- Enlace activo según la sección visible ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Formulario: abre el correo del visitante ---------- */
  /* Sin JavaScript se usa el action mailto del propio formulario; con
     JavaScript se construye aquí un asunto y cuerpo más limpios. */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const emailLink = document.querySelector('.contact__list a[href^="mailto:"]');

  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Los required ya validaron antes de disparar submit: esta es la única
      // red de seguridad por si algún campo deja de estar marcado como requerido.
      if (!form.reportValidity()) return;

      if (!emailLink) {
        status.textContent = 'Falta configurar el correo de contacto.';
        return;
      }

      const data = new FormData(form);
      const nombre = String(data.get('nombre') || '').trim();
      const correo = String(data.get('email') || '').trim();
      const mensaje = String(data.get('mensaje') || '').trim();
      const destinatario = emailLink.getAttribute('href').replace(/^mailto:/, '');

      const asunto = encodeURIComponent(`Contacto desde el portafolio: ${nombre}`);
      const cuerpo = encodeURIComponent(`Nombre: ${nombre}\nCorreo: ${correo}\n\n${mensaje}`);

      status.textContent =
        `Tu aplicación de correo se abrirá con el mensaje listo. ` +
        `Si no se abre, escríbeme directamente a ${destinatario}.`;
      window.location.href = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`;
    });
  }

  /* ---------- Mapa bajo demanda ---------- */
  const mapButton = document.getElementById('map-button');
  const mapContainer = document.getElementById('contact-map');

  if (mapButton && mapContainer) {
    mapButton.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
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
  const whatsapp = document.getElementById('whatsapp-float');
  const phoneLink = document.querySelector('.contact__list a[href^="tel:"]');

  if (whatsapp && phoneLink) {
    const digits = phoneLink.getAttribute('href').replace(/^tel:/, '').replace(/\D/g, '');
    if (digits) {
      const mensaje = encodeURIComponent('Hola Jaiker, vine desde tu portafolio.');
      whatsapp.href = `https://wa.me/${digits}?text=${mensaje}`;
    }
  }

  /* ---------- Pausar la lluvia binaria si la pestaña no está visible ---------- */
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('is-idle', document.hidden);
  });
})();
