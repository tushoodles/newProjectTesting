const Redis = require('ioredis');
const logger = require('log4js').getLogger('redis_service');
const { REDIS_HOST, REDIS_PORT } = require('../../config/env');

class RedisClient {
    constructor() {
        this.client = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
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

    async set(key, value, ttl) {
        try {
            await this.client.set(key, value, 'EX', ttl);
            logger.info(`Key ${key} set successfully with TTL of ${ttl} seconds`);
        } catch (error) {
            logger.error(`Failed to set key ${key}:`, error);
            throw error;
        }
    }

    async get(key) {
        try {
            const value = await this.client.get(key);
            logger.info(`Key ${key} retrieved successfully`);
            return value;
        } catch (error) {
            logger.error(`Failed to get key ${key}:`, error);
            throw error;
        }
    }

    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    getClient() {
        return this.client;
    }
}

module.exports = RedisClient.getInstance();
