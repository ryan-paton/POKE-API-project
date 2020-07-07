/*
pokeAPI.js

makes calls to POKEAPI

Ryan Paton
2020-07-01
*/

// TODO: Display cards with more than just the picture of a pokemon
// TODO: Display cards with pokemon search history

function parsePOKEAPI() {
	// Parses the JSON reponse from a HTTP GET from POKEAPI
	// TODO: Cache responses
	
	var pokemon = JSON.parse(this.responseText);
	var html = "<img src=" + pokemon.sprites.front_default + " alt=\"pokemon\"/>";
	
	document.getElementById("results").innerHTML = html;
}

function requestPOKEAPI() {
	// Sends a HTTP GET request to the POKEAPI based in input in the search field
	// TODO: validate input
	
	var request = new XMLHttpRequest();
	
	// Get user input from search bar
	var searchText = document.getElementById("searchText").value;
	searchText = searchText.toLowerCase();
	
	request.addEventListener("load", parsePOKEAPI);
	request.open("GET", "https://pokeapi.co/api/v2/pokemon/" + searchText + "/");
	request.send();
}