# PriceTracker Colombia 🇨🇴

**PriceTracker Colombia** es una aplicación web moderna diseñada para rastrear y comparar precios de productos en las principales tiendas de comercio electrónico del país en tiempo real.

![Status](https://img.shields.io/badge/Status-Stable-success)
![Node](https://img.shields.io/badge/Node.js-v18+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

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

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/pricetracker-colombia.git
    cd pricetracker-colombia
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # Esto instalará también Puppeteer y Chromium compatible
    ```

3.  **Configurar entorno (Opcional):**
    Copiar el archivo de ejemplo:
    ```bash
    cp .env.example .env
    ```
    *(Por defecto corre en puerto 3000)*

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

*   `/server`: Código del Backend API.
    *   `/scrapers`: Lógica de extracción por tienda.
    *   `/utils`: Utilidades (BrowserManager, Logger).
*   `/client`: Frontend estático (HTML/CSS/JS).
*   `/scripts`: Scripts de mantenimiento y pruebas.

## 🔒 Seguridad

El proyecto implementa prácticas de seguridad estándar:
*   Sanitización de inputs contra XSS.
*   CSP (Content Security Policy) estricta.
*   Rate Limiting para prevención de DoS.
*   Bloqueo de condiciones de carrera (Race Conditions) en inicio.

---
Desarrollado con ❤️ para el portafolio de Santiago Trujillo.
