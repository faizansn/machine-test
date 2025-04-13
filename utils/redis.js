const redis = require('redis');
require('dotenv').config()

const log = (type, fn) => fn ? () => {
    console.log(`redis connection ${type}`);
} : console.log(`redis connection ${type}`);

// Option 1: One connection is enough per application
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
    //auth_pass : redisConn.PASSWORD,
    retry_strategy: (options) => {
        const { error, total_retry_time, attempt } = options;
        if (error && error.code === "ECONNREFUSED") {
            log(error.code); // take actions or throw exception
        }
        if (total_retry_time > 1000 * 5000) { //in ms i.e. 15 sec``
            log('Retry time exhausted'); // take actions or throw exception
            return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
            log('10 attempts done'); // take actions or throw exception
            return new Error("10 attempts done");
        }
        console.log("Attempting connection");
        // reconnect after
        return Math.min(3000); //in ms
        // return undefined;
    },
});

client.on('connect', log('connect', true));
client.on('ready', log('ready', true));
client.on('reconnecting', log('reconnecting', true));
client.on('error', log('error', true));
client.on('end', log('end', true));

module.exports = client;