/*
pokeAPI.js

makes calls to POKEAPI using the wrapper library "pokeapi-js-wrapper"

Ryan Paton
2020-08-24
*/

const POKE_DIV_CLASS = "w3-col l2 m2 s4";
const MAX_POKEMON_INDEX = 808;
const PAGE_SIZE = 36;

// Create new instance for the "pokeapi-js-wrapper"
const DEX = new Pokedex.Pokedex();

var currentPokemonListIndex;

function capitaliseWord(word) {
    // returns the given word with the first letter uppercase
    return word[0].toUpperCase() + word.slice(1);
}

function formatHeight(height) {
    // Returns a formatted string based on the given height in decimeters
    // i.e. 10s of cm
    var string;
    
    if (height >= 20) {
        string = (height / 10) + "m";
    } else {
        string = height + "0cm";
    }
    
    return string;
}

function formatWeight(weight) {
    // Returns a formatted string based on the given weight in hectograms
    // i.e. 100s of grams
    var string;
    
    if (weight >= 100) {
        string = (weight / 10) + "kg";
    } else {
        string = weight + "00g";
    }
    
    return string;
}

function pokemonClicked(pokemonDiv) {
    // Requests more info for a pokemon when it is clicked on from the list
    var name = pokemonDiv.id;
    DEX.getPokemonByName(name).then(function(response) {
        handlePokemonResponse(response);
    });
    
    // Scroll to top to view what was just clicked on
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function generatePokemonHTML(pokemon) {
    // Generates HTML for a single pokemon
    var pokeDiv = document.createElement("div");
    var pokeImage = document.createElement("img");
    var pokeName = document.createElement("p");
    
    // Set attributes
    pokeDiv.className = POKE_DIV_CLASS;
    pokeDiv.id = pokemon.name;
    pokeDiv.onclick = function(){pokemonClicked(this)};
    pokeImage.alt = pokemon.name;
    pokeName.innerHTML = capitaliseWord(pokemon.name);
    
    // request the image
    DEX.getPokemonByName(pokemon.name).then(function(response) {
        handlePokemonImageResponse(response);
    });
    
    // Put the image and name inside the div element
    pokeDiv.appendChild(pokeImage);
    pokeDiv.appendChild(pokeName);
    
    return pokeDiv;
}

function handlePokemonImageResponse(response) {
    // Updates the image for a pokemon in the list when a response is received
    var name = response.name;
    var imageElement = document.getElementById(name).firstChild;
    imageElement.src = response.sprites.front_default;
}

function setPokemonInformation(pokemon) {
    // Displays the pokemon information
    var height = formatHeight(pokemon.height);
    var weight = formatWeight(pokemon.weight);
    
    document.getElementById("info-name").innerHTML = capitaliseWord(pokemon.name);
    document.getElementById("info-img").src = pokemon.sprites.front_default;
    document.getElementById("info-height").innerHTML = height;
    document.getElementById("info-weight").innerHTML = weight;
}

function handlePokemonResponse(response) {
    // When a pokemon request is received, display it's information
    setPokemonInformation(response);
}

function populateSearchArea(response) {
    // Displays the list of pokemon once a request is received
    var searchArea = document.getElementById("search");
    var pokeList = response.results;
    var i;
    
    searchArea.innerHTML = "";
    for (i = 0; i < pokeList.length; i++) {
        searchArea.appendChild(generatePokemonHTML(pokeList[i]));
    }
}

/* --Button click handlers-- */
function nextPage() {
    requestPokemonList(currentPokemonListIndex + PAGE_SIZE);
}

function previousPage() {
    requestPokemonList(currentPokemonListIndex - PAGE_SIZE);
}

function requestPokemonList(startAt = 0, toLimit = PAGE_SIZE) {
    // Request list of pokemon to display
    var index = clampPageIndex(Number(startAt));
    var interval = {
        limit: toLimit, // Number of items
        offset: index // Starting from this number
    };
    currentPokemonListIndex = index;
    
    DEX.getPokemonsList(interval).then(function(response) {
        populateSearchArea(response);
    });
}

/* ---- */

function clampPageIndex (index) {
    // Make sure index is between 0 and (MAX_POKEMON_INDEX - PAGE_SIZE)
    var maxValue = MAX_POKEMON_INDEX - PAGE_SIZE - 1;
    if (index < 0) {
        index = 0;
    }
    if (index > maxValue) {
        index = maxValue;
    }
    return index;
}

function initialise() {
    requestPokemonList();
}

// populate the search area once the page is loaded
window.addEventListener("load", initialise);

