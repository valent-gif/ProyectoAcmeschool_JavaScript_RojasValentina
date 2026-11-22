function guardarSesion (usuario){
    sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));
}

function obtenerUsuarioActivo() {
    const datos = sessionStorage.getItem('usuarioActivo');
        return datos ? JSON.parse(datos) : null;
    }


function cerrarSesion() {
    sessionStorage.removeItem('usuarioActivo');
    mostrarVista('publico');
}


function mostrarVista(vista) {
  const contenedor = document.getElementById('contenedor-vistas');
  const usuarioActivo = obtenerUsuarioActivo();

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