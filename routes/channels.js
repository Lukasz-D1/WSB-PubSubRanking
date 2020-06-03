const express = require('express');
const redis = require('redis');

const router = express.Router();
const client = redis.createClient();

router.get('/', function(req, res) {
  client.pubsub("channels", function(err, reply) {
    message = {
      "channels": [],
      "channels_count": 0
    }
    reply.forEach(channel => {
      message["channels"].push(channel);
      message["channels_count"]++;
    });
    res.json(message);
  });
});

router.get('/subcount', function(req, res) {
  let channelName = req.query["name"];
  client.pubsub("numsub", channelName, function(err, reply) {
    res.json({
      "channel": channelName,
      "subcount": reply[1]  
    });
  });
});

router.post('/publish', function(req, res) {
  let channelName = req.body["channel"];
  let publishMessage = JSON.stringify(req.body["publish_message"]);
  client.publish(channelName, publishMessage);
  res.send("OK");
});

module.exports = router;
