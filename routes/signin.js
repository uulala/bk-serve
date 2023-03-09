const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  const { name, password } = req.body

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    return res.send({ code: 0, msg: e.message })
  }

  UserModel.getUserByName(name)
    .then(function (user) {
      
      if (!user) {
        return res.send({ code: 0, msg: '用户不存在' })
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        return res.send({ code: 0, msg: '用户名或密码错误' })
      }
      // 用户信息写入 session
      delete user.password
      req.session.user = user
      // 跳转到主页
      // res.redirect('/posts')
      res.send({ code: 1, msg: '登录成功' })
    })
    .catch(next)
})

module.exports = router