var mqtt = require('mqtt');
var config  = require('./config.json');
var extend  = require('deep-extend');

config = extend({
    host: 'localhost',
    username: '',
    password: '',
    clientId: 'rest-mqtt', 
    port: 1883, 
    keepalive : 60,
    reconnectPeriod: 600
},config);

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);

var client = mqtt.connect(config);
client.on('connect', function(){
    console.log("Connecting MQTT");
});

function exitHandler() {
    console.error("exit MQTT"); 
    client.end();
    process.exit();
}

client.on('reconnect', function(err){
    console.log("Reconnect MQTT"); 
    if (err) {mqtt_error(err);} 
    client = mqtt.connect(config);
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








