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
