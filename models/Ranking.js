const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

class Ranking {
    constructor(channelName = "recipe_ranking") {
        this.channelName = channelName;
        this.subscriber = redis.createClient();
        this.subscriber.subscribe(this.channelName);
        this.ranker = redis.createClient();
        this.subscriber.on("message", (channel, message) => {
            console.log(`${channel} ${message}`);
            if (channel == "recipe_ranking") {
                let msgObj = JSON.parse(message);
                if (msgObj["remove"]) {
                    this.deleteFromRanking(msgObj);
                    
                } else {
                    this.saveToRanking(msgObj);
                }
            }
        });
    }

    saveToRanking(message) {
        let recipeId = message["id_recipe"];
        if (message["decr"]) {
            this.ranker.zincrby(this.channelName, -1, recipeId);
        } else {
            this.ranker.zadd(this.channelName, "INCR", 1, recipeId);
        }
    }

    deleteFromRanking(message) {
        let recipeId = message["id_recipe"];
        this.ranker.zrem(this.channelName, recipeId);
    }
    
    async getRecipeRanking(id) {
        let score = await this.ranker.zscoreAsync(this.channelName, id);
        let rank = await this.ranker.zrevrankAsync(this.channelName, id);
        return {
            "score": score,
            "rank": rank+1
        };
    }

    async getRanking(n = -1) {
        if (n != -1) {
            n--;
        }
        let result = await this.ranker.zrangeAsync(this.channelName, 0, n, "WITHSCORES");
        return result;
    }    
}

module.exports.Ranking = Ranking;