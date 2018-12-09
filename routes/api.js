var express = require('express');
var router = express.Router();

var mqtt = require('../mqtt/connection.js');

router.all('/send/*', function(req, res) {
  var message = req.body;
  var topic =  req.path.substring(req.path.indexOf("/send/")+6).replace(/\/$/, '');

  //if data has been send as key rather than value
  if  (Object.values(message)[0] == "")
    message = JSON.parse(Object.keys(message)[0]);
  
  //console.log({"topic":topic,"message":message});

  if (topic === undefined || message === undefined) {
    return res.json({
      error: true,
      message: 'You need to specify both parameters.'
    });
  } else {
    mqtt.send(topic,message);
     return res.json({
      error: false,
      message: 'Message successfully sent.'
    });
  }
});

module.exports = router;
