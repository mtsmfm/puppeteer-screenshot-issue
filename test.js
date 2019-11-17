const HTML2Image = require('./Html2Image');
const fs = require('fs');
const path = require('path');
const testHtml = fs.readFileSync(path.join(__dirname, 'test.html')).toString();
const crypto = require('crypto');

async function main() {
  await HTML2Image.init();

  for (let i = 0; i < 1000; i++) {
    let {
      renderContent: buffer,
    } = await render(testHtml);

    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    const digest = hash.digest('hex');

    const imagePath = path.join(__dirname, 'images', `${i}.png`);
    fs.writeFileSync(imagePath, buffer);

    if (digest !== 'a6be77db6379bb863f9c80c5bd76581f589d4accc757943ac1a375adb3019793') {
      throw imagePath;
    } else {
      console.log(`${i} OK`);
    }
  }
}

function render(content) {
  let html2Image = new HTML2Image();
  let viewport = {
    width: 576,
    height: 10,
    deviceScaleFactor: 1
  };
  return html2Image.render({ content, viewport });
}

main().then(() => process.exit(),
  (e) => {
    console.error(e);
    process.exit(1);
  });
