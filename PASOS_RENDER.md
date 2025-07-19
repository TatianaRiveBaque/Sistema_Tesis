# 📋 GUÍA PASO A PASO: DESPLIEGUE EN RENDER

## 🎯 **PASOS EXACTOS PARA RENDER**

### **PASO 1: Crear Cuenta en Render**
1. Ve a: **https://render.com**
2. Haz clic en **"Get Started for Free"**
3. Regístrate con tu cuenta de GitHub
4. Autoriza a Render para acceder a tus repositorios

### **PASO 2: Crear Web Service para Backend**
1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio **"Sistema_Tesis"**
4. Haz clic en **"Connect"**

### **PASO 3: Configurar el Backend**
Llena los campos exactamente así:

```
📝 CONFIGURACIÓN DEL SERVICIO:

Name: sistema-diagnostico-backend
(O el nombre que prefieras)

Environment: Python 3

Region: Ohio (USA) o Singapore
(El más cercano a Ecuador)

Branch: master

Root Directory: backend
(MUY IMPORTANTE: especificar la carpeta backend)

Build Command: pip install -r requirements.txt

Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

Instance Type: Free
```

### **PASO 4: Variables de Entorno**
En la sección **"Environment Variables"**, agrega:

```
PORT = 8000
PYTHON_VERSION = 3.9.16
MODEL_PATH = ml/breast_cancer_detection_model_transfer.h5
```

### **PASO 5: Deploy**
1. Haz clic en **"Create Web Service"**
2. ¡Espera que se complete el build! (puede tomar 5-10 minutos)
3. Verás logs en tiempo real

### **PASO 6: Obtener tu URL**
Una vez deployado, tendrás una URL como:
```
https://sistema-diagnostico-backend.onrender.com
```

### **PASO 7: Probar el Backend**
Visita estas URLs para verificar:

✅ **Health Check:**
```
https://tu-url.onrender.com/health
```

✅ **Documentación API:**
```
https://tu-url.onrender.com/docs
```

✅ **Estadísticas:**
```
https://tu-url.onrender.com/stats
```

## 🌐 **DESPLEGAR FRONTEND EN NETLIFY**

### **PASO 1: Ir a Netlify**
1. Ve a: **https://netlify.com**
2. Regístrate con GitHub
3. Haz clic en **"New site from Git"**

### **PASO 2: Configurar Frontend**
```
📝 CONFIGURACIÓN:

Repository: Sistema_Tesis
Branch: master
Publish directory: frontend
Build command: (dejar vacío)
```

### **PASO 3: Actualizar Config**
Después del deploy, actualiza `frontend/config.js`:

```javascript
production: 'https://TU-URL-REAL-DE-RENDER.onrender.com'
```

## 🎯 **VERIFICACIÓN FINAL**

### ✅ **Checklist de Funcionalidad:**
- [ ] Backend responde en Render
- [ ] Frontend carga en Netlify  
- [ ] API docs funcionan
- [ ] Crear paciente funciona
- [ ] Subir imagen funciona
- [ ] Predicción funciona

### 🔧 **Troubleshooting Común:**

**Problema: Build falla**
- Verificar que `requirements.txt` esté en `/backend`
- Revisar logs de build en Render

**Problema: Frontend no conecta**
- Actualizar URL en `config.js`
- Verificar CORS en `main.py`

**Problema: Modelo no carga**
- Normal, el sistema funciona sin modelo
- Verificar logs: "usando modo fallback"

## 🎓 **PARA TU DEFENSA:**

Tendrás estas URLs profesionales:

```
🔗 URLS FINALES:
Backend:  https://sistema-diagnostico-backend.onrender.com
Frontend: https://sistema-diagnostico-frontend.netlify.app
API Docs: https://sistema-diagnostico-backend.onrender.com/docs
```

## ⏰ **Tiempo Estimado:**
- Configuración: 15 minutos
- Build del backend: 5-10 minutos
- Deploy del frontend: 2-3 minutos
- **Total: ~30 minutos**

## 💡 **Consejos:**
1. **Render es GRATIS** para proyectos académicos
2. **Deploy automático** desde GitHub
3. **HTTPS incluido** automáticamente
4. **Logs en tiempo real** para debugging
5. **Perfecto para demos** de tesis

¡Tu sistema estará en internet y listo para impresionar! 🚀
