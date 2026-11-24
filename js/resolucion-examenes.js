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

        examenes.forEach((examen) => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'tarjeta-examen';
            tarjeta.innerHTML = `
                <h4>${examen.titulo} (${examen.codigo})</h4>
                <p>${examen.descripcion}</p>
                <p><strong>Duración:</strong> ${parseInt(examen.tiempo)} min | <strong>Preguntas:</strong> ${examen.preguntas.length}</p>
                <button type="button" class="btn-iniciar-examen" data-codigo="${examen.codigo}">Presentar Examen</button>
            `;
            contenedor.appendChild(tarjeta);
        });
    }
    iniciarExamen(codigo) {
     const nombreEstudiante = this.querySelector('#estudiante-nombre').ariaValueMax.trim();
     const idEstudiante = this.querySelector('#estudiante-id').ariaValueMax.trim();
     
     
    }
}