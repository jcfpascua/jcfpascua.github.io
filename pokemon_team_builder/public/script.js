const firebaseConfig = {
    // apiKey: "YOUR_API_KEY",
    // authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "pokemon-team-builder-f2696",
    // storageBucket: "YOUR_STORAGE_BUCKET",
    // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:657972219849:web:c766eadfc148516f54e218"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const searchInput = document.getElementById("pokemon-search");
const searchResults = document.getElementById("search-results");
const teamContainer = document.getElementById("team");
const saveTeamButton = document.getElementById("save-team");
const savedTeamsList = document.getElementById("saved-teams-list");

let selectedTeam = [];

async function fetchPokemonList() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching Pokémon list:", error);
        alert("Failed to load Pokémon list. Please try again.");
        return [];
    }
}

async function searchPokemon(query) {
    if (query.length < 2) {
        searchResults.innerHTML = "";
        return;
    }

    const allPokemon = await fetchPokemonList();
    const filtered = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query.toLowerCase())
    );

    searchResults.innerHTML = "";
    filtered.slice(0, 5).forEach(async (pokemon) => {
        const pokemonData = await fetch(pokemon.url).then(res => res.json());

        const listItem = document.createElement("li");
        listItem.innerHTML = `<img src="${pokemonData.sprites.front_default}" alt="${pokemon.name}"> ${pokemon.name}`;
        listItem.addEventListener("click", () => {
            addToTeam({
                name: pokemon.name,
                image: pokemonData.sprites.front_default || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
            });

            searchInput.value = "";
            searchResults.innerHTML = "";
        });

        searchResults.appendChild(listItem);
    });
}

function addToTeam(pokemon) {
    if (selectedTeam.length >= 6) {
        alert("You can only have 6 Pokémon in a team!");
        return;
    }

    selectedTeam.push(pokemon);
    renderTeam();

    searchInput.value = ""; 
    searchResults.innerHTML = ""; 
}

function renderTeam() {
    teamContainer.innerHTML = "";
    selectedTeam.forEach((pokemon, index) => {
        const div = document.createElement("div");
        div.classList.add("pokemon-card");
        div.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <br>${pokemon.name}
            <button class="remove-pokemon" onclick="removeFromTeam(${index})">❌</button>
        `;
        teamContainer.appendChild(div);
    });
}

function removeFromTeam(index) {
    selectedTeam.splice(index, 1);
    renderTeam();
}

async function saveTeam() {
    if (selectedTeam.length === 0) {
        alert("Add Pokémon before saving!");
        return;
    }

    const teamData = selectedTeam.map(pokemon => ({
        name: pokemon.name,
        image: pokemon.image || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    }));

    await db.collection("teams").add({
        team: teamData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Team saved!");

    selectedTeam = [];
    renderTeam();
    loadSavedTeams();
}

async function loadSavedTeams() {
    savedTeamsList.innerHTML = ""; 
    const snapshot = await db.collection("teams").orderBy("timestamp", "desc").get();

    snapshot.forEach(doc => {
        const teamData = doc.data();
        const teamId = doc.id;

        const teamCard = document.createElement("div");
        teamCard.classList.add("saved-team-card");

        teamCard.innerHTML = `
            <h3>Team</h3>
            <div class="pokemon-list">
                ${teamData.team.map(pokemon => `<img src="${pokemon.image}" alt="${pokemon.name}" width="40"> ${pokemon.name}`).join(" | ")}
            </div>
            <button class="edit-team" onclick="editTeam('${teamId}')">✏ Edit</button>
            <button class="delete-team" onclick="deleteTeam('${teamId}')">🗑 Delete</button>
        `;

        savedTeamsList.appendChild(teamCard);
    });
}

async function deleteTeam(teamId) {
    if (!confirm("Are you sure you want to delete this team?")) {
        return; // Exit if user cancels
    }

    await db.collection("teams").doc(teamId).delete();

    alert("Team deleted successfully!");
    loadSavedTeams(); 
}



async function editTeam(teamId) {
    const doc = await db.collection("teams").doc(teamId).get();
    if (!doc.exists) {
        alert("Team not found!");
        return;
    }

    const teamData = doc.data();
    selectedTeam = teamData.team.map(pokemon => ({
        name: pokemon.name,
        image: pokemon.image || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    }));

    renderTeam();

    saveTeamButton.textContent = "Update Team";

    saveTeamButton.replaceWith(saveTeamButton.cloneNode(true));
    const newSaveTeamButton = document.getElementById("save-team");

    newSaveTeamButton.addEventListener("click", () => updateTeam(teamId));
}

async function updateTeam(teamId) {
    if (selectedTeam.length === 0) {
        alert("Your team is empty!");
        return;
    }

    const updatedTeamData = selectedTeam.map(pokemon => ({
        name: pokemon.name,
        image: pokemon.image || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
    }));

    await db.collection("teams").doc(teamId).set({
        team: updatedTeamData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Team updated successfully!");

    selectedTeam = []; 
    renderTeam();
    loadSavedTeams();

    location.reload();
}

async function clearAllTeams() {
    if (!confirm("Are you sure you want to delete ALL saved teams? This cannot be undone!")) {
        return;
    }

    const snapshot = await db.collection("teams").get();
    const batch = db.batch();

    snapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit(); 

    alert("All teams have been deleted!");
    loadSavedTeams(); 
}

document.getElementById("clear-all-teams").addEventListener("click", clearAllTeams);


searchInput.addEventListener("input", () => searchPokemon(searchInput.value));
saveTeamButton.addEventListener("click", saveTeam);

document.addEventListener("DOMContentLoaded", () => {
    fetchPokemonList();
    loadSavedTeams();
});
