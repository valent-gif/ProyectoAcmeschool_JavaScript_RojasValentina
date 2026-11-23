//Son objetos que contiene la informacion de los usuarios y de los examenes
const usuariosIniciales = [
    {
    nombre: "Sandra",
    id: 1,
    email: "sandrasanchez@gmail.com",
    telefono: "3214567890",
    cargo: "Administrativo",
    contraseña: "1656Jdn43"
    }
]

const examenesIniciales = [
    {
        codigo: "EX-01",
        titulo: "Fundamentos de Python",
        tiempo: "30 ",
        porcentajeAprobacion: "70%",
        descripcion: "Evaluacion de fundamentos basicos",
        preguntas: [
            {
               id: 1,
                enunciado: "¿Que es una variable.",
                respuestas: [
                    { texto: "var", esCorrecta: false},
                    { texto: "const", esCorrecta: true},
                    { texto: "let", esCorrecta: false},
                ] 
            }
        ]
    }
]
//Funciones para que los archivos lean la informacion
//Sino existe la clave usuarios en el navegador, guardamos los iniciiales.

function iniciarDatos () {
    if (localStorage.getItem('usuarios')=== null){
    localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
}

//Examenes 

if (localStorage.getItem('examenes')=== null) {
    localStorage.setItem('examenes', JSON.stringify(examenesIniciales));
}
if (localStorage.getItem('resultados')=== null) {
    localStorage.setItem('resultados', JSON.stringify([]));
}
}

function obtenerUsuarios() {
    const datos = localStorage.getItem('usuarios');
    return datos ? JSON.parse(datos): [];
}


function guardarUsuarios(usuarios) {
    localStorage.setItem('usuaruios', JSON.stringify(usuarios));
} 

function obtenerExamenes() {
    const datos = localStorage.getItem('examenes');
    return datos ? JSON.parse(datos): [];
}

function guardarExamenes(examenes) {
    localStorage.setItem('examenes', JSON.stringify(examenes));
}

function obtenerResultados () {
    const datos = localStorage.getItem('resultados');
    return datos ? JSON.parse(datos): [];
}

function guardarResultados(resultados) {
  localStorage.setItem('resultados', JSON.stringify(resultados));
}

iniciarDatos();