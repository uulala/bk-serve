module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.user) {
      return res.send(401)
    }
    next()
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      return res.send({
        code: 2,
        data: '已登录'
      })
    }
    next()
  }
}