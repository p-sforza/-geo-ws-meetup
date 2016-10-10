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
var countries = fs.readFileSync("countries.json");
var jCountries = JSON.parse(countries)
function findCountry(jCountries) { 
    return jCountries.alpha2 === currenCountryAlpha2;
}
function findCountryCode(jCountries) { 
	var currenCountryCode=jCountries.find(findCountry).countrycode;
	return currenCountryCode;
};

//console.log((new Date()) + ' Countries file loaded');
//console.log((new Date()) + ' Find Res.: ' + util.inspect(jCountries.find(findCountry), false, null));
var currenCountryAlpha2="AF";
var currenCountryCode=findCountryCode(jCountries);
console.log((new Date()) + ' Country code for ' + currenCountryAlpha2 + ' is: ' + currenCountryCode);

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

//New connection handling
requestRegister = [ ];

function notifyRand() {
	var number = Math.round(Math.random() * 0x64);
	//var number = Math.round(Math.random() * jCountries.length);
	for(c in requestRegister) 
		requestRegister[c].send(number.toString());
	    //console.log((new Date()) + ' Server Send: ' + number.toString());
	    setTimeout(notifyRand, 1000);
}
notifyRand();
 
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

//Web Socket Client to meetup API
  var api_url = "ws://stream.meetup.com:80/2/rsvps/";
  var socket;

  // Create a new connection when the Connect button is clicked
  open.addEventListener("click", function(event) {
    open.disabled = true;
    socket = new WebSocket(api_url, "echo-protocol");

    socket.addEventListener("open", function(event) {
      close.disabled = false;
      send.disabled = false;
      console.log("Connected");
    });

    // Display messages received from the server
    socket.addEventListener("message", function(event) {
      console.log("Server Says: " + event.data);
      transition(event.data);
    });

    // Display any errors that occur
    socket.addEventListener("error", function(event) {
    console.log("Error: " + event)
    });

    socket.addEventListener("close", function(event) {
      open.disabled = false;
      console.log("Not Connected");
    });
  });
  
  
  // Close the connection when the Disconnect button is clicked
  //close.addEventListener("click", function(event) {
  //  close.disabled = true;
  //  send.disabled = true;
  //  message.textContent = "";
  //  socket.close();
  //});




