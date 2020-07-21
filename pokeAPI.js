/*
pokeAPI.js

makes calls to POKEAPI

Ryan Paton
2020-07-01
*/

// TODO: Display cards with more than just the picture of a pokemon
// TODO: Display cards with pokemon search history
// TODO: change to allow pokemon with non alphanumeric characters

function displayPokemon(pokemon) {
	// Shows the information of the current Pokemon
	// TODO: Display cards with more than just the picture of a pokemon
	
	var html = "<img src=" + pokemon.sprites.front_default + " alt=\"pokemon\"/>";
	document.getElementById("results").innerHTML = html;
}

function displaySearchMessage(message) {
	// Shows a message below the search area
	
	var messagePanel = document.getElementById("messagePanel");
	messagePanel.innerHTML = message;
	// unhide message panel
	messagePanel.style.display = "block";
}

function parsePOKEAPI() {
	// Parses the JSON reponse from a HTTP GET from POKEAPI
	
	var pokemon = JSON.parse(this.responseText);
	
	// Save the result to reduce requests to the POKEAPI
	pokemonList[pokemon.name] = pokemon;
	
	displayPokemon(pokemon)
}

function requestPOKEAPI(searchName) {
	// Sends a HTTP GET request to the POKEAPI based in input in the search field
	
	var request = new XMLHttpRequest();
	
	request.addEventListener("load", parsePOKEAPI);
	request.open("GET", "https://pokeapi.co/api/v2/pokemon/" + searchName + "/");
	request.send();
}

function pokeSearch() {
	/*
	Compares the search input to the list of known pokemon names and then requests from
	POKEAPI if the pokemon name exists
	*/
	
	// Get user input from search bar
	var searchText = document.getElementById("searchText").value;
	searchText = searchText.toLowerCase();
	
	if (searchText in pokemonList) {
		if (pokemonList[searchText] == undefined) {
			requestPOKEAPI(searchText);
		}
		else {
			displayPokemon(pokemonList[searchText])
		}
	}
	else {
		// TODO: suggest similar searches
		
		displaySearchMessage("The Pokemon \"" + searchText + "\" could not " +
		"be found, please check spelling");
	}
}

