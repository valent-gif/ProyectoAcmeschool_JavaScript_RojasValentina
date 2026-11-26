// Web component
class gestionExamenes extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById('tpl-gestion-examenes');
        const contenido = template.content.cloneNode(true);
        this.innerHTML = '';
        this.appendChild(contenido);

        this.preguntasTemporales = [];
        this.codigoEditando = null;

        this.configurarPermisos();
        this.mostrarExamenes();
        this.agregarEventos();
    }

    configurarPermisos() {
        const usuarioActivo = typeof obtenerSesion === 'function' ? obtenerSesion() : null;
        const btnUsuarios = this.querySelector('#nav-usuarios');
        // Solo el cargo Administrativo puede ver el botón de Usuarios
        if (usuarioActivo && usuarioActivo.cargo !== 'Administrativo') {
            btnUsuarios.style.display = 'none';
        }
    }

    mostrarPreguntasPrevias() {
        const lista = this.querySelector('#lista-preguntas-previa');
        lista.innerHTML = '';

        this.preguntasTemporales.forEach((preg, index)=> {
            const item = document.createElement('li');
            const correcta = preg.respuestas.find((r) => r.esCorrecta);
            item.innerHTML = `
            
            <strong>${index + 1}. ${preg.enunciado}</strong>
            (Correcta: ${correcta ? correcta.texto : '' })
            <button type="button" class="btn-quitar-pregunta" data-index="${index}">Quitar</button>
          `;
          lista.appendChild(item);
        });
    }

    mostrarExamenes() { 
            const tbody = this.querySelector('#tabla-examenes-body');
            const examenes = obtenerExamenes();
            tbody.innerHTML = '';

            examenes.forEach((examen) => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                <td>${examen.codigo}</td>
                <td>${examen.titulo}</td>
                <td>${examen.tiempo}</td>
                <td>${examen.porcentajeAprobacion}%</td>
                <td>${examen.preguntas.length}</td>
                <td>
                <button type="button" class="btn-editar-examen" data-codigo="${examen.codigo}">Editar</button>
                <button type="button" class="btn-eliminar-examen" data-codigo="${examen.codigo}">Eliminar</button>
                </td>
                `;
                tbody.appendChild(fila);
            });
        }

        agregarEventos() {
        const formExamen = this.querySelector('#form-examen');
        const btnAgregarPregunta = this.querySelector('#btn-agregar-pregunta');
        const listaPrevias = this.querySelector('#lista-preguntas-previa');
        const tbody = this.querySelector('#tabla-examenes-body');

        // Navegación
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

        // Añadir pregunta a la lista temporal
        btnAgregarPregunta.addEventListener('click', () => {
            const enunciado = this.querySelector('#pregunta-enunciado').value.trim();
            const textosOpciones = [
                this.querySelector('#opcion-0').value.trim(),
                this.querySelector('#opcion-1').value.trim(),
                this.querySelector('#opcion-2').value.trim(),
                this.querySelector('#opcion-3').value.trim()
            ];
            const indiceCorrecta = Number(this.querySelector('#pregunta-correcta').value);

            if (!enunciado || textosOpciones.some((texto) => texto === '')) {
                alert('Completa el enunciado y las 4 opciones antes de añadir la pregunta.');
                return;
            }

            const respuestas = textosOpciones.map((texto, idx) => ({
                texto,
                esCorrecta: idx === indiceCorrecta
            }));

            this.preguntasTemporales.push({
                id: this.preguntasTemporales.length + 1,
                enunciado,
                respuestas
            });

            // Limpiar campos de la pregunta
            this.querySelector('#pregunta-enunciado').value = '';
            this.querySelector('#opcion-0').value = '';
            this.querySelector('#opcion-1').value = '';
            this.querySelector('#opcion-2').value = '';
            this.querySelector('#opcion-3').value = '';

            this.mostrarPreguntasPrevias();
        });

        // Quitar pregunta de la lista previa
        listaPrevias.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-quitar-pregunta')) {
                const index = Number(e.target.dataset.index);
                this.preguntasTemporales.splice(index, 1);
                this.mostrarPreguntasPrevias();
            }
        });

        // Guardar examen completo
        formExamen.addEventListener('submit', (e) => {
            e.preventDefault();

            if (this.preguntasTemporales.length === 0) {
                alert('Debes añadir al menos una pregunta al examen.');
                return;
            }

            const codigo = this.querySelector('#examen-codigo').value.trim();
            const titulo = this.querySelector('#examen-titulo').value.trim();
            const descripcion = this.querySelector('#examen-descripcion').value.trim();
            const tiempo = Number(this.querySelector('#examen-tiempo').value);
            const porcentajeAprobacion = Number(this.querySelector('#examen-aprobacion').value);

            let examenes = obtenerExamenes();

            const nuevoExamen = {
                codigo,
                titulo,
                descripcion,
                tiempo,
                porcentajeAprobacion,
                preguntas: [...this.preguntasTemporales]
            };

            if (this.codigoEditando !== null) {
                examenes = examenes.map((ex) =>
                    ex.codigo === this.codigoEditando ? nuevoExamen : ex
                );
                this.codigoEditando = null;
                this.querySelector('#examen-codigo').disabled = false;
            } else {
                const existe = examenes.some((ex) => ex.codigo === codigo);
                if (existe) {
                    alert('Ya existe un examen con ese código.');
                    return;
                }
                examenes.push(nuevoExamen);
            }

            guardarExamenes(examenes);
            formExamen.reset();
            this.preguntasTemporales = [];
            this.mostrarPreguntasPrevias();
            this.mostrarExamenes();
        });

        // Editar o eliminar examen de la tabla
        tbody.addEventListener('click', (e) => {
            const codigo = e.target.dataset.codigo;
            if (!codigo) return;

            const examenes = obtenerExamenes();

            if (e.target.classList.contains('btn-editar-examen')) {
                const examen = examenes.find((ex) => ex.codigo === codigo);
                if (!examen) return;

                this.querySelector('#examen-codigo').value = examen.codigo;
                this.querySelector('#examen-codigo').disabled = true;
                this.querySelector('#examen-titulo').value = examen.titulo;
                this.querySelector('#examen-descripcion').value = examen.descripcion;
                this.querySelector('#examen-tiempo').value = parseInt(examen.tiempo);
                this.querySelector('#examen-aprobacion').value = parseInt(examen.porcentajeAprobacion);

                this.preguntasTemporales = [...examen.preguntas];
                this.mostrarPreguntasPrevias();
                this.codigoEditando = examen.codigo;
            }

            if (e.target.classList.contains('btn-eliminar-examen')) {
                const filtrados = examenes.filter((ex) => ex.codigo !== codigo);
                guardarExamenes(filtrados);
                this.mostrarExamenes();
            }
        });
    }
}

customElements.define('gestion-examenes', gestionExamenes);