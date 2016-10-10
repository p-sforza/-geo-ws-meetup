var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require("fs");
const util = require('util');

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
//var countries = fs.readFileSync("countriesMinimal.json")
var currenCountryAlpha2="ZW";
var countries = fs.readFileSync("countriesMinimal.json");
var jCountries = JSON.parse(countries);
//console.log(util.inspect(jCountries, false, null));
function findCountryCode(jCountries) { 
    return jCountries.alpha2 === currenCountryAlpha2;
};
//console.log((new Date()) + ' Countries file loaded');
//console.log((new Date()) + ' Find Res.: ' + util.inspect(jCountries.find(findCountryCode), false, null));
var currenCountryAlpha2="ZW";
var currenCountry=jCountries.find(findCountryCode);
var currenCountryCode=jCountries.find(findCountryCode).countrycode;
console.log((new Date()) + ' Country code for ' + currenCountryAlpha2 + ' is: ' + currenCountryCode);



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