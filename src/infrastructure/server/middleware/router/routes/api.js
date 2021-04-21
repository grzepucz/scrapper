const SurferJob = require('@application/surfer/SurferJob');
const { URL } = require('url');

const isUrlValid = (url) => {
  try {
    return new URL(url);
  } catch (error) {
    return false;
  }
};

module.exports = [
  {
    method: 'get',
    path: '/run',
    handler: (req, res, next) => {
      const { url } = req.query;

      new SurferJob(isUrlValid(url) && url)
        .run()
        .then((payload) => {
          res.status(200).send(payload);
        });
    },
  },
  // {
  //   method: 'get',
  //   path: '/read',
  //   handler: (req, res, next) => {
  //     const { path } = req.query;
  //
  //     return path && new Promise((resolve) => resolve(new HadoopClient().readFile(path)))
  //       .then((payload) => {
  //         res.status(200).send(payload);
  //       });
  //   },
  // },
];
