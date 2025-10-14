# Configuración de Environments

## ⚠️ Archivos de Configuración

Los archivos `environment.ts` y `environment.prod.ts` contienen **información sensible** (API keys de Firebase) y **NO deben subirse a Git**.

## 🔧 Configuración Inicial

1. **Copia los archivos de ejemplo:**
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
   ```

2. **Edita los archivos copiados** y reemplaza los valores con tus credenciales reales de Firebase.

## 🔑 Dónde Obtener las Credenciales

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** ⚙️
4. En la sección **Your apps**, selecciona tu app web
5. Copia la configuración de Firebase

## 📁 Estructura de Archivos

```
src/environments/
├── environment.ts              # 🔒 NO SUBIR A GIT (desarrollo)
├── environment.prod.ts         # 🔒 NO SUBIR A GIT (producción)
├── environment.example.ts      # ✅ Template para desarrollo
└── environment.prod.example.ts # ✅ Template para producción
```

## 🛡️ Seguridad

- ✅ Los archivos `.example.ts` están en Git
- ❌ Los archivos `.ts` (sin .example) están en `.gitignore`
- ⚠️ **NUNCA** hagas commit de tus API keys reales

## 🚀 Variables de Entorno

### Development (`environment.ts`)
- `apiUrl`: URL del backend local (http://localhost:8000)
- `firebaseConfig`: Configuración de Firebase para desarrollo

### Production (`environment.prod.ts`)
- `apiUrl`: URL del backend en producción
- `firebaseConfig`: Configuración de Firebase para producción
