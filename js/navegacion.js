// Guarda el usuario que inicio sesion
function guardarSesion (usuario){
    sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));
}

function obtenerSesion() {
    const datos = sessionStorage.getItem('usuarioActivo');
        return datos ? JSON.parse(datos) : null;
    }

// Se elimina la información de la sesión activa, pero los usuarios y los exámenes siguen guardados.
function cerrarSesion() {
    sessionStorage.removeItem('usuarioActivo');
    mostrarVista('publico');
}


function mostrarVista(vista) {
  const contenedor = document.getElementById('contenedor-vistas');
  const usuarioActivo = obtenerSesion();

  if (vista === 'publico') {
    contenedor.innerHTML = '<resolucion-examenes></resolucion-examenes>';
  } else if (vista === 'login') {
    contenedor.innerHTML = '<login-acme></login-acme>';
  } else if (vista === 'usuarios') {

    if (!usuarioActivo) {
      mostrarVista('login');
      return;
    }
    contenedor.innerHTML = '<gestion-usuarios></gestion-usuarios>';
  } else if (vista === 'examenes') {
    if (!usuarioActivo) {
      mostrarVista('login');
      return;
    }
    contenedor.innerHTML = '<gestion-examenes></gestion-examenes>';
  }
}

mostrarVista('publico');