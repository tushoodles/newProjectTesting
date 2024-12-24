require('dotenv').config();

module.exports = {
    PORT:process.env.PORT,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PORT:process.env.REDIS_PORT,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    MONGO_URL:process.env.MONGO_URL,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_AUTH:process.env.EMAIL_AUTH,
    
}