# GTR CUBAUTO - iOS App

Esta carpeta contiene el proyecto XCode para convertir la aplicación web GTR CUBAUTO en una aplicación nativa de iOS.

## Estructura del Proyecto

```
ios/
├── GTRCubauto.xcodeproj/     # Proyecto principal de XCode
│   └── project.pbxproj       # Configuración del proyecto
├── GTRCubauto/              # Código fuente de la app
│   ├── AppDelegate.swift    # Delegado principal de la aplicación
│   ├── SceneDelegate.swift  # Manejo de escenas (iOS 13+)
│   ├── ViewController.swift # Controlador principal con WebView
│   ├── Info.plist          # Configuración de la aplicación
│   └── Base.lproj/         # Interfaces de usuario
│       ├── Main.storyboard    # Interface principal
│       └── LaunchScreen.storyboard # Pantalla de carga
└── README.md               # Este archivo
```

## Características

- **WebView nativa**: Utiliza WKWebView para cargar la aplicación web
- **Navegación mejorada**: Botones de recarga e inicio en la barra de navegación
- **Compatibilidad móvil**: Optimizada para dispositivos iOS
- **Manejo de errores**: Alertas informativas para problemas de conexión
- **Pantalla de carga**: Loading screen con branding GTR CUBAUTO
- **Configuración de seguridad**: Permisos para acceso a cámara y ubicación

## Configuración

### 1. Abrir en XCode

1. Abrir XCode
2. Seleccionar "Open a project or file"
3. Navegar a la carpeta `ios/` y seleccionar `GTRCubauto.xcodeproj`

### 2. Configurar URL de la aplicación

En `ViewController.swift`, actualizar la variable `webAppURL`:

```swift
private let webAppURL = "https://tu-dominio-de-produccion.com"
```

### 3. Configurar Bundle Identifier

1. Seleccionar el proyecto `GTRCubauto` en el navegador
2. En la pestaña "General", cambiar el "Bundle Identifier" a uno único:
   ```
   com.tucompañia.gtrcubauto
   ```

### 4. Configurar certificados de desarrollo

1. En "Signing & Capabilities", seleccionar tu equipo de desarrollo
2. XCode configurará automáticamente los certificados necesarios

## Compilación y Distribución

### Para Desarrollo
1. Conectar un dispositivo iOS o seleccionar el simulador
2. Presionar ⌘+R para compilar y ejecutar

### Para App Store
1. Configurar certificados de distribución en Apple Developer
2. Archivar la aplicación: Product → Archive
3. Subir a App Store Connect usando XCode Organizer

## Configuraciones Importantes

### Info.plist
- **NSAppTransportSecurity**: Configurado para permitir conexiones HTTP/HTTPS
- **NSCameraUsageDescription**: Permiso para acceso a cámara
- **NSLocationWhenInUseUsageDescription**: Permiso para ubicación
- **UISupportedInterfaceOrientations**: Orientaciones soportadas

### Características de la WebView
- JavaScript habilitado
- Reproducción de medios sin interacción del usuario
- Navegación con gestos (deslizar hacia atrás/adelante)
- Zoom personalizable
- Manejo de enlaces externos (abre en Safari)
- Manejo de enlaces tel:, mailto:, sms:

## Funcionalidades Incluidas

### 1. WebView Optimizada
- Carga la aplicación web completa
- Manejo automático de cache
- Optimizaciones para dispositivos móviles

### 2. Navegación Nativa
- Barra de navegación con título "GTR CUBAUTO"
- Botón de recarga
- Botón de inicio
- Indicador de carga

### 3. Manejo de Enlaces
- Enlaces internos se abren en la WebView
- Enlaces de pago (Stripe, PayPal) se manejan correctamente
- Enlaces externos se abren en Safari
- Enlaces tel:/mailto:/sms: abren las apps nativas

### 4. Optimizaciones Móviles
- Viewport responsive automático
- CSS inyectado para mejorar la experiencia táctil
- Desplazamiento suave
- Prevención de selección accidental de texto

## Próximos Pasos

1. **Pruebas**: Probar la aplicación en diferentes dispositivos iOS
2. **Iconos**: Agregar iconos de la aplicación en diferentes tamaños
3. **Splash Screen**: Personalizar la pantalla de carga
4. **Push Notifications**: Implementar notificaciones push si es necesario
5. **App Store**: Preparar para envío a la App Store

## Soporte

Para soporte técnico con el desarrollo iOS, contactar al equipo de desarrollo de GTR CUBAUTO.

## Versión

- **Versión iOS**: 1.0
- **iOS mínimo**: 14.0
- **XCode**: 15.0+
- **Swift**: 5.0