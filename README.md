# 🏃‍♂️ EcoRun Sevilla

Plataforma gamificada de running para promover el deporte sostenible en Sevilla. Únete a retos, acumula ecopuntos y contribuye al medio ambiente mientras corres.

> ⚠️ **NOTA:** El código completo y funcional está en la rama **`dev`**

---

## 🌱 ¿Qué es EcoRun Sevilla?

**EcoRun Sevilla** es una aplicación web que motiva a los corredores de Sevilla a practicar running de forma sostenible mediante:

- 🎯 **Retos y challenges** semanales y mensuales
- 🏆 **Sistema de ecopuntos** por completar carreras
- 📊 **Seguimiento de progreso** y estadísticas personales
- 🌿 **Impacto ecológico** positivo en la ciudad
- 👥 **Comunidad** de runners comprometidos con el medio ambiente

---

## 🚀 Tecnologías

### Backend
- **Node.js** + **Express** - API REST
- **MySQL** (Docker) - Base de datos
- **JWT** - Autenticación segura
- **bcrypt** - Cifrado de contraseñas

### Frontend (En desarrollo)
- **React** + **Vite** - Interfaz de usuario
- **Tailwind CSS** - Diseño responsivo y moderno
- **React Router** - Navegación entre páginas
- **Axios** - Comunicación con el backend

---

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/ecorun-sevilla.git
cd ecorun-sevilla
git checkout dev
2. Instalar dependencias
bash
npm install
3. Configurar variables de entorno
bash
cp .env.example .env
Edita .env:

text
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=ecorun_sevilla
DB_PORT=3306

JWT_SECRET=genera_una_clave_secreta_aqui
PORT=3000
4. Levantar MySQL con Docker
bash
docker run -d \
  --name mysql-ecorun \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=ecorun_sevilla \
  mysql:8.0
5. Importar la base de datos
📧 La base de datos se proporciona por separado. Contacta para obtener el archivo SQL.

bash
docker exec -i mysql-ecorun mysql -u root -p123456 < ecorun_sevilla.sql
6. Iniciar el servidor
bash
npm start
✅ Servidor corriendo en http://localhost:3000

✨ Funcionalidades
🔐 Sistema de Usuarios
Registro e inicio de sesión seguro

Perfil personal con estadísticas

Sistema de ecopuntos acumulados

🏃‍♂️ Registro de Carreras
Guarda tus runs con distancia, tiempo y ubicación

Calcula automáticamente los ecopuntos ganados

Historial completo de tus carreras

🎯 Retos y Challenges
Maratón de Sevilla: 42.2 km en un mes (500 puntos)

Corredor Constante: 10 carreras al mes (300 puntos)

5K Primavera: Corre 5 km sin parar (100 puntos)

Desafío Semanal: 3 carreras semanales (50 puntos)

Y muchos más...

📊 Estadísticas y Progreso
Visualiza tu progreso en cada reto

Ranking de runners en Sevilla

Impacto ecológico total
