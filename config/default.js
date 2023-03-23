module.exports = {
  port: 80,
  session: {
    secret: 'bbk',
    key: 'bbk',
    maxAge: 2592000000
  },
  baseUrl: 'http://127.0.0.1',
  mongodb: 'mongodb://localhost:27017/bk',
}