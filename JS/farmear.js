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

// Variables para rastrear el jugador actual en cada tarjeta
let currentPlayers = [null, null];

// Función para girar las tarjetas
function flipCard(cardIndex) {
    if (totalScore >= 5){
        totalScore -= 5;
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

        // Guardar en LocalStorage y actualizar la visualización
        localStorage.setItem('totalScore', totalScore);
        document.getElementById('total-score').textContent = totalScore;
    }else{
            window.alert("No tienes puntos suficientes");
        }
    
}

// Función para mostrar los datos del jugador
function displayPlayer(cardIndex) {

    // Paso 1: Duplicar el array de jugadores a arrayTemporal
    let arrayTemporal = [...players];

    // Paso 2: Modificar arrayTemporal para poner como score la diferencia con totalScore
    arrayTemporal = arrayTemporal.map(player => {
        // Añadimos una propiedad "scoreDifference" que es la diferencia con totalScore
        const scoreDifference = Math.abs(player.score - totalScore);
        return { ...player, scoreDifference };  // Mantemos la estructura del jugador, pero añadimos la diferencia
    });

    // Paso 3: Reordenar arrayTemporal según scoreDifference de menor a mayor
    arrayTemporal.sort((a, b) => a.scoreDifference - b.scoreDifference);

    // Paso 4: Si hay jugadores con la misma diferencia, reordenarlos aleatoriamente
    let i = 0;
    while (i < arrayTemporal.length) {
        const sameDiffGroup = [];
        const diff = arrayTemporal[i].scoreDifference;

        // Agrupar jugadores con la misma diferencia
        while (i < arrayTemporal.length && arrayTemporal[i].scoreDifference === diff) {
            sameDiffGroup.push(arrayTemporal[i]);
            i++;
        }

        // Si hay más de un jugador con la misma diferencia, mezclar aleatoriamente
        if (sameDiffGroup.length > 1) {
            for (let j = 0; j < sameDiffGroup.length; j++) {
                const randomIndex = Math.floor(Math.random() * sameDiffGroup.length);
                [sameDiffGroup[j], sameDiffGroup[randomIndex]] = [sameDiffGroup[randomIndex], sameDiffGroup[j]];
            }
        }

        // Reemplazar los jugadores con la misma diferencia en arrayTemporal
        arrayTemporal.splice(i - sameDiffGroup.length, sameDiffGroup.length, ...sameDiffGroup);
    }

    // Paso 5: Truncar arrayTemporal al primer elemento
    arrayTemporal = arrayTemporal.slice(0, 1);

    // Paso 6: Reescribir el valor del score con los valores del array original "players"
    arrayTemporal = arrayTemporal.map(tempPlayer => {
        // Encontrar al jugador en el array original "players"
        const originalPlayer = players.find(player => player.name === tempPlayer.name);
        
        // Obtener el índice del jugador en el array original "players"
        const playerIndex = players.findIndex(player => player.name === tempPlayer.name);
        
        // Guardamos el índice en el jugador seleccionado
        tempPlayer.originalIndex = playerIndex;
        
        return { ...tempPlayer, score: originalPlayer.score };  // Mantener el score original
    });

    // Aquí puedes acceder al índice del jugador seleccionado en arrayTemporal
    const selectedPlayerIndex = arrayTemporal[0].originalIndex;
    const player = players[selectedPlayerIndex];
    
    // Guardar al jugador seleccionado en currentPlayers
    currentPlayers[cardIndex] = player;

    // Mostrar el nombre y la puntuación del jugador seleccionado en la tarjeta correspondiente
    document.getElementById(`player${cardIndex + 1}-name`).textContent = player.name;
    document.getElementById(`player${cardIndex + 1}-score`).textContent = `Puntuación: ${player.score}`;

    // Paso 7: Eliminar el jugador seleccionado de la lista original "players" para evitar duplicados
    // Eliminar al jugador seleccionado de "arrayTemporal"
    const playerIndexToRemove = arrayTemporal[0].originalIndex;
    players.splice(playerIndexToRemove, 1); // Eliminar al jugador de "players"
    
    // Paso 8: Destruir arrayTemporal (en JavaScript, lo que significa dejar de usarlo)
    arrayTemporal = null;  // Esto elimina la referencia a arrayTemporal
}

// Función para aplicar la acción de Tick o Reset
function applyAction(action) {

    // Crear un nuevo registro
    const newEntry = {
        name: "Placeholder",
        mode: "Farmeo",
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
        if (totalScore - (currentPlayers[0].score + currentPlayers[1].score) >= 5){
            // Restar las puntuaciones de ambas tarjetas
            if (currentPlayers[0]) totalScore -= currentPlayers[0].score;
            if (currentPlayers[1]) totalScore -= currentPlayers[1].score;
            resetCards(); // Girar las tarjetas y mostrar nuevas
            newEntry.name = "Players";
            newEntry.status = "Declined";
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
    document.getElementById('tick2').style.opacity = '0';
    document.getElementById('reset').style.opacity = '0';
}
