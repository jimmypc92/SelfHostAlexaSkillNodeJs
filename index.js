var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var https = require('https');

var options = {
    pfx: fs.readFileSync('/certs/cert.pfx'),
    passphrase: 'password'
};

//
// Initialize the Alexa SDK
var Alexa = require('alexa-sdk');

app.use(bodyParser.json());

app.post('/', function(req, res) {

    //
    // Build the context manually, because Amazon Lambda is missing
    console.log("Request received");
    console.dir(req);

    var context = {

        succeed: function (result) {

            console.log(result);

            res.json(result);
        },
        fail: function (error) {

            console.log(error);
        }
    };

    //
    // Delegate the request to the Alexa SDK and the declared intent-handlers
    var alexa = Alexa.handler(req.body, context);

    alexa.registerHandlers(handlers);

    alexa.execute();
});

var handlers = {
    'LaunchRequest': function() {

        this.emit('HelloWorldIntent');
    },
    'HelloWorldIntent': function() {

        var message = "Hello from node JS";

        this.response.speak(message);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function() {

        console.log('session ended!');
        this.attributes['endedSessionCount'] += 1;
    }
};

var listener = https.createServer(options, app).listen(443, function () {

    console.log('Express HTTPS server listening on port ' + listener.address().port);
});