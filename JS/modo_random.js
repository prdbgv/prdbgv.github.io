// Array de jugadores
const players = [
    { name: 'Leo Messi', score: 100 },
    { name: 'Victor Valdés', score: 30 },
    { name: 'Ronaldinho', score: 99 },
    { name: 'Puyol', score: 45 },
    { name: 'Koeman', score: 40 },
    { name: 'Rivaldo', score: 70 },
    { name: 'Pelé', score: 65 },
    { name: 'Maradona', score: 90 }
];

// Inicializar puntuación total
let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
document.getElementById('total-score').textContent = totalScore;

// Obtener el array 'Log' desde localStorage, o inicializarlo como un array vacío si no existe
let logArray = JSON.parse(localStorage.getItem('Log')) || [];

// Variables para rastrear el jugador actual en cada tarjeta
let currentPlayers = [null, null];

// Función para girar las tarjetas
function flipCard(cardIndex) {
    if (!currentPlayers[cardIndex]) {
        document.getElementById(`card${cardIndex}`).parentElement.classList.add('flipped');
        displayPlayer(cardIndex);
        
        // Mostrar el botón de tick correspondiente
        document.getElementById(`tick${cardIndex + 1}`).style.opacity = '1';

        // Mostrar el botón de X solo si ambas tarjetas están giradas
        if (document.querySelectorAll('.card.flipped').length === 2) {
            document.getElementById('reset').style.opacity = '1';
        }
    }
}

// Función para mostrar los datos del jugador
function displayPlayer(cardIndex) {
    const playerIndex = Math.floor(Math.random() * players.length);
    const player = players[playerIndex];
    currentPlayers[cardIndex] = player;
    document.getElementById(`player${cardIndex + 1}-name`).textContent = player.name;
    document.getElementById(`player${cardIndex + 1}-score`).textContent = `Puntuación: ${player.score}`;
}

// Función para aplicar la acción de Tick o Reset
function applyAction(action) {

    // Crear un nuevo registro
    const newEntry = {
        name: "Placeholder",
        mode: "Modo random",
        status: "Check"
    };

    if (action === 'tick1') {
        if (currentPlayers[0]) totalScore += currentPlayers[0].score;
        newEntry.name = currentPlayers[0].name;
        resetCards(); // Girar las tarjetas y mostrar nuevas
    } else if (action === 'tick2') {
        if (currentPlayers[1]) totalScore += currentPlayers[1].score;
        newEntry.name = currentPlayers[1].name;
        resetCards(); // Girar las tarjetas y mostrar nuevas
    } else if (action === 'reset') {
        if (totalScore - (currentPlayers[0].score + currentPlayers[1].score) < 0){
            window.alert("No te puedes quedar sin puntos");
        }else{
            // Restar las puntuaciones de ambas tarjetas
            if (currentPlayers[0]) totalScore -= currentPlayers[0].score;
            if (currentPlayers[1]) totalScore -= currentPlayers[1].score;
            resetCards(); // Girar las tarjetas y mostrar nuevas
            newEntry.name = "Players";
            newEntry.status = "Declined";
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
    document.getElementById('tick2').style.opacity = '0';
    document.getElementById('reset').style.opacity = '0';
}
