class gestionExamenes extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById('tpl-gestion-examenes');
        const contenido = template.cloneNode(true);
        this.innerHTML = '';
        this.appendChild(contenido);

        this.preguntasTemporales = [];
        this.codigoEditando = null;

        this.configurarPermisos();
        this.mostrarExamenes();
        this.agregarEventos();
    }

    configurarPermisos() {
        const usuarioActivo = obetnerUsaurioActivo ()
    }
}