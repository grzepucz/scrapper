module.exports = [
  {
    method: 'get',
    path: '/test',
    handler: (req, res, next) => res.status(200).json({ hello: 'world' }),
  },
];
