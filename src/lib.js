const puppeteer = require('puppeteer');

const emailInputFieldXpath = '//*[@id="mailbox:login-input"]';
const mailboxSubmitButtonXpath = '//*[@id="mailbox:submit-button"]'; // push 2 times
const passwordInputFieldXpath = '//*[@id="mailbox:password-input"]';
const accountLoadedXpath =
  '//*[@id="app-canvas"]/div/div[1]/div[1]/div/div[2]/div[2]/div/div/div[1]/div/div/div[1]/div/div/div';
const accountContextMenuXpath = '//*[@id="PH_user-email"]';
const accountSecurityMenuXpath = '//*[@id="PH_passwordAndSecurity"]/span[1]';
const changePasswordButtonXpath = '//*[@id="root"]/div/div[3]/div/a[4]/div[2]/div[1]/div[2]/button';
const currentPasswordInputXpath = '/html/body/div[2]/div[2]/div/div/div[2]/form/div[5]/div[2]/div/div/input';
const newPasswordInputXpath = '/html/body/div[2]/div[2]/div/div/div[2]/form/div[8]/div[2]/div[1]/div/div/div/input';
const repeatNewPasswordInputXpath = '/html/body/div[2]/div[2]/div/div/div[2]/form/div[12]/div[2]/div/div/input';
const changePasswordButtonFinallyXpath = '/html/body/div[2]/div[2]/div/div/div[2]/form/button[1]';

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function changePassword(email, password, newPassword, debugLogger = (str) => {}) {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

    await page.goto('https://mail.ru');
    debugLogger('navigate mail.ru ok');

    // login
    const emailInputField = await page.$x(emailInputFieldXpath).then((_) => _[0]);
    await emailInputField.click();
    await emailInputField.type(email, { delay: 125 });
    debugLogger('email enter ok');
    const mailboxSubmitButton = await page.$x(mailboxSubmitButtonXpath).then((_) => _[0]);
    await mailboxSubmitButton.click();
    await delay(1100);
    const passwordInputField = await page.$x(passwordInputFieldXpath).then((_) => _[0]);
    await passwordInputField.type(password, { delay: 67 });
    debugLogger('password enter ok');
    await mailboxSubmitButton.click();

    // click account context menu
    try {
      await page.waitForXPath(accountLoadedXpath);
    } catch {
      throw new Error('unable to login');
    }
    debugLogger('login ok');
    const accountContextMenu = await page.$x(accountContextMenuXpath).then((_) => _[0]);
    await accountContextMenu.click({ delay: 10 });
    await page.waitForXPath(accountSecurityMenuXpath);
    const accountSecurityMenu = await page.$x(accountSecurityMenuXpath).then((_) => _[0]);
    await accountSecurityMenu.click({ delay: 260 });

    // change password
    await page.waitForXPath(changePasswordButtonXpath);
    debugLogger('open change password menu ok');
    const changePasswordButton = await page.$x(changePasswordButtonXpath).then((_) => _[0]);
    await changePasswordButton.click({ delay: 1200 });
    await page.waitForXPath(currentPasswordInputXpath);
    const currentPasswordInput = await page.$x(currentPasswordInputXpath).then((_) => _[0]);
    await currentPasswordInput.type(password, { delay: 90 });
    debugLogger('enter current password ok');
    const newPasswordInput = await page.$x(newPasswordInputXpath).then((_) => _[0]);
    await newPasswordInput.type(newPassword, { delay: 183 });
    debugLogger('enter new password ok');
    const repeatNewPasswordInput = await page.$x(repeatNewPasswordInputXpath).then((_) => _[0]);
    await repeatNewPasswordInput.click({ delay: 400 });
    await repeatNewPasswordInput.type(newPassword, { delay: 183 });
    debugLogger('repeat password ok');
    const changePasswordButtonFinally = await page.$x(changePasswordButtonFinallyXpath).then((_) => _[0]);
    await changePasswordButtonFinally.click({ delay: 100 });
    debugLogger('password change ok');
    await delay(2000);
  } catch (err) {
    throw err;
  } finally {
    await browser.close();
  }
}

module.exports.changePassword = changePassword;
