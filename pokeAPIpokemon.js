/*
pokeAPIpokemon.js

Functions to handle gathering and displaying pokemon information

Ryan Paton
2020-08-28
*/

function getPokemonTypeHTML(types) {
    // Returns HTML to display the pokemon types from a list of types
    var result = "";
    var name, i;
    
    for (i = 0; i < types.length; i++) {
        name = types[i].type.name;
        result += "<span class=\"pokemon-type " + name + "\">" + name + "</span>";
    }
    
    return result;
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
    document.getElementById("info-type").innerHTML = getPokemonTypeHTML(pokemon.types);
}

function handlePokemonResponse(response) {
    // When a pokemon request is received, display it's information
    setPokemonInformation(response);
}
