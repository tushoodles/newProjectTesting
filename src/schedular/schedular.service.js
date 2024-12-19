const cron = require("node-cron");
const { HTTPException } = require("../error/errorHTTPException");
const errorCodes = require("../error/error.Types");
const movie = require("../models/jaunre");
const Blog = require("../models/blog");


let val = true;
async function UpdateDateBase() {
  try {
   
    if (val) {
      val = false;
      const response = await fetch("https://dummyapi.online/api/blogposts");
      console.log("khkjgc", await response.json())
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const json = await response.json();
      await Blog.create(json);
    }
  } catch (error) {
    throw error;
  }
}

function CronJobTaks() {
  cron.schedule("* */2 * * * *", async () => {
    console.log("CronjobTaks running every 2 minutes");
    try {
      await UpdateDateBase();
    } catch (error) {
      console.error("Error updating database:", error);
    }
  });
}

module.exports = { CronJobTaks };
