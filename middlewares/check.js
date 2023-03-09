module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.user) {
      return res.send({
        code: 0,
        data: '未登录'
      })
    }
    next()
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      return res.send({
        code: 1,
        data: '已登录'
      })
    }
    next()
  }
}