/*
pokeAPI.js

makes calls to POKEAPI

Ryan Paton
2020-07-01
*/

// TODO: Display cards with more than just the picture of a pokemon
// TODO: Display cards with pokemon search history
// TODO: change to allow pokemon with non alphanumeric characters

function parsePOKEAPI() {
	// Parses the JSON reponse from a HTTP GET from POKEAPI
	
	var pokemon = JSON.parse(this.responseText);
	
	// Save the result to reduce requests to the POKEAPI
	pokemonList[pokemon.name] = pokemon;
	
	// Add image of the pokemon to the webpage
	// TODO: Display cards with more than just the picture of a pokemon
	var html = "<img src=" + pokemon.sprites.front_default + " alt=\"pokemon\"/>";
	document.getElementById("results").innerHTML = html;
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
			//retrieve from cache
		}
	}
	else {
		// Display notice that pokemon does not exist
		// TODO: suggest similar searches
	}
}

