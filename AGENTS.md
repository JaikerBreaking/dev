# AGENTS.md

## Proyecto

Portafolio personal de Jaiker Aponte: sitio estático HTML5 + CSS3 + JavaScript vanilla.
`README.md` (en español) es el doc principal.

- Reparto de responsabilidades: `index.html` = estructura semántica/SEO, `style.css` = todo lo visual (animaciones, fondos, tipografías, paleta), `app.js` = lógica.
- **No hay tooling**: sin `package.json`, lockfile, dependencias, lint, tests ni typecheck. No inventes pasos de build/npm/CI.
- No es un repositorio git.
- Idioma: todo el contenido visible (textos, `alt`, etiquetas de formulario), comentarios y docs van en español.

## Ejecutar / verificar

- Se ejecuta abriendo `index.html` con Live Server de VS Code. No hay otro comando.
- Único chequeo automatizable: `node --check app.js`.

## Requisito de diseño (del README, obligatorio)

Mobile-first con media queries desde móviles pequeños, pasando por tablets, hasta smart TVs de 42". Define el CSS base para móvil y escala hacia arriba.

## Estructura de la página (requisito del usuario)

Secciones ancladas para la navegación: `#inicio`, `#quien-soy`, `#habilidades`, `#experiencia`, `#portafolio`, `#contacto`, más una navbar responsive (hamburguesa en móvil). Si `index.html` sigue vacío, implementar esa estructura primero.

## Paleta

Solo tres colores, definidos en `:root` dentro de `style.css`:

| Variable | Color | Uso |
|----------|-------|-----|
| `--color-bg` | `#020403` | Fondo de toda la web |
| `--color-muted` | `#ADADAD` | Texto secundario |
| `--color-text` | `#FFFFFF` | Texto principal |

Los tonos derivados son `rgba(255, 255, 255, ...)` (mismo blanco con distinta opacidad):
`--color-surface`, `--color-surface-strong`, `--color-line`. No introduzcas colores nuevos.

## Activos (`icon/`, `img/`)

Exportados de Figma, con particularidades que hay que respetar:

- Nombres con espacios: `icon/mail 3.svg`, `icon/phone 3.svg`, `img/Group 99.svg`, `img/jaiker aponte.jpg`. Usar `%20` en la `url()` del CSS.
- **Todas las imágenes se invocan desde `style.css`** como `background-image`: los iconos van en `<span>` vacíos con clase modificadora BEM (p. ej. `.social-list__icon--instagram`) y el retrato en `.hero__portrait` con `role="img"` + `aria-label`. No usar `<img>` para estos activos.
- Contraste: los iconos funcionales (redes, mail, teléfono, habilidades) son **blancos** → solo visibles sobre fondos oscuros. El icono hamburguesa (`icon/menu1.svg`) es **oscuro** (`#242635`) → se invierte con `filter: invert(1)` en `.nav__toggle-icon` para verlo sobre el fondo oscuro.
- `img/jaiker aponte.jpg` es el retrato para la sección Inicio: se pinta en `.hero__portrait` con `aspect-ratio: 3 / 4` (proporción real de la foto, 3456×4608), forma rectangular con esquinas redondeadas (`border-radius: var(--radius)`), `border: 1px solid var(--color-line)` (borde estándar del proyecto) y `box-shadow: var(--shadow)` (sombra estándar). Su tamaño se controla en `.hero__media` con `min(vw, rem)` y media queries.
- `img/Group 99.svg` (líneas curvas, 1442×526) es el fondo decorativo del hero: se pinta en `.hero__media::before`, detrás del retrato, con `aspect-ratio: 1442 / 526` y `contain` para que escale sin deformarse.
