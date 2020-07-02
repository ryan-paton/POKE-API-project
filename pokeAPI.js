/*
pokeAPI.js

makes calls to POKEAPI

Ryan Paton
2020-07-01
*/

function parsePOKEAPI(response) {
	// Parses the JSON reponse from a HTTP GET from POKEAPI
	console.log(response);
	var pokemon = JSON.parse(response);
	var html = "<img src=" + pokemon.sprites.front_default + " alt=\"pokemon\"/>";
	
	document.getElementById("results").innerHTML = html;
}

function requestPOKEAPI() {
	// Sends a HTTP GET request to the POKEAPI based in input in the search field
	var request = new XMLHttpRequest();
	var searchText = document.getElementById("searchText").value;
	
	// Get user input from search bar
	
	request.onload = parsePOKEAPI;
	request.open("GET", "https://pokeapi.co/api/v2/pokemon/" + searchText + "/");
	request.send();
}