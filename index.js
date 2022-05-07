const puppeteer = require('puppeteer');

const searchInput = 'nadaswaram tamil songs in tamil movie -youtube';
const ExpResultCount = 50;
let results = [];

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // default is true
    const page = await browser.newPage();
    const searchIpParsed = searchInput.split(' ').join('+');

    await page.goto(`https://www.google.com/search?q=${searchIpParsed}`);

    console.log('waiting for results...');

    while (results.length < ExpResultCount) {

        await page.waitForSelector('input[aria-label="Search"]', { visible: true });
        const searchResults = await page.$$eval(".LC20lb", els =>
            els.map(e => ({ title: e.innerText, link: e.parentNode.href }))
        );

        if (searchResults?.length > 0) {
            results = [...results, ...searchResults];
        }

        console.log(`Received ${results.length}/${ExpResultCount} results`);

        await page.waitForSelector('a[id="pnnext"]', { visible: true });
        const NxtPage = await page.$('a#pnnext');
        await NxtPage.evaluate(NP => NP.click());
    }


    console.log('results received...');
    console.log(results);

    //   await browser.close();
})();