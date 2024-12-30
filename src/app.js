const express = require("express");
const { PORT , MONGO_URL } = require("../config/env");
const logger = require("log4js").getLogger("app");
const routes = require("./routes/index.js");
const cors = require("cors");
const { errorMiddleware } = require("./middleware/error.Middleware.js");
const { CronJobTaks } =  require('./schedular/schedular.service.js');
const { webChatSocket } = require("./socket/socket.service.js");
const http = require('http');
const { default: mongoose } = require("mongoose");
const customRedisRateLimiter = require("./middleware/rate.middleware.js");


class App {
  
  constructor() {
    this.app = express();
    this.routes = routes;
    this.server = http.createServer(this.app);
    this.DatabaseConnection();
    this.initializemiddleware();
    this.initializeRoutes();
    this.initializeErrormiddleware();
    //this.initializeSchedular();
    this.initializeWebChatSocket();
  }

  start() {
    this.server.listen(PORT, () => {
      logger.info("Server is Running on Port", `${PORT}`);
    });
  }

  async DatabaseConnection(){
    await mongoose.connect(MONGO_URL).then(()=>{
      logger.info('DataBase Connected Successfully')
    }).
    catch((error)=>{
      logger.error(error);
    })  
  }

  async initializeSchedular(){
    await CronJobTaks();
  }

  initializeRoutes() {
    this.routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  initializeErrormiddleware() {
    this.app.use(errorMiddleware);
  }

  initializemiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(customRedisRateLimiter)
  }

  initializeWebChatSocket(){
    webChatSocket.initialize(this.server);
  }
}

module.exports = App;
