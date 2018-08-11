/*Bita Golshani 
  9 August 2018 
  Javascript file */  

//get info from input boxes
function getLoc() { 
loc1 = document.getElementById("firstloc").innerHTML;
loc2 = document.getElementById("secondloc").innerHTML; 

//function to find lat/long of city 
var getLoc = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

//try-catch 
getLoc('http://www.mapquestapi.com/geocoding/v1/{loc1}?key=ayZvRTHfODxxhoPqR3x6gvcARa2sGd4l',
function(err, data) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    alert('Your query count: ' + data.query.count);
  }
  
  console.log(data);
});
}






/*{ 
	
//	loc2 = document.getElementById("secondloc").innerHTML;
	geocodio.get('geocode', {q:loc1}, function(err, response) {
		if(err) throw err; 
	});
	
	console.log(response); 
}*/