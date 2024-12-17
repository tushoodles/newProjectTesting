const Redis = require('ioredis');
const logger = require('log4js').getLogger('redis_service');
const { REDIS_HOST, REDIS_PORT } = require('../../config/env');

class RedisClient {
    constructor() {
        this.client = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT, // Corrected property name
        });
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.client.on('ready', () => {
            logger.info('Redis is Ready');
        });

        this.client.on('connect', () => {
            logger.info('Redis Connection Established');
        });

        this.client.on('error', (error) => {
            logger.error('Redis Error Occurred:', error);
        });

        this.client.on('end', () => {
            logger.error('Redis Connection Ended');
        });
    }

    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance; // Return the instance of RedisClient
    }

    getClient() {
        return this.client; // Return the Redis client instance
    }
}

module.exports = RedisClient.getInstance(); // Export the singleton instance
