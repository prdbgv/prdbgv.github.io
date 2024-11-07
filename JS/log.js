// Obtener el array 'Log' desde localStorage
const logArray = JSON.parse(localStorage.getItem('Log')) || [];

// Seleccionar el cuerpo de la tabla donde se añadirán las filas
const logTableBody = document.querySelector('#log-table tbody');

// Función para crear una fila en la tabla
function addLogRow(log) {
    const row = document.createElement('tr');

    // Crear celdas para nombre, modo y estado
    const nameCell = document.createElement('td');
    nameCell.textContent = log.name;
    const modeCell = document.createElement('td');
    modeCell.textContent = log.mode;
    const statusCell = document.createElement('td');
    statusCell.textContent = log.status;

    // Añadir las celdas a la fila
    row.appendChild(nameCell);
    row.appendChild(modeCell);
    row.appendChild(statusCell);

    // Añadir la fila al cuerpo de la tabla
    logTableBody.appendChild(row);
}

// Agregar cada entrada del array Log a la tabla
logArray.forEach(addLogRow);
