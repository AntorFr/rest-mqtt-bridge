var express = require('express');
var router = express.Router();

var mqtt = require('../mqtt/connection.js');

router.all('/send(_retain)?/*', function(req, res) {
  var message = req.body;
  var retain = false;
  var pathoffset = 0;

  if (req.path.includes("_retain")) {retain = true; pathoffset = 13;
  } else { pathoffset = 6;retain = false;}

  var topic =  req.path.substring(req.path.indexOf("/send")+pathoffset).replace(/\/$/, '');

  //if data has been send as key rather than value
  if  (Object.values(message)[0] === "")
    message = JSON.parse(Object.keys(message)[0]);
  
  //console.log({"topic":topic,"message":message});

  if (topic === undefined || message === undefined) {
    return res.json({
      error: true,
      message: 'You need to specify both parameters.'
    });
  } else {
    var payload = JSON.stringify(message);
    if (payload == "{}")
        payload = "";
    mqtt.send(topic,payload,retain);
     return res.json({
      error: false,
      message: 'Message successfully sent.',
      topic: topic,
      payload:payload,
      retain:retain
    });
  }
});

module.exports = router;
