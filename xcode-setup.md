# GTR CUBAUTO - Configuración para Xcode

## Resumen
Este proyecto está listo para ser importado y desarrollado en Xcode como una aplicación iOS nativa.

## Estructura del Proyecto

### Archivos Web (Cliente)
- `client/src/` - Código fuente React TypeScript 
- `client/src/pages/` - Páginas principales de la aplicación
- `client/src/components/` - Componentes reutilizables
- `client/src/assets/` - Recursos estáticos (imágenes, iconos)

### Backend API
- `server/` - Servidor Express.js con TypeScript
- `server/routes.ts` - Endpoints de la API REST
- `server/storage.ts` - Gestión de datos

### Configuración iOS
- `ios-config.json` - Configuración específica para iOS
- `attached_assets/` - Assets preparados para iOS

## Características Principales

### ✅ Sistema de Seguridad Completo
- Modal obligatorio de términos y condiciones 
- Sistema de consentimiento de privacidad
- Configuración de privacidad del usuario
- Logs de seguridad y auditoría

### ✅ Diseño Moderno Consistente
- Tema gris/negro con botones rojos
- Diseño responsive para móviles
- Iconografía consistente con Lucide React

### ✅ Navegación Reorganizada
- **Ofertas** - Página principal de promociones (nueva prioridad)
- **Repuestos** - Catálogo de productos
- **Autos** - Sección especializada en automóviles  
- **Motos** - Sección especializada en motocicletas
- **Juegos** - Sistema de gamificación
- **Mi Perfil** - Gestión de usuario
- **Mayoristas** - Portal para clientes mayoristas
- **Admin** - Panel administrativo

### ✅ Funcionalidades E-commerce
- Carrito de compras persistente
- Sistema de precios diferenciado (retail/mayorista)
- Búsqueda avanzada de productos
- Gestión de ofertas y promociones

## Configuración para Xcode

### 1. Requisitos del Sistema
- macOS 12.0+
- Xcode 14.0+
- iOS Deployment Target: 14.0+
- Swift 5.7+

### 2. Bundle Identifier
```
com.gtrcubauto.app
```

### 3. App Transport Security
La aplicación está configurada para permitir conexiones HTTP para desarrollo:
```json
{
  "NSAppTransportSecurity": {
    "NSAllowsArbitraryLoads": true,
    "NSExceptionDomains": {
      "gtrcubauto.com": {
        "NSExceptionAllowsInsecureHTTPLoads": true
      }
    }
  }
}
```

### 4. Permisos Requeridos
- **Cámara**: Para tomar fotos de productos
- **Galería**: Para seleccionar imágenes
- **Ubicación**: Para encontrar talleres cercanos  
- **Notificaciones Push**: Para ofertas y estados de pedidos

### 5. Iconos de la App
Se requieren los siguientes tamaños de iconos:
- iPhone: 20x20, 29x29, 40x40, 60x60 (2x y 3x)
- iPad: 20x20, 29x29, 40x40, 76x76, 83.5x83.5
- App Store: 1024x1024

### 6. Esquemas de URL
```
gtrcubauto://
gtr-cubauto://
```

### 7. Orientaciones Soportadas
- Portrait (principal)
- Landscape Left
- Landscape Right

## Estructura de Archivos para Xcode

```
GTR_CUBAUTO.xcodeproj/
├── GTR_CUBAUTO/
│   ├── Views/
│   │   ├── HomeView.swift
│   │   ├── OfertasView.swift  
│   │   ├── RepuestosView.swift
│   │   ├── AutosView.swift
│   │   └── MotosView.swift
│   ├── Models/
│   │   ├── Product.swift
│   │   ├── User.swift
│   │   └── Cart.swift
│   ├── Services/
│   │   ├── APIService.swift
│   │   ├── AuthService.swift
│   │   └── SecurityService.swift
│   ├── Resources/
│   │   ├── Assets.xcassets
│   │   ├── LaunchScreen.storyboard
│   │   └── Info.plist
│   └── App/
│       ├── GTR_CUBAAUTOApp.swift
│       └── ContentView.swift
└── GTR_CUBAAUTOTests/
```

## API Endpoints Principales

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products?category=cars` - Productos de autos
- `GET /api/products?category=motorcycles` - Productos de motos
- `GET /api/products?search=query` - Búsqueda

### Usuario
- `GET /api/auth/user` - Información del usuario
- `POST /api/user-consents` - Guardar consentimientos
- `GET /api/privacy-policy/current` - Política actual

### Configuración
- `GET /api/site-config` - Configuración del sitio

## Pasos para Importar en Xcode

### 1. Crear Nuevo Proyecto
1. Abrir Xcode
2. Create a new Xcode project
3. Seleccionar **iOS** → **App**
4. Product Name: `GTR CUBAUTO`
5. Bundle Identifier: `com.gtrcubauto.app`
6. Language: **Swift**
7. Interface: **SwiftUI**

### 2. Configurar Info.plist
Copiar la configuración desde `ios-config.json` al archivo Info.plist

### 3. Configurar Assets
1. Crear iconos en `Assets.xcassets/AppIcon.appiconset`
2. Importar imágenes desde `attached_assets/`
3. Configurar Launch Screen

### 4. Implementar WebView
Usar WKWebView para mostrar la aplicación web:

```swift
import SwiftUI
import WebKit

struct ContentView: View {
    var body: some View {
        WebView(url: URL(string: "https://gtrcubauto.com")!)
            .edgesIgnoringSafeArea(.all)
    }
}

struct WebView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.load(URLRequest(url: url))
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
```

### 5. Configurar Notificaciones Push
1. Habilitar Push Notifications capability
2. Configurar certificados en Apple Developer Portal
3. Implementar delegates para notificaciones

### 6. Testing
1. Configurar simuladores iOS
2. Probar en dispositivos físicos
3. Verificar todas las funcionalidades

## Notas de Desarrollo

### Seguridad
- Todos los formularios implementan validación
- Sistema de consentimiento GDPR compliant
- Logs de seguridad integrados
- Protección contra fraude implementada

### Performance  
- Carga lazy de imágenes
- Caché de productos optimizado
- Compresión de assets habilitada

### Accesibilidad
- Elementos con `data-testid` para testing
- Soporte para VoiceOver
- Contraste de colores optimizado

## Entrega
El proyecto está completamente preparado para desarrollo iOS con:
- ✅ Modal obligatorio de términos implementado
- ✅ Diseño gris/negro consistente aplicado  
- ✅ Navegación reorganizada (Ofertas → Repuestos)
- ✅ Configuración iOS lista para Xcode

**¡Proyecto listo para importar en Xcode!** 🚀