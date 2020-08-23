/*
pokeAPI.js

makes calls to POKEAPI using the wrapper library "pokeapi-js-wrapper"

Ryan Paton
2020-08-24
*/

// Create new instance for the "pokeapi-js-wrapper"
const DEX = new Pokedex.Pokedex();

function populateSearchArea(response) {
    console.log(response);
}

function requestSearchArea() {
    // We only want the first 10 Pokemon for now
    var interval = {
        limit: 10, // Number of items
        offset: 0 // Starting from this number
    };
    
    DEX.getPokemonsList(interval).then(function(response) {
        populateSearchArea(response);
    });
}

// populate the search area once the page is loaded
window.addEventListener("load", requestSearchArea);

