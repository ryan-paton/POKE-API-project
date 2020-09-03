/*
pokeAPIpokemon.js

Functions to handle gathering and displaying pokemon information

Ryan Paton
2020-08-28
*/

function createTypeHTML(type) {
    // Returns HTML to display the pokemon type
    var result = document.createElement("span");
    var typeText = document.createElement("span");
    
    result.className = "pokemon-type " + type.name;
    typeText.innerHTML = type.name;
    result.appendChild(typeText);
    
    return result;
}

function createTypeListHTML(types) {
    // Returns HTML to display a list of pokemon types
    var result = document.createElement("div");
    var i;
    
    for (i = 0; i < types.length; i++) {
        result.appendChild(createTypeHTML(types[i]));
    }
    
    return result;
}

function createLabelHTML(labelText) {
    // Returns HTML label element with the given string as it's text
    var result = document.createElement("label");
    result.innerHTML = labelText;
    return result;
}

function setPokemonTypeInfo(types) {
    // Displays the pokemon types from a list of types
    var typeInfo = document.getElementById("info-type");
    typeInfo.innerHTML = "";
    var type, typeHTML, i;
    
    for (i = 0; i < types.length; i++) {
        type = types[i].type;
        typeHTML = createTypeHTML(type);
        typeHTML.id = type.name;
        typeHTML.className += " effect-tip";
        typeInfo.appendChild(typeHTML);
        
        DEX.getTypeByName(type.name).then(function(response) {
            handlePokemonTypeResponse(response);
        });
    }
}

function handlePokemonTypeResponse(response) {
    // Updates the pokemon type resistances popup
    var type = document.getElementById(response.name);
    var popup = document.createElement("div");
    popup.className = "effect-text";
    
    popup.appendChild(createLabelHTML("Vulnerable against:"));
    popup.appendChild(createTypeListHTML(response.damage_relations.double_damage_from));
    popup.appendChild(createLabelHTML("Resistant to:"));
    popup.appendChild(createTypeListHTML(response.damage_relations.half_damage_from));
    popup.appendChild(createLabelHTML("Unaffected By:"));
    popup.appendChild(createTypeListHTML(response.damage_relations.no_damage_from));
    
    type.appendChild(popup);
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

function getEnglishDescription(flavorTextEntries) {
    // Searches from the end of the list to the start and returns the first
    // occurance in english
    var i = flavorTextEntries.length - 1;
    var isFound = false;
    var result = "No Description";
    
    while (i >= 0 && !(isFound)) {
        var entry = flavorTextEntries[i];
        if (entry.language.name == "en") {
            isFound = true;
            result = entry.flavor_text;
        }
        i--;
    }
    return result;
}

function handlePreEvolutionResponse(response) {
    // Updates information about the pokemon evolved from
    document.getElementById("info-evo-from").appendChild(
        generatePokemonHTML(response));
}

function handleEvolutionResponse(response) {
    // Updates information about pokemon that can be evolved to
    var evolutionElement = document.getElementById("info-evo-to");
    var i;
    
    for (i = 0; i < response.length; i++) {
        evolutionElement.appendChild(generatePokemonHTML(response[i]));
    }
}

function getNextPokemonEvolution(name, evolutionChain) {
    // Recursively goes through a evolution chain and returns the list 
    // of the next pokemon after the one given
    var result = null;
    
    if (evolutionChain.species.name == name) {
        result = evolutionChain.evolves_to;
    }
    else {
        var evolutionList = evolutionChain.evolves_to;
        var i = 0;
        while (i < evolutionList.length && result == null) {
            result = getNextPokemonEvolution(name, evolutionList[i]);
            i++;
        }
    }
    
    return result;
}

function handleEvolutionChain(response) {
    // Requests the pokemon that can be evolved to
    var name = document.getElementById("info-name").title;
    var evolutionList = getNextPokemonEvolution(name, response.chain);
    var i, url, pokemonList = [];
    
    for (i = 0; i < evolutionList.length; i++) {
        url = "/api/v2/pokemon/" + evolutionList[i].species.name;
        pokemonList.push(url);
    }
    
    DEX.resource(pokemonList).then(function(response) {
        handleEvolutionResponse(response);
    });
}

function handleSpeciesResponse(response) {
    // Updates pokemon information
    document.getElementById("info-desc").innerHTML = getEnglishDescription(
        response.flavor_text_entries);
    
    if (response.evolves_from_species != null) {
        DEX.getPokemonByName(response.evolves_from_species.name).then(
        function(response) {
            handlePreEvolutionResponse(response);
        });
    }
    
    DEX.resource(response.evolution_chain.url).then(function(response) {
        handleEvolutionChain(response);
    });
}

function setPokemonInformation(pokemon) {
    // Displays the pokemon information
    var height = formatHeight(pokemon.height);
    var weight = formatWeight(pokemon.weight);
    var title = "#" + pokemon.id + " " + capitaliseWord(pokemon.name);
    
    document.getElementById("info-name").innerHTML = title;
    document.getElementById("info-name").title = pokemon.name;
    document.getElementById("info-img").src = pokemon.sprites.front_default;
    document.getElementById("info-height").innerHTML = height;
    document.getElementById("info-weight").innerHTML = weight;
    
    setPokemonTypeInfo(pokemon.types);
    
    // Clear old information
    document.getElementById("info-desc").innerHTML = "";
    document.getElementById("info-evo-from").innerHTML = "";
    document.getElementById("info-evo-to").innerHTML = "";
    
    // Request species information
    DEX.getPokemonSpeciesByName(pokemon.species.name).then(function(response) {
        handleSpeciesResponse(response);
    });
}

function handlePokemonResponse(response) {
    // When a pokemon request is received, display it's information
    setPokemonInformation(response);
}
