const puppeteer = require('puppeteer');
const fs = require('fs');
let globalBrowser = null;
async function getBrowser() {
  if (globalBrowser) {
    return globalBrowser;
  }
  let chromiumBrowser = '/usr/bin/chromium-browser';
  let options = {
    args: ['--disable-gpu', '--single-process', '--disable-dev-shm-usage', '--no-sandbox']
  };
  if (fs.existsSync(chromiumBrowser)) {
    globalBrowser = await puppeteer.launch(
      Object.assign({}, options, { executablePath: chromiumBrowser }));
  }
  if (!globalBrowser) {
    globalBrowser = await puppeteer.launch(options);
  }
  return globalBrowser;
}

class Html2Image {
  static init() {
    return getBrowser();
  }
  async render({ content, viewport }) {
    let browser = await getBrowser();
    let page = await browser.newPage();
    try {
      page.setViewport(viewport);
      await page.bringToFront();
      await Promise.all([new Promise((resolve) => {
        page.once('load', () => {
          //console.log('onload');
          resolve();
        });
      }), page.setContent(content).then(() => {
        //console.log('setcontent');
        return Promise.resolve();
      })]);
      await page.bringToFront();
      let options = {
        fullPage: true
      }
      let buffer = await Promise.race([
        page.screenshot(options),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('convertToImage Timeout'));
          }, 2000);
        })]);
      return {
        renderContent: buffer,
        format: "png"
      };
    }
    catch (e) {
      this.logger.error('Html2Image convert fail', e);
      throw e
    }
    finally {
      await page.close();
    }
  }
}
module.exports = Html2Image;
