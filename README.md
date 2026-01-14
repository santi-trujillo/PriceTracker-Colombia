# PriceTracker Colombia 🇨🇴

<div align="center">

![Status](https://img.shields.io/badge/Status-Stable-success)
![Node](https://img.shields.io/badge/Node.js-v18+-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Maintenance](https://img.shields.io/badge/Maintained-Yes-green.svg)

</div>

**PriceTracker Colombia** es una aplicación web moderna diseñada para rastrear y comparar precios de productos en las principales tiendas de comercio electrónico del país en tiempo real.

## 📸 Preview

> 💡 **Demo:** Busca productos como "iPhone 15", "Air Fryer", "Tenis Nike" y compara precios instantáneamente.

### Características principales:
- ✅ Búsqueda en **5 tiendas simultáneamente**
- ✅ Resultados en **tiempo real** (sin caché)
- ✅ Destaca el **mejor precio** automáticamente
- ✅ Diseño **responsive** y moderno
- ✅ **Seguro** y optimizado para producción

## 🚀 Características

*   **Búsqueda Unificada:** Consulta simultánea en 5 tiendas:
    *   Amazon
    *   MercadoLibre
    *   Falabella
    *   Éxito
    *   Alkosto
*   **Tiempo Real:** Datos extraídos al instante (Scraping), sin bases de datos desactualizadas.
*   **Diseño Premium:** Interfaz oscura, moderna y responsiva (Mobile-First).
*   **Arquitectura Robusta:**
    *   Backend en **Node.js/Express**.
    *   **Browser Singleton** para optimización extrema de RAM.
    *   **Security Hardening** (Helmet, CSP, Rate Limiting).
    *   Tests automatizados y Logging estructurado.

## 🛠️ Stack Tecnológico

*   **Backend:** Node.js, Express.js
*   **Scraping:** Puppeteer (Headless Chrome), Axios, Cheerio.
*   **Frontend:** Vanilla Javascript, CSS3 (Variables, Flexbox/Grid).
*   **Seguridad:** Helmet, Express-Rate-Limit.

## 📦 Instalación

### Requisitos previos
- Node.js v18 o superior
- npm o yarn
- 2GB de RAM disponible (para Puppeteer)

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/santi-trujillo/PriceTracker-Colombia.git
cd PriceTracker-Colombia

# 2. Instalar dependencias (incluye Puppeteer + Chromium)
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env
# Edita .env si necesitas cambiar el puerto (por defecto: 3000)

# 4. Iniciar el servidor
npm start
```

**¡Listo!** Abre tu navegador en `http://localhost:3000`

## ▶️ Ejecución

### Modo Desarrollo
```bash
npm start
```
El servidor iniciará en `http://localhost:3000`.

### Tests
Para verificar que el sistema está operativo:
```bash
npm test
```

## 📂 Estructura del Proyecto

```
PriceTracker-Colombia/
├── client/              # Frontend
│   ├── index.html       # Página principal
│   ├── css/
│   │   └── styles.css   # Estilos (variables CSS, responsive)
│   └── js/
│       └── app.js       # Lógica del cliente (fetch, render)
├── server/              # Backend
│   ├── index.js         # Servidor Express + endpoints
│   ├── config.js        # Configuración centralizada
│   ├── scrapers/        # Scrapers por tienda
│   │   ├── baseScraper.js    # Clase base con lógica común
│   │   ├── amazon.js         # Scraper de Amazon (Puppeteer)
│   │   ├── mercadolibre.js   # Scraper de MercadoLibre (Axios)
│   │   ├── falabella.js      # Scraper de Falabella (JSON)
│   │   ├── exito.js          # Scraper de Éxito (Puppeteer)
│   │   └── alkosto.js        # Scraper de Alkosto (Puppeteer)
│   └── utils/
│       ├── browserManager.js # Singleton de Puppeteer
│       └── logger.js         # Logger estructurado
├── scripts/
│   └── test-smoke.js    # Health check test
├── .env.example         # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 🔒 Seguridad

El proyecto implementa prácticas de seguridad estándar:
*   ✅ Sanitización de inputs contra XSS
*   ✅ CSP (Content Security Policy) estricta
*   ✅ Rate Limiting (60 req/min por IP)
*   ✅ Helmet.js para headers HTTP seguros
*   ✅ Validación de URLs (solo HTTPS)
*   ✅ Gestión segura de cookies y CORS

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas para contribuir:
- 🏪 Agregar más tiendas colombianas (Linio, Homecenter, etc.)
- 📊 Implementar gráficos de historial de precios
- 🔔 Sistema de alertas de precio
- 📱 Mejorar responsive en tablets
- 🧪 Agregar más tests

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Santiago Trujillo**
- GitHub: [@santi-trujillo](https://github.com/santi-trujillo)
- Proyecto: [PriceTracker Colombia](https://github.com/santi-trujillo/PriceTracker-Colombia)

---

<div align="center">

**Desarrollado con ❤️ en Colombia 🇨🇴**

⭐ Si te gustó el proyecto, considera darle una estrella ⭐

</div>
