var states = {
    'arizona': 'az',
    'alabama': 'al',
    'alaska': 'ak',
    'arkansas': 'ar',
    'california': 'ca',
    'colorado': 'co',
    'connecticut': 'ct',
    'delaware': 'de',
    'florida': 'fl',
    'georgia': 'ga',
    'hawaii': 'hi',
    'idaho': 'id',
    'illinois': 'il',
    'indiana': 'in',
    'iowa': 'ia',
    'kansas': 'ks',
    'kentucky': 'ky',
    'louisiana': 'la',
    'maine': 'me',
    'maryland': 'md',
    'massachusetts': 'ma',
    'michigan': 'mi',
    'minnesota': 'mn',
    'mississippi': 'ms',
    'missouri': 'mo',
    'montana': 'mt',
    'nebraska': 'ne',
    'nevada': 'nv',
    'new hampshire': 'nh',
    'new jersey': 'nj',
    'new mexico': 'nm',
    'new york': 'ny',
    'north carolina': 'nc',
    'north dakota': 'nd',
    'ohio': 'oh',
    'oklahoma': 'ok',
    'oregon': 'or',
    'pennsylvania': 'pa',
    'rhode island': 'ri',
    'south carolina': 'sc',
    'south dakota': 'sd',
    'tennessee': 'tn',
    'texas': 'tx',
    'utah': 'ut',
    'vermont': 'vt',
    'virginia': 'va',
    'washington': 'wa',
    'west virginia': 'wv',
    'wisconsin': 'wi',
    'wyoming': 'wy',	
};

var map;
var markers = [];
var criteria;
var order;

function initialize(){
	var mapCenter = {lat: 41.219575, lng:-99.994239};

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: mapCenter
    });	

    $('#submit').click(function(){
    	getSchoolsData();
    });

    $('#listtt').hover(function(){
    	console.log(checkCriteria())

    });
}

function checkCriteria(){
	var searchin;
	$("#search-criteria").html("");
	$('#ActLo').click(function(){
    	criteria = '2014.admissions.act_scores.midpoint.cumulative';
    	order = ':asc';
    	searching = 'lowest average ACT scores';
    });
	$('#ActHi').click(function(){
    	criteria = '2014.admissions.act_scores.midpoint.cumulative';
    	order = ':desc';
    	searching = 'highest average ACT scores';
    });
	$('#SatLo').click(function(){
    	criteria = '2014.admissions.sat_scores.average.overall'
    	order = ':asc';
    	searching = 'lowest average SAT scores';
    });
	$('#SatHi').click(function(){
    	criteria = '2014.admissions.sat_scores.average.overall';
    	order = ':desc';
    	searching = 'highest average SAT scores';
    });
	$('#AdmLo').click(function(){
    	criteria = '2014.admissions.admission_rate.overall';
    	order = ':asc';
    	searching = 'lowest admissions rate';
    });
	$('#AdmHi').click(function(){
    	criteria = '2014.admissions.admission_rate.overall';
    	order = ':desc';
    	searching = 'highest admissions rate';
    });

    var htmlString =	"<p class='searchCriteria'>" +
							"Criteria: colleges with the " + searching
						"</p>";
	//Use jQuery's append() function to add the searchResults to the DOM
	$("#search-criteria").append(htmlString);
}

function getSchoolsData(){
	
	var state = '';
	if ($('#StateInput').val() != ''){
		//converts the user's input to lower case and obtains the state abbreviation from the states object
		state = '&school.state=' + states[$('#StateInput').val().toLowerCase()];
	}
	var mainURL = 'https://api.data.gov/ed/collegescorecard/v1/schools.json?';
	var myApiID = '&api_key=jIx645ejILTvl7MIIWbkQT7TzlBG4nh4QLkmKzhY';
	var getFields = '&_fields=' + 'school.name,' + 'school.school_url,' + 'location.lat,location.lon,'

	$.ajax({
		 //url:'https://api.data.gov/ed/collegescorecard/v1/schools.json?&' + myApiID + location, 
		 url: mainURL + myApiID + state + getFields + criteria + '&_sort=' + criteria + order,
		 type: 'GET',
		 dataType: 'json',
		 error: function(data){
		 	alert("ERROR: Have you selected a search criteria?");
		 },
		 success: function(data){
		 	console.log(data);
		 	console.log('\n\n\n');
		 	myData = data.results
			deleteMarkers();

		 	for (var i = 0; i < myData.length; i++){
		 		plotOnMap(myData[i]);
		 	}
		 	console.log('All plotted') 	
		 }
	})
}

function plotOnMap(collegeData){
	//Create a marker for the college on the map
	var marker = new google.maps.Marker({
      position: {lat: collegeData['location.lat'], lng: collegeData['location.lon']},
      map: map,
    });

    //add info about the college when user clicks on it
    var infoWindow = new google.maps.InfoWindow({
      content: collegeData['school.name'] + ':  ' + collegeData[criteria] + '\nVisit their website'
    });
    marker.addListener('click', function(){
    	infoWindow.open(map, marker);
    });
    markers.push(marker);
}



function deleteMarkers(){
   for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
}




