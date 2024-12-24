const cron = require("node-cron");
const { HTTPException } = require("../error/errorHTTPException");
const errorCodes = require("../error/error.Types");
const Blog = require("../models/blog");


let val = true;
async function UpdateDateBase() {
  try {
    if (val) {
      val = false;
      const response = await fetch("https://dummyapi.online/api/blogposts");
      
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      
      const json = await response.json(); // Call response.json() once
      console.log("Response JSON:", json); // Use the variable here
      await Blog.create(json);
    }
  } catch (error) {
    console.error("Error updating database:", error); // Log the error for debugging
    throw error;
  }
}

function CronJobTaks() {
  console.log("CronJobTaks")
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
