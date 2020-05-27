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
            this.saveToRanking(JSON.parse(message));
        });
    }

    saveToRanking(message) {
        let recipeId = message["id_recipe"];
        this.ranker.zadd(this.channelName, "INCR", 1, recipeId, console.log);
    }
       
    async getRanking(n) {
        let result = await this.ranker.zrangeAsync(this.channelName, 0, n, "WITHSCORES");
        return result;
    }

    deleteFromRanking(recipeId) {
        this.ranker.zrem(this.channelName, recipeId);
    }
    
}

module.exports.Ranking = Ranking;