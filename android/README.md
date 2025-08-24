# GTR CUBAUTO - Android App

Esta carpeta contiene el proyecto Android Studio para convertir la aplicación web GTR CUBAUTO en una aplicación nativa de Android.

## Estructura del Proyecto

```
android/
├── app/
│   ├── build.gradle                    # Configuración del módulo de la app
│   └── src/main/
│       ├── AndroidManifest.xml         # Manifiesto de la aplicación
│       ├── java/com/gtrcubauto/app/     # Código fuente Kotlin
│       │   ├── MainActivity.kt         # Actividad principal con WebView
│       │   └── SplashActivity.kt       # Pantalla de carga
│       └── res/                        # Recursos de la aplicación
│           ├── layout/                 # Layouts XML
│           ├── values/                 # Valores (colores, strings, estilos)
│           ├── drawable/               # Iconos y drawables
│           └── menu/                   # Menús de la aplicación
├── build.gradle                       # Configuración del proyecto
├── settings.gradle                    # Configuración de módulos
├── gradle.properties                 # Propiedades de Gradle
└── README.md                         # Este archivo
```

## Características

- **WebView optimizada**: Utiliza WebView con configuraciones avanzadas para la mejor experiencia
- **Navegación nativa**: Toolbar con botones de recarga, inicio y compartir
- **Splash Screen**: Pantalla de carga con branding GTR CUBAUTO
- **Pull-to-refresh**: Deslizar hacia abajo para recargar
- **Manejo de permisos**: Solicita permisos para cámara, ubicación y almacenamiento
- **Enlaces externos**: Maneja enlaces tel:, mailto:, sms: abriendo apps nativas
- **Optimizaciones móviles**: CSS inyectado para mejorar la experiencia táctil

## Configuración

### 1. Abrir en Android Studio

1. Abrir Android Studio
2. Seleccionar "Open an existing project"
3. Navegar a la carpeta `android/` y seleccionarla

### 2. Configurar URL de la aplicación

En `MainActivity.kt`, actualizar la variable `webAppUrl`:

```kotlin
private val webAppUrl = "https://tu-dominio-de-produccion.com"
```

### 3. Configurar package name

En `app/build.gradle`, cambiar el `applicationId`:

```gradle
defaultConfig {
    applicationId "com.tucompañia.gtrcubauto"
    // ...
}
```

### 4. Configurar certificados de firma

1. Generar keystore para firma de aplicación
2. Configurar en `app/build.gradle` en la sección `signingConfigs`

## Compilación y Distribución

### Para Desarrollo
1. Conectar un dispositivo Android o iniciar un emulador
2. Hacer clic en "Run" o presionar Shift+F10

### Para Google Play Store
1. Configurar la firma de aplicación en `app/build.gradle`
2. Generar APK firmado: Build → Generate Signed Bundle/APK
3. Subir a Google Play Console

## Configuraciones Importantes

### AndroidManifest.xml
- **INTERNET**: Permiso para conexiones de red
- **CAMERA**: Permiso para acceso a cámara
- **ACCESS_FINE_LOCATION**: Permiso para ubicación GPS
- **READ_EXTERNAL_STORAGE**: Permiso para leer archivos
- **usesCleartextTraffic**: Permite conexiones HTTP (para desarrollo)

### MainActivity.kt - Características de WebView
- JavaScript habilitado
- DOM Storage habilitado
- Zoom personalizable
- User Agent personalizado
- Manejo de enlaces externos
- Inyección de CSS para optimizaciones móviles

## Funcionalidades Incluidas

### 1. WebView Avanzada
- Carga completa de la aplicación web
- Manejo automático de cache
- Progress bar durante la carga
- Manejo de errores de red

### 2. Navegación Nativa
- Toolbar con título "GTR CUBAUTO"
- Botón de recarga
- Botón de inicio
- Botón de compartir
- Navegación hacia atrás con botón físico

### 3. Manejo de Enlaces
- Enlaces internos se cargan en la WebView
- Enlaces de pago (Stripe, PayPal) funcionan correctamente
- Enlaces externos se abren en el navegador
- Enlaces tel:/mailto:/sms: abren apps nativas

### 4. Optimizaciones Móviles
- Pull-to-refresh para recargar
- CSS inyectado para mejor experiencia táctil
- Viewport responsive automático
- Prevención de selección accidental

### 5. Permisos y Seguridad
- Solicitud automática de permisos necesarios
- Manejo de estados de permisos
- Configuración de seguridad de red

## Requisitos del Sistema

- **Android Studio**: 4.2 o superior
- **Gradle**: 8.2 o superior
- **Kotlin**: 1.9.10 o superior
- **API mínima**: Android 5.0 (API 21)
- **API objetivo**: Android 14 (API 34)

## Próximos Pasos

1. **Iconos**: Agregar iconos de la aplicación en diferentes densidades
2. **Pruebas**: Probar en diferentes dispositivos y versiones de Android
3. **Push Notifications**: Implementar FCM si es necesario
4. **Google Play**: Preparar para envío a Google Play Store
5. **Optimizaciones**: Implementar ProGuard para releases

## Dependencias Principales

- **AndroidX**: Bibliotecas de soporte modernas
- **Material Components**: Componentes de Material Design
- **WebKit**: Para funcionalidades avanzadas de WebView
- **SwipeRefreshLayout**: Para pull-to-refresh
- **ConstraintLayout**: Para layouts flexibles

## Soporte

Para soporte técnico con el desarrollo Android, contactar al equipo de desarrollo de GTR CUBAUTO.

## Versión

- **Versión Android**: 1.0 (versionCode 1)
- **Android mínimo**: 5.0 (API 21)
- **Android objetivo**: 14 (API 34)
- **Kotlin**: 1.9.10