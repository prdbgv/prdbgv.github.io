// Array de ejemplo con items de la tienda
const storeItems = [
    { name: "Poción", cost: 10 },
    { name: "Antídoto", cost: 5 },
    { name: "Super Poción", cost: 20 },
    { name: "Revitalizador", cost: 30 },
    { name: "Elixir", cost: 50 }
];

// Obtener puntos de LocalStorage o inicializar si no existe
let points = parseInt(localStorage.getItem("TotalScore")) || 100;
document.getElementById("points").textContent = points; // Mostrar puntos al cargar

// Obtener el array 'Log' desde localStorage, o inicializarlo como un array vacío si no existe
let logArray = JSON.parse(localStorage.getItem('Log')) || [];

// Función para renderizar la tienda
function renderStore() {
    const storeContainer = document.getElementById("store-container");
    storeContainer.innerHTML = ""; // Limpiar el contenedor

    storeItems.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("store-card");
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>Coste: ${item.cost} puntos</p>
        `;

        // Añadir evento de compra al hacer clic en la tarjeta
        card.addEventListener("click", () => buyItem(index));
        storeContainer.appendChild(card);
    });
}

// Función para comprar un item
function buyItem(index) {
    const item = storeItems[index];

    if (points >= item.cost) {

        // Crear un nuevo registro
        const newEntry = {
            name: item.name,
            mode: "Tienda",
            status: "Compra"
        };

        points -= item.cost; // Restar puntos
        document.getElementById("points").textContent = points; // Actualizar puntos en la pantalla

        // Actualizar el LocalStorage con los nuevos puntos
        localStorage.setItem("TotalScore", points);

        // Añadir el nuevo registro al array
        logArray.push(newEntry);

        // Guardar el array actualizado en localStorage
        localStorage.setItem('Log', JSON.stringify(logArray));

        //storeItems.splice(index, 1); // Eliminar el ítem de la tienda
        renderStore(); // Volver a renderizar la tienda
    } else {
        alert("No tienes suficientes puntos para comprar este artículo.");
    }
}

// Inicializar tienda al cargar la página
document.addEventListener("DOMContentLoaded", renderStore);
