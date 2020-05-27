const express = require('express');
const redis = require('redis');
const { Ranking } = require('../models/Ranking');
const ranking = new Ranking();

const router = express.Router();
const client = redis.createClient();

router.post('/entry', function(req, res) {
  let message = JSON.stringify(req.body);
  client.publish("recipe_ranking", message);
  res.send("OK");
});

router.delete('/entry', function(req, res) {
  let recipeId = req.query.recipeId;
  ranking.deleteFromRanking(recipeId);
  res.send("OK");
});

router.get('/entries', async function(req, res) {
  let numOfEntries = req.query.entries;
  let result = await ranking.getRanking(numOfEntries);
  let response = {
    "results": []
  }
  for (let i = 0; i < result.length; i+=2) {
    let temp = {}
    temp["recipeId"] = result[i];
    temp["score"] = result[i+1];
    response["results"].push(temp);
  }
  console.log(response);
  res.json(response);
});


module.exports = router;
