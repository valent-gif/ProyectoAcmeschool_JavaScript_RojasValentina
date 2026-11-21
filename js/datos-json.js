//Son objetos que contiene la informacion de los usuarios y de los examenes
const usuariosIniciales = {
    nombre: "Sandra",
    email: "sandrasanchez@gmail.com",
    telefono: "3214567890",
    cargo: "Administrativo",
    constraseña: "1656Jdn43"
}

const examenesIniciales = [
    {
        codigo: "EX-01",
        titulo: "Fundamentos de Python",
        tiempo: "30 minutos",
        porcentajeAprobacion: "70%",
        descripcion: "Evaluacion de fundamentos basicos",
        preguntas: [
            {
               id: 1,
                enunciado: "¿Que es una variable.",
                respuestas: [
                    { texto: "var", esCorrecta: false},
                    { texto: "const", esCorrecta: true},
                    {texto: "let", esCorrecta: false},
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
    localStorag.setItem('examenes', JSON.stringify(examenesIniciales));
}
}
function obtenerUsuarios() {
    if (localStorage.getIte('usuarios', JSON.parse(usuarios))
        return []
    


}