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