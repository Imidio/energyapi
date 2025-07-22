import cron from "cron";
import https from "https";

// Fallback if API_URL is not set
const API_URL = process.env.API_URL || "https://energyapi-5ts9.onrender.com";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ Cron: GET request sent successfully");
      } else {
        console.log("❌ Cron: GET request failed", res.statusCode);
      }
    })
    .on("error", (e) => console.error("❌ Cron: Error while sending request", e));
});

export default job;
