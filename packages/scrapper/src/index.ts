import { chromium,Browser } from "playwright";

let browser:Browser| null = null;

async function setupBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
}

export async function scrape(url:string) {
  await setupBrowser();
    if(browser===null){
        return;
    }
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const text = await page.$eval("body", el => el.innerText);


  await page.close(); 

  return text;
}

export async function shutdown() {
  if (browser) await browser.close();
}
