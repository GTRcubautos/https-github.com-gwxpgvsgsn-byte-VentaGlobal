# VentaGlobal (rest-express)

Descripción
---
VentaGlobal es la web del proyecto (paquete "rest-express"). Este repositorio contiene la aplicación web y el servidor, desarrollados mayoritariamente en TypeScript. El servidor principal se encuentra en server/index.ts y la configuración de build usa Vite y esbuild.

Estado del proyecto
---
- Lenguaje principal: TypeScript
- Licencia: MIT
- Versión del paquete: 1.0.0

Características principales
---
- Servidor en TypeScript (server/index.ts)
- Frontend moderno con Vite
- Integración con bases de datos vía Drizzle (drizzle-kit)
- Autenticación y sesiones (passport, express-session)
- Integración con Stripe y PayPal (dependencias incluidas)

Tecnologías y dependencias destacadas
---
- Node.js + TypeScript
- Vite (build del frontend)
- esbuild (bundle del servidor para producción)
- Express (servidor HTTP)
- Drizzle ORM / drizzle-kit
- Stripe, PayPal SDKs
- React (dependencias incluidas)
- TailwindCSS

Requisitos
---
- Node.js (recomendado >= 16)
- npm o yarn
- Para iOS/Android solo si usas módulos móviles: Xcode / Android Studio

Instalación (local)
---
1. Clona el repositorio:
   git clone https://github.com/GTRcubautos/https-github.com-gwxpgvsgsn-byte-VentaGlobal.git
2. Entra en la carpeta del proyecto:
   cd https-github.com-gwxpgvsgsn-byte-VentaGlobal
3. Instala dependencias:
   npm install
   (o) yarn install
4. Crea el archivo de entorno (si existe .env.example):
   cp .env.example .env
   - Edita `.env` con las variables necesarias (API keys, DATABASE_URL, etc.)

Scripts disponibles (según package.json)
---
- npm run dev
  - Ejecuta: NODE_ENV=development tsx server/index.ts
  - Inicia el servidor en modo desarrollo usando tsx para ejecutar el entrypoint TypeScript directamente.

- npm run build
  - Ejecuta: vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
  - Construye el frontend con Vite y bundlea el servidor con esbuild a la carpeta dist para producción.

- npm run start
  - Ejecuta: NODE_ENV=production node dist/index.js
  - Inicia la aplicación en modo producción usando el bundle generado en dist.

- npm run check
  - Ejecuta: tsc
  - Ejecuta el compilador TypeScript para verificar tipos.

- npm run db:push
  - Ejecuta: drizzle-kit push
  - Aplica migraciones o sincroniza esquema con Drizzle (asegúrate de configurar DATABASE_URL).

Nota: Si usas Windows, configura las variables de entorno (NODE_ENV=...) según tu shell (cross-env o sintaxis compatible).

Estructura de carpetas (esperada)
---
- server/ — Código del servidor (entrypoint: server/index.ts)
- src/ o client/ — Código del frontend (si aplica)
- dist/ — Salida de build para producción
- package.json

Despliegue
---
1. Construir:
   npm run build
2. Subir contenido de `dist/` y los archivos estáticos a tu hosting / servidor.
3. Configurar variables de entorno en el entorno de producción (DATABASE_URL, STRIPE_KEY, etc.)

Buenas prácticas
---
- No subir variables sensibles al repositorio (.env debe estar en .gitignore).
- Usar ramas y Pull Requests para cambios.
- Ejecutar `npm run check` y tests antes de mergear.

Contribuir
---
1. Haz fork del repo y crea una rama feature/mi-cambio.
2. Asegúrate de que los scripts y el linter pasan.
3. Abre un Pull Request con descripción y capturas si aplica.

Reportar problemas
---
- Abre un Issue en GitHub con pasos para reproducir, entorno y logs relevantes.

Licencia
---
Este proyecto está bajo la licencia MIT.

Créditos y contacto
---
- Autor / Mantenedor: gwxpgvsgsn-byte
- Repositorio: https://github.com/GTRcubautos/https-github.com-gwxpgvsgsn-byte-VentaGlobal

Notas finales
---
- He incluido los comandos reales que aparecen en package.json (dev, build, start, check, db:push). Si quieres que añada secciones adicionales (ej. badge de build, instrucciones de CI/CD, ejemplo de .env, o capturas) dímelo y lo agrego.