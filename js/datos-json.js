//Son objetos que contiene la informacion de los usuarios y de los examenes
const usuariosIniciales = [
    {
    nombre: "Valentina",
    id: 1,
    email: "valentina@gmail.com",
    telefono: "3214567890",
    cargo: "Administrativo",
    contraseña: "123456",
    password: "123456"
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
    const datosUsuarios = localStorage.getItem('usuarios');
    if (datosUsuarios === null) {
        localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    } else {
        try {
            let parsed = JSON.parse(datosUsuarios);
            if (!Array.isArray(parsed)) {
                const lista = parsed && typeof parsed === 'object' ? [parsed] : usuariosIniciales;
                if (lista[0] && !lista[0].id) lista[0].id = 1;
                parsed = lista;
            }
            // Si Sandra sigue guardada en el navegador, actualizarla a Valentina
            const idxSandra = parsed.findIndex(u => u.email === 'sandrasanchez@gmail.com' || u.nombre === 'Sandra');
            if (idxSandra !== -1) {
                parsed[idxSandra] = { ...usuariosIniciales[0] };
            }
            localStorage.setItem('usuarios', JSON.stringify(parsed));
        } catch {
            localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
        }
    }

    //Examenes 
    if (localStorage.getItem('examenes') === null) {
        localStorage.setItem('examenes', JSON.stringify(examenesIniciales));
    }
    if (localStorage.getItem('resultados') === null) {
        localStorage.setItem('resultados', JSON.stringify([]));
    }
}

function obtenerUsuarios() {
    const datos = localStorage.getItem('usuarios');
    if (!datos) return [];
    try {
        const parsed = JSON.parse(datos);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') return [parsed];
        return [];
    } catch {
        return [];
    }
}


function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
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