//WEb component
class gestionUsuario extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById('tpl-gestion-usuarios')
        const contenido = template.content.cloneNode(true);
        this.innerHTML = '';
        this.appendChild(contenido);

        this.idEditando = null

        this.mostrarUsuarios();
        this.agregarEventos();
    }

    mostrarUsuarios() {
        const tbody = this.querySelector('#tabla-usuarios-body');
        if (!tbody) return;
        const usuarios = obtenerUsuarios();
        tbody.innerHTML = '';

        if (!Array.isArray(usuarios)) return;

        usuarios.forEach((usuario)=> {
            const fila = document.createElement('tr');
            fila.innerHTML = `
            <td>${usuario.id ?? ''}</td>
            <td>${usuario.nombre ?? ''}</td>
            <td>${usuario.email ?? ''}</td>
            <td>${usuario.telefono ?? ''}</td>
            <td>${usuario.cargo ?? ''}</td>
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

        this.querySelector('#nav-examenes').addEventListener('click', () => {
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
            const inputContraseña = this.querySelector('#usuario-contraseña') || this.querySelector('#usuario-password');
            const contraseña = inputContraseña ? inputContraseña.value : '';
            const cargo = this.querySelector('#usuario-cargo').value;

            if (!id || !nombre || !email || !contraseña || !cargo) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            let usuarios = obtenerUsuarios();
            if (!Array.isArray(usuarios)) usuarios = [];

            if (this.idEditando !== null) {
                // map recorre los usuarios y crea un nuevo arreglo.
                usuarios = usuarios.map((u) =>
                    String(u.id) === String(this.idEditando)
                        ? { id, nombre, email, telefono, contraseña, password: contraseña, cargo }
                        : u
                );
                this.idEditando = null;
                this.querySelector('#usuario-id').disabled = false;
            } else {
                const existe = usuarios.some(
                    (u) => (u.id !== undefined && u.id !== null && String(u.id) === String(id)) || 
                           (u.email && u.email.toLowerCase() === email.toLowerCase())
                );
                if (existe) {
                    alert('Ya existe un usuario con esa identificacion o correo.');
                    return;
                }
                //push arrega un nuevo elemento al arreglo
                usuarios.push({ id, nombre, email, telefono, contraseña, password: contraseña, cargo });
            }

            guardarUsuarios(usuarios);
            alert('Usuario guardado exitosamente.');
            formUsuario.reset();
            //Actualiza la tabla al guardar
            this.mostrarUsuarios();
        });

    tbody.addEventListener('click', (e) => {
        const idSeleccionado = e.target.dataset.id;
        if(!idSeleccionado) return;

        // Recupera los usuarios y luego se muestran en la tabla.
        const usuarios = obtenerUsuarios();

        if(e.target.classList.contains('btn-editar')) {
            const usuario = usuarios.find((u) => String (u.id) === String(idSeleccionado));
            if (!usuario) return;
            
            this.querySelector('#usuario-id').value = usuario.id;
            this.querySelector('#usuario-id').disabled = true;
            this.querySelector('#usuario-nombre').value = usuario.nombre
            this.querySelector('#usuario-email').value = usuario.email;
            this.querySelector('#usuario-telefono').value = usuario.telefono;
            const inputContraseña = this.querySelector('#usuario-contraseña') || this.querySelector('#usuario-password');
            if (inputContraseña) inputContraseña.value = usuario.contraseña || usuario.password || '';
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
