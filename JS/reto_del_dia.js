// Array de jugadores
const players = [
    { name: 'Leo Messi', score: 100, date: '2024-11-05' },  // Hace 2 días
    { name: 'Victor Valdés', score: 30, date: '2024-11-06' },  // Hace 1 día
    { name: 'Ronaldinho', score: 99, date: '2024-11-07' },  // Hoy
    { name: 'Puyol', score: 45, date: '2024-11-08' },  // Día siguiente
    { name: 'Koeman', score: 40, date: '2024-11-09' },
    { name: 'Rivaldo', score: 70, date: '2024-11-10' },
    { name: 'Pelé', score: 65, date: '2024-11-11' },
    { name: 'Maradona', score: 90, date: '2024-11-12' },
    { name: 'Neymar', score: 85, date: '2024-11-13' },
    { name: 'Cristiano Ronaldo', score: 110, date: '2024-11-14' },
    { name: 'Zico', score: 75, date: '2024-11-15' },
    { name: 'Kaká', score: 80, date: '2024-11-16' },
    { name: 'Baggio', score: 60, date: '2024-11-17' },
    { name: 'Ronald Koeman', score: 50, date: '2024-11-18' },
    { name: 'Xavi Hernández', score: 95, date: '2024-11-19' },
    { name: 'Andrés Iniesta', score: 92, date: '2024-11-20' },
    { name: 'Thierry Henry', score: 88, date: '2024-11-21' },
    { name: 'Zidane', score: 95, date: '2024-11-22' }
];

// Inicializar puntuación total
let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
document.getElementById('total-score').textContent = totalScore;

// Obtener el array 'Log' desde localStorage, o inicializarlo como un array vacío si no existe
let logArray = JSON.parse(localStorage.getItem('Log')) || [];

// Inicializar puntuación total
let completed = localStorage.getItem('completed') || 0;

// Inicializar selected player
let selectedPlayerIndex = parseInt(localStorage.getItem('selectedPlayerDay')) || 0;

// Variables para rastrear el jugador actual en cada tarjeta
let currentPlayers = [null, null];

function checkNewPlayer(cardIndex){
    // Verificar si ya se ha completado el día
    const completed = localStorage.getItem('completed');

    // Verificar si ya se ha completado el día
    const jugador = localStorage.getItem('selectedPlayerDay'); 

    // Paso 1: Recuperar la fecha actual
    const today = new Date().toISOString().split('T')[0];  // Obtener fecha en formato 'YYYY-MM-DD'

    const player = players.find(player => player.date === today);

    console.log(player.name);
    console.log(jugador);

    if (player.name != jugador || player.name != jugador && jugador === null){
        localStorage.setItem('completed', '0');
        return 1;
    }else{
        return 0;
    }

}

// Función para girar las tarjetas
function flipCard(cardIndex) {
    
    // Verificar si ya se ha completado el día
    const jugador = localStorage.getItem('selectedPlayerDay'); 
    
    if(checkNewPlayer(cardIndex)){

        document.getElementById(`card${cardIndex}`).parentElement.classList.add('flipped');
        
        // Mostrar el botón de tick correspondiente
        document.getElementById(`tick${cardIndex + 1}`).style.opacity = '1';

        // Mostrar el botón de X 
        document.getElementById('reset').style.opacity = '1';
        
    }else{

        document.getElementById(`card${cardIndex}`).parentElement.classList.add('flipped');

    }

    displayPlayer(cardIndex);

    // Guardar en LocalStorage y actualizar la visualización
    localStorage.setItem('totalScore', totalScore);
    document.getElementById('total-score').textContent = totalScore;
    
}

// Función para mostrar los datos del jugador
function displayPlayer(cardIndex) {
    // Recogemos el jugador actual
    const selectedPlayer = localStorage.getItem('selectedPlayerDay');

    // Paso 1: Recuperar la fecha actual
    const today = new Date().toISOString().split('T')[0];  // Obtener fecha en formato 'YYYY-MM-DD'

    // Buscar al jugador cuya fecha sea hoy
    const player = players.find(player => player.date === today);

    if (player) {
        // Mostrar el nombre y la puntuación del jugador seleccionado en la tarjeta correspondiente
        document.getElementById(`player${cardIndex + 1}-name`).textContent = player.name;
        document.getElementById(`player${cardIndex + 1}-score`).textContent = `Puntuación: ${player.score}`;
    } else {
        console.log("No hay jugador para la fecha de hoy.");
    }

    // Guardar al jugador seleccionado en currentPlayers
    currentPlayers[cardIndex] = player;

    // Mostrar el nombre y la puntuación del jugador seleccionado en la tarjeta correspondiente
    document.getElementById(`player${cardIndex + 1}-name`).textContent = player.name;
    document.getElementById(`player${cardIndex + 1}-score`).textContent = `Puntuación: ${player.score}`;
}


// Función para aplicar la acción de Tick o Reset
function applyAction(action, cardIndex) {

    // Recogemos el jugador actual
    const selectedPlayer = localStorage.getItem('selectedPlayerDay');

    // Paso 1: Recuperar la fecha actual
    const today = new Date().toISOString().split('T')[0];  // Obtener fecha en formato 'YYYY-MM-DD'

    // Buscar al jugador cuya fecha sea hoy
    const player = players.find(player => player.date === today);

    // Verificar si ya se ha completado el día
    const completed = localStorage.getItem('completed');

    // Crear un nuevo registro
    const newEntry = {
        name: currentPlayers[0].name,
        mode: "Reto del día",
        status: "Check"
    };

    console.log(action + " " + completed + " " + checkNewPlayer(cardIndex));

    if (action == 'tick1' && completed == 0 && checkNewPlayer(cardIndex)) {

        console.log("Hecho");

        if (currentPlayers[0]) totalScore += currentPlayers[0].score;
        resetCards(); // Girar las tarjetas y mostrar nuevas
        localStorage.setItem('completed', '1'); 
        localStorage.setItem('selectedPlayerDay', player.name); 

        // Añadir el nuevo registro al array
        logArray.push(newEntry);

        // Guardar el array actualizado en localStorage
        localStorage.setItem('Log', JSON.stringify(logArray));

        location.reload(true);
    } else if (action === 'reset' && !completed) {
        if (totalScore - (currentPlayers[0].score) >= 0){
            // Restar las puntuaciones de ambas tarjetas
            if (currentPlayers[0]) totalScore -= currentPlayers[0].score;
            resetCards(); // Girar las tarjetas y mostrar nuevas
            newEntry.satus = "Declined";

            // Añadir el nuevo registro al array
            logArray.push(newEntry);

            // Guardar el array actualizado en localStorage
            localStorage.setItem('Log', JSON.stringify(logArray));
        }else{
            window.alert("Te quedarías sin puntos");
        }

    }

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
