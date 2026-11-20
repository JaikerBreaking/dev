# Portafolio de Jaiker Aponte

Sitio web estático del portafolio personal de Jaiker Aponte, desarrollador web frontend.
Construido con HTML5, CSS3 y JavaScript vanilla (sin frameworks ni dependencias).

## Metodología

Mobile-first: el CSS base está pensado para móviles pequeños y escala hacia arriba
mediante media queries, pasando por tablets, hasta televisores inteligentes de 42".

## Estructura del proyecto

```
index.html   Estructura semántica de la página y optimización SEO
style.css    Todo lo visual: paleta, tipografías, fondos y animaciones
app.js       Lógica del menú de navegación responsive
icon/        Iconografía exportada de Figma
img/         Imágenes (retrato)
```

### Secciones de la página

| Ancla | Sección |
|-------|---------|
| `#inicio` | Inicio (presentación) |
| `#quien-soy` | Quién soy |
| `#habilidades` | Mis habilidades |
| `#experiencia` | Experiencia |
| `#portafolio` | Portafolio |
| `#contacto` | Contacto |

## Paleta de colores

| Color | Uso |
|-------|-----|
| `#020403` | Fondo de toda la web |
| `#ADADAD` | Texto secundario |
| `#FFFFFF` | Texto principal |

Los tonos derivados (bordes, superficies, estados hover) se generan con el canal
alfa del blanco sobre `rgba()`, de modo que no se introducen colores nuevos.

## Cómo ejecutar el proyecto

1. Abre la carpeta del proyecto en Visual Studio Code.
2. Abre `index.html`.
3. Inicia **Live Server** (extensión de VS Code) y abre el puerto que indique.

## Verificación

El único chequeo automatizable es la sintaxis del JavaScript:

```bash
node --check app.js
```
