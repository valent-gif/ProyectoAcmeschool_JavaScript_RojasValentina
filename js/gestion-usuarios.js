class gestionUsuario extends HTMLElement {
    connetedCallback() {
        const template = document.getElementById('tpl-gestion-usuarios')
        const contenido = template.content.cloneNode(true);
        this.innerHTML = '';
        this.appendChild(contenido);

        this.idEditando = null

        this.mostrarUsuarios();
        this.agregarEventos();
    }

    mostrarUsuarios() {
        const tbody = this.querySelector('#tabla.usuarios.body');
        const usuarios = obtenerUsuarios();
        tbody.innerHTML = '';

        usuarios.forEach((usuario)=> {
            const fila =document.createElement('tr');
            fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.cargo}</td>
            <td>
            <button type="button" class="btn-editar" data-id="${usuario.id}">Editar</button>
            <button type="button" class="btn-eliminar" data-id="${usuario.id}">Eliminar</button>
            </td>
            `;
            tbody.appendChild(fila);
        });
    }

    agregarEventos() {
        const formUsuario = this.querySelector('#form-usuario');
        const tbody = this.querySelector('#tabla-usuarios-body');

        this.querySelector('#nav-usuarios').addEventListener('click', () => {
            mostrarVista('usuarios');
        });

        this.querySelector('#nav.examenes').addEventListener('click', () => {
            mostrarVista('examenes');
        });

        this.querySelector('#btn-cerrar-sesion').addEventListener('click', () => {
            cerrarSesion();
            mostrarVista('login');
        });

        formUsuario.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = this.querySelector('#usuario-id').value.trim();
            const nombre = this.querySelector('#usuario-nombre').value.trim();
            const email = this.querySelector('#usuario-email').value.trim();
            const telefono = this.querySelector('#usuario-telefono').value.trim();
            const password = this.querySelector('#usuario-password').value;
            const cargo = this.querySelector('#usuario-cargo').value;

            let usuarios = obtenerUsuarios();

            if (this.idEditando !== null) {
                usuarios = usuarios.map((u) =>
                    String(u.id) === String(this.idEditando)
                ? {id, nombre, email, telefono, password, cargo}
                :u
            );
            this.idEditando = null;
            this.querySelector('#usuario-id').disabled = false;
        } else {
            const existe = usuarios.some(
                    (u) => String(u.id) === String(id) || u.email === email
            );
            if (existe) {
                alert('Ya existe un usuario con esa identificacion o correo.');
                return;
            }
            usuarios.push({id, nombre, email, telefono, password, cargo});
        }

        guardarUsuarios(usuarios);
        formUsuario.reset();
        //Actualiza la tabla al guardar
        this.mostrarUsuarios();
    });

    tbody.addEventListener('click', (e) => {
        const idSeleccionado = e.target.dataset.id;
        if(!idSeleccionado) return;

        const usuarios = obtenerUsuarios();

        if(e.target.classList.contains('btn-editar')) {
            const usuario = usuarios.find((u) => String (u.id) === String(idSeleccionado));
            if (!usuario) return;
            
            this.querySelector('#usuario-id').value = usuario.id;
            this.querySelector('#usuario-id').disabled = true;
            this.querySelector('#usuario-nombre').value = usuario.nombre
            this.querySelector('#usuario-email').value = usuario.email;
            this.querySelector('#usuario.telefono').value = usuario.telefono;
            this.querySelector('#usuario-password').value = usuario.password;
            this.querySelector('#usuario-cargo').value = usuario.cargo;

            this.idEditando = usuario.id;
        }

        if (e.target.classList.contains('btn-eliminar')) {
            const sesionActual = obtenerSesion();
            if (sesionActual && String(sesionActual.id) === String(idSeleccionado)) {
                alert('No puedes eliminar tu propio usuario con sesion activa.');
                return;
            }

            const filtrados = usuarios.filter((u) => String(u.id) !== String(idSeleccionado));
            guardarUsuarios(filtrados);
            //Actualiza la tabla al eliminar
            this.mostrarUsuarios();
    }
});
}
}

customElements.define('gestion-usuarios', gestionUsuario);
