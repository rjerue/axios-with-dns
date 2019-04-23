const URL = require('url');
const isIp = require('is-ip');
const dns = require('native-dns');

// Wraps native-dns in a Promise
// we have this exposed in a separate module
function resolveARecord(hostname, dnsServer) {
  return new Promise((resolve, reject) => {
    const question = dns.Question({
      name: hostname,
      type: 'A',
    });
    const request = dns.Request({
      question,
      server: { address: dnsServer, port: 53, type: 'udp' },
      timeout: 1000,
    });
    request.on('timeout', function() {
      reject(new Error('Timeout in making request'));
    });
    request.on('message', function(err, response) {
      // Resolve using the first populated A record
      for (var i in response.answer) {
        if (response.answer[i].address) {
          resolve(response.answer[i]);
          break;
        }
      }
    });
    request.on('end', function() {
      reject(new Error('Unable to resolve hostname'));
    });
    request.send();
  });
}

module.exports = axios => {
  axios.interceptors.request.use(function(config) {
    const url = URL.parse(config.url);

    if (!config.dnsServer || isIp(url.hostname)) {
      // Skip
      return config;
    } else {
      return resolveARecord(url.hostname, config.dnsServer).then(function(
        response
      ) {
        config.headers = config.headers || {};
        config.headers.Host = url.hostname; // put original hostname in Host header

        url.hostname = response.address;
        delete url.host; // clear hostname cache
        config.url = URL.format(url);

        return config;
      });
    }
  });
  return axios;
};
