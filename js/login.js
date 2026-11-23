class LoginAcme extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById('tpl-login');
        const contenido = template.content.cloneNode(true);
        this.innerHTML = '';
        this.appendChild(contenido);

        this.agregarEventos();
    }
    
    agregarEventos() {
        const formLogin = this.querySelector('#form-login');
        const btnVolver = this.querySelector('#btn-volver-publico');
        const mensajeError = this.querySelector('#login-error');
        
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = this.querySelector('#login-email').value.trim();
            const password = this.querySelector('#login-password').value;

            const usuarios = obtenerUsuarios();
            const usuarioValido = usuarios.find(
                (u) => u.email === email && u.password === password
            );

            if (usuarioValido) {
                guardarSesion(usuarioValido);
                if (usuarioValido.cargo === 'Administrador') {
                    mostrarVista('usuarios');
                } else {
                    mostrarVista('examenes');
                }
            } else {
                mensajeError.textContent = 'Correo o contraseña incorrectos.';
            }
        });

        btnVolver.addEventListener('click', () => {
            mostrarVista('publico');
        });
    }
}

customElements.define('login-acme', LoginAcme);















