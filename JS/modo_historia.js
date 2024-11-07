// Array de jugadores
const players = [
    { name: 'Leo Messi', score: 100 },
    { name: 'Victor Valdés', score: 30 },
    { name: 'Ronaldinho', score: 99 },
    { name: 'Puyol', score: 45 },
    { name: 'Koeman', score: 40 },
    { name: 'Rivaldo', score: 70 },
    { name: 'Pelé', score: 65 },
    { name: 'Maradona', score: 90 },
    { name: 'Neymar', score: 85 },
    { name: 'Cristiano Ronaldo', score: 110 },
    { name: 'Zico', score: 75 },
    { name: 'Kaká', score: 80 },
    { name: 'Baggio', score: 60 },
    { name: 'Ronald Koeman', score: 50 },
    { name: 'Xavi Hernández', score: 95 },
    { name: 'Andrés Iniesta', score: 92 },
    { name: 'Thierry Henry', score: 88 },
    { name: 'Zidane', score: 95 }
];

// Inicializar puntuación total
let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
document.getElementById('total-score').textContent = totalScore;

// Obtener el array 'Log' desde localStorage, o inicializarlo como un array vacío si no existe
let logArray = JSON.parse(localStorage.getItem('Log')) || [];

let selectedPlayerIndex = parseInt(localStorage.getItem('selectedPlayer')) || 0;

// Variables para rastrear el jugador actual en cada tarjeta
let currentPlayers = [null, null];

// Función para girar las tarjetas
function flipCard(cardIndex) {
    if (!currentPlayers[cardIndex]) {
        document.getElementById(`card${cardIndex}`).parentElement.classList.add('flipped');
        displayPlayer(cardIndex);
        
        // Mostrar el botón de tick correspondiente
        document.getElementById(`tick${cardIndex + 1}`).style.opacity = '1';

        // Mostrar el botón de X 
        document.getElementById('reset').style.opacity = '1';
        
    }

    // Guardar en LocalStorage y actualizar la visualización
    localStorage.setItem('totalScore', totalScore);
    document.getElementById('total-score').textContent = totalScore;
    
}

// Función para mostrar los datos del jugador
function displayPlayer(cardIndex) {

    // Paso 1: Recuperar el índice del jugador seleccionado previamente desde localStorage
    let selectedPlayerIndex = localStorage.getItem(`selectedPlayer`);

    // Si no hay jugador seleccionado previamente (primer turno), seleccionamos el primer jugador disponible
    if (!selectedPlayerIndex) {
        selectedPlayerIndex = 0;
    } else if (selectedPlayerIndex >= players.length) {
        // Si hemos alcanzado el final del array de jugadores, reiniciamos el índice
        selectedPlayerIndex = 0;
    }


    // Paso 2: Obtener el jugador seleccionado según el índice
    const player = players[selectedPlayerIndex];

    // Incrementar el índice para la siguiente selección, si es posible
    selectedPlayerIndex = parseInt(selectedPlayerIndex) + 1;

    // Paso 3: Guardar el índice del jugador seleccionado para la siguiente vez
    localStorage.setItem(`selectedPlayer`, selectedPlayerIndex);

    // Guardar al jugador seleccionado en currentPlayers
    currentPlayers[cardIndex] = player;

    // Mostrar el nombre y la puntuación del jugador seleccionado en la tarjeta correspondiente
    document.getElementById(`player${cardIndex + 1}-name`).textContent = player.name;
    document.getElementById(`player${cardIndex + 1}-score`).textContent = `Puntuación: ${player.score}`;

    
}


// Función para aplicar la acción de Tick o Reset
function applyAction(action) {

    // Crear un nuevo registro
    const newEntry = {
        name: currentPlayers[0].name,
        mode: "Modo historia",
        status: "Check"
    };

    if (action === 'tick1') {
        if (currentPlayers[0]){
            totalScore += currentPlayers[0].score;            
        } 
        resetCards(); // Girar las tarjetas y mostrar nuevas

    } else if (action === 'reset') {
        if (totalScore - (currentPlayers[0].score) >= 0){

            newEntry.status = "Declined"

            // Restar las puntuaciones de ambas tarjetas
            if (currentPlayers[0]) totalScore -= currentPlayers[0].score;
            resetCards(); // Girar las tarjetas y mostrar nuevas
        }else{
            window.alert("Te quedarías sin puntos");
        }

    }

    // Añadir el nuevo registro al array
    logArray.push(newEntry);

    // Guardar el array actualizado en localStorage
    localStorage.setItem('Log', JSON.stringify(logArray));

    // Guardar en LocalStorage y actualizar la visualización
    localStorage.setItem('totalScore', totalScore);
    document.getElementById('total-score').textContent = totalScore;
}

// Función para reiniciar las tarjetas y ocultar los botones
function resetCards() {
    document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
    currentPlayers = [null, null];

    // Ocultar botones
    document.getElementById('tick1').style.opacity = '0';
    document.getElementById('reset').style.opacity = '0';
}
