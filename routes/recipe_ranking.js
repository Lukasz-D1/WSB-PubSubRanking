const express = require('express');
const { Ranking } = require('../models/Ranking');
const ranking = new Ranking();

const router = express.Router();

router.get('/entry/:id', async function(req, res) {
  let recipeId = req.params.id;
  let result = await ranking.getRecipeRanking(recipeId);
  let obj = {
    "recipeId": recipeId,
    "score": result["score"],
    "rank": result["rank"]
  }
  res.json(obj);
})

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
  res.json(response);
});


module.exports = router;
