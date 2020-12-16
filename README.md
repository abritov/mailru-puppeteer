# Basic usage

```js
const { changePassword } = require('mailru-puppeteer');

const email = 'yourmail@mail.ru';
const password = '123456';
const newPassword = '654321';

async function main() {
    await changePassword(email, password, newPassword, console.debug);
}

main()
    .then(() => console.debug('ok'))
    .catch(err => console.error(err.message || err));
```

Changelog

- `1.1.0` take that mailru