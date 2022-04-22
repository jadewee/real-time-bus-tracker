mapboxgl.accessToken = 'YOUR-ACCESS-TOKEN';

var map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/dark-v10', // dark style
    center: [-71.0727476236504, 42.36070356143535], 
    zoom: 13
});

// Declare array
let liveBusData = [];
let liveData = [];
let markers = [];
let routes = [];

let info = document.getElementById("Route");

// get live bus information
async function run(){
	const locations = await getliveBusData();
	console.log(new Date());
	console.log(locations);
	console.log(locations.length);
	for (let j = 0; j < markers.length; j++){
		markers[j].remove();
	}

	liveBusData = [];
	markers = [];
	removeAllChildNodes(info);
		
	for (let i = 0; i < liveData.length; i++){
		// generate random colour for marker
		var randomColor = Math.floor(Math.random()*16777215).toString(16);
		liveBusData.push([liveData[i].attributes.longitude, liveData[i].attributes.latitude]);
		markers.push(new mapboxgl.Marker({color: "#" + randomColor}));
	}

	for (let j = 0; j < markers.length; j++){
		markers[j].setLngLat([liveBusData[j][0], liveBusData[j][1]]).addTo(map);
	}

	for (let k = 0; k < markers.length; k++){
		let li = document.createElement("li");
		li.id = "listItem" + k; 
		li.innerHTML = "Bus " + liveData[k].attributes.label + ": " + liveData[k].attributes.occupancy_status;
		
		li.style.borderLeftColor = markers[k]._color; 
		info.appendChild(li);  
	}
	

	// timer
	setTimeout(run, 10000);
}

// Request bus data from MBTA
async function getliveBusData(){
	liveData = [];
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip&include=route';
	const response = await fetch(url);
	const json     = await response.json();
	liveData = json.data;
	return json.data;
}

run();

function removeAllChildNodes(parent) {
    parent.innerHTML = '<p class = "infoHeader">Harvard Square - Nubian Station Bus Seats Availibility</p>';
}
