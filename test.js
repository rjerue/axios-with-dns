const withDNS = require('.');
const axios = require('axios');

withDNS(axios);

(async () => {
  console.log(
    (await axios.get('https://www.google.com', { dnsServer: '8.8.8.8' })).config
      .url
  );
})();
