document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const btnAgregar = document.getElementById('btnAgregar');
    const btnBuscar = document.getElementById('btnBuscar');
    const btnListar = document.getElementById('btnListar');

    const secAgregar = document.getElementById('agregarPersona');
    const secBuscar = document.getElementById('buscarPersona');
    const secListar = document.getElementById('listarPersonas');

    const formAgregar = document.getElementById('formAgregar');
    const mensajeAgregar = document.getElementById('mensajeAgregar');

    const formBuscar = document.getElementById('formBuscar');
    const resultadosBusqueda = document.getElementById('resultadosBusqueda');

    const btnCargarLista = document.getElementById('btnCargarLista');
    const listaPersonas = document.getElementById('listaPersonas');
    const mensajeLista = document.getElementById('mensajeLista');

    // --- Funcionalidad de Navegación ---
    const showSection = (sectionToShow) => {
        // Oculta todas las secciones
        secAgregar.classList.add('hidden');
        secBuscar.classList.add('hidden');
        secListar.classList.add('hidden');

        // Remueve la clase 'active' de todos los botones de navegación
        btnAgregar.classList.remove('active');
        btnBuscar.classList.remove('active');
        btnListar.classList.remove('active');

        // Muestra la sección deseada y activa el botón correspondiente
        sectionToShow.classList.remove('hidden');
        if (sectionToShow === secAgregar) {
            btnAgregar.classList.add('active');
        } else if (sectionToShow === secBuscar) {
            btnBuscar.classList.add('active');
        } else if (sectionToShow === secListar) {
            btnListar.classList.add('active');
        }
    };

    // Event Listeners para los botones de navegación
    btnAgregar.addEventListener('click', () => showSection(secAgregar));
    btnBuscar.addEventListener('click', () => showSection(secBuscar));
    btnListar.addEventListener('click', () => showSection(secListar));

    // --- Funcionalidad de "Agregar Persona" ---
    formAgregar.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío del formulario por defecto

        const identificacion = document.getElementById('identificacion').value.trim();
        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const telefono = document.getElementById('telefono').value.trim();

        // Validar campos obligatorios
        if (!identificacion || !nombres || !apellidos || !direccion || !telefono) {
            mensajeAgregar.textContent = 'Todos los campos son obligatorios.';
            mensajeAgregar.style.backgroundColor = '#f8d7da'; // Rojo claro
            mensajeAgregar.style.color = '#721c24'; // Rojo oscuro
            return;
        }

        // Obtener personas existentes del localStorage o inicializar un array vacío
        let personas = JSON.parse(localStorage.getItem('personas')) || [];

        // Verificar si la identificación ya existe
        const idExistente = personas.some(persona => persona.identificacion === identificacion);
        if (idExistente) {
            mensajeAgregar.textContent = 'Error: El número de identificación ya existe.';
            mensajeAgregar.style.backgroundColor = '#f8d7da';
            mensajeAgregar.style.color = '#721c24';
            return;
        }

        // Crear nuevo objeto persona
        const nuevaPersona = {
            identificacion,
            nombres,
            apellidos,
            direccion,
            telefono
        };

        // Agregar la nueva persona al array
        personas.push(nuevaPersona);

        // Guardar el array actualizado en localStorage
        localStorage.setItem('personas', JSON.stringify(personas));

        // Limpiar el formulario y mostrar mensaje de éxito
        formAgregar.reset();
        mensajeAgregar.textContent = 'Persona guardada exitosamente.';
        mensajeAgregar.style.backgroundColor = '#d4edda'; // Verde claro
        mensajeAgregar.style.color = '#155724'; // Verde oscuro

        // Ocultar mensaje después de un tiempo
        setTimeout(() => {
            mensajeAgregar.textContent = '';
            mensajeAgregar.style.backgroundColor = 'transparent';
        }, 3000);
    });

    // --- Funcionalidad de "Buscar Persona" ---
    formBuscar.addEventListener('submit', (e) => {
        e.preventDefault();

        const criterio = document.getElementById('criterioBusqueda').value;
        const valor = document.getElementById('valorBusqueda').value.trim().toLowerCase();

        let personas = JSON.parse(localStorage.getItem('personas')) || [];
        let resultados = personas.filter(persona =>
            persona[criterio].toLowerCase().includes(valor)
        );

        mostrarTabla(resultados, resultadosBusqueda);
    });

    // --- Funcionalidad de "Listar Personas" ---
    btnCargarLista.addEventListener('click', () => {
        let personas = JSON.parse(localStorage.getItem('personas')) || [];
        if (personas.length === 0) {
            mensajeLista.textContent = 'No hay personas registradas.';
            mensajeLista.style.backgroundColor = '#fff3cd'; // Amarillo claro
            mensajeLista.style.color = '#856404'; // Amarillo oscuro
            listaPersonas.innerHTML = ''; // Limpia cualquier tabla anterior
            return;
        } else {
            mensajeLista.textContent = ''; // Limpia el mensaje si hay personas
            mensajeLista.style.backgroundColor = 'transparent';
        }
        mostrarTabla(personas, listaPersonas);
    });

    // --- Función genérica para mostrar tabla ---
    function mostrarTabla(data, containerElement) {
        if (data.length === 0) {
            containerElement.innerHTML = '<p class="no-results">No se encontraron resultados.</p>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Documento</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(persona => {
            tableHTML += `
                <tr>
                    <td>${persona.identificacion}</td>
                    <td>${persona.nombres}</td>
                    <td>${persona.apellidos}</td>
                    <td>${persona.direccion}</td>
                    <td>${persona.telefono}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
        containerElement.innerHTML = tableHTML;
    }

    // Mostrar la sección "Agregar Persona" al cargar la página
    showSection(secAgregar);
});