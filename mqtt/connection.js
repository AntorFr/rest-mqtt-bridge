var mqtt = require('mqtt');
var config  = require('./config.json');
var package  = require('../package.json');
var extend  = require('deep-extend');
const process = require('process');
const os = require('os');

config = extend({
    host: 'localhost',
    username: '',
    password: '',
    clientId: 'rest-mqtt', 
    port: 1883, 
    keepalive : 60,
    reconnectPeriod: 600,
    clean:true,
    will: {
        topic: "home/log/state/rest-mqtt",
        payload: 'lost',
        qos: 1,
        retain:true
    }
},config);

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);

var client = mqtt.connect(config);
client.on('connect', function(){
    console.log("Connected to MQTT");
    client.publish(config.will.topic, "connected",{retain:true,qos:1});
    advertise();

    client.subscribe(["home/log/advertise/set","home/log/advertise/"+config.clientId+"/set" ],{qos:1})
});


function exitHandler() {
    console.error("exit MQTT"); 
    client.publish(config.will.topic, "disconnected",{retain:true,qos:1});
    client.end();
    process.exit();
}

function advertise() {
    var data = {
        name:os.hostname(),
        id: config.clientId,
        stats:{
            uptime: os.uptime(),
            freeMem: os.freemem()
        },
        fw:{
            name:package.name,
            version: package.version
        },
        implementation:{
            device: "nodejs",
            version: process.version
        }
    }
    client.publish("home/log/advertise/"+config.clientId, JSON.stringify(data),{retain:true,qos:1});
}

client.on('message', function (topic, message) {
    if(topic.includes("advertise")){
        advertise();
    }
  })

client.on('reconnect', function(err){
    console.log("Reconnect MQTT"); 
    if (err) {mqtt_error(err);} 
});
    
client.on('error', mqtt_error);
client.on('close', mqtt_error);

function mqtt_error(err) {
    if (err)
        return console.error('MQTT Error: %s', err.toString());
}

module.exports = {
  send: function(topic,message,retain=false) {
    var options={retain:retain,qos:1};
    client.publish(topic, message,options);
  }
};








