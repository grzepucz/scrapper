const WebClient = require('@infrastructure/client/WebClient');

const DEFAULT_PAGES = [
  'https://www.jbzd.com.pl/',
  'https://www.tvn.pl/',
];

class SurferJob {
  constructor(url) {
    this.pagesToSurf = url ? [url] : DEFAULT_PAGES;
    this.client = new WebClient();
  }

  run() {
    return this.client.getAll(this.pagesToSurf);
  }
}

module.exports = SurferJob;
