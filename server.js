var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require("fs");

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

//Handle Countries
var countries = fs.readFileSync("countriesMinimal.json");
console.log((new Date()) + ' Countries file loaded');
function findCountryCode(country) { 
    return country.alpha2 == "ZW";
};
console.log((new Date()) + ' Find Res.: ' + countries.find(findCountryCode));
console.log((new Date()) + ' Index Res.: ' + countries.indexOf("ZW"));

var inventory = [
                 {
                	    "name": "Afghanistan",
                	    "alpha2": "AF",
                	    "countrycode": "004"
                	  },
                	  {
                	    "name": "Zimbabwe",
                	    "alpha2": "ZW",
                	    "countrycode": "716"
                	  },
                	  {
                	    "name": "Zambia",
                	    "alpha2": "ZM",
                	    "countrycode": "894"
                	  }
                	]

function findCherries(fruit) {
	return fruit.alpha2 === 'ZW';
}
console.log(inventory.find(findCherries)); // { name: 'cherries', quantity: 5 }



function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

//New connection handling
requestRegister = [ ];

function notify() {
	var number = Math.round(Math.random() * 0x64);
	for(c in requestRegister) 
		requestRegister[c].send(number.toString());
	    //console.log((new Date()) + ' Server Send: ' + number.toString());
	    setTimeout(notify, 1000);
}
notify();
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    requestRegister.push(connection);

    connection.on('close', function(reasonCode, description) {
    	requestRegister = [ ];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});