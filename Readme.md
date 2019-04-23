# axios-with-dns

Allows you to query axios with a different DNS server.

## Usage

Allows you to pass in a "dnsServer" object into the axios config. It will run URLs against that dns server. You do this by passing an axios instance into the export function. This obviously requires Axios as a peer dependency. This is done by adding an interceptor to Axios.

This works in node and the browser

```
const withDNS = require('axios-with-dns');
const axios = require('axios');

withDNS(axios);

(async () => {
  console.log(
    (await axios.get('https://www.google.com', { dnsServer: '8.8.8.8' })).config
      .url
  );
})();
```

## Why?

I was working in a hybrid cloud on AWS and was annoyed by Route53's pricing model, so I created this package to allow for my application to run some queries against an internal DNS server.

## Credits

[This issue in the Axios repo](https://github.com/axios/axios/issues/94)
