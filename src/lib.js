const puppeteer = require('puppeteer');

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function solveCaptcha(page, imageResolver) {}

async function changePassword(email, password, newPassword, debugLogger = (str) => {}) {
  const browser = await puppeteer.launch({
    timeout: 60000,
  });
  try {
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation();

    await page.goto('https://mail.ru/?from=m');

    await page.setViewport({ width: 1666, height: 942 });

    await page.waitForSelector('.page > .social:nth-child(5) > .social__link > .social__title-ct');
    await page.click('.page > .social:nth-child(5) > .social__link > .social__title-ct');

    await navigationPromise;

    await page.waitForSelector('body > #authform > p:nth-child(7) > .w80p');
    await page.type('body > #authform > p:nth-child(7) > .w80p', email, { delay: 89 });

    await page.waitForSelector('body > #authform > p:nth-child(10) > .w80p');
    await page.type('body > #authform > p:nth-child(10) > .w80p', password, { delay: 101 });

    await page.waitForSelector('body > #authform > .mb > input');
    await page.click('body > #authform > .mb > input');

    await navigationPromise;

    try {
      await page.waitForSelector('.js-form > .b-panel__content > .b-captcha > .b-captcha__code > .b-input', { timeout: 5000 });
      debugLogger('captcha solver is not implemented yet, exit');
      return;
      await page.click('.js-form > .b-panel__content > .b-captcha > .b-captcha__code > .b-input');

      await page.waitForSelector('.b-panel__footer > .b-controls > .b-control > .btn_main > .btn__text', { timeout: 5000 });
      await page.click('.b-panel__footer > .b-controls > .b-control > .btn_main > .btn__text');
      await navigationPromise;
    }
    catch {
      debugLogger('captcha is not found, good');
    }

    await page.waitForSelector('.toolbar > .toolbar__button-wrapper > .button > .button__inner > .button__icon');
    await page.click('.toolbar > .toolbar__button-wrapper > .button > .button__inner > .button__icon');

    await navigationPromise;

    await page.waitForSelector('#body > .folder-list > .folder-list__item:nth-child(12) > .folder-list__item__link');
    await page.click('#body > .folder-list > .folder-list__item:nth-child(12) > .folder-list__item__link');

    await navigationPromise;

    await page.waitForSelector('form #oldPswd');
    await page.type('form #oldPswd', password, { delay: 55 });

    await page.waitForSelector('form #Password');
    await page.type('form #Password', newPassword, { delay: 125 });

    await page.waitForSelector('form #Password_Verify');
    await page.type('form #Password_Verify', newPassword, { delay: 155 });

    await page.waitForSelector('form > .toolbar:nth-child(3) > .button-wrapper > .button > .button__inner');
    await page.click('form > .toolbar:nth-child(3) > .button-wrapper > .button > .button__inner');

    await navigationPromise;

  } catch (err) {
    throw err;
  } finally {
    await browser.close();
  }
}

module.exports.changePassword = changePassword;
