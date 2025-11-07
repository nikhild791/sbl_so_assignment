import { scrape, shutdown } from "./index.js";


(async () => {
  const data = await scrape("https://nikhil-dubey.xyz");
  console.log("The data is",data)



  await shutdown(); // close browser when done
})();
