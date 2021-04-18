const fetch = require('node-fetch');
const Raven = require('raven');

class WebClient {
  getPage(url) {
    return fetch(url)
      .then((resp) => resp.text())
      .catch((error) => Raven.captureException(error));
  }

  getAll(pages) {
    // const stream = new ReadableStream();
    return new Promise((resolve) => {
      pages.forEach((url) => this.getPage(url).then((response) => {
        console.log(response);
      }));
    });
  }
}

module.exports = WebClient;
