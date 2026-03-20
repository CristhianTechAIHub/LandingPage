# Portafolio Personal — Cristhian Moises Campos Neyra

Sitio web de portafolio personal. Diseño oscuro tipo terminal con animaciones CSS, carruseles interactivos y tarjeta de perfil con efecto flip. Construido en HTML, CSS y JavaScript vanilla — sin frameworks, sin dependencias.

🔗 **[cristhian-campos.vercel.app](https://cristhian-campos.vercel.app)**

---

## Secciones

- **Hero** — presentación, foto de perfil con flip card (frente/reverso con experiencia y formación), tags de especialidades
- **Skills** — stack tecnológico agrupado por área
- **Proyectos** — tarjetas con carrusel de imágenes, descripción técnica y badges de tecnologías
- **Contacto** — enlace directo a LinkedIn

---

## Proyectos destacados en el portafolio

### proyecto_01 · Sistema de Visión Artificial para Control de Calidad
Sistema end-to-end de inspección visual con brazo colaborativo. Detección de defectos con YOLOv8 y clasificación con ResNet-50 corriendo en Jetson Xavier NX. Integración con PLC S7-1500 vía TCP/IP y control de Universal Robots para rechazo automático de piezas.

`Python` `YOLOv8` `ResNet-50` `OpenCV` `Jetson Xavier NX` `PLC S7-1500` `TIA Portal` `Universal Robots` `TCP/IP`

### proyecto_02 · Sistema de Sincronización de Gestión de Mantenimiento Predictivo
Plataforma de sincronización bidireccional entre sistemas de gestión de mantenimiento. Detección de anomalías en series temporales con modelo Transformer. Integración multi-base-de-datos y generación automática de órdenes de trabajo.

`Python` `Transformer` `PyTorch` `Oracle` `PostgreSQL` `SQL Server` `InfluxDB`

---

## Stack del sitio

| Capa | Tecnología |
|------|-----------|
| Estructura | HTML5 semántico |
| Estilos | CSS3 — variables, grid, animaciones, backdrop-filter |
| Tipografía | Space Grotesk + JetBrains Mono (Google Fonts) |
| Lógica | JavaScript vanilla — IntersectionObserver, carruseles, flip card |
| Hosting | Vercel (despliegue continuo desde GitHub) |

---

## Estructura del repositorio

```
portfolio/
├── index.html        # Sitio completo (HTML + CSS + JS en un solo archivo)
└── assets/
    ├── foto-perfil.jpg
    ├── senati1.jpeg
    ├── senati2.jpeg
    └── senati3.jpeg
```

---

## Despliegue

El sitio se despliega automáticamente en Vercel con cada `git push`. No requiere build ni dependencias.

```
GitHub (main) → Vercel → cristhian-campos.vercel.app
   git push       →       redespliega en ~30 segundos
```

## Desarrollo local

No necesita servidor ni instalación.

```bash
git clone https://github.com/tu-usuario/portfolio.git
cd portfolio
# Abre index.html en el navegador
```

---

## Contacto

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Cristhian%20Campos-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/cristhian-moises-campos-neyra-a8bb27257)

---

*Desarrollado con [Claude Code](https://claude.ai/code) · © 2025 Cristhian Moises Campos Neyra*
