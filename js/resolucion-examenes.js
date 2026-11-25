class ResolucionExamenes extends HTMLElement {
    connectedCallback(){
        const template = document.getElementById('tpl-resolucion-examenes');
        const contenido = template.content.cloneNode(true);
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
    const nombreEstudiante = this.querySelector('#estudiante-nombre').value.trim();
    const idEstudiante = this.querySelector('#estudiante-id').value.trim();
     
    if (!nombreEstudiante || !idEstudiante) {
        alert('Por favor ingresa tu nombre completo y numero de identificacion antes de iniciar');
        return;
    }
     
    const examenes = obtenerExamenes();
    const examen = examenes.find((ex) => ex.codigo === codigo);
    if(!examen) return;
     
    this.examenActual = examen;

    this.querySelector('#vista-seleccion-examen').hidden = true;
    this.querySelector('#vista-resultado-examen').hidden = true;
    this.querySelector('#vista-examen-activo').hidden = false;

    this.querySelector('#titulo-examen-activo').textContent = `${examen.titulo} (${examen.codigo})`;

    const contenedorPreguntas = this.querySelector('#contenedor-preguntas');
    contenedorPreguntas.innerHTML = '';

    examen.preguntas.forEach((pregunta, indexPregunta) => {
        const bloque = document.createElement('div');
        bloque.className = 'bloque-pregunta-estudiante';

        const opcionesHTML = pregunta.respuestas
        .map(
            (resp, indexOpcion) => `
            <label style="display: block; margin: 6px 0;">
            <input type="radio" name="pregunta-${indexPregunta}" value="${indexOpcion}">
            ${resp.texto}
            </label>
            `
        )
        .join('');

        bloque.innerHTML = `
        <p><strong>${indexPregunta + 1}. ${pregunta.enunciado}</strong></p>
        ${opcionesHTML}
        `;
        contenedorPreguntas.appendChild(bloque);
    });

    this.iniciarTemporizador(parseInt(examen.tiempo));
    }

    iniciarTemporizador(minutos) {
        if (this.intervaloTiempo) {
            clearInterval(this.intervaloTiempo);
        }

        this.segundosRestantes = minutos * 60;
        const reloj = this.querySelector('#temporizador');

        const actualizarTextoReloj = () => {
            const min = Math.floor(this.segundosRestantes / 60);
            const seg = this.segundosRestantes % 60;
            reloj.textContent = `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;   
        };

        actualizarTextoReloj();

        this.intervaloTiempo = setInterval(() => {
            this.segundosRestantes--;
            actualizarTextoReloj();

            if (this.segundosRestantes <= 0) {
                clearInterval(this.intervaloTiempo);
                alert('¡Se agoto el tiempo! Tu examen se enviara automaticamente.');
                this.finalizarExamen();
            }
        }, 1000);
    }

    finalizarExamen() {
        if(this.intervaloTiempo) {
            clearInterval(this.intervaloTiempo);
        }

        if(!this.examenActual) return;

        const totalPreguntas = this.examenActual.preguntas.length;
        let correctas = 0;

        this.examenActual.preguntas.forEach((pregunta, indexPregunta) => {
            const seleccionada = this.querySelector(`input[name="pregunta-${indexPregunta}"]:checked`);
            if (seleccionada) {
                const indiceRespuesta =Number(seleccionada.value);
                if (pregunta.respuestas[indiceRespuesta]?.esCorrecta) {
                    correctas++;
                }
            }
        });

        const porcentajeObtenido = Math.round((correctas / totalPreguntas) * 100);
        const porcentajeMinimo = parseInt(this.examenActual.porcentajeAprobacion);
        const aprobado = porcentajeObtenido >= porcentajeMinimo;

        const nombreEstudiante = this.querySelector('#estudiante-nombre').value.trim();
        const idEstudiante = this.querySelector('#estudiante-id').value.trim();

        // Guardamos el resultado en localStorage
        const resultados = obtenerResultados();
        resultados.push({
            estudianteId: idEstudiante,
            estudianteNombre: nombreEstudiante,
            examenCodigo: this.examenActual.codigo,
            examenTitulo: this.examenActual.titulo,
            correctas,
            totalPreguntas,
            porcentaje: porcentajeObtenido,
            aprobado,
            fecha: new Date().toLocaleString()
        });
        guardarResultados(resultados);

        // Mostramos la pantalla de resultados
        this.querySelector('#vista-examen-activo').hidden = true;
        this.querySelector('#vista-resultado-examen').hidden = false;

        this.querySelector('#detalle-resultado').innerHTML = `
            <p><strong>Estudiante:</strong> ${nombreEstudiante} (ID: ${idEstudiante})</p>
            <p><strong>Examen:</strong> ${this.examenActual.titulo}</p>
            <p><strong>Respuestas correctas:</strong> ${correctas} de ${totalPreguntas}</p>
            <p><strong>Puntaje obtenido:</strong> ${porcentajeObtenido}% (Mínimo requerido: ${porcentajeMinimo}%)</p>
            <p><strong>Estado:</strong> <strong>${aprobado ? 'APROBADO' : 'REPROBADO'}</strong></p>
        `;

        this.examenActual = null;
    }

    agregarEventos() {
        
        // Ir al login de docentes/administrativos
        this.querySelector('#btn-ir-login').addEventListener('click', () => {
            mostrarVista('login');
        });

        // Clic en "Presentar Examen"
        this.querySelector('#lista-examenes-publicos').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-iniciar-examen')) {
                const codigo = e.target.dataset.codigo;
                this.iniciarExamen(codigo);
            }
        });

        // Se envia el examen terminado
        this.querySelector('#form-resolver-examen').addEventListener('submit', (e) => {
            e.preventDefault();
            this.finalizarExamen();
        });

        // Volver al inicio después de ver la nota
        this.querySelector('#btn-volver-inicio').addEventListener('click', () => {
            this.querySelector('#vista-resultado-examen').hidden = true;
            this.querySelector('#vista-seleccion-examen').hidden = false;
            this.mostrarExamenesDisponibles();
        });
    }
}

customElements.define('resolucion-examenes', ResolucionExamenes);
