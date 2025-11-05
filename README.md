# 🗺️ PathFinder - Explorador de Rutas en Grafos

**Aplicación web full-stack para explorar y analizar rutas en un grafo de ciudades colombianas utilizando algoritmos de búsqueda BFS y Dijkstra.**

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Algoritmos Implementados](#-algoritmos-implementados)
- [Variables de Entorno](#-variables-de-entorno)
- [Pruebas Manuales](#-pruebas-manuales)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Decisiones Técnicas](#-decisiones-técnicas)
- [Limitaciones y Mejoras Futuras](#-limitaciones-y-mejoras-futuras)
- [Créditos](#-créditos)

---

## 🎯 Descripción

PathFinder es un sistema de gestión y análisis de grafos que permite:

- **Autenticar usuarios** mediante JWT (JSON Web Tokens)
- **Gestionar nodos y aristas** de un grafo dirigido con pesos
- **Ejecutar algoritmos de búsqueda:**
  - **BFS (Breadth-First Search)**: Recorrido en anchura con construcción del árbol BFS
  - **Dijkstra**: Cálculo del camino más corto entre dos nodos
- **Visualizar resultados** de forma clara e intuitiva en una interfaz web moderna

El proyecto incluye un dataset precargado de **15 ciudades colombianas** conectadas por **25 rutas** con distancias reales aproximadas.

---

## 🚀 Tecnologías

### Backend
- **FastAPI** 0.104.1 - Framework web moderno y rápido
- **SQLModel** 0.0.14 - ORM basado en Pydantic y SQLAlchemy
- **SQLite** - Base de datos ligera y embebida
- **Python-Jose** - Manejo de JWT
- **Passlib + Bcrypt** - Hash seguro de contraseñas
- **Uvicorn** - Servidor ASGI de alto rendimiento

### Frontend
- **React** 18.2.0 - Librería de interfaces de usuario
- **Vite** 5.0.8 - Build tool rápido y moderno
- **React Router DOM** 6.20.0 - Enrutamiento del lado del cliente

---

## ✨ Características

### Autenticación y Seguridad
- ✅ Registro de usuarios con validación
- ✅ Login con generación de JWT
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens con expiración configurable (60 min por defecto)
- ✅ Protección de rutas en frontend y backend
- ✅ Confirmación de contraseña en registro

### Gestión del Grafo
- ✅ CRUD completo de nodos
- ✅ CRUD completo de aristas
- ✅ Validación de nombres únicos en nodos
- ✅ Validación de pesos positivos en aristas
- ✅ Verificación de existencia de nodos al crear aristas
- ✅ Eliminación en cascada (borrar nodo elimina sus aristas)
- ✅ Manejo de errores 400/404 con mensajes claros

### Algoritmos
- ✅ **BFS**: Retorna orden de visita y árbol BFS con:
  - ID del nodo
  - ID del nodo padre
  - Profundidad en el árbol
- ✅ **Dijkstra**: Retorna:
  - Camino más corto (array de IDs)
  - Distancia total del camino
  - Error 404 si no existe ruta

### Interfaz de Usuario
- ✅ Diseño responsive y moderno
- ✅ Formularios intuitivos con validación
- ✅ Feedback visual inmediato
- ✅ Visualización clara de resultados
- ✅ Manejo de sesión con localStorage
- ✅ Redirección automática en caso de token expirado

---

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Python 3.10+** ([Descargar](https://www.python.org/downloads/))
- **Node.js 18+** y npm ([Descargar](https://nodejs.org/))
- **Git** (opcional, para clonar el repositorio)

---

## 🔧 Instalación

### 1. Clonar o descargar el proyecto

```bash
# Si usas Git
git clone <URL_DEL_REPOSITORIO>
cd pathfinder

# O simplemente descomprime el ZIP descargado
```

### 2. Configurar el Backend

```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env (ya existe, pero verifica su contenido)
# Debe contener:
# JWT_SECRET=super_secret_key_change_in_production_12345
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRES_MINUTES=60
# SQLITE_URL=sqlite:///./pathfinder.db
# CORS_ORIGINS=http://localhost:5173
```

### 3. Cargar datos iniciales

```bash
# Desde la carpeta backend/
python scripts/load_seed.py
```

**Salida esperada:**
```
🚀 Iniciando carga de datos...
✅ Base de datos inicializada

📂 Cargando nodos desde .../nodes.csv...
  ✅ 'Bogotá' creado (id=1)
  ✅ 'Medellín' creado (id=2)
  ...

📂 Cargando aristas desde .../edges.csv...
  ✅ Bogotá -> Medellín creada (peso=415.5)
  ...

✅ ¡Carga completada!
📊 Nodos cargados: 15
```

### 4. Iniciar el Backend

```bash
# Desde la carpeta backend/
uvicorn app.main:app --reload
```

**Servidor corriendo en:** `http://localhost:8000`  
**Documentación interactiva:** `http://localhost:8000/docs`

### 5. Configurar el Frontend

```bash
# En otra terminal, desde la raíz del proyecto
cd frontend

# Instalar dependencias
npm install
```

### 6. Iniciar el Frontend

```bash
# Desde la carpeta frontend/
npm run dev
```

**Aplicación corriendo en:** `http://localhost:5173`

---

## 💻 Uso

### Primera vez

1. Abre tu navegador en `http://localhost:5173`
2. Haz clic en **"¿No tienes cuenta? Regístrate"**
3. Completa el formulario:
   - Usuario (mínimo 3 caracteres)
   - Contraseña (mínimo 4 caracteres)
   - Confirmar contraseña
4. Haz clic en **"✓ Registrarse"**
5. Ahora inicia sesión con tus credenciales
6. ¡Explora el grafo!

### Gestionar Nodos

- **Crear:** Ingresa el nombre del nodo y haz clic en "Crear Nodo"
- **Eliminar:** Haz clic en el botón 🗑️ junto al nodo (también eliminará sus aristas)

### Gestionar Aristas

- **Crear:** Selecciona nodo origen, destino, peso y haz clic en "Crear Arista"
- **Eliminar:** Haz clic en el botón 🗑️ junto a la arista

### Ejecutar Algoritmos

#### BFS (Breadth-First Search)
1. Selecciona un nodo de inicio
2. Haz clic en "Ejecutar BFS"
3. Verás:
   - Orden de visita de los nodos
   - Tabla del árbol BFS con padre y profundidad

#### Dijkstra (Camino Mínimo)
1. Selecciona nodo origen y destino
2. Haz clic en "Calcular Ruta"
3. Verás:
   - Camino más corto (secuencia de nodos)
   - Distancia total en kilómetros

---

## 📁 Estructura del Proyecto

```
pathfinder/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Aplicación principal FastAPI
│   │   ├── models.py            # Modelos SQLModel (User, Node, Edge)
│   │   ├── schemas.py           # Schemas Pydantic (request/response)
│   │   ├── db.py                # Configuración de base de datos
│   │   ├── auth.py              # Utilidades JWT y hashing
│   │   ├── deps.py              # Dependencias (get_current_user)
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── graph.py         # Endpoints CRUD nodos y aristas
│   │       └── algorithms.py    # Endpoints BFS y Dijkstra
│   ├── data/
│   │   ├── nodes.csv            # Dataset de ciudades
│   │   └── edges.csv            # Dataset de conexiones
│   ├── scripts/
│   │   └── load_seed.py         # Script de carga de datos
│   ├── .env                     # Variables de entorno
│   ├── requirements.txt         # Dependencias Python
│   └── pathfinder.db            # Base de datos (generada automáticamente)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx   # HOC para rutas protegidas
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Página de autenticación
│   │   │   └── Graph.jsx            # Página principal
│   │   ├── api.js                   # Cliente API (fetch wrapper)
│   │   ├── App.jsx                  # Componente raíz con routing
│   │   └── main.jsx                 # Entry point
│   ├── index.html               # HTML base
│   ├── package.json             # Dependencias Node
│   ├── vite.config.js           # Configuración Vite
│   └── node_modules/            # Dependencias instaladas
│
├── README.md                    # Este archivo
└── .gitignore                   # Archivos ignorados por Git
```

---

## 🔌 API Endpoints

### Autenticación (Públicos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión (obtener JWT) |
| GET | `/auth/me` | Obtener usuario actual (protegido) |

### Grafo (Protegidos - Requieren JWT)

#### Nodos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/graph/nodes` | Crear nuevo nodo |
| GET | `/graph/nodes` | Listar todos los nodos |
| DELETE | `/graph/nodes/{id}` | Eliminar nodo y sus aristas |

#### Aristas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/graph/edges` | Crear nueva arista |
| GET | `/graph/edges` | Listar todas las aristas |
| DELETE | `/graph/edges/{id}` | Eliminar arista |

### Algoritmos (Protegidos - Requieren JWT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/graph/bfs?start_id={id}` | Ejecutar BFS desde nodo inicial |
| GET | `/graph/shortest-path?src_id={id}&dst_id={id}` | Calcular camino mínimo con Dijkstra |

**Documentación completa:** `http://localhost:8000/docs`

---

## 🧮 Algoritmos Implementados

### BFS (Breadth-First Search)

**Complejidad:** O(V + E) donde V = nodos, E = aristas

**Implementación:**
1. Cola FIFO para procesar nodos
2. Conjunto de visitados para evitar ciclos
3. Diccionarios para rastrear padre y profundidad
4. Construye árbol BFS con relaciones padre-hijo

**Respuesta:**
```json
{
  "order": [1, 2, 3, 5, 7],
  "tree": [
    {"node_id": 1, "parent_id": null, "depth": 0},
    {"node_id": 2, "parent_id": 1, "depth": 1},
    ...
  ]
}
```

### Dijkstra (Camino Mínimo)

**Complejidad:** O((V + E) log V) con heap binario

**Implementación:**
1. Cola de prioridad (heap) con distancias
2. Diccionario de distancias mínimas
3. Diccionario de nodos previos para reconstruir camino
4. Optimización de distancias con peso de aristas

**Respuesta:**
```json
{
  "path": [1, 5, 7, 9],
  "distance": 542.3
}
```

**Error si no existe camino:**
```json
{
  "detail": "No path found between nodes 1 and 15"
}
```

---

## 🔐 Variables de Entorno

### Backend (`backend/.env`)

```env
# Clave secreta para JWT (¡CAMBIAR EN PRODUCCIÓN!)
JWT_SECRET=super_secret_key_change_in_production_12345

# Algoritmo de encriptación JWT
ALGORITHM=HS256

# Tiempo de expiración del token en minutos
ACCESS_TOKEN_EXPIRES_MINUTES=60

# URL de la base de datos SQLite
SQLITE_URL=sqlite:///./pathfinder.db

# Orígenes permitidos para CORS (separados por comas)
CORS_ORIGINS=http://localhost:5173
```

### Frontend (Opcional)

Crear `frontend/.env`:
```env
# URL de la API (opcional, default: http://localhost:8000)
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Pruebas Manuales

### Con cURL

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"1234"}'

# 2. Login y obtener token
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=1234" \
  | grep -o '"access_token":"[^"]*' \
  | cut -d'"' -f4)

# 3. Ver perfil
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/auth/me

# 4. Listar nodos
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/graph/nodes

# 5. Crear nodo
curl -X POST http://localhost:8000/graph/nodes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Popayán"}'

# 6. Crear arista
curl -X POST http://localhost:8000/graph/edges \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"src_id":3,"dst_id":16,"weight":120.5}'

# 7. Ejecutar BFS desde Bogotá (id=1)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/graph/bfs?start_id=1"

# 8. Dijkstra de Bogotá (1) a Cali (3)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/graph/shortest-path?src_id=1&dst_id=3"
```

### Con Postman / Thunder Client

1. Importa la URL base: `http://localhost:8000`
2. Registra un usuario en `/auth/register`
3. Haz login en `/auth/login` y copia el `access_token`
4. En las siguientes peticiones, añade header:
   - Key: `Authorization`
   - Value: `Bearer {tu_token_aqui}`

---

## Decisiones Técnicas

### Backend

1. **SQLite en lugar de PostgreSQL/MySQL**
   - Justificación: MVP rápido, sin necesidad de servidor de BD
   - Ventaja: Portabilidad, configuración cero
   - Desventaja: No apto para producción con alta concurrencia

2. **Grafo dirigido en lugar de no dirigido**
   - Justificación: Permite modelar rutas unidireccionales (ej: calles de un solo sentido)
   - Implementación: Aristas tienen src_id y dst_id diferenciados

3. **JWT en localStorage**
   - Justificación: Simplicidad para MVP
   - Ventaja: Fácil implementación
   - Desventaja: Vulnerable a XSS (en producción usar httpOnly cookies)

4. **Expiración de token a 60 minutos**
   - Justificación: Balance entre seguridad y UX
   - Mejora futura: Implementar refresh tokens

### Frontend

1. **React sin TypeScript**
   - Justificación: Acelerar desarrollo bajo presión de deadline
   - Ventaja: Menos configuración
   - Desventaja: Pérdida de type safety

2. **Estilos inline en lugar de CSS modules/Tailwind**
   - Justificación: Menos dependencias, prototipado rápido
   - Ventaja: Todo en un archivo
   - Desventaja: No reutilizable, difícil de mantener a gran escala

3. **React Router en lugar de Next.js**
   - Justificación: SPA simple sin necesidad de SSR
   - Ventaja: Menor complejidad
   - Desventaja: Peor SEO (no relevante para este caso de uso)

---



## 🎓 Créditos

**Proyecto académico desarrollado por:**
- **Nombre:** Juan David Burbano, Cristian Fabián Muñoz
- **Institución:** UAO
- **Curso:** Estructura de datos y algoritmos 2
- **Profesor:** Jack Daniels
- **Fecha:** Noviembre 4 2025

### Dataset
- Ciudades colombianas con distancias aproximadas
- Fuente: Estimaciones basadas en Google Maps

### Tecnologías y Librerías
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [SQLModel](https://sqlmodel.tiangolo.com/)
- [Vite](https://vitejs.dev/)

---

## 📄 Licencia

Este proyecto es de código abierto con fines educativos.

---

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección de [Pruebas Manuales](#-pruebas-manuales)
2. Consulta la [documentación de la API](http://localhost:8000/docs)
3. Abre un issue en el repositorio

---

**¡Gracias por usar PathFinder! 🗺️✨**