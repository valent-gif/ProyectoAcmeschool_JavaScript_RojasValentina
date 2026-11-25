# ProyectoAcmeschool_JavaScript_RojasValentina

Aplicación web tipo **SPA (*Single Page Application*)** desarrollada con **HTML5, CSS3 y JavaScript Vanilla (Web Components)** para la gestión académica de evaluaciones en línea. Permite al personal administrativo gestionar usuarios, a los docentes crear bancos de preguntas y exámenes con límite de tiempo, y a los estudiantes presentar las pruebas con calificación automática en tiempo real.

- **Autora:** Valentina Rojas
- **Repositorio:** `ProyectoAcmeschool_JavaScript_RojasValentina`
- **Tecnologías:** HTML5 Semántico, CSS3 (Grid, Flexbox, Variables CSS), JavaScript ES6+, Web Components (`HTMLElement`, `<template>`), `localStorage` y `sessionStorage`.

---

## Tabla de Contenidos

1. [Características Principales](#características-principales)
2. [Arquitectura y Estructura del Proyecto](#arquitectura-y-estructura-del-proyecto)
3. [Roles y Flujo Funcional](#roles-y-flujo-funcional)
4. [Modelo de Persistencia de Datos](#modelo-de-persistencia-de-datos)
5. [Identidad Visual y Diseño Responsivo](#identidad-visual-y-diseño-responsivo)
6. [Instalación y Ejecución Local](#instalación-y-ejecución-local)
7. [Credenciales de Prueba](#credenciales-de-prueba)

---

## Características Principales

- **Arquitectura Modular con Web Components Nativos:** Cada pantalla de la aplicación está encapsulada en un componente personalizado (`<resolucion-examenes>`, `<login-acme>`, `<gestion-usuarios>`, `<gestion-examenes>`) que clona plantillas `<template>` sin recargar el navegador.
- **Control de Acceso y Rutas Protegidas:** Gestión de sesión mediante `sessionStorage` que impide acceder a los paneles privados sin autenticación previa y adapta la barra de navegación según el rol del usuario (`Administrativo` o `Docente`).
- **CRUD Completo de Usuarios y Exámenes:** Creación, lectura, edición y eliminación de registros con validaciones de duplicidad (ID y correo), bloqueo de claves primarias en edición y protección contra autoeliminación de la sesión activa.
- **Temporizador Asíncrono y Calificación Automática:** Cuenta regresiva `MM:SS` gestionada con `setInterval` y `clearInterval` que envía la evaluación automáticamente al agotarse el tiempo, calcula el porcentaje obtenido y determina si el estudiante aprueba o reprueba.
- **Interfaz Responsiva (*Split-Workspace & Bento UI*):** Diseño adaptable a escritorio, tablet y móvil con identidad visual coherente en tonos esmeralda, turquesa y menta.

---

## Arquitectura y Estructura del Proyecto

```text
ProyectoAcmeschool_JavaScript_RojasValentina/
├── index.html                  # Documento principal y plantillas <template> de cada vista
├── README.md                   # Documentación técnica del proyecto
├── css/
│   └── style.css               # Sistema de diseño, variables CSS, animaciones y media queries
└── js/
    ├── datos-json.js           # Semilla de datos iniciales y funciones CRUD sobre localStorage
    ├── navegacion.js           # Enrutador SPA (mostrarVista) y control de sessionStorage
    ├── login.js                # Web Component <login-acme> para inicio de sesión por roles
    ├── gestion-usuarios.js     # Web Component <gestion-usuarios> (CRUD de personal)
    ├── gestion-examenes.js     # Web Component <gestion-examenes> (CRUD de exámenes y preguntas)
    └── resolucion-examenes.js  # Web Component <resolucion-examenes> (portal público y temporizador)
```

---

## Roles y Flujo Funcional

### 1. Portal Público — Estudiante (`<resolucion-examenes>`)
- Vista inicial de la plataforma (`mostrarVista('publico')`).
- Solicita **nombre completo** y **número de identificación** antes de habilitar el inicio de cualquier evaluación.
- Despliega las tarjetas de exámenes disponibles con su código, descripción, duración en minutos y cantidad de preguntas.
- Durante el examen, muestra un temporizador fijo (`sticky`) en pantalla, opciones de selección única (`radio`) y entrega un resumen detallado con aciertos, porcentaje final y estado (**APROBADO / REPROBADO**).

### 2. Autenticación (`<login-acme>`)
- Valida el correo electrónico y la contraseña contra los usuarios registrados en `localStorage`.
- Redirige automáticamente según el cargo:
  - **`Administrativo`** $\rightarrow$ Módulo de Gestión de Usuarios (`usuarios`).
  - **`Docente`** $\rightarrow$ Módulo de Gestión de Exámenes (`examenes`).

### 3. Gestión de Usuarios (`<gestion-usuarios>`)
- Disponible exclusivamente para el cargo **Administrativo**.
- Permite registrar, editar y eliminar usuarios con cargos `Administrativo` o `Docente`.
- Valida que no existan identificaciones o correos repetidos y evita eliminar el usuario con sesión activa.

### 4. Gestión de Exámenes (`<gestion-examenes>`)
- Disponible para **Administrativos** y **Docentes** (ocultando la pestaña de *Usuarios* cuando ingresa un docente).
- Permite configurar código, título, descripción, tiempo límite (en minutos) y porcentaje mínimo de aprobación.
- Incluye un constructor dinámico para añadir o quitar preguntas de 4 opciones (`A, B, C, D`) marcando la respuesta correcta antes de guardar el examen.

---

## Modelo de Persistencia de Datos

La aplicación utiliza `localStorage` para almacenar las entidades principales en formato JSON y `sessionStorage` para la sesión activa:

| Clave | Almacenamiento | Descripción | Estructura Principal |
| :--- | :---: | :--- | :--- |
| `usuarios` | `localStorage` | Personal administrativo y docente registrado. | `{ id, nombre, email, telefono, cargo, contraseña }` |
| `examenes` | `localStorage` | Evaluaciones creadas con su banco de preguntas. | `{ codigo, titulo, descripcion, tiempo, porcentajeAprobacion, preguntas: [{ id, enunciado, respuestas: [{ texto, esCorrecta }] }] }` |
| `resultados` | `localStorage` | Historial de exámenes presentados por estudiantes. | `{ estudianteId, estudianteNombre, examenCodigo, examenTitulo, correctas, totalPreguntas, porcentaje, aprobado, fecha }` |
| `usuarioActivo` | `sessionStorage` | Datos del usuario autenticado en la pestaña actual. | Objeto del usuario activo (`null` si no hay sesión). |

---

## Identidad Visual y Diseño Responsivo

El archivo `css/style.css` centraliza la paleta institucional en variables CSS (`:root`) y adapta la distribución mediante **CSS Grid** y **Media Queries** (`1024px` para tablet y `640px` para móvil):

| Rol Visual | Color | Código Hexadecimal |
| :--- | :--- | :---: |
| Navegación y encabezados principales | Verde azulado oscuro | `#075E59` |
| Gradientes y elementos interactivos | Verde azulado | `#087F78` |
| Acentos, bordes activos y temporizador | Turquesa | `#36B9AC` |
| Bordes suaves y etiquetas | Verde menta | `#BFEDE6` |
| Fondos secundarios y campos de entrada | Menta muy claro | `#E5F7F4` |
| Tarjetas y superficies principales | Blanco | `#FFFFFF` |

---

## Instalación y Ejecución Local

1. Clona este repositorio en tu computadora:
   ```bash
   git clone [https://github.com/valent-gif/ProyectoAcmeschool_JavaScript_RojasValentina.git](https://github.com/valent-gif/ProyectoAcmeschool_JavaScript_RojasValentina.git)
   ```
2. Abre la carpeta `ProyectoAcmeschool_JavaScript_RojasValentina` en **Visual Studio Code**.
3. Haz clic derecho sobre `index.html` y selecciona **Open with Live Server** (o ábrelo en tu navegador moderno preferido).

---

## Credenciales de Prueba

Para ingresar al panel administrativo desde el botón **"Iniciar sesión (Docentes / Admin)"**:

- **Correo electrónico:** `valentina@gmail.com`
- **Contraseña:** `123456`
- **Cargo:** `Administrativo`