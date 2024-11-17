// URL del backend
const URL = 'http://localhost:8000/api/app';
let editando = false;
let codigoOriginal = '';

// Variables globales para los datos
let todosLosEstudiantes = [];
let estudiantesFiltrados = [];

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para editar estudiante
function editarEstudiante(cod) {
    editando = true;
    codigoOriginal = cod;
    
    fetch(`${URL}/estudiantes/${cod}`)
        .then(response => response.json())
        .then(estudiante => {
            document.getElementById('codigo').value = estudiante.cod;
            document.getElementById('nombres').value = estudiante.nombres;
            document.getElementById('email').value = estudiante.email;
            document.getElementById('tituloFormulario').textContent = 'Editar Estudiante';
        });
}

// Función para cancelar edición
function cancelarEdicion() {
    editando = false;
    codigoOriginal = '';
    document.getElementById('formularioEstudiante').reset();
    document.getElementById('tituloFormulario').textContent = 'Agregar Estudiante';
    document.getElementById('errorCodigo').textContent = '';
    document.getElementById('errorEmail').textContent = '';
}

// Función para actualizar el resumen
function actualizarResumen(datos) {
    let aprobados = 0;
    let reprobados = 0;
    let sinNotas = 0;

    datos.forEach(estudiante => {
        if(estudiante.promedio === 0) {
            sinNotas++;
        } else if(estudiante.promedio >= 3) {
            aprobados++;
        } else {
            reprobados++;
        }
    });

    document.getElementById('aprobados').textContent = aprobados;
    document.getElementById('reprobados').textContent = reprobados;
    document.getElementById('sinNotas').textContent = sinNotas;
}

// Función para cargar estudiantes
function cargarEstudiantes() {
    fetch(URL + '/estudiantes')
        .then(response => response.json())
        .then(datos => {
            todosLosEstudiantes = datos;
            estudiantesFiltrados = datos;
            mostrarEstudiantes();
            actualizarResumen(datos);
        });
}

// Función para mostrar estudiantes en la tabla
function mostrarEstudiantes() {
    const tabla = document.getElementById('tablaEstudiantes');
    tabla.innerHTML = '';

    estudiantesFiltrados.forEach(estudiante => {
        const promedio = estudiante.promedio > 0 ? 
            estudiante.promedio : 'No hay notas';
        
        const estado = estudiante.promedio > 0 ? 
            estudiante.estado : 'No hay notas';

        tabla.innerHTML += `
            <tr>
                <td>${estudiante.cod}</td>
                <td>${estudiante.nombres}</td>
                <td>${estudiante.email}</td>
                <td>${promedio}</td>
                <td>${estado}</td>
                <td>
                    <button onclick="editarEstudiante('${estudiante.cod}')">Editar</button>
                    <button onclick="eliminarEstudiante('${estudiante.cod}', '${estudiante.nombres}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Función para aplicar filtros
function aplicarFiltros() {
    const codigo = document.getElementById('filtroCodigo').value.toLowerCase();
    const nombre = document.getElementById('filtroNombre').value.toLowerCase();
    const email = document.getElementById('filtroEmail').value.toLowerCase();
    const estado = document.getElementById('filtroEstado').value;
    const notaMin = document.getElementById('filtroNotaMin').value;
    const notaMax = document.getElementById('filtroNotaMax').value;

    estudiantesFiltrados = todosLosEstudiantes.filter(estudiante => {
        // Filtro por código
        if (codigo && !estudiante.cod.toString().toLowerCase().includes(codigo)) {
            return false;
        }

        // Filtro por nombre
        if (nombre && !estudiante.nombres.toLowerCase().includes(nombre)) {
            return false;
        }

        // Filtro por email
        if (email && !estudiante.email.toLowerCase().includes(email)) {
            return false;
        }

        // Filtro por estado
        if (estado === 'Sin Notas' && estudiante.promedio > 0) {
            return false;
        }
        if (estado === 'Aprobado' && estudiante.estado !== 'Aprobado') {
            return false;
        }
        if (estado === 'Reprobado' && estudiante.estado !== 'Reprobado') {
            return false;
        }

        // Filtro por rango de nota
        if (notaMin && estudiante.promedio < parseFloat(notaMin)) {
            return false;
        }
        if (notaMax && estudiante.promedio > parseFloat(notaMax)) {
            return false;
        }

        return true;
    });

    mostrarEstudiantes();
    actualizarResumen(estudiantesFiltrados);
}

// Función para limpiar filtros
function limpiarFiltros() {
    document.getElementById('filtroCodigo').value = '';
    document.getElementById('filtroNombre').value = '';
    document.getElementById('filtroEmail').value = '';
    document.getElementById('filtroEstado').value = '';
    document.getElementById('filtroNotaMin').value = '';
    document.getElementById('filtroNotaMax').value = '';
    
    estudiantesFiltrados = todosLosEstudiantes;
    mostrarEstudiantes();
    actualizarResumen(todosLosEstudiantes);
}

// Función para eliminar estudiante
function eliminarEstudiante(codigo, nombre) {
    const mensaje = `¿Está seguro que desea eliminar al estudiante ${nombre}?\n\nEsta acción no se puede deshacer.`;
    
    if(confirm(mensaje)) {
        fetch(`${URL}/estudiantes/${codigo}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(respuesta => {
            if(respuesta.error) {
                alert(respuesta.error);
            } else {
                alert('Estudiante eliminado exitosamente');
                cargarEstudiantes();
            }
        });
    }
}

// Función para guardar estudiante
function guardarEstudiante(evento) {
    evento.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const nombres = document.getElementById('nombres').value;
    const email = document.getElementById('email').value;

    // Validar email
    if (!validarEmail(email)) {
        document.getElementById('errorEmail').textContent = 'Email inválido';
        return;
    }

    const datos = { cod: codigo, nombres, email };
    const url = editando ? `${URL}/estudiantes/${codigoOriginal}` : `${URL}/estudiantes`;
    const metodo = editando ? 'PUT' : 'POST';

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(respuesta => {
        if (respuesta.error) {
            if (respuesta.error.includes('código')) {
                document.getElementById('errorCodigo').textContent = 'Código ya existe';
            }
            if (respuesta.error.includes('email')) {
                document.getElementById('errorEmail').textContent = 'Email ya existe';
            }
        } else {
            alert(editando ? 'Estudiante actualizado' : 'Estudiante guardado');
            cancelarEdicion();
            cargarEstudiantes();
        }
    });
}

// Función para guardar nota
function guardarNota(evento) {
    evento.preventDefault();

    const datos = {
        codEstudiante: document.getElementById('codEstudiante').value,
        actividad: document.getElementById('actividad').value,
        nota: document.getElementById('nota').value
    };

    fetch(URL + '/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(() => {
        alert('Nota guardada');
        document.getElementById('formularioNota').reset();
        cargarEstudiantes();
    });
}

// Cuando la página cargue
window.onload = function() {
    cargarEstudiantes();
    document.getElementById('formularioEstudiante').onsubmit = guardarEstudiante;
    document.getElementById('formularioNota').onsubmit = guardarNota;
} 