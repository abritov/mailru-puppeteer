const { changePassword } = require('../src/lib');

const email = 'yourmail@mail.ru';
const password = '123456';
const newPassword = '654321';

(async () => {
  await changePassword(email, password, newPassword, console.debug);
})();