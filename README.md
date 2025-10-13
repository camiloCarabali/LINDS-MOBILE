# LINDS Mobile - Aplicación para Conductores

## 🚚 Descripción
LINDS Mobile es una aplicación móvil desarrollada con Ionic Angular diseñada específicamente para conductores de camiones. La aplicación permite a los conductores ver trabajos disponibles, aplicar a ellos, comunicarse con clientes y navegar durante los viajes.

## ✨ Características Principales

### 📋 **Gestión de Trabajos**
- Ver lista de trabajos disponibles de empresas y usuarios
- Filtrar trabajos por ubicación, tipo de carga y pago
- Aplicar a trabajos de interés
- Ver detalles completos de cada trabajo

### 🗺️ **Navegación y Mapas**
- Mapa en tiempo real durante el viaje
- Rutas optimizadas de origen a destino
- Seguimiento de progreso del viaje
- Ubicación actual del conductor

### 💬 **Sistema de Chat**
- Comunicación directa con clientes
- Historial de conversaciones
- Notificaciones en tiempo real
- Soporte para mensajes de texto y ubicación

### 👤 **Perfil del Conductor**
- Información personal y del vehículo
- Historial de trabajos completados
- Calificaciones y estadísticas
- Gestión de métodos de pago

### 💰 **Sistema de Pagos**
- Múltiples métodos de pago
- Historial de transacciones
- Configuración de cuenta principal
- Integración con bancos y billeteras digitales

## 🛠️ Tecnologías Utilizadas

- **Framework:** Ionic 7 + Angular 17
- **Lenguaje:** TypeScript
- **Estilos:** SCSS
- **Plataformas:** iOS, Android
- **Capacitor:** Para funcionalidades nativas

## 📱 Estructura de la Aplicación

```
src/
├── app/
│   ├── pages/
│   │   ├── jobs/              # Lista de trabajos disponibles
│   │   ├── active-job/        # Trabajo activo con mapa
│   │   ├── chat/              # Sistema de mensajería
│   │   └── profile/           # Perfil del conductor
│   ├── tabs/                  # Navegación por pestañas
│   └── shared/                # Componentes compartidos
├── assets/                    # Recursos estáticos
└── theme/                     # Estilos y variables
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Ionic CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/camiloCarabali/LINDS-MOBILE.git
   cd LINDS-MOBILE
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   ionic serve
   ```

4. **Construir para producción**
   ```bash
   ionic build
   ```

5. **Agregar plataformas móviles**
   ```bash
   ionic capacitor add android
   ionic capacitor add ios
   ```

6. **Ejecutar en dispositivo**
   ```bash
   ionic capacitor run android
   ionic capacitor run ios
   ```

## 📋 Comandos Disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm test` - Ejecutar pruebas
- `npm run lint` - Verificar código

## 🎨 Personalización

### Colores del Tema
Los colores principales se pueden modificar en `src/theme/variables.scss`:

- **Primary:** `#1a73e8` (Azul principal)
- **Secondary:** `#f39c12` (Naranja)
- **Success:** `#27ae60` (Verde)
- **Warning:** `#f1c40f` (Amarillo)
- **Danger:** `#e74c3c` (Rojo)

### Iconos
La aplicación utiliza Ionicons como biblioteca principal de iconos.

## 🔐 Seguridad y Permisos

### Permisos Requeridos
- **Ubicación:** Para navegación y seguimiento
- **Cámara:** Para fotos de entrega
- **Notificaciones:** Para alertas en tiempo real
- **Almacenamiento:** Para cache offline

## 🚧 Estado del Proyecto

**Versión Actual:** 0.0.1  
**Estado:** En Desarrollo  
**Última Actualización:** Octubre 2025

### Funcionalidades Implementadas ✅
- ✅ Estructura base del proyecto
- ✅ Navegación por pestañas
- ✅ Lista de trabajos disponibles
- ✅ Vista de trabajo activo con mapa
- ✅ Sistema básico de chat
- ✅ Perfil de conductor
- ✅ Diseño responsivo

### Próximas Funcionalidades 🔄
- 🔄 Integración con API backend
- 🔄 Autenticación de usuarios
- 🔄 Notificaciones push
- 🔄 Integración con mapas reales (Google Maps)
- 🔄 Sistema de pagos funcional
- 🔄 Chat en tiempo real
- 🔄 Modo offline

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email:** soporte@linds.com
- **GitHub Issues:** [Reportar un problema](https://github.com/camiloCarabali/LINDS-MOBILE/issues)

## 🙏 Agradecimientos

- Equipo de desarrollo de Ionic
- Comunidad de Angular
- Contribuidores del proyecto

---

**Desarrollado con ❤️ para conductores profesionales en Colombia**