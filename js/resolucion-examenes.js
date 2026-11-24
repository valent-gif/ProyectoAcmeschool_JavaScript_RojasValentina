class ResolucionExamenes extends HTMLElement {
    connectedCallback(){
        const template = document.getElementById('tpl-resolucion-examenes');
        const contenido = template.contentEditable.cloneNode(true);
        this.innerHTML = '';
        this.appendChild(contenido);

        this.examenActual = null;
        this.intervaloTiempo = null;
        this.segundosRestantes = 0;

        this.mostrarExamenesDisponibles();
        this.agregarEventos();

    }

    disconnectedCallback() {
        if(this.intervaloTiempo) {
            clearInterval(this.intervaloTiempo);
        }
    }

    mostrarExamenesDisponibles() {
        const contenedor = this.querySelector('#lista-examenes-publicos');
        const examenes = obtenerExamenes();
        contenedor.innerHTML = '';

        if (examenes.length === 0) {
            contenedor.innerHTML = '<p>NO hay examenes disponibles en este momento.</p>';
            return;
        }

        examenes
    }
}